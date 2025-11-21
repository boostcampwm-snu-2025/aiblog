class ApiError extends Error {
  constructor(message, { status = 0, code = 'NETWORK', payload = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;    
    this.code = code;       
    this.payload = payload;  
  }
}

function statusToMessage(status) {
  switch (status) {
    case 400: return '잘못된 요청입니다 (400).';
    case 401: return '인증 정보가 없거나 유효하지 않습니다 (401).';
    case 403: return '접근 권한이 없습니다 (403).';
    case 404: return '리소스를 찾을 수 없습니다 (404).';
    case 409: return '요청 충돌이 발생했습니다 (409).';
    case 422: return '요청 형식이 올바르지 않습니다 (422).';
    case 429: return '요청이 너무 많습니다. 잠시 후 다시 시도하세요 (429).';
    case 500: return '서버 내부 오류입니다 (500).';
    case 502: return '게이트웨이 오류입니다 (502).';
    case 503: return '서비스가 일시적으로 불가합니다 (503).';
    case 504: return '게이트웨이 타임아웃입니다 (504).';
    default:  return `요청 실패 (HTTP ${status}).`;
  }
}

async function safeJson(resp) {
  try { return await resp.json(); }
  catch { return null; }
}

/**
 * 공통 API 호출
 * - timeoutMs: 요청 타임아웃(ms)
 * - retries: 재시도 횟수 (GET 계열에만 권장)
 * - retryOn: 재시도할 상태코드 목록
 */
async function apiFetch(path, {
  method = 'GET',
  headers = {},
  body = undefined,
  timeoutMs = 10000,
  retries = 1,
  retryOn = [429, 502, 503, 504],
} = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(path, { method, headers, body, signal: controller.signal });
    const data = await safeJson(resp);

    if (!resp.ok) {
      const serverMsg = data?.error || data?.message;
      const msg = serverMsg || statusToMessage(resp.status);
      const code = `HTTP_${resp.status}`;
      // 재시도 대상이면 1회 이상 재시도
      if (retries > 0 && retryOn.includes(resp.status)) {
        return apiFetch(path, { method, headers, body, timeoutMs, retries: retries - 1, retryOn });
      }
      throw new ApiError(msg, { status: resp.status, code, payload: data });
    }

    return data ?? {};
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError('요청 시간이 초과되었습니다.', { code: 'TIMEOUT' });
    }
    if (err instanceof ApiError) throw err;
    // 네트워크 레벨 에러
    throw new ApiError('네트워크 오류가 발생했습니다.', { code: 'NETWORK' });
  } finally {
    clearTimeout(t);
  }
}


// GitHub Commits
export async function getCommits(repo) {
  return apiFetch(`/api/github/commits?repo=${encodeURIComponent(repo)}`, {
    method: 'GET',
    // GET은 재시도 2회 정도 허용(멱등)
    retries: 2,
  });
}

// GitHub PRs
export async function getPRs(repo) {
  return apiFetch(`/api/github/pulls?repo=${encodeURIComponent(repo)}`, {
    method: 'GET',
    retries: 2,
  });
}

// LLM: Commit 요약
export async function summarizeCommit(commit) {
  return apiFetch(`/api/github/summarize/commit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commit }),
    // POST는 기본 재시도 안 함(멱등X). 필요 시 retries:1 고려
  });
}

// LLM: PR 요약
export async function summarizePR(pr) {
  return apiFetch(`/api/github/summarize/pr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pr }),
  });
}

// Posts
export async function savePost(payload) {
  return apiFetch(`/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
export async function listPosts() {
  return apiFetch(`/api/posts`, { method: 'GET' });
}
export async function deletePost(id) {
  return apiFetch(`/api/posts/${id}`, { method: 'DELETE' });
}

// 필요 시 컴포넌트에서 ApiError 타입 판별 가능
export { ApiError };

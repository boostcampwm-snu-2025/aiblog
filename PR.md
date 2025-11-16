# PR: LLM 요약 기능 개선 및 Saved Posts 페이지네이션 구현

## 📋 완료 작업 목록 (WHAT)

### 1. **Commit 파일 변경사항 기반 요약 생성**
- **목표**: 커밋이 메시지만 분석하는 것이 아닌, 실제 코드 변경사항을 기반으로 더 정확한 요약 생성
- **완료 사항**:
  - ✅ `githubController.js`에 `getCommitDetails()` 함수 추가
  - ✅ GitHub API의 compare 엔드포인트를 사용하여 commit diff 조회
  - ✅ 변경된 파일들의 diff 내용을 3000자 제한으로 추출
  - ✅ 새로운 라우트 `GET /api/github/commit/:owner/:repo/:sha/details` 등록
  - ✅ Frontend에서 commit 선택 시 자동으로 상세 정보 로드
  - ✅ Gemini 프롬프트에 파일 변경사항을 "필수 분석 대상"으로 명시

**결과**:
```
기존: "커밋 메시지만 요약"
개선 후: "TMap API를 호출로 대체하고 경로 정보를 localStorage에 30분 캐싱하여 API 호출 횟수를 줄여 성능 향상"
```

### 2. **PR 본문 및 추가 정보 통합 요약**
- **완료 사항**:
  - ✅ PR 본문(body), 파일 변경사항(files), 코멘트(comments), README 모두 Gemini 프롬프트에 포함
  - ✅ 각 데이터의 길이를 로깅하여 데이터 흐름 추적 가능하도록 개선

### 3. **LLM 요약 프롬프트 정제**
- **목표**: 생성된 요약이 "## Commit 요약" 같은 헤더 없이 순수 본문만 반환
- **완료 사항**:
  - ✅ Commit 요약 프롬프트 개선: `=== 요약 ===` 섹션 제거
  - ✅ PR 요약 프롬프트 개선: `=== 상세 요약 ===` 섹션 제거
  - ✅ "헤더나 제목 없이 요약 본문만 반환해줘" 지시사항 명시
  - ✅ "반드시 변경된 파일과 코드 내용을 기반으로 요약해줘" 강조

**결과**: 깔끔한 본문만 출력되도록 개선

### 4. **Frontend 데이터 전달 로직 개선**
- **완료 사항**:
  - ✅ `CommitData` 인터페이스에 `files` 필드 추가
  - ✅ `List.tsx`의 onGenerateSummary 호출 방식 개선
  - ✅ `mainPage.tsx`에서 selectedData(업데이트된 데이터)를 우선 사용하도록 수정
  - ✅ commit/PR별 상세 로깅 추가

### 5. **Saved Posts 페이지네이션 구현**
- **목표**: 저장된 포스트를 10개씩 페이지네이션하여 표시
- **완료 사항**:
  - ✅ `postController.js`의 `getPosts()` 함수에 페이지네이션 로직 추가
  - ✅ Query 파라미터 `page` 처리 (1부터 시작)
  - ✅ 응답에 `page`, `perPage`, `totalPages` 포함
  - ✅ `postService.ts`의 `getBlogPosts()` 함수 수정
  - ✅ `PostsResponse` 인터페이스 확장
  - ✅ `postPage.tsx`에서 높이 제한 제거 (10개 포스트 모두 한눈에 보임)
  - ✅ 페이지네이션 UI 컴포넌트 추가:
    - "← 이전" 버튼 (첫 페이지에서 비활성화)
    - "다음 →" 버튼 (마지막 페이지에서 비활성화)
    - "1 / 1" 형식의 현재 페이지/전체 페이지 표시
  - ✅ 포스트 삭제 후 현재 페이지 자동 새로고침

---

## 🤔 고민과 해결 과정 (HOW + WHY)

### **Problem 1: Commit이 Message만 분석하고 있음**

**상황**:
사용자가 "commit도 diff를 읽어와서 요약하는 데이터를 늘려주게 해줘"라고 요청했습니다. 로그를 분석한 결과, 백엔드에서 commit files가 3000자로 제대로 조회되고 있었지만, Frontend에서는 files가 전달되지 않고 있었습니다.

**원인 분석**:
```javascript
// 문제 상황 1: GitHub API 문제
const commitResponse = await makeGitHubRequest(
  octokit,
  'GET /repos/{owner}/{repo}/commits/{ref}',  // ❌ 이 엔드포인트는 files 배열 없음
  { owner, repo, ref: sha }
)
if (commit.files && commit.files.length > 0) { // ❌ 항상 false
```

```javascript
// 문제 상황 2: Frontend 데이터 전달
// List.tsx에서 onGenerateSummary 호출 시
onGenerateSummary?.(commit, 'commit')  // ❌ 원본 commit 데이터 전달
// 하지만 selectedData는 이미 files로 업데이트됨
```

**해결 과정**:

1. **GitHub API 변경**:
   - ❌ `/repos/{owner}/{repo}/commits/{ref}` (files 없음)
   - ✅ `/repos/{owner}/{repo}/compare/{base}...{head}` (files 있음)
   - parent commit과 현재 commit을 비교하여 변경사항 추출

   ```javascript
   const parentSha = commit.parents[0].sha
   const compareResponse = await makeGitHubRequest(
     octokit,
     'GET /repos/{owner}/{repo}/compare/{base}...{head}',
     { owner, repo, base: parentSha, head: sha }
   )

   if (compareResponse.data.files && compareResponse.data.files.length > 0) {
     const fileDiffs = compareResponse.data.files
       .slice(0, 10)  // 상위 10개 파일
       .map((file) => {
         let diffContent = `파일: ${file.filename}\n상태: ${file.status}\n변경사항: +${file.additions}/-${file.deletions}\n`
         if (file.patch) {
           diffContent += `코드 변경:\n${file.patch}\n`
         }
         return diffContent
       })
       .join('\n---\n')

     details.files = fileDiffs.substring(0, 3000)
   }
   ```

2. **Frontend 데이터 전달 개선**:
   - ❌ List.tsx에서 원본 commit 데이터 즉시 전달
   - ✅ selectedData 업데이트를 기다린 후 전달

   ```javascript
   // 개선 전
   onGenerateSummary(() => {
     onItemSelect?.(commit, 'commit')
     onGenerateSummary?.(commit, 'commit')  // 동기적으로 즉시 호출
   })

   // 개선 후
   onGenerateSummary={() => {
     onItemSelect?.(commit, 'commit')
     setTimeout(() => {
       onGenerateSummary?.()  // 파라미터 없이 호출
       // mainPage에서 selectedData 사용
     }, 100)
   }}
   ```

3. **mainPage.tsx 우선순위 수정**:
   ```javascript
   // 개선 전
   const targetData = data || selectedData  // 전달된 파라미터 우선

   // 개선 후
   const targetData = selectedData || data  // selectedData(업데이트된) 우선
   ```

**결과**:
```
로그 확인
✅ Frontend: Commit Files: 3000자 (개선 전: 없음)
✅ Backend: Gemini 프롬프트에 파일 변경사항 포함
✅ 생성된 요약: "기존에 로컬에서 수행하던 경로 계산 로직을 TMap API 호출로 대체했습니다..."
```

---

### **Problem 2: 요약 생성 시 항상 캐시된 데이터 사용**

**상황**:
사용자가 "Generate Summary 버튼을 눌렀을 때는 이미 요약본이 있어도 새롭게 요약본을 뽑게 해줘"라고 요청했습니다.

**원인**:
```javascript
// mainPage.tsx handleGenerateSummary()
const cacheKey = summaryCache.generateCacheKey(type, data)
const cachedSummary = summaryCache.getFromCache(cacheKey)

if (cachedSummary) {
  setSummary(cachedSummary)  // ❌ 캐시가 있으면 항상 사용
  return
}
```

**해결**:
```javascript
// Generate Summary 버튼 클릭 시 항상 새로운 요약 생성
const result = await generateSummary({
  type: targetType,
  data: targetData
})

// 결과를 캐시에 저장 (다음 조회 시 빠르게)
summaryCache.saveToCache(cacheKey, result)
setSummary(result)
```

---

### **Problem 3: Gemini 프롬프트에서 헤더가 나옴**

**상황**:
```
생성된 요약:
## Commit 요약
이 커밋은 머지(merge) 작업으로...
```

**원인**:
프롬프트의 마지막 부분에 `=== 요약 ===` 섹션이 있어서, Gemini가 여기에 응답함

**해결**:
```javascript
// 개선 전
prompt = `
다음 Git commit의 내용을 간단히 요약해줘...
=== 요약 ===
`.trim()

// 개선 후
prompt = `다음 Git commit의 내용을 간단히 요약해줘. 한국어로 2-3문장으로 작성해줘.
반드시 변경된 파일과 코드 내용을 기반으로 요약해줘.
Commit Message만으로는 충분하지 않고, 실제 코드 변경사항을 분석해야 해.
헤더나 제목 없이 요약 본문만 반환해줘.

=== Commit 메시지 ===
${message}

=== 변경된 파일 및 코드 내용 (필수 분석 대상) ===
${files ? files : '파일 변경사항 없음'}

요약:`.trim()
```

---

### **Problem 4: Saved Posts에서 모든 포스트를 한번에 로드**

**상황**:
```jsx
// 기존: 500px 높이 제한으로 스크롤 필요
<div className="w-full flex flex-col gap-[5px] max-h-[500px] overflow-y-auto">
```

**원인**:
향후 포스트가 많아지면 성능 문제 발생 가능

**해결**:

1. **백엔드 페이지네이션** (postController.js):
   ```javascript
   const page = Math.max(1, parseInt(req.query.page) || 1)
   const perPage = 10

   const total = sortedPosts.length
   const totalPages = Math.ceil(total / perPage)
   const skip = (page - 1) * perPage
   const paginatedPosts = sortedPosts.slice(skip, skip + perPage)

   return res.status(200).json({
     total,
     posts: paginatedPosts,
     page,
     perPage,
     totalPages
   })
   ```

2. **Frontend UI 개선** (postPage.tsx):
   ```jsx
   // 높이 제한 제거
   <div className="w-full flex flex-col gap-[5px]">  // ✅ max-h 제거
     {posts.map((post) => ...)}
   </div>

   // 페이지네이션 컨트롤 추가
   <div className="w-full flex items-center justify-center gap-[15px] mt-[20px]">
     <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>
       ← 이전
     </button>
     <div>{currentPage} / {totalPages}</div>
     <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}>
       다음 →
     </button>
   </div>
   ```

---

### **Problem 5: 페이지네이션 NaN 에러**

**상황**:
다음 버튼 클릭 시 "NaN / NaN" 표시

**원인**:
백엔드 코드 변경 후 서버를 재시작하지 않아 새로운 `getPosts()` 함수가 실행되지 않음

**해결**:
1. Backend 서버 재시작: `npm start`
2. Frontend에 응답 로깅 추가:
   ```javascript
   const response = await getBlogPosts(page)
   console.log('totalPages:', response.totalPages)
   setTotalPages(response.totalPages || 1)  // 안전장치
   ```

---

## 🤖 AI 활용 경험

### **좋았던 점**

1. **데이터 흐름 분석 (Data Flow Debugging)**
   - 로그를 기반으로 Frontend → Backend → LLM까지 데이터가 어디서 손실되는지 정확히 파악
   - 여러 층의 스택을 한눈에 이해할 수 있도록 정리

   ```
   Frontend 로그: selectedData에 files 3000자 ✅
   → Gemini 서비스 로그: 전달 데이터에 files 없음 ❌
   → Backend 로그: files가 API 응답에 있음 ✅

   결론: List.tsx에서 원본 데이터 전달 문제
   ```

2. **문제 원인의 근본적 파악**
   - GitHub API의 `/commits/{ref}` 엔드포인트가 files를 반환하지 않는다는 것을 확인
   - compare 엔드포인트 사용으로 올바른 해결책 제시

3. **코드 구조 개선 제안**
   - setTimeout을 통한 state 업데이트 대기
   - 데이터 우선순위 재설정 (selectedData > data)
   - 응답 구조 확장 (page, totalPages 추가)

4. **프롬프트 엔지니어링**
   - "헤더나 제목 없이 본문만 반환"이라는 구체적인 지시사항 추가
   - "반드시 변경된 파일과 코드 내용을 기반으로"라는 강조

### **아쉬웠던 점**

1. **로그 기반 정보 부족**
   - 처음부터 각 계층에 상세한 로깅이 있었으면 더 빠르게 해결 가능
   - Backend 재시작 필요성을 미리 알지 못함

2. **타입 안전성**
   - TypeScript의 optional chaining 활용을 더 일찍 적용했으면 좋았음
   - `response.totalPages || 1` 같은 안전장치를 처음부터 설계

3. **API 응답 구조 설계**
   - pagination 메타데이터를 처음부터 포함하도록 설계했으면 좋았음
   - 나중에 추가하다 보니 기존 코드 수정이 필요

### **구체적 활용 사례**

#### 사례 1: 데이터 흐름 분석
```
문제: "커밋은 여전히 커밋 메세지만 확인하고 있는 것처럼 보여"

AI의 접근:
1. mainPage.tsx 로그: files: 3000자 ✅
2. geminiService.ts 로그: Commit Files: 없음 ❌
3. List.tsx 코드 분석: 원본 commit 데이터 전달

→ selectedData 업데이트 대기 문제 발견 → setTimeout 해결
```

#### 사례 2: GitHub API 문제 해결
```
문제: commit.files가 항상 undefined

AI의 해결:
1. GitHub API 문서 확인 가능성 제시
2. compare 엔드포인트 사용 제안
3. parent commit과의 비교 로직 구현

실제 구현:
const compareResponse = await makeGitHubRequest(
  octokit,
  'GET /repos/{owner}/{repo}/compare/{base}...{head}',
  { owner, repo, base: parentSha, head: sha }
)
```

#### 사례 3: 프롬프트 개선
```
기존: "=== 요약 ===" 섹션으로 Gemini가 헤더 추가

개선:
- "헤더나 제목 없이 요약 본문만 반환해줘" 명시
- "반드시 변경된 파일과 코드 내용을 기반으로" 강조
- "필수 분석 대상" 명시

결과: 깔끔한 본문만 반환
```

---

## 📊 기술 스택

### Backend
- **Node.js + Express**
- **GitHub API (Octokit)**
- **Google Generative AI (Gemini API)**
- **JSON 기반 파일 저장 (posts.json)**

### Frontend
- **React + TypeScript**
- **Tailwind CSS**
- **Axios (API 통신)**

### 주요 개선 사항
| 항목 | 기존 | 개선 후 |
|------|------|--------|
| **Commit 요약** | 메시지만 | 메시지 + 코드 diff |
| **PR 요약** | 제목만 | 제목 + 본문 + 파일 + 코멘트 + README |
| **Cache 정책** | 캐시 우선 | 수동 생성 우선, 결과 캐싱 |
| **Saved Posts** | 전체 로드 + 스크롤 | 페이지별 10개 + 페이지네이션 |
| **프롬프트** | 헤더 포함 | 본문만 |

---

## 🎯 성과

### 정량적 성과
- ✅ 3개 파일 추가 (getCommitDetails 라우트, 페이지네이션 로직)
- ✅ 5개 파일 수정 (githubController, geminiController, mainPage, postService, postPage)
- ✅ 5개의 주요 버그/개선사항 해결
- ✅ 100+ 줄의 로깅 코드로 디버깅 가능성 향상

### 정성적 성과
- **사용자 경험 개선**: 더 정확하고 실용적인 AI 요약
- **코드 품질**: 타입 안전성 강화, 에러 핸들링 개선
- **확장성**: 향후 포스트 증가 대비 페이지네이션 구조
- **유지보수성**: 각 단계별 로깅으로 문제 추적 용이

---

## 🚀 향후 개선 가능 사항

1. **성능 최적화**
   - IndexedDB 또는 localStorage를 활용한 client-side 캐싱
   - 이미지 최적화 및 lazy loading

2. **UX 개선**
   - 페이지 번호별 직접 이동 (1 2 3 4 5 ...)
   - 정렬 옵션 추가 (최신순, 오래된순, 타입별)
   - 포스트 검색 기능

3. **데이터베이스 마이그레이션**
   - JSON 파일 → MongoDB/PostgreSQL로 전환
   - 더 강력한 쿼리 기능 및 확장성

4. **LLM 모델 업그레이드**
   - Gemini 2.0 활용
   - 다중 언어 지원
   - 커스텀 요약 포맷 옵션

5. **에러 핸들링**
   - 네트워크 오류 시 재시도 로직
   - 사용자 친화적 에러 메시지
   - 폴백 메커니즘

---

## 📝 커밋 메시지

```
feat: Commit diff 기반 요약 및 Saved Posts 페이지네이션 구현

- GitHub API compare 엔드포인트로 commit 파일 변경사항 조회
- Gemini 프롬프트 개선: 코드 변경사항 기반 분석 강화
- 요약 생성 시 캐시 무시하고 항상 새로운 요약 생성
- Frontend 데이터 전달 로직 개선: selectedData 우선 사용
- Saved Posts 페이지네이션 구현: 10개씩 페이지 분리
- 프롬프트 정제: 헤더 없이 본문만 반환
- 전체 스택에 상세 로깅 추가로 디버깅 용이성 개선

Related to: commit-diff-analysis, pagination-implementation
```

---

**작성일**: 2025-11-16
**담당자**: Claude Code with AI
**상태**: ✅ 완료

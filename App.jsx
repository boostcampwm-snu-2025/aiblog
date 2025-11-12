import React, { useState } from 'react';

/**
 * 간단한 GitHub 리포지토리 이름 파싱 함수
 * (이 부분은 변경 없음)
 */
const parseRepoInput = (input) => {
  try {
    if (input.startsWith('http')) {
      const url = new URL(input);
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        return `${pathParts[0]}/${pathParts[1]}`;
      }
    }
    if (input.includes('/') && input.split('/').length === 2) {
      return input;
    }
  } catch (e) {
    console.error('Invalid URL or format:', e);
  }
  return null;
};

// ⭐️ 우리 Express 서버의 기본 URL
const PROXY_SERVER_URL = 'http://localhost:3001';

export default function App() {
  const [repoInput, setRepoInput] = useState('facebook/react');
  const [commits, setCommits] = useState([]);
  const [pulls, setPulls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. 데이터 페칭 핸들러 (⭐️ 이 함수가 변경됩니다)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const repoPath = parseRepoInput(repoInput);

    if (!repoPath) {
      setError('유효하지 않은 저장소 주소입니다. "owner/repo" 또는 GitHub URL 형식으로 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCommits([]);
    setPulls([]);

    try {
      // ⭐️ 변경된 부분: GitHub API 대신 우리 Express 서버를 호출합니다.
      // repoPath (예: "facebook/react")를 owner와 repo로 분리합니다.
      const [owner, repo] = repoPath.split('/');

      const [commitRes, pullRes] = await Promise.all([
        fetch(`${PROXY_SERVER_URL}/api/github/${owner}/${repo}/commits`),
        fetch(`${PROXY_SERVER_URL}/api/github/${owner}/${repo}/pulls`),
      ]);
      // ⭐️ 변경 끝

      if (!commitRes.ok || !pullRes.ok) {
        // Express 서버에서 500 에러를 보내도 !res.ok는 true가 됩니다.
        // 서버가 보낸 JSON 에러 메시지를 파싱합니다.
        const commitError = !commitRes.ok ? await commitRes.json() : null;
        const pullError = !pullRes.ok ? await pullRes.json() : null;
        
        throw new Error(
          commitError?.message || pullError?.message || '데이터를 불러오는 데 실패했습니다.'
        );
      }

      const commitsData = await commitRes.json();
      const pullsData = await pullRes.json();

      setCommits(commitsData);
      setPulls(pullsData);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. 렌더링 (이 부분은 변경 없음)
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* 헤더 및 입력 폼 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-4">Smart Blog Maker</h1>
          <p className="text-gray-400 mb-4">GitHub 저장소의 최근 작업을 기반으로 블로그 글을 생성합니다.</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="e.g., facebook/react 또는 GitHub URL"
              className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-500"
            >
              {isLoading ? '불러오는 중...' : '저장소 불러오기'}
            </button>
          </form>
        </header>

        {/* 로딩 및 에러 처리 UI */}
        {isLoading && (
          <div className="flex justify-center items-center p-12">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
            <span className="ml-3 text-lg">데이터를 불러오는 중입니다...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* 결과 목록 */}
        {!isLoading && !error && (commits.length > 0 || pulls.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 커밋 목록 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
                최근 커밋 (최대 10개)
              </h2>
              <ul className="space-y-3">
                {commits.map((c) => (
                  <li key={c.sha} className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
                    <p className="font-mono text-sm text-green-400 truncate" title={c.sha}>
                      {c.sha.substring(0, 7)}
                    </p>
                    <a
                      href={c.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-lg text-blue-300 hover:underline"
                    >
                      {c.commit.message.split('\n')[0]}
                    </a>
                    <p className="text-sm text-gray-400 mt-1">
                      by <strong>{c.commit.author?.name || c.author?.login}</strong>
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* PR 목록 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
                최근 PR (최대 10개)
              </h2>
              <ul className="space-y-3">
                {pulls.map((pr) => (
                  <li key={pr.id} className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
                    <p className="font-mono text-sm text-purple-400">
                      PR #{pr.number} (상태: {pr.state})
                    </p>
                    <a
                      href={pr.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-lg text-blue-300 hover:underline"
                    >
                      {pr.title}
                    </a>
                    <p className="text-sm text-gray-400 mt-1">
                      by <strong>{pr.user.login}</strong>
                    </p>
                  </li>
                ))}
              </ul>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
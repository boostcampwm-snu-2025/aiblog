import React from 'react';

// Props: pulls (배열), onGenerate (함수), isGenerating (bool), generatingId (string)
export function PullList({ pulls, onGenerate, isGenerating, generatingId }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
        최근 PR
      </h2>
      <ul className="space-y-3">
        {pulls.map((pr) => (
          <li key={pr.id} className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
            <div className="flex justify-between items-start">
              <div>
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
              </div>
              <button
                onClick={() => onGenerate({
                  id: pr.id,
                  type: 'pr',
                  content: pr.title,
                  author: pr.user.login,
                })}
                disabled={isGenerating}
                className="ml-4 px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-500 whitespace-nowrap"
              >
                {isGenerating && generatingId === pr.id ? '생성 중...' : '블로그 생성'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
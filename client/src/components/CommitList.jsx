import React from 'react';

// Props: commits (배열), onGenerate (함수), isGenerating (bool), generatingId (string)
export function CommitList({ commits, onGenerate, isGenerating, generatingId }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
        최근 커밋
      </h2>
      <ul className="space-y-3">
        {commits.map((c) => (
          <li key={c.sha} className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
            <div className="flex justify-between items-start">
              <div>
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
              </div>
              <button
                onClick={() => onGenerate({
                  id: c.sha,
                  type: 'commit',
                  content: c.commit.message,
                  author: c.commit.author?.name || c.author?.login,
                })}
                disabled={isGenerating}
                className="ml-4 px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-500 whitespace-nowrap"
              >
                {isGenerating && generatingId === c.sha ? '생성 중...' : '블로그 생성'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
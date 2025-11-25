import React from 'react';
import { useBlogContext } from '../contexts/BlogContext';

// title: 섹션 제목 (Commits or PRs)
// items: 데이터 배열
// type: 'commit' | 'pr'
// onAction: 버튼 클릭 핸들러
// isGenerating: 생성 중 여부
export function RepoItemList({ title, items, type, onAction, isGenerating }) {
  const { state } = useBlogContext();

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
        {title}
      </h2>
      <ul className="space-y-3">
        {items.map((item) => {
          // 데이터 정규화
          const id = type === 'commit' ? item.sha : item.id;
          const content = type === 'commit' ? item.commit.message : item.title;
          const author = type === 'commit' ? (item.commit.author?.name || item.author?.login) : item.user.login;
          const url = item.html_url;
          
          // 이미 저장된 글인지 확인
          const savedPost = state.posts.find(p => p.id === id);

          return (
            <li key={id} className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-grow min-w-0 mr-4"> {/* min-w-0 for truncate */}
                  <div className="flex items-center gap-2 mb-1">
                     <span className={`text-xs px-2 py-0.5 rounded ${type === 'commit' ? 'bg-green-900 text-green-300' : 'bg-purple-900 text-purple-300'}`}>
                        {type === 'commit' ? 'Commit' : 'PR'}
                     </span>
                     <span className="font-mono text-sm text-gray-500 truncate" title={id}>
                        {String(id).substring(0, 7)}
                     </span>
                  </div>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="block font-medium text-lg text-blue-300 hover:underline truncate">
                    {content.split('\n')[0]}
                  </a>
                  <p className="text-sm text-gray-400 mt-1">
                    by <strong>{author}</strong>
                  </p>
                </div>

                {/* 버튼 로직 분기 */}
                {savedPost ? (
                   <button
                    onClick={() => onAction({ type: 'view', post: savedPost })}
                    className="flex-shrink-0 px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors"
                  >
                    글 확인
                  </button>
                ) : (
                  <button
                    onClick={() => onAction({ type: 'generate', item: { id, type, content, author, url } })}
                    disabled={isGenerating}
                    className="flex-shrink-0 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-500"
                  >
                    {isGenerating ? '...' : '생성'}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
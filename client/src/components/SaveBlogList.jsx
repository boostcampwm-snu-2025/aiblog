import React from 'react';
import { useBlogContext } from '../contexts/BlogContext';

export function SavedBlogList({ onView }) {
  const { state, dispatch } = useBlogContext();

  const handleDelete = (e, id) => {
    e.stopPropagation(); // 부모 클릭 방지
    if (confirm('정말 삭제하시겠습니까?')) {
      dispatch({ type: 'DELETE_POST', payload: id });
    }
  };

  if (state.posts.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg text-gray-400">
        아직 생성된 블로그 글이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {state.posts.map((post) => (
        <div 
            key={post.id} 
            className="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-blue-500 transition-all cursor-pointer group"
            onClick={() => onView(post)}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-xs px-2 py-0.5 rounded ${post.type === 'commit' ? 'bg-green-900 text-green-300' : 'bg-purple-900 text-purple-300'}`}>
                {post.type.toUpperCase()}
            </span>
            <button 
                onClick={(e) => handleDelete(e, post.id)}
                className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                삭제
            </button>
          </div>
          <h3 className="font-bold text-lg text-gray-100 mb-2 line-clamp-2 h-14">
            {post.title}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <div className="text-sm text-gray-500 line-clamp-3">
            {post.content}
          </div>
        </div>
      ))}
    </div>
  );
}
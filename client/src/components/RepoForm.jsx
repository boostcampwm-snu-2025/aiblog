import React from 'react';

// Props: repoInput, setRepoInput, handleSubmit, isLoading
export function RepoForm({ repoInput, setRepoInput, handleSubmit, isLoading }) {
  return (
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
  );
}
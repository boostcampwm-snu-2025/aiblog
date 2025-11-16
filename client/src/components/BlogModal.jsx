import React from 'react';

// Props: content, isLoading, onClose
export function BlogModal({ content, isLoading, onClose }) {
  // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!content && !isLoading) {
    return null;
  }

  return (
    // 배경 오버레이
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      {/* 모달 컨텐츠 */}
      <div
        className="bg-gray-800 text-gray-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-400">AI 생성 블로그</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>
        
        {/* 본문 */}
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="w-10 h-10 border-4 border-t-purple-500 border-gray-700 rounded-full animate-spin"></div>
              <span className="ml-3 text-lg">블로그 글을 생성 중입니다...</span>
            </div>
          ) : (
            // whitespace-pre-wrap: \n (줄바꿈)과 공백을 HTML에서처럼 렌더링
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
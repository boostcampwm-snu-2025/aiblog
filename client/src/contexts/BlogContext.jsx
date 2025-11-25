import React, { createContext, useReducer, useEffect, useContext } from 'react';

// 1. 초기 상태 (localStorage에서 불러오기)
const getInitialState = () => {
  const saved = localStorage.getItem('blogPosts');
  return {
    posts: saved ? JSON.parse(saved) : [],
  };
};

// 2. 리듀서 (상태 변경 로직)
const blogReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_POST':
      // 이미 존재하는지 중복 체크 (방어 로직)
      if (state.posts.some(post => post.id === action.payload.id)) {
        return state;
      }
      return { ...state, posts: [action.payload, ...state.posts] };
    
    case 'DELETE_POST':
      return { ...state, posts: state.posts.filter(post => post.id !== action.payload) };
    
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// 3. 컨텍스트 생성
const BlogContext = createContext();

export function BlogProvider({ children }) {
  const [state, dispatch] = useReducer(blogReducer, null, getInitialState);

  // 4. 상태 변경 시 localStorage 자동 동기화
  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(state.posts));
  }, [state.posts]);

  return (
    <BlogContext.Provider value={{ state, dispatch }}>
      {children}
    </BlogContext.Provider>
  );
}

// 5. 커스텀 훅 (쉽게 컨텍스트 사용하기 위함)
export function useBlogContext() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
}
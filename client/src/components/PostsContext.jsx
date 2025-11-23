import { createContext, useContext, useEffect, useReducer } from 'react';

const KEY = 'aiblog.posts.v1';

const initial = {
  status: 'idle', // idle | loading | success | error
  items: [],
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', error: null };
    case 'LOAD_SUCCESS':
      return { ...state, status: 'success', items: action.items, error: null };
    case 'LOAD_ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'ADD':
      return { ...state, items: [action.post, ...state.items] };
    case 'REMOVE':
      return { ...state, items: state.items.filter(p => p.id !== action.id) };
    default:
      return state;
  }
}

const PostsCtx = createContext(null);

export function PostsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // 최초 로드: localStorage → state
  useEffect(() => {
    dispatch({ type: 'LOAD_START' });
    try {
      const raw = localStorage.getItem(KEY);
      const items = raw ? JSON.parse(raw) : [];
      dispatch({ type: 'LOAD_SUCCESS', items });
    } catch (e) {
      dispatch({ type: 'LOAD_ERROR', error: e.message || 'load failed' });
    }
  }, []);

  // 상태 변경 → localStorage 반영
  useEffect(() => {
    if (state.status === 'success') {
      localStorage.setItem(KEY, JSON.stringify(state.items));
    }
  }, [state.status, state.items]);

  const actions = {
    add(post) {
      const withId = post.id
        ? post
        : { ...post, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      dispatch({ type: 'ADD', post: withId });
      return withId;
    },
    remove(id) {
      dispatch({ type: 'REMOVE', id });
    },
    replaceAll(items) {
      dispatch({ type: 'LOAD_SUCCESS', items });
    },
  };

  return (
    <PostsCtx.Provider value={{ state, actions }}>
      {children}
    </PostsCtx.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsCtx);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}

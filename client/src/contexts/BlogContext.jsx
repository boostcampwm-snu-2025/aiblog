import { createContext, useContext, useReducer, useEffect } from 'react';

/**
 * Blog Context for global state management
 * Manages blog posts with localStorage synchronization
 */

const STORAGE_KEY = 'aiblog_posts';

// Initial State
const initialState = {
  posts: [], // Array of blog posts
  currentPost: null, // Currently viewing post
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  error: null,
};

// Action Types
export const ActionTypes = {
  LOAD_POSTS: 'LOAD_POSTS',
  ADD_POST: 'ADD_POST',
  DELETE_POST: 'DELETE_POST',
  SET_CURRENT_POST: 'SET_CURRENT_POST',
  SET_STATUS: 'SET_STATUS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const blogReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_POSTS:
      return {
        ...state,
        posts: action.payload,
        status: 'success',
      };

    case ActionTypes.ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        status: 'success',
      };

    case ActionTypes.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
        currentPost: state.currentPost?.id === action.payload ? null : state.currentPost,
        status: 'success',
      };

    case ActionTypes.SET_CURRENT_POST:
      return {
        ...state,
        currentPost: action.payload,
      };

    case ActionTypes.SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        status: 'error',
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Context
const BlogContext = createContext(null);

// Provider Component
export const BlogProvider = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  // Load posts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const posts = JSON.parse(stored);
        dispatch({ type: ActionTypes.LOAD_POSTS, payload: posts });
      }
    } catch (error) {
      console.error('Failed to load posts from localStorage:', error);
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: 'Failed to load saved posts' 
      });
    }
  }, []);

  // Sync posts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.posts));
    } catch (error) {
      console.error('Failed to save posts to localStorage:', error);
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: 'Failed to save posts' 
      });
    }
  }, [state.posts]);

  // Actions
  const actions = {
    addPost: (post) => {
      const newPost = {
        ...post,
        id: post.id || `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: post.createdAt || new Date().toISOString(),
      };
      dispatch({ type: ActionTypes.ADD_POST, payload: newPost });
      return newPost;
    },

    deletePost: (postId) => {
      dispatch({ type: ActionTypes.DELETE_POST, payload: postId });
    },

    setCurrentPost: (post) => {
      dispatch({ type: ActionTypes.SET_CURRENT_POST, payload: post });
    },

    setStatus: (status) => {
      dispatch({ type: ActionTypes.SET_STATUS, payload: status });
    },

    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    },
  };

  return (
    <BlogContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </BlogContext.Provider>
  );
};

// Custom Hook
export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogContext must be used within BlogProvider');
  }
  return context;
};

import { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import type { BlogState, BlogAction, BlogContextType, BlogPost, BlogGenerationData } from '../types';
import { saveToLocalStorage, loadFromLocalStorage } from '../lib/localStorage';
import { generateBlog as generateBlogAPI } from '../lib/api';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// Initial State
// ============================================
const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  generationState: { status: 'idle' },
  listState: { status: 'idle' },
};

// ============================================
// Reducer
// ============================================
function blogReducer(state: BlogState, action: BlogAction): BlogState {
  switch (action.type) {
    case 'GENERATE_BLOG_START':
      return {
        ...state,
        generationState: { status: 'loading' },
      };

    case 'GENERATE_BLOG_SUCCESS':
      return {
        ...state,
        currentBlog: action.payload,
        generationState: { status: 'success', data: action.payload },
      };

    case 'GENERATE_BLOG_ERROR':
      return {
        ...state,
        currentBlog: null,
        generationState: { status: 'error', error: action.payload },
      };

    case 'SAVE_BLOG':
      const newBlogs = [action.payload, ...state.blogs];
      saveToLocalStorage('blogs', newBlogs);
      return {
        ...state,
        blogs: newBlogs,
        currentBlog: null,
        generationState: { status: 'idle' },
      };

    case 'DELETE_BLOG':
      const filteredBlogs = state.blogs.filter((blog) => blog.id !== action.payload);
      saveToLocalStorage('blogs', filteredBlogs);
      return {
        ...state,
        blogs: filteredBlogs,
      };

    case 'UPDATE_BLOG':
      const updatedBlogs = state.blogs.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog
      );
      saveToLocalStorage('blogs', updatedBlogs);
      return {
        ...state,
        blogs: updatedBlogs,
      };

    case 'LOAD_BLOGS_START':
      return {
        ...state,
        listState: { status: 'loading' },
      };

    case 'LOAD_BLOGS_SUCCESS':
      return {
        ...state,
        blogs: action.payload,
        listState: { status: 'success', data: action.payload },
      };

    case 'LOAD_BLOGS_ERROR':
      return {
        ...state,
        listState: { status: 'error', error: action.payload },
      };

    case 'CLEAR_CURRENT_BLOG':
      return {
        ...state,
        currentBlog: null,
        generationState: { status: 'idle' },
      };

    default:
      return state;
  }
}

// ============================================
// Context
// ============================================
const BlogContext = createContext<BlogContextType | undefined>(undefined);

// ============================================
// Provider
// ============================================
interface BlogProviderProps {
  children: ReactNode;
}

export function BlogProvider({ children }: BlogProviderProps) {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  // localStorage에서 블로그 목록 로드 (초기화 시)
  useEffect(() => {
    loadBlogs();
  }, []);

  // 블로그 생성
  const generateBlog = async (owner: string, repo: string, commitSha: string) => {
    try {
      dispatch({ type: 'GENERATE_BLOG_START' });

      const response = await generateBlogAPI(owner, repo, commitSha);

      if (response.success && response.data) {
        dispatch({ type: 'GENERATE_BLOG_SUCCESS', payload: response.data });
      } else {
        dispatch({ type: 'GENERATE_BLOG_ERROR', payload: response.error || '알 수 없는 오류' });
      }
    } catch (error: any) {
      dispatch({ type: 'GENERATE_BLOG_ERROR', payload: error.message });
    }
  };

  // 블로그 저장
  const saveBlog = async (owner: string, repo: string) => {
    if (!state.currentBlog) {
      throw new Error('저장할 블로그가 없습니다.');
    }

    const blogPost: BlogPost = {
      id: uuidv4(),
      title: state.currentBlog.title,
      content: state.currentBlog.content,
      summary: state.currentBlog.summary,
      commitSha: state.currentBlog.metadata.commitSha,
      owner,
      repo,
      author: state.currentBlog.metadata.author,
      filesChanged: state.currentBlog.metadata.filesChanged,
      stats: state.currentBlog.metadata.stats,
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };

    dispatch({ type: 'SAVE_BLOG', payload: blogPost });
  };

  // 블로그 삭제
  const deleteBlog = async (id: string) => {
    dispatch({ type: 'DELETE_BLOG', payload: id });
  };

  // 블로그 업데이트
  const updateBlog = async (blog: BlogPost) => {
    const updatedBlog = {
      ...blog,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_BLOG', payload: updatedBlog });
  };

  // 블로그 목록 로드
  const loadBlogs = () => {
    try {
      dispatch({ type: 'LOAD_BLOGS_START' });
      const blogs = loadFromLocalStorage<BlogPost[]>('blogs', []);
      dispatch({ type: 'LOAD_BLOGS_SUCCESS', payload: blogs });
    } catch (error: any) {
      dispatch({ type: 'LOAD_BLOGS_ERROR', payload: error.message });
    }
  };

  // 현재 블로그 초기화
  const clearCurrentBlog = () => {
    dispatch({ type: 'CLEAR_CURRENT_BLOG' });
  };

  const value: BlogContextType = {
    state,
    dispatch,
    generateBlog,
    saveBlog,
    deleteBlog,
    loadBlogs,
    clearCurrentBlog,
    updateBlog,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

// ============================================
// Hook
// ============================================
export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}

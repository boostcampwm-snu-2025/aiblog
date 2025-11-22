import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { Post } from './api.types';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface PostsState {
  items: Post[];
  status: AsyncStatus;
  error?: string;
  selectedId?: string | null;
}

type PostsAction =
  | { type: 'INIT_START' }
  | { type: 'INIT_SUCCESS'; posts: Post[] }
  | { type: 'INIT_ERROR'; error: string }
  | { type: 'ADD_POST'; post: Post }
  | { type: 'DELETE_POST'; id: string }
  | { type: 'SELECT_POST'; id: string | null };

const initialState: PostsState = {
  items: [],
  status: 'idle',
  error: undefined,
  selectedId: undefined,
};

function postsReducer(state: PostsState, action: PostsAction): PostsState {
  switch (action.type) {
    case 'INIT_START':
      return { ...state, status: 'loading', error: undefined };
    case 'INIT_SUCCESS': {
      const firstId = action.posts[0]?.id ?? null;
      return {
        ...state,
        items: action.posts,
        status: 'success',
        error: undefined,
        selectedId: state.selectedId ?? firstId,
      };
    }
    case 'INIT_ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'ADD_POST': {
      const items = [action.post, ...state.items];
      return {
        ...state,
        items,
        status: 'success',
        error: undefined,
        selectedId: action.post.id,
      };
    }
    case 'DELETE_POST': {
      const items = state.items.filter((p) => p.id !== action.id);
      const selectedId =
        state.selectedId === action.id ? items[0]?.id ?? null : state.selectedId;
      return { ...state, items, status: 'success', selectedId };
    }
    case 'SELECT_POST':
      return { ...state, selectedId: action.id };
    default:
      return state;
  }
}

interface PostsContextValue {
  state: PostsState;
  addPost: (input: { title: string; markdown: string; tags?: string[] }) => void;
  deletePost: (id: string) => void;
  selectPost: (id: string | null) => void;
  reloadFromStorage: () => void;
}

const PostsContext = createContext<PostsContextValue | undefined>(undefined);

const STORAGE_KEY = 'smartblog:posts';

function readFromStorage(): Post[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Post[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeToStorage(posts: Post[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // ignore
  }
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function PostsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(postsReducer, initialState);

  const reloadFromStorage = useCallback(() => {
    dispatch({ type: 'INIT_START' });
    try {
      const posts = readFromStorage();
      dispatch({ type: 'INIT_SUCCESS', posts });
    } catch (e: any) {
      dispatch({
        type: 'INIT_ERROR',
        error: e?.message ?? '저장된 포스트를 불러오지 못했습니다.',
      });
    }
  }, []);

  useEffect(() => {
    reloadFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.status === 'idle') return;
    writeToStorage(state.items);
  }, [state.items, state.status]);

  const value: PostsContextValue = useMemo(
    () => ({
      state,
      addPost: ({ title, markdown, tags }) => {
        const now = new Date().toISOString();
        const post: Post = {
          id: generateId(),
          title,
          markdown,
          tags,
          createdAt: now,
          updatedAt: now,
        };
        dispatch({ type: 'ADD_POST', post });
      },
      deletePost: (id: string) => {
        dispatch({ type: 'DELETE_POST', id });
      },
      selectPost: (id: string | null) => {
        dispatch({ type: 'SELECT_POST', id });
      },
      reloadFromStorage,
    }),
    [state, reloadFromStorage],
  );

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}



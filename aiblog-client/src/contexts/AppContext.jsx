import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { getSavedPosts, savePosts } from '@/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [page, setPage] = useState('main');
  
  const [savedPosts, setSavedPosts] = useState(() => getSavedPosts());
  useEffect(() => {
    savePosts(savedPosts);
  }, [savedPosts]);

  const savePost = useCallback((post) => {
    setSavedPosts((prevPosts) => {
      const newPost = { ...post, id: Date.now().toString(), createdAt: new Date().toISOString() };
      return [newPost, ...prevPosts];
    });
  }, []);

  const deletePost = useCallback((postId) => {
    setSavedPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
  }, []);


  const value = useMemo(
    () => ({
      page,
      setPage,
      savedPosts,
      savePost,
      deletePost,
    }),
    [page, savedPosts, savePost, deletePost]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
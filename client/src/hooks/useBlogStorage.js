import { useState, useEffect, useCallback } from 'react';
import * as blogStorage from '../utils/blogStorage';

/**
 * localStorage와 연동된 블로그 관리 커스텀 훅
 */
export const useBlogStorage = () => {
  // 저장된 블로그 목록 상태
  const [savedBlogs, setSavedBlogs] = useState([]);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 에러 상태
  const [error, setError] = useState(null);

  // 초기 로드: localStorage에서 블로그 목록 가져오기
  useEffect(() => {
    try {
      setIsLoading(true);
      const blogs = blogStorage.getBlogs();
      setSavedBlogs(blogs);
      setError(null);
    } catch (err) {
      console.error('Failed to load blogs:', err);
      setError('블로그 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 새 블로그 저장
   * @param {Object} blogData - 블로그 데이터
   * @returns {Object} 저장된 블로그 객체
   */
  const saveBlog = useCallback((blogData) => {
    try {
      const savedBlog = blogStorage.saveBlog(blogData);

      // 상태 업데이트 (맨 앞에 추가)
      setSavedBlogs(prev => [savedBlog, ...prev]);

      setError(null);
      return savedBlog;
    } catch (err) {
      console.error('Failed to save blog:', err);
      setError('블로그 저장에 실패했습니다.');
      throw err;
    }
  }, []);

  /**
   * 블로그 삭제
   * @param {string} id - 삭제할 블로그 ID
   */
  const deleteBlog = useCallback((id) => {
    try {
      const success = blogStorage.deleteBlog(id);

      if (success) {
        // 상태에서 제거
        setSavedBlogs(prev => prev.filter(blog => blog.id !== id));
        setError(null);
      }

      return success;
    } catch (err) {
      console.error('Failed to delete blog:', err);
      setError('블로그 삭제에 실패했습니다.');
      return false;
    }
  }, []);

  /**
   * 블로그 업데이트
   * @param {string} id - 업데이트할 블로그 ID
   * @param {Object} updates - 업데이트할 필드
   */
  const updateBlog = useCallback((id, updates) => {
    try {
      const updatedBlog = blogStorage.updateBlog(id, updates);

      if (updatedBlog) {
        // 상태 업데이트
        setSavedBlogs(prev =>
          prev.map(blog => blog.id === id ? updatedBlog : blog)
        );
        setError(null);
      }

      return updatedBlog;
    } catch (err) {
      console.error('Failed to update blog:', err);
      setError('블로그 업데이트에 실패했습니다.');
      return null;
    }
  }, []);

  /**
   * 특정 블로그 가져오기
   * @param {string} id - 블로그 ID
   */
  const getBlogById = useCallback((id) => {
    return savedBlogs.find(blog => blog.id === id) || null;
  }, [savedBlogs]);

  /**
   * 모든 블로그 삭제
   */
  const clearAllBlogs = useCallback(() => {
    try {
      const success = blogStorage.clearAllBlogs();

      if (success) {
        setSavedBlogs([]);
        setError(null);
      }

      return success;
    } catch (err) {
      console.error('Failed to clear all blogs:', err);
      setError('블로그 전체 삭제에 실패했습니다.');
      return false;
    }
  }, []);

  return {
    savedBlogs,      // 저장된 블로그 목록
    isLoading,       // 로딩 상태
    error,           // 에러 메시지
    saveBlog,        // 블로그 저장 함수
    deleteBlog,      // 블로그 삭제 함수
    updateBlog,      // 블로그 업데이트 함수
    getBlogById,     // 특정 블로그 조회 함수
    clearAllBlogs,   // 전체 삭제 함수
  };
};

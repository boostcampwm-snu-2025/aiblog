import { useState, useMemo } from 'react';
import { useBlog } from '../contexts/BlogContext';
import type { BlogPost } from '../types';

interface UseBlogListOptions {
  itemsPerPage?: number;
  searchQuery?: string;
}

/**
 * 블로그 목록 관리 (페이지네이션, 검색, 정렬)를 위한 커스텀 훅
 */
export function useBlogList(options: UseBlogListOptions = {}) {
  const { itemsPerPage = 10, searchQuery = '' } = options;
  const { state, deleteBlog } = useBlog();
  const [currentPage, setCurrentPage] = useState(1);

  // 검색 필터링
  const filteredBlogs = useMemo(() => {
    if (!searchQuery) {
      return state.blogs;
    }

    const query = searchQuery.toLowerCase();
    return state.blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query) ||
        blog.commitSha.toLowerCase().includes(query) ||
        blog.author.toLowerCase().includes(query)
    );
  }, [state.blogs, searchQuery]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredBlogs.slice(start, end);
  }, [filteredBlogs, currentPage, itemsPerPage]);

  // 페이지 변경
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // 블로그 삭제
  const handleDelete = async (id: string) => {
    await deleteBlog(id);

    // 삭제 후 현재 페이지가 비어있으면 이전 페이지로
    if (paginatedBlogs.length === 1 && currentPage > 1) {
      prevPage();
    }
  };

  return {
    blogs: paginatedBlogs,
    allBlogs: state.blogs, // 검색과 상관없이 전체 블로그 목록
    isLoading: state.listState.status === 'loading',
    hasError: state.listState.status === 'error',
    error: state.listState.status === 'error' ? state.listState.error : null,
    pagination: {
      currentPage,
      totalPages,
      totalItems: filteredBlogs.length,
      itemsPerPage,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    },
    actions: {
      goToPage,
      nextPage,
      prevPage,
      deleteBlog: handleDelete,
    },
  };
}

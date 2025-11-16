import { useMutation, useQuery } from '@tanstack/react-query';
import { generateBlogFromCommit, generateBlogFromPR, getBlog, getAllBlogs } from '../api/blog';

/**
 * Custom hooks for blog operations using TanStack Query
 */

/**
 * Hook to generate blog from commit
 */
export const useGenerateBlogFromCommit = () => {
  return useMutation({
    mutationFn: ({ owner, repo, sha }) => generateBlogFromCommit(owner, repo, sha),
  });
};

/**
 * Hook to generate blog from pull request
 */
export const useGenerateBlogFromPR = () => {
  return useMutation({
    mutationFn: ({ owner, repo, pullNumber }) => generateBlogFromPR(owner, repo, pullNumber),
  });
};

/**
 * Hook to fetch a single blog
 */
export const useBlog = (blogId) => {
  return useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => getBlog(blogId),
    enabled: !!blogId,
  });
};

/**
 * Hook to fetch all blogs
 */
export const useAllBlogs = (limit = 50) => {
  return useQuery({
    queryKey: ['blogs', limit],
    queryFn: () => getAllBlogs(limit),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

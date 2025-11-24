import { useCallback } from 'react';
import { generateBlogFromCommit, generateBlogFromPR } from '../api/blog';
import { useBlogContext } from '../contexts/BlogContext';
import { useAsync } from './useAsync';

/**
 * Custom hooks for blog operations with Context integration
 */

/**
 * Hook to generate blog from commit and save to context
 */
export const useGenerateBlogFromCommit = () => {
  const { actions } = useBlogContext();
  const { execute, isLoading, error } = useAsync(generateBlogFromCommit);

  const generateAndSave = useCallback(
    async (owner, repo, sha) => {
      try {
        actions.setStatus('loading');
        const result = await execute(owner, repo, sha);
        
        // Save to context (which syncs to localStorage)
        const savedPost = actions.addPost({
          content: result.content,
          metadata: {
            type: 'commit',
            owner,
            repo,
            sha,
            generatedAt: new Date().toISOString(),
          },
        });
        
        actions.setStatus('success');
        return savedPost;
      } catch (err) {
        actions.setError(err.message || 'Failed to generate blog from commit');
        throw err;
      }
    },
    [execute, actions]
  );

  return { generateAndSave, isLoading, error };
};

/**
 * Hook to generate blog from pull request and save to context
 */
export const useGenerateBlogFromPR = () => {
  const { actions } = useBlogContext();
  const { execute, isLoading, error } = useAsync(generateBlogFromPR);

  const generateAndSave = useCallback(
    async (owner, repo, pullNumber) => {
      try {
        actions.setStatus('loading');
        const result = await execute(owner, repo, pullNumber);
        
        // Save to context (which syncs to localStorage)
        const savedPost = actions.addPost({
          content: result.content,
          metadata: {
            type: 'pr',
            owner,
            repo,
            pullNumber,
            generatedAt: new Date().toISOString(),
          },
        });
        
        actions.setStatus('success');
        return savedPost;
      } catch (err) {
        actions.setError(err.message || 'Failed to generate blog from PR');
        throw err;
      }
    },
    [execute, actions]
  );

  return { generateAndSave, isLoading, error };
};

/**
 * Hook to access blog list from context
 */
export const useBlogList = () => {
  const { state } = useBlogContext();
  return {
    posts: state.posts,
    isLoading: state.status === 'loading',
    error: state.error,
  };
};

/**
 * Hook to access current blog post
 */
export const useCurrentBlog = () => {
  const { state, actions } = useBlogContext();
  
  return {
    currentPost: state.currentPost,
    setCurrentPost: actions.setCurrentPost,
  };
};

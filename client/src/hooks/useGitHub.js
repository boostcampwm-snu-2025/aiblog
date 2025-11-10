import { useQuery } from '@tanstack/react-query';
import { fetchRepository, fetchCommits, fetchPullRequests } from '../api/github';

/**
 * Custom Hooks using TanStack Query
 * 
 * Purpose: Manage server state (GitHub data)
 * - Automatic caching
 * - Loading and error states
 * - Automatic refetching
 * - Request deduplication
 * 
 * Why TanStack Query?
 * - Best-in-class server state management
 * - Automatic caching reduces API calls
 * - Built-in loading/error handling
 * - Perfect for REST API integration
 */

/**
 * Hook to fetch repository information
 */
export const useRepository = (owner, repo) => {
  return useQuery({
    queryKey: ['repository', owner, repo],
    queryFn: () => fetchRepository(owner, repo),
    enabled: !!(owner && repo), // Only fetch if both values exist
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch commits
 */
export const useCommits = (owner, repo, options = {}) => {
  return useQuery({
    queryKey: ['commits', owner, repo, options],
    queryFn: () => fetchCommits(owner, repo, options),
    enabled: !!(owner && repo),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch pull requests
 */
export const usePullRequests = (owner, repo, options = {}) => {
  return useQuery({
    queryKey: ['pullRequests', owner, repo, options],
    queryFn: () => fetchPullRequests(owner, repo, options),
    enabled: !!(owner && repo),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

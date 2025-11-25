import { useMutation } from "@tanstack/react-query";
import { generateBlogPost } from "@shared/api";
import type { GenerateBlogPostRequest, GenerateBlogPostResponse } from "@shared/api/types";

export type UseBlogPostGenerationReturn = {
  blogPost: string | null;
  blogPostTitle: string | null;
  isLoading: boolean;
  error: Error | null;
  generateBlogPost: (request: GenerateBlogPostRequest) => Promise<void>;
  reset: () => void;
};

/**
 * Hook for generating blog posts from PR summaries
 * Uses React Query mutation for state management
 * 
 * @returns {UseBlogPostGenerationReturn} Blog post data, loading state, error, and generate function
 * 
 * @example
 * ```tsx
 * const { blogPost, isLoading, generateBlogPost } = useBlogPostGeneration();
 * await generateBlogPost({ url, pullNumber, summary });
 * ```
 */
export function useBlogPostGeneration(): UseBlogPostGenerationReturn {
  const mutation = useMutation<GenerateBlogPostResponse, Error, GenerateBlogPostRequest>({
    mutationFn: generateBlogPost,
  });

  return {
    blogPost: mutation.data?.blogPost ?? null,
    blogPostTitle: mutation.data?.blogPostTitle ?? null,
    isLoading: mutation.isPending,
    error: mutation.error,
    generateBlogPost: async (request: GenerateBlogPostRequest) => {
      await mutation.mutateAsync(request);
    },
    reset: mutation.reset,
  };
}


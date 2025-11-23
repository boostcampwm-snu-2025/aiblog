import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveBlogPost } from "@shared/api";
import type { SaveBlogPostRequest, SaveBlogPostResponse } from "@shared/api/types";

export type UseBlogPostSaveReturn = {
  savedId: string | null;
  isSaving: boolean;
  error: Error | null;
  saveBlogPost: (request: SaveBlogPostRequest) => Promise<boolean>;
  reset: () => void;
};

/**
 * Hook for saving blog posts to the server
 * Invalidates blog-posts query cache on success
 * 
 * @returns {UseBlogPostSaveReturn} Saved ID, loading state, error, and save function
 * 
 * @example
 * ```tsx
 * const { savedId, isSaving, saveBlogPost } = useBlogPostSave();
 * const success = await saveBlogPost({ url, pullNumber, blogPost, summary, title });
 * ```
 */
export function useBlogPostSave(): UseBlogPostSaveReturn {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<SaveBlogPostResponse, Error, SaveBlogPostRequest>({
    mutationFn: saveBlogPost,
    onSuccess: () => {
      // Invalidate blog posts cache to refetch the list
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });

  return {
    savedId: mutation.data?.id ?? null,
    isSaving: mutation.isPending,
    error: mutation.error,
    saveBlogPost: async (request: SaveBlogPostRequest): Promise<boolean> => {
      try {
        await mutation.mutateAsync(request);
        return true;
      } catch (error) {
        return false;
      }
    },
    reset: mutation.reset,
  };
}


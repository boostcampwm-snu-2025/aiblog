import { useMutation } from "@tanstack/react-query";
import { generatePRSummary } from "@shared/api";
import type { GeneratePRSummaryRequest, GeneratePRSummaryResponse } from "@shared/api/types";

export type UsePRSummaryReturn = {
  summary: string | null;
  isLoading: boolean;
  error: Error | null;
  generateSummary: (request: GeneratePRSummaryRequest) => Promise<void>;
};

/**
 * Hook for generating PR summaries
 * Uses React Query mutation for better state management
 * 
 * @returns {UsePRSummaryReturn} Summary data, loading state, error, and generate function
 * 
 * @example
 * ```tsx
 * const { summary, isLoading, generateSummary } = usePRSummary();
 * await generateSummary({ url: 'https://github.com/owner/repo', pullNumber: 123 });
 * ```
 */
export function usePRSummary(): UsePRSummaryReturn {
  const mutation = useMutation<GeneratePRSummaryResponse, Error, GeneratePRSummaryRequest>({
    mutationFn: generatePRSummary,
  });

  return {
    summary: mutation.data?.summary ?? null,
    isLoading: mutation.isPending,
    error: mutation.error,
    generateSummary: async (request: GeneratePRSummaryRequest) => {
      await mutation.mutateAsync(request);
    },
  };
}


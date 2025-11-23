import { useSuspenseQuery } from "@tanstack/react-query";
import { generatePRSummary } from "@shared/api";
import type { GeneratePRSummaryResponse } from "@shared/api/types";

type UsePRSummarySuspenseParams = {
  repoUrl: string | null;
  prNumber: number | null;
};

export function usePRSummarySuspense({ repoUrl, prNumber }: UsePRSummarySuspenseParams) {
  const query = useSuspenseQuery<GeneratePRSummaryResponse, Error>({
    queryKey: ["pr-summary", repoUrl, prNumber],
    queryFn: () => {
      if (!repoUrl || !prNumber) {
        throw new Error("Repository URL and PR number are required");
      }
      return generatePRSummary({ url: repoUrl, pullNumber: prNumber });
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    summary: query.data.summary,
  };
}


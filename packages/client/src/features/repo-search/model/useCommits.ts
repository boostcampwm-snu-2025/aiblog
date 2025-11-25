import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchCommits } from "@shared/api";
import type { CommitsResponse } from "@shared/api/types";

export function useCommits(
  url: string | undefined,
  page: number = 1,
  perPage: number = 30
): UseQueryResult<CommitsResponse, Error> {
  return useQuery<CommitsResponse, Error>({
    queryKey: ["commits", url, page, perPage],
    queryFn: () => {
      if (!url) {
        throw new Error("GitHub repository URL is required");
      }
      return fetchCommits(url, page, perPage);
    },
    enabled: !!url,
  });
}

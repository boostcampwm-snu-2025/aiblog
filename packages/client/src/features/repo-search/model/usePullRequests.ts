import { useQuery } from "@tanstack/react-query";
import { fetchPullRequests } from "@shared/api";
import type { PullRequestsResponse } from "@shared/api/types";

export function usePullRequests(
  url: string | undefined,
  page: number = 1,
  perPage: number = 30,
  state: "open" | "closed" | "all" = "all"
) {
  return useQuery<PullRequestsResponse>({
    queryKey: ["pullRequests", url, page, perPage, state],
    queryFn: () => {
      if (!url) {
        throw new Error("GitHub repository URL is required");
      }
      return fetchPullRequests(url, page, perPage, state);
    },
    enabled: !!url,
  });
}

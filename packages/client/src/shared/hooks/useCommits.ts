import { useQuery } from "@tanstack/react-query";
import { fetchCommits } from "../api";
import type { CommitsResponse } from "../api/types";

export function useCommits(
  url: string | undefined,
  page: number = 1,
  perPage: number = 30
) {
  return useQuery<CommitsResponse>({
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

import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/services/request";
import type { PullRequest } from "@/types/pullrequest";

export type GetPullRequestsParams = {
  owner: string;
  repository: string;
};

const getPullRequests = async ({ owner, repository }: GetPullRequestsParams): Promise<PullRequest[]> => {
  return getRequest<PullRequest[]>(`/repos/${owner}/${repository}/pulls`);
};

export const usePullRequests = ({ owner, repository }: GetPullRequestsParams) => {
  return useQuery({
    queryKey: ["pullRequests", owner, repository],
    queryFn: () => getPullRequests({ owner, repository }),
  });
};

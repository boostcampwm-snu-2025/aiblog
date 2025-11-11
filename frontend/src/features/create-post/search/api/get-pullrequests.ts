import { useQuery } from "@tanstack/react-query";

import type { QueryConfig } from "@/services/react-query";
import { getRequest } from "@/services/request";
import type { PullRequest } from "@/types/pullrequest";

export type GetPullRequestsParams = {
  owner: string;
  repository: string;
};

const getPullRequests = async ({ owner, repository }: GetPullRequestsParams): Promise<PullRequest[]> => {
  return getRequest<PullRequest[]>(`/repos/${owner}/${repository}/pulls`);
};

type UsePullRequestsOptions = {
  params: GetPullRequestsParams;
  queryConfig?: QueryConfig<PullRequest[]>;
};

export const usePullRequests = ({ params, queryConfig }: UsePullRequestsOptions) => {
  return useQuery({
    queryKey: ["pullRequests", params.owner, params.repository] as const,
    queryFn: () => getPullRequests(params),
    ...queryConfig,
  });
};

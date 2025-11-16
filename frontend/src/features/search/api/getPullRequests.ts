import { useQuery } from "@tanstack/react-query";

import type { PullRequest } from "@/entities/pullrequest";
import type { QueryConfig } from "@/services/react-query";
import { getRequest } from "@/services/request";

const BASE_URL = "/github";

type GetPullRequestsParams = {
  owner: string;
  repository: string;
};

const getPullRequests = async ({ owner, repository }: GetPullRequestsParams) => {
  return getRequest<PullRequest[]>(`${BASE_URL}/repos/${owner}/${repository}/pulls`);
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

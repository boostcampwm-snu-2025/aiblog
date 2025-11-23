import { useQuery } from "@tanstack/react-query";

import type { GetPullRequestsResponse } from "@/entities/pullrequest";
import { getRequest } from "@/shared/services/api";
import type { QueryConfig } from "@/shared/services/react-query";

const BASE_URL = "/github";

type GetPullRequestsParams = {
  owner: string;
  repository: string;
  page?: number;
  perPage?: number;
};

const getPullRequests = async ({ owner, repository, page = 1, perPage = 10 }: GetPullRequestsParams) => {
  return getRequest<GetPullRequestsResponse>(
    `${BASE_URL}/repos/${owner}/${repository}/pulls?page=${page}&per_page=${perPage}`,
  );
};

type UsePullRequestsOptions = {
  params: GetPullRequestsParams;
  queryConfig?: QueryConfig<GetPullRequestsResponse>;
};

export const useQueryPullRequests = ({ params, queryConfig }: UsePullRequestsOptions) => {
  return useQuery({
    queryKey: ["pullRequests", params.owner, params.repository, params.page] as const,
    queryFn: () => getPullRequests(params),
    ...queryConfig,
  });
};

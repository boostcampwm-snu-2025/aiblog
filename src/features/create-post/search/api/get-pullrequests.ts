import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/services/request";
import type { PullRequest } from "@/types";

type GetPullRequestsParams = {
  owner: string;
  repository: string;
};

const getPullRequests = async ({ owner, repository }: GetPullRequestsParams): Promise<PullRequest[]> => {
  return mock;
  return getRequest<PullRequest[]>(`/repos/${owner}/${repository}/pulls`);
};

type UsePullRequestsOptions = {
  owner: string;
  repository: string;
};

export const usePullRequests = ({ owner, repository }: UsePullRequestsOptions) => {
  return useQuery({
    queryKey: ["pullRequests", owner, repository],
    queryFn: () => getPullRequests({ owner, repository }),
  });
};

const mock: PullRequest[] = [
  {
    id: 1,
    number: 28547,
    title: "Add support for React Server Components",
    state: "open",
    user: { login: "gaearon" },
    createdAt: "2024-11-05T10:30:00Z",
    mergedAt: null,
    draft: false,
  },
  {
    id: 2,
    number: 28546,
    title: "Fix hydration error in Suspense boundaries",
    state: "closed",
    user: { login: "sophiebits" },
    createdAt: "2024-11-04T15:20:00Z",
    mergedAt: "2024-11-04T16:00:00Z",
    draft: false,
  },
  {
    id: 3,
    number: 28545,
    title: "Improve performance of useEffect cleanup",
    state: "closed",
    user: { login: "acdlite" },
    createdAt: "2024-11-03T09:15:00Z",
    mergedAt: null,
    draft: false,
  },
];

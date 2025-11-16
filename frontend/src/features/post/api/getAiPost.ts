import { useQuery } from "@tanstack/react-query";

import type { QueryConfig } from "@/services/react-query";
import { getRequest } from "@/services/request";

import { BASE_URL } from "./constants";

type GetAiPostRequestParams = {
  owner: string;
  repository: string;
  prNumber: number;
};

type GetAiPostResponse = {
  title: string;
  content: string;
};

const getAiPost = async ({ owner, repository, prNumber }: GetAiPostRequestParams) => {
  return getRequest<GetAiPostResponse>(`${BASE_URL}/ai?owner=${owner}&repository=${repository}&prNumber=${prNumber}`);
};

type UseAiPostOptions = {
  params: GetAiPostRequestParams;
  queryConfig?: QueryConfig<GetAiPostResponse>;
};

// TODO: 쿼리키 상수로 관리
export const useAiPost = ({ params, queryConfig }: UseAiPostOptions) => {
  return useQuery({
    queryKey: ["aiPost", ...Object.values(params)] as const,
    queryFn: () => getAiPost(params),
    ...queryConfig,
  });
};

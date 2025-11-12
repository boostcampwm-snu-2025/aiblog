import { QueryCache, QueryClient, type UseQueryOptions } from "@tanstack/react-query";

import { handleMutationError, handleQueryError } from "./error";

export type QueryConfig<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError, TData, readonly unknown[]>,
  "queryKey" | "queryFn"
>;

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: handleMutationError,
    },
  },
  queryCache: new QueryCache({ onError: handleQueryError }),
});

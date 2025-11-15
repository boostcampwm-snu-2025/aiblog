import { QueryCache, QueryClient, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";

import { handleMutationError, handleQueryError } from "./error";

export type QueryConfig<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError, TData, readonly unknown[]>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<TData = unknown, TVariables = unknown, TError = Error> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  "queryKey" | "mutationFn"
>;

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: handleMutationError,
    },
  },
  queryCache: new QueryCache({ onError: handleQueryError }),
});

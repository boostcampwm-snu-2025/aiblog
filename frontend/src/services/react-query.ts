import type { UseQueryOptions } from "@tanstack/react-query";

export type QueryConfig<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError, TData, readonly unknown[]>,
  "queryKey" | "queryFn"
>;

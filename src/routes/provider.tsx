import type { PropsWithChildren } from "react";

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { handleMutationError, handleQueryError } from "@/services/error";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: handleMutationError,
    },
  },
  queryCache: new QueryCache({ onError: handleQueryError }),
});

export default function AppProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

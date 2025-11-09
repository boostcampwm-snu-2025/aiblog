import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { queryClient } from "../shared/lib/queryClient";
import { router } from "./routes";

type ProvidersProps = {
  children?: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

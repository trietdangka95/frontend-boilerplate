"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { getQueryClient } from "@/services/query/query-client";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Avoid initializing the client in state above a Suspense boundary: React can discard that render.
  // Source: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#initial-setup
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

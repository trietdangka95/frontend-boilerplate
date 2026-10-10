"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { ReactNode } from "react";

import { AppToastProvider } from "@/components/common/AppToast";
import { MuiProvider } from "@/providers/MuiProvider";
import { QueryProvider } from "@/providers/QueryProvider";

interface AppProvidersProps {
  children: ReactNode;
  nonce?: string;
}

export function AppProviders({ children, nonce }: AppProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true, nonce }}>
      <MuiProvider>
        <QueryProvider>
          {children}
          <AppToastProvider />
        </QueryProvider>
      </MuiProvider>
    </AppRouterCacheProvider>
  );
}

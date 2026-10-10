import type { Metadata } from "next";
import type { ReactNode } from "react";
import Box from "@mui/material/Box";

import { MAIN_CONTENT_ID } from "@/components/layout/SkipLink";
import { designTokens } from "@/theme/tokens";
import { notFound } from "next/navigation";
import { isDemoAuthEnabled } from "@/features/auth/server/demo-mode";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Authentication",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  if (!isDemoAuthEnabled()) notFound();
  return (
    <Box
      component="main"
      id={MAIN_CONTENT_ID}
      sx={{
        alignItems: "center",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        minHeight: "100dvh",
        p: 3,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: designTokens.layout.authContentMaxWidth }}>
        <p className="mb-4 text-sm text-muted">
          Local demo only. No real account is created or verified.
        </p>
        {children}
      </Box>
    </Box>
  );
}

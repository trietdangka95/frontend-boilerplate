import type { Metadata } from "next";
import type { ReactNode } from "react";
import Box from "@mui/material/Box";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        minHeight: "100dvh",
        p: 3,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 440 }}>{children}</Box>
    </Box>
  );
}

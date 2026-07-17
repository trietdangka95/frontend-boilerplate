import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Northstar UI Boilerplate",
    template: "%s | Northstar UI Boilerplate",
  },
  description:
    "A production-ready Next.js, MUI, and Tailwind design-system foundation for enterprise applications.",
  openGraph: {
    type: "website",
    siteName: "Northstar UI Boilerplate",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import type { ReactNode } from "react";

import { SkipLink } from "@/components/layout/SkipLink";
import { getPublicEnv } from "@/utils/env";

import "./globals.css";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  metadataBase: new URL(getPublicEnv().NEXT_PUBLIC_SITE_URL),
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

export default async function RootLayout({ children }: RootLayoutProps) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        {nonce ? (
          <Script id="runtime-style-nonce" nonce={nonce} strategy="beforeInteractive">
            {`window.__nonce__=${JSON.stringify(nonce)};`}
          </Script>
        ) : null}
        <SkipLink />
        <InitColorSchemeScript attribute="class" defaultMode="system" nonce={nonce} />
        <AppProviders nonce={nonce}>{children}</AppProviders>
      </body>
    </html>
  );
}

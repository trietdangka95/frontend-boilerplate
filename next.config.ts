import type { NextConfig } from "next";
import { getPublicEnv } from "./utils/env";

// Validate public build-time values before Next emits client bundles or metadata.
getPublicEnv();

const GLOBAL_SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        headers: GLOBAL_SECURITY_HEADERS,
        source: "/(.*)",
      },
    ];
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;

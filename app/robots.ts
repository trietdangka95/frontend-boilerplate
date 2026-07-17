import type { MetadataRoute } from "next";

import { getPublicEnv } from "@/utils/env";

export default function robots(): MetadataRoute.Robots {
  const env = getPublicEnv();
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

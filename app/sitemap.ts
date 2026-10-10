import type { MetadataRoute } from "next";

import { getPublicEnv } from "@/utils/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const env = getPublicEnv();
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}

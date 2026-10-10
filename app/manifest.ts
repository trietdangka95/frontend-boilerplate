import type { MetadataRoute } from "next";

import { designTokens } from "@/theme/tokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Enterprise Frontend Boilerplate",
    short_name: "Frontend Boilerplate",
    description: "A production-ready Next.js, MUI, and Tailwind design-system foundation",
    start_url: "/",
    display: "standalone",
    background_color: designTokens.color.semantic.light.background.canvas,
    theme_color: designTokens.color.semantic.light.primary.main,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

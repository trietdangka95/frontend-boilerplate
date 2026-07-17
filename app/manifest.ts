import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Enterprise Frontend Boilerplate",
    short_name: "Frontend Boilerplate",
    description: "A production-ready Next.js, MUI, and Tailwind design-system foundation",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0d766e",
  };
}

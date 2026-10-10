import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      include: [
        "{app,components,features,providers,services,stores,theme,utils}/**/*.{ts,tsx}",
        "proxy.ts",
      ],
      exclude: ["**/*.test.{ts,tsx}", "**/*.d.ts", "**/types.ts", "**/index.ts"],
      reporter: ["text-summary", "html", "lcov"],
      thresholds: { statements: 80, lines: 80, functions: 80, branches: 70 },
    },
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
  },
});

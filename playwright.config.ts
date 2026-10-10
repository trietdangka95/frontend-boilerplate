import { randomBytes } from "node:crypto";
import { defineConfig, devices } from "@playwright/test";

const CORE_PORT = 3101;
const DEMO_PORT = 3102;
const coreUrl = `http://127.0.0.1:${CORE_PORT}`;
const demoUrl = `http://127.0.0.1:${DEMO_PORT}`;
const SERVER_TIMEOUT_MS = 120_000;
const TEST_TIMEOUT_MS = 30_000;
const bundlerFlag = process.env.E2E_WEBPACK === "true" ? " --webpack" : "";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: TEST_TIMEOUT_MS,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    ...(["light", "dark"] as const).flatMap((colorScheme) => [
      {
        name: `desktop-${colorScheme}`,
        testMatch: "core.spec.ts",
        use: { ...devices["Desktop Chrome"], baseURL: coreUrl, colorScheme },
      },
      {
        name: `mobile-${colorScheme}`,
        testMatch: "core.spec.ts",
        use: { ...devices["Pixel 7"], baseURL: coreUrl, colorScheme },
      },
    ]),
    {
      name: "demo-auth",
      testMatch: "demo.spec.ts",
      use: { ...devices["Desktop Chrome"], baseURL: demoUrl },
    },
  ],
  webServer: [
    {
      command: `corepack pnpm build${bundlerFlag} && corepack pnpm start --hostname 127.0.0.1 --port ${CORE_PORT}`,
      url: `${coreUrl}/api/health`,
      timeout: SERVER_TIMEOUT_MS,
      reuseExistingServer: false,
      env: {
        NEXT_PUBLIC_APP_ENV: "test",
        NEXT_PUBLIC_API_BASE_URL: `${coreUrl}/api`,
        NEXT_PUBLIC_SITE_URL: coreUrl,
        ENABLE_DEMO_AUTH: "true",
      },
    },
    {
      command: `corepack pnpm dev${bundlerFlag} --hostname 127.0.0.1 --port ${DEMO_PORT}`,
      url: `${demoUrl}/api/health`,
      timeout: SERVER_TIMEOUT_MS,
      reuseExistingServer: false,
      env: {
        NEXT_PUBLIC_APP_ENV: "test",
        NEXT_PUBLIC_API_BASE_URL: `${demoUrl}/api`,
        NEXT_PUBLIC_SITE_URL: demoUrl,
        ENABLE_DEMO_AUTH: "true",
        DEMO_SESSION_SECRET: randomBytes(32).toString("hex"),
      },
    },
  ],
});

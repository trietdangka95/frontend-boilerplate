// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { isDemoAuthEnabled } from "./demo-mode";

afterEach(() => vi.unstubAllEnvs());
describe("demo authentication boundary", () => {
  it("requires explicit opt-in", () => {
    vi.stubEnv("ENABLE_DEMO_AUTH", "false");
    expect(isDemoAuthEnabled()).toBe(false);
    vi.stubEnv("ENABLE_DEMO_AUTH", "true");
    expect(isDemoAuthEnabled()).toBe(true);
  });
  it("cannot enable demo authentication in a production runtime", () => {
    vi.stubEnv("ENABLE_DEMO_AUTH", "true");
    vi.stubEnv("NODE_ENV", "production");
    expect(isDemoAuthEnabled()).toBe(false);
  });
});

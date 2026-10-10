import { describe, expect, it } from "vitest";

import { getPublicEnv } from "./env";

describe("getPublicEnv", () => {
  it.each(["staging", "production"])("requires explicit deployment URLs for %s", (environment) => {
    expect(() => getPublicEnv({ NEXT_PUBLIC_APP_ENV: environment })).toThrow(
      "NEXT_PUBLIC_API_BASE_URL",
    );
    expect(() =>
      getPublicEnv({
        NEXT_PUBLIC_APP_ENV: environment,
        NEXT_PUBLIC_API_BASE_URL: "https://api.example.com",
      }),
    ).toThrow("NEXT_PUBLIC_SITE_URL");
  });

  it("does not treat a production runtime as local development", () => {
    expect(() => getPublicEnv({ NODE_ENV: "production" })).toThrow("NEXT_PUBLIC_API_BASE_URL");
    expect(() =>
      getPublicEnv({ NODE_ENV: "production", NEXT_PUBLIC_APP_ENV: "development" }),
    ).toThrow("NEXT_PUBLIC_API_BASE_URL");
  });

  it("rejects localhost deployment URLs and credential-bearing URLs", () => {
    expect(() =>
      getPublicEnv({
        NEXT_PUBLIC_APP_ENV: "production",
        NEXT_PUBLIC_API_BASE_URL: "http://localhost:3000/api",
        NEXT_PUBLIC_SITE_URL: "https://example.com",
      }),
    ).toThrow();
    expect(() =>
      getPublicEnv({ NEXT_PUBLIC_API_BASE_URL: "https://user:password@example.com" }),
    ).toThrow();
  });
  it("returns safe local defaults for optional public values", () => {
    expect(getPublicEnv({})).toEqual({
      NEXT_PUBLIC_API_BASE_URL: "http://localhost:3000/api",
      NEXT_PUBLIC_APP_ENV: "development",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    });
  });

  it("rejects invalid public URLs", () => {
    expect(() =>
      getPublicEnv({
        NEXT_PUBLIC_API_BASE_URL: "not-a-url",
      }),
    ).toThrow("NEXT_PUBLIC_API_BASE_URL");
  });
});

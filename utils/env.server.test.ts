// @vitest-environment node

import { describe, expect, it } from "vitest";

import { getServerEnv } from "./env.server";

describe("getServerEnv", () => {
  it("returns public values with server-only defaults", () => {
    expect(
      getServerEnv({
        NEXT_PUBLIC_API_BASE_URL: "https://api.example.com",
        NEXT_PUBLIC_APP_ENV: "test",
      }),
    ).toEqual({
      API_REFRESH_ENDPOINT: "/auth/refresh",
      NEXT_PUBLIC_API_BASE_URL: "https://api.example.com",
      NEXT_PUBLIC_APP_ENV: "test",
    });
  });

  it("rejects refresh endpoints that are not root-relative", () => {
    expect(() =>
      getServerEnv({
        API_REFRESH_ENDPOINT: "https://api.example.com/auth/refresh",
      }),
    ).toThrow("API_REFRESH_ENDPOINT");
  });
});

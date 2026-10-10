// @vitest-environment node

import { describe, expect, it } from "vitest";

import { getDemoSessionSecret, getServerEnv } from "./env.server";

const VALID_DEMO_SESSION_SECRET = "test-demo-session-secret-that-is-long-enough";

describe("getServerEnv", () => {
  it("returns public values with server-only defaults", () => {
    expect(
      getServerEnv({
        NEXT_PUBLIC_API_BASE_URL: "https://api.example.com",
        NEXT_PUBLIC_APP_ENV: "test",
      }),
    ).toEqual({
      NEXT_PUBLIC_API_BASE_URL: "https://api.example.com",
      NEXT_PUBLIC_APP_ENV: "test",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    });
  });

  it("rejects invalid public deployment settings on the server", () => {
    expect(() =>
      getServerEnv({
        NEXT_PUBLIC_API_BASE_URL: "not-a-url",
      }),
    ).toThrow("NEXT_PUBLIC_API_BASE_URL");
  });
});

describe("getDemoSessionSecret", () => {
  it("returns a secret with enough entropy for signing", () => {
    expect(
      getDemoSessionSecret({
        DEMO_SESSION_SECRET: VALID_DEMO_SESSION_SECRET,
      }),
    ).toBe(VALID_DEMO_SESSION_SECRET);
  });

  it("rejects missing or short secrets", () => {
    expect(() => getDemoSessionSecret({})).toThrow("DEMO_SESSION_SECRET");
    expect(() =>
      getDemoSessionSecret({
        DEMO_SESSION_SECRET: "too-short",
      }),
    ).toThrow("DEMO_SESSION_SECRET");
  });

  it("rejects the documented placeholder value", () => {
    expect(() =>
      getDemoSessionSecret({
        DEMO_SESSION_SECRET: "replace-with-a-unique-random-secret-at-least-32-characters-long",
      }),
    ).toThrow("DEMO_SESSION_SECRET");
  });
});

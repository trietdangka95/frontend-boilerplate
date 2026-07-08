import { describe, expect, it } from "vitest";

import { getPublicEnv } from "./env";

describe("getPublicEnv", () => {
  it("returns safe local defaults for optional public values", () => {
    expect(getPublicEnv({})).toEqual({
      NEXT_PUBLIC_API_BASE_URL: "http://localhost:3000/api",
      NEXT_PUBLIC_APP_ENV: "development",
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

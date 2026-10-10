// @vitest-environment node

import { describe, expect, it } from "vitest";

import { getQueryClient, makeQueryClient } from "./query-client";

describe("query client on the server", () => {
  it("returns a fresh QueryClient per server call", () => {
    expect(getQueryClient()).not.toBe(getQueryClient());
  });

  it("uses server-safe cache and retry defaults", () => {
    const defaults = makeQueryClient().getDefaultOptions().queries;

    expect(defaults?.gcTime).toBe(Infinity);
    expect(defaults?.retry).toBe(0);
  });
});

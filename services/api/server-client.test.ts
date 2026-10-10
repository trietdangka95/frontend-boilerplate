// @vitest-environment node
import type { AxiosAdapter } from "axios";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { createServerApiClient } from "./server-client";

describe("server request clients", () => {
  it("never transfers credentials between concurrent requests", async () => {
    const first = createServerApiClient("https://api.example.com", "alice");
    const second = createServerApiClient("https://api.example.com", "bob");
    const anonymous = createServerApiClient("https://api.example.com");
    const adapter: AxiosAdapter = async (config) => ({
      config,
      data: config.headers.get("Authorization") ?? null,
      headers: {},
      status: 200,
      statusText: "OK",
    });
    for (const client of [first, second, anonymous]) client.defaults.adapter = adapter;
    const responses = await Promise.all([
      first.get("/me"),
      second.get("/me"),
      anonymous.get("/me"),
    ]);
    expect(responses.map((response) => response.data)).toEqual([
      "Bearer alice",
      "Bearer bob",
      null,
    ]);
  });
});

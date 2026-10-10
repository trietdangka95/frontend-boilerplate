import type { AxiosAdapter } from "axios";
import { describe, expect, it } from "vitest";
import { requestTokenRefresh } from "./refresh-token";

function adapterFor(data: unknown): AxiosAdapter {
  return async (config) => ({ config, data, headers: {}, status: 200, statusText: "OK" });
}
describe("refresh response boundary", () => {
  it.each([{ accessToken: "fresh" }, { data: { accessToken: "fresh" } }])(
    "accepts the documented token envelope",
    async (data) => {
      await expect(
        requestTokenRefresh({ baseURL: "https://api.example.com", adapter: adapterFor(data) }),
      ).resolves.toBe("fresh");
    },
  );
  it("rejects malformed external token data", async () => {
    await expect(
      requestTokenRefresh({
        baseURL: "https://api.example.com",
        adapter: adapterFor({ accessToken: { secret: "object" } }),
      }),
    ).rejects.toThrow();
  });
  it("uses the explicitly configured refresh endpoint", async () => {
    const adapter: AxiosAdapter = async (config) => {
      expect(config.url).toBe("/session/renew");
      return {
        config,
        data: { accessToken: "renewed" },
        headers: {},
        status: 200,
        statusText: "OK",
      };
    };
    await expect(
      requestTokenRefresh({
        baseURL: "https://api.example.com",
        refreshEndpoint: "/session/renew",
        adapter,
      }),
    ).resolves.toBe("renewed");
  });
});

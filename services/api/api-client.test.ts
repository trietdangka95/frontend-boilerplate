import {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppApiError } from "./api-error";
import { createAccessTokenStore } from "./auth-token";
import { createApiClient } from "./api-client";

const tokens = createAccessTokenStore();
const setAccessToken = tokens.set;
const getAccessToken = tokens.get;
const clearAccessToken = () => tokens.set(null);

function createResponse<TData>(
  config: InternalAxiosRequestConfig,
  data: TData,
  status = 200,
): AxiosResponse<TData> {
  return {
    config,
    data,
    headers: {},
    request: {},
    status,
    statusText: status >= 400 ? "Error" : "OK",
  };
}

function rejectWithStatus<TData>(
  config: InternalAxiosRequestConfig,
  status: number,
  data: TData,
  headers: Record<string, string> = {},
): never {
  const response = {
    ...createResponse(config, data, status),
    headers,
  };

  throw new AxiosError(
    `Request failed with status code ${status}`,
    undefined,
    config,
    {},
    response,
  );
}

describe("createApiClient", () => {
  it("isolates credentials across client instances", async () => {
    const firstTokens = createAccessTokenStore();
    const secondTokens = createAccessTokenStore();
    firstTokens.set("first-user");
    secondTokens.set("second-user");
    const adapter: AxiosAdapter = async (config) =>
      createResponse(config, config.headers.get("Authorization") ?? null);
    const first = createApiClient({ adapter, tokenStore: firstTokens });
    const second = createApiClient({ adapter, tokenStore: secondTokens });
    const anonymous = createApiClient({ adapter });
    const responses = await Promise.all([
      first.get("/me"),
      second.get("/me"),
      anonymous.get("/me"),
    ]);
    expect(responses.map((response) => response.data)).toEqual([
      "Bearer first-user",
      "Bearer second-user",
      null,
    ]);
  });
  it("does not trigger refresh for cookie-only authentication", async () => {
    let attempts = 0;
    const adapter: AxiosAdapter = async (config) => {
      attempts += 1;
      rejectWithStatus(config, 401, { error: { code: "UNAUTHENTICATED", message: "Sign in" } });
    };
    await expect(createApiClient({ adapter }).get("/me")).rejects.toMatchObject({
      status: 401,
      code: "UNAUTHENTICATED",
    });
    expect(attempts).toBe(1);
  });
  afterEach(() => {
    clearAccessToken();
    vi.restoreAllMocks();
  });

  it("configures base URL, timeout, credentials, authorization, and request IDs", async () => {
    setAccessToken("access-token");
    const seenConfigs: InternalAxiosRequestConfig[] = [];
    const adapter: AxiosAdapter = async (config) => {
      seenConfigs.push(config);
      return createResponse(config, { ok: true });
    };
    const requestIdGenerator = vi.fn(() => "request-id-1");
    const apiClient = createApiClient({
      tokenStore: tokens,
      adapter,
      baseURL: "https://api.example.com",
      requestIdGenerator,
      timeout: 12_000,
    });

    await expect(apiClient.get("/health")).resolves.toMatchObject({
      data: { ok: true },
    });

    expect(apiClient.defaults.baseURL).toBe("https://api.example.com");
    expect(apiClient.defaults.timeout).toBe(12_000);
    expect(apiClient.defaults.withCredentials).toBe(true);
    expect(seenConfigs[0]?.headers.get("Authorization")).toBe("Bearer access-token");
    expect(seenConfigs[0]?.headers.get("X-Request-ID")).toBe("request-id-1");
    expect(requestIdGenerator).toHaveBeenCalledTimes(1);
  });

  it("normalizes API error responses into AppApiError", async () => {
    const adapter: AxiosAdapter = async (config) => {
      rejectWithStatus(
        config,
        422,
        {
          error: {
            code: "VALIDATION_ERROR",
            details: { field: "email" },
            message: "Email is invalid",
            requestId: "response-request-id",
          },
        },
        { "x-request-id": "header-request-id" },
      );
    };
    const apiClient = createApiClient({
      tokenStore: tokens,
      adapter,
      baseURL: "https://api.example.com",
      requestIdGenerator: () => "request-id-1",
    });

    await expect(apiClient.post("/users", { email: "bad" })).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      details: { field: "email" },
      message: "Email is invalid",
      requestId: "response-request-id",
      status: 422,
    });

    await expect(apiClient.post("/users", { email: "bad" })).rejects.toBeInstanceOf(AppApiError);
  });

  it("refreshes an expired access token and replays the original request", async () => {
    setAccessToken("expired-token");
    const authorizations: Array<string | undefined> = [];
    const adapter: AxiosAdapter = async (config) => {
      const authorization = config.headers.get("Authorization")?.toString();
      authorizations.push(authorization);

      if (authorization === "Bearer expired-token") {
        rejectWithStatus(config, 401, {
          error: {
            code: "UNAUTHENTICATED",
            message: "Session expired",
          },
        });
      }

      return createResponse(config, { ok: true });
    };
    const refreshAccessToken = vi.fn(async () => "fresh-token");
    const apiClient = createApiClient({
      tokenStore: tokens,
      adapter,
      baseURL: "https://api.example.com",
      refreshAccessToken,
      requestIdGenerator: () => "request-id-1",
    });

    await expect(apiClient.get("/profile")).resolves.toMatchObject({
      data: { ok: true },
    });

    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBe("fresh-token");
    expect(authorizations).toEqual(["Bearer expired-token", "Bearer fresh-token"]);
  });

  it("uses one refresh request for parallel 401 responses and replays the queued requests", async () => {
    setAccessToken("expired-token");
    const replayedUrls: string[] = [];
    const adapter: AxiosAdapter = async (config) => {
      const authorization = config.headers.get("Authorization")?.toString();

      if (authorization === "Bearer expired-token") {
        rejectWithStatus(config, 401, {
          error: {
            code: "UNAUTHENTICATED",
            message: "Session expired",
          },
        });
      }

      replayedUrls.push(config.url ?? "");
      return createResponse(config, { url: config.url });
    };
    const refreshAccessToken = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return "fresh-token";
    });
    const apiClient = createApiClient({
      tokenStore: tokens,
      adapter,
      baseURL: "https://api.example.com",
      refreshAccessToken,
      requestIdGenerator: () => "request-id-1",
    });

    const [first, second] = await Promise.all([apiClient.get("/first"), apiClient.get("/second")]);

    expect(first.data).toEqual({ url: "/first" });
    expect(second.data).toEqual({ url: "/second" });
    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(replayedUrls).toEqual(["/first", "/second"]);
    expect(getAccessToken()).toBe("fresh-token");
  });

  it("clears credentials and rejects queued requests when refresh fails", async () => {
    setAccessToken("expired-token");
    const adapter: AxiosAdapter = async (config) => {
      rejectWithStatus(config, 401, {
        error: {
          code: "UNAUTHENTICATED",
          message: "Session expired",
        },
      });
    };
    const refreshAccessToken = vi.fn(async () => {
      throw new AppApiError({
        code: "UNAUTHENTICATED",
        message: "Refresh failed",
        status: 401,
      });
    });
    const apiClient = createApiClient({
      tokenStore: tokens,
      adapter,
      baseURL: "https://api.example.com",
      refreshAccessToken,
      requestIdGenerator: () => "request-id-1",
    });

    const [first, second] = await Promise.allSettled([
      apiClient.get("/first"),
      apiClient.get("/second"),
    ]);

    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBeNull();
    expect(first.status).toBe("rejected");
    expect(second.status).toBe("rejected");
    if (first.status === "rejected" && second.status === "rejected") {
      expect(first.reason).toMatchObject({
        code: "AUTH_REFRESH_FAILED",
        message: "Unable to refresh the session. Please sign in again.",
        status: 401,
      });
      expect(second.reason).toMatchObject({
        code: "AUTH_REFRESH_FAILED",
        message: "Unable to refresh the session. Please sign in again.",
        status: 401,
      });
    }
  });
});

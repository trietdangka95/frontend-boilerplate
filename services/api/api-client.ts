import axios, {
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { getPublicEnv } from "@/utils/env";

import { createAccessTokenStore, type AccessTokenStore } from "./auth-token";
import { createAuthRefreshError, normalizeApiError } from "./api-error";
import { requestTokenRefresh, type RefreshAccessToken } from "./refresh-token";

const DEFAULT_TIMEOUT_MS = 15_000;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  __isRetryRequest?: boolean;
}

interface RefreshAccessTokenContext {
  baseURL: string;
  refreshEndpoint?: string;
  timeout: number;
}

export interface ApiClientOptions {
  tokenStore?: AccessTokenStore;
  enableRefresh?: boolean;
  adapter?: AxiosAdapter;
  baseURL?: string;
  refreshAccessToken?: (context: RefreshAccessTokenContext) => Promise<string | null>;
  refreshAdapter?: AxiosAdapter;
  refreshEndpoint?: string;
  requestIdGenerator?: () => string;
  timeout?: number;
}

function createRequestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function ensureHeaders(config: InternalAxiosRequestConfig) {
  config.headers = AxiosHeaders.from(config.headers);
  return config.headers;
}

function setAuthorizationHeader(config: InternalAxiosRequestConfig, token: string | null) {
  const headers = ensureHeaders(config);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    return;
  }

  headers.delete("Authorization");
}

function getStatus(error: unknown) {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

function getOriginalRequest(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  return error.config as RetryableRequestConfig | undefined;
}

export function createApiClient({
  tokenStore = createAccessTokenStore(),
  enableRefresh = false,
  adapter,
  baseURL = getPublicEnv().NEXT_PUBLIC_API_BASE_URL,
  refreshAccessToken,
  refreshAdapter,
  refreshEndpoint,
  requestIdGenerator = createRequestId,
  timeout = DEFAULT_TIMEOUT_MS,
}: ApiClientOptions = {}): AxiosInstance {
  const apiClient = axios.create({
    adapter,
    baseURL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    timeout,
    withCredentials: true,
  });
  const refreshAccessTokenRequest: RefreshAccessToken = () =>
    refreshAccessToken
      ? refreshAccessToken({ baseURL, refreshEndpoint, timeout })
      : requestTokenRefresh({
          adapter: refreshAdapter,
          baseURL,
          refreshEndpoint,
          timeout,
        });
  let refreshPromise: Promise<string | null> | undefined;

  function refreshOnce() {
    refreshPromise ??= refreshAccessTokenRequest()
      .then((token) => {
        tokenStore.set(token);
        return token;
      })
      .finally(() => {
        refreshPromise = undefined;
      });

    return refreshPromise;
  }

  apiClient.interceptors.request.use((config) => {
    const headers = ensureHeaders(config);

    headers.set("X-Request-ID", requestIdGenerator());
    setAuthorizationHeader(config, tokenStore.get());

    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const status = getStatus(error);
      const originalRequest = getOriginalRequest(error);

      if (
        (!enableRefresh && !refreshAccessToken) ||
        status !== 401 ||
        !originalRequest ||
        originalRequest.__isRetryRequest
      ) {
        throw normalizeApiError(error);
      }

      originalRequest.__isRetryRequest = true;

      try {
        const refreshedToken = await refreshOnce();

        if (!refreshedToken) {
          throw new Error("Refresh did not return an access token.");
        }

        setAuthorizationHeader(originalRequest, refreshedToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenStore.set(null);
        throw createAuthRefreshError(refreshError);
      }
    },
  );

  return apiClient;
}

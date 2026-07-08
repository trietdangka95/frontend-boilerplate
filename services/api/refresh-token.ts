import axios, { type AxiosAdapter } from "axios";

interface RefreshAccessTokenRequest {
  adapter?: AxiosAdapter;
  baseURL: string;
  refreshEndpoint?: string;
  timeout?: number;
}

interface RefreshTokenResponse {
  accessToken?: string | null;
  data?: {
    accessToken?: string | null;
  };
}

export type RefreshAccessToken = () => Promise<string | null>;

export const DEFAULT_REFRESH_ENDPOINT = "/auth/refresh";

export async function requestTokenRefresh({
  adapter,
  baseURL,
  refreshEndpoint = DEFAULT_REFRESH_ENDPOINT,
  timeout,
}: RefreshAccessTokenRequest) {
  const refreshClient = axios.create({
    adapter,
    baseURL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    timeout,
    withCredentials: true,
  });

  const response = await refreshClient.post<RefreshTokenResponse>(refreshEndpoint);

  return response.data.accessToken ?? response.data.data?.accessToken ?? null;
}

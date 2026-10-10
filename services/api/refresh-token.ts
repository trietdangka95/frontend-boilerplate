import axios, { type AxiosAdapter } from "axios";
import { z } from "@/utils/zod";

interface RefreshAccessTokenRequest {
  adapter?: AxiosAdapter;
  baseURL: string;
  refreshEndpoint?: string;
  timeout?: number;
}

const tokenSchema = z.string().min(1).nullable().optional();
const refreshResponseSchema = z.object({
  accessToken: tokenSchema,
  data: z.object({ accessToken: tokenSchema }).optional(),
});

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

  const response = await refreshClient.post<unknown>(refreshEndpoint);
  const payload = refreshResponseSchema.parse(response.data);

  return payload.accessToken ?? payload.data?.accessToken ?? null;
}

import "server-only";

import { createApiClient } from "./api-client";
import { createAccessTokenStore } from "./auth-token";

/** Create inside each server request. Never retain this client in a module singleton. */
export function createServerApiClient(baseURL: string, accessToken: string | null = null) {
  const tokenStore = createAccessTokenStore();
  tokenStore.set(accessToken);
  return createApiClient({ baseURL, tokenStore });
}

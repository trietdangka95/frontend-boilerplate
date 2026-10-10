import "client-only";

import { createApiClient } from "./api-client";

// Cookie/BFF requests do not attempt bearer-token refresh. Configure a separate
// createApiClient instance with an isolated token store for an external API recipe.
export const apiClient = createApiClient({ baseURL: "/api" });

import { apiClient } from "@/services/api/browser-client";
import { AppApiError } from "@/services/api/api-error";
import { clearAccessToken } from "@/services/api/auth-token";
import type { ApiSuccessResponse } from "@/types/api";

import type { AuthSession, ForgotPasswordPayload, LoginPayload, RegisterPayload } from "../types";

// In a real app, these endpoints would exist on the backend.
// For the boilerplate, we assume the endpoints are standard.

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const response = await apiClient.post<ApiSuccessResponse<AuthSession>>("/auth/session", payload);

  return response.data.data;
}

export async function register(payload: RegisterPayload): Promise<void> {
  void payload;
  // await apiClient.post("/auth/register", payload);

  // Stub for boilerplate demonstration:
  throw new AppApiError({
    code: "NOT_IMPLEMENTED",
    message: "Registration is not connected. This is a demo form.",
  });
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  void payload;
  // await apiClient.post("/auth/forgot-password", payload);

  // Stub for boilerplate demonstration:
  throw new AppApiError({
    code: "NOT_IMPLEMENTED",
    message: "Password recovery is not connected. This is a demo form.",
  });
}

export async function logout(): Promise<void> {
  try {
    await apiClient.delete("/auth/session");
  } finally {
    clearAccessToken();
  }
}

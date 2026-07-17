import { clearAccessToken, setAccessToken } from "@/services/api/auth-token";

import type { AuthResponse, ForgotPasswordPayload, LoginPayload, RegisterPayload } from "../types";

// In a real app, these endpoints would exist on the backend.
// For the boilerplate, we assume the endpoints are standard.

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  void payload;
  // Using POST /auth/login
  // const response = await apiClient.post<AuthResponse>("/auth/login", payload);
  // return response.data;

  // Stub for boilerplate demonstration:
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockToken = "mock_access_token_12345";
      setAccessToken(mockToken);
      resolve({ accessToken: mockToken });
    }, 1000);
  });
}

export async function register(payload: RegisterPayload): Promise<void> {
  void payload;
  // await apiClient.post("/auth/register", payload);

  // Stub for boilerplate demonstration:
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  void payload;
  // await apiClient.post("/auth/forgot-password", payload);

  // Stub for boilerplate demonstration:
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export async function logout(): Promise<void> {
  try {
    // await apiClient.post("/auth/logout");
  } finally {
    clearAccessToken();
  }
}

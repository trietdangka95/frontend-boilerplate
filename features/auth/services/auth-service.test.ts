// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";

import { getAccessToken, setAccessToken } from "@/services/api/auth-token";

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  post: vi.fn(),
}));

vi.mock("@/services/api/browser-client", () => ({ apiClient }));

import { forgotPassword, login, logout, register } from "./auth-service";

describe("auth service", () => {
  it("does not claim to register or send email without a backend", async () => {
    await expect(
      register({ name: "Demo", email: "demo@example.com", password: "password123" }),
    ).rejects.toMatchObject({ code: "NOT_IMPLEMENTED" });
    await expect(forgotPassword({ email: "demo@example.com" })).rejects.toMatchObject({
      code: "NOT_IMPLEMENTED",
    });
  });
  afterEach(() => {
    apiClient.delete.mockReset();
    apiClient.post.mockReset();
    setAccessToken(null);
  });

  it("creates a demo session without exposing an access token", async () => {
    const payload = {
      email: "demo@example.com",
      password: "password123",
      rememberMe: true,
    };
    apiClient.post.mockResolvedValue({ data: { data: { authenticated: true } } });

    await expect(login(payload)).resolves.toEqual({ authenticated: true });
    expect(apiClient.post).toHaveBeenCalledWith("/auth/session", payload);
    expect(getAccessToken()).toBeNull();
  });

  it("deletes the demo session and clears any in-memory API token", async () => {
    setAccessToken("existing-api-token");
    apiClient.delete.mockResolvedValue({});

    await expect(logout()).resolves.toBeUndefined();

    expect(apiClient.delete).toHaveBeenCalledWith("/auth/session");
    expect(getAccessToken()).toBeNull();
  });

  it("still clears the in-memory API token when logout fails", async () => {
    setAccessToken("existing-api-token");
    apiClient.delete.mockRejectedValue(new Error("network unavailable"));

    await expect(logout()).rejects.toThrow("network unavailable");
    expect(getAccessToken()).toBeNull();
  });
});

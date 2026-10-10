// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEMO_SESSION_COOKIE_NAME,
  REMEMBERED_DEMO_SESSION_TTL_SECONDS,
} from "@/features/auth/server/demo-session";

const cookieStore = vi.hoisted(() => ({
  delete: vi.fn(),
  set: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStore),
}));

import { DELETE, POST } from "./route";

const DEMO_SESSION_SECRET = "test-demo-session-secret-that-is-long-enough";

function createLoginRequest(body: unknown) {
  return new Request("http://localhost:3000/api/auth/session", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
    method: "POST",
  });
}

describe("demo session route", () => {
  beforeEach(() => {
    vi.stubEnv("ENABLE_DEMO_AUTH", "true");
    process.env.DEMO_SESSION_SECRET = DEMO_SESSION_SECRET;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    cookieStore.delete.mockReset();
    cookieStore.set.mockReset();
    delete process.env.DEMO_SESSION_SECRET;
  });

  it("creates an HttpOnly session cookie for valid demo credentials", async () => {
    const response = await POST(
      createLoginRequest({
        email: "demo@example.com",
        password: "password123",
        rememberMe: false,
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ data: { authenticated: true } });
    expect(cookieStore.set).toHaveBeenCalledWith(
      DEMO_SESSION_COOKIE_NAME,
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        path: "/",
        priority: "high",
        sameSite: "lax",
        secure: false,
      }),
    );
    expect(cookieStore.set.mock.calls[0]?.[2]).not.toHaveProperty("maxAge");
  });

  it("persists a remembered session for the bounded token lifetime", async () => {
    await POST(
      createLoginRequest({
        email: "demo@example.com",
        password: "password123",
        rememberMe: true,
      }),
    );

    expect(cookieStore.set.mock.calls[0]?.[2]).toMatchObject({
      maxAge: REMEMBERED_DEMO_SESSION_TTL_SECONDS,
    });
  });

  it("rejects invalid login input without setting a cookie", async () => {
    const response = await POST(
      createLoginRequest({
        email: "not-an-email",
        password: "short",
      }),
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "INVALID_LOGIN_INPUT" },
    });
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("deletes the session cookie on logout", async () => {
    const response = await DELETE(
      new Request("http://localhost:3000/api/auth/session", {
        method: "DELETE",
        headers: { Origin: "http://localhost:3000" },
      }),
    );

    expect(response.status).toBe(204);
    expect(cookieStore.delete).toHaveBeenCalledWith(DEMO_SESSION_COOKIE_NAME);
  });
  it("does not mint demo cookies in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = await POST(
      createLoginRequest({ email: "demo@example.com", password: "password123" }),
    );
    expect(response.status).toBe(404);
    expect(cookieStore.set).not.toHaveBeenCalled();
  });
  it("rejects cross-origin cookie mutations", async () => {
    const request = new Request("http://localhost:3000/api/auth/session", {
      method: "DELETE",
      headers: { Origin: "https://attacker.example" },
    });
    expect((await DELETE(request)).status).toBe(403);
    expect(cookieStore.delete).not.toHaveBeenCalled();
  });
});

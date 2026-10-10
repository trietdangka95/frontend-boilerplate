// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import {
  createDemoSessionToken,
  DEMO_SESSION_COOKIE_NAME,
} from "@/features/auth/server/demo-session";

import proxy from "./proxy";

const DEMO_SESSION_SECRET = "test-demo-session-secret-that-is-long-enough";

function createRequest(path: string, token?: string) {
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: token ? { Cookie: `${DEMO_SESSION_COOKIE_NAME}=${token}` } : undefined,
  });
}

describe("proxy", () => {
  beforeEach(() => {
    vi.stubEnv("ENABLE_DEMO_AUTH", "true");
    process.env.DEMO_SESSION_SECRET = DEMO_SESSION_SECRET;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete process.env.DEMO_SESSION_SECRET;
  });

  it("does not redirect public metadata files to login", async () => {
    const response = await proxy(createRequest("/manifest.webmanifest"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects a protected route when no session exists", async () => {
    const response = await proxy(createRequest("/examples/private"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("rejects a forged session instead of trusting cookie presence", async () => {
    const response = await proxy(createRequest("/examples/private", "forged.session"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
    expect(response.headers.get("set-cookie")).toContain(`${DEMO_SESSION_COOKIE_NAME}=`);
  });

  it("allows a protected route only with a valid signed session", async () => {
    const token = await createDemoSessionToken({
      rememberMe: false,
      secret: DEMO_SESSION_SECRET,
    });
    const response = await proxy(createRequest("/examples/private", token));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects authenticated users away from login", async () => {
    const token = await createDemoSessionToken({
      rememberMe: false,
      secret: DEMO_SESSION_SECRET,
    });
    const response = await proxy(createRequest("/login", token));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/examples/private");
  });

  it("adds a nonce-based content security policy", async () => {
    const response = await proxy(createRequest("/login"));
    const contentSecurityPolicy = response.headers.get("content-security-policy");
    const requestNonce = response.headers.get("x-middleware-request-x-nonce");

    expect(contentSecurityPolicy).toContain("default-src 'self'");
    expect(contentSecurityPolicy).toMatch(/script-src 'self' 'nonce-[^']+'/);
    expect(contentSecurityPolicy).toContain(`'nonce-${requestNonce}'`);
    expect(contentSecurityPolicy).toContain("object-src 'none'");
    expect(contentSecurityPolicy).toContain("frame-ancestors 'none'");
  });
  it("keeps the starter page public without a session", async () => {
    expect((await proxy(createRequest("/"))).status).toBe(200);
  });
  it.each(["/api/private", "/api/private.json", "/api/health/secret"])(
    "denies unconfigured private API %s",
    async (path) => {
      const response = await proxy(createRequest(path));
      expect(response.status).toBe(401);
      expect(response.headers.get("location")).toBeNull();
    },
  );
  it("keeps the explicit health endpoint public", async () => {
    expect((await proxy(createRequest("/api/health"))).status).toBe(200);
  });
  it("hides demo auth routes by default", async () => {
    vi.stubEnv("ENABLE_DEMO_AUTH", "false");
    expect((await proxy(createRequest("/login"))).status).toBe(404);
  });
  it("does not use a demo cookie to authorize ordinary private pages", async () => {
    const token = await createDemoSessionToken({ rememberMe: false, secret: DEMO_SESSION_SECRET });
    expect((await proxy(createRequest("/private", token))).status).toBe(401);
  });
});

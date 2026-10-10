import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  DEMO_SESSION_COOKIE_NAME,
  verifyDemoSessionToken,
} from "@/features/auth/server/demo-session";
import { getDemoSessionSecret } from "@/utils/env.server";
import { isDemoAuthEnabled } from "@/features/auth/server/demo-mode";
import { requireSession } from "@/services/auth/session";

const PUBLIC_ROUTES = new Set(["/", "/examples", "/login", "/register", "/forgot-password"]);
const DEMO_ROUTES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/examples/private",
  "/api/auth/session",
]);
const PUBLIC_API_ROUTES = new Set(["/api/health", "/api/auth/session"]);
const AUTH_ENTRY_ROUTES = new Set(["/login", "/register"]);
const PUBLIC_METADATA_ROUTES = new Set([
  "/favicon.ico",
  "/icon.svg",
  "/manifest.webmanifest",
  "/robots.txt",
  "/sitemap.xml",
]);

function createNonce() {
  return Buffer.from(crypto.randomUUID()).toString("base64");
}

function getConfiguredApiOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!configuredUrl) {
    return undefined;
  }

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return undefined;
  }
}

function createContentSecurityPolicy(nonce: string) {
  const apiOrigin = getConfiguredApiOrigin();
  const connectSources = ["'self'"];

  if (apiOrigin) {
    connectSources.push(apiOrigin);
  }

  if (process.env.NODE_ENV !== "production") {
    connectSources.push("ws:", "wss:");
  }

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${
      process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""
    }`,
    `style-src 'self' 'nonce-${nonce}'`,
    `style-src-elem 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self' data:",
    `connect-src ${connectSources.join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

function applyContentSecurityPolicy(response: NextResponse, contentSecurityPolicy: string) {
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
}

function createNextResponse(request: NextRequest, nonce: string, contentSecurityPolicy: string) {
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  return applyContentSecurityPolicy(
    NextResponse.next({ request: { headers: requestHeaders } }),
    contentSecurityPolicy,
  );
}

function createRedirect(request: NextRequest, pathname: string, contentSecurityPolicy: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;

  return applyContentSecurityPolicy(NextResponse.redirect(url), contentSecurityPolicy);
}

function bypassesAuthentication(pathname: string) {
  return pathname.startsWith("/_next/") || PUBLIC_METADATA_ROUTES.has(pathname);
}

export default async function proxy(request: NextRequest) {
  const nonce = createNonce();
  const contentSecurityPolicy = createContentSecurityPolicy(nonce);
  const pathname = request.nextUrl.pathname;

  if (DEMO_ROUTES.has(pathname) && !isDemoAuthEnabled()) {
    return applyContentSecurityPolicy(
      NextResponse.json({ error: { code: "NOT_FOUND", message: "Not found." } }, { status: 404 }),
      contentSecurityPolicy,
    );
  }
  if (pathname.startsWith("/api/") || pathname === "/api") {
    if (!PUBLIC_API_ROUTES.has(pathname)) {
      const session = await requireSession(request);
      if (session instanceof NextResponse)
        return applyContentSecurityPolicy(session, contentSecurityPolicy);
    }
    return createNextResponse(request, nonce, contentSecurityPolicy);
  }

  if (bypassesAuthentication(pathname)) {
    return createNextResponse(request, nonce, contentSecurityPolicy);
  }

  if (!PUBLIC_ROUTES.has(pathname) && pathname !== "/examples/private") {
    const session = await requireSession(request);
    if (session instanceof NextResponse)
      return applyContentSecurityPolicy(session, contentSecurityPolicy);
    return createNextResponse(request, nonce, contentSecurityPolicy);
  }

  const token = request.cookies.get(DEMO_SESSION_COOKIE_NAME)?.value;
  const hasValidSession =
    isDemoAuthEnabled() && token
      ? await verifyDemoSessionToken(token, { secret: getDemoSessionSecret() })
      : false;
  const isPublicRoute = PUBLIC_ROUTES.has(pathname);

  if (!hasValidSession && !isPublicRoute) {
    const response = createRedirect(request, "/login", contentSecurityPolicy);

    if (token) {
      response.cookies.delete(DEMO_SESSION_COOKIE_NAME);
    }

    return response;
  }

  if (hasValidSession && AUTH_ENTRY_ROUTES.has(pathname)) {
    return createRedirect(request, "/examples/private", contentSecurityPolicy);
  }

  return createNextResponse(request, nonce, contentSecurityPolicy);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  createDemoSessionToken,
  DEMO_SESSION_COOKIE_NAME,
  REMEMBERED_DEMO_SESSION_TTL_SECONDS,
} from "@/features/auth/server/demo-session";
import { loginSchema } from "@/features/auth/schemas/auth-schemas";
import { getDemoSessionSecret } from "@/utils/env.server";
import { isDemoAuthEnabled } from "@/features/auth/server/demo-mode";
import { rejectCrossOriginWrite } from "@/services/auth/same-origin";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

function guardDemoWrite(request: Request) {
  if (!isDemoAuthEnabled())
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Not found." } },
      { status: 404, headers: NO_STORE_HEADERS },
    );
  return rejectCrossOriginWrite(request);
}

function invalidLoginResponse(details?: unknown) {
  return NextResponse.json(
    {
      error: {
        code: "INVALID_LOGIN_INPUT",
        details,
        message: "Enter a valid email address and a password with at least 8 characters.",
      },
    },
    { headers: NO_STORE_HEADERS, status: 422 },
  );
}

export async function POST(request: Request) {
  const denied = guardDemoWrite(request);
  if (denied) return denied;
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_JSON",
          message: "The request body must be valid JSON.",
        },
      },
      { headers: NO_STORE_HEADERS, status: 400 },
    );
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return invalidLoginResponse(parsed.error.flatten().fieldErrors);
  }

  const rememberMe = parsed.data.rememberMe ?? false;
  const token = await createDemoSessionToken({
    rememberMe,
    secret: getDemoSessionSecret(),
  });
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    path: "/",
    priority: "high" as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    ...(rememberMe ? { maxAge: REMEMBERED_DEMO_SESSION_TTL_SECONDS } : {}),
  };

  cookieStore.set(DEMO_SESSION_COOKIE_NAME, token, cookieOptions);

  return NextResponse.json(
    { data: { authenticated: true as const } },
    { headers: NO_STORE_HEADERS },
  );
}

export async function DELETE(request: Request) {
  const denied = guardDemoWrite(request);
  if (denied) return denied;
  const cookieStore = await cookies();

  cookieStore.delete(DEMO_SESSION_COOKIE_NAME);

  return new NextResponse(null, { headers: NO_STORE_HEADERS, status: 204 });
}

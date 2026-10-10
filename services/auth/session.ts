import { NextResponse } from "next/server";

export interface Session {
  userId: string;
}

export type SessionResolver = (request: Request) => Promise<Session | null>;

// Replace this resolver with the chosen identity provider. Unconfigured means denied.
export const resolveSession: SessionResolver = async () => null;

/** Invoke inside every private Route Handler, before reading or mutating data. */
export async function requireSession(request: Request, resolver: SessionResolver = resolveSession) {
  const session = await resolver(request);
  return (
    session ??
    NextResponse.json(
      { error: { code: "UNAUTHENTICATED", message: "Authentication required." } },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    )
  );
}

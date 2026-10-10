import { NextResponse } from "next/server";

/** Cookie-authenticated writes require a browser Origin matching the configured site. */
export function rejectCrossOriginWrite(request: Request) {
  const siteOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? request.url).origin;
  if (request.headers.get("origin") === siteOrigin) return null;
  return NextResponse.json(
    { error: { code: "FORBIDDEN", message: "Request origin is not allowed." } },
    { status: 403, headers: { "Cache-Control": "no-store" } },
  );
}

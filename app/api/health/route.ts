import { NextResponse } from "next/server";

/** Liveness only: add dependency readiness checks when a backend is connected. */
export function GET() {
  return NextResponse.json(
    { data: { status: "ok" } },
    { headers: { "Cache-Control": "no-store" } },
  );
}

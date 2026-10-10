// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  createDemoSessionToken,
  DEMO_SESSION_TTL_SECONDS,
  verifyDemoSessionToken,
} from "./demo-session";

const DEMO_SESSION_SECRET = "test-demo-session-secret-that-is-long-enough";
const ISSUED_AT = new Date("2026-08-25T00:00:00.000Z");

describe("demo session token", () => {
  it("accepts an untampered token before it expires", async () => {
    const token = await createDemoSessionToken({
      issuedAt: ISSUED_AT,
      rememberMe: false,
      secret: DEMO_SESSION_SECRET,
    });

    await expect(
      verifyDemoSessionToken(token, {
        now: new Date(ISSUED_AT.getTime() + 1_000),
        secret: DEMO_SESSION_SECRET,
      }),
    ).resolves.toBe(true);
  });

  it("rejects an expired token", async () => {
    const token = await createDemoSessionToken({
      issuedAt: ISSUED_AT,
      rememberMe: false,
      secret: DEMO_SESSION_SECRET,
    });

    await expect(
      verifyDemoSessionToken(token, {
        now: new Date(ISSUED_AT.getTime() + (DEMO_SESSION_TTL_SECONDS + 1) * 1_000),
        secret: DEMO_SESSION_SECRET,
      }),
    ).resolves.toBe(false);
  });

  it("rejects a token whose signature was changed", async () => {
    const token = await createDemoSessionToken({
      issuedAt: ISSUED_AT,
      rememberMe: true,
      secret: DEMO_SESSION_SECRET,
    });
    const [payload, signature] = token.split(".");
    const tamperedSignature = `${signature?.startsWith("a") ? "b" : "a"}${signature?.slice(1)}`;

    await expect(
      verifyDemoSessionToken(`${payload}.${tamperedSignature}`, {
        now: ISSUED_AT,
        secret: DEMO_SESSION_SECRET,
      }),
    ).resolves.toBe(false);
  });

  it("rejects malformed input without throwing", async () => {
    await expect(
      verifyDemoSessionToken("not-a-session", {
        now: ISSUED_AT,
        secret: DEMO_SESSION_SECRET,
      }),
    ).resolves.toBe(false);
  });
});

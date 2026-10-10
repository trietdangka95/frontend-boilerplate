// @vitest-environment node
import { describe, expect, it } from "vitest";
import { requireSession } from "./session";

describe("private route session boundary", () => {
  it("denies access before an identity provider is configured", async () => {
    const result = await requireSession(new Request("https://example.com/api/private"));
    expect(result).toBeInstanceOf(Response);
    if (!(result instanceof Response)) throw new Error("Expected denial");
    expect(result.status).toBe(401);
    expect(result.headers.get("Cache-Control")).toBe("no-store");
  });
  it("returns only a verified session supplied by the resolver", async () => {
    const result = await requireSession(
      new Request("https://example.com/api/private"),
      async () => ({ userId: "user-1" }),
    );
    expect(result).toEqual({ userId: "user-1" });
  });
});

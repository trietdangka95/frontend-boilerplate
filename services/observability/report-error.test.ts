import { describe, expect, it, vi } from "vitest";
import { reportError } from "./report-error";

describe("error reporting", () => {
  it("keeps secrets, stack traces and unsafe digests out of telemetry", () => {
    const sink = vi.fn();
    const error = Object.assign(new Error("password=secret"), { digest: "token=secret" });
    reportError(error, "server", sink);
    expect(sink).toHaveBeenCalledWith({
      event: "application.error",
      source: "server",
      timestamp: expect.any(String),
    });
    expect(JSON.stringify(sink.mock.calls)).not.toContain("secret");
  });
  it("preserves safe error correlation identifiers", () => {
    const sink = vi.fn();
    reportError(Object.assign(new Error("internal"), { digest: "12345" }), "route-boundary", sink);
    expect(sink).toHaveBeenCalledWith(expect.objectContaining({ digest: "12345" }));
  });
});

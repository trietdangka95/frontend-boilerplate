// @vitest-environment node

import { describe, expect, it } from "vitest";

import { z } from "./zod";

describe("configured Zod", () => {
  it("disables JIT probing for strict CSP compatibility", () => {
    expect(z.config()).toMatchObject({ jitless: true });
  });
});

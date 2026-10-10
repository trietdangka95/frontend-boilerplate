import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getAccessibilityViolations } from "@/tests/accessibility";

import AuthLayout, { metadata } from "./layout";

describe("AuthLayout", () => {
  beforeEach(() => vi.stubEnv("ENABLE_DEMO_AUTH", "true"));
  afterEach(() => vi.unstubAllEnvs());
  it("wraps authentication content in the main landmark", () => {
    render(<AuthLayout>Authentication form</AuthLayout>);

    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("main")).toHaveTextContent("Authentication form");
  });

  it("prevents authentication screens from being indexed", () => {
    expect(metadata.robots).toMatchObject({ follow: false, index: false });
  });

  it("has no detectable WCAG violations", async () => {
    const { container } = render(
      <AuthLayout>
        <h1>Sign in</h1>
        <label htmlFor="email">Email</label>
        <input autoComplete="email" id="email" type="email" />
      </AuthLayout>,
    );

    await expect(getAccessibilityViolations(container)).resolves.toEqual([]);
  });
});

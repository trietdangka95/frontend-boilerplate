import { describe, expect, it } from "vitest";

import { designTokens } from "./tokens";
import { theme } from "./theme";

describe("design system theme", () => {
  it("exposes a semantic brand palette and avoids Inter typography", () => {
    expect(designTokens.color.brand[600]).toBe("#0d766e");
    expect(theme.palette.primary.main).toBe(designTokens.color.brand[600]);
    expect(theme.typography.fontFamily).not.toContain("Inter");
  });

  it("uses the documented responsive breakpoints and layout bounds", () => {
    expect(theme.breakpoints.values).toEqual({
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1024,
      xl: 1440,
    });
    expect(designTokens.layout.contentMaxWidth).toBe(1280);
  });

  it("keeps component radii on the shared radius scale", () => {
    expect(theme.shape.borderRadius).toBe(designTokens.radius.md);
  });
});

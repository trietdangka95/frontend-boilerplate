import { describe, expect, it } from "vitest";
import { getContrastRatio } from "@mui/material/styles";

import { designTokens } from "./tokens";
import { theme } from "./theme";

const WCAG_AA_NORMAL_TEXT_CONTRAST = 4.5;

describe("design system theme", () => {
  it("exposes a semantic brand palette and avoids Inter typography", () => {
    expect(theme.palette.primary.main).toBe(designTokens.color.semantic.light.primary.main);
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

  it("emits shared application tokens as MUI CSS variables", () => {
    expect(theme.vars.app.layout.sidebarWidth).toContain("--mui-app-layout-sidebarWidth");
    expect(theme.vars.app.motion.durationStandard).toContain("--mui-app-motion-durationStandard");
    expect(theme.vars.app.radius.lg).toContain("--mui-app-radius-lg");
    expect(theme.vars.app.shadow.focus).toContain("--mui-app-shadow-focus");
    expect(theme.vars.app.typography.fontWeightSemibold).toContain(
      "--mui-app-typography-fontWeightSemibold",
    );
    expect(theme.vars.spacing).toContain("--mui-spacing");
    expect(JSON.stringify(theme.generateStyleSheets())).toContain("--mui-app-radius-lg");
  });

  it("defines semantic values for both stable color schemes", () => {
    expect(theme.colorSchemes.light?.palette.background.default).toBe(
      designTokens.color.semantic.light.background.canvas,
    );
    expect(theme.colorSchemes.dark?.palette.background.default).toBe(
      designTokens.color.semantic.dark.background.canvas,
    );
  });

  it("keeps dark-mode action colors above the WCAG AA contrast threshold", () => {
    const darkColors = designTokens.color.semantic.dark;

    expect(
      getContrastRatio(darkColors.primary.main, darkColors.primary.contrast),
    ).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT_CONTRAST);
    expect(
      getContrastRatio(darkColors.secondary.main, darkColors.background.canvas),
    ).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT_CONTRAST);
  });
});

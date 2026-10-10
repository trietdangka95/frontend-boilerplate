import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const stylingRoots = ["app", "components", "features", "providers", "stores", "theme"];
const runtimeExtensions = new Set([".css", ".ts", ".tsx"]);
const allowedRawColorFile = "theme/tokens.ts";

function collectRuntimeFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);

    if (statSync(absolutePath).isDirectory()) return collectRuntimeFiles(absolutePath);
    if (absolutePath.includes(".test.")) return [];

    const extension = absolutePath.slice(absolutePath.lastIndexOf("."));
    return runtimeExtensions.has(extension) ? [absolutePath] : [];
  });
}

function findViolations(pattern: RegExp, ignoredFiles: string[] = []) {
  return stylingRoots
    .flatMap((root) => collectRuntimeFiles(join(projectRoot, root)))
    .flatMap((file) => {
      const projectPath = relative(projectRoot, file);
      if (ignoredFiles.includes(projectPath)) return [];

      const matches = readFileSync(file, "utf8").match(pattern) ?? [];
      return matches.map((match) => `${projectPath}: ${match}`);
    });
}

describe("application styling contract", () => {
  it("bridges semantic Tailwind utilities to MUI CSS variables", () => {
    const globalStyles = readFileSync(join(projectRoot, "app/globals.css"), "utf8");

    expect(globalStyles).toContain("--color-canvas: var(--mui-palette-background-default)");
    expect(globalStyles).toContain("--color-surface: var(--mui-palette-background-paper)");
    expect(globalStyles).toContain("--color-foreground: var(--mui-palette-text-primary)");
    expect(globalStyles).toContain("--color-muted: var(--mui-palette-text-secondary)");
    expect(globalStyles).toContain("--color-default: var(--mui-palette-divider)");
    expect(globalStyles).toContain("--spacing: var(--mui-spacing)");
    expect(globalStyles).toContain("--radius-lg: var(--mui-app-radius-lg)");
    expect(globalStyles).toContain(
      "--font-weight-semibold: var(--mui-app-typography-fontWeightSemibold)",
    );
    expect(globalStyles).toContain('@import "tailwindcss" source(none)');
  });

  it("keeps raw color values in the token source only", () => {
    const rawColorPattern = /#[\da-f]{3,8}\b|(?:rgb|hsl)a?\(/gi;

    expect(findViolations(rawColorPattern, [allowedRawColorFile])).toEqual([]);
  });

  it("rejects raw Tailwind palette utilities and arbitrary layout values", () => {
    const rawPaletteUtilityPattern =
      /\b(?:bg|border|decoration|divide|fill|from|outline|ring|stroke|text|to|via)-(?:amber|black|blue|cyan|emerald|fuchsia|gray|green|indigo|lime|neutral|orange|pink|purple|red|rose|sky|slate|stone|teal|violet|white|yellow|zinc)(?:-\d{2,3})?(?:\/\d{1,3})?\b/g;
    const arbitraryLayoutPattern = /\b(?:h|min-h|ml|w)-\[[^\]]+\]/g;

    expect(findViolations(rawPaletteUtilityPattern)).toEqual([]);
    expect(findViolations(arbitraryLayoutPattern)).toEqual([]);
  });
});

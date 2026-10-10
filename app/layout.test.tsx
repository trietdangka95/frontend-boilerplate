import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const CSP_NONCE = "test-csp-nonce";

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: (name: string) => (name === "x-nonce" ? CSP_NONCE : null),
  })),
}));

vi.mock("@mui/material/InitColorSchemeScript", () => ({
  default: ({ nonce }: { nonce?: string }) => (
    <div data-nonce={nonce} data-testid="color-scheme-script" />
  ),
}));

vi.mock("next/script", () => ({
  default: ({ children, id, nonce }: { children: React.ReactNode; id: string; nonce?: string }) => (
    <script id={id} nonce={nonce}>
      {children}
    </script>
  ),
}));

vi.mock("./providers", () => ({
  AppProviders: ({ children, nonce }: { children: React.ReactNode; nonce?: string }) => (
    <div data-nonce={nonce} data-testid="app-providers">
      {children}
    </div>
  ),
}));

import RootLayout, { metadata } from "./layout";

describe("RootLayout", () => {
  it("declares smooth scrolling so navigation can avoid animated scroll restoration", async () => {
    const layout = await RootLayout({ children: <p>Page content</p> });
    expect(layout.props["data-scroll-behavior"]).toBe("smooth");
  });

  it("passes the request nonce to MUI's script and Emotion cache", async () => {
    const { container } = render(await RootLayout({ children: <p>Page content</p> }));

    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(screen.getByTestId("color-scheme-script")).toHaveAttribute("data-nonce", CSP_NONCE);
    expect(screen.getByTestId("app-providers")).toHaveAttribute("data-nonce", CSP_NONCE);
    expect(container.querySelector("#runtime-style-nonce")).toHaveAttribute("nonce", CSP_NONCE);
    expect(container.querySelector("#runtime-style-nonce")).toHaveTextContent(
      `window.__nonce__=${JSON.stringify(CSP_NONCE)}`,
    );
  });

  it("publishes a canonical URL for the indexable application entry", () => {
    expect(metadata.alternates).toMatchObject({ canonical: "/" });
  });
});

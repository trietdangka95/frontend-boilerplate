import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { useUiStore } from "@/stores/use-ui-store";
import { getAccessibilityViolations } from "@/tests/accessibility";

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  afterEach(() => {
    useUiStore.setState({ isSidebarOpen: false });
  });

  it("exposes the active route and mobile navigation controls", async () => {
    const user = userEvent.setup();

    render(
      <AppShell
        brand="Northstar UI"
        navigation={[
          { active: true, href: "/", label: "Overview" },
          { href: "/settings", label: "Settings" },
        ]}
      >
        <h1>Workspace</h1>
      </AppShell>,
    );

    expect(screen.getAllByRole("link", { name: "Overview" })[0]).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");

    const menuButton = screen.getByRole("button", { name: "Open navigation" });
    await user.click(menuButton);
    expect(screen.getByRole("button", { name: "Close navigation" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close navigation" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Open navigation" })).toBeInTheDocument();
    });
  });

  it("has no detectable WCAG violations", async () => {
    const { container } = render(
      <AppShell
        brand="Northstar UI"
        navigation={[
          { active: true, href: "/", label: "Overview" },
          { href: "/settings", label: "Settings" },
        ]}
      >
        <h1>Workspace</h1>
      </AppShell>,
    );

    await expect(getAccessibilityViolations(container)).resolves.toEqual([]);
  });
});

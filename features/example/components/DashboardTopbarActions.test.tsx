import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const logout = vi.hoisted(() => ({
  isPending: false,
  mutate: vi.fn(),
}));

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useLogout: () => logout,
}));

vi.mock("@/components/ui/ColorModeToggle/ColorModeToggle", () => ({
  ColorModeToggle: () => <button type="button">Toggle color mode</button>,
}));

import { DashboardTopbarActions } from "./DashboardTopbarActions";

describe("DashboardTopbarActions", () => {
  it("exposes the demo session logout action", async () => {
    const user = userEvent.setup();

    render(<DashboardTopbarActions showDemoAuth />);
    await user.click(screen.getByRole("button", { name: "MT — Log out" }));

    expect(logout.mutate).toHaveBeenCalledOnce();
  });
  it("does not offer demo logout in the default starter", () => {
    render(<DashboardTopbarActions />);
    expect(screen.queryByRole("button", { name: "MT — Log out" })).not.toBeInTheDocument();
  });
});

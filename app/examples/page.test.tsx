import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import HomePage from "./page";
import { QueryProvider } from "@/providers/QueryProvider";

describe("ExamplesPage", () => {
  it("renders the workspace with records prefetched on the server", async () => {
    const page = await HomePage();

    render(<QueryProvider>{page}</QueryProvider>);

    expect(screen.getByRole("heading", { name: "Example workspace" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Design system foundation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Component library" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open confirmation dialog" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Assign owner" })).toBeInTheDocument();
    expect(screen.getByText("Foundation setup")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Overview" })[0]).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

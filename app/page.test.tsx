import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";
import { QueryProvider } from "@/providers/QueryProvider";

describe("HomePage", () => {
  it("renders the example workspace heading", () => {
    render(
      <QueryProvider>
        <HomePage />
      </QueryProvider>,
    );

    expect(screen.getByRole("heading", { name: "Example workspace" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Design system foundation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Component library" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open confirmation dialog" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Assign owner" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Overview" })[0]).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

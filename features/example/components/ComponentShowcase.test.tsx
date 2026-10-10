import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ComponentShowcase } from "./ComponentShowcase";

describe("ComponentShowcase", () => {
  it("keeps loading examples visible without waiting for a request", () => {
    render(<ComponentShowcase />);

    const heading = screen.getByRole("heading", { name: "Loading & skeleton" });
    expect(heading.closest("#loading-examples")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Loading preview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Saving changes" })).toBeDisabled();
    expect(screen.getByRole("status", { name: "Loading report preview" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getAllByTestId("loading-state-skeleton")).toHaveLength(4);
  });
});

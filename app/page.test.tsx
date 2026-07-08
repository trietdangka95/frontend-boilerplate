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
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("starter home", () => {
  it("offers a public starting point independently of the demo dashboard", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("A foundation");
    expect(screen.getByRole("link", { name: "Explore examples" })).toHaveAttribute(
      "href",
      "/examples",
    );
  });
});

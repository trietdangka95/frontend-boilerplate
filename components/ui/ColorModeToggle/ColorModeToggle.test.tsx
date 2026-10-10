import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { theme } from "@/theme/theme";

import { ColorModeToggle } from "./ColorModeToggle";

describe("ColorModeToggle", () => {
  it("keeps the server-rendered control disabled until the color scheme is ready", () => {
    const markup = renderToStaticMarkup(
      <ThemeProvider defaultMode="system" theme={theme}>
        <ColorModeToggle />
      </ThemeProvider>,
    );
    const document = new DOMParser().parseFromString(markup, "text/html");
    expect(document.querySelector("button")?.disabled).toBe(true);
  });

  it("cycles through the MUI system, light, and dark color schemes", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultMode="system" theme={theme}>
        <ColorModeToggle />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: /current mode is system/i }));
    expect(screen.getByRole("button", { name: /current mode is light/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /current mode is light/i }));
    expect(screen.getByRole("button", { name: /current mode is dark/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /current mode is dark/i }));
    expect(screen.getByRole("button", { name: /current mode is system/i })).toBeInTheDocument();
  });
});

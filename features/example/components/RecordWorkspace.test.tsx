import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { QueryProvider } from "@/providers/QueryProvider";

import { RecordWorkspace } from "./RecordWorkspace";

describe("RecordWorkspace", () => {
  it("keeps domain fields out of account-profile autofill", async () => {
    render(
      <QueryProvider>
        <RecordWorkspace />
      </QueryProvider>,
    );

    await screen.findByText("Foundation setup");
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("autocomplete", "off");
    expect(screen.getByRole("textbox", { name: "Owner email" })).toHaveAttribute(
      "autocomplete",
      "off",
    );
  });

  it("drives the API mutation and submit loading state through TanStack Query", async () => {
    const user = userEvent.setup();

    render(
      <QueryProvider>
        <RecordWorkspace />
      </QueryProvider>,
    );

    await screen.findByText("Foundation setup");
    await user.type(screen.getByRole("textbox", { name: "Name" }), "TanStack example");
    await user.type(screen.getByRole("textbox", { name: "Owner email" }), "tanstack@example.com");

    const submitButton = screen.getByRole("button", { name: "Create record" });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Name" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Owner email" })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: "Notify owner" })).toBeDisabled();
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByTestId("button-loading-icon")).toBeInTheDocument();

    await waitFor(() => expect(submitButton).toBeEnabled());
    expect(screen.getByRole("textbox", { name: "Name" })).toBeEnabled();
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("");
    expect(screen.getByText("TanStack example")).toBeInTheDocument();
  });
});

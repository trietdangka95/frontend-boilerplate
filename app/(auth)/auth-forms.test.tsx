import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getAccessibilityViolations } from "@/tests/accessibility";

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useForgotPassword: () => ({ isPending: false, mutate: vi.fn() }),
  useLogin: () => ({ isPending: false, mutate: vi.fn() }),
  useRegister: () => ({ isPending: false, mutate: vi.fn() }),
}));

import ForgotPasswordPage from "./forgot-password/page";
import AuthLayout from "./layout";
import LoginPage from "./login/page";
import RegisterPage from "./register/page";

describe("authentication form autofill", () => {
  beforeEach(() => vi.stubEnv("ENABLE_DEMO_AUTH", "true"));
  afterEach(() => vi.unstubAllEnvs());
  afterEach(cleanup);

  it("identifies login credentials for password managers", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("autocomplete", "current-password");
  });

  it("identifies registration fields for profile and password autofill", () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText("Name")).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("autocomplete", "new-password");
    expect(screen.getByLabelText("Confirm password")).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
  });

  it("identifies the password recovery email field", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
  });

  it("keeps the rendered login experience free of detectable WCAG violations", async () => {
    const { container } = render(
      <AuthLayout>
        <LoginPage />
      </AuthLayout>,
    );

    await expect(getAccessibilityViolations(container)).resolves.toEqual([]);
  });
});

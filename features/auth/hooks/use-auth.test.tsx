import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  forgotPassword: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock("../services/auth-service", () => ({
  login: mocks.login,
  logout: mocks.logout,
  register: mocks.register,
  forgotPassword: mocks.forgotPassword,
}));
vi.mock("@/components/common/AppToast", () => ({
  appToast: { success: mocks.success, error: mocks.error },
}));
import { useForgotPassword, useLogin, useLogout, useRegister } from "./use-auth";

function setup() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  client.setQueryData(["private-records"], ["previous-user"]);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

afterEach(() => vi.resetAllMocks());
describe("auth mutation lifecycle", () => {
  it("clears stale private data before navigating after login", async () => {
    const { client, wrapper } = setup();
    mocks.login.mockResolvedValue({ authenticated: true });
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () => {
      await result.current.mutateAsync({ email: "demo@example.com", password: "password123" });
    });
    expect(client.getQueryData(["private-records"])).toBeUndefined();
    expect(mocks.push).toHaveBeenCalledWith("/examples/private");
  });
  it("clears private data after logout", async () => {
    const { client, wrapper } = setup();
    mocks.logout.mockResolvedValue(undefined);
    const { result } = renderHook(useLogout, { wrapper });
    await act(async () => {
      await result.current.mutateAsync();
    });
    expect(client.getQueryData(["private-records"])).toBeUndefined();
    expect(mocks.push).toHaveBeenCalledWith("/login");
  });
  it("navigates to login when a connected registration service succeeds", async () => {
    const { wrapper } = setup();
    mocks.register.mockResolvedValue(undefined);
    const { result } = renderHook(useRegister, { wrapper });
    await act(async () => {
      await result.current.mutateAsync({
        name: "Demo",
        email: "demo@example.com",
        password: "password123",
      });
    });
    expect(mocks.push).toHaveBeenCalledWith("/login");
  });
  it("reports failed login without clearing an existing cache", async () => {
    const { client, wrapper } = setup();
    mocks.login.mockRejectedValue(new Error("Sign in failed"));
    const { result } = renderHook(useLogin, { wrapper });
    act(() => result.current.mutate({ email: "demo@example.com", password: "password123" }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mocks.error).toHaveBeenCalledWith("Sign in failed");
    expect(client.getQueryData(["private-records"])).toEqual(["previous-user"]);
  });
  it("reports unconnected password recovery", async () => {
    const { wrapper } = setup();
    mocks.forgotPassword.mockRejectedValue(new Error("Not connected"));
    const { result } = renderHook(useForgotPassword, { wrapper });
    act(() => result.current.mutate({ email: "demo@example.com" }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mocks.error).toHaveBeenCalledWith("Not connected");
  });
  it("reports failed registration without navigating", async () => {
    const { wrapper } = setup();
    mocks.register.mockRejectedValue(new Error("Not connected"));
    const { result } = renderHook(useRegister, { wrapper });
    act(() =>
      result.current.mutate({ name: "Demo", email: "demo@example.com", password: "password123" }),
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.error).toHaveBeenCalledWith("Not connected");
  });
  it("reports failed logout without redirecting", async () => {
    const { wrapper } = setup();
    mocks.logout.mockRejectedValue(new Error("Offline"));
    const { result } = renderHook(useLogout, { wrapper });
    act(() => result.current.mutate());
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mocks.error).toHaveBeenCalledWith("Offline");
    expect(mocks.push).not.toHaveBeenCalled();
  });
});

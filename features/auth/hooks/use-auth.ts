import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { normalizeApiError } from "@/services/api/api-error";

import { forgotPassword, login, logout, register } from "../services/auth-service";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // Invalidate queries that might depend on auth state
      queryClient.clear();
      router.push("/");
      toast.success("Successfully logged in");
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success("Registration successful. Please log in.");
      router.push("/login");
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });
}

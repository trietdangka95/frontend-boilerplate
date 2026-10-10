"use client";

import toast, { Toaster, type ToastOptions } from "react-hot-toast";

export function AppToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className:
          "rounded-md border border-default bg-surface px-4 py-3 text-sm text-foreground shadow-raised",
        duration: 4000,
      }}
    />
  );
}

export const appToast = {
  dismiss: toast.dismiss,
  error: (message: string, options?: ToastOptions) => toast.error(message, options),
  loading: (message: string, options?: ToastOptions) => toast.loading(message, options),
  success: (message: string, options?: ToastOptions) => toast.success(message, options),
};

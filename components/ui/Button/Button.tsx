"use client";

import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { LoaderCircle } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@/utils/cn";

type ButtonVariant = "solid" | "outline" | "ghost" | "text";

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  isLoading?: boolean;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  ghost: "bg-transparent text-slate-700 shadow-none hover:bg-slate-100",
  outline:
    "border border-slate-300 bg-white text-slate-950 shadow-none hover:border-slate-400 hover:bg-slate-50",
  solid: "bg-slate-950 text-white shadow-none hover:bg-slate-800",
  text: "bg-transparent px-2 text-slate-700 shadow-none hover:bg-slate-100",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, disabled, isLoading = false, startIcon, variant = "solid", ...props },
    ref,
  ) => (
    <MuiButton
      className={cn(
        "min-h-10 rounded-md px-4 text-sm font-semibold normal-case",
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      ref={ref}
      startIcon={
        isLoading ? (
          <LoaderCircle
            aria-hidden="true"
            className="h-4 w-4 animate-spin"
            data-testid="button-loading-icon"
          />
        ) : (
          startIcon
        )
      }
      variant={variant === "outline" ? "outlined" : "contained"}
      {...props}
    >
      {children}
    </MuiButton>
  ),
);

Button.displayName = "Button";

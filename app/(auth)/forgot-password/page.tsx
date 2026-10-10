"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { useForgotPassword } from "@/features/auth/hooks/use-auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/schemas/auth-schemas";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const forgotPassword = useForgotPassword();
  const { control, handleSubmit } = useForm<ForgotPasswordInput>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = handleSubmit((data) => {
    forgotPassword.mutate(data, {
      onSuccess: () => setIsSubmitted(true),
    });
  });

  if (isSubmitted) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Box
          sx={{
            alignItems: "center",
            bgcolor: "primary.50",
            borderRadius: "50%",
            color: "primary.main",
            display: "inline-flex",
            height: 56,
            justifyContent: "center",
            mb: 3,
            width: 56,
          }}
        >
          <MailCheck size={28} />
        </Box>
        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
          Check your email
        </Typography>
        <Typography color="text.secondary" variant="body1" sx={{ mb: 4 }}>
          We sent a password reset link to your email address. Please click the link to reset your
          password.
        </Typography>
        <Button component={Link} fullWidth href="/login" variant="outline">
          Back to login
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography component="h1" variant="h4" sx={{ mb: 1 }}>
          Forgot password?
        </Typography>
        <Typography color="text.secondary" variant="body2">
          No worries, we&apos;ll send you reset instructions.
        </Typography>
      </Box>

      <Box
        component="form"
        noValidate
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <InputField
          autoComplete="email"
          control={control}
          fullWidth
          label="Email"
          name="email"
          placeholder="Enter your email"
          type="email"
        />

        <Button disabled={forgotPassword.isPending} fullWidth type="submit" variant="solid">
          {forgotPassword.isPending ? "Sending..." : "Reset password"}
        </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography
          component={Link}
          href="/login"
          sx={{
            color: "text.secondary",
            fontSize: "0.875rem",
            fontWeight: "fontWeightMedium",
            textDecoration: "none",
            "&:hover": { color: "text.primary" },
          }}
        >
          ← Back to log in
        </Typography>
      </Box>
    </Paper>
  );
}

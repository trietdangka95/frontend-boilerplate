"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/ui/Button";
import { CheckboxField } from "@/components/ui/CheckboxField";
import { InputField } from "@/components/ui/InputField";
import { useLogin } from "@/features/auth/hooks/use-auth";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/auth-schemas";

export default function LoginPage() {
  const login = useLogin();
  const { control, handleSubmit } = useForm<LoginInput>({
    defaultValues: { email: "", password: "", rememberMe: false },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit((data) => {
    login.mutate(data);
  });

  return (
    <Paper sx={{ p: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography component="h1" variant="h4" sx={{ mb: 1 }}>
          Welcome back
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Please enter your details to sign in
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

        <InputField
          autoComplete="current-password"
          control={control}
          fullWidth
          label="Password"
          name="password"
          placeholder="••••••••"
          type="password"
        />

        <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
          <CheckboxField control={control} label="Remember for 30 days" name="rememberMe" />
          <Typography
            component={Link}
            href="/forgot-password"
            sx={{
              color: "primary.main",
              fontSize: "0.875rem",
              fontWeight: "fontWeightMedium",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Forgot password?
          </Typography>
        </Box>

        <Button disabled={login.isPending} fullWidth type="submit" variant="solid">
          {login.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{" "}
          <Typography
            component={Link}
            href="/register"
            sx={{
              color: "primary.main",
              fontWeight: "fontWeightMedium",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Sign up
          </Typography>
        </Typography>
      </Box>
    </Paper>
  );
}

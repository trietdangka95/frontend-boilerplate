"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { useRegister } from "@/features/auth/hooks/use-auth";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas/auth-schemas";

export default function RegisterPage() {
  const register = useRegister();
  const { control, handleSubmit } = useForm<RegisterInput>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit((data) => {
    register.mutate(data);
  });

  return (
    <Paper sx={{ p: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography component="h1" variant="h4" sx={{ mb: 1 }}>
          Create an account
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Enter your details to get started
        </Typography>
      </Box>

      <Box
        component="form"
        noValidate
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <InputField
          control={control}
          fullWidth
          label="Name"
          name="name"
          placeholder="Enter your name"
        />

        <InputField
          control={control}
          fullWidth
          label="Email"
          name="email"
          placeholder="Enter your email"
          type="email"
        />

        <InputField
          control={control}
          fullWidth
          label="Password"
          name="password"
          placeholder="Create a password"
          type="password"
        />

        <InputField
          control={control}
          fullWidth
          label="Confirm password"
          name="confirmPassword"
          placeholder="Confirm your password"
          type="password"
        />

        <Button disabled={register.isPending} fullWidth type="submit" variant="solid">
          {register.isPending ? "Creating account..." : "Sign up"}
        </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="text.secondary" variant="body2">
          Already have an account?{" "}
          <Typography
            component={Link}
            href="/login"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Sign in
          </Typography>
        </Typography>
      </Box>
    </Paper>
  );
}

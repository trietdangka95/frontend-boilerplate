import { z } from "zod";

type EnvSource = Record<string, string | undefined>;

const appEnvSchema = z.enum(["development", "test", "staging", "production"]);

export const publicEnvSchema = z
  .object({
    NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_ENV: appEnvSchema.default("development"),
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  })
  .transform((env) => ({
    NEXT_PUBLIC_API_BASE_URL: env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api",
    NEXT_PUBLIC_APP_ENV: env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  }));

export type PublicEnv = z.infer<typeof publicEnvSchema>;

function formatEnvError(error: z.ZodError) {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "env";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

function pickPublicEnv(source: EnvSource) {
  return {
    NEXT_PUBLIC_API_BASE_URL: source.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_ENV: source.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_SITE_URL: source.NEXT_PUBLIC_SITE_URL,
  };
}

function getDefaultPublicEnvSource(): EnvSource {
  return {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  };
}

export function getPublicEnv(source: EnvSource = getDefaultPublicEnvSource()): PublicEnv {
  const parsed = publicEnvSchema.safeParse(pickPublicEnv(source));

  if (!parsed.success) {
    throw new Error(`Invalid public environment variables: ${formatEnvError(parsed.error)}`);
  }

  return parsed.data;
}

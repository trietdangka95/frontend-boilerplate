import { z } from "./zod";

import { getPublicEnv, type PublicEnv } from "./env";

type EnvSource = Record<string, string | undefined>;

const DEMO_SESSION_SECRET_PLACEHOLDER =
  "replace-with-a-unique-random-secret-at-least-32-characters-long";

const demoSessionEnvSchema = z.object({
  DEMO_SESSION_SECRET: z
    .string()
    .min(32, "Must contain at least 32 characters for HMAC signing")
    .refine((secret) => secret !== DEMO_SESSION_SECRET_PLACEHOLDER, {
      message: "Must replace the documented placeholder with a unique secret",
    }),
});

export type ServerEnv = PublicEnv;

function formatEnvError(error: z.ZodError) {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "env";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

function getDefaultServerEnvSource(): EnvSource {
  return {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  };
}

export function getServerEnv(source?: EnvSource): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv can only be called from server-side code.");
  }

  const envSource = source ?? getDefaultServerEnvSource();
  return getPublicEnv(envSource);
}

export function getDemoSessionSecret(source?: EnvSource) {
  if (typeof window !== "undefined") {
    throw new Error("getDemoSessionSecret can only be called from server-side code.");
  }

  const parsed = demoSessionEnvSchema.safeParse({
    DEMO_SESSION_SECRET: source?.DEMO_SESSION_SECRET ?? process.env.DEMO_SESSION_SECRET,
  });

  if (!parsed.success) {
    throw new Error(`Invalid server environment variables: ${formatEnvError(parsed.error)}`);
  }

  return parsed.data.DEMO_SESSION_SECRET;
}

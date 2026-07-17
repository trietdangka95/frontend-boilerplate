import { z } from "zod";

import { getPublicEnv, type PublicEnv } from "./env";

type EnvSource = Record<string, string | undefined>;

const serverOnlyEnvSchema = z.object({
  API_REFRESH_ENDPOINT: z
    .string()
    .regex(/^\/(?!\/)/, "Must be a root-relative path")
    .default("/auth/refresh"),
});

export type ServerEnv = PublicEnv & z.infer<typeof serverOnlyEnvSchema>;

function formatEnvError(error: z.ZodError) {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "env";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

function pickServerEnv(source: EnvSource) {
  return {
    API_REFRESH_ENDPOINT: source.API_REFRESH_ENDPOINT,
  };
}

function getDefaultServerEnvSource(): EnvSource {
  return {
    API_REFRESH_ENDPOINT: process.env.API_REFRESH_ENDPOINT,
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
  const parsed = serverOnlyEnvSchema.safeParse(pickServerEnv(envSource));

  if (!parsed.success) {
    throw new Error(`Invalid server environment variables: ${formatEnvError(parsed.error)}`);
  }

  return {
    ...getPublicEnv(envSource),
    ...parsed.data,
  };
}

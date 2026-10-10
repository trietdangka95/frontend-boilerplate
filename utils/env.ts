import { z } from "./zod";

type EnvSource = Record<string, string | undefined>;

const appEnvSchema = z.enum(["development", "test", "staging", "production"]);
const httpUrlSchema = z
  .string()
  .url()
  .refine((value) => {
    if (!URL.canParse(value)) return false;
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
  }, "Must be an HTTP(S) URL without credentials");

export const publicEnvSchema = z
  .object({
    NEXT_PUBLIC_API_BASE_URL: httpUrlSchema.optional(),
    NEXT_PUBLIC_APP_ENV: appEnvSchema.default("development"),
    NEXT_PUBLIC_SITE_URL: httpUrlSchema.optional(),
  })
  .superRefine((env, context) => {
    if (!["staging", "production"].includes(env.NEXT_PUBLIC_APP_ENV)) return;
    for (const key of ["NEXT_PUBLIC_API_BASE_URL", "NEXT_PUBLIC_SITE_URL"] as const) {
      const value = env[key];
      if (!value) {
        context.addIssue({ code: "custom", path: [key], message: "Required for deployments" });
      } else if (URL.canParse(value)) {
        const url = new URL(value);
        if (
          url.protocol !== "https:" ||
          ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
        ) {
          context.addIssue({
            code: "custom",
            path: [key],
            message: "Must use a non-local HTTPS deployment URL",
          });
        }
      }
    }
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
    NEXT_PUBLIC_APP_ENV:
      source.NODE_ENV === "production" &&
      (!source.NEXT_PUBLIC_APP_ENV || source.NEXT_PUBLIC_APP_ENV === "development")
        ? "production"
        : (source.NEXT_PUBLIC_APP_ENV ?? "development"),
    NEXT_PUBLIC_SITE_URL: source.NEXT_PUBLIC_SITE_URL,
  };
}

function getDefaultPublicEnvSource(): EnvSource {
  return {
    NODE_ENV: process.env.NODE_ENV,
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

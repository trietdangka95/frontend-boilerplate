import { z } from "@/utils/zod";

export const DEMO_SESSION_COOKIE_NAME = "northstar-demo-session";
export const DEMO_SESSION_TTL_SECONDS = 28_800;
export const REMEMBERED_DEMO_SESSION_TTL_SECONDS = 2_592_000;

const DEMO_SESSION_TOKEN_VERSION = 1;
const TOKEN_PART_COUNT = 2;
const HMAC_ALGORITHM = "SHA-256";

const demoSessionClaimsSchema = z.object({
  exp: z.number().int().positive(),
  iat: z.number().int().nonnegative(),
  jti: z.string().uuid(),
  version: z.literal(DEMO_SESSION_TOKEN_VERSION),
});

interface CreateDemoSessionTokenOptions {
  issuedAt?: Date;
  rememberMe: boolean;
  secret: string;
}

interface VerifyDemoSessionTokenOptions {
  now?: Date;
  secret: string;
}

function encodeBase64Url(value: string | Uint8Array) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url");
}

async function importSigningKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { hash: HMAC_ALGORITHM, name: "HMAC" },
    false,
    ["sign", "verify"],
  );
}

export async function createDemoSessionToken({
  issuedAt = new Date(),
  rememberMe,
  secret,
}: CreateDemoSessionTokenOptions) {
  const issuedAtSeconds = Math.floor(issuedAt.getTime() / 1_000);
  const lifetimeSeconds = rememberMe
    ? REMEMBERED_DEMO_SESSION_TTL_SECONDS
    : DEMO_SESSION_TTL_SECONDS;
  const payload = encodeBase64Url(
    JSON.stringify({
      exp: issuedAtSeconds + lifetimeSeconds,
      iat: issuedAtSeconds,
      jti: crypto.randomUUID(),
      version: DEMO_SESSION_TOKEN_VERSION,
    }),
  );
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));

  return `${payload}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export async function verifyDemoSessionToken(
  token: string,
  { now = new Date(), secret }: VerifyDemoSessionTokenOptions,
) {
  try {
    const parts = token.split(".");

    if (parts.length !== TOKEN_PART_COUNT) {
      return false;
    }

    const [payload, encodedSignature] = parts;

    if (!payload || !encodedSignature) {
      return false;
    }

    const key = await importSigningKey(secret);
    const signatureIsValid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(encodedSignature),
      new TextEncoder().encode(payload),
    );

    if (!signatureIsValid) {
      return false;
    }

    const claims = demoSessionClaimsSchema.parse(
      JSON.parse(decodeBase64Url(payload).toString("utf8")),
    );
    const nowSeconds = Math.floor(now.getTime() / 1_000);

    return claims.exp > nowSeconds && claims.iat <= nowSeconds;
  } catch {
    return false;
  }
}

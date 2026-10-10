type ErrorSource = "server" | "route-boundary" | "global-boundary";

export interface ErrorEvent {
  event: "application.error";
  source: ErrorSource;
  timestamp: string;
  digest?: string;
}

/** Replace the sink with your monitoring provider; never forward the raw error. */
export function reportError(
  error: unknown,
  source: ErrorSource,
  sink: (event: ErrorEvent) => void = (event) => console.error(JSON.stringify(event)),
) {
  const digest =
    error instanceof Error &&
    "digest" in error &&
    typeof error.digest === "string" &&
    /^[a-zA-Z0-9-]{1,64}$/.test(error.digest)
      ? error.digest
      : undefined;
  sink({
    event: "application.error",
    source,
    timestamp: new Date().toISOString(),
    ...(digest ? { digest } : {}),
  });
}

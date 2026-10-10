/** Demo sessions are opt-in and are never accepted by a deployed application. */
export function isDemoAuthEnabled() {
  return process.env.ENABLE_DEMO_AUTH === "true" && process.env.NODE_ENV !== "production";
}

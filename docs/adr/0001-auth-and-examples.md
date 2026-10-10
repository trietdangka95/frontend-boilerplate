# ADR 0001: Independent starter and explicit authentication recipes

Status: accepted for this boilerplate hardening change, 2026-09-11.

## Decision

The starter route is public and independent of the dashboard. Shared components, tokens, query infrastructure, forms, and UI state remain reusable core code. The catalog and in-memory data live under app/examples and features/example. The in-memory transport demonstrates Query lifecycles; it is not a durable API and must not be used as a server-side user data store.

The default identity resolver returns null. This is an extension point with denied access, not an authentication implementation. Replace it with the selected provider's verified server session. Do not accept user IDs from request headers or unverified cookie payloads.

Private Route Handlers call requireSession directly before data access, even though proxy.ts also gates non-public routes. Authorization for roles, tenant membership, and resource ownership belongs at the data boundary. Public webhook and health endpoints must be explicitly allowlisted; a webhook still needs its provider's signature validation.

Cookie/BFF and bearer-token clients are separate recipes. The browser cookie client uses /api and does not attempt token refresh. Server clients are created per request. The API factory owns a fresh token store by default; opt-in bearer clients receive their own store and refresh endpoint. Access tokens never belong in localStorage. Refresh cookies and their rotation remain the backend's responsibility.

The demo session and forms are local teaching examples. ENABLE_DEMO_AUTH must be true and NODE_ENV must not be production. Both proxy and the session route enforce this. Auth layouts and the private demo page also guard their own rendering. Cookie writes validate Origin. Register/recovery return NOT_IMPLEMENTED, not simulated success. Demo sessions never unlock ordinary private API routes.

## Migration

- / now renders the starter; the previous dashboard is /examples.
- /login redirects successful local-demo logins to /examples/private.
- /api/auth/session remains a local-only demonstration; it is 404 in production.
- Imports of apiClient from services/api/api-client move to services/api/browser-client.
- Server callers use createServerApiClient with request-scoped credentials.
- Remove API_REFRESH_ENDPOINT from environment files; pass refreshEndpoint explicitly when configuring a bearer client.
- Replace resolveSession to connect real auth. Return a verified userId and extend the session contract intentionally when tenant/role data is needed.

## Removing optional examples

Keep shared components, stores, providers, theme, and services. Remove app/examples and features/example, then remove the Explore examples link from app/page.tsx and the /examples entries from proxy.ts. Adapt the browser tests to your own first feature. The starter has no import from features/example.

To remove demo authentication too, remove app/(auth), app/api/auth/session, and features/auth. Remove the explicitly marked demo branches/imports and demo route allowlists in proxy.ts; retain requireSession and public route policy. Remove the demo Playwright server/project and tests/e2e/demo.spec.ts. Delete ENABLE_DEMO_AUTH and DEMO_SESSION_SECRET from your environment template and the demo secret helper/tests in utils/env.server. Keep or replace the production session resolver independently. Run all quality gates after removal.

No removal script deletes files automatically: a derived project may already contain user code in these folders.

## Consequences

There is no production login until a provider is connected. This makes the integration requirement explicit. CSP nonces require dynamic rendering; static export would need a separate rendering/security decision. Exact public-route allowlists mean new public assets and routes must be declared deliberately.

## References

- [Next.js authentication and data access](https://nextjs.org/docs/app/guides/authentication)
- [Next.js CSP and nonces](https://nextjs.org/docs/app/guides/content-security-policy)
- [TanStack Query server rendering](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)

# Enterprise Frontend Boilerplate

A Next.js App Router starter with strict TypeScript, MUI, semantic Tailwind utilities, TanStack Query/Table, Axios, React Hook Form, Zod, and tested shared components. Node 24 LTS and pnpm 10.12.1 are the supported toolchain; exact dependency versions live in package.json and the lockfile.

## Start locally

Use Node 24 (see .node-version), then:

```bash
corepack pnpm install --frozen-lockfile
cp .env.example .env.local
corepack pnpm dev
```

The public starter is at http://localhost:3000. The component catalog and data examples live at /examples. No login or secret is needed for the default starter.

Demo authentication is disabled by default. To explore it locally, set ENABLE_DEMO_AUTH=true and generate a unique DEMO_SESSION_SECRET of at least 32 characters in your local environment. Open /login. Any schema-valid credentials demonstrate a session; they do not identify a real user. Registration and password recovery explicitly report that no backend is connected. The production runtime always rejects demo authentication, even if the flag is enabled.

## Architecture

- app/: routes, metadata, providers, fallbacks; / is the independent starter, /examples is the reference dashboard.
- components/ui/: shared MUI primitives and form controls.
- components/layout/: reusable shell and page composition.
- features/: feature-local components, hooks, query options, schemas, services, and types.
- services/api/: transport factory, client/server boundaries, error normalization, optional bearer refresh.
- services/auth/: fail-closed session contract and same-origin cookie-write check.
- services/observability/: redacted error events and replaceable reporting sink.
- theme/: shared tokens, MUI mapping, light/dark schemes, styling contract tests.
- tests/e2e/: production browser checks and isolated local demo-auth tests.

Prefer Server Components. Keep API reads in TanStack queries and writes in mutations. Query-key factories and typed queryOptions are reused for server prefetch and client hydration. Use React Hook Form + feature-local Zod schemas for forms; mutation.isPending owns async submit state. Zustand is limited to shared AppShell UI state.

The styling pipeline is theme/tokens.ts → MUI CSS variables → semantic Tailwind aliases. Reuse components/ui/DataTable and its v9 column helper. See [design system](docs/design-system.md), [TanStack contract](docs/specs/tanstack-stable-best-practices.md), and AGENTS.md.

The root layout reads request headers for CSP nonces, so application pages are dynamically rendered. This starter requires a Next.js server; static export is not the default deployment model.

## Configuration

| Variable                 | Local/test                                         | Staging/production                             |
| ------------------------ | -------------------------------------------------- | ---------------------------------------------- |
| NEXT_PUBLIC_APP_ENV      | Defaults from NODE_ENV; test is for isolated tests | staging or production                          |
| NEXT_PUBLIC_API_BASE_URL | localhost fallback                                 | Required HTTPS URL, no credentials or loopback |
| NEXT_PUBLIC_SITE_URL     | localhost fallback                                 | Required HTTPS URL, no credentials or loopback |
| ENABLE_DEMO_AUTH         | false; explicit local opt-in                       | Always ineffective                             |
| DEMO_SESSION_SECRET      | Needed only for demo auth                          | Unused by core                                 |

Public variables are embedded at build time. Build separately for each deployment configuration; changing only runtime environment values does not rewrite browser bundles. Metadata, sitemap, and robots use the validated site URL. Missing deployment URLs fail before compilation. NEXT_PUBLIC_APP_ENV=test is reserved for local integration tests, not deployment.

API_REFRESH_ENDPOINT has been removed: it was not connected to runtime behavior. Configure refreshEndpoint explicitly on an optional bearer client.

## Authentication and API contracts

The core does not ship a working identity provider. resolveSession in services/auth/session.ts returns null until you connect one. Unknown API routes and private pages are denied by default. Public pages, metadata, and /api/health are explicitly allowlisted in proxy.ts.

Every private Route Handler must also call requireSession before accessing data. A page redirect or proxy check alone is not data authorization. Apply tenant, role, and ownership rules at the service/data boundary.

Use services/api/browser-client.ts for same-origin cookie/BFF requests. It deliberately does not refresh bearer tokens on 401. For external APIs use createApiClient with its own createAccessTokenStore, enableRefresh, and refreshEndpoint. Create a new createServerApiClient inside each server request; never put a credential-bearing client in a module singleton. See the [auth decision and migration guide](docs/adr/0001-auth-and-examples.md).

## Quality checks

```bash
corepack pnpm test
corepack pnpm test:coverage
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm format:check
corepack pnpm build
corepack pnpm exec playwright install chromium
corepack pnpm e2e
```

A production build requires valid deployment URLs. For local production-mode smoke checks, Playwright supplies explicit test settings automatically. E2E starts a production build on port 3101 and a separate local demo server on port 3102, with a randomly generated test-only secret. It never reuses an existing server. Desktop/mobile and light/dark projects cover navigation, forms, tables, keyboard focus, console errors, and security boundaries.

Turbopack is the default. On restricted hosts where its internal worker cannot open a port, Next also supports pnpm build --webpack. Set E2E_WEBPACK=true for the same supported bundler in the browser suite.

Vitest coverage includes both tested and untested application files, excluding tests, declarations, type-only files, and barrels. Gates are 80% statements/lines/functions and 70% branches. CI runs quality and browser jobs, uploads reports, and audits production dependencies. Husky runs lint-staged on commit. Dependabot proposes weekly dependency updates.

## Adapting the starter

1. Rename branding and metadata, and edit existing tokens in theme/tokens.ts.
2. Add your feature under features/ and use shared query/form/table patterns.
3. Connect a real identity provider at the session contract before adding private data.
4. Replace example transports with typed, validated API services.
5. Remove optional examples using the [removal guide](docs/adr/0001-auth-and-examples.md).
6. Follow the [deployment checklist](docs/production.md).

/api/health is a minimal no-store liveness endpoint. It does not claim that a future backend or database is ready. Error boundaries and Next instrumentation emit redacted structured events; wire the reporting sink to your chosen monitoring service before launch. No monitoring account, database, real authentication provider, or deployment is provisioned by this repository.

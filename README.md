# Enterprise Frontend Boilerplate

A production-ready Next.js App Router boilerplate with strict TypeScript, MUI primitives, Tailwind CSS utilities, TanStack Query, Axios refresh-token networking, Zustand UI state, React Hook Form, Zod, Vitest, and a small example feature slice.

## Quick Start

```bash
corepack pnpm install
cp .env.example .env.local
corepack pnpm dev
```

The app runs on [http://localhost:3000](http://localhost:3000) by default.

## Commands

| Command                       | Description                     |
| ----------------------------- | ------------------------------- |
| `corepack pnpm dev`           | Start the Next.js dev server    |
| `corepack pnpm build`         | Create a production build       |
| `corepack pnpm start`         | Start the production server     |
| `corepack pnpm lint`          | Run ESLint                      |
| `corepack pnpm lint:fix`      | Run ESLint with fixes           |
| `corepack pnpm format`        | Format files with Prettier      |
| `corepack pnpm format:check`  | Check Prettier formatting       |
| `corepack pnpm typecheck`     | Run TypeScript without emitting |
| `corepack pnpm test`          | Run Vitest tests                |
| `corepack pnpm test:coverage` | Run Vitest with coverage        |

## Project Structure

```text
.
|-- app/                  # App Router routes, providers, and route fallbacks
|-- components/
|   |-- common/           # Cross-app common UI such as toast provider
|   `-- ui/               # Reusable base UI primitives
|-- features/
|   `-- example/          # Example feature-local components, hooks, schemas, services, types
|-- providers/            # Client provider boundaries
|-- services/
|   |-- api/              # Axios client, error normalization, auth refresh helpers
|   `-- query/            # TanStack Query client setup
|-- stores/               # Zustand client UI state
|-- theme/                # MUI theme
|-- types/                # Shared TypeScript contracts
|-- utils/                # Shared utilities and env validation
|-- docs/                 # Specs and implementation plans
`-- tests/                # Test setup
```

Feature modules own feature-specific code. Shared primitives stay in top-level shared folders.

## Architecture

The app defaults to Server Components. Browser-only state, providers, form controls, and interactive UI live behind explicit client boundaries.

Global client providers are composed in `app/providers.tsx`:

- MUI App Router cache provider with CSS layer support.
- MUI theme provider.
- TanStack Query provider with a server-fresh and browser-stable query client.
- React Hot Toast provider.

Tailwind CSS v4 and MUI are ordered through cascade layers in `app/globals.css`:

```css
@layer theme, base, mui, components, utilities;
@import "tailwindcss";
```

This lets Tailwind utilities override MUI component styles without `!important`.

The Axios client in `services/api` uses:

- Public API base URL from validated env.
- Request timeout, JSON headers, credentials, and request IDs.
- In-memory access token support only.
- HTTP-only refresh cookie assumptions.
- Single-flight refresh queue for parallel 401 responses.
- Normalized `AppApiError` errors.

## Environment Variables

Copy `.env.example` to `.env.local` for local overrides.

| Variable                   | Scope       | Required         | Notes                                             |
| -------------------------- | ----------- | ---------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Public      | Optional locally | Defaults to `http://localhost:3000/api`           |
| `NEXT_PUBLIC_APP_ENV`      | Public      | Optional         | `development`, `test`, `staging`, or `production` |
| `API_REFRESH_ENDPOINT`     | Server-only | Optional         | Defaults to `/auth/refresh`                       |

Only `NEXT_PUBLIC_*` values may be used by client code. Runtime secrets must remain server-only.

## Security Notes

- Refresh tokens are assumed to live in HTTP-only cookies, not `localStorage` or `sessionStorage`.
- Access tokens are stored in memory only through `services/api/auth-token.ts`.
- `.env*` files are ignored except `.env.example`.
- API errors are normalized before reaching app code to avoid leaking transport internals.
- Validate external input at boundaries with Zod schemas.

## UI Standards

Reusable components should:

- Use MUI primitives for accessible structure.
- Use Tailwind utilities for local layout and visual overrides.
- Forward refs where consumers naturally expect them.
- Accept `className` and relevant MUI props.
- Keep server state in TanStack Query, not Zustand.
- Keep global client state limited to reusable UI preferences.

Current base primitives include:

- `Button`
- `Modal`
- `InputField`
- `SelectBox`
- `CheckboxField`
- `DataTable`
- `AppToastProvider` and `appToast`

## Forms

Form primitives work both uncontrolled and with React Hook Form `Controller`. Use feature-local Zod schemas and `zodResolver` for validation.

```tsx
<InputField control={control} label="Owner email" name="owner" type="email" />
```

## Performance Guidance

- Prefer Server Components and static rendering by default.
- Keep client components as small as practical.
- Put browser-only providers in `app/providers.tsx`, not in every route.
- Use TanStack Query stale times above zero to avoid immediate hydration refetch churn.
- Use Next.js image and font primitives when adding production assets.
- Use dynamic imports for rarely used heavy client-only surfaces.
- Watch Core Web Vitals: LCP under 2.5s, CLS under 0.1, INP under 200ms.

## Tooling Notes

The plan draft listed newer TypeScript and ESLint versions. This implementation uses `typescript@6.0.3` and `eslint@9.39.4` because the current TypeScript ESLint and Next lint ecosystem does not fully support the draft `typescript@7` plus `eslint@10` combination without parser incompatibilities.

## Verification

Before handoff or merge, run:

```bash
corepack pnpm lint
corepack pnpm format:check
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

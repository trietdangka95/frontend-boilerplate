# Project rules for coding agents

## Scope and intent

These instructions apply to the entire repository. Treat `MUST`, `MUST NOT`, and `NEVER` as
non-negotiable. A nested `AGENTS.md` may add stricter rules for its directory, but it must not weaken
these rules.

This repository is a production-oriented Next.js boilerplate. New code must extend the established
patterns instead of introducing a second styling, data-fetching, form, or state-management system.

Before changing code:

1. Read the nearest existing implementation and its tests.
2. Read the relevant source-of-truth document listed below.
3. Confirm the installed package version in `package.json` before using an API.
4. For framework/library behavior, use current official documentation for the installed stable
   version. Never copy alpha, beta, RC, canary, experimental, or legacy examples.

## Source-of-truth map

| Concern                          | Source of truth                                   | Copyable implementation                       |
| -------------------------------- | ------------------------------------------------- | --------------------------------------------- |
| Design tokens                    | `theme/tokens.ts`                                 | `docs/design-system.md`                       |
| MUI theme and component defaults | `theme/theme.ts`                                  | existing `Mui*` overrides                     |
| Tailwind semantic aliases        | `app/globals.css`                                 | semantic classes in `components/`             |
| Styling constraints              | `theme/styling-contract.test.ts`                  | its contract tests                            |
| TanStack Query client            | `services/query/query-client.ts`                  | `providers/QueryProvider.tsx`                 |
| Query keys and options           | `features/example/queries/example-records.ts`     | `exampleRecordsQueryOptions`                  |
| Query/mutation hooks             | `features/example/hooks/use-example-records.ts`   | `useExampleRecords`, `useCreateExampleRecord` |
| Form submit state                | `features/example/components/RecordWorkspace.tsx` | `createRecord.isPending`                      |
| TanStack Table v9                | `components/ui/DataTable/`                        | `DataTable` and `createDataTableColumnHelper` |
| Detailed TanStack contract       | `docs/specs/tanstack-stable-best-practices.md`    | examples in `README.md`                       |

## Architecture and ownership

- Use strict TypeScript. Do not add `any`, unsafe casts, ignored errors, or disabled lint/test rules
  to make a change pass.
- Prefer Server Components. Add `"use client"` only when the component needs interaction,
  browser-only APIs, or client hooks; keep the client boundary small.
- Organize feature code under `features/<feature>/` with feature-local `components`, `hooks`,
  `queries`, `schemas`, `services`, and `types` as needed.
- Components render UI and coordinate hooks. They MUST NOT contain Axios/fetch transport code.
- API transport functions live in a service module and return typed domain data. API errors use the
  shared normalization in `services/api/`.
- Server state belongs to TanStack Query, form state to React Hook Form, shareable navigation state
  to the URL, and cross-screen client-only UI state to Zustand. Do not duplicate the same state in
  two systems.
- Prefer `@/` imports across boundaries and relative imports inside one feature/component folder.
- Reuse or extend a shared primitive in `components/ui/` when behavior or appearance repeats.

## TanStack Query: all API state

Every API read MUST use TanStack Query. Every API write MUST use a TanStack mutation. Do not call a
transport function directly from a component, event handler, or `useEffect`.

Required query pattern:

```ts
export const projectKeys = {
  all: ["projects"] as const,
  list: () => [...projectKeys.all, "list"] as const,
};

export const projectsQueryOptions = () =>
  queryOptions({
    queryFn: listProjects,
    queryKey: projectKeys.list(),
  });

export function useProjects() {
  return useQuery(projectsQueryOptions());
}
```

- Keep a query-key factory and typed `queryOptions` factory next to each resource.
- Reuse the exact options factory in client hooks, `prefetchQuery`, and hydration. Do not duplicate
  keys or query functions at call sites.
- Use `getQueryClient()` for SSR-safe server prefetching and the stable browser singleton. Do not
  create a new `QueryClient` during component renders.
- Derive loading, error, success, and retry UI from the query/mutation result. Do not mirror them in
  `useState` or a custom store.
- After a mutation, update or invalidate the narrowest key owned by the resource. Await invalidation
  when completion order affects UI behavior.
- Keep query data, column definitions, and fallback arrays referentially stable.
- Follow the TanStack ESLint rules already enabled in `eslint.config.mjs`; never suppress them to
  bypass an unstable dependency or lifecycle bug.

Required form-submit pattern:

```tsx
const createProject = useCreateProject();

const onSubmit = handleSubmit((values) => {
  createProject.mutate(values);
});

return (
  <Button disabled={createProject.isPending} isLoading={createProject.isPending} type="submit">
    Create project
  </Button>
);
```

Never write manual request state:

```tsx
// Forbidden
const [isSubmitting, setIsSubmitting] = useState(false);
await createProjectRequest(values);
```

Use React Hook Form with a feature-local Zod schema for form values and validation. A mutation owns
the async submit lifecycle; the form MUST NOT own a second loading flag.

## TanStack Table v9

- Use only the installed stable v9 APIs: the shared `createDataTableColumnHelper`, `useTable`,
  registered features, and `table.FlexRender`.
- Do not use legacy/v8 examples such as `useReactTable`, standalone `flexRender`, or row-model APIs
  that bypass the v9 feature registration used here.
- Define the column helper and empty fallback outside the component. Memoize column definitions when
  they are created in a component.
- Register only the table features the shared component actually uses.
- Reuse `components/ui/DataTable/` before creating a feature-specific table implementation.

## CSS, Tailwind, and MUI

The single styling pipeline is:

```text
theme/tokens.ts -> MUI theme -> --mui-* CSS variables -> semantic Tailwind utilities
```

Ownership rules:

| Styling concern                                                 | Required owner                    |
| --------------------------------------------------------------- | --------------------------------- |
| Raw colors, radius, shadows, motion, spacing base, shared sizes | `theme/tokens.ts`                 |
| MUI component defaults and variants                             | `theme/theme.ts`                  |
| Local layout and composition                                    | Tailwind utilities                |
| MUI-aware responsive/component style                            | semantic MUI `sx`                 |
| Repeated visual behavior                                        | shared component or theme variant |

Non-negotiable styling rules:

- NEVER add a React `style={{ ... }}` prop. `app/global-error.tsx` is the only existing exception
  because it renders outside the normal providers; do not copy that fallback pattern elsewhere.
- NEVER add raw hex, RGB, HSL, named color literals, or duplicated shadow/font-family values outside
  `theme/tokens.ts`.
- NEVER use raw Tailwind palette utilities such as `bg-white`, `text-slate-600`, `border-gray-200`,
  or `text-red-700`. Use purpose-based aliases such as `bg-surface`, `text-muted`,
  `border-default`, and `text-error`.
- NEVER use Tailwind arbitrary-value utilities such as `w-[680px]`, `top-[72px]`, or
  `bg-[#ffffff]`. Use the standard scale or add a named shared token.
- Do not add a component class to global CSS when Tailwind composition, MUI `sx`, a theme override,
  or a shared variant expresses the same behavior.
- Use `cn()` from `utils/cn.ts` for conditional or caller-provided class names.
- Use Tailwind responsive prefixes or MUI breakpoint objects; do not add isolated media-query
  breakpoints that diverge from the theme.
- Preserve focus, hover, disabled, loading, error, empty, light, dark, and reduced-motion behavior.

Good:

```tsx
<section className="rounded-lg border border-default bg-surface p-6 text-foreground">
  <p className="text-sm text-muted">Current server state</p>
</section>

<Box sx={{ bgcolor: "background.paper", borderColor: "divider", gap: 3, p: 4 }} />
```

Forbidden:

```tsx
<section style={{ background: "#fff", padding: 24 }} />
<section className="w-[680px] bg-white p-[24px] text-slate-600" />
<Box sx={{ bgcolor: "#fff", maxWidth: 680, p: "24px" }} />
```

When adding a new semantic visual role:

1. Define its light/dark raw values in `theme/tokens.ts`.
2. Map it in `theme/theme.ts` so MUI emits the runtime CSS variable.
3. Add a purpose-based alias in `app/globals.css` only if Tailwind composition needs it.
4. Extend `theme/styling-contract.test.ts`.

Changing an existing theme value should remain a one-file edit in `theme/tokens.ts` and affect the
whole application.

## No magic numbers or strings

- A non-obvious number or string that controls UI, behavior, retries, timeouts, pagination, limits,
  status, storage, routes, or protocol behavior MUST have a descriptive owner and name.
- For spacing, use Tailwind's shared spacing scale or MUI spacing multipliers (`gap: 3`, `p: 4`).
  Those multipliers are tokens, not pixel values.
- For shared dimensions, radii, animation durations, shadows, and typography, add or reuse a named
  value in `theme/tokens.ts`.
- For feature-specific behavior, define a named constant next to the owning feature. Promote it to a
  shared config only when multiple features own the same concept.
- Centralize repeated domain strings in a typed union, enum-like `as const` object, or lookup map.
- `0` and `1` are allowed only when their arithmetic/boolean meaning is self-evident. Test fixtures
  and genuinely one-off content values are allowed, but configuration disguised as a literal is not.
- Do not extract a literal into a meaningless name such as `VALUE` or `NUMBER`. The name must explain
  why it exists.

```ts
// Good
const DEFAULT_PAGE_SIZE = 25;
const QUERY_STALE_TIME_MS = 60_000;

// Forbidden
paginate(rows, 25);
staleTime: 60 * 1000;
```

## Testing and completion

- Write or update tests with every behavior change. Prefer observable behavior over implementation
  details and keep tests beside the code they protect.
- Styling-system changes MUST update `theme/styling-contract.test.ts` when the contract changes.
- TanStack changes MUST cover loading, error, empty/success state, cache synchronization, and stable
  references where relevant.
- UI changes must be checked at desktop and mobile sizes in light and dark modes. Confirm keyboard
  focus and that the browser console has no new errors.
- Do not disable, skip, or delete a test to make a change pass.
- Preserve unrelated working-tree changes. Do not perform destructive Git operations.

Run these gates before handoff:

```bash
corepack pnpm test
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm format:check
corepack pnpm build
```

For documentation-only changes, at minimum run Prettier on the changed Markdown file and
`git diff --check`.

## Dependency and scope boundaries

- Use only stable package releases. No alpha, beta, RC, canary, experimental, or deprecated APIs.
- Do not add another TanStack product, form library, styling engine, state manager, router, or table
  implementation without explicit approval.
- Do not add a dependency when an installed dependency or small local helper already solves the
  problem.
- Ask before changing a public component API, persistence format, authentication flow, route
  contract, or the design-token contract.
- Never commit secrets, edit real environment credentials, or log tokens/user-sensitive data.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

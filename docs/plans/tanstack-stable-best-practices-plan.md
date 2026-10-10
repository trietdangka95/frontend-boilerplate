# Implementation Plan: TanStack stable best practices

## Architecture Decisions

- Keep feature-owned query options next to the example feature so client hooks and server prefetch
  share the same key and function.
- Use Query hydration at the App Router page boundary and a server-fresh/browser-stable QueryClient.
- Migrate directly to the Table v9 API and register only filtering, sorting, and pagination features.
- Keep table state internal because the example is client-side; do not add TanStack Store solely to
  lift state that no external consumer needs.

## Task List

### Task 1: Stable dependencies and specification

- Acceptance: Query, Query ESLint, and Table resolve to stable npm `latest` versions only.
- Verify: inspect `package.json` and the lockfile; run dependency installation successfully.
- Files: `package.json`, `pnpm-lock.yaml`, this spec and plan.

### Task 2: Query App Router example

- Acceptance: one typed query-options definition is shared by the hook and server prefetch; the
  provider uses the documented SSR-safe QueryClient lifecycle; create mutation updates and then
  reconciles the cache.
- Verify: focused QueryClient, provider, hook, and page tests pass.
- Files: Query service/provider, example query/hook, page, colocated tests.

### Checkpoint: Query

- Focused tests and typecheck pass before Table migration starts.

### Task 3: Table v9 example

- Acceptance: the reusable DataTable uses `useTable`, explicit feature registration, native v9
  rendering, and stable input references; existing user-visible behavior remains intact.
- Verify: DataTable component tests cover sorting, filtering, paging, and fallback states.
- Files: DataTable implementation/types/tests and example columns/data integration.

### Task 4: Usage documentation

- Acceptance: README explains the package boundary and includes one copyable example for Query and
  one for Table with official documentation links.
- Verify: formatting check passes and all referenced local APIs exist.
- Files: `README.md`.

### Checkpoint: Complete

- Full lint, format, typecheck, test, and build commands pass.
- Final diff contains no prerelease dependency or legacy/experimental TanStack API.

## Risks and Mitigations

| Risk                                     | Impact | Mitigation                                                                              |
| ---------------------------------------- | ------ | --------------------------------------------------------------------------------------- |
| Table v9 type/API breakage               | High   | Migrate against the official v9 guide and compile after the table slice.                |
| Duplicate client fetch after hydration   | Medium | Use a positive default `staleTime` and a shared `queryOptions` factory.                 |
| Unstable table inputs rebuild row models | Medium | Keep fallback data and feature definitions at module scope and memoize feature columns. |

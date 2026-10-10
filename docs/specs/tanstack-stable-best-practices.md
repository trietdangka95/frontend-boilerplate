# Spec: TanStack stable best practices

Status: Approved for implementation
Date: 2026-08-23

## Objective

Modernize the TanStack libraries already used by the boilerplate and leave one production-ready,
copyable example for each library. The result should demonstrate server-state handling with TanStack
Query and a reusable client-side data grid with TanStack Table without introducing overlapping
TanStack Router, Form, or Store abstractions.

## Tech Stack

- Next.js 16.2.10 and React 19.2.7
- `@tanstack/react-query` 5.102.1 (npm `latest`, stable)
- `@tanstack/eslint-plugin-query` 5.102.1 (npm `latest`, stable)
- `@tanstack/react-table` 9.1.2 (npm `latest`, stable)
- TypeScript 6.0.3 and Vitest 4.1.10

Alpha, beta, release-candidate, experimental, and legacy compatibility APIs are out of scope.

## Commands

```bash
corepack pnpm lint
corepack pnpm format:check
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

## Project Structure

- `services/query/`: SSR-safe QueryClient creation and cache defaults.
- `features/example/queries/`: co-located query keys and typed query options.
- `features/example/hooks/`: query and mutation hooks used by the example workspace.
- `components/ui/DataTable/`: reusable TanStack Table v9 integration and component tests.
- `app/page.tsx`: server prefetch and hydration example.
- `README.md`: copyable Query and Table usage examples.

## Code Style

Keep query keys beside their query functions and reuse one typed options factory everywhere:

```ts
export const exampleRecordsQuery = queryOptions({
  queryFn: listExampleRecords,
  queryKey: ["example-records"],
});
```

Table features, fallback data, and column definitions must have stable references. Only register the
Table v9 features the component uses.

## Testing Strategy

- Unit-test QueryClient server/browser lifecycle and default options.
- Component-test query loading, mutation cache synchronization, and table sorting/filtering/paging.
- Test application rendering with dehydrated server data.
- Run the complete lint, format, typecheck, test, and production-build gates.

## Boundaries

- Always: use stable npm dist-tags, official TanStack APIs, strict TypeScript, and accessible UI.
- Ask first: add a new TanStack product, replace Next routing, React Hook Form, or Zustand.
- Never: use alpha/beta/RC packages, experimental APIs, Table legacy imports, or disable tests.

## Success Criteria

- Package manifests contain only stable TanStack versions.
- Query example reuses `queryOptions`, prefetches on the server, hydrates on the client, and keeps
  the list cache synchronized after a create mutation.
- The form component calls the mutation through `mutate` and derives submit loading/disabled state
  only from TanStack Query's `isPending` result.
- Table example uses the native v9 feature API, stable data/column references, and supports sorting,
  global filtering, pagination, loading, error, and empty states.
- README contains one concise, copyable example for Query and one for Table.
- All verification commands pass.

## Open Questions

None. Scope is limited to the two TanStack products already present in the application.

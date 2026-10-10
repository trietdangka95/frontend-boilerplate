# Implementation Plan: Unified CSS and Tailwind design system

## Overview

Build the token bridge first, then migrate shared primitives and application boundaries in small
verified slices. The dependency order is tokens → MUI CSS variables → Tailwind aliases → consumers.

## Architecture Decisions

- Keep raw values in TypeScript tokens; MUI turns them into runtime CSS variables.
- Define a compact semantic Tailwind API in `@theme inline` instead of exposing raw color scales.
- Retain the official `theme, base, mui, components, utilities` layer order.
- Use MUI `useColorScheme` and `InitColorSchemeScript` for manual/system mode handling.
- Enforce the styling contract with a source-level regression test.

## Task List

### Phase 1: Contract and foundation

- [ ] Task 1: Add styling contract tests.
  - Acceptance: semantic aliases and prohibited raw styles are executable rules.
  - Verify: targeted test fails against the current raw Tailwind classes.
  - Files: `theme/styling-contract.test.ts`.
- [ ] Task 2: Extend centralized tokens and MUI theme variables.
  - Acceptance: semantic schemes and app-specific radius/layout/motion/shadow variables are emitted.
  - Verify: theme tests pass and TypeScript recognizes `theme.vars.app`.
  - Files: `theme/tokens.ts`, `theme/theme.ts`, `theme/theme.test.ts`, `theme/augmentation.d.ts`.
- [ ] Task 3: Add semantic Tailwind aliases and documented color-scheme initialization.
  - Acceptance: Tailwind utilities resolve through MUI variables and mode selection is SSR-safe.
  - Verify: provider/layout tests and targeted contract test pass.
  - Files: `app/globals.css`, `app/layout.tsx`, `providers/MuiProvider.tsx`, `components/ui/ColorModeToggle/ColorModeToggle.tsx`.

### Checkpoint: Foundation

- [ ] Targeted tests pass.
- [ ] Type-check succeeds.

### Phase 2: Consumer migration

- [ ] Task 4: Migrate shared feedback, surface, modal, card, and table components.
  - Acceptance: no shared component uses raw palette utilities.
  - Verify: component test suite passes.
  - Files: shared components under `components/common` and `components/ui`.
- [ ] Task 5: Migrate route boundaries and loading shell.
  - Acceptance: loading, not-found, route error, and global error use semantic/shared tokens.
  - Verify: app tests and production build pass.
  - Files: `app/loading.tsx`, `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/manifest.ts`.
- [ ] Task 6: Migrate example surfaces.
  - Acceptance: example UI demonstrates the same semantic pattern used by production components.
  - Verify: example component tests pass.
  - Files: example components under `features/example/components`.

### Checkpoint: Migration

- [ ] Styling contract finds no raw palette classes or runtime color literals.
- [ ] Full test suite passes.

### Phase 3: Documentation and verification

- [ ] Task 7: Document the styling API with reusable examples.
  - Acceptance: developers can add UI and future theme values without inventing local styles.
  - Verify: formatting check passes and examples match real class/token names.
  - Files: `docs/design-system.md`, `README.md`.
- [ ] Task 8: Run final quality and browser gates.
  - Acceptance: lint, type-check, format, build, and representative light/dark runtime checks pass.
  - Verify: all commands exit successfully and browser console is clean.

## Risks and Mitigations

| Risk                                            | Impact | Mitigation                                                     |
| ----------------------------------------------- | ------ | -------------------------------------------------------------- |
| CSS-variable timing causes a first-paint flash  | Medium | Use MUI `InitColorSchemeScript` with the same class selector.  |
| Tailwind aliases override MUI unpredictably     | Medium | Preserve the official CSS layer order already configured.      |
| A dark-mode surface retains a light raw color   | High   | Remove raw palette utilities and verify both modes in-browser. |
| Static guard flags legitimate token definitions | Low    | Scope the exception to `theme/tokens.ts` only.                 |

## Open Questions

None.

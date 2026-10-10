# Spec: Unified CSS and Tailwind design system

## Objective

Standardize application styling around one design-token source so a theme change propagates to
Material UI, Tailwind utilities, global CSS, loading/error boundaries, and examples without
component-by-component edits. Preserve the current visual direction and light/dark behavior.

## Assumptions

- `theme/tokens.ts` remains the only file that owns raw design values.
- Material UI owns component styling and emits runtime CSS variables.
- Tailwind owns layout/composition utilities and consumes semantic aliases to those MUI variables.
- Existing MUI `sx` spacing multipliers and semantic palette paths are valid design-system usage.
- No new styling dependency or beta/experimental package is required.

## Tech Stack

- Next.js 16.2.10 and React 19.2.7
- Material UI 9.2.0 with CSS theme variables
- Tailwind CSS 4.3.2 with CSS-first `@theme inline`
- TypeScript 6.0.3 and Vitest 4.1.10

## Commands

- Development: `pnpm dev`
- Tests: `pnpm test`
- Lint: `pnpm lint`
- Type check: `pnpm typecheck`
- Formatting check: `pnpm format:check`
- Production build: `pnpm build`

## Project Structure

- `theme/tokens.ts`: primitive and semantic design values; the only raw color source.
- `theme/theme.ts`: maps tokens into MUI palettes, typography, spacing, and component defaults.
- `theme/augmentation.d.ts`: types custom application theme variables.
- `app/globals.css`: maps MUI CSS variables into semantic Tailwind utilities and global base styles.
- `components/`: reusable components that consume semantic MUI/Tailwind tokens.
- `features/` and `app/`: composed product UI; no raw palette classes or raw color literals.
- `docs/design-system.md`: usage rules and copyable examples.

## Code Style

Use semantic names that describe purpose, not a palette value:

```tsx
<section className="border-default bg-surface text-foreground">
  <p className="text-muted">Secondary copy</p>
</section>
```

Use MUI theme paths and spacing multipliers in `sx`:

```tsx
<Box sx={{ bgcolor: "background.paper", borderColor: "divider", gap: 3, p: 4 }} />
```

Do not use `bg-slate-50`, `text-red-700`, raw hex values, or arbitrary layout values when an
existing semantic token or scale value represents the intent.

## Testing Strategy

- Unit-test token-to-theme mappings.
- Add a source contract test that rejects raw palette utilities and raw color literals outside the
  token definition.
- Keep existing component tests as regression coverage.
- Verify light/dark runtime styles and a representative page in a real browser.

## Boundaries

- Always: use stable installed APIs, semantic names, the 4px spacing scale, shared radius tokens,
  MUI CSS variables, and the existing CSS layer order.
- Ask first: redesign the product palette, add a styling dependency, or change public component
  APIs.
- Never: introduce beta packages, raw palette utility classes in components, duplicate theme
  values in CSS, or remove tests to make checks pass.

## Success Criteria

- Tailwind colors, spacing base, radii, shadows, and app layout sizes resolve from MUI-generated
  CSS variables backed by `theme/tokens.ts`.
- All application raw palette utility classes are replaced by semantic utilities.
- All raw color literals outside `theme/tokens.ts` are removed from runtime styling code.
- Light, dark, and system modes use the documented MUI color-scheme flow without hydration flash.
- Documentation provides a reusable example for Tailwind, MUI `sx`, component variants, and adding
  a future theme token.
- Tests, lint, type-check, formatting, production build, and browser verification pass.

## Open Questions

None. The requested behavior and existing restrained teal/neutral visual direction are sufficient
to proceed without a redesign.

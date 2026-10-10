# Styling and theming guide

The application has one styling pipeline:

```text
theme/tokens.ts → MUI theme → --mui-* CSS variables → semantic Tailwind utilities
```

Changing an existing color, radius, shadow, spacing unit, or shared layout size in
`theme/tokens.ts` updates both MUI components and Tailwind consumers. Do not duplicate that value in
a component or CSS file.

## Ownership rules

| Concern                     | Use                      | Example                                 |
| --------------------------- | ------------------------ | --------------------------------------- |
| Raw design values           | `theme/tokens.ts` only   | brand scale, semantic light/dark colors |
| MUI component appearance    | `theme/theme.ts`         | button radius, input focus ring         |
| Local layout/composition    | Tailwind utilities       | `flex`, `gap-4`, responsive grids       |
| Local component-aware style | semantic MUI `sx`        | `bgcolor: "background.paper"`           |
| Repeated UI behavior        | shared component variant | `StatusChip tone="success"`             |

Never use palette-specific utilities such as `bg-white`, `text-slate-600`, or `text-red-700` in
application components. Never add a raw hex, RGB, or HSL value outside the token source.

## Example 1: Tailwind composition

Use semantic color names with the shared spacing and radius scales:

```tsx
export function SummaryPanel() {
  return (
    <section className="rounded-lg border border-default bg-surface p-6 text-foreground">
      <h2 className="text-lg font-semibold">Summary</h2>
      <p className="mt-2 text-sm text-muted">Updated from the current server state.</p>
    </section>
  );
}
```

Common semantic utilities:

| Intent                      | Utility                                                   |
| --------------------------- | --------------------------------------------------------- |
| App background              | `bg-canvas`                                               |
| Raised surface              | `bg-surface`                                              |
| Subtle hover/header surface | `bg-surface-subtle`                                       |
| Primary/secondary text      | `text-foreground`, `text-muted`                           |
| Default border              | `border-default`                                          |
| Brand action                | `bg-brand`, `text-on-brand`                               |
| Feedback                    | `text-error`, `text-info`, `text-success`, `text-warning` |
| App shell sizes             | `h-header`, `w-sidebar`, `max-w-content`                  |

## Example 2: MUI `sx`

Use theme paths and spacing multipliers. A spacing value of `4` means four shared base units, not
four pixels.

```tsx
<Box
  sx={{
    bgcolor: "background.paper",
    border: 1,
    borderColor: "divider",
    borderRadius: 2,
    display: "grid",
    gap: 3,
    p: 4,
  }}
/>
```

Use `theme.vars.app.*` inside MUI `styled` or theme override callbacks when a custom application
token is needed:

```tsx
root: ({ theme }) => ({
  borderRadius: theme.vars.app.radius.lg,
  boxShadow: theme.vars.app.shadow.raised,
});
```

## Example 3: Shared component variants

Do not rebuild feedback styling at the call site. Use the shared semantic API:

```tsx
<StatusChip label="Active" tone="success" />
<InlineAlert tone="error">The record could not be saved.</InlineAlert>
<Button isLoading={createRecord.isPending}>Create record</Button>
```

## Example 4: Change or extend a theme

To rebrand the existing application, edit the primitive or semantic values in
`theme/tokens.ts`. For example, changing `designTokens.color.semantic.light.primary.main` through
the centralized brand mapping updates MUI buttons, focus states, `bg-brand`, and `text-brand`
consumers together.

When adding a new semantic role:

1. Define its light and dark values in `theme/tokens.ts`.
2. Map it into `theme/theme.ts` so MUI emits a CSS variable.
3. Expose one purpose-based Tailwind alias in `app/globals.css` only if composition code needs it.
4. Add the new alias to `theme/styling-contract.test.ts`.

Adding a role changes the public styling API and therefore requires these explicit contract steps;
changing an existing theme value remains a one-file edit.

## Review checklist

- No raw color literal outside `theme/tokens.ts`.
- No raw Tailwind palette class.
- Spacing uses the shared 4px scale.
- Repeated visual behavior lives in a shared component or theme override.
- Light and dark modes both remain readable.
- Loading, error, empty, disabled, focus, and hover states remain visible without color alone.

# Naming guidelines

The rules already in force across this codebase, written down so a sixth
brand or a new component doesn't invent a different convention by accident.

## Figma variables

`Colors/Base/<Brand>/<Step>` — the raw ramp, one collection per brand
(Blue, Green, Yellow, Magenta, Orange), step `1` (lightest) to `10` (darkest).
Never referenced directly from code.

`1. Brand` collection, `Primary/<Step>` — the brand-switching layer. Each
`Primary/N` aliases into `Colors/Base/<current-brand>/N` per mode. This is
the only layer that changes when the Figma page's brand mode changes, which
is why it stays visible (un-hidden) in Publishing while `Colors/Base` stays
hidden — see [token-contract.md](./token-contract.md).

Everything else (`2. Colors`, `3. Dimensions`, `4. Typography`,
`5. Components`) is named identically to the Ant Design token it feeds, so
the export is a rename, not a remap.

## Code: token files (`src/theme/`)

One file per tier, matching Ant Design's own Seed → Map/Alias → Component
split:

- `semanticTokens.ts` — `semanticFixed` (mode-only, 77 tokens) +
  `semanticBrand` (`${brand}.${mode}` keyed, 28 tokens). Key names are Ant
  Design's own token names (`colorPrimary`, `colorBgLayout`, ...), not
  Figma's — the Figma side of the name lives in the Figma file itself.
- `componentTokens.ts` — keyed by PascalCase Ant Design component name
  (`Button`, `DatePicker`, ...), values are that component's own token
  names. `skippedFromFigma` documents the handful Ant Design won't accept
  — see [token-contract.md](./token-contract.md).
- `dimensionTokens.ts` — `Default` / `Compact` density tables plus
  `screenTokens` (breakpoints).
- `antdIcons.tsx` — keyed by the `ConfigProvider` icon-slot name exactly as
  Ant Design's own types name it (`inputSearch`, not `input.search`).

Anything that isn't a real Ant Design token or component-icon-slot name
does not belong in these files — that mismatch is exactly what
`scripts/audit-tokens.mjs` (`npm run validate:tokens`) catches.

## Code: components (`src/components/`)

PascalCase file per component (`AppHeader.tsx`), matching the exported
component name. A story lives beside it as `<Name>.stories.tsx`. A
component that only exists to be reused inside a bigger one (there are
none yet) would still get its own file — no inline one-offs.

## Icons (`src/icons.tsx`)

Exported name matches the Untitled UI Icons package export
(`UI.Home03` → `Home03`), which in turn matches the icon's name in the
Figma file's `🍑 Icon` page (`home-03`, kebab-case). Do not rename on the
way through — the whole point is that Figma's icon name, the package
export, and the code import are the same string in three casings.

## Brand and mode keys

Lowercase, singular: `'blue' | 'green' | 'yellow' | 'magenta' | 'orange'`
and `'light' | 'dark'`. These are the exact strings used as object keys
(`semanticBrand['blue.dark']`) and as Storybook toolbar globals — changing
one without the other breaks both.

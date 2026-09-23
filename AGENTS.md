# AGENTS.md — FABi Design System

Context brief for AI agents working in this repo. Read this before making
changes; it exists so a new session doesn't re-derive what a previous one
already learned the hard way.

## Project

Ant Design v6, retuned to the FABi Figma file (`hneVCBNUiPizVorg7Jp18G`)
via `ConfigProvider` — no Ant Design component is forked or rewritten.
5 brands x 2 modes x 2 densities = 20 live theme combinations, all driven
from `src/theme/`. See [README.md](./README.md) for the narrative version.

## Commands

| Task | Command |
|---|---|
| Install | `npm install` |
| Storybook | `npm run storybook` (localhost:6006) |
| Build Storybook | `npm run build-storybook` |
| Type-check + build | `npm run build` |
| Lint | `npm run lint` |
| **Verify tokens reach Ant Design** | `npm run validate:tokens` |

`validate:tokens` runs `scripts/audit-tokens.mjs`, which greps Ant
Design's *compiled* style source (not its `.d.ts` typings — those use
`extends` and produce false negatives) for every exported token key. It
is a CI gate (`.github/workflows/storybook.yml`), not advisory: it exits
non-zero on any dead key or lineHeight unit mismatch. Run it after
touching anything in `src/theme/`.

## Where things live

- `src/theme/` — all tokens. One file per tier: `semanticTokens.ts`,
  `componentTokens.ts`, `dimensionTokens.ts`, `antdIcons.tsx`,
  assembled by `buildTheme()` in `index.ts`.
- `src/icons.tsx` — the icon set is `@untitledui/icons`, not
  `@ant-design/icons` — the Figma file's icon page is Untitled UI.
- `src/components/` — one PascalCase file per component, story beside it.
- `scripts/audit-tokens.mjs` — the token gate described above.
- `docs/naming-guidelines.md` — Figma-to-code naming rules.
- `docs/design-tokens.md` — the three token tiers, and the honest gap
  (not DTCG-formatted JSON yet).
- `docs/token-contract.md` — which Figma values are allowed to reach
  code, and the six documented exceptions that currently don't.

## Rules that are not obvious from reading the code once

- **Never hand-edit a token value in code to fix a Figma export bug.**
  Fix it in Figma and re-export. A code-side patch makes Figma and code
  disagree silently — the exact failure mode `validate:tokens` exists to
  catch on the *export* side, but it can't catch a manual code edit that
  happens to still pass the grep.
- **A component's visibility must never depend only on whether a caller
  passed an optional callback.** If a UI element's presence is really
  about responsive/internal state (e.g. "only show below `md`"), gate it
  on that state *inside* the component first, and let the callback prop
  control behavior-when-shown, not whether-shown. Grep for
  `{propName && (` when adding a new conditional element. (Root cause of
  two regressions in this repo's history: the hamburger button was first
  undemoable in its own story, then — after a naive fix — leaked onto
  desktop.)
- **Verify responsive breakpoints with a fresh browser tab per width, not
  by resizing an already-mounted tab.** Ant Design's `Grid.useBreakpoint()`
  has shown stale output after an in-page resize even when
  `window.matchMedia` itself reported the correct value.
- **Read the compiled Ant Design source before trusting a `.d.ts`.**
  Component-token typings use `extends`, so a token that looks valid by
  type can still be silently unread. `scripts/audit-tokens.mjs` is the
  systematic version of this check.

## Known gaps (see README's "Known gaps" for the full list)

59 component tokens still hardcode Blue instead of aliasing the semantic
layer; six tokens are dropped from Figma export entirely
(`skippedFromFigma`); no schema yet maps Figma component variants to
React props.

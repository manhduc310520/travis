# Design tokens

## The three tiers

Figma and code both use Ant Design's own tier names, so the mapping stays
one to one instead of needing a translation layer:

| Tier | Figma | Code |
|---|---|---|
| Primitive / Seed | `1. Brand`, `2. Colors` base ramps | not exported directly |
| Semantic / Map | `2. Colors` semantic slots | `src/theme/semanticTokens.ts` |
| Component / Alias | `5. Components` | `src/theme/componentTokens.ts` |

`buildTheme()` in `src/theme/index.ts` assembles all three into a single
Ant Design `ThemeConfig`, per brand, mode, and density.

## Format: this is not yet DTCG

The [Design Tokens Community Group format](https://www.designtokens.org/tr/drafts/format/)
is the closest standard to what this repo does — JSON, one file per
resolved value, `$value`/`$type` per token — but these tokens currently
ship as plain TypeScript object literals (`Record<string, string>`), not
DTCG-shaped JSON.

That is a real gap, not a stylistic choice: it means no other tool (Style
Dictionary, a design-token linter, a future non-Ant-Design consumer) can
read these values without writing an ad-hoc parser for this file's exact
shape first. Moving to DTCG JSON — and generating `semanticTokens.ts` from
it, rather than hand-writing it — is the natural next step once a second
consumer of these tokens exists. Until then, adding the JSON layer without
a second consumer would be format for its own sake.

## What "resolved" means here

Every exported value is the *final* value, not a seed the Ant Design
algorithm derives from. `semanticFixed`/`semanticBrand` were written this
way deliberately — see the comment at the top of `semanticTokens.ts` for
the specific bug (Tag colors coming out over-saturated) that seed-only
export caused. `scripts/audit-tokens.mjs` verifies the export the other
direction: that every value actually reaches an Ant Design component, not
that it is correctly resolved. Resolution correctness has no automated
check yet.

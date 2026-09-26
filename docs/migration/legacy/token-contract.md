# Token contract: Figma ↔ code

The rules that decide whether a value drawn in Figma actually reaches
Ant Design, and who is responsible when it doesn't.

## The contract

1. A Figma variable reaches code **only if** its name matches a real Ant
   Design token or component-token name. Nothing is renamed in transit.
2. `scripts/audit-tokens.mjs` (`npm run validate:tokens`) is the
   enforcement mechanism: it greps Ant Design's own compiled style source
   for every exported key and fails the build (see
   `.github/workflows/storybook.yml`) if a key is never read, or if a
   `lineHeight`-named key looks like a raw pixel value where Ant Design
   expects a ratio.
3. A value that fails the contract is fixed **in Figma**, then
   re-exported — never patched in code. Patching in code would make the
   two sources of truth disagree silently.

## Known exceptions (as of this file)

`componentTokens.ts` documents six Figma values Ant Design cannot accept,
under `skippedFromFigma`:

- `Select/optionFontSize` = `"Inter"` — a font family in a font-size token
- `Menu/itemPaddingBlock 2` — stray name with a space and a numeric suffix
- `Button/line` = `1.2000000476837158` — not an Ant Design Button token
- `DatePicker/handleFontSize` = `7` — not an Ant Design DatePicker token
- `Card/fontFamily`, `Select/fontFamily` — belong on the global token
  (`globalTokens.fontFamily`), not per component

These are gaps in the Figma source, not bugs in the export script. They
stay on this list until the Figma file is corrected; if this list grows
instead of shrinking, that is a signal the Figma side has drifted from
what Ant Design can actually consume.

## What is not covered yet

- **Component props.** There is no schema mapping a Figma component's
  variant properties (e.g. `Type=Primary`) to the React prop that produces
  it (`type="primary"`). That mapping currently lives only in whoever's
  head built the component.
- **Resolution correctness.** The contract checks that a value *reaches*
  Ant Design, not that it is the *correct* value — see
  [design-tokens.md](./design-tokens.md).

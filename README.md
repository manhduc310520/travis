# antd-storybook

Ant Design **6.6.5** component docs, converted from the official dumi site source into Storybook.
Local only. Source: https://github.com/ant-design/ant-design (MIT).

## Run

```bash
npm install --legacy-peer-deps
npm run storybook        # http://localhost:6007
npm test                 # every story renders; a11y violations are reported, not failing
npm run test:a11y        # strict a11y (axe violations fail), Geek Blue
npm run test:a11y -- cyan   # one brand; `-- all` runs the five brands one after another
npm run test:a11y -- cyan dark   # Dark mode; `-- dark` = Geek Blue dark, `-- all dark` = the five brands
npm run test:a11y -- vi          # docs language VN (default en); combines with a brand and a mode
npm run check:brand              # no Ant names / links left, both languages (exit 1 if any)
node scripts/check-i18n.mjs      # translations keep the structure of the English (exit 1 if not)
```

## How it is built

- `../antd-src/ant-design-6.6.5/`: the antd repository at tag 6.6.5 (downloaded tarball).
- `npm run convert -- button table form`: runs `scripts/convert.mjs` for those components (no
  arguments = every component). For each one it:
  - copies `components/<name>/demo/*` unchanged into `src/components/<name>/demo/`;
  - reads `index.en-US.md` (the English page) and writes `<Title>.stories.tsx`: one story per
    example, with the example's English description and its source code, and a docs page that
    follows the official page section by section (When To Use, Examples, API, Semantic DOM,
    Design Token, FAQ…);
  - leaves out `debug` examples, as ant.design does.
- `npm run convert:pages` (`scripts/convert-pages.mjs`): the **Design Tokens** section: Customize
  Theme (full Seed / Map / Alias token tables), Colors, Dark Mode, Font, Layout, Shadow, Motion,
  from antd's `docs/react` and `docs/spec` pages. Each page is a React component
  (`src/design-tokens/<slug>/<Title>Page.tsx`) wrapped by a small `.mdx` entry; the site widgets
  (TokenTable, ColorPalettes, Palette, ColorPaletteTool, TokenCompare) render as on ant.design.
- House style: `DEMO_PATCHES` in `scripts/convert.mjs` (every Table demo is `bordered`).
- Brand: FABi CMS Design System — `packages/fabi-ui/src/theme.ts` (re-exported by `.storybook/brand.ts`; Geek Blue, Be Vietnam Pro, Medium 500 for
  Card titles, 8px card radius like every surface), `.storybook/manager.ts` (sidebar logo `public/brand/logo.svg`, tab title), favicon
  `public/favicon.svg` (temporary: the F of the logo).
- Brand clean-up, all by script so it survives re-runs:
  - `globalPatch()` in `scripts/convert.mjs`: outside data APIs → `/mock-api/…` (answered by
    `.storybook/mockApi.ts`), remote images → `public/mock-assets` (`npm run assets`), links to Ant
    sites → example.com, sample text "Ant Design" → "FABi CMS", Ant logo icon → AppstoreOutlined.
  - `debrand()` + `scripts/brand-edits.mjs`: removes links to Ant sites and the Promotion / Design
    Guide sections from the docs, and rewrites or deletes every "Ant Design" sentence (`BRAND_EDITS` Vietnamese,
    `BRAND_EDITS_EN` English). Text that only pointed at an upstream page goes too (`dropPointers()`: "See #12479.",
    "Related issues: …", codesandbox / blog / FAQ / article references, the Common props line), and full-width
    Chinese punctuation becomes ASCII (`halfWidth()`).
  - `npm run check:brand` (`scripts/check-brand.mjs`): terminal check for Ant brand names left in
    the docs (both languages, as rendered, and in the generated pages themselves) or example text (also names
    split over two lines) and for examples loading outside data / images (exit code 1 if any).
- Accessibility: `npm run test:a11y -- all` and `npm run test:a11y -- all dark` must pass for the five brands (882/882
  each, Light and Dark, on 2026-10-01).
  `scripts/test-a11y.mjs` sets `VITE_A11Y_STRICT=1` (preview.tsx: a11y `test: 'error'`), `VITE_BRAND=<key>`
  (preview.tsx: starting brand, else `DEFAULT_BRAND`) and `VITE_MODE=light|dark` (starting mode, default light);
  extra arguments go to vitest, with `{brand}` / `{mode}` replaced (`--outputFile=a11y-{brand}-{mode}.json`).
  Fixes live in the `@fabi/ui` package (`packages/fabi-ui`: theme tokens, `styles.css`, the DOM patches installed
  by `FabiProvider`) and `a11yPatch()` in `scripts/convert.mjs`; examples that hard-code light colours get Dark
  counterparts with CSS `light-dark()` (`DARK_DEMOS` / `darkPatch()` in `scripts/convert.mjs`, Light unchanged).
  Exceptions with reasons: `A11Y_EXEMPT`.
- `@fabi/ui` (B5): every story and docs page renders inside `FabiProvider` (`.storybook/preview.tsx`); demo code
  imports `@fabi/ui…` and uses `fabi-` class names (`scripts/fabi-names.mjs`, applied by both convert scripts).
  `.storybook/main.ts` resolves `@fabi/ui` to `packages/fabi-ui` (src + dist stubs) with one copy of
  React / antd / Ant packages (`resolve.dedupe`). Developer guide: `src/GettingStarted.mdx`.
- Toolbars: Brand and Mode (Light / Dark), both passed to `FabiProvider`. In Dark the story canvas, the docs pages
  (Storybook's dark docs theme) and the Design Tokens example boxes take antd's dark container surface and text
  colour (`docs.css` under `html[data-fabi-mode=dark]`, variables computed in `preview.tsx`), so demos and axe see
  the surface the components are designed for.
- Package build: `cd packages/fabi-ui && npm run build` (tsc → `dist/`, then `scripts/gen-stubs.mjs` writes the
  subpath stubs, locales and `styles.css` / `font.css`); `npm pack` → `fabi-ui-0.1.0.tgz` (runs the build).
  Rebuild + repack after any change in `packages/fabi-ui/src`. Checked as a developer on 2026-10-01: fresh
  Vite + React + TS app, `npm install ./fabi-ui-0.1.0.tgz` (no `--legacy-peer-deps` needed), 13 demos copied
  verbatim, `tsc --noEmit` + `vite build` pass, Playwright: no console errors, only `fabi-` classes
  (except antd's hard-coded `ant-wave-target` marker), brand colours correct.
- Work log and open items: `WORKLOG.md`. Third-party licences: `NOTICE.md`.
- `src/_dumi/`: the antd site helpers the docs use (Semantic DOM preview, Component Token
  table), copied from the repo's `.dumi/`. `src/shims/dumi.ts` stands in for the `dumi` package
  (dumi locale is always English; `hooks/useLocale.ts` applies the docs language).
- Links to ant.design and other Ant sites are removed by `debrand()` (the text stays, unlinked).
- MDX pages use GitHub-flavoured markdown (tables): `remark-gfm` in `.storybook/main.ts`.

Generated files: do not edit by hand; change `scripts/convert.mjs` and run it again.

## Docs language (VN / EN)

The **Language** toolbar (EN / VN, default EN; `VITE_LOCALE=vi` starts in Vietnamese) switches the docs. One
language per mode, never mixed:

- **Follows the language:** page titles (H1), headings, table header rows, prose, notes, example descriptions, the
  Controls table on docs pages, widget labels and messages, token descriptions, words the generator writes ("Cần
  cài thêm" / "Also install", "Xem code" / "Show code", the Playground hint), sidebar groups and docs page names,
  the "Docs" entry, the browser tab title, the table of contents' screen-reader title, `lang` of the page.
- **English in both:** code (blocks, inline code, comments), component / prop / token / CSS variable names, prop
  types and default values, example titles (= story names), the text the components draw (antd locale), demo
  content, proper names (palette names such as Geek Blue, brand names), and the kept terms API, Semantic DOM,
  Design Token(s), Seed / Map / Alias Token, Props, Ref, Hooks, Interface, Content Security Policy, Playground.
- **Storybook's own UI** stays English (Show code / Copy code under examples, the Controls panel in story view,
  toolbar titles, search); it is marked `lang="en"` by Storybook.

How it works:

- `.storybook/locale.tsx`: `LocaleProvider`, `useDocsLocale()`, and `<Vi>` / `<En>` / `<Lang>` for MDX. The
  story decorator and `BrandDocsContainer` (`.storybook/preview.tsx`) provide it; on docs pages only the docs
  container writes `<html lang>`.
- Generated pages (`scripts/convert.mjs`, `scripts/convert-pages.mjs`) hold both languages and render one; code
  blocks are written once. In-page links follow the headings of each language (`pageAnchors()`), example titles
  carry antd's ids (`#date-picker-demo-format`).
- `.storybook/docsRenderer.tsx`: a toolbar change re-renders a docs page in place (Storybook's own renderer
  remounts the page and the preview reloads). `useLocaleDocsContext` in `preview.tsx` gives the table of contents
  its title and options per language and sets `lang` on the docs content.
- `.storybook/manager.ts` + `.storybook/labels.ts`: sidebar labels (`<span lang="vi">`) and tab title.
- Widgets (`src/_dumi`): `hooks/useLocale.ts` overlays `i18n/vi/ui.json` on the English locale maps;
  `useUiText()` gives one string (`t('Copied: {value}', { value })`); `builtins/versionToken.ts` uses
  `i18n/vi/tokens.json`. English is debranded at runtime (`src/_dumi/fabiText.ts`).

Adding or fixing a translation:

1. Docs text: run `npm run convert` (or `convert:pages`); `i18n/en/<scope>/<page>.json` lists every English string
   by hash. Put the Vietnamese under the same hash in `i18n/vi/<scope>/<page>.json` (keep code blocks, inline
   code, link URLs, table rows and heading count; link texts may be translated). A changed English string gets a
   new hash and shows English until it is translated again. Headings and table header cells in
   `HEADING_GLOSSARY` / `TABLE_HEAD_GLOSSARY` (`scripts/i18n.mjs`) always take the glossary wording.
2. Widget strings and token descriptions: `node scripts/i18n-ui.mjs` writes `i18n/en/ui.json` / `tokens.json`
   (keyed by the English text); add the Vietnamese to `i18n/vi/ui.json` / `tokens.json`.
3. Sidebar and page titles: `.storybook/labels.ts`. MDX pages: inside `<Vi>` / `<En>`.
4. Brand wording: `BRAND_EDITS` / `BRAND_EDITS_EN` (`scripts/brand-edits.mjs`), one rule per language.
5. Regenerate, then `node scripts/check-i18n.mjs` (structure; lists headings and prose still in English for
   information), `npm run check:brand`, `npm test` and `npm run test:a11y` (`-- en` for English).

# FABi Design System

Ant Design at the core, retuned to the FABi design system in Figma.
No Ant Design component is rewritten — everything arrives through `ConfigProvider`.

**Figma source:** `hneVCBNUiPizVorg7Jp18G` — *Design Component Desktop*

## Run it

```bash
npm install
npm run storybook      # http://localhost:6006
```

Two switchers sit in the Storybook toolbar:

| Switcher | Values | Figma source |
| --- | --- | --- |
| **Brand** | Blue, Green, Yellow, Magenta, Orange | collection `1. Brand`, 5 modes |
| **Mode** | Light, Dark | collection `2. Colors`, 2 modes |
| **Density** | Default, Compact | collection `3. Dimensions`, 2 modes |

Twenty combinations in total, and every story reacts to all three. Density is the
axis Ant Design does not ship: base padding moves from 16 to 8, control height
from 32 to 28, and the whole library retunes.

## How the theme is wired

```
Figma  Colors/Base/<brand>/<step>          raw ramps, 130 variables
   ->  1. Brand   Primary/1..10            brand switch layer, 5 modes
   ->  2. Colors  Colors/Brand/...         semantic layer, light + dark
   ->  5. Components                       1,961 component tokens
   ->  src/theme/index.ts                  seeds per brand and mode
   ->  ConfigProvider                      what the stories actually render with
```

- `src/theme/index.ts` — `buildTheme(brand, mode)` returns an Ant Design `ThemeConfig`.
  Seeds are exported values, not guesses: change a ramp in Figma and re-export.
- `src/theme/componentTokens.ts` — 271 numeric and string component tokens, the
  density and spacing layer. Brand-independent, so one copy serves all ten themes.
- `src/theme/dimensionTokens.ts` — the density table, both modes of `3. Dimensions`.
- `src/icons.tsx` — the icon set. The Figma icon page is Untitled UI (2,361 icons,
  named `layers-three-01`, `layout-alt-01`), so the code uses `@untitledui/icons`
  rather than Ant Design's own set. Each icon is wrapped to default to 16px because
  Untitled UI defaults to 24 while Ant Design sizes at `1em`.
- `.storybook/preview.tsx` — wraps every story in `ConfigProvider`, and exposes the
  header gradient as CSS variables because it has no Ant Design equivalent.

## Templates

`AppShell` and `RestaurantListPage` are the template layer, rebuilt from the Figma
frame `Empty Search`. They are the reason a new module is a content problem rather
than a layout problem — every list screen in FABi CMS reuses that shape.

## Deploy

### GitHub Pages

`.github/workflows/storybook.yml` builds and publishes on every push to `main`.
Enable it once: **Settings → Pages → Source → GitHub Actions**.

```bash
git init && git add -A && git commit -m "FABi design system"
git remote add origin <your-repo-url>
git push -u origin main
```

### Chromatic

Chromatic also gives visual regression testing across all ten themes.

```bash
npm install -D chromatic
npx chromatic --project-token=<token>
```

Get the token from chromatic.com after linking the repository.

## Known gaps

- **59 component colour tokens still alias `Colors/Base/Blue/N` directly**, so they
  stay blue in every brand: Menu selection, Tabs ink bar, Slider track, Radio solid,
  Select option, Table row selection, Input hover and active border, Progress.
  They need repointing to the semantic layer in Figma.
- **22 component colour tokens hold raw values** with no alias at all.
- Six tokens were dropped on export because Ant Design cannot accept them —
  see `skippedFromFigma` in `src/theme/componentTokens.ts`.
- Stories carry the `needs-work` tag. Playwright could not download in the build
  environment, so the Vitest run that would clear the tag has not happened yet.
  Run `npx playwright install chromium` then `npm run test` on a machine with
  network access to the Playwright CDN.

# FABi CMS Design System — fc

The design system of FABi CMS. Components are built on
[React Aria Components](https://react-spectrum.adobe.com/react-aria/) for
behaviour and accessibility, and styled with CSS Modules that read only `--fc-*`
tokens exported from the Figma file.

## Run it

```bash
npm install
npm run storybook      # http://localhost:6006
```

`@untitledui-pro/icons` is a private package: `.npmrc` reads the registry token
from the `UNTITLEDUI_PRO_TOKEN` environment variable.

Three switchers sit in the Storybook toolbar:

| Switcher | Values | Figma source |
| --- | --- | --- |
| **Brand** | Blue, Green, Yellow, Magenta, Orange | collection `1. Brand` |
| **Mode** | Light, Dark | collection `2. Colors` |
| **Density** | Default, Compact | collections `3. Dimensions`, `4. Typography` |

Twenty combinations in total; every story reacts to all three.

## What's inside

- **Components** (`src/fc/components`, Storybook "Components"): about 60
  components in five waves — layout and typography, basic controls, overlays and
  navigation, data display, complex data entry (Form, pickers, Tree, Cascader,
  Transfer, Upload…). UI text is Vietnamese and can be overridden by props.
- **Templates** (`src/components`, Storybook "Templates"): `AppShell` (header,
  side navigation, content well), `AppHeader`, `SearchModal`, `RestaurantListPage`
  — the reference list screen every FABi CMS list reuses.
- **Design Tokens** pages: colour, border, font, layout, icons.

```tsx
import { FcTheme, Button } from './src/fc'

<FcTheme brand="blue" mode="light" density="default">
  <Button variant="primary">Tạo nhà hàng</Button>
</FcTheme>
```

## How the tokens are wired

```
Figma  0. Global       raw colour ramps (one mode)
   ->  1. Brand        brand layer, 5 modes
   ->  2. Colors       semantic colours, Light / Dark
   ->  3. Dimensions   spacing, sizes, radii, Default / Compact
   ->  4. Typography   type scale, Default / Compact
   ->  5. Components   Component/* — per-component tokens
   ->  tokens/figma-export.json   (scripts/figma-export.js via the Figma MCP)
   ->  npm run build:tokens       tokens/fc.tokens.json (DTCG) + src/fc/tokens.css
```

`FcTheme` puts `data-brand`, `data-mode` and `data-density` on its element;
every token resolves from those attributes. Two gates keep code and Figma
honest: `build:tokens` fails on any `--fc-*` reference that no longer exists,
and `audit:contrast` checks 240 text / border pairs against WCAG in every brand
and mode.

See [AGENTS.md](./AGENTS.md) for the working rules and
[docs/fc-roadmap.md](./docs/fc-roadmap.md) for the history.

## Deploy

### GitHub Pages

`.github/workflows/storybook.yml` checks the tokens, then builds and publishes
Storybook on every push to `main`. Enable it once: **Settings → Pages → Source →
GitHub Actions**.

### Chromatic

```bash
npx chromatic --project-token=<token>
```

Chromatic gives visual regression testing across the theme combinations. Get the
token from chromatic.com after linking the repository.

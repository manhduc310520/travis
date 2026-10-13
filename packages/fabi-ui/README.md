# @fabi/ui

The FABi CMS Design System for React: [Ant Design](https://ant.design) 6.6.5 with the FABi theme
(brand colours, Be Vietnam Pro, radius), the `fabi-` class prefix and accessibility fixes (WCAG AA).
Every antd component and API is re-exported unchanged, so the antd documentation applies.

## Install

```bash
# now: from the packed file
npm install ./fabi-ui-0.1.0.tgz
# later: from the internal registry
npm install @fabi/ui
```

Peer dependencies: `react` and `react-dom` 18 or newer. antd, the icons and the other Ant packages
come with `@fabi/ui`; do not install `antd` separately (two copies would not share the theme).

## Set up (once, at the app root)

```tsx
import { FabiProvider } from '@fabi/ui'
import '@fabi/ui/font.css'   // Be Vietnam Pro 400 / 500 / 600 / 700 (Google Fonts)
import '@fabi/ui/styles.css' // contrast fixes antd's tokens cannot express

export function App() {
  return (
    <FabiProvider brand="geekblue">
      <Routes />
    </FabiProvider>
  )
}
```

`FabiProvider` renders antd's `ConfigProvider` and accepts every `ConfigProvider` prop, plus:

| Prop | Default | |
| --- | --- | --- |
| `brand` | `'geekblue'` | `'geekblue'` · `'cyan'` · `'volcano'` · `'purple'` · `'magenta'` |
| `mode` | `'light'` | `'light'` · `'dark'` (antd's dark algorithm with the brand colour) |
| `a11yFixes` | `true` | installs the runtime DOM patches below on mount |
| `theme` | | deep-merged over the FABi theme (`token` and each `components` entry merge; `algorithm` adds to the mode's, e.g. `compactAlgorithm`; other keys replace) |

It also calls `ConfigProvider.config()`, so static calls (`message.success()`, `notification.open()`,
`Modal.confirm()`) get the same prefix, theme (and mode) and locale. Prefer `App.useApp()` in new code.

Other exports: `fabiTheme(brand, mode?)` (the antd `ThemeConfig`), `BRANDS`, `DEFAULT_BRAND`, `BrandKey`,
`MODES`, `DEFAULT_MODE`, `FabiMode`, `FABI_MODE_ATTR` (`'data-fabi-mode'`), `FONT_FAMILY`, `FONT_WEIGHT_MEDIUM` (500),
`FABI_PREFIX` (`'fabi'`), `FABI_ICON_PREFIX` (`'fabi-icon'`), `mergeTheme`, `installA11yFixes(options?)`.

```tsx
<FabiProvider brand="cyan" theme={{ token: { borderRadius: 4 }, components: { Button: { controlHeight: 36 } } }}>
```

## Dark mode

```tsx
<FabiProvider brand="geekblue" mode="dark">…</FabiProvider>
```

Dark is antd's `darkAlgorithm` driven by the same brand colour. Font, radius and weights are the same as in
Light. The primary / info tints come from antd's dark palette of the brand hue (as in Light, where they come from
the brand palette). Your app sets the page background: use the theme's `colorBgLayout` / `colorBgContainer`
(`theme.useToken()`). Without a body background the page is still dark (`color-scheme: dark`), but axe and
similar tools measure Dark text against white and report false contrast failures.

Accessibility (WCAG AA): on antd's dark surfaces no colour carries both white text and text of its own at 4.5:1,
so fills and text are split. Fills (primary Button, Checkbox, Switch, Badge…) keep antd's dark brand colour;
brand-coloured text (`colorPrimaryText`, selected Tabs / Menu / Pagination / Anchor items, outlined /
text / link Buttons, checked Radio buttons, Steps, Calendar) uses step 8 of the brand's dark palette (step 9 where
it sits on a hover tint: the selected Dropdown item, a submenu title with a selected child; a selected Table row
uses one tint step lower). Links (`colorLink`: `<a>`, `type="link"` Buttons, `Typography.Link`) are a
separate, muted shade: `colorLink` is a seed, so it is seeded with step 9 and antd's dark algorithm turns it into
e.g. `#92a7d6` for Geek Blue. Error text comes from the seed red-4 (antd's dark algorithm output `#dc6966`);
white-text fills of error / success / warning (Badge count, danger Button, hovered danger menu items, solid Tags)
use a darker step. Where white text on antd's lighter hover fill is under 4.5:1 (Geek Blue), hover / active go
one / two steps darker, as in Light. Colours are antd palette steps or antd's dark algorithm output, except
secondary-level text: tertiary / description / placeholder / quaternary (and disabled) text use Light's opacities
(.6 / .56 of white) instead of antd's .45 / .25, and ghost Buttons use white. Details in `src/theme.ts`.

The outermost `FabiProvider` sets `data-fabi-mode="light|dark"` on `<html>`. The Light-only contrast rules of
`styles.css` (preset Tag text, outlined / text / link Button colours) skip `[data-fabi-mode="dark"]` and
everything inside it, and its Dark rules apply only there (it also sets `color-scheme: dark` there, so native
controls, scrollbars and CSS `light-dark()` follow the mode). Only the outermost provider sets the attribute
and the global config of the static APIs (`message`, `notification`, `Modal.confirm`), so a nested provider
never restyles the whole app. For an area in the other mode (nested `<FabiProvider mode="dark">` in a light
page, or `mode="light"` in a dark one), put `data-fabi-mode` with the area's mode on its element, render its
popups inside it with `getPopupContainer`, and use the hook APIs (`App.useApp()`, `message.useMessage()`)
there instead of the static ones.

A nested `FabiProvider` starts from its own FABi theme (`theme.inherit: false` unless you pass `inherit: true`),
so the outer mode's component tokens do not leak in. The mode colours (tints, text shades, placeholder,
status backgrounds) are applied by FABi's own algorithms, not by theme tokens, so they also follow a plain
nested `ConfigProvider` that switches the algorithm: `theme.defaultAlgorithm` / `theme.darkAlgorithm`
imported from `@fabi/ui` ARE FABi's (`fabiLightAlgorithm` / `fabiDarkAlgorithm`, also exported by name).
antd's own `darkAlgorithm` (from `antd`) gives antd's dark colours (placeholder .25, under 4.5:1).

Accessibility: Light and Dark both pass the strict axe run for the five brands (`npm run test:a11y -- all dark`).
axe checks the static state only; the hover / keyboard-active states listed above were checked by computing
their contrast.

## Vietnamese

antd's default locale is English. Pass a locale and set dayjs (install `dayjs` in the app):

```tsx
import viVN from '@fabi/ui/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

dayjs.locale('vi')

<FabiProvider locale={viVN}>…</FabiProvider>
```

Every antd locale is available as `@fabi/ui/locale/<name>` (`en_US`, `vi_VN`, `ja_JP`, …).

## Import map

| Before | After |
| --- | --- |
| `antd` | `@fabi/ui` |
| `antd/locale/<name>` | `@fabi/ui/locale/<name>` |
| `antd/es/<path>` (see list below) | `@fabi/ui/es/<path>` |
| `@ant-design/icons` | `@fabi/ui/icons` |
| `@ant-design/colors` | `@fabi/ui/colors` |
| `@ant-design/cssinjs` | `@fabi/ui/cssinjs` |
| `antd-style` | `@fabi/ui/style` |
| `@ant-design/happy-work-theme` | `@fabi/ui/happy-work-theme` |
| `antd-img-crop` | `@fabi/ui/img-crop` |
| `@ant-design/static-style-extract` | `@fabi/ui/static-style-extract` |

`@fabi/ui/es/*` paths: `_util/aria-data-attrs`, `badge/Ribbon`, `checkbox`, `date-picker/locale/en_US`,
`input/TextArea`, `locale/en_US`, `masonry/MasonryItem`, `menu/interface`, `message/interface`,
`modal/confirm`, `notification/interface`, `select`, `table/interface`, `transfer/interface`.
Need another one? Add it to `ES_PATHS` in `scripts/gen-stubs.mjs` and rebuild.

## Icons (`@fabi/ui/fabi-icons`)

The FABi CMS icon set from the design: 1,174 line and 1,187 solid icons on a 24 × 24 grid. Every name has
both styles except `compact-01` (line only) and 14 `*-alt` icons (solid only). Use the line icon by
default and its solid twin for the selected state (e.g. the selected Menu item).

```tsx
import { Home03Line, Home03Solid } from '@fabi/ui/fabi-icons'

<Menu items={[{ key: 'home', label: 'Trang chủ', icon: selected ? <Home03Solid /> : <Home03Line /> }]} />
<Button icon={<Home03Line />} aria-label="Trang chủ" />
```

- Names: the design's name in PascalCase plus the style: `home-03-line` → `Home03Line`, `home-03` → `Home03Solid`.
- Each icon renders like an `@ant-design/icons` icon (span with the `fabi-icon` class, 1em, `currentColor`), so
  it fits every antd `icon` prop. Props: `size`, `title` (accessible name; without it the icon is
  decorative), `spin`, and any span attribute.
- One module with pure annotations: bundlers keep only the icons you import.
- The Storybook page Components / General / FABi Icons lists every icon (search, line / solid, copy import).
- Update from the design: `npm run icons:fetch -- --file <file key> --line <section id> --solid <section id>`
  (with `FIGMA_ACCESS_TOKEN`), then `npm run icons:gen` and `npm run build`. The SVGs and the catalog
  live in `icons/`; `src/fabi-icons.ts` is generated, never edited by hand.

## Class names and CSS variables

| antd | @fabi/ui |
| --- | --- |
| `.ant-btn`, `.ant-table`, … | `.fabi-btn`, `.fabi-table`, … |
| `.anticon`, `.anticon-search` | `.fabi-icon`, `.fabi-icon-search` |
| `--ant-color-primary`, … | `--fabi-color-primary`, … |

Existing CSS that targets `.ant-*`, `.anticon` or `--ant-*` must be renamed. Prefer theme tokens
(`theme.token` / `theme.components`) over CSS overrides.

One class keeps the `ant-` prefix: `ant-wave-target` on the Checkbox / Radio box. Ant Design hard-codes it as a
marker for the click wave effect (no styles attached). Do not target it in CSS.

## Accessibility patches

antd 6.6.5 fails some axe checks in markup it renders itself. `@fabi/ui` patches them; each patch
should be **removed when antd fixes it upstream** (check on every antd upgrade).

Runtime DOM patches (`installA11yFixes`, on by default through `FabiProvider`; a `MutationObserver`
re-applies them as antd renders):

| Component | What it fixes | axe rule |
| --- | --- | --- |
| Transfer | names the select-all / item checkboxes and the search box | `label` |
| Calendar | names the header year / month selects | `label` |
| Select, AutoComplete | gives the popup listbox the name of its combobox | `aria-input-field-name` |
| Skeleton | hides the placeholder (empty headings) from assistive tech | `empty-heading` |
| Table | adds hidden text to empty header cells (expand / drag / action columns) | `empty-table-header` |
| Tabs | moves `role="tablist"` to the element that holds only the tabs | `aria-required-children` |
| ColorPicker | removes Form.Item's `aria-required` from the trigger (a plain div) | `aria-allowed-attr` |
| Progress (inside Upload) | names progress bars antd renders itself | `aria-progressbar-name` |
| Table, Transfer, Calendar, List | makes scroll containers with nothing focusable keyboard-focusable | `scrollable-region-focusable` |
| Icon (custom `component`) | names `role="img"` icons after their class, else hides them | `role-img-alt` |
| Input, TextArea, InputNumber | last resort: names unlabelled inputs from placeholder / name / role. Still label your fields. | `label` |

CSS patches (`@fabi/ui/styles.css`; antd palette steps only):

| Component | What it fixes | axe rule |
| --- | --- | --- |
| Tag (preset colours) | darker text for cyan, green, lime, gold, yellow, orange, volcano | `color-contrast` |
| Tag (solid) | darker backgrounds so white text reaches 4.5:1 | `color-contrast` |
| Badge.Ribbon | darker backgrounds for pink, magenta, red, cyan, green, volcano, blue, orange, gold, lime | `color-contrast` |
| Button (`color` + variant) | darker text / borders / solid backgrounds for palette colours | `color-contrast` |
| Button (`loading`) | keeps full opacity (antd fades it to 65%) | `color-contrast` |
| Links in Form text | underlines links inside running text | `link-in-text-block` |

Theme tokens (`fabiTheme`; part of the brand, not temporary): secondary / description text,
placeholder, quaternary and disabled text, error / success / warning colours, Calendar out-of-month
dates and the Switch "off" track are darkened to reach 4.5:1 (`color-contrast`). Primary hover /
active use darker palette steps so white text stays readable on every brand.

Brand primaries (palette step): Geek Blue 6, Golden Purple 6, Cyan 8, Magenta 7, Volcano 8. The primary
is also text on its own lightest tint (selected Menu item, Calendar today, filled Button, Tag, Steps
panel), so it reaches 4.5:1 on white text **and** on palette step 1. The primary / info tints (steps
1–4) and text shades (steps 8–10) come from the brand palette itself: antd would derive greyish tints
from a primary darker than step 6. All five brands pass the strict axe run (`npm run test:a11y -- all`
in the Storybook repo, 882 stories each, 2026-10-01).

## License

MIT. See [NOTICE.md](NOTICE.md) for the Ant Design packages it depends on and their copyright lines.

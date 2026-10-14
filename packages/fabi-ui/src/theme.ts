import { cyan, geekblue, generate, green, magenta, orange, purple, red, volcano } from '@ant-design/colors'
import { theme as antdTheme } from 'antd'
import type { ThemeConfig } from 'antd'

/**
 * FABi CMS Design System brand: the single source. The Storybook's .storybook/brand.ts re-exports it.
 *
 * - Primary: per brand (BRANDS). colorInfo follows it, so links and info states match.
 * - Font: Be Vietnam Pro (import '@fabi/ui/font.css', weights 400 / 500 / 600 / 700).
 * - Weights: antd has Regular 400 and Strong 600 (fontWeightStrong, used for headings). The brand adds
 *   Medium 500 (FONT_WEIGHT_MEDIUM) for secondary titles; Card titles use it.
 * - Radius: antd's scale (XS 2, SM 4, base 6, LG 8); cards and other surfaces use LG 8 (CLAUDE.md, 2026-10-13:
 *   the earlier 16px card radius was dropped).
 * - Mode: Light (default) or Dark (`fabiTheme(brand, 'dark')`, see darkTheme). Font, radius and weights
 *   are the same in both.
 */
export const FONT_FAMILY =
  "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
export const FONT_WEIGHT_MEDIUM = 500

/** Class prefix of every component (`fabi-btn`) and of the CSS variables (`--fabi-color-primary`). */
export const FABI_PREFIX = 'fabi'
/** Class prefix of icons (`fabi-icon fabi-icon-search`). */
export const FABI_ICON_PREFIX = 'fabi-icon'

/*
 * Accessibility (WCAG AA): antd's defaults fail 4.5:1 for text in several places. Every value below
 * is an antd palette step (no invented colours):
 *   secondary text / description #8c8c8c (3.4:1) → rgba(0,0,0,.6) #666 (5.7:1)
 *   placeholder #bfbfbf (1.6:1) → rgba(0,0,0,.56) #707070 (5.0:1)
 *   error red-6 → red-7 (5.6:1) · success green-6 → green-8 (5.6:1) · warning gold-6 → orange-8 (5.4:1)
 *   primary hover/active: darker steps instead of lighter, so white text stays ≥ 4.5:1
 */
/*
 * Brands. `step` is the palette step of the primary colour (1–10); hover / active are one / two
 * steps darker. Every brand keeps white text ≥ 4.5:1 on the primary colour: Geek Blue 6 (5.9:1) ·
 * Golden Purple 6 (6.9:1) · Volcano 8 (6.9:1) · Magenta 7 (5.5:1) · Cyan 8 (6.1:1; step 7 is only 3.6:1).
 * The primary is also text on its own lightest tint (selected Menu item, Calendar today, filled Button,
 * Tag, Steps panel), so it must reach 4.5:1 on step 1 too: Volcano 7 is 4.8:1 on white but only 4.4:1 on
 * volcano-1, hence Volcano 8 (6.3:1) (2026-10-01).
 */
export const BRANDS = {
  geekblue: { name: 'Geek Blue', palette: geekblue, step: 6 },
  cyan: { name: 'Cyan', palette: cyan, step: 8 },
  volcano: { name: 'Volcano', palette: volcano, step: 8 },
  purple: { name: 'Golden Purple', palette: purple, step: 6 },
  magenta: { name: 'Magenta', palette: magenta, step: 7 },
} as const
export type BrandKey = keyof typeof BRANDS
export const DEFAULT_BRAND: BrandKey = 'geekblue'

type Algorithm = Extract<NonNullable<ThemeConfig['algorithm']>, (...args: never[]) => unknown>
type Seed = Parameters<Algorithm>[0]

/**
 * Palette and primary step for a primary seed: the FABi brand whose primary it is, else antd's own
 * palette of that colour with the seed at step 6 (what antd itself would derive).
 */
function brandOf(colorPrimary: string): { p: readonly string[]; step: number } {
  const c = colorPrimary.toLowerCase()
  for (const b of Object.values(BRANDS)) if (b.palette[b.step - 1].toLowerCase() === c) return { p: b.palette, step: b.step }
  return { p: generate(colorPrimary), step: 6 }
}

/** A seed the developer left at antd's default gets FABi's value instead; one they set stays. */
const seedOr = (seed: Seed, key: 'colorError' | 'colorSuccess' | 'colorWarning' | 'colorLink', fabi: string) =>
  seed[key] === antdTheme.defaultSeed[key] ? fabi : seed[key]

/*
 * The mode-specific colours are applied by FABi's own algorithms (light and dark), not as theme tokens.
 * antd merges a nested ConfigProvider's tokens over its parent's but REPLACES the algorithm. As tokens,
 * Light's pinned colours (placeholder black .56, light tints) leaked into a nested dark area
 * (theme.algorithm = darkAlgorithm): black placeholder on #141414 (2026-10-13). As algorithms they go
 * with their mode. Only mode-free values stay tokens: the brand seed (colorPrimary / colorInfo, read back
 * here by brandOf) and the font. `theme.defaultAlgorithm` / `theme.darkAlgorithm` exported by @fabi/ui
 * are these two, so `algorithm: theme.darkAlgorithm` from @fabi/ui gives FABi's accessible dark.
 */
const lightPins = (p: readonly string[], step: number) => {
  // antd derives the light tints (selected menu item, Calendar today, Tag / Alert info backgrounds) and
  // the text shades from colorPrimary as if it were step 6. For a darker primary (Cyan 8, Volcano 8,
  // Magenta 7) that gives greyish tints (Cyan: #a3b5b3, 2.8:1 under primary text) and near-black text,
  // so they are pinned to the brand palette's own steps: tints 1–4, text 8–10. For a step-6 brand
  // these are exactly antd's values.
  const tints = { Bg: p[0], BgHover: p[1], Border: p[2], BorderHover: p[3] }
  const text = { TextHover: p[7], Text: p[8], TextActive: p[9] }
  const scale = (name: 'Primary' | 'Info') => Object.fromEntries(Object.entries({ ...tints, ...text }).map(([k, v]) => [`color${name}${k}`, v]))
  return {
    ...scale('Primary'),
    ...scale('Info'),
    colorPrimaryHover: p[step],
    colorPrimaryActive: p[step + 1],
    colorInfoHover: p[3], // antd: info step 4
    colorInfoActive: p[step],
    colorLinkHover: p[step],
    colorLinkActive: p[step + 1],
    colorErrorHover: red[7],
    colorErrorActive: red[8],
    // status backgrounds / borders stay the light steps (antd would derive greyish tints from the
    // darker status colours)
    colorSuccessBg: green[0],
    colorSuccessBorder: green[2],
    colorWarningBg: orange[0],
    colorWarningBorder: orange[2],
    colorErrorBg: red[0],
    colorErrorBorder: red[2],
    // tertiary → description, quaternary → placeholder and disabled (antd's alias layer derives them)
    colorTextTertiary: 'rgba(0, 0, 0, 0.6)',
    // quaternary text (step subtitles, picker suffixes, Empty text, disabled text) was #bfbfbf (1.6:1)
    colorTextQuaternary: 'rgba(0, 0, 0, 0.56)',
  }
}

/** FABi Light: antd's default algorithm with the accessible status seeds, brand tints and text shades. */
export const fabiLightAlgorithm: Algorithm = (seed, map) => {
  const s = {
    ...seed,
    colorError: seedOr(seed, 'colorError', red[6]),
    colorSuccess: seedOr(seed, 'colorSuccess', green[7]),
    colorWarning: seedOr(seed, 'colorWarning', orange[7]),
  }
  const { p, step } = brandOf(seed.colorPrimary)
  return { ...(map ?? antdTheme.defaultAlgorithm(s)), ...lightPins(p, step) }
}

const baseTheme: ThemeConfig = {
  token: { fontFamily: FONT_FAMILY },
  components: {
    // Card: Medium titles (Card's title and Card.Meta title read fontWeightStrong); corners stay borderRadiusLG 8;
    // padding 16 (= the padding token) in the body and the header: CLAUDE.md "Card: padding 16px" (antd: 24)
    Card: { fontWeightStrong: FONT_WEIGHT_MEDIUM, bodyPadding: 16, headerPadding: 16 },
    // icons as in the design's Menu item and icon-only Button: 16px (antd: 14 / inherit). Menu gap 8 so
    // icon + gap = inlineIndent 24 and submenu labels line up with their children (antd: 24 - 14 = 10)
    Menu: { iconSize: 16, iconMarginInlineEnd: 8 },
    Button: { onlyIconSize: 16 },
    // a11y: dates outside the current month and the "off" Switch track used #bfbfbf (1.6:1)
    Calendar: { colorTextDisabled: 'rgba(0, 0, 0, 0.56)' },
    Switch: { colorTextQuaternary: 'rgba(0, 0, 0, 0.56)', colorTextTertiary: 'rgba(0, 0, 0, 0.65)' },
  },
}

/** Colour modes. Light is the brand as designed; Dark is antd's dark algorithm driven by the same brand. */
export const MODES = { light: { name: 'Light' }, dark: { name: 'Dark' } } as const
export type FabiMode = keyof typeof MODES
export const DEFAULT_MODE: FabiMode = 'light'

/** The FABi CMS antd theme for one brand and mode (unknown keys fall back to DEFAULT_BRAND / light). */
export function fabiTheme(brand: BrandKey | (string & {}) = DEFAULT_BRAND, mode: FabiMode | (string & {}) = DEFAULT_MODE): ThemeConfig {
  return mode === 'dark' ? darkTheme(brand) : lightTheme(brand)
}

function lightTheme(brand: BrandKey | (string & {})): ThemeConfig {
  const { palette: p, step } = BRANDS[brand as BrandKey] ?? BRANDS[DEFAULT_BRAND]
  const base = p[step - 1] // palette arrays are 0-based: step 6 = p[5]
  return {
    ...baseTheme,
    algorithm: fabiLightAlgorithm,
    token: { ...baseTheme.token, colorPrimary: base, colorInfo: base },
    components: {
      ...baseTheme.components,
      // App header: the brand's two steps below the primary, top to bottom (Geek Blue 8 → 7, like the old
      // FABi header blue-8 → blue-7); white text ≥ 7.7:1 on both, every brand (user 2026-10-13)
      Layout: { headerBg: `linear-gradient(180deg, ${p[step + 1]} 0%, ${p[step]} 100%)`, headerColor: '#fff' },
    },
  }
}

/*
 * Dark: antd's darkAlgorithm with the same brand seed as Light (colorPrimary / colorInfo = the brand
 * step), so colorPrimary and its hover / active are antd's own dark fills for that seed (white text on
 * colorPrimary ≥ 6.7:1). Where white text on antd's hover (one step lighter) is under 4.5:1 (Geek Blue
 * #5273e0, 4.3:1), hover / active go one / two steps darker instead, Light's rule. The primary / info tints are pinned for the same reason as in Light: the dark algorithm
 * derives them from the seed as if it were step 6, and a darker seed (Cyan 8, Volcano 8, Magenta 7) gives
 * murky tints. They come from antd's dark palette of the brand hue (generate(step 6, dark) =
 * presetDarkPalettes) at the positions the dark algorithm uses.
 *
 * Accessibility (WCAG AA, 2026-10-01). On antd's dark surfaces (#000 page, #141414 container, #1f1f1f
 * popups, #272727 filled inputs) no single colour carries both white text at 4.5:1 and text of its own at
 * 4.5:1, so antd's dark fill colours fail as text (Geek Blue #2b4acb 2.6:1, error #dc4446 4.3:1). Fills
 * keep antd's value; text roles move up the same dark palette:
 *   brand text: step 8 (≥ 4.7:1 on every surface and on the selected tint, all five brands); hover
 *     step 9; pressed stays on step 8 (step 7 is under 4.5:1). On the selected tint's hover (Dropdown,
 *     Table) step 8 and the link colour drop to 3.5:1, so the Dropdown's selected text is step 9 (≥ 4.7:1)
 *     and a selected Table row sits one step lower (selected step 2, hovered step 3)
 *   components that colour text with colorPrimary (Tabs, Menu, Anchor, Pagination, Spin, Dropdown) get
 *     the text step as their own token; Buttons, Steps, Tags and the Calendar in styles.css
 *   colorLink and colorError are seeds: the algorithm turns a seed into its dark step 6 (85% seed over
 *     the background), so they are given a lighter palette seed and the result is antd's own output.
 *     Link seed = dark step 9 → Geek Blue #92a7d6 (≥ 5.0:1 all brands); a muted shade, not the brand
 *     text step, because colorLink cannot be set directly. Error seed red-4 instead of
 *     antd's red-5 → #dc6966 (≥ 4.8:1 on #000–#1f1f1f and the error tint); where error is a fill under
 *     white text (Badge count, danger Button, solid Tag, danger menu items) antd's error step 5 #ad393a
 *     (6.1:1)
 *   success / warning text pass; as fills under white text: green step 5 #3c8618 (4.6:1), gold step 4
 *     #7c5914 (6.4:1)
 *   tertiary / description / placeholder / quaternary text: not antd values but Light's opacities on
 *     white (.6 / .56); antd's .45 and .25 are 4.4:1 and 2.2:1. colorTextDisabled follows quaternary. Switch and Avatar keep antd's .25 / .45: there
 *     they are backgrounds under white text.
 */
const DARK_ERROR = generate(antdTheme.defaultSeed.colorError, { theme: 'dark' })
const DARK_SUCCESS = generate(antdTheme.defaultSeed.colorSuccess, { theme: 'dark' })
const DARK_FILLS = { error: DARK_ERROR[4], success: DARK_SUCCESS[4] }
const DARK_ERROR_SEED = red[3]
const DARK_ERROR_TEXT = generate(DARK_ERROR_SEED, { theme: 'dark' })[5]

/** WCAG contrast of white text on a '#rrggbb' colour. */
function whiteContrast(hex: string) {
  const lin = (i: number) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 1.05 / (0.2126 * lin(1) + 0.7152 * lin(3) + 0.0722 * lin(5) + 0.05)
}

/** FABi Dark: antd's dark algorithm with lighter link / error seeds, brand tints and accessible text shades. */
export const fabiDarkAlgorithm: Algorithm = (seed, map) => {
  const { p } = brandOf(seed.colorPrimary)
  const d = generate(p[5], { theme: 'dark' }) // dark palette of the brand hue, d[0] darkest … d[9] lightest
  const sd = generate(seed.colorPrimary, { theme: 'dark' }) // antd's dark palette of the seed: sd[5] = colorPrimary, sd[6] its hover
  const textColor = d[7]
  const text = { TextHover: d[8], Text: textColor, TextActive: textColor }
  const pin = (name: 'Primary' | 'Info', tokens: Record<string, string>) =>
    Object.fromEntries(Object.entries(tokens).map(([k, v]) => [`color${name}${k}`, v]))
  const s = { ...seed, colorLink: seedOr(seed, 'colorLink', d[8]), colorError: seedOr(seed, 'colorError', DARK_ERROR_SEED) }
  return {
    ...antdTheme.darkAlgorithm(s, map),
    // the dark algorithm sets the primary's Bg / BgHover to its Border / BorderHover steps
    ...pin('Primary', { Bg: d[2], BgHover: d[3], Border: d[2], BorderHover: d[3], ...text }),
    ...pin('Info', { Bg: d[0], BgHover: d[1], Border: d[2], BorderHover: d[3], Hover: d[3], Active: d[4], ...text }),
    ...(whiteContrast(sd[6]) < 4.5 && { colorPrimaryHover: sd[4], colorPrimaryActive: sd[3] }),
    colorLinkHover: d[8],
    colorLinkActive: textColor,
    colorErrorActive: DARK_ERROR_TEXT,
    colorErrorTextActive: DARK_ERROR_TEXT,
    // tertiary → description, quaternary → placeholder and disabled (antd's alias layer derives them)
    colorTextTertiary: 'rgba(255, 255, 255, 0.6)',
    colorTextQuaternary: 'rgba(255, 255, 255, 0.56)',
  }
}

function darkTheme(brand: BrandKey | (string & {})): ThemeConfig {
  const { palette: p, step } = BRANDS[brand as BrandKey] ?? BRANDS[DEFAULT_BRAND]
  const base = p[step - 1]
  const d = generate(p[5], { theme: 'dark' }) // dark palette, d[0] darkest … d[9] lightest
  const textColor = d[7]
  // components whose own styles use colorPrimary as text colour (never as a fill under white text)
  const brandText = { colorPrimary: textColor, colorPrimaryHover: d[8], colorPrimaryActive: textColor }
  const antdDark = { quaternary: 'rgba(255, 255, 255, 0.25)', tertiary: 'rgba(255, 255, 255, 0.45)' }
  return {
    algorithm: fabiDarkAlgorithm,
    token: { colorPrimary: base, colorInfo: base, fontFamily: FONT_FAMILY },
    components: {
      Card: { fontWeightStrong: FONT_WEIGHT_MEDIUM, bodyPadding: 16, headerPadding: 16 },
      // App header: the two darkest steps of the brand's dark palette (old FABi dark header: blue dark 1 → 2)
      Layout: { headerBg: `linear-gradient(180deg, ${d[0]} 0%, ${d[1]} 100%)` },
      Anchor: brandText,
      // selected item text sits on controlItemBgActiveHover when hovered / keyboard-active: step 9
      Dropdown: { ...brandText, colorPrimary: d[8] },
      Spin: brandText,
      Pagination: { ...brandText, itemActiveColor: textColor, itemActiveColorHover: d[8] },
      Tabs: { itemSelectedColor: textColor, itemHoverColor: d[8], itemActiveColor: textColor, inkBarColor: textColor },
      // a submenu title with a selected child keeps its colour over itemHoverBg (#303030): step 9
      Menu: {
        iconSize: 16,
        iconMarginInlineEnd: 8,
        itemSelectedColor: textColor, subMenuItemSelectedColor: d[8], horizontalItemSelectedColor: textColor, horizontalItemHoverColor: textColor,
        darkDangerItemSelectedBg: DARK_FILLS.error, darkDangerItemActiveBg: DARK_FILLS.error,
      },
      // links in a hovered selected row: on step 4 they are 3.5:1 (Cyan), on step 3 ≥ 5.0:1
      Table: { rowSelectedBg: d[1], rowSelectedHoverBg: d[2] },
      // default Buttons turn to the brand on hover / press: text there too
      // ghost Buttons sit on a coloured backdrop: antd gives them colorBgContainer text, near black in Dark
      Button: {
        onlyIconSize: 16,
        defaultHoverColor: d[8], defaultHoverBorderColor: d[8], defaultActiveColor: textColor, defaultActiveBorderColor: textColor,
        defaultGhostColor: '#fff', defaultGhostBorderColor: '#fff',
      },
      // a disabled multiple Select writes its tags in colorTextDisabled on a grey fill: .56 is 4.47:1 there
      Select: { colorTextDisabled: 'rgba(255, 255, 255, 0.6)' },
      Badge: { colorError: DARK_FILLS.error },
      Progress: { colorSuccess: DARK_FILLS.success },
      Switch: { colorTextQuaternary: antdDark.quaternary, colorTextTertiary: antdDark.tertiary },
      Avatar: { colorTextPlaceholder: antdDark.quaternary },
    },
  }
}

/**
 * Deep-merges a developer theme over the FABi theme: token and each component's tokens merge, the
 * algorithms add up (dark mode + `compactAlgorithm`), the rest is replaced.
 */
export function mergeTheme(base: ThemeConfig, extra?: ThemeConfig): ThemeConfig {
  if (!extra) return base
  const components: Record<string, object> = { ...base.components }
  for (const [name, tokens] of Object.entries(extra.components ?? {})) {
    components[name] = { ...components[name], ...(tokens as object) }
  }
  const algorithms = [...new Set([base.algorithm, extra.algorithm].flat())].filter((a): a is Algorithm => !!a)
  return {
    ...base,
    ...extra,
    ...(algorithms.length > 0 && { algorithm: algorithms.length === 1 ? algorithms[0] : algorithms }),
    token: { ...base.token, ...extra.token },
    components: components as ThemeConfig['components'],
  }
}

/**
 * antd's `theme` with FABi's algorithms as `defaultAlgorithm` / `darkAlgorithm` (re-exported by the '@fabi/ui'
 * entry in place of antd's), so a nested area that switches mode with them gets FABi's accessible colours instead
 * of the other mode's pinned ones. Defined here, not in index.ts, so the entry stays a pure list of re-exports.
 */
export const theme: typeof antdTheme = { ...antdTheme, defaultAlgorithm: fabiLightAlgorithm, darkAlgorithm: fabiDarkAlgorithm }

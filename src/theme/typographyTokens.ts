import type { Density } from './dimensionTokens'

type TypographySet = Record<string, number>

/**
 * Every token in the Figma collection `4. Typography`'s `Font Size` and
 * `Line Height` groups, both densities (23 variables total there; `Font
 * Family` and `Font Weight` don't vary by density and live in `theme/index.ts`
 * / `fontWeightTokens` below instead).
 *
 * Ant Design's line-height tokens are unitless multipliers of the paired
 * font-size (`lineHeight` -> `fontSize`, `lineHeightHeading1` ->
 * `fontSizeHeading1`, ...), not absolute px — Figma's variables are literal
 * px, so every `lineHeight*` value below is `px / matching fontSize*`, not
 * the raw Figma number. At Default density this reduces to exactly Ant
 * Design's own default line-height scale (e.g. 46/38 = 1.2105... = its own
 * `lineHeightHeading1`) — Compact does not resolve to the same ratios,
 * which is the actual gap this file closes: before this, nothing in the
 * theme shrank typography for Compact density, only spacing/control-height
 * did (`dimensionTokens.ts`).
 */
export const typographyTokens: Record<Density, TypographySet> = {
  default: {
    fontSize: 14, fontSizeLG: 16, fontSizeSM: 12, fontSizeXL: 20,
    fontSizeHeading1: 38, fontSizeHeading2: 30, fontSizeHeading3: 24, fontSizeHeading4: 20, fontSizeHeading5: 16,
    fontSizeIcon: 12,
    lineHeight: 22 / 14, lineHeightLG: 24 / 16, lineHeightSM: 20 / 12,
    lineHeightHeading1: 46 / 38, lineHeightHeading2: 38 / 30, lineHeightHeading3: 32 / 24,
    lineHeightHeading4: 28 / 20, lineHeightHeading5: 24 / 16,
  },
  compact: {
    fontSize: 12, fontSizeLG: 14, fontSizeSM: 10, fontSizeXL: 16,
    fontSizeHeading1: 32, fontSizeHeading2: 26, fontSizeHeading3: 20, fontSizeHeading4: 16, fontSizeHeading5: 14,
    fontSizeIcon: 12,
    lineHeight: 20 / 12, lineHeightLG: 22 / 14, lineHeightSM: 18 / 10,
    lineHeightHeading1: 40 / 32, lineHeightHeading2: 34 / 26, lineHeightHeading3: 28 / 20,
    lineHeightHeading4: 24 / 16, lineHeightHeading5: 22 / 14,
  },
}

/**
 * Figma's `Font Weight` group — identical values at both densities there,
 * so unlike `typographyTokens` this isn't split by `Density`.
 *
 * `fontWeightStrong` is a real Ant Design seed token (also passed into
 * `buildTheme`, see `theme/index.ts`, so it actually themes every
 * `strong`/header/title in the library). `fontWeightNormal` and
 * `fontWeightMedium` have no Ant Design equivalent — regular text just
 * renders unstyled at the browser default (400), and nothing in this
 * project uses 500 (`CLAUDE.md`'s own rule caps real UI usage at Regular
 * 400 and Semibold 600). All three live here as reference values for the
 * Font/Weight docs page only; only `fontWeightStrong` is fed into
 * ConfigProvider.
 */
export const fontWeightTokens = {
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightStrong: 600,
} as const

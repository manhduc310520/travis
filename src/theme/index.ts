import { theme as antdTheme, type ThemeConfig } from 'antd'
import { componentTokens } from './componentTokens'
import { dimensionTokens, screenTokens, DENSITIES, type Density } from './dimensionTokens'
import { semanticFixed, semanticBrand, CUSTOM_KEYS, type Brand, type Mode } from './semanticTokens'

export type { Brand, Mode, Density }
export const BRANDS: Brand[] = ['blue', 'green', 'yellow', 'magenta', 'orange']
export const MODES: Mode[] = ['light', 'dark']
export { DENSITIES, dimensionTokens, semanticFixed, semanticBrand }

/** Typography tokens, from `4. Typography`. They do not change with brand. */
export const globalTokens = {
  fontSize: 14,
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
} as const

/**
 * Builds the Ant Design theme for one brand, colour mode and density.
 *
 * The algorithm still runs — it fills in anything Figma does not name — but
 * every token Figma does name is passed explicitly and wins. That is the
 * difference between "Ant Design tinted towards our brand" and "our design
 * system, rendered by Ant Design".
 */
export function buildTheme(brand: Brand, mode: Mode, density: Density = 'default'): ThemeConfig {
  const brandTokens = { ...semanticBrand[`${brand}.${mode}`] }
  for (const key of CUSTOM_KEYS) delete brandTokens[key]

  return {
    algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      ...semanticFixed[mode],
      ...brandTokens,
      ...dimensionTokens[density],
      ...screenTokens,
      ...globalTokens,
    },
    components: componentTokens as ThemeConfig['components'],
  }
}

/** The header gradient has no Ant Design equivalent, so it ships as CSS variables. */
export function headerGradientVars(brand: Brand, mode: Mode): Record<string, string> {
  const t = semanticBrand[`${brand}.${mode}`]
  const start = t.colorHeaderBgStart
  const end = t.colorHeaderBgEnd
  return {
    '--fabi-header-bg-start': start,
    '--fabi-header-bg-end': end,
    '--fabi-header-bg': `linear-gradient(90deg, ${start} 0%, ${end} 100%)`,
  }
}

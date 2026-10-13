// @fabi/ui: Ant Design 6.6.5 with the FABi CMS Design System theme, class prefix and a11y fixes.
// Everything antd exports is re-exported; import from '@fabi/ui' instead of 'antd'. One difference:
// `theme.defaultAlgorithm` / `theme.darkAlgorithm` are FABi's (see theme.ts), so a nested area that
// switches mode with them gets FABi's accessible colours instead of the other mode's pinned ones.
import { theme as antdTheme } from 'antd'
import { fabiDarkAlgorithm, fabiLightAlgorithm } from './theme.js'

export * from 'antd'

export const theme: typeof antdTheme = { ...antdTheme, defaultAlgorithm: fabiLightAlgorithm, darkAlgorithm: fabiDarkAlgorithm }

export { FABI_MODE_ATTR, FabiProvider } from './FabiProvider.js'
export type { FabiProviderProps } from './FabiProvider.js'
export {
  BRANDS,
  DEFAULT_BRAND,
  DEFAULT_MODE,
  FABI_ICON_PREFIX,
  FABI_PREFIX,
  FONT_FAMILY,
  FONT_WEIGHT_MEDIUM,
  MODES,
  fabiDarkAlgorithm,
  fabiLightAlgorithm,
  fabiTheme,
  mergeTheme,
} from './theme.js'
export type { BrandKey, FabiMode } from './theme.js'
export { StatisticCard } from './StatisticCard.js'
export type { StatisticCardColor, StatisticCardProps } from './StatisticCard.js'
export { SearchModal } from './SearchModal.js'
export type { SearchModalGroup, SearchModalItem, SearchModalPanelProps, SearchModalProps } from './SearchModal.js'
export { installA11yFixes } from './a11yFixes.js'
export type { A11yFixesOptions } from './a11yFixes.js'

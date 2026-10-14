// @fabi/ui: Ant Design 6.6.5 with the FABi CMS Design System theme, class prefix and a11y fixes.
// Everything antd exports is re-exported; import from '@fabi/ui' instead of 'antd'. One difference:
// `theme.defaultAlgorithm` / `theme.darkAlgorithm` are FABi's (see theme.ts), so a nested area that
// switches mode with them gets FABi's accessible colours instead of the other mode's pinned ones.
// Only re-exports here (`theme` is defined in theme.ts): a bundler can then skip this module and load just the parts
// a page imports, instead of running every antd component first.
export * from 'antd'
export { theme } from './theme.js'

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
export { PageHeader } from './PageHeader.js'
export type { PageHeaderProps } from './PageHeader.js'
export { FilterBar } from './FilterBar.js'
export type { FilterBarProps } from './FilterBar.js'
export { DATE_FORMAT, DATE_TIME_FORMAT, formatDate, formatDateTime, formatMoney, formatNumber, formatPercent } from './format.js'
export type { SearchModalGroup, SearchModalItem, SearchModalPanelProps, SearchModalProps } from './SearchModal.js'
export { installA11yFixes } from './a11yFixes.js'
export type { A11yFixesOptions } from './a11yFixes.js'

/**
 * FABi CMS Design System brand for the Storybook. The single source is the @fabi/ui package
 * (packages/fabi-ui/src/theme.ts): change the brand there, and the Storybook and apps follow.
 * Kept as a thin re-export so preview.tsx keeps its names.
 */
export {
  BRANDS,
  DEFAULT_BRAND,
  DEFAULT_MODE,
  FONT_FAMILY,
  FONT_WEIGHT_MEDIUM,
  MODES,
  fabiTheme as brandThemeFor,
} from '../packages/fabi-ui/src/theme'
export type { BrandKey, FabiMode } from '../packages/fabi-ui/src/theme'

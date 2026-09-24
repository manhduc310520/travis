import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

/**
 * The manager (sidebar/toolbar) chrome, not the previewed components — those
 * keep FABi CMS's own Figma-sourced brand via ConfigProvider in preview.tsx.
 * Requested to match Narmi's own Storybook chrome; every value below was
 * measured live off narmi.github.io/design_system (getComputedStyle,
 * elementFromPoint), not guessed. `brandTitle` stays "FABi Design System" —
 * the layout/color/font conventions are copied, not Narmi's own name or logo.
 */
const theme = create({
  base: 'light',
  brandTitle: 'FABi Design System',
  brandUrl: 'https://github.com/manhduc310520/travis',

  fontBase: '"Mulish", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  fontCode: 'Monaco, Consolas, monospace',

  colorPrimary: '#00376A',
  // Specifically the selected sidebar item's fill (Storybook's own
  // `LeafNodeStyleWrapper` reads `theme.color.secondary` for that one
  // background, separate from `colorPrimary`/`booleanSelectedBg` — traced via
  // the actual manager bundle source, not guessed). Requested directly.
  colorSecondary: '#003EB3',

  // Picked by hand via the browser color picker on the live sidebar element
  // (verified: rgb(252, 251, 233)). Storybook derives the sidebar background
  // AND the fade-to-background glow above the sticky "Run tests" button from
  // this same value, so both update together automatically.
  appBg: '#FCFBE9',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: 'rgba(38, 74, 115, 0.15)',
  appBorderRadius: 4,

  textColor: '#2E3438',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#767676',

  barTextColor: '#2E3438',
  barSelectedColor: '#00376A',
  barBg: '#FFFFFF',

  buttonBg: '#FFFFFF',
  buttonBorder: 'rgba(38, 74, 115, 0.15)',

  booleanBg: '#FFFFFF',
  booleanSelectedBg: '#00376A',

  inputBg: '#FFFFFF',
  inputBorder: 'rgba(38, 74, 115, 0.15)',
  inputTextColor: '#2E3438',
  inputBorderRadius: 4,
})

addons.setConfig({ theme })

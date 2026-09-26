/**
 * The 12 hues of Color/Palette. For categorising (tags, avatars, charts,
 * coloured buttons and tooltips) — never for the main action or for status
 * that matters (use the semantic roles for that).
 */
export type PaletteHue =
  | 'blue' | 'cyan' | 'indigo' | 'purple' | 'magenta' | 'red'
  | 'vermilion' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green'

export const PALETTE_HUES: readonly PaletteHue[] = [
  'blue', 'cyan', 'indigo', 'purple', 'magenta', 'red',
  'vermilion', 'orange', 'amber', 'yellow', 'lime', 'green',
]

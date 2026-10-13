import { parseColor, type Color } from 'react-aria-components'

/**
 * One colour stop of a linear gradient (Figma popup Gradient=True, "Gradient
 * Slider" handles). `offset` is the position along the bar, 0–100 (%).
 * Values you pass in may use a CSS colour string; values the picker emits
 * always carry a React Aria `Color` (`ColorPickerStop<Color>`).
 */
export interface ColorPickerStop<C = string | Color> {
  color: C
  offset: number
}

type Stop = ColorPickerStop<Color>

/** The picker works in HSB so the area / hue slider keep their position at grey and black. */
export const toHsb = (c: string | Color): Color => (typeof c === 'string' ? parseColor(c) : c).toFormat('hsb')

const clampOffset = (n: number) => Math.min(100, Math.max(0, Math.round(n)))

/** Normalises stops from props: HSB colours, offsets clamped to 0–100. */
export const toStops = (stops: ColorPickerStop[]): Stop[] =>
  stops.map((s) => ({ color: toHsb(s.color), offset: clampOffset(s.offset) }))

/** Stops in bar order; the stored order is kept so a dragged handle keeps its index. */
export const sortStops = <S extends ColorPickerStop>(stops: S[]): S[] => [...stops].sort((a, b) => a.offset - b.offset)

/** A gradient that starts and ends on `color` — what "Single → Gradient" starts from. */
export const defaultStops = (color: Color): Stop[] => [
  { color, offset: 0 },
  { color, offset: 100 },
]

/**
 * CSS for a stop list, e.g. to paint a menu banner or a category chip:
 * `linear-gradient(90deg, rgba(22, 119, 255, 1) 0%, …)`.
 */
export function gradientToCss(stops: ColorPickerStop[], angle = 90): string {
  const parts = sortStops(stops).map((s) => `${toHsb(s.color).toFormat('rgb').toString('rgba')} ${s.offset}%`)
  return `linear-gradient(${angle}deg, ${parts.join(', ')})`
}

/** The colour the gradient shows at `offset` — a new stop added there keeps the bar unchanged. */
export function colorAt(stops: Stop[], offset: number): Color {
  const sorted = sortStops(stops)
  const after = sorted.findIndex((s) => s.offset >= offset)
  if (after === 0) return sorted[0].color
  if (after === -1) return sorted[sorted.length - 1].color
  const a = sorted[after - 1]
  const b = sorted[after]
  const t = b.offset === a.offset ? 0 : (offset - a.offset) / (b.offset - a.offset)
  const from = a.color.toFormat('rgb')
  const to = b.color.toFormat('rgb')
  const mix = (ch: 'red' | 'green' | 'blue' | 'alpha') =>
    from.getChannelValue(ch) + (to.getChannelValue(ch) - from.getChannelValue(ch)) * t
  return from
    .withChannelValue('red', Math.round(mix('red')))
    .withChannelValue('green', Math.round(mix('green')))
    .withChannelValue('blue', Math.round(mix('blue')))
    .withChannelValue('alpha', Math.round(mix('alpha') * 100) / 100)
    .toFormat('hsb')
}

const linear = (v: number) => {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

/** WCAG relative luminance above 0.179: black text / icons read better than white on it. */
export function isBright(color: Color): boolean {
  const rgb = color.toFormat('rgb')
  const l =
    0.2126 * linear(rgb.getChannelValue('red')) +
    0.7152 * linear(rgb.getChannelValue('green')) +
    0.0722 * linear(rgb.getChannelValue('blue'))
  return l > 0.179
}

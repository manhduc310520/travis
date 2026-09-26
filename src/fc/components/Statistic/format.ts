/** Formats a number the Vietnamese way by default: 112.893 · 11,28 · 1.250.000 ₫. */
export function formatNumber(
  value: number | string,
  { locale = 'vi-VN', precision, formatOptions }: { locale?: string; precision?: number; formatOptions?: Intl.NumberFormatOptions } = {},
): string {
  const n = typeof value === 'number' ? value : value.trim() === '' ? Number.NaN : Number(value)
  // Not a number (e.g. "—", "N/A"): show it as given.
  if (!Number.isFinite(n)) return String(value)
  const digits = precision == null ? {} : { minimumFractionDigits: precision, maximumFractionDigits: precision }
  return new Intl.NumberFormat(locale, { ...digits, ...formatOptions }).format(n)
}

/** Stands in for a `[literal]` while tokens are replaced (a private-use character: never in a format). */
const PLACEHOLDER = ''

const UNITS: [token: string, ms: number][] = [
  ['Y', 365 * 24 * 60 * 60 * 1000],
  ['M', 30 * 24 * 60 * 60 * 1000],
  ['D', 24 * 60 * 60 * 1000],
  ['H', 60 * 60 * 1000],
  ['m', 60 * 1000],
  ['s', 1000],
  ['S', 1],
]

/**
 * Formats a duration in ms with format tokens: `Y M D H m s` (repeat to
 * zero-pad, e.g. `HH`), `S` / `SS` / `SSS` = tenths / hundredths / ms.
 * Text in `[brackets]` is kept as is: `D [ngày] HH:mm:ss`.
 */
export function formatDuration(ms: number, format: string): string {
  let left = Math.max(0, ms)
  const literals: string[] = []
  let out = format.replace(/\[([^\]]*)\]/g, (_, text: string) => {
    literals.push(text)
    return PLACEHOLDER
  })
  for (const [token, unit] of UNITS) {
    if (!out.includes(token)) continue
    const value = Math.floor(left / unit)
    left -= value * unit
    out = out.replace(new RegExp(`${token}+`, 'g'), (match) => {
      if (token !== 'S') return String(value).padStart(match.length, '0')
      const len = Math.min(match.length, 3)
      return String(value).padStart(3, '0').slice(0, len)
    })
  }
  return out
    .split(PLACEHOLDER)
    .map((part, n) => (n === 0 ? part : (literals[n - 1] ?? '') + part))
    .join('')
}

/** True when the format shows fractions of a second, so the display must tick faster than once a second. */
export const hasSubSecond = (format: string) => /S/.test(format.replace(/\[[^\]]*\]/g, ''))

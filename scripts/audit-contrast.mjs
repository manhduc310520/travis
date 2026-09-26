/**
 * WCAG contrast of the text/background token pairs fc components actually
 * use, for every brand × mode. STRICT: exits 1 when any pair is below its
 * minimum (all pass since the tier-1 contrast fix, 2026-09-26).
 *
 * Run: npm run audit:contrast
 */
import { loadExport, indexTokens, resolveToken } from './tokens-lib.mjs'

const STRICT = true
const byName = indexTokens(loadExport())

// [label, foreground token, background token, minimum ratio]
const PAIRS = [
  ['Chữ chính', 'color/content/neutral-strong', 'color/background/container', 4.5],
  ['Chữ phụ', 'color/content/neutral', 'color/background/container', 4.5],
  ['Chữ mô tả (Text secondary)', 'color/content/description', 'color/background/container', 4.5],
  ['Link', 'color/content/link', 'color/background/container', 4.5],
  ['Chữ accent', 'color/content/accent', 'color/background/container', 4.5],
  ['Chữ thành công', 'color/content/success', 'color/background/container', 4.5],
  ['Chữ cảnh báo', 'color/content/warning', 'color/background/container', 4.5],
  ['Chữ lỗi', 'color/content/danger', 'color/background/container', 4.5],
  // Status text on its own faded background (Alert, Tag).
  ['Chữ info trên nền nhạt', 'color/content/info', 'color/background/info-faded', 4.5],
  ['Chữ thành công trên nền nhạt', 'color/content/success', 'color/background/success-faded', 4.5],
  ['Chữ cảnh báo trên nền nhạt', 'color/content/warning', 'color/background/warning-faded', 4.5],
  ['Chữ lỗi trên nền nhạt', 'color/content/danger', 'color/background/danger-faded', 4.5],
  ['Tooltip', 'color/content/on-solid', 'color/background/spotlight', 4.5],
  // Descriptions and group titles also sit on overlays and alternate rows.
  ['Chữ mô tả trên elevated', 'color/content/description', 'color/background/elevated', 4.5],
  ['Chữ mô tả trên alternate', 'color/content/description', 'color/background/alternate', 4.5],
  ['Chữ phụ trên elevated', 'color/content/neutral', 'color/background/elevated', 4.5],
  ['Nút primary', 'color/content/on-solid', 'color/solid/accent', 4.5],
  ['Nút primary danger', 'color/content/on-solid', 'color/solid/danger', 4.5],
  // Keyboard focus ring: `outline` of fc components (spec: focus uses Color/Solid/Accent).
  ['Vòng focus (non-text)', 'color/solid/accent', 'color/background/container', 3],
  ['Vòng focus danger (non-text)', 'color/solid/danger', 'color/background/container', 3],
  // Control boundary (WCAG 1.4.11): input / checkbox / radio / default button borders,
  // on every surface a control can sit on.
  ['Viền control trên container', 'color/border/control', 'color/background/container', 3],
  ['Viền control trên layout', 'color/border/control', 'color/background/layout', 3],
  ['Viền control trên elevated', 'color/border/control', 'color/background/elevated', 3],
  ['Viền control trên nền neutral', 'color/border/control', 'color/background/neutral', 3],
]

const parse = (hex) => {
  const h = hex.replace('#', '')
  const n = (i) => parseInt(h.slice(i, i + 2), 16)
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 }
}
const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 })
const lum = ({ r, g, b }) => {
  const c = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b)
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

const failures = []
for (const brand of ['blue', 'green', 'yellow', 'magenta', 'orange']) {
  for (const mode of ['light', 'dark']) {
    const ctx = { brand, mode, density: 'default' }
    const page = parse(resolveToken(byName, 'color/background/layout', ctx))
    for (const [label, fg, bg, min] of PAIRS) {
      const b = over(parse(resolveToken(byName, bg, ctx)), page)
      const r = ratio(over(parse(resolveToken(byName, fg, ctx)), b), b)
      if (r < min) failures.push({ brand, mode, label, fg, bg, ratio: Math.round(r * 100) / 100, min })
    }
  }
}

const checked = 5 * 2 * PAIRS.length
console.log(`contrast pairs checked: ${checked}, below minimum: ${failures.length}`)
const byLabel = {}
for (const f of failures) (byLabel[f.label] ??= []).push(`${f.brand}.${f.mode} ${f.ratio}`)
for (const [label, list] of Object.entries(byLabel)) console.log(`  ✗ ${label}: ${list.join(', ')}`)
process.exit(STRICT && failures.length ? 1 : 0)

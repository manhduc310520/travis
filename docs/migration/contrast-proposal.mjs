/**
 * Temporary: builds the tier-1 contrast fix (resting colours only) on a copy
 * of the export and measures every pair before/after, for all 5 brands × 2
 * modes. Steps are picked as the FIRST Global step (from the current one,
 * going darker in Light / lighter in Dark) that reaches the target ratio, so
 * each change is the smallest one that passes. Writes contrast-proposal.json.
 * Delete in phase 5.
 *
 * Run: node docs/migration/contrast-proposal.mjs
 */
import fs from 'node:fs'
import { loadExport, indexTokens, resolveToken } from '../../scripts/tokens-lib.mjs'

const BRANDS = ['blue', 'green', 'yellow', 'magenta', 'orange']
const MODES = ['light', 'dark']
const base = loadExport()
const baseIdx = indexTokens(base)

const parse = (hex) => { const h = hex.replace('#', ''); const n = (i) => parseInt(h.slice(i, i + 2), 16); return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 } }
const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 })
const lum = ({ r, g, b }) => { const c = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b) }
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100 }
const toHex = ({ r, g, b }) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

const ctxOf = (brand, mode) => ({ brand, mode, density: 'default' })
const hexOf = (idx, name, ctx) => resolveToken(idx, name, ctx)
const container = (mode) => parse(hexOf(baseIdx, 'color/background/container', ctxOf('blue', mode)))
const globalHex = (mode, hue, step) => parse(hexOf(baseIdx, `global/${mode}/${hue}/${step}`, {}))

/** First step from `from` upward whose colour passes `test`. Global steps get darker in Light and lighter in Dark as they rise. */
const firstPassing = (mode, hue, from, test) => { for (let s = from; s <= 10; s++) if (test(globalHex(mode, hue, s))) return s; throw new Error(`no ${mode} ${hue} step passes`) }
const textOn = (mode) => (c) => ratio(c, container(mode)) >= 4.5
const whiteOn = (c) => ratio(parse('#ffffff'), c) >= 4.5

// ---------- new brand tokens (Figma names) ----------
const pick = {}
for (const hue of BRANDS) {
  pick[hue] = {
    'Brand/Light/Content-Accent': firstPassing('light', hue, 6, textOn('light')),
    'Brand/Dark/Content-Accent': firstPassing('dark', hue, 6, textOn('dark')),
    'Brand/Light/Solid-Accent': firstPassing('light', hue, 8, whiteOn),
  }
}
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const brandVars = {}
for (const name of ['Brand/Light/Content-Accent', 'Brand/Dark/Content-Accent', 'Brand/Light/Solid-Accent']) {
  const mode = name.split('/')[1].toLowerCase()
  brandVars[name] = BRANDS.map((h) => `@Global/${cap(mode)}/${cap(h)}/${pick[h][name]}`)
}

// ---------- semantic edits: [Figma name, mode, new alias] ----------
const semStep = (mode, hue, from, test) => `@Global/${cap(mode)}/${cap(hue)}/${firstPassing(mode, hue, from, test)}`
const EDITS = [
  ['Color/Content/Accent', 'light', '@Brand/Light/Content-Accent'],
  ['Color/Content/Accent', 'dark', '@Brand/Dark/Content-Accent'],
  ['Color/Solid/Accent', 'light', '@Brand/Light/Solid-Accent'],
  ['Color/Content/Link', 'light', '@Color/Content/Info'],
  ['Color/Content/Link', 'dark', '@Color/Content/Info'],
  ['Color/Content/Description', 'light', '@Color/Content/Neutral'],
  ['Color/Content/Success', 'light', semStep('light', 'green', 6, textOn('light'))],
  ['Color/Content/Warning', 'light', semStep('light', 'amber', 6, textOn('light'))],
  ['Color/Content/Danger', 'light', semStep('light', 'red', 5, textOn('light'))],
  // Dark danger text must also pass on Color/Background/Danger-Faded (Alert, Tag): Red/7 gave 4.4 there.
  ['Color/Content/Danger', 'dark', semStep('dark', 'red', 6, (c) => textOn('dark')(c) && ratio(c, parse(hexOf(baseIdx, 'color/background/danger-faded', ctxOf('blue', 'dark')))) >= 4.5)],
  ['Color/Solid/Danger', 'dark', semStep('dark', 'red', 6, whiteOn)],
]

// ---------- apply to a copy of the export ----------
const next = structuredClone(base)
next.brand.vars = { ...next.brand.vars, ...Object.fromEntries(Object.entries(brandVars).map(([n, v]) => [n, ['C', ...v]])) }
const before = {}
for (const [name, mode, value] of EDITS) {
  const v = next.colors.vars[name]
  if (!v) throw new Error(`unknown ${name}`)
  const i = 1 + next.colors.modes.indexOf(mode)
  before[`${name}|${mode}`] = v[i]
  v[i] = value
}
const nextIdx = indexTokens(next)

// ---------- measure ----------
const PAIRS = [
  ['Chữ chính', 'color/content/neutral-strong', 'color/background/container', 4.5],
  ['Chữ phụ', 'color/content/neutral', 'color/background/container', 4.5],
  ['Chữ mô tả', 'color/content/description', 'color/background/container', 4.5],
  ['Link', 'color/content/link', 'color/background/container', 4.5],
  ['Chữ accent', 'color/content/accent', 'color/background/container', 4.5],
  ['Chữ thành công', 'color/content/success', 'color/background/container', 4.5],
  ['Chữ cảnh báo', 'color/content/warning', 'color/background/container', 4.5],
  ['Chữ lỗi', 'color/content/danger', 'color/background/container', 4.5],
  ['Nút primary', 'color/content/on-solid', 'color/solid/accent', 4.5],
  ['Nút primary danger', 'color/content/on-solid', 'color/solid/danger', 4.5],
  ['Vòng focus (non-text)', 'color/solid/accent', 'color/background/container', 3],
]
function measure(idx, fg, bg, ctx) {
  const page = parse(resolveToken(idx, 'color/background/layout', ctx))
  const b = over(parse(resolveToken(idx, bg, ctx)), page)
  const f = over(parse(resolveToken(idx, fg, ctx)), b)
  return { ratio: ratio(f, b), fg: toHex(f), bg: toHex(b) }
}
const rows = []
let failBefore = 0, failAfter = 0
for (const [label, fg, bg, min] of PAIRS) for (const brand of BRANDS) for (const mode of MODES) {
  const ctx = ctxOf(brand, mode)
  const b = measure(baseIdx, fg, bg, ctx), a = measure(nextIdx, fg, bg, ctx)
  if (b.ratio < min) failBefore++
  if (a.ratio < min) failAfter++
  rows.push({ label, fg, bg, brand, mode, min, before: b, after: a })
}
const out = { pick, brandVars, edits: EDITS.map(([n, m, v]) => ({ name: n, mode: m, from: before[`${n}|${m}`], to: v })), rows }
fs.writeFileSync(new URL('./contrast-proposal.json', import.meta.url), JSON.stringify(out, null, 1) + '\n')
console.log('new brand tokens', JSON.stringify(brandVars, null, 1))
console.log('edits', JSON.stringify(out.edits, null, 1))
console.log(`pairs: ${rows.length}, below minimum before: ${failBefore}, after: ${failAfter}`)
for (const r of rows.filter((r) => r.after.ratio < r.min)) console.log(`  still failing: ${r.label} ${r.brand}.${r.mode} ${r.after.ratio}`)

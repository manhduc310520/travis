/**
 * Temporary migration check (delete in phase 5): every value the current
 * theme files ship must equal the fc token it maps to, for all 5 brands ×
 * 2 modes × 2 densities. Old key → fc name comes from fc-rename-map.json.
 *
 * Run: node docs/migration/verify-tokens.mjs
 */
import fs from 'node:fs'
import { loadExport, indexTokens, resolveToken } from '../../scripts/tokens-lib.mjs'
import { semanticFixed, semanticBrand } from '../../src/theme/semanticTokens.ts'
import { dimensionTokens, screenTokens, DENSITIES } from '../../src/theme/dimensionTokens.ts'
import { typographyTokens, fontWeightTokens } from '../../src/theme/typographyTokens.ts'

const byName = indexTokens(loadExport())
const map = JSON.parse(fs.readFileSync(new URL('./fc-rename-map.json', import.meta.url), 'utf8'))
const leaf = {}
for (const r of map) {
  if (r.new === 'XÓA' || r.collection === '1. Brand' || r.old.startsWith('Colors/Base/')) continue
  leaf[r.old.split('/').pop()] = r.new
}
// The rename map predates the 0. Global split: global/color/* now lives at color/palette/*.
const splitName = (n) => n.replace(/^global\/color\/(\w+)-(\d+)$/, 'color/palette/$1/$2').replace(/^global\/color\//, 'color/palette/')
for (const k in leaf) leaf[k] = splitName(leaf[k])

const rgba = (v) => {
  v = String(v).trim().toLowerCase()
  let m = v.match(/^rgba?\(([^)]+)\)$/)
  if (m) { const [r, g, b, a = 1] = m[1].split(',').map(Number); return [r, g, b, Math.round(a * 100) / 100] }
  m = v.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/)
  if (m) { const n = (i) => parseInt(m[1].slice(i, i + 2), 16); return [n(0), n(2), n(4), m[2] ? Math.round(parseInt(m[2], 16) / 255 * 100) / 100 : 1] }
  return null
}
const sameColor = (a, b) => { const x = rgba(a), y = rgba(b); return x && y && x.slice(0, 3).every((c, i) => Math.abs(c - y[i]) <= 1) && Math.abs(x[3] - y[3]) <= 0.01 }

const mismatches = [], unmapped = new Set()
let checks = 0
const check = (key, expected, ctx, compare) => {
  const fc = leaf[key]
  if (!fc) { unmapped.add(key); return }
  const actual = resolveToken(byName, fc, ctx)
  checks++
  if (!compare(expected, actual)) mismatches.push(`${Object.values(ctx).join('.')}  ${key} → ${fc}: code=${expected} figma=${actual}`)
}

const BRANDS = [...new Set(Object.keys(semanticBrand).map((k) => k.split('.')[0]))]
for (const brand of BRANDS) for (const mode of ['light', 'dark']) {
  const ctx = { brand, mode, density: 'default' }
  for (const [k, v] of Object.entries({ ...semanticFixed[mode], ...semanticBrand[`${brand}.${mode}`] })) check(k, v, ctx, sameColor)
}
const num = (a, b) => Math.abs(Number(a) - Number(b)) < 0.01
for (const density of DENSITIES) {
  const ctx = { brand: 'blue', mode: 'light', density }
  for (const [k, v] of Object.entries({ ...dimensionTokens[density], ...screenTokens })) check(k, v, ctx, num)
  const t = typographyTokens[density]
  for (const [k, v] of Object.entries(t)) {
    if (!k.startsWith('lineHeight')) { check(k, v, ctx, num); continue }
    const size = t[k.replace('lineHeight', 'fontSize')] // code stores line height as a ratio of its font size
    check(k, Math.round(v * size * 100) / 100, ctx, num)
  }
  for (const [k, v] of Object.entries(fontWeightTokens)) check(k, v, ctx, num)
}

console.log(`checks: ${checks}, mismatches: ${mismatches.length}, keys with no fc token: ${[...unmapped].join(', ') || 'none'}`)
for (const m of mismatches) console.log('  ✗ ' + m)
process.exit(mismatches.length ? 1 : 0)

/**
 * Builds the fc token outputs from `tokens/figma-export.json`:
 *
 *   tokens/fc.tokens.json   DTCG-format tokens (default mode in `$value`,
 *                           every mode under `$extensions.fc.modes`)
 *   src/fc/tokens.css       `--fc-*` custom properties, aliases kept as var()
 *   src/fc/tokens.meta.ts   every token name + type, for docs and typed APIs
 *
 * Run: npm run build:tokens
 */
import fs from 'node:fs'
import { AXIS, ATTR, THEMED_SINGLE_MODE, THEMED_SELECTOR, loadExport, indexTokens, cssVarName, parseRef, isFontWeight, cssValue, resolveToken } from './tokens-lib.mjs'

const exp = loadExport()
const byName = indexTokens(exp)

// Fail early on dangling aliases — a rename in Figma that missed a reference.
for (const [name, t] of byName) {
  for (const v of t.values) {
    const ref = parseRef(v)
    if (ref && !byName.has(ref.name)) throw new Error(`"${name}" aliases missing token "${ref.name}"`)
  }
}

// ---------- DTCG ----------
const dtcgType = (name, t) =>
  t.type === 'C' ? 'color' : t.type === 'E' ? 'shadow' : t.type === 'S' ? 'fontFamily' : isFontWeight(name) ? 'fontWeight' : 'dimension'

// "0px 6px 16px 0px rgba(0, 0, 0, 0.08), …" → DTCG shadow objects.
const dtcgShadow = (css) => css.split(/,(?![^(]*\))/).map((layer) => {
  const inset = /\binset\b/.test(layer)
  const color = layer.match(/rgba?\([^)]*\)/)[0]
  const [offsetX, offsetY, blur, spread] = layer.replace(color, '').replace('inset', '').trim().split(/\s+/)
  return { color, offsetX, offsetY, blur, spread, ...(inset ? { inset } : {}) }
})

function dtcgValue(name, raw) {
  const ref = parseRef(raw)
  if (ref) return `{${ref.name.replaceAll('/', '.')}}`
  if (typeof raw === 'string' && name.startsWith('shadow/')) return dtcgShadow(raw)
  if (typeof raw === 'number') return isFontWeight(name) ? raw : `${Math.round(raw * 1000) / 1000}px`
  return raw
}

const dtcg = {}
for (const [name, t] of [...byName].sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))) {
  const path = name.split('/')
  let node = dtcg
  for (const seg of path.slice(0, -1)) node = node[seg] ??= {}
  const modes = Object.fromEntries(t.modes.map((m, i) => [m, dtcgValue(name, t.values[i])]))
  const ext = { collection: t.collection, axis: AXIS[t.collection], modes }
  const ref = parseRef(t.values[0])
  if (ref?.alpha != null) ext.alpha = ref.alpha
  node[path.at(-1)] = { $type: dtcgType(name, t), $value: dtcgValue(name, t.values[0]), $extensions: { fc: ext } }
}
fs.writeFileSync(new URL('../tokens/fc.tokens.json', import.meta.url), JSON.stringify(dtcg, null, 2) + '\n')

// ---------- CSS ----------
// Single-mode primitives (`global`) go on :root; component tokens (single mode,
// but var() chains into themed tokens) go on every themed element; for the other
// collections, values identical in every mode go in one block per axis, the rest per mode.
const blocks = new Map() // selector → [name, css][]
const push = (sel, name, css) => { if (!blocks.has(sel)) blocks.set(sel, []); blocks.get(sel).push([name, css]) }
for (const [name, t] of byName) {
  const axis = AXIS[t.collection]
  const css = t.values.map((v) => cssValue(name, v))
  if (THEMED_SINGLE_MODE.has(t.collection)) { push(THEMED_SELECTOR, name, css[0]); continue }
  if (!axis) { push(':root', name, css[0]); continue }
  const attr = ATTR[axis]
  if (css.every((c) => c === css[0])) push(`[${attr}]`, name, css[0])
  else t.modes.forEach((m, i) => push(`[${attr}="${m}"]`, name, css[i]))
}
const order = (sel) => sel === THEMED_SELECTOR ? 100 : Object.values(ATTR).findIndex((a) => sel.includes(a)) * 10 + (sel.includes('=') ? 1 : 0)
const cssOut = [
  '/* GENERATED FILE — do not edit by hand. Source: tokens/figma-export.json. Regenerate with `npm run build:tokens`. */',
  '/* data-brand, data-mode and data-density must sit on the SAME element: aliases are var() chains resolved there. */',
]
for (const sel of [...blocks.keys()].sort((a, b) => order(a) - order(b) || a.localeCompare(b))) {
  const lines = blocks.get(sel).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
  cssOut.push('', `${sel} {`, ...lines.map(([n, c]) => `  ${cssVarName(n)}: ${c};`), '}')
}
fs.mkdirSync(new URL('../src/fc/', import.meta.url), { recursive: true })
fs.writeFileSync(new URL('../src/fc/tokens.css', import.meta.url), cssOut.join('\n') + '\n')

// ---------- token list for code (docs pages, typed names) ----------
const metaType = (name, t) =>
  t.type === 'C' ? 'color' : t.type === 'E' ? 'shadow' : t.type === 'S' ? 'fontFamily' : isFontWeight(name) ? 'fontWeight' : 'dimension'
const metaRows = [...byName]
  .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
  .map(([name, t]) => `  { name: '${name}', type: '${metaType(name, t)}', collection: '${t.collection}' },`)
fs.writeFileSync(
  new URL('../src/fc/tokens.meta.ts', import.meta.url),
  [
    '// GENERATED FILE — do not edit by hand. Source: tokens/figma-export.json. Regenerate with `npm run build:tokens`.',
    '',
    `export type FcTokenType = 'color' | 'dimension' | 'fontFamily' | 'fontWeight' | 'shadow'`,
    '',
    'export const FC_TOKENS = [',
    ...metaRows,
    '] as const',
    '',
    `export type FcTokenName = (typeof FC_TOKENS)[number]['name']`,
    '',
    '/** CSS custom property for a token name: `color/content/neutral` → `--fc-color-content-neutral`. */',
    "export const fcVar = (name: FcTokenName) => `--fc-${name.replaceAll('/', '-')}`",
    '',
  ].join('\n'),
)

// ---------- guard: media queries must use breakpoint tokens ----------
// CSS can't read var() inside @media, so components write breakpoint px out.
// Fail the build if any of them drifts from the Figma breakpoint tokens.
const breakpoints = new Set(
  [...byName].filter(([n]) => n.startsWith('breakpoint/')).map(([n]) => Number(resolveToken(byName, n, { density: 'default' }))),
)
const cssFiles = fs.readdirSync(new URL('../src/fc/', import.meta.url), { recursive: true }).filter((f) => String(f).endsWith('.module.css'))
const drift = []
for (const f of cssFiles) {
  const text = fs.readFileSync(new URL(`../src/fc/${String(f).replaceAll('\\', '/')}`, import.meta.url), 'utf8')
  for (const m of text.matchAll(/@media[^{]*?(?:min|max)-width:\s*(\d+)px/g)) {
    if (!breakpoints.has(Number(m[1]))) drift.push(`${f}: ${m[1]}px`)
  }
}
if (drift.length) throw new Error(`Media queries off the breakpoint tokens (${[...breakpoints].join(', ')}):\n  ${drift.join('\n  ')}`)

// ---------- guard: code may only reference tokens that exist ----------
// A token renamed or deleted in Figma must not leave a dangling var() behind.
const defined = new Set([...byName.keys()].map(cssVarName))
const codeFiles = fs.readdirSync(new URL('../src/fc/', import.meta.url), { recursive: true })
  .map((f) => String(f).replaceAll('\\', '/'))
  .filter((f) => /\.(tsx?|css|mdx)$/.test(f) && f !== 'tokens.css')
const dangling = []
for (const f of codeFiles) {
  const text = fs.readFileSync(new URL(`../src/fc/${f}`, import.meta.url), 'utf8')
  // Skips template prefixes like `var(--fc-space-margin-${step})`.
  for (const [, name] of text.matchAll(/(--fc-[a-z0-9-]*[a-z0-9])(?![a-z0-9-]|\$\{)/g)) {
    if (!defined.has(name)) dangling.push(`${f}: ${name}`)
  }
}
if (dangling.length) throw new Error(`Code references fc tokens that do not exist:\n  ${[...new Set(dangling)].join('\n  ')}`)

const perCollection = {}
for (const t of byName.values()) perCollection[t.collection] = (perCollection[t.collection] || 0) + 1
console.log(`tokens: ${byName.size}`, perCollection)
console.log(`wrote tokens/fc.tokens.json and src/fc/tokens.css (${blocks.size} selector blocks)`)

/**
 * Shared helpers for the fc token pipeline: read `tokens/figma-export.json`,
 * resolve aliases for a given brand / mode / density, and name CSS variables.
 * Used by `build-tokens.mjs`; no second copy of this logic should exist.
 */
import fs from 'node:fs'

/**
 * Which theme axis each exported collection varies on. `global` and `components`
 * have one mode: they never vary themselves, but component tokens alias tokens
 * that do (see THEMED_SINGLE_MODE).
 */
export const AXIS = { global: null, brand: 'brand', colors: 'mode', dimensions: 'density', typography: 'density', components: null, effects: null }

/**
 * Single-mode collections whose values are var() chains into themed tokens.
 * They must be declared on every themed element, not on :root, so the chain
 * resolves against that element's brand / mode / density (e.g. a nested
 * `data-mode="dark"` region).
 */
export const THEMED_SINGLE_MODE = new Set(['components'])
export const THEMED_SELECTOR = '[data-brand], [data-mode], [data-density]'

/** CSS attribute that selects each axis on the themed element. */
export const ATTR = { brand: 'data-brand', mode: 'data-mode', density: 'data-density' }

export function loadExport(url = new URL('../tokens/figma-export.json', import.meta.url)) {
  return JSON.parse(fs.readFileSync(url, 'utf8'))
}

/**
 * Figma shows names in Title Case (`Color/Content/Neutral-Strong`); code uses
 * the same path in lowercase (`color/content/neutral-strong`), which is also
 * what each variable's Code syntax carries. Every name is normalised here.
 */
const codeName = (figmaName) => figmaName.toLowerCase()

/** name → { collection, type, modes, values } across every collection. */
export function indexTokens(exp) {
  const byName = new Map()
  for (const [collection, c] of Object.entries(exp)) {
    if (collection.startsWith('_')) continue
    for (const [name, [type, ...values]] of Object.entries(c.vars)) {
      if (byName.has(codeName(name))) throw new Error(`"${name}" differs from another token only by case`)
      byName.set(codeName(name), { collection, type, modes: c.modes, values })
    }
  }
  return byName
}

export const cssVarName = (name) => `--fc-${name.replaceAll('/', '-')}`

/** "@name" → { name, alpha: null }, "@name|10" → { name, alpha: 0.1 }, anything else → null. */
export function parseRef(value) {
  if (typeof value !== 'string' || !value.startsWith('@')) return null
  const [name, alpha] = value.slice(1).split('|')
  return { name: codeName(name), alpha: alpha === undefined ? null : Number(alpha) / 100 }
}

export const isFontWeight = (name) => name.startsWith('typography/weight/')

function parseHex(hex) {
  const h = hex.replace('#', '')
  const n = (i) => parseInt(h.slice(i, i + 2), 16)
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 }
}

function toHex({ r, g, b, a }) {
  const x = (v) => Math.round(v).toString(16).padStart(2, '0')
  return '#' + x(r) + x(g) + x(b) + (a < 1 ? x(a * 255) : '')
}

/** Final value of a token for one theme context, aliases and opacity applied. */
export function resolveToken(byName, name, ctx, seen = []) {
  const token = byName.get(name)
  if (!token) throw new Error(`Unknown token "${name}"${seen.length ? ` (via ${seen.join(' → ')})` : ''}`)
  if (seen.includes(name)) throw new Error(`Alias cycle: ${[...seen, name].join(' → ')}`)
  const axis = AXIS[token.collection]
  const mode = axis ? ctx[axis] : token.modes[0]
  const i = token.modes.indexOf(mode)
  if (i < 0) throw new Error(`Token "${name}" has no mode "${mode}"`)
  const ref = parseRef(token.values[i])
  if (!ref) return token.values[i]
  const target = resolveToken(byName, ref.name, ctx, [...seen, name])
  if (ref.alpha === null) return target
  const c = parseHex(target)
  return toHex({ ...c, a: c.a * ref.alpha })
}

/** A raw (per-mode) export value written as CSS, keeping aliases as var() chains. */
export function cssValue(name, raw) {
  const ref = parseRef(raw)
  if (ref) {
    const v = `var(${cssVarName(ref.name)})`
    return ref.alpha === null ? v : `color-mix(in srgb, ${v} ${Math.round(ref.alpha * 100)}%, transparent)`
  }
  if (typeof raw === 'number') {
    const n = Math.round(raw * 1000) / 1000
    return isFontWeight(name) ? String(n) : `${n}px`
  }
  if (typeof raw === 'string' && name.startsWith('shadow/')) return raw // box-shadow list
  if (typeof raw === 'string' && !raw.startsWith('#')) return JSON.stringify(raw) // font family
  return raw
}

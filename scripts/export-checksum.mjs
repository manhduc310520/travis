/**
 * FNV-1a hash of every export slice, rebuilt from `tokens/figma-export.json`
 * exactly as `scripts/figma-export.js` returns it. Run figma-export.js with
 * `SLICE = 'checksum'` through `use_figma` and compare the two lists: equal
 * hashes mean the local export matches Figma, without copying the JSON out.
 *
 * Run: node scripts/export-checksum.mjs [path/to/figma-export.json]
 */
import fs from 'node:fs'

const file = process.argv[2] || 'tokens/figma-export.json'
const data = JSON.parse(fs.readFileSync(file, 'utf8'))

const isPalette = (name) => name.toLowerCase().startsWith('color/palette/')
const pick = (entry, keep) => ({ modes: entry.modes, vars: Object.fromEntries(Object.entries(entry.vars).filter(([name]) => keep(name))) })

// Same objects as figma-export.js builds per slice.
const SLICES = {
  global: { global: data.global },
  palette: { colors: pick(data.colors, isPalette) },
  semantic: { colors: pick(data.colors, (name) => !isPalette(name)) },
  rest: { brand: data.brand, dimensions: data.dimensions, typography: data.typography },
  component: { components: data.components },
  effects: { effects: data.effects },
}

// Figma does not return collections or variables in a stable order, so hash a key-sorted copy.
// FNV-1a 32-bit over UTF-16 code units; keep identical to figma-export.js.
const canon = (x) => Array.isArray(x) ? x.map(canon) : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, canon(x[k])])) : x
const fnv = (s) => {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}

const sums = Object.fromEntries(Object.entries(SLICES).map(([name, slice]) => [name, fnv(JSON.stringify(canon(slice)))]))
console.log(JSON.stringify(sums))

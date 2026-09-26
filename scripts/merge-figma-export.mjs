/**
 * Merges the slice outputs of `scripts/figma-export.js` into
 * `tokens/figma-export.json`. Slices can share a collection (palette and
 * semantic are both `colors`), so their vars are unioned, never overwritten.
 *
 * Run: node scripts/merge-figma-export.mjs global.json palette.json semantic.json rest.json component.json effects.json
 */
import fs from 'node:fs'

const files = process.argv.slice(2)
if (!files.length) throw new Error('Usage: node scripts/merge-figma-export.mjs <slice.json>...')

const merged = {}
for (const file of files) {
  for (const [key, c] of Object.entries(JSON.parse(fs.readFileSync(file, 'utf8')))) {
    const prev = merged[key]
    if (prev && prev.modes.join() !== c.modes.join()) throw new Error(`${file}: "${key}" modes [${c.modes}] differ from [${prev.modes}]`)
    for (const name of Object.keys(c.vars)) if (prev?.vars[name]) throw new Error(`${file}: "${name}" exported twice`)
    merged[key] = { modes: c.modes, vars: { ...prev?.vars, ...c.vars } }
  }
}

const ORDER = ['global', 'brand', 'colors', 'dimensions', 'typography', 'components', 'effects']
const missing = ORDER.filter((k) => !merged[k])
if (missing.length) throw new Error(`Missing collections: ${missing.join(', ')} — run every slice`)

const out = {
  _source: `Figma hneVCBNUiPizVorg7Jp18G, collections 0-5 (5: Component/* only) + Shadow/* effect styles. Exported ${new Date().toISOString().slice(0, 10)} via scripts/figma-export.js. Do not edit by hand: re-export from Figma.`,
  ...Object.fromEntries(ORDER.map((k) => [k, merged[k]])),
}
fs.writeFileSync(new URL('../tokens/figma-export.json', import.meta.url), JSON.stringify(out, null, 2) + '\n')
console.log(Object.fromEntries(ORDER.map((k) => [k, Object.keys(merged[k].vars).length])))

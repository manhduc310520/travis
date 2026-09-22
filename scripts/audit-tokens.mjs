/**
 * Check every exported component token against Ant Design's own style code.
 *
 * Typings use `extends`, so reading interfaces alone produces false alarms.
 * Grepping the compiled style modules is exact: if the identifier never appears
 * there, Ant Design never reads it and the Figma value silently does nothing.
 *
 * Run: node scripts/audit-tokens.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('node_modules/antd/es')

/**
 * Where each component's style actually lives. Several components reuse
 * another's style module, so their tokens must be looked up there.
 */
const STYLE_DIRS = {
  AutoComplete: ['select', 'auto-complete'],
  ColorPicker: ['color-picker'],
  DatePicker: ['date-picker', 'input'],
  FloatButton: ['float-button'],
  InputNumber: ['input-number', 'input'],
  TimePicker: ['date-picker', 'input'],
  TreeSelect: ['tree-select', 'select', 'tree'],
  Layout: ['layout'],
  Card: ['card'],
}

const dirsFor = (name) => STYLE_DIRS[name] ?? [name.toLowerCase()]

const cache = new Map()
function styleSource(dirs) {
  const key = dirs.join('|')
  if (cache.has(key)) return cache.get(key)
  let src = ''
  for (const dir of dirs) {
    const base = path.join(ROOT, dir, 'style')
    if (!fs.existsSync(base)) continue
    const walk = (p) => {
      for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
        const full = path.join(p, entry.name)
        if (entry.isDirectory()) walk(full)
        else if (entry.name.endsWith('.js')) src += fs.readFileSync(full, 'utf8')
      }
    }
    walk(base)
  }
  cache.set(key, src)
  return src
}

const src = fs.readFileSync('src/theme/componentTokens.ts', 'utf8')
const body = src.slice(src.indexOf('export const componentTokens'), src.indexOf('} as const'))

const exported = {}
let current = null
for (const line of body.split('\n')) {
  const open = line.match(/^\s{2}(\w+):\s*\{/)
  if (open) {
    current = open[1]
    exported[current] = exported[current] ?? []
  }
  if (!current) continue
  for (const m of line.matchAll(/(\w+):\s*('[^']*'|[\d./\s*-]+)(?=,|\s*\}|$)/g)) {
    if (m[1] === current) continue
    exported[current].push({ key: m[1], raw: m[2].trim() })
  }
  if (/^\s{2}\},?\s*$/.test(line)) current = null
}

const dead = []
const ratioRisk = []
let checked = 0

for (const [comp, tokens] of Object.entries(exported)) {
  const source = styleSource(dirsFor(comp))
  if (!source) {
    dead.push(`${comp}.* — no style module found`)
    continue
  }
  for (const { key, raw } of tokens) {
    checked++
    const used = new RegExp('\\b' + key + '\\b').test(source)
    if (!used) {
      dead.push(`${comp}.${key} = ${raw}`)
      continue
    }
    // A token Ant Design feeds straight into `lineHeight:` is a ratio, so a
    // px-sized number multiplies the font size instead of setting a height.
    const value = Number(eval(raw.startsWith("'") ? '0' : raw))
    if (/lineHeight/i.test(key) && value > 5) {
      const usedAsRatio = new RegExp('lineHeight:\\s*(token\\.)?' + key).test(source)
      if (usedAsRatio) ratioRisk.push(`${comp}.${key} = ${raw} — fed into \`lineHeight\`, expects a ratio`)
    }
  }
}

console.log(`checked ${checked} tokens across ${Object.keys(exported).length} components\n`)
console.log(`never read by Ant Design (${dead.length}):`)
dead.length ? dead.forEach((d) => console.log('  ' + d)) : console.log('  none')
console.log(`\nunit risk (${ratioRisk.length}):`)
ratioRisk.length ? ratioRisk.forEach((d) => console.log('  ' + d)) : console.log('  none')

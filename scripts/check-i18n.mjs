// Check Vietnamese translations against their English sources.
// Usage: node scripts/check-i18n.mjs [key ...]   e.g. components/button pages/colors
// Reports per file: missing keys, extra keys, and structural damage (code fences,
// inline code spans, links, table rows, headings) that would break the rendered docs. Headings and
// table header rows show in Vietnamese in VN mode (scripts/i18n.mjs localizeHeadings matches them by
// position), so their count must match. For information: headings that still read as English prose, and
// prose left identical to the English (after brand cleanup, as the pages show it).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { labelLines, localizeHeadings } from './i18n.mjs'
import { containers, debrand } from './convert.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const EN = path.join(ROOT, 'i18n/en')
const VI = path.join(ROOT, 'i18n/vi')

const list = (dir) => fs.readdirSync(dir, { recursive: true }).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\\/g, '/').replace(/\.json$/, ''))
const keys = process.argv.slice(2).length ? process.argv.slice(2) : list(EN)

const count = (s, re) => (s.match(re) || []).length
const inlineCode = (s) => (s.replace(/```[\s\S]*?```/g, '').match(/`[^`\n]+`/g) || []).sort()
const fences = (s) => (s.match(/```[\s\S]*?```/g) || [])
const urls = (s) => (s.match(/\]\(([^)]+)\)/g) || []).sort()

// Vietnamese headings still equal to the English one that read as prose (two plain lowercase words;
// API names such as `message.config` or `DatePicker[picker=year]` are not words)
const englishHeadings = []
const plainWords = (l) => l.replace(/`[^`]*`/g, '').split(/\s+/).filter((w) => /^[a-z]{3,}[,?.]?$/.test(w)).length
function stillEnglish(key, en, vi) {
  const enLines = new Set(en.split('\n'))
  const viLines = vi.split('\n')
  return labelLines(vi).map((i) => viLines[i])
    .filter((l) => /^#{1,6} /.test(l) && enLines.has(l) && plainWords(l) >= 2)
    .map((l) => `${key}: ${l}`)
}

// Vietnamese prose left identical to the English source as the pages show it, outside code: lines, and the
// Description cell of table rows. Information only (a line can be a name or code-like text), but an English
// sentence here shows in English in VN mode.
const sameAsEnglish = []
const proseWords = (l) => l.replace(/`[^`]*`/g, '').replace(/\]\([^)]*\)/g, ']').replace(/https?:\/\/\S+/g, '')
  .split(/[\s|]+/).filter((w) => /^[A-Za-z][a-z]{2,}[,.:;?!)]*$/.test(w)).length
const rowCells = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.trim())
function identical(key, en, vi) {
  const enLines = new Set(en.split('\n'))
  const enRows = en.split('\n').filter((l) => /^\s*\|/.test(l))
  const viRows = vi.split('\n').filter((l) => /^\s*\|/.test(l))
  let fence = false
  for (const line of vi.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; continue }
    if (fence || /^\s*\||^#{1,6} /.test(line)) continue
    if (enLines.has(line) && proseWords(line) >= 2) sameAsEnglish.push(`${key}: ${line.trim().slice(0, 120)}`)
  }
  if (enRows.length !== viRows.length) return
  enRows.forEach((row, i) => {
    const a = rowCells(row)[1]
    const b = rowCells(viRows[i])[1]
    if (a && a === b && proseWords(a) >= 2 && !/^:?-{3,}/.test(a) && !/^\s*\|?\s*:?-{3,}/.test(enRows[i + 1] ?? '')) sameAsEnglish.push(`${key} (cell): ${a.slice(0, 120)}`)
  })
}

let bad = 0
let done = 0
for (const key of keys) {
  const en = JSON.parse(fs.readFileSync(path.join(EN, key + '.json'), 'utf8'))
  const viFile = path.join(VI, key + '.json')
  if (!fs.existsSync(viFile)) { console.log(`-- ${key}: not translated yet`); continue }
  let vi
  try { vi = JSON.parse(fs.readFileSync(viFile, 'utf8')) } catch (e) { console.log(`XX ${key}: invalid JSON (${e.message})`); bad++; continue }
  const problems = []
  for (const h of Object.keys(en)) {
    if (!(h in vi)) { problems.push(`missing ${h}`); continue }
    const a = en[h]
    const b = vi[h]
    if (fences(a).join('\n') !== fences(b).join('\n')) problems.push(`${h}: code blocks changed`)
    if (inlineCode(a).join('|') !== inlineCode(b).join('|')) problems.push(`${h}: inline code changed`)
    if (urls(a).join('|') !== urls(b).join('|')) problems.push(`${h}: links changed`)
    if (count(a, /^\|/gm) !== count(b, /^\|/gm)) problems.push(`${h}: table rows ${count(a, /^\|/gm)} -> ${count(b, /^\|/gm)}`)
    if (labelLines(a).length !== labelLines(b).length) problems.push(`${h}: headings / table header rows ${labelLines(a).length} -> ${labelLines(b).length}`)
    else englishHeadings.push(...stillEnglish(key, a, localizeHeadings(a, b)))
    // as the pages show them: after brand cleanup (dropped lines and sections do not count)
    identical(key, debrand(containers(a, 'en'), 'en'), debrand(containers(localizeHeadings(a, b), 'vi'), 'vi'))
  }
  // keys no longer in the English source are harmless leftovers (e.g. titles that stay English)
  if (problems.length) { bad++; console.log(`XX ${key}: ${problems.length} problem(s)\n   ` + problems.slice(0, 12).join('\n   ')) }
  else { done++; console.log(`ok ${key} (${Object.keys(en).length})`) }
}
if (englishHeadings.length) console.log(`\nHeadings still in English in VN (information; technical names may stay):\n   ${englishHeadings.join('\n   ')}`)
if (sameAsEnglish.length) console.log(`\nProse identical to the English in VN (information; names and code-like text may stay):\n   ${sameAsEnglish.join('\n   ')}`)
console.log(`\n${done} ok, ${bad} with problems, ${keys.length - done - bad} not translated`)
process.exitCode = bad ? 1 : 0

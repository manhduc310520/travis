// Translation layer for the generated docs.
//
// Every run writes the English source strings of a page to i18n/en/<key>.json as
// { "<hash>": "<English>" }. Translators (people or agents) create i18n/vi/<key>.json with
// the same keys and the Vietnamese text. The generated pages carry both languages (Language
// toolbar): English is the source text, Vietnamese is the translation where it exists, else the
// English, so a page can be translated bit by bit and a changed English string simply shows
// English again until it is re-translated.
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12)

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return {} }
}

function writeIfChanged(file, text) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === text) return
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, text)
}

// ---- Headings and table header rows (user decision 2026-10-01: no mixed languages) ----
// The docs render in English or Vietnamese (Language toolbar). Vietnamese headings and table header cells
// come from the translation, except the ones below: one wording everywhere, also where a translator kept the
// English. Technical names stay as they are in both languages (API, Semantic DOM, Design Token, Seed / Map /
// Alias Token, Props, Ref, Render Props, Content Security Policy) and so do component, prop and token names.
export const HEADING_GLOSSARY = {
  'When To Use': 'Khi nào dùng',
  'When to use': 'Khi nào dùng',
  'How To Use': 'Cách dùng',
  'How to use': 'Cách dùng',
  Examples: 'Ví dụ',
  FAQ: 'Câu hỏi thường gặp',
  Methods: 'Phương thức',
  'Common Methods': 'Phương thức chung',
  'Common API': 'API chung',
  'common API': 'API chung',
  Note: 'Lưu ý',
  Notes: 'Lưu ý',
  Warning: 'Cảnh báo',
  Color: 'Màu sắc',
  Size: 'Kích thước',
  'Use with browserHistory': 'Dùng với browserHistory',
  'Difference from other data fetching methods': 'Khác biệt so với các cách lấy dữ liệu khác',
  'Virtual scroll limitation': 'Giới hạn của cuộn ảo',
  'Zero Runtime': 'Chế độ Zero Runtime',
  'Theme editor': 'Trình chỉnh theme',
  'Timeline Items': 'Các mục của Timeline',
  'List grid props': 'Props grid của List',
  'Font Family': 'Họ font',
  'Base Font Size': 'Cỡ chữ gốc',
  'Font Weight': 'Độ đậm',
  'Font Color': 'Màu chữ',
  'Font Scale & Line Height': 'Thang cỡ chữ và chiều cao dòng',
  Localization: 'Bản địa hoá',
  // sections the docs drop (convert.mjs DROP_SECTIONS): fixed here so they are found in the Vietnamese text
  Promotion: 'Quảng bá',
  'Design Guide': 'Hướng dẫn thiết kế',
  'Programmatic Usage': 'Dùng bằng code',
  'Custom Font Icon': 'Icon font tuỳ chỉnh',
}
// "<Component> props / Methods / ref / Hooks" headings
const HEADING_PATTERNS = [
  [/^([A-Z][\w.]*) [Pp]rops$/, 'Props của $1'],
  [/^([A-Z][\w.]*) Methods$/, 'Phương thức của $1'],
  [/^([A-Z][\w.]*) ref$/, 'Ref của $1'],
  [/^([A-Z][\w.]*) Hooks$/, 'Hook của $1'],
]
export const TABLE_HEAD_GLOSSARY = {
  Property: 'Thuộc tính',
  Description: 'Mô tả',
  Type: 'Kiểu',
  Default: 'Mặc định',
  'Default Value': 'Mặc định',
  'Default value': 'Mặc định',
  Version: 'Phiên bản',
  Name: 'Tên',
  Readonly: 'Chỉ đọc',
  Parameters: 'Tham số',
  Shape: 'Dạng',
  'Global Config': 'Cấu hình chung',
}

/** The Vietnamese heading for an English one, when the glossary fixes it ('' otherwise). */
export function glossaryHeading(text) {
  if (HEADING_GLOSSARY[text]) return HEADING_GLOSSARY[text]
  for (const [re, to] of HEADING_PATTERNS) if (re.test(text)) return text.replace(re, to)
  return ''
}

/** Indexes of heading lines and table header rows (the row above a |---| separator), outside code. */
export function labelLines(s) {
  let fence = false
  const lines = s.split('\n')
  return lines.map((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence
    const tableHead = /^\s*\|/.test(line) && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] ?? '')
    return !fence && (/^#{1,6} /.test(line) || tableHead) ? i : -1
  }).filter((i) => i >= 0)
}

const cells = (row) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.trim())

/** One table header cell: glossary (also a linked label, "[Global Config](…)"), else the translated cell. */
function headCell(en, vi) {
  if (TABLE_HEAD_GLOSSARY[en]) return TABLE_HEAD_GLOSSARY[en]
  const link = en.match(/^\[([^\]]+)\](\(.*\))$/)
  if (link && TABLE_HEAD_GLOSSARY[link[1]]) return `[${TABLE_HEAD_GLOSSARY[link[1]]}]${link[2]}`
  return vi ?? en
}

/**
 * Vietnamese headings and table header rows: the glossary wording where it has one, else the translation.
 * Lines are matched by position (same count in both, as check-i18n keeps them); otherwise the translation
 * is used as is.
 */
export function localizeHeadings(en, vi) {
  const enLines = en.split('\n')
  const viLines = vi.split('\n')
  const a = labelLines(en)
  const b = labelLines(vi)
  if (!a.length || a.length !== b.length) return vi
  b.forEach((line, k) => {
    const src = enLines[a[k]]
    const level = src.match(/^#{1,6} /)
    if (level) {
      const g = glossaryHeading(src.slice(level[0].length).trim())
      if (g) viLines[line] = (viLines[line].match(/^#{1,6} /)?.[0] ?? level[0]) + g
      return
    }
    const ec = cells(src)
    const vc = cells(viLines[line])
    viLines[line] = '| ' + ec.map((c, j) => headCell(c, vc.length === ec.length ? vc[j] : undefined)).join(' | ') + ' |'
  })
  return viLines.join('\n')
}

/** A catalog for one page, e.g. createCatalog('components/button') or createCatalog('pages/colors'). */
export function createCatalog(key) {
  const translated = readJson(path.join(ROOT, 'i18n', 'vi', `${key}.json`))
  const source = {}
  let hits = 0
  let total = 0
  return {
    /** Vietnamese for one English string (markdown allowed); records it as a source string. */
    t(text) {
      if (!text || !text.trim()) return text
      const h = hash(text)
      source[h] = text
      total++
      if (translated[h]) { hits++; return localizeHeadings(text, translated[h]) }
      return text
    },
    /** Write the English source file; returns [translated, total]. */
    save() {
      writeIfChanged(path.join(ROOT, 'i18n', 'en', `${key}.json`), JSON.stringify(source, null, 1) + '\n')
      return [hits, total]
    },
  }
}

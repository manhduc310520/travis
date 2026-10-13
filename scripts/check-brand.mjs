// Brand check in the terminal (replaces the old Storybook "Review" pages, removed 2026-10-01):
// - Ant brand names or links to Ant sites still shown in the docs text, in both docs languages (VN and EN,
//   after translation + debrand, as the pages render them), in the hand-written MDX pages, in the widget
//   labels and token descriptions (as src/_dumi renders them), or in the text of the examples;
// - the same in the generated pages themselves (src/components/*/*.stories.tsx, src/design-tokens/*/*Page.tsx), so
//   stale output (scripts changed, pages not regenerated) shows up, and "antd" left in their prose;
// - examples that load data or images from outside servers.
// Names split over two lines ("… Ant" / "Design …" in JSX text) count too.
// Links are listed for information only. Exit code 1 when anything that should be gone is found.
// Usage: npm run check:brand
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { containers, debrand } from './convert.mjs'
import { createCatalog } from './i18n.mjs'
import { debrandEn, fabiPrefix } from '../src/_dumi/fabiText.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BRAND = /Ant\s+Design|Ant\s+Financial|Ant\s+Group|Alipay|AntV|(?<!FABi\s)Kitchen/g
const ANT_URL = /(?:https?:)?\/\/(?:[a-z0-9-]+\.)*(?:ant\.design|antgroup\.com|alipay\.com|antfin\.com|antv\.vision|alipayobjects\.com|alicdn\.com)\b|github\.com\/ant-design\b/gi
const EXT = /https?:\/\/[^\s'"`)<>]+/g

// One rendered text: brand names outside inline code, links to Ant sites outside code blocks.
function scanText(where, text, out) {
  let fence = false
  for (const line of text.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; continue }
    if (fence) continue
    const prose = line.replace(/`[^`]*`/g, '')
    const hits = [...(prose.match(BRAND) ?? []), ...(line.match(ANT_URL) ?? [])]
    if (hits.length) out.push(`${where}: ${[...new Set(hits)].join(', ')} — ${line.trim().slice(0, 160)}`)
  }
}

// ---- 1. docs text, Vietnamese and English, as the generated pages show it ----
const docHits = []
const docCount = { vi: 0, en: 0 }
for (const scope of ['components', 'pages']) {
  const dir = path.join(ROOT, 'i18n/en', scope)
  for (const f of fs.readdirSync(dir)) {
    const key = f.replace('.json', '')
    const en = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
    const cat = createCatalog(`${scope}/${key}`)
    for (const text of Object.values(en)) {
      scanText(`vi ${scope}/${key}`, debrand(containers(cat.t(text), 'vi'), 'vi'), docHits)
      scanText(`en ${scope}/${key}`, debrand(containers(text, 'en'), 'en'), docHits)
      docCount.vi++
      docCount.en++
    }
  }
}
// hand-written pages (both languages live in the file)
for (const f of ['src/Introduction.mdx', 'src/GettingStarted.mdx', 'src/template/Overview.mdx']) {
  scanText(f, fs.readFileSync(path.join(ROOT, f), 'utf8'), docHits)
}

// ---- 1b. widget labels and token descriptions (src/_dumi: hooks/useLocale.ts, builtins/versionToken.ts) ----
for (const file of ['ui.json', 'tokens.json']) {
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n/en', file), 'utf8'))
  const vi = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n/vi', file), 'utf8'))
  for (const s of Object.keys(en)) {
    scanText(`vi ${file}`, fabiPrefix(vi[s] || s), docHits)
    scanText(`en ${file}`, fabiPrefix(debrandEn(s)), docHits)
  }
}

// ---- 2. text and outside URLs inside the examples ----
const demoHits = []
const ext = { data: [], images: [], links: [] }
for (const dir of fs.readdirSync(path.join(ROOT, 'src/components'))) {
  const demoDir = path.join(ROOT, 'src/components', dir, 'demo')
  if (!fs.existsSync(demoDir)) continue
  for (const f of fs.readdirSync(demoDir).filter((x) => x.endsWith('.tsx'))) {
    const lines = fs.readFileSync(path.join(demoDir, f), 'utf8').split('\n')
    // brand names over the whole text (a name can wrap onto the next line), outside import and comment lines
    const text = lines.map((line) => (/^\s*(import|\/\/|\*)/.test(line) || /_dumi/.test(line) ? '' : line)).join('\n')
    for (const m of text.matchAll(BRAND)) {
      const at = text.slice(0, m.index).split('\n').length
      demoHits.push(`${dir}/demo/${f}:${at}: ${m[0].replace(/\s+/g, ' ')} — ${lines[at - 1].trim().slice(0, 140)}`)
    }
    lines.forEach((line, i) => {
      if (/^\s*(import|\/\/|\*)/.test(line)) return
      const where = `${dir}/demo/${f}:${i + 1}`
      for (const url of line.match(EXT) ?? []) {
        const kind = /\.(png|jpe?g|gif|svg|webp)(\?|$)/i.test(url) || /(avatar|image|img|photo|dicebear|unsplash|picsum|zos|gw\.|mdn\.)/i.test(url)
          ? 'images' : /fetch\(|axios|request|api|mockapi|randomuser|jsonplaceholder/i.test(line + url) ? 'data' : 'links'
        ext[kind].push({ where, host: new URL(url.replace(/[,;]+$/, '')).host })
      }
    })
  }
}

// ---- 3. the generated pages as written (both languages are in each file) ----
// Code comments are not shown; "antd" counts outside code: not next to a backtick, @, / or a dot (package names
// such as `antd@6.x` or `antd/dist/antd.css` sit in inline code).
const genHits = []
let genFiles = 0
const generated = [
  ...fs.readdirSync(path.join(ROOT, 'src/components')).flatMap((d) => {
    const dir = path.join(ROOT, 'src/components', d)
    return fs.statSync(dir).isDirectory() ? fs.readdirSync(dir).filter((f) => f.endsWith('.stories.tsx')).map((f) => path.join(dir, f)) : []
  }),
  ...fs.readdirSync(path.join(ROOT, 'src/design-tokens')).flatMap((d) => {
    const dir = path.join(ROOT, 'src/design-tokens', d)
    return fs.statSync(dir).isDirectory() ? fs.readdirSync(dir).filter((f) => /Page\.tsx$/.test(f)).map((f) => path.join(dir, f)) : []
  }),
]
const BARE_ANTD = /(?<![`@/\w.-])antd(?![`@/\w.-])/g
for (const file of generated) {
  genFiles++
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (/^\s*(import|\/\/|\*|\/\*\*)/.test(line)) return
    // JSON-escaped markdown: "\n" inside a string is a line break of the page text
    const shown = line.replace(/\\n/g, '\n')
    const hits = [...(shown.match(BRAND) ?? []), ...(shown.match(ANT_URL) ?? []), ...(shown.match(BARE_ANTD) ?? [])]
    if (hits.length) genHits.push(`${rel}:${i + 1}: ${[...new Set(hits.map((h) => h.replace(/\s+/g, ' ')))].join(', ')}`)
  })
}

const hosts = (rows) => Object.entries(rows.reduce((a, r) => ((a[r.host] = (a[r.host] ?? 0) + 1), a), {}))
  .sort((a, b) => b[1] - a[1]).map(([h, n]) => `${h} (${n})`).join(', ') || '—'
const list = (title, rows) => {
  console.log(`${title}: ${rows.length}`)
  for (const r of rows.slice(0, 50)) console.log(`  ${typeof r === 'string' ? r : `${r.where} (${r.host})`}`)
  if (rows.length > 50) console.log(`  … ${rows.length - 50} more`)
}

console.log(`Docs text checked: ${docCount.vi} Vietnamese + ${docCount.en} English blocks, 3 MDX pages, widget labels and token descriptions (both languages)`)
list('Ant brand names / Ant links in docs text (vi / en)', docHits)
list(`Ant names / Ant links / "antd" in the generated pages (${genFiles} files)`, genHits)
list('Ant brand names in example text', demoHits)
list('Examples loading outside data', ext.data)
list('Examples loading outside images', ext.images)
console.log(`Outside links (information only): ${ext.links.length} — ${hosts(ext.links)}`)

const problems = docHits.length + genHits.length + demoHits.length + ext.data.length + ext.images.length
console.log(problems ? `\n✗ ${problems} item(s) to clean up` : '\n✓ clean')
process.exitCode = problems ? 1 : 0

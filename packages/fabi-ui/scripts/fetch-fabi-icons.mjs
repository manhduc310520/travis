// Downloads the design's icon set as SVG files into icons/<style>/<name>.svg plus icons/manifest.json
// (category and keywords of every icon), through the design tool's REST API. Then run gen-fabi-icons.mjs.
//
//   FIGMA_ACCESS_TOKEN=… node scripts/fetch-fabi-icons.mjs --file <file key> --line <node id> --solid <node id>
//
// --line / --solid: the sections holding the line and the solid icons (each: category frames → components).
// The file key and the token are passed at run time and never stored in the repo.
import { mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`)
  if (i < 0 || !process.argv[i + 1]) throw new Error(`missing --${name}`)
  return process.argv[i + 1]
}
const token = process.env.FIGMA_ACCESS_TOKEN
if (!token) throw new Error('set FIGMA_ACCESS_TOKEN')
const file = arg('file')
const sections = { line: arg('line'), solid: arg('solid') }
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'icons')
const API = 'https://api.figma.com/v1'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** fetch that retries network errors (connection reset, timeout) like a failed status */
async function get(url, init, attempts = 6) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetch(url, init)
    } catch (error) {
      if (attempt >= attempts) throw error
      await sleep(1000 * attempt)
    }
  }
}

async function api(path) {
  for (let attempt = 1; ; attempt++) {
    const res = await get(`${API}${path}`, { headers: { 'X-Figma-Token': token } })
    if (res.status === 429 || res.status >= 500) {
      const wait = Number(res.headers.get('retry-after')) * 1000 || 5000 * attempt
      if (attempt > 8) throw new Error(`${res.status} after ${attempt} attempts: ${path.slice(0, 80)}`)
      console.log(`  ${res.status}, retry in ${Math.round(wait / 1000)} s`)
      await sleep(wait)
      continue
    }
    const json = await res.json()
    if (!res.ok || json.err) throw new Error(`${res.status} ${json.err ?? json.message ?? ''}`)
    return json
  }
}

// 1. the components of each section, with their category frame and keywords
const { nodes } = await api(`/files/${file}/nodes?ids=${Object.values(sections).join(',')}`)
const icons = [] // { id, name, style, category, keywords }
for (const [style, id] of Object.entries(sections)) {
  const node = nodes[id]
  if (!node) throw new Error(`section ${id} not found`)
  const walk = (n, category) => {
    if (n.type === 'COMPONENT') {
      icons.push({ id: n.id, name: n.name, style, category, keywords: node.components?.[n.id]?.description ?? '' })
      return
    }
    for (const c of n.children ?? []) walk(c, n.type === 'SECTION' ? c.name : category)
  }
  walk(node.document, null)
  console.log(`${style}: ${icons.filter((i) => i.style === style).length} components`)
}

// 2. SVG export URLs, 100 ids a request
const urls = {}
for (let i = 0; i < icons.length; i += 100) {
  const ids = icons.slice(i, i + 100).map((c) => c.id).join(',')
  const { images } = await api(`/images/${file}?ids=${ids}&format=svg&svg_include_id=false&svg_simplify_stroke=true`)
  Object.assign(urls, images)
  console.log(`urls ${Math.min(i + 100, icons.length)}/${icons.length}`)
}

// 3. download, 16 at a time, into a temporary folder: the current set is replaced only when all succeeded
const missing = icons.filter((c) => !urls[c.id])
if (missing.length) throw new Error(`no export for ${missing.length} icons, e.g. ${missing[0].name}`)
const tmp = join(out, '.download')
rmSync(tmp, { recursive: true, force: true })
for (const style of Object.keys(sections)) mkdirSync(join(tmp, style), { recursive: true })
const seen = new Map()
for (const c of icons) {
  // two components with one name (the design has a few): keep both, the second as <name>~2
  const key = `${c.style}/${c.name}`
  const n = (seen.get(key) ?? 0) + 1
  seen.set(key, n)
  c.file = `${c.style}/${n > 1 ? `${c.name}~${n}` : c.name}.svg`
}
let done = 0
const queue = [...icons]
await Promise.all(Array.from({ length: 16 }, async () => {
  for (let c = queue.shift(); c; c = queue.shift()) {
    for (let attempt = 1; ; attempt++) {
      const res = await get(urls[c.id])
      if (res.ok) { writeFileSync(join(tmp, c.file), await res.text()); break }
      if (attempt > 5) throw new Error(`${res.status} downloading ${c.name}`)
      await sleep(1000 * attempt)
    }
    if (++done % 200 === 0) console.log(`svg ${done}/${icons.length}`)
  }
}))

// 4. manifest (no ids: nothing that points back to the design file), then swap the new set in
const manifest = icons.map(({ name, style, category, keywords, file: f }) => ({ name, style, category, keywords, file: f }))
writeFileSync(join(tmp, 'manifest.json'), `${JSON.stringify(manifest, null, 1)}\n`)
for (const style of Object.keys(sections)) {
  rmSync(join(out, style), { recursive: true, force: true })
  renameSync(join(tmp, style), join(out, style))
}
renameSync(join(tmp, 'manifest.json'), join(out, 'manifest.json'))
rmSync(tmp, { recursive: true, force: true })
console.log(`done: ${icons.length} icons → icons/line, icons/solid, icons/manifest.json`)

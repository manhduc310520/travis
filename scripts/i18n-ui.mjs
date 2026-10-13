// Extract the English UI strings that are not in the markdown docs, for translation:
//   i18n/en/ui.json      `en: { … }` locale strings of the antd site widgets (src/_dumi) and of the
//                        Semantic DOM / locale-aware demos (src/components/*/demo)
//   i18n/en/tokens.json  every design-token description (antd/es/version/token-meta.json, descEn)
// Both are keyed by the English text itself; i18n/vi/ui.json and i18n/vi/tokens.json map that
// text to Vietnamese and are applied at runtime by src/_dumi/hooks/useLocale.ts and
// src/_dumi/theme/builtins/versionToken.ts.
// Usage: node scripts/i18n-ui.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function files(dir, test) {
  return fs.readdirSync(dir, { recursive: true }).map((f) => path.join(dir, f)).filter((f) => test(f) && fs.statSync(f).isFile())
}

/** String values inside every `en: { … }` object literal of a source file. */
function enStrings(src) {
  const out = []
  const re = /\ben\s*:\s*\{/g
  let m
  while ((m = re.exec(src))) {
    let depth = 1
    let i = re.lastIndex
    for (; i < src.length && depth; i++) {
      if (src[i] === '{') depth++
      else if (src[i] === '}') depth--
    }
    const body = src.slice(re.lastIndex, i - 1)
    for (const s of body.matchAll(/:\s*(['"`])((?:\\.|(?!\1)[^\\])*)\1/g)) {
      if (!s[2].includes('${')) out.push(s[2].replace(/\\(['"`\\])/g, '$1'))
    }
  }
  return out
}

const ui = {}
const sources = [
  // only the widgets Storybook renders (not the site's home page, layouts and slots)
  ...files(path.join(ROOT, 'src/_dumi/theme/builtins'), (f) => /\.(tsx|ts)$/.test(f)),
  ...files(path.join(ROOT, 'src/_dumi/theme/common'), (f) => /\.(tsx|ts)$/.test(f)),
  ...files(path.join(ROOT, 'src/components'), (f) => /[\\/]demo[\\/].*\.(tsx|ts)$/.test(f)),
]
for (const f of sources) for (const s of enStrings(fs.readFileSync(f, 'utf8'))) if (s.trim()) ui[s] = s
// dumi site messages shown by the rendered widgets (Icon search, colour palette tools), read through the
// `dumi` shim (src/shims/dumi.tsx)
const SITE_MESSAGES = /^app\.docs\.(components\.icon\.|color\.pick-)/
const siteMessages = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/_dumi/theme/locales/en-US.json'), 'utf8'))
for (const [id, s] of Object.entries(siteMessages)) if (SITE_MESSAGES.test(id) && s.trim()) ui[s] = s
// strings the widgets give through hooks/useLocale.ts useUiText: `useUiText()('…')`, or `t('…')` in a file
// that uses the hook (SVG titles, tooltips, copy messages, the Single / Multiple switch)
for (const f of [...sources, ...files(path.join(ROOT, 'src/_dumi/theme/icons'), (x) => /\.tsx$/.test(x))]) {
  const src = fs.readFileSync(f, 'utf8')
  if (!src.includes('useUiText')) continue
  for (const m of src.matchAll(/(?:useUiText\(\)|\bt)\(\s*'((?:[^'\\\n]|\\.)+)'/g)) ui[m[1]] = m[1]
}

const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/antd/es/version/token-meta.json'), 'utf8'))
// token names shown by TokenCompare (Design Tokens pages: <TokenCompare tokenNames="a|b"> in the generated pages)
for (const f of files(path.join(ROOT, 'src/design-tokens'), (x) => /Page\.tsx$/.test(x))) {
  for (const m of fs.readFileSync(f, 'utf8').matchAll(/<TokenCompare tokenNames="([^"]+)"/g)) {
    for (const token of m[1].split('|')) {
      const name = meta.global[token]?.nameEn?.replace('Color', '').trim()
      if (name) ui[name] = name
    }
  }
}
const tokens = {}
for (const m of Object.values(meta.global)) if (m.descEn) tokens[m.descEn] = m.descEn
for (const list of Object.values(meta.components)) for (const m of list) if (m.descEn) tokens[m.descEn] = m.descEn

fs.mkdirSync(path.join(ROOT, 'i18n/en'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'i18n/en/ui.json'), JSON.stringify(ui, null, 1) + '\n')
fs.writeFileSync(path.join(ROOT, 'i18n/en/tokens.json'), JSON.stringify(tokens, null, 1) + '\n')
console.log(`ui: ${Object.keys(ui).length} strings from ${sources.length} files; tokens: ${Object.keys(tokens).length} descriptions`)

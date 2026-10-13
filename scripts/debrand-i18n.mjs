// Remove Ant brand words from the Vietnamese widget labels and token descriptions
// (i18n/vi/ui.json, i18n/vi/tokens.json), the same rules as the docs text:
//   "trong / của Ant Design" → "trong / của hệ thống"; other "Ant Design" → "FABi CMS Design System";
//   "antd" in prose (not in `code`) → "thư viện". Run after re-translating; check-i18n warns if needed.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export function debrandText(s) {
  return s
    .split(/(`[^`]*`)/)
    .map((part) => (part.startsWith('`') ? part : part
      .replace(/\b(trong|của|cho|với)\s+Ant Design\b/g, '$1 hệ thống')
      .replace(/\bAnt Design\b/g, 'FABi CMS Design System')
      .replace(/\bAnt Financial\b|\bAnt Group\b|\bAntFin\b/g, 'FABi CMS')
      .replace(/\bantd\b(?![/.-])/g, 'thư viện')))
    .join('')
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  for (const f of ['ui.json', 'tokens.json']) {
    const file = path.join(ROOT, 'i18n/vi', f)
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    let n = 0
    for (const k of Object.keys(data)) {
      const v = debrandText(data[k])
      if (v !== data[k]) { data[k] = v; n++ }
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 1) + '\n')
    console.log(`${f}: ${n} strings debranded`)
  }
}

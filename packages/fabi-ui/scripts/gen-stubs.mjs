// Generates the re-export entry points of @fabi/ui into dist/ (run after tsc; `npm run build` does both).
// Each stub is a .js + .d.ts pair that re-exports another module, so apps import only '@fabi/ui/...'.
// To expose another antd internal (B5), add its path to ES_PATHS and rebuild.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** antd internals the demos import today: @fabi/ui/es/<path> → antd/es/<path>. */
const ES_PATHS = [
  '_util/aria-data-attrs',
  'badge/Ribbon',
  'checkbox',
  'date-picker/locale/en_US',
  'input/TextArea',
  'locale/en_US',
  'masonry/MasonryItem',
  'menu/interface',
  'message/interface',
  'modal/confirm',
  'notification/interface',
  'select',
  'table/interface',
  'transfer/interface',
]

/** Other Ant packages: @fabi/ui/<subpath> → package. */
const PACKAGES = {
  icons: '@ant-design/icons',
  colors: '@ant-design/colors',
  cssinjs: '@ant-design/cssinjs',
  style: 'antd-style',
  'happy-work-theme': '@ant-design/happy-work-theme',
  'img-crop': 'antd-img-crop',
  'static-style-extract': '@ant-design/static-style-extract',
  // Ant's statistical charts (Column, Area, Line, Pie, Tiny…): user 2026-10-13, "chart dùng thư viện của ant"
  charts: '@ant-design/plots',
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const require = createRequire(join(root, 'package.json'))
// look the folder up on the node_modules paths (some packages, e.g. antd-img-crop, do not export ./package.json)
const pkgDir = (name) => {
  const dir = require.resolve.paths(name).map((p) => join(p, name)).find((d) => existsSync(join(d, 'package.json')))
  if (!dir) throw new Error(`${name} is not installed`)
  return dir
}

const HAS_DEFAULT = /export default\b|\bas default\b|export\s*\{\s*default\s*[,}]/
// any export other than a lone `export { default }` / `export default`
const HAS_NAMED = /^export (?:declare |interface |type |const |function |class |enum |abstract |\*|\{(?!\s*default\s*\}))/m

function write(file, js, dts) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(`${file}.js`, js)
  writeFileSync(`${file}.d.ts`, dts)
}

/** Plain re-export: `export *` plus `export { default }` when the source has a default. */
function reexport(file, spec, dtsSource) {
  const src = readFileSync(dtsSource, 'utf8')
  const lines = []
  if (HAS_NAMED.test(src)) lines.push(`export * from '${spec}'`)
  if (HAS_DEFAULT.test(src)) lines.push(`export { default } from '${spec}'`)
  if (!lines.length) lines.push(`export * from '${spec}'`)
  const body = lines.join('\n') + '\n'
  write(file, body, body)
  return lines.length
}

// 1. other Ant packages
for (const [sub, name] of Object.entries(PACKAGES)) {
  const dir = pkgDir(name)
  const pj = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
  const types = [pj.types, pj.typings, 'es/index.d.ts', 'lib/index.d.ts'].filter(Boolean).map((t) => join(dir, t)).find(existsSync)
  if (!types) throw new Error(`no types for ${name}`)
  reexport(join(dist, sub), name, types)
}

// 2. antd internals
for (const path of ES_PATHS) {
  const base = join(pkgDir('antd'), 'es', path)
  const isFile = existsSync(`${base}.d.ts`)
  const dts = isFile ? `${base}.d.ts` : join(base, 'index.d.ts')
  if (!existsSync(dts)) throw new Error(`antd/es/${path} not found`)
  // full file path: antd has no "exports" map, so Node ESM needs the extension (bundlers accept it too)
  reexport(join(dist, 'es', path), `antd/es/${path}${isFile ? '' : '/index'}.js`, dts)
}

// 3. every antd locale. antd/locale/* is CommonJS (module.exports = require('../lib/locale/…')), and an
// ES module importing CommonJS gets either the locale (bundler interop) or { __esModule, default: locale }
// (Node, and bundlers in "node mode" for "type": "module" packages); unwrap so both give the locale.
const localeDir = join(pkgDir('antd'), 'locale')
const locales = readdirSync(localeDir).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3))
for (const name of locales) {
  const spec = `antd/locale/${name}.js` // with extension, as for antd/es above
  const src = readFileSync(join(localeDir, `${name}.d.ts`), 'utf8')
  const named = HAS_NAMED.test(src)
  const js = [
    `import * as m from '${spec}'`,
    ...(named ? [`export * from '${spec}'`] : []),
    'const mod = m.default',
    'export default mod && mod.__esModule ? mod.default : mod',
  ].join('\n') + '\n'
  const dts = [...(named ? [`export * from '${spec}'`] : []), `export { default } from '${spec}'`].join('\n') + '\n'
  write(join(dist, 'locale', name), js, dts)
}

// 4. CSS
copyFileSync(join(root, 'src', 'styles.css'), join(dist, 'styles.css'))
writeFileSync(
  join(dist, 'font.css'),
  '/* Be Vietnam Pro, the FABi CMS font (Regular 400, Medium 500, Semibold 600, Bold 700). */\n' +
    "@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');\n",
)

console.log(`stubs: ${Object.keys(PACKAGES).length} packages, ${ES_PATHS.length} antd/es paths, ${locales.length} locales; css: styles.css, font.css`)

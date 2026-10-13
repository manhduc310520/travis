// Ant Design names → @fabi/ui names, for everything the docs show or run (B5):
// module specifiers in demo code, package names in the docs text, and the class / CSS variable
// prefixes (FabiProvider renders `fabi-` classes, `fabi-icon` icons and `--fabi-*` variables).
// Used by convert.mjs (demos, docs, playgrounds) and convert-pages.mjs (Design Tokens pages).

/** Ant packages that @fabi/ui re-exports, by entry point. */
const PACKAGES = {
  antd: '@fabi/ui',
  '@ant-design/icons': '@fabi/ui/icons',
  '@ant-design/colors': '@fabi/ui/colors',
  '@ant-design/cssinjs': '@fabi/ui/cssinjs',
  '@ant-design/happy-work-theme': '@fabi/ui/happy-work-theme',
  '@ant-design/static-style-extract': '@fabi/ui/static-style-extract',
  'antd-style': '@fabi/ui/style',
  'antd-img-crop': '@fabi/ui/img-crop',
}

/** One module specifier: 'antd' → '@fabi/ui', 'antd/es/x' → '@fabi/ui/es/x', … (others unchanged). */
export function fabiSpecifier(spec) {
  if (PACKAGES[spec]) return PACKAGES[spec]
  let m = spec.match(/^antd\/(?:es|lib)\/(.+)$/)
  if (m) return `@fabi/ui/es/${m[1]}`
  m = spec.match(/^antd\/locale\/(.+)$/)
  if (m) return `@fabi/ui/locale/${m[1]}`
  return spec
}

/**
 * Rewrites import / export specifiers in code (also `import type`, side-effect and dynamic imports).
 * Deep icon imports (`import X from '@ant-design/icons/X'`) become named imports of '@fabi/ui/icons'.
 */
export function fabiImports(code) {
  return code
    .replace(/\bimport\s+([A-Za-z_$][\w$]*)\s+from\s+(['"])@ant-design\/icons\/([A-Za-z]\w*)\2/g, (_, local, q, name) =>
      `import { ${local === name ? name : `${name} as ${local}`} } from ${q}@fabi/ui/icons${q}`)
    .replace(/(\b(?:from|import)\s*\(?\s*)(['"])([^'"\n]+)\2/g, (all, pre, q, spec) => pre + q + fabiSpecifier(spec) + q)
}

/**
 * Class and CSS-variable prefixes: `ant-x` → `fabi-x`, `anticon` → `fabi-icon`, `--ant-x` → `--fabi-x`.
 * Only whole prefixes: `antd`, `relevant-`, `my-ant-x`, `@ant-design` and `ant-design` stay.
 */
export function fabiPrefix(s) {
  return s
    .replace(/--ant-(?=[a-z])/g, '--fabi-')
    .replace(/(?<![\w$@/-])anticon\b/g, 'fabi-icon')
    .replace(/(?<![\w$@/-])ant-(?!design\b)(?=[a-z])/g, 'fabi-')
}

/** Demo code: specifiers and prefixes. */
export const fabiCode = (code) => fabiPrefix(fabiImports(code))

const ICON_INSTALL = {
  vi: 'Icon có sẵn trong `@fabi/ui` (import từ `@fabi/ui/icons`), chỉ cần cài một gói:',
  en: 'Icons ship with `@fabi/ui` (import them from `@fabi/ui/icons`), so there is one package to install:',
}

/**
 * Docs text (after translation and debrand): install commands, package names in code and prose,
 * prefixes. Icons ship inside @fabi/ui, so their separate install step becomes the one package.
 * `lang`: the language of the text ('vi' | 'en'), for the one sentence written here.
 */
export function fabiDocs(md, lang = 'vi') {
  return fabiPrefix(fabiImports(md)
    // Icon page: no separate icon package, and no antd / icons version pairing to remember
    .replace(/(?:Before using icons, you need to install the|Trước khi dùng icon, bạn cần cài đặt) (?:package )?@ant-design\/icons(?: package)?:/g, ICON_INSTALL[lang])
    .replace(/^> \*\*[^*\n]+\*\*\n>\n> [^\n]*`@ant-design\/icons@6\.x`[^\n]*\n?/gm, '')
    // a titled note left empty once its Ant-only sentence is gone
    .replace(/^> \*\*[^*\n]+\*\*\n>[ \t]*\n(?!>)/gm, '')
    .replace(/^(\s*)(?:\$\s*)?(?:npm (?:install|i)|yarn add|pnpm (?:add|install)|bun add)\s+(?:antd|@ant-design\/[\w-]+|antd-[\w-]+)(?:@\S+)?(?:\s+--save)?[ \t]*$/gm, '$1npm install @fabi/ui')
    .replace(/@ant-design\/(icons|colors|cssinjs|happy-work-theme|static-style-extract)\b(?!-)/g, '@fabi/ui/$1')
    .replace(/(?<![\w@/-])antd-style\b/g, '@fabi/ui/style')
    .replace(/(?<![\w@/-])antd-img-crop\b/g, '@fabi/ui/img-crop')
    .replace(/(?<![\w@/-])antd\/(?:es|lib)\/(?=[\w-])/g, '@fabi/ui/es/')
    .replace(/(?<![\w@/-])antd\/locale\b/g, '@fabi/ui/locale'))
}

/** Packages outside @fabi/ui (and React) that an example imports: the developer installs them. */
export function extraDeps(code) {
  const out = new Set()
  for (const m of code.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)(['"])([^'"\n]+)\1/g)) {
    const s = m[2]
    if (/^(?:\.|\/|@fabi\/ui(?:\/|$)|react(?:-dom)?(?:\/|$)|dumi$)/.test(s)) continue
    out.add(s.startsWith('@') ? s.split('/').slice(0, 2).join('/') : s.split('/')[0])
  }
  return [...out].sort()
}

/** Label of the extra-packages line under an example, by docs language. */
export const DEPS_LABEL = { vi: 'Cần cài thêm:', en: 'Also install:' }

/**
 * "Cần cài thêm: `dayjs`, `@dnd-kit/core`" (EN "Also install: …") as JSX for a generated docs page ('' when
 * nothing). The page component defines `vi` (true when the Language toolbar is VN).
 */
export function depsNote(code) {
  const deps = extraDeps(code)
  return deps.length ? `<p className="fabi-sb-deps">{vi ? ${JSON.stringify(DEPS_LABEL.vi)} : ${JSON.stringify(DEPS_LABEL.en)}} ${deps.map((d) => `<code>${d}</code>`).join(', ')}</p>` : ''
}

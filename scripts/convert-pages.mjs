// Convert antd's token / design-spec doc pages (dumi markdown under docs/) into a
// "Design Tokens" section of Storybook. Usage: node scripts/convert-pages.mjs
//
// Each page becomes src/design-tokens/<slug>/:
//   <Title>Page.tsx  the page as a React component (markdown blocks, antd site widgets
//                    such as TokenTable / ColorPalettes, and live examples with code)
//   <Title>.mdx      a two-line wrapper that gives the page its Storybook entry
//   _demo/*          examples referenced with <code src> or written inline as ```jsx | demo
// Each page holds its text in Vietnamese and English and renders the language of the Language toolbar
// (same helpers as the component pages, scripts/convert.mjs).
import fs from 'node:fs'
import path from 'node:path'
import { createCatalog } from './i18n.mjs'
import { extraDeps, fabiCode } from './fabi-names.mjs'
import { ANTD, ANT_MEDIA, ROOT, js, splitFrontmatter, demoDescription, fixMarkdown, containers, debrand, writeIfChanged, escapeJsxText, bilingual, mdBlock, jsxText, pageAnchors } from './convert.mjs'
import { PAGE_TITLES_VI } from '../.storybook/labels.ts'

const OUT = path.join(ROOT, 'src/design-tokens')

// Sidebar order inside "Design Tokens".
const PAGES = [
  // customize-theme: hand-written FABi page since 2026-10-13 (5 brands x Light / Dark + compact), not generated
  { file: 'docs/spec/colors.en-US.md', slug: 'colors' },
  { file: 'docs/spec/dark.en-US.md', slug: 'dark-mode' },
  { file: 'docs/spec/font.en-US.md', slug: 'font' },
  { file: 'docs/spec/layout.en-US.md', slug: 'layout' },
  { file: 'docs/spec/shadow.en-US.md', slug: 'shadow' },
  { file: 'docs/spec/motion.en-US.md', slug: 'motion' },
]

// antd site widgets these pages use; each lives in src/_dumi/theme/builtins/<Name>.
const WIDGETS = ['TokenTable', 'ColorPalettes', 'Palette', 'ColorPaletteTool', 'ColorPaletteToolDark', 'TokenCompare']
// Wrappers that only add a lightbox on the site: keep their content, drop the tag.
const DROP_WRAPPERS = ['ImagePreview']
// Stray text in the antd source pages, removed before conversion (by slug).
// layout: the English page (antd 6.6.5) ends its last paragraph with the word "translate-layout", a leftover
// of the translation (the Chinese page does not have it).
const SOURCE_FIXES = {
  layout: [/[ \t]+translate-layout[ \t]*$/m],
}

function parsePage(body, pageDir, outDir) {
  const segments = []
  const styles = []
  let text = []
  let inline = 0
  const flush = () => {
    const md = fixMarkdown(text.join('\n'))
    if (md) segments.push({ type: 'md', md })
    text = []
  }
  const lines = body.split(/\r?\n/)
  let inFence = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // ```jsx | demo  → a live example written inline
    const live = !inFence && line.match(/^\s*```(jsx|tsx)\s*\|\s*demo\s*$/)
    if (live) {
      flush()
      const code = []
      for (i++; i < lines.length && !/^\s*```\s*$/.test(lines[i]); i++) code.push(lines[i])
      const file = `_demo/inline-${++inline}.${live[1]}`
      // Ant-hosted images in inline examples (Motion principles) → local illustration
      writeIfChanged(path.join(outDir, file), fabiCode(code.join('\n').replace(new RegExp(ANT_MEDIA.source, 'gi'), '/mock-assets/illustration.svg')) + '\n')
      segments.push({ type: 'demo', file: `./${file}`, label: '', abs: path.join(outDir, file), inline: true })
      continue
    }
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
    if (inFence) { text.push(line); continue }
    if (/^\s*<style>/.test(line)) {
      const css = []
      for (i++; i < lines.length && !/^\s*<\/style>/.test(lines[i]); i++) css.push(lines[i])
      styles.push(css.join('\n'))
      continue
    }
    const demo = line.match(/^\s*<code src="\.\/([^"]+)"([^>]*)>(.*?)<\/code>\s*$/)
    if (demo) {
      flush()
      const [, file, attrs, label] = demo
      if (/\bdebug\b/.test(attrs)) continue
      const abs = path.join(pageDir, file)
      segments.push({ type: 'demo', file: `./${file}`, label: label.trim(), abs, md: abs.replace(/\.(tsx|jsx)$/, '.md') })
      continue
    }
    const widget = line.match(new RegExp(`^\\s*<(${WIDGETS.join('|')})((?:\\s+[^>]*?)?)\\s*(?:/>|>\\s*</\\1>)\\s*$`))
    if (widget) { flush(); segments.push({ type: 'widget', name: widget[1], attrs: widget[2].trim() }); continue }
    if (new RegExp(`^\\s*</?(${DROP_WRAPPERS.join('|')})\\b[^>]*>\\s*$`).test(line)) continue
    text.push(line)
  }
  flush()
  return { segments, css: styles.join('\n') }
}

function convertPage({ file, slug }) {
  const src = path.join(ANTD, file)
  const pageDir = path.dirname(src)
  const outDir = path.join(OUT, slug)
  const { meta, body: raw } = splitFrontmatter(fs.readFileSync(src, 'utf8'))
  let body = raw
  for (const re of SOURCE_FIXES[slug] ?? []) {
    if (!re.test(body)) console.warn(`  ! ${slug}: source fix ${re} no longer matches`)
    body = body.replace(re, '')
  }
  const title = meta.title
  const comp = title.replace(/[^A-Za-z0-9]/g, '')
  const { segments, css } = parsePage(body, pageDir, outDir)

  const cat = createCatalog(`pages/${slug}`)
  // markdown blocks in both languages, then the in-page links of each language (convert.mjs pageAnchors)
  const mdSegments = segments.filter((s) => s.type === 'md')
  for (const s of mdSegments) {
    s.vi = debrand(containers(cat.t(s.md), 'vi'), 'vi')
    s.en = debrand(containers(s.md, 'en'), 'en')
  }
  const links = pageAnchors(mdSegments, body)
  const imports = new Set()
  const out = []
  let n = 0
  for (const seg of segments) {
    if (seg.type === 'md') {
      const md = mdBlock(links.vi(seg.vi), links.en(seg.en))
      if (md) out.push(md)
      continue
    }
    if (seg.type === 'widget') {
      imports.add(`import ${seg.name} from '../../_dumi/theme/builtins/${seg.name}'`)
      out.push(`      <DocUnstyled><div className="fabi-sb-block"><${seg.name}${seg.attrs ? ' ' + seg.attrs : ''} /></div></DocUnstyled>`)
      continue
    }
    // examples: copy referenced files next to the page, then render live with their code
    let rel = seg.file
    if (!seg.inline) {
      if (!fs.existsSync(seg.abs)) { console.warn(`  ! ${title}: ${seg.file} not found`); continue }
      rel = './_demo/' + path.basename(seg.abs)
      // @fabi/ui imports and fabi- class names, as in the component demos (scripts/fabi-names.mjs)
      writeIfChanged(path.join(outDir, rel), fabiCode(fs.readFileSync(seg.abs, 'utf8')))
    }
    const id = `Example${n++}`
    imports.add(`import ${id} from ${js(rel.replace(/\.(tsx|jsx)$/, ''))}`)
    imports.add(`import ${id}Source from ${js(rel + '?raw')}`)
    const descSource = seg.md ? demoDescription(seg.md) : ''
    const desc = descSource ? debrand(cat.t(descSource), 'vi') : ''
    const descEn = descSource ? debrand(descSource, 'en') : ''
    // the page usually titles an example with its own heading just above it; add one only if not
    const prev = segments[segments.indexOf(seg) - 1]
    const headings = prev?.type === 'md' ? [...prev.md.matchAll(/^#{1,6} (.+)$/gm)].map((m) => m[1].trim().toLowerCase()) : []
    const titled = headings.at(-1) === seg.label.toLowerCase()
    if (seg.label && !titled) out.push(`      <h3 className="fabi-sb-demo-title">${escapeJsxText(seg.label)}</h3>`)
    // the example's own description goes inside its box, as on ant.design (the page text
    // above often says nearly the same thing)
    // packages the example needs besides @fabi/ui and React
    const deps = extraDeps(fs.readFileSync(path.join(outDir, rel), 'utf8'))
    const description = desc && descEn ? ` description={${bilingual(desc, descEn)}}`
      : desc || descEn ? ` description={${desc ? 'vi' : '!vi'} ? ${js(desc || descEn)} : undefined}` : ''
    out.push(`      <Example code={${id}Source} inline={${!!seg.inline}}${description}${deps.length ? ` deps={${js(deps)}}` : ''}><${id} /></Example>`)
  }

  // The site loads ColorStyle globally; palette widgets read their swatch colours from it.
  const needsColorStyle = segments.some((s) => s.type === 'widget' && /Palette/.test(s.name))
  if (needsColorStyle) imports.add(`import ColorStyle from '../../_dumi/theme/common/Color/ColorStyle'`)

  const page = `// Generated by scripts/convert-pages.mjs (${slug}) — do not edit by hand. Third-party licences: NOTICE.md.
import { Markdown as DocMarkdown, Unstyled as DocUnstyled } from '@storybook/addon-docs/blocks'
import { useDocsLocale } from '../../../.storybook/locale'
import Example from '../Example'
${[...imports].join('\n')}

const css = ${js(css)}

/** Page in the language of the Language toolbar (VN / EN). */
export default function ${comp}Page() {
  const vi = useDocsLocale() === 'vi'
  return (
    <>
      {css && <style>{css}</style>}
${needsColorStyle ? '      <ColorStyle />\n' : ''}      <h1 className="fabi-sb-page-title">${jsxText(PAGE_TITLES_VI[`Design Tokens/${title}`] ?? title, title)}</h1>
${out.join('\n')}
    </>
  )
}
`
  writeIfChanged(path.join(outDir, `${comp}Page.tsx`), page)
  writeIfChanged(
    path.join(outDir, `${comp}.mdx`),
    `{/* Generated by scripts/convert-pages.mjs — do not edit by hand. */}\nimport { Meta } from '@storybook/addon-docs/blocks'\nimport Page from './${comp}Page'\n\n<Meta title=${js(`Design Tokens/${title}`)} />\n\n<Page />\n`,
  )
  const [translated, strings] = cat.save()
  return { title, examples: n, widgets: segments.filter((s) => s.type === 'widget').map((s) => s.name), translated, strings }
}

for (const r of PAGES.map(convertPage)) {
  console.log(`${r.title.padEnd(16)} ${String(r.examples).padStart(2)} examples  vi ${r.translated}/${r.strings}  ${r.widgets.join(', ')}`)
}

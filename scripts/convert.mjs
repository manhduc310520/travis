// Convert Ant Design's dumi docs (components/<name>/index.en-US.md + demo/*) into
// Storybook CSF files. Usage: node scripts/convert.mjs [button table form ...]
// With no arguments every component folder that has an index.en-US.md is converted.
//
// Per component it writes src/components/<name>/:
//   demo/*            copied unchanged from antd (imports resolve the same way)
//   <Title>.stories.tsx one story per non-debug demo + a docs page that follows
//                       index.en-US.md section by section
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import YAML from 'yaml'
import * as antdColors from '@ant-design/colors'
import { createCatalog, glossaryHeading } from './i18n.mjs'
import { applyBrandEdits } from './brand-edits.mjs'
import { PLAYGROUNDS, argTypesFromApi, playCode } from './playgrounds.mjs'
import { depsNote, fabiCode, fabiDocs } from './fabi-names.mjs'
import { dropVersionNotes } from './doc-cleanup.mjs'
import { CHINESE_ONLY_DEMOS, dropCnLocale, dropZhSection, findChinese, noChinese } from './no-chinese.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ANTD = path.resolve(ROOT, '../antd-src/ant-design-6.6.5')
const SRC_COMPONENTS = path.join(ANTD, 'components')
const OUT = path.join(ROOT, 'src/components')
const SITE = 'https://ant.design'

// Sidebar groups, in the order the antd site uses.
const GROUPS = ['General', 'Layout', 'Navigation', 'Data Entry', 'Data Display', 'Feedback', 'Other']

// One-time setup: the antd site helpers (.dumi) are copied to src/_dumi. Vite does not
// serve dot-folders, and the nested tsconfig.json extends a file that is not copied.
const SITE_HELPERS = path.join(ROOT, 'src/_dumi')
if (!fs.existsSync(SITE_HELPERS)) {
  fs.cpSync(path.join(ANTD, '.dumi'), SITE_HELPERS, { recursive: true })
  fs.rmSync(path.join(SITE_HELPERS, 'tsconfig.json'), { force: true })
}

// Components without a docs page (user decision 2026-10-14): List is deprecated by antd 6.6 in favour of Listy
// (it stays exported from @fabi/ui so existing code keeps working).
const HIDDEN = new Set(['list'])

const args = process.argv.slice(2)
const names = args.length
  ? args
  : fs.readdirSync(SRC_COMPONENTS).filter((n) => {
      const doc = path.join(SRC_COMPONENTS, n, 'index.en-US.md')
      // component pages only: they have examples (the Overview page has none)
      return !HIDDEN.has(n) && fs.existsSync(doc) && fs.existsSync(path.join(SRC_COMPONENTS, n, 'demo'))
    })

// ---------- house style: changes to the upstream demos ----------
// The team only uses bordered tables, so every Table demo renders with `bordered`
// (an explicit `bordered={…}` later in the tag still wins). Demos with a Bordered
// switch start with it on.
// Every demo, every component (user decisions 2026-09-30):
// - outside data APIs → /mock-api/… (answered locally by .storybook/mockApi.ts)
// - remote images → local samples in public/mock-assets (scripts/make-assets.mjs)
// - links to Ant-owned sites → https://example.com
// - the sample text "Ant Design" → "FABi CMS"
const pick = (s, n) => ([...s].reduce((a, c) => a + c.charCodeAt(0), 0) % n) + 1
const ANT_SITE = /https?:\/\/(?:[a-z0-9-]+\.)*(?:ant\.design|antgroup\.com|antfin\.com|alipay\.com|taobao\.com|tmall\.com|aliyun\.com|luohanacademy\.com)(?:\/[^'"`\s)<>]*)?/g
const IMAGE_HOSTS = /https?:\/\/(?:(?:gw|zos|os|mdn)\.alipayobjects\.com|images\.unsplash\.com|user-images\.githubusercontent\.com)\/[^'"`\s)<>]*/g
function globalPatch(code) {
  return sampleText(code
    .replace(/^[ \t]*\/\/ https:\/\/github\.com\/mockapi-io\/[^\n]*\n/gm, '')
    .replace(/https:\/\/660d2bd96ddfa2943b33731c\.mockapi\.io\/api\//g, '/mock-api/')
    .replace(/https:\/\/api\.github\.com\/search\/users/g, '/mock-api/github/search/users')
    .replace(/https:\/\/next\.json-generator\.com\/api\/json\/get\/[A-Za-z0-9]+/g, '/mock-api/preview')
    .replace(/https:\/\/api\.dicebear\.com\/[^'"`\s)]*?seed=(\$\{[^}]+\}|\d+)/g, (_, seed) =>
      seed.startsWith('${') ? `/mock-assets/avatar-\${(Math.abs(Number(${seed.slice(2, -1)})) % 12) + 1}.svg` : `/mock-assets/avatar-${(Number(seed) % 12) + 1}.svg`)
    .replace(IMAGE_HOSTS, (url) => (/\.svg(\?|$)/i.test(url) ? '/mock-assets/illustration.svg' : /avatar/i.test(url) ? `/mock-assets/avatar-${pick(url, 12)}.svg` : `/mock-assets/photo-${pick(url, 12)}.svg`))
    .replace(ANT_SITE, 'https://example.com')
    .replace(/https?:\/\/github\.com\/(?:ant-design|react-component|antvis|umijs)[^'"`\s)<>]*/g, 'https://example.com')
    // placeholder file URLs of the Upload demos → local samples; the "broken image" demos keep
    // a missing file, but a local one (no outside request)
    .replace(/https?:\/\/www\.baidu\.com\/[a-z0-9_-]+\.png/gi, (url) => `/mock-assets/photo-${pick(url, 12)}.svg`)
    .replace(/https?:\/\/abc\.com\/not-exist\.jpg/g, '/mock-assets/not-exist.jpg')
    // the Ant Design logo icon → a neutral icon (the FABi CMS logo is a wordmark, not an icon)
    .replace(/\bAntDesignOutlined\b/g, 'AppstoreOutlined')
    // sample text naming Ant's team / company
    .replace(/Ant UED Team/g, 'the FABi CMS team').replace(/Ant UED/g, 'FABi CMS')
    .replace(/\uff08\u8682\u8681\u96c6\u56e2[^\uff09]*\uff09/g, '').replace(/\u8682\u8681\u96c6\u56e2/g, 'FABi CMS').replace(/\u8682\u8681\u7684/g, '').replace(/\u8682\u8681/g, '')
    .replace(/key: 'alipay'/g, "key: 'external-link'")
    // Typography sample paragraph advertised AntV (Ant Group) in Chinese
    .replace(/`AntV \u662f[^`]*`/g, '`FABi CMS helps restaurants run menus, orders, staff and reports from one place. It is built for busy teams: every screen favours clear information, fast actions and consistent patterns, so new staff learn it quickly and managers see what matters at a glance.`')
    // the name split over two lines of JSX text (Typography "Ellipsis" demo)
    .replace(/\bAnt(\s*\n\s*)Design\b(?! Pro)/g, 'FABi$1CMS')
    .split('\n')
    .map((line) => (/^\s*import\b/.test(line) || /_dumi/.test(line) ? line : line.replace(/Ant Design(?! Pro)/gi, 'FABi CMS')))
    .join('\n'))
}

// Sample text that still described antd (a design language, a React UI library, Sketch / Axure resources, the
// antd repo and e-mail) → neutral FABi / restaurant samples in English, like the other demos (review 2026-10-14).
// Applied after "Ant Design" → "FABi CMS" above; words may wrap over lines in JSX text, hence \s+.
const phrase = (s) => new RegExp(s.trim().split(/\s+/).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+'), 'g')
const SAMPLE_TEXT = [
  // Typography (basic, ellipsis, _semantic), Skeleton, Steps: "FABi CMS, a design language for background applications…"
  [phrase('FABi CMS is a design language for background applications, refined by the FABi CMS team. It aims to uniform the user interface specs for internal background projects, lower the unnecessary cost of design differences and implementation and liberate the resources of design and front-end development.'),
    'FABi CMS is a back office for restaurants: menus, orders, tables, staff and stock in one place. It\n        aims to keep every branch on the same menu and prices, cut the time spent on daily reports and\n        let managers see sales and stock at a glance.'],
  [phrase('a design language for background applications, is refined by the FABi CMS team'), 'a back office for restaurants, keeps menus, orders and staff in one place'],
  [/FABi CMS, a design language(?=<)/g, 'FABi CMS, a back office for restaurants'],
  // Skeleton "children", "list"
  [phrase('We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'),
    'Each module comes with short guides, checklists and import templates, so a new branch can set up its menu and tables in a day.'],
  // Flex "combination"
  [/(?:antd|FABi CMS) is an enterprise-class UI design language and React UI library\./g, 'FABi CMS keeps the menus, orders and staff of every branch in one place.'],
  // Drawer / Modal "style-class": the antd intro and its feature list
  [/Following the FABi CMS specification, we developed a React UI library antd that contains a\s+set of high quality components and demos for building rich, interactive user interfaces\./g,
    'FABi CMS brings the daily work of a restaurant into one back office: menus, orders, tables,\n      staff and stock, the same in every branch.'],
  [/🌈 Enterprise-class UI designed for web applications\./g, '🍜 Menus and prices shared by every branch.'],
  [/📦 A set of high-quality React components out of the box\./g, '🧾 Orders from the counter, tables and delivery in one list.'],
  [/🛡 Written in TypeScript with predictable static types\./g, '👥 Staff shifts, roles and permissions.'],
  [/⚙️ Whole package of design resources and development tools\./g, '📦 Stock levels with low-stock alerts.'],
  [/🌍 Internationalization support for dozens of languages\./g, '📊 Daily sales reports per branch.'],
  [/🎨 Powerful theme customization in every detail\./g, '🎨 Your brand colours on every screen.'],
  // Tooltip / Popover / Popconfirm "shift"
  [/Thanks for using antd\. Have a nice day !/g, 'Thanks for using FABi CMS. Have a nice day!'],
  // AutoComplete "certain-category": search groups of a restaurant back office
  [/href="https:\/\/www\.google\.com\/search\?q=antd"/g, 'href="https://example.com"'],
  [/<Title title="Libraries" \/>,\s*options: \[renderItem\('AntDesign', 10000\), renderItem\('AntDesign UI', 10600\)\]/g,
    "<Title title=\"Dishes\" />,\n    options: [renderItem('Beef pho', 10000), renderItem('Chicken pho', 10600)]"],
  [/<Title title="Solutions" \/>,\s*options: \[renderItem\('AntDesign UI FAQ', 60100\), renderItem\('AntDesign FAQ', 30010\)\]/g,
    "<Title title=\"Branches\" />,\n    options: [renderItem('District 1 branch', 60100), renderItem('District 3 branch', 30010)]"],
  [/<Title title="Articles" \/>,\s*options: \[renderItem\('AntDesign design language', 100000\)\]/g,
    "<Title title=\"Reports\" />,\n    options: [renderItem('Daily sales report', 100000)]"],
  // Input "advance-count" (same lengths: 12 characters over a max of 10; 6 runes at a max of 6)
  [/"Hello, antd!"/g, '"Hello, FABi!"'],
  [/"🔥 antd"/g, '"🔥 FABi"'],
  // Drawer "user-profile", Space "compact", Form "global-state"
  [/AntDesign@example\.com/g, 'lily@example.com'],
  [/(>\s*)github\.com\/ant-design\/ant-design(\s*<)/g, '$1example.com/lily$2'],
  [/git@github\.com:ant-design\/ant-design\.git/g, 'git@example.com:fabi/menu.git'],
  [/'antd@example\.com'/g, "'manager@example.com'"],
  // code comments shown in "Show code": an antd CodeSandbox reproduction, the antd site's header
  [/^[ \t]*\/\/ https:\/\/codesandbox\.io\/[^\n]*\n/gm, ''],
  [/\/\/ antd site header height/g, '// height of a sticky page header'],
]
const sampleText = (code) => SAMPLE_TEXT.reduce((s, [find, repl]) => s.replace(find, repl), code)

// ---------- accessibility patches for demo code (WCAG, user request 2026-09-30) ----------
// Controls that only have a placeholder get an aria-label (from the placeholder, else a generic
// name); sliders get ariaLabelForHandle; images get alt. Only tags that have none of these.
const NAMED_CONTROLS = {
  Input: 'Input', 'Input.Password': 'Password', 'Input.Search': 'Search', 'Input.TextArea': 'Text', TextArea: 'Text',
  'Input.OTP': 'One-time code', InputNumber: 'Number', Select: 'Select', AutoComplete: 'Search', Cascader: 'Select',
  DatePicker: 'Date', 'DatePicker.RangePicker': 'Date range', RangePicker: 'Date range', TimePicker: 'Time',
  'TimePicker.RangePicker': 'Time range', TreeSelect: 'Select', Mentions: 'Mention', Switch: 'Switch',
  Progress: 'Progress', QRCode: 'QR code',
}
// named only when they have no visible text (self-closing tag)
const TEXTLESS_CONTROLS = { Checkbox: 'Checkbox', Radio: 'Radio' }
// inline colours in demo code that fail 4.5:1 → the accessible step of the same antd hue
const DEMO_COLOURS = {
  '1677ff': '0958d9', '1890ff': '0958d9', '4096ff': '0958d9', '108ee9': '0958d9', '2db7f5': '0958d9',
  ff5500: 'ad2102', f50: 'ad2102', fa541c: 'ad2102', '52c41a': '237804', '87d068': '237804',
  eb2f96: 'c41d7f', '13c2c2': '006d75', '00a2ae': '006d75', f56a00: '873800', faad14: 'ad4e00',
  '7265e6': '531dab', ffbf00: '874d00',
  // light tints used as text colour in the "Custom semantic dom styling" demos
  a7aae1: '531dab', b8bdfd: '531dab', a294f9: '531dab', '8f87f1': '531dab', eca1a7: 'cf1322', cccccc: '666666',
  '4da8da': '0958d9', ff4d4f: 'cf1322', ff7875: 'a8071a', bde3c3: '237804', f5d2d2: 'a8071a', '9ca3af': '595959',
  '55acee': '0958d9', '8dbcc7': '006d75', '696fc7': '531dab', e6f4ff: '0958d9', b7eb8f: '237804', '00b96b': '237804',
}
const ALT_TAGS = { Avatar: 'Avatar', Image: 'Image', img: '' }

/** End index of the JSX opening tag that starts at `start` (skips {…} and quoted strings). */
function tagEnd(code, start) {
  let depth = 0
  let quote = null
  for (let i = start; i < code.length; i++) {
    const c = code[i]
    if (quote) { if (c === quote) quote = null; continue }
    if (c === '"' || c === "'" || c === '`') { if (depth === 0 || c === '`') quote = c; continue }
    if (c === '{') depth++
    else if (c === '}') depth--
    else if (c === '>' && depth === 0) return i
  }
  return -1
}

function a11yPatch(code) {
  code = code.replace(new RegExp(`(['"])#(${Object.keys(DEMO_COLOURS).join('|')})\\1`, 'gi'), (m, q, hex) => `${q}#${DEMO_COLOURS[hex.toLowerCase()]}${q}`)
  const names = [...Object.keys(NAMED_CONTROLS), ...Object.keys(TEXTLESS_CONTROLS), 'Slider', ...Object.keys(ALT_TAGS)]
    .sort((a, b) => b.length - a.length).map((n) => n.replace('.', '\\.'))
  const re = new RegExp(`<(${names.join('|')})(?=[\\s/>])`, 'g')
  let out = ''
  let last = 0
  for (const m of code.matchAll(re)) {
    const tag = m[1]
    const nameEnd = m.index + m[0].length
    const end = tagEnd(code, nameEnd)
    if (end < 0) continue
    const attrs = code.slice(nameEnd, end)
    // skip type positions like `Select<Option>` generics or JSX closing text
    if (/^[<]/.test(attrs.trim())) continue
    let add = ''
    if (tag === 'Slider') {
      if (!/ariaLabelForHandle|aria-label/.test(attrs)) add = ' ariaLabelForHandle="Slider"'
    } else if (tag in TEXTLESS_CONTROLS) {
      if (/\/\s*$/.test(attrs) && !/aria-label/.test(attrs)) add = ` aria-label="${TEXTLESS_CONTROLS[tag]}"`
    } else if (tag in ALT_TAGS) {
      if (/\bsrc=/.test(attrs) && !/\balt=/.test(attrs)) add = ` alt="${ALT_TAGS[tag]}"`
    } else if (!/aria-label|aria-labelledby|\bid=/.test(attrs)) {
      const ph = attrs.match(/\bplaceholder="([^"]+)"/)
      add = ` aria-label="${(ph ? ph[1] : NAMED_CONTROLS[tag]).replace(/"/g, '')}"`
    }
    if (add) { out += code.slice(last, nameEnd) + add; last = nameEnd }
  }
  return out + code.slice(last)
}

// ---------- Dark mode for demos that hard-code light colours (2026-10-01) ----------
// These examples set their own text / background colours for a white page, so in Dark (Mode toolbar)
// they put white text on a light box or dark-blue text on a dark one. Each such colour becomes
// light-dark(<as before>, <dark counterpart>): Light renders exactly as before, Dark takes the
// counterpart from antd's dark palettes (FabiProvider / the docs set color-scheme: dark):
//   text, chromatic → that hue's dark step 8 (≥ 4.7:1 on the dark surfaces) · text, dark grey → antd's
//   dark text rgba(255,255,255,.85), mid grey → .65 · background, light tint → the hue's dark step 1,
//   mid tone → dark step 3 · background, near white → antd's dark fill rgba(255,255,255,.04) / .08.
// Dark colours and white / light-grey text are left alone. Only the files listed (they fail in Dark).
const DARK_DEMOS = {
  anchor: ['style-class.tsx'], breadcrumb: ['style-class.tsx'], card: ['style-class.tsx'], checkbox: ['style-class.tsx'],
  'config-provider': ['direction.tsx'], descriptions: ['style-class.tsx'], form: ['style-class.tsx'],
  grid: ['gutter.tsx', 'playground.tsx'], input: ['style-class.tsx'], 'input-number': ['style-class.tsx'],
  menu: ['style-class.tsx'], radio: ['style-class.tsx'], result: ['style-class.tsx'], statistic: ['style-class.tsx'],
  table: ['style-class.tsx'], tabs: ['style-class.tsx'], tag: ['style-class.tsx'], transfer: ['style-class.tsx'],
  tree: ['basic.tsx'], upload: ['upload-custom-action-icon.tsx'],
}
const HUES = ['red', 'volcano', 'orange', 'gold', 'yellow', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple', 'magenta']
const NAMED = { blue: '#0000ff', red: '#ff0000', green: '#008000', black: '#000000', gray: '#808080', grey: '#808080' }
function parseColour(s) {
  s = NAMED[s.toLowerCase()] ?? s
  let m = s.match(/^#([0-9a-f]{3,8})$/i)
  if (m) {
    let h = m[1]
    if (h.length <= 4) h = [...h].map((c) => c + c).join('')
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 }
  }
  m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i)
  return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null
}
function darkCounterpart(value, role) {
  const c = parseColour(value)
  if (!c) return null
  // as it looks on the white page
  const [r, g, b] = [c.r, c.g, c.b].map((v) => v * c.a + 255 * (1 - c.a))
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  const Y = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  if (max - min < 24) {
    // neutral grey
    if (role === 'text') return Y >= 0.35 ? null : `rgba(255, 255, 255, ${Y < 0.05 ? 0.85 : 0.65})`
    return Y > 0.9 ? 'rgba(255, 255, 255, 0.04)' : Y > 0.7 ? 'rgba(255, 255, 255, 0.08)' : null
  }
  const hue = (h) => {
    const [R, G, B] = [h.r, h.g, h.b], mx = Math.max(R, G, B), d = mx - Math.min(R, G, B)
    const x = mx === R ? ((G - B) / d) % 6 : mx === G ? (B - R) / d + 2 : (R - G) / d + 4
    return (x * 60 + 360) % 360
  }
  const own = hue({ r, g, b })
  const dist = (h) => Math.min(Math.abs(h - own), 360 - Math.abs(h - own))
  const near = HUES.map((n) => ({ n, d: dist(hue(parseColour(antdColors[n][5]))) })).sort((x, y) => x.d - y.d)[0].n
  const dark = antdColors.generate(antdColors[near][5], { theme: 'dark' })
  if (role === 'text') return dark[7]
  return Y > 0.7 ? dark[0] : Y > 0.15 ? dark[2] : null
}
const COLOUR = String.raw`#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:blue|red|green|black|gr[ae]y)\b`
function darkPatch(code) {
  const role = (prop) => (/^color$/i.test(prop) ? 'text' : 'bg')
  const wrap = (prop, value) => {
    const dark = darkCounterpart(value, role(prop))
    return dark ? `light-dark(${value}, ${dark})` : value
  }
  return code
    // JS style objects, conditional: backgroundColor: cond ? '<colour>' : '<colour>'
    .replace(new RegExp(String.raw`(\b(color|backgroundColor|background)\s*:\s*[\w.?!\[\]\s]*\?\s*)(['"])(${COLOUR})\3(\s*:\s*)(['"])(${COLOUR})\6`, 'g'),
      (m, pre, prop, q1, v1, mid, q2, v2) => `${pre}${q1}${wrap(prop, v1)}${q1}${mid}${q2}${wrap(prop, v2)}${q2}`)
    // JS style objects: color / backgroundColor / background: '<colour>'
    .replace(new RegExp(String.raw`(\b(?:color|backgroundColor|background)\s*:\s*)(['"])(${COLOUR})\2`, 'g'), (m, pre, q, value) => `${pre}${q}${wrap(pre.match(/\w+/)[0], value)}${q}`)
    // CSS in template literals: color / background-color / background: <colour>;
    .replace(new RegExp(String.raw`(^|[\s;{])((?:background-)?color|background)(\s*:\s*)(${COLOUR})(\s*[;!])`, 'gm'), (m, lead, prop, sep, value, end) => `${lead}${prop}${sep}${wrap(prop === 'color' ? 'color' : 'bg', value)}${end}`)
}

// Accessibility rules turned off for single examples, only where the markup comes from antd itself or
// the example's purpose, and the fix is not possible in the demo. Key: "<folder>:<example title>".
const A11Y_EXEMPT = {
  // shows four whole-page layouts side by side, so <main> repeats by design
  'layout:Basic Structure': { rules: ['landmark-no-duplicate-main', 'landmark-unique'], why: 'several page layouts on one page by design' },
  // antd gives the custom <TextArea> input role="combobox", which HTML does not allow on a textarea
  'auto-complete:Customize Input Component': { rules: ['aria-allowed-role'], why: 'antd sets role=combobox on the custom TextArea' },
  // editable Tabs: antd renders the "add tab" button inside the tablist
  'tabs:Size': { rules: ['aria-required-children'], why: 'antd renders the add-tab button inside the tablist' },
  'tabs:Add & close tab': { rules: ['aria-required-children'], why: 'antd renders the add-tab button inside the tablist' },
  'tabs:Customized trigger of new tab': { rules: ['aria-required-children'], why: 'antd renders the add-tab button inside the tablist' },
  'tabs:Draggable Tabs': { rules: ['aria-required-children'], why: 'antd renders the add-tab button inside the tablist' },
  // ghost buttons put coloured text on a dark backdrop; no single backdrop gives 4.5:1 for white,
  // primary and danger text at once
  'button:Ghost Button': { rules: ['color-contrast'], why: 'ghost buttons show coloured text on a dark backdrop by design' },
}

// Drag-and-drop demos spread dnd-kit `attributes` (role="button") onto rows / tabs that already hold
// interactive content or have their own role; drop that role (a11y: nested-interactive, aria-required-parent).
const dropDndRole = (code) => code
  .replace(/\{\.\.\.attributes\}/g, '{...attributes} role={undefined} aria-roledescription={undefined}')
  .replace(/\.\.\.attributes,/g, "...attributes, role: undefined, 'aria-roledescription': undefined,")

// Does the JSX tag whose attributes start at `from` already set `name`? (a duplicate attribute is a
// TypeScript error, TS17001, in the developer's copy of the demo)
const hasAttr = (src, from, name) => {
  let depth = 0
  let quote = ''
  let i = from
  for (; i < src.length; i++) {
    const c = src[i]
    if (quote) { if (c === quote) quote = ''; continue }
    if (c === '"' || c === "'" || c === '`') quote = c
    else if (c === '{') depth++
    else if (c === '}') depth--
    else if (c === '>' && depth === 0) break
  }
  // attribute names at the top level of the tag only (blank out `{…}` values first)
  let top = ''
  depth = 0
  for (const c of src.slice(from, i)) {
    if (c === '{') depth++
    if (depth === 0) top += c
    if (c === '}') depth--
  }
  return new RegExp(`(^|\\s)${name}(?=[\\s=/]|$)`).test(top)
}

const DEMO_PATCHES = {
  table: (code) =>
    dropDndRole(code)
      .replace(/<Table(<[^>]*>)?(?=[\s/>])/g, (m, _g, at, src) => (hasAttr(src, at + m.length, 'bordered') ? m : `${m} bordered`))
      .replace(/const \[bordered, setBordered\] = useState\(false\)/g, 'const [bordered, setBordered] = useState(true)'),
  tabs: (code) => dropDndRole(code),
  upload: (code) => dropDndRole(code),
  // faded text in custom-style demos (opacity under ~0.8 drops text below 4.5:1)
  divider: (code) => code.replace("root: { opacity: 0.6, cursor: 'default' }", "root: { opacity: 0.85, cursor: 'default' }"),
  calendar: (code, file) => {
    // 0.85 (Light) / 0.92 (Dark): the faded red holiday names stay ≥ 4.5:1 (0.85 is 4.3:1 in Dark)
    code = code.replace(/(&\.gray \{\s*opacity: )0\.4;?/, "$10.85;\n      [data-fabi-mode='dark'] & { opacity: 0.92; }")
    // event bars: white text on the status colours, which are under 4.5:1 under white text in Dark →
    // in Dark the bar takes the colour's border tint (Light unchanged)
    if (file === 'event-range.tsx') {
      code = code.replace(/color: token\.(colorPrimary|colorSuccess|colorWarning|colorError),/g, (m, t) => `color: \`light-dark(\${token.${t}}, \${token.${t}Border})\`,`)
    }
    return code
  },
  // DEMO_COLOURS turns the light-blue value background (#e6f4ff, a text colour in other demos) into the
  // text colour, which hid the number (1:1, which axe only reports as "needs review"); restore it
  statistic: (code, file) => (file === 'style-class.tsx' ? code.replace(/backgroundColor: '#0958d9',(\s*borderRadius: 4,)/, "backgroundColor: '#e6f4ff',$1") : code),
  timeline: (code) => code.replace(/opacity: 0\.45,/g, 'opacity: 0.8,'),
  // the example links to the API section; heading ids are lower case here
  empty: (code) => code.replace(/href="#API"/g, 'href="#api"'),
  // Semantic DOM preview: the "Toggle Border" label follows the docs language (useLocale, i18n/vi/ui.json) and
  // also names the switch
  descriptions: (code, file) => (file !== '_semantic.tsx' ? code : code
    .replace(/( {2}cn: \{\n)/, "$1    toggleBorder: '\u5207\u6362\u8fb9\u6846',\n")
    .replace(/( {2}en: \{\n)/, "$1    toggleBorder: 'Toggle Border',\n")
    .replace(/(const \[bordered, setBordered\] = React\.useState\(false\);\n)/, '$1  const [locale] = useLocale(locales);\n')
    .replace(/<Switch aria-label="Switch" checked=\{bordered\} onChange=\{setBordered\} \/>\n(\s*)Toggle Border/, '<Switch aria-label={locale.toggleBorder} checked={bordered} onChange={setBordered} />\n$1{locale.toggleBorder}')),
  // empty example links in the RTL demo need a name
  // and the link inside the RTL note's sentence is underlined (a dark brand link is < 3:1 against the
  // text around it; a11y: link-in-text-block)
  'config-provider': (code) => code
    .replace(/<a href="#" className=\{styles\.headerExample\} \/>/g, '<a href="#" aria-label="Example link" className={styles.headerExample} />')
    .replace(/(<a\s+href="https:\/\/example\.com"\s+target="_blank"\s+rel="noopener noreferrer")(\s*>\s*rc-rate)/, "$1 style={{ textDecoration: 'underline' }}$2"),
  // the Layout demo shows several page layouts at once: each header / main / footer / sider is a
  // uniquely named region instead of repeating the page-level landmarks
  layout: (code, file) => {
    if (file !== 'basic.tsx') return code
    // header / footer → named groups (allowed roles); sider (aside) → named region. <main> allows
    // no role, so the repeated Content is covered by A11Y_EXEMPT below.
    const n = { Header: 0, Footer: 0, Sider: 0 }
    const role = { Header: 'group', Footer: 'group', Sider: 'region' }
    return code.replace(/<(Header|Footer|Sider)(?=[\s>])/g, (m, tag) => `<${tag} role="${role[tag]}" aria-label="${tag} ${++n[tag]}"`)
  },
  // "shift" demos: an always-open popup on a button in the middle of a 300vw area. In <body> it sits far right
  // of the docs page and widens it on a phone; inside the demo area the canvas clips and scrolls it.
  // "basic": antd's site intro (a design language, Sketch / Axure resources, links to antd site pages that are
  // 404 here) → a restaurant back-office intro; the same headings, paragraphs, list of links and keyboard hint
  typography: (code, file) => (file !== 'basic.tsx' ? code : code.replace(/(    <Title>)Introduction<\/Title>[\s\S]*?<\/ul>\n    <\/Paragraph>/, `$1Introduction</Title>

    <Paragraph>
      A restaurant group runs menus, orders, staff and stock in many branches. When every branch keeps
      its own spreadsheets and habits, prices drift apart, reports disagree and new staff need longer to
      learn the job.
    </Paragraph>

    <Paragraph>
      FABi CMS brings this work into one back office, which aims to{' '}
      <Text strong>
        keep every branch on the same menu, prices and processes, cut the time spent on daily reports
        and let managers see sales and stock at a glance
      </Text>
      .
    </Paragraph>

    <Title level={2}>Guides and Resources</Title>

    <Paragraph>
      Each module comes with short guides, checklists and import templates (<Text code>Excel</Text> and{' '}
      <Text code>CSV</Text>), so a new branch can set up its menu and tables in a day.
    </Paragraph>

    <Paragraph>
      <ul>
        <li>
          <Link href="https://example.com">Menu setup guide</Link>
        </li>
        <li>
          <Link href="https://example.com">Opening checklist</Link>
        </li>
        <li>
          <Link href="https://example.com">Import templates</Link>
        </li>
      </ul>
    </Paragraph>`)),
  tooltip: (code, file) => shiftPopupInDemo(code, file),
  popover: (code, file) => shiftPopupInDemo(code, file),
  popconfirm: (code, file) => shiftPopupInDemo(code, file),
}

function shiftPopupInDemo(code, file) {
  if (file !== 'shift.tsx') return code
  return code.replace(/ open>/, ' open getPopupContainer={(trigger) => trigger.parentElement ?? document.body}>')
}

// ---------- helpers ----------
const js = (s) => JSON.stringify(s)

function splitFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { meta: {}, body: text }
  return { meta: YAML.parse(m[1]) ?? {}, body: text.slice(m[0].length) }
}

/** English half of a demo .md ("## zh-CN … ## en-US …"). */
function demoDescription(mdPath) {
  if (!fs.existsSync(mdPath)) return ''
  const { body } = splitFrontmatter(fs.readFileSync(mdPath, 'utf8'))
  const m = body.match(/##\s*en-US\s*\r?\n([\s\S]*?)(?=\r?\n##\s*[a-z]{2}-[A-Z]{2}\s*\r?\n|$)/)
  return fixMarkdown((m ? m[1] : body).trim())
}

const HTML_TAGS = new Set('a abbr b blockquote br code del div em h1 h2 h3 h4 h5 h6 hr i img kbd li ol p pre s small source span strong sub sup table tbody td th thead tr u ul video iframe'.split(' '))

/**
 * Make dumi markdown safe for Storybook's <Markdown> (markdown-to-jsx):
 * site-relative links point at ant.design, heading anchors `{#id}` go away, HTML
 * comments go away, and JSX-looking text outside code (`MouseEvent<HTMLElement>`)
 * is escaped so it is not rendered as an element.
 */
function fixMarkdown(md) {
  let inFence = false
  const out = md
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\r?\n/)
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return line }
      if (inFence) return line
      line = line.replace(/^(#{1,6} .*?)\s*\{#[^}]+\}\s*$/, '$1')
      line = line.replace(/\]\((\/(?:components|docs|changelog)[^)]*)\)/g, (_, p) => `](${SITE}${p})`)
      // autolinks <https://…> become normal links before `<` is escaped
      line = line.replace(/<((?:https?|mailto):[^>\s]+)>/g, '[$1]($1)')
      // escape `<` outside inline code unless it opens a known HTML tag
      return line
        .split(/(`+[^`]*`+)/)
        .map((part) => (part.startsWith('`') ? part : part.replace(/<(?!\/?([a-z][a-z0-9]*)\b)|<(\/?)([a-z][a-z0-9]*)\b/g, (all, _a, close, tag) => {
          if (tag && HTML_TAGS.has(tag)) return all
          return '&lt;' + (close ?? '') + (tag ?? '')
        })))
        .join('')
    })
    .join('\n')
    .trim()
  // full-width Chinese punctuation (\uff1a\uff0c\u3001\uff08\uff09…) → ASCII already in the source, so no Chinese characters reach the
  // translation catalogs either (no-Chinese rule, scripts/no-chinese.mjs)
  return halfWidth(out)
}

/**
 * dumi container blocks (`:::info{title=Tips}` … `:::`) become blockquotes with a bold title,
 * which markdown-to-jsx renders. Applied after translation, so a translated title is kept.
 */
const CONTAINER_TITLES = { vi: { warning: 'Cảnh báo', other: 'Lưu ý' }, en: { warning: 'Warning', other: 'Note' } }
function containers(md, lang = 'vi') {
  return md.replace(/^:::(info|warning|success|error)(?:\{title=([^}]*)\})?[ \t]*\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, (_, kind, title, body) => {
    const head = `**${title ?? CONTAINER_TITLES[lang][kind === 'warning' ? 'warning' : 'other']}**`
    return [head, '', body].join('\n').split('\n').map((l) => (l ? `> ${l}` : '>')).join('\n')
  })
}

// ---------- brand cleanup (user 2026-09-30: no links to Ant Design, no Ant promotion) ----------
// Links to Ant Design / Ant Group properties lose the link and keep their text; sections that
// only advertise Ant products are dropped. Applied to the final (translated) markdown.
// Ant Group / Alibaba properties and antd project pages (issues, CodeSandbox reproductions,
// react-component demos, iconfont, npm pages of @ant-design packages, antd authors' repos)
const ANT_HOST = String.raw`(?:[a-z0-9-]+\.)*(?:ant\.design|antgroup\.com|alipay\.com|alipayobjects\.com|alicdn\.com|antfin\.com|antv\.vision|antv\.antgroup\.com|umijs\.org|yuque\.com|iconfont\.cn|react-component\.now\.sh)`
const ANT_LINK = new RegExp(String.raw`^(?:https?:)?\/\/(?:${ANT_HOST}|github\.com\/(?:ant-design|antvis|react-component|umijs|afc163|dvajs|nanxiaobei\/antd|Beven91\/webpack-ant)|codesandbox\.io|codepen\.io\/afc163|zhuanlan\.zhihu\.com|upload-react-component\.vercel\.app|unpkg\.com\/antd|(?:www\.)?npmjs\.com\/package\/@ant-design)`, 'i')
const ANT_MEDIA = new RegExp(String.raw`(?:https?:)?\/\/(?:${ANT_HOST}|user-images\.githubusercontent\.com|github\.com\/ant-design\/[^\s)"']*\/assets)[^\s)"']*`, 'i')
// ## / ### sections that only promote Ant products or packages; the Vietnamese text has the glossary heading
// (scripts/i18n.mjs HEADING_GLOSSARY fixes it)
// (Customize Theme "Theme editor": a tool of the antd site, not part of this Storybook)
const DROP_SECTIONS = ['## Promotion', '## Design Guide', '### Programmatic Usage', '### Custom Font Icon', '### Theme editor']
const DROP_SECTIONS_BY_LANG = {
  en: DROP_SECTIONS,
  vi: DROP_SECTIONS.map((h) => h.replace(/^(#+ )(.*)$/, (_, level, text) => level + (glossaryHeading(text) || text))),
}
// examples that load scripts from Alibaba's iconfont.cn CDN (at.alicdn.com)
const SKIP_DEMOS = new Set(['icon/iconfont.tsx', 'icon/scriptUrl.tsx'])

/**
 * Replace `antd` in running text with "thư viện" / "the library" — never inside code (fences, `inline`).
 * English: "The library" at the start of a sentence, a list item or a table cell.
 */
function neutralLibraryName(md, lang = 'vi') {
  const name = lang === 'en' ? 'the library' : 'thư viện'
  const capital = (s) => (lang === 'en' ? s.replace(/(^|[.!?]\s+|^\s*(?:[-*>]|\d+\.)\s+|\|\s*)the library/g, '$1The library') : s)
  let fence = false
  return md.split('\n').map((line) => {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return line }
    if (fence) return line
    return capital(line.split(/(`+[^`]*`+)/).map((part) => (part === '`antd`' ? name : part.startsWith('`') ? part : part.replace(/\bantd\b(?![/-]|\.\w|@)/g, name))).join(''))
  }).join('\n')
}

// ---------- text that only pointed at an upstream page (2026-10-01, both languages) ----------
// Links to Ant sites lose their link and keep their text (debrand below). Where the link was the whole point
// ("See #12479.", "Related issues: …", "Please refer to the blog …", "[Example](codesandbox)"), the text would
// point nowhere, so it goes first: the sentence, or only the clause / parenthesis holding the link when the rest
// still says something. Keyed on the links, which the translations keep, so the same text goes in both languages.
// pages whose sentence always goes (articles, the antd site's FAQ / blog / guides)
const POINTER_PAGES = /^https?:\/\/(?:5x\.ant\.design|motion\.ant\.design|zhuanlan\.zhihu\.com|ant\.design\/docs\/(?:blog\/|react\/(?:faq|common-props|use-custom-date-library|i18n#adding-new-language)))/i
// link texts that say nothing without their link
const POINTER_TEXT = /^(?:#\d+|(?:https?:)?\/\/\S+|(?:see |xem )?(?:an? |this |the |a complete |online |sandbox )?(?:example|demo|here|codesandbox|more|ví dụ|tại đây|đây|bản demo|demo này)s?|(?:example|ví dụ) (?:on|trên) codepen|rc-field-form demo|demo rc-field-form)$/i
const MD_LINK = /\[([^\]\n]*)\]\(([^)\s]+)\)/
const TOKEN = /\u0001(\d+)\u0002/g
const wordCount = (s) => s.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length
// a sentence this short after its pointer went says nothing ("See.", "Bạn có thể lấy theo cách này."); Vietnamese
// words are single syllables, so the same sentence has more of them
const SHORT = { en: 6, vi: 8 }

/**
 * One line of prose or one table cell, with inline code and links masked as tokens (the kinds: code, other
 * link, Ant link, pointer, pointer page). Returns the text without its pointers.
 */
function dropPointerText(text, lang) {
  const tokens = []
  const masked = text.replace(new RegExp(String.raw`(\`+)[^\`]*?\1|${MD_LINK.source}`, 'g'), (m) => `\u0001${tokens.push(m) - 1}\u0002`)
  const kind = (i) => {
    const l = tokens[i].match(MD_LINK)
    if (!l || tokens[i].startsWith('`')) return 'code'
    if (!ANT_LINK.test(l[2])) return 'other'
    if (POINTER_PAGES.test(l[2])) return 'page'
    return /codesandbox\.io/.test(l[2]) || POINTER_TEXT.test(l[1].trim()) ? 'pointer' : 'ant'
  }
  const kinds = (s) => [...s.matchAll(TOKEN)].map((m) => kind(+m[1]))
  const points = (s) => kinds(s).some((k) => k === 'pointer' || k === 'page')
  const words = (s) => wordCount(s.replace(TOKEN, (m, i) => (kind(+i) === 'code' ? 'x' : tokens[+i].match(MD_LINK)[1])))
  // parentheses: "(#5605)", "([how it looks](issue))", "(since 5.1.0, [sandbox demo](…))"
  let out = masked.replace(/[ \t]*[,\uff0c]?[ \t]*[\uff08(]([^()\uff08\uff09]*)[\uff09)]/g, (m, inner) => {
    const k = kinds(inner)
    if (!k.length) return m
    if (!inner.replace(TOKEN, '').replace(/[\s,\uff0c\u3001]/g, '') && k.every((x) => x !== 'code' && x !== 'other')) return ''
    if (!points(inner)) return m
    const kept = inner.split(/(?<=[,\uff0c])/).filter((c) => !points(c)).join('').trim().replace(/[,\uff0c]$/, '')
    return kept ? m.replace(/[\uff08(][^()\uff08\uff09]*[\uff09)]/, `(${kept})`) : ''
  })
  out = out.split(/(?<=[.!?\u3002])\s+/).map((s) => {
    if (!points(s)) return s
    if (kinds(s).includes('page')) return ''
    const end = s.trim().match(/[.!?\u3002]$/)?.[0] ?? '.'
    // "…: <link>" ending the sentence (a sandbox, a bare URL): what comes before the colon usually still says something
    let rest = s.replace(/\s*[:\uff1a]\s*\u0001(\d+)\u0002\s*[.\u3002]?\s*$/, (m, i) => (kind(+i) === 'pointer' ? end : m))
    let short = rest === s ? SHORT[lang] : 4
    // else the clauses (between commas / semicolons) that hold one
    if (points(rest)) {
      rest = rest.split(/(?<=[,\uff0c;\uff1b])/).filter((c) => !points(c)).join('').trim().replace(/[,\uff0c;\uff1b]$/, '')
      short = SHORT[lang]
      if (rest && end && !/[.!?\u3002:]$/.test(rest)) rest += end
    }
    rest = rest.replace(/\s+([.,;:!?])/g, '$1').replace(/[ \t]{2,}/g, ' ').trim()
    return words(rest) <= short ? '' : rest
  }).filter(Boolean).join(' ')
  return out.replace(TOKEN, (m, i) => tokens[+i])
}

/** Removes the pointer text (above) from a docs text; a heading whose whole section went goes too. */
function dropPointers(md, lang) {
  const GONE = '\u0000'
  let fence = false
  const lines = md.split('\n').map((line) => {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return line }
    if (fence || !line.includes('](') || /^#{1,6} /.test(line)) return line
    const prefix = line.match(/^\s*(?:>\s*)*(?:[-*+]\s+|\d+\.\s+)?/)[0]
    const body = line.slice(prefix.length)
    if (/^\s*\|/.test(line)) return line.split(/((?<!\\)\|)/).map((c) => (c === '|' || !c.includes('](') ? c : ` ${dropPointerText(c.trim(), lang)} `)).join('')
    // a list item that refers to an article or a site page goes whole ("Want to …? You can refer to \u300a…\u300b")
    if (/[-*+]\s+$/.test(prefix) && [...body.matchAll(new RegExp(MD_LINK, 'g'))].some(([, , u]) => ANT_LINK.test(u) && POINTER_PAGES.test(u))) return GONE
    const next = dropPointerText(body, lang)
    return next === body ? line : next ? prefix + next : GONE
  })
  // a short lead-in ("Ref:", "Related issues:") whose list went
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i] === GONE || !/[:\uff1a]\s*$/.test(lines[i]) || wordCount(lines[i]) > 3 || /^#{1,6} /.test(lines[i])) continue
    let j = i + 1
    while (j < lines.length && !lines[j].trim()) j++
    if (lines[j] === GONE) lines[i] = GONE
  }
  // a heading whose section held only removed lines ("### How to understand disabled time and date?")
  const level = (l) => l.match(/^(#{1,6}) /)?.[1].length ?? 0
  const out = lines.filter((line, i) => {
    if (!level(line)) return true
    let removed = false
    for (let j = i + 1; j < lines.length; j++) {
      if (level(lines[j])) return !(removed && level(lines[j]) <= level(line))
      if (lines[j] === GONE) removed = true
      else if (lines[j].trim()) return true
    }
    return !removed
  })
  return out.filter((l) => l !== GONE).join('\n')
}

// Sentences dropPointers would cut badly, handled first (both languages): a list of issue numbers inside a
// sentence that still says something, and two sandbox links whose lead-in reads as a sentence on its own.
const POINTER_EDITS = [
  [/Per issues (?:\[#\d+\]\([^)\s]+\),?\s*)+and /g, 'Per the '],
  [/Theo các issue (?:\[#\d+\]\([^)\s]+\),?\s*)+và /g, 'Theo '],
  // a sandbox link and its lead-in only
  [/^> (?:Here is a Intl\.NumberFormat InputNumber implementation|Đây là một cách triển khai InputNumber dùng Intl\.NumberFormat):[^\n]*\n?/m, ''],
  [/ (?:You can get by this way|Bạn có thể lấy theo cách này): \[[^\]]*\]\([^)\s]+\)/g, ''],
]

/**
 * Full-width Chinese punctuation copied from the source ("ref\uff1a", "\uff08For example …\uff09", "prefixCls \uff1f") → the
 * ASCII marks, outside code. Both languages.
 */
function halfWidth(md) {
  let fence = false
  return md.split('\n').map((line) => {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return line }
    if (fence || !/[\uff1a\uff0c\uff08\uff09\uff1b\uff1f\uff01\u3001\u3002\u300a\u300b]/.test(line)) return line
    return line.split(/(`+[^`]*`+)/).map((p) => (p.startsWith('`') ? p : p
      .replace(/:\s*\uff1a/g, ':')
      .replace(/\s*\uff1a\s*/g, ': ').replace(/\s*\uff0c\s*/g, ', ').replace(/\s*\uff1b\s*/g, '; ').replace(/\s*\u3001\s*/g, ', ')
      .replace(/\s*\u3002\s*/g, '. ').replace(/\s*\uff1f/g, '?').replace(/\s*\uff01/g, '!')
      .replace(/(^|\S)\s*\uff08\s*/g, (m, pre) => (pre ? `${pre} (` : '(')).replace(/\s*\uff09/g, ')')
      .replace(/\u300a/g, '“').replace(/\u300b/g, '”'))).join('')
      .replace(/[ \t]+$/, '').replace(/(\S) {2,}/g, '$1 ')
  }).join('\n')
}

/**
 * Brand cleanup of one docs text in its language ('vi' = the translation, 'en' = the English source):
 * the same decisions in both (scripts/brand-edits.mjs keeps the sentence rules of each language).
 */
function debrand(md, lang = 'vi') {
  // drop whole sections that only promote Ant products / packages
  for (const head of DROP_SECTIONS_BY_LANG[lang]) {
    const level = head.split(' ')[0]
    md = md.replace(new RegExp(`^${head}(?!\\w)[^\\n]*\\n[\\s\\S]*?(?=^#{1,${level.length}} |(?![\\s\\S]))`, 'gm'), '')
  }
  // Ant-hosted images, videos and site widgets that only wrap them
  md = md
    .replace(new RegExp(String.raw`!\[[^\]]*\]\(\s*${ANT_MEDIA.source}\s*\)`, 'gi'), '')
    .replace(new RegExp(String.raw`<img[^>]*${ANT_MEDIA.source}[^>]*>`, 'gi'), '')
    .replace(new RegExp(String.raw`<video[^>]*${ANT_MEDIA.source}[\s\S]*?(?:<\/video>|\/>)`, 'gi'), '')
    .replace(/<(ImagePreview|FlexWithImagePreview)[^>]*>\s*<\/\1>/g, '')
    // a site popover that previews an Ant-hosted screenshot (Timeline titleSpan, ConfigProvider popupOverflow)
    .replace(/[ \t]*(?:<|&lt;)InlinePopover[^>]*>\s*(?:<|&lt;)\/InlinePopover>/g, '')
  // other dumi site components that leak as raw text: <Badge>…</Badge> → bold, <Antd component="Alert" title="…"> → note
  md = md
    .replace(/(?:<|&lt;)Badge[^>]*>([^<&]*)(?:<|&lt;)\/Badge>/g, '**$1**')
    .replace(/(?:<|&lt;)Antd component="Alert" title="([^"]*)"[^>]*>\s*(?:<|&lt;)\/Antd>/g, '> $1')
  // Ant-hosted media URLs left inside example code → local illustration
  md = md.replace(/(?:https?:)?\/\/(?:[a-z0-9-]+\.)*(?:alipayobjects\.com|alicdn\.com)[^\s)"'`]*|https?:\/\/user-images\.githubusercontent\.com[^\s)"'`]*/gi, '/mock-assets/illustration.svg')
  // dumi's <InstallDependencies npm='…'> (escaped to &lt; by fixMarkdown) → a normal code block
  md = md.replace(/(?:<|&lt;)InstallDependencies npm='([^']+)'[^>]*>\s*(?:<|&lt;)\/InstallDependencies>/g, (_, npm) => '```bash\n' + npm + '\n```')
  // text that only pointed at an upstream page; then [text](ant link) → text, and every remaining bare Ant
  // URL outside code is removed (markdown-to-jsx would turn a bare URL back into a link). Links to the
  // upstream docs files of another component (../tooltip/index.en-US.md#api) keep their text.
  // the Common props line: it refers to the antd site's common-props page (no FABi page for it)
  md = md.replace(/^[^\n]*\]\(https:\/\/ant\.design\/docs\/react\/common-props\)[^\n]*\n?/gm, '')
  for (const [find, repl] of POINTER_EDITS) md = md.replace(find, repl)
  md = dropPointers(md, lang)
  md = md.replace(/\[([^\]]*)\]\(([^)\s]+)\)/g, (all, text, url) => (ANT_LINK.test(url) || /\.md(?:#|$)/.test(url) ? (ANT_LINK.test(text) ? '' : text) : all))
  const bareAnt = new RegExp(String.raw`\(?\s*(?:&lt;|<)?(?:${ANT_LINK.source.slice(1)})[^\s)>]*(?:>)?\s*\)?`, 'gi')
  let fence = false
  md = md.split('\n').map((line) => {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return line }
    return fence ? line : line.split(/(`+[^`]*`+)/).map((p) => (p.startsWith('`') ? p : p.replace(bareAnt, ''))).join('')
  }).join('\n')
  // sentence-level brand edits (scripts/brand-edits.mjs), the library name in prose, then the
  // @fabi/ui package names and fabi- prefixes (scripts/fabi-names.mjs)
  // then the version history (scripts/doc-cleanup.mjs)
  return codeEscapes(dropVersionNotes(halfWidth(fabiDocs(neutralLibraryName(applyBrandEdits(md, lang), lang), lang)))).replace(/\n{3,}/g, '\n\n').trim()
}

/**
 * Escapes fixMarkdown leaves visible (review 2026-10-14). Applied after translation, so the catalog keys stay:
 * - `\<` in the source markdown (Select optionRender "FlattenOptionData\<BaseOptionType\>") became `\&lt;`, which
 *   shows "&lt;": the backslash goes (and the one before `>`), `&lt;` renders as `<`;
 * - an indented code block (Typography "copyable": `Promise<string>`) is not a fence, so its `<` was escaped too
 *   and code shows entities as written: back to `<` there.
 */
function codeEscapes(md) {
  let fence = false
  let code = false
  let prev = '' // the line before
  let lastText = '' // the last non-blank line before
  return md.split('\n').map((line) => {
    const fenceLine = /^\s*(```|~~~)/.test(line)
    if (fenceLine) fence = !fence
    let out = line
    if (fence || fenceLine) code = false
    else {
      // an indented block starts after a blank line that does not follow a list item or a table row, and goes on
      // until a line that is not indented
      if (/^ {4,}\S/.test(line)) code ||= !prev.trim() && !/^\s*(?:[-*+]|\d+\.)\s|^\s*\|/.test(lastText)
      else if (line.trim()) code = false
      out = code
        ? line.replace(/&lt;/g, '<')
        : line.split(/(`+[^`]*`+)/).map((p) => (p.startsWith('`') ? p : p.replace(/\\&lt;/g, '&lt;').replace(/\\>/g, '>'))).join('')
    }
    prev = line
    if (line.trim()) lastText = line
    return out
  }).join('\n')
}

// ---------- two languages on one page (Language toolbar, user decision 2026-10-01) ----------
// A generated page holds the Vietnamese and the English text; the page component defines `vi` (true when
// the toolbar is VN) and renders only that language. Code blocks the two share are written once.
const FENCE = /^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[ \t]*$/gm

/** [text, code, text, code, …, text] */
function splitFences(md) {
  const parts = []
  let last = 0
  for (const m of md.matchAll(FENCE)) { parts.push(md.slice(last, m.index), m[0]); last = m.index + m[0].length }
  parts.push(md.slice(last))
  return parts
}

/** A JS expression for a markdown string in two languages. */
function bilingual(vi, en) {
  if (vi === en) return js(vi)
  const a = splitFences(vi)
  const b = splitFences(en)
  const sameCode = a.length > 1 && a.length === b.length && a.every((p, i) => i % 2 === 0 || p === b[i])
  if (!sameCode) return `vi ? ${js(vi)} : ${js(en)}`
  return '[' + a.map((p, i) => (i % 2 || p === b[i] ? js(p) : `vi ? ${js(p)} : ${js(b[i])}`)).join(', ') + "].join('')"
}

/** A <DocMarkdown> line in two languages ('' when both are empty). */
function mdBlock(vi, en, indent = '      ') {
  if (!vi && !en) return ''
  if (vi && en) return `${indent}<DocMarkdown>{${bilingual(vi, en)}}</DocMarkdown>`
  return `${indent}{${vi ? 'vi' : '!vi'} && <DocMarkdown>{${js(vi || en)}}</DocMarkdown>}`
}

/** The id markdown-to-jsx (Storybook's Markdown block) gives a heading: a few accents → ASCII, other characters dropped. */
const slug = (s) => s
  .replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g, 'a').replace(/[çÇ]/g, 'c').replace(/[ðÐ]/g, 'd').replace(/[ÈÉÊËéèêë]/g, 'e')
  .replace(/[ÏïÎîÍíÌì]/g, 'i').replace(/[Ññ]/g, 'n').replace(/[øØœŒÕõÔôÓóÒò]/g, 'o').replace(/[ÜüÛûÚúÙù]/g, 'u')
  .replace(/[ŸÿÝý]/g, 'y').replace(/[^a-z0-9- ]/gi, '').replace(/ /g, '-').toLowerCase()

/** Heading texts of a markdown text, outside code. */
function headingTexts(md) {
  let fence = false
  return md.split('\n').filter((l) => {
    if (/^\s*(```|~~~)/.test(l)) { fence = !fence; return false }
    return !fence && /^#{1,6} /.test(l)
  }).map((l) => l.replace(/^#{1,6}\s+/, '').replace(/\s+#+\s*$/, '').trim())
}

/**
 * In-page links (#…) of one page, per language. A heading's id is the slug of its text, so a translated heading has
 * another id than the English one the source links to; antd's own heading ids ("### … {#faq-force-align}") are
 * dropped by fixMarkdown and become the slug of their heading. `segments`: the page's markdown blocks as
 * { vi, en } (after debrand), paired heading by heading; `source`: the page's markdown before fixMarkdown.
 */
function pageAnchors(segments, source) {
  const vi = {}
  const en = {}
  const enHeadings = []
  for (const s of segments) {
    const a = headingTexts(s.en)
    const b = headingTexts(s.vi)
    enHeadings.push(...a)
    if (a.length === b.length) a.forEach((h, i) => { if (slug(h) !== slug(b[i])) vi[slug(h)] = slug(b[i]) })
  }
  const loose = (s) => slug(s).replace(/-+/g, '-').replace(/^-|-$/g, '')
  for (const m of source.matchAll(/^#{1,6}\s+(.*?)\s*\{#([^}\s]+)\}\s*$/gm)) {
    const h = enHeadings.find((x) => loose(x) === loose(m[1]))
    if (!h) continue
    if (slug(h) !== m[2]) en[m[2]] = slug(h)
    vi[m[2]] = vi[slug(h)] ?? slug(h)
  }
  // ids are lower case ("#API" → #api)
  const relink = (map) => (md) => md.replace(/\]\(#([^)\s]+)\)/g, (all, id) => {
    const to = map[id] ?? map[id.toLowerCase()] ?? id.toLowerCase()
    return to === id ? all : `](#${to})`
  })
  return { vi: relink(vi), en: relink(en) }
}

/** Plain text in two languages as a JSX child. */
const jsxText = (vi, en) => (vi === en ? escapeJsxText(vi) : `{vi ? ${js(vi)} : ${js(en)}}`)

const PLAYGROUND_HINT = {
  vi: 'Đổi thuộc tính trong bảng bên dưới để xem component thay đổi trực tiếp.',
  en: 'Change the props in the table below to see the component update live.',
}

function identifier(label, used) {
  let id = label
    .replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[a-z]/, (c) => c.toUpperCase())
  if (!id || /^[0-9]/.test(id) || /^Demo[0-9]/.test(id)) id = 'Example' + id
  let out = id
  for (let i = 2; used.has(out); i++) out = id + i
  used.add(out)
  return out
}

// ---------- parse index.en-US.md into ordered segments ----------
function parseDoc(body) {
  const segments = []
  const styles = []
  let text = []
  const flush = () => {
    const md = fixMarkdown(text.join('\n'))
    if (md) segments.push({ type: 'md', md })
    text = []
  }
  const lines = body.split(/\r?\n/)
  let inFence = false
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
    // a demo tag written over several lines (Splitter "Control collapsible icons") → one line
    if (!inFence && /^\s*<code src="\.\/demo\/[^"]+"(?:[^>"]|"[^"]*")*>(?!.*<\/code>)/.test(line)) {
      let j = i
      while (j + 1 < lines.length && !/<\/code>/.test(lines[j])) j++
      line = lines.slice(i, j + 1).map((l) => l.trim()).join('')
      i = j
    }
    if (!inFence && /^\s*<style>/.test(line)) {
      const css = []
      for (i++; i < lines.length && !/^\s*<\/style>/.test(lines[i]); i++) css.push(lines[i])
      styles.push(css.join('\n'))
      continue
    }
    // attributes may hold ">" in quotes (version=">= 5.10.0")
    const demo = !inFence && line.match(/^\s*<code src="\.\/demo\/([^"]+)"((?:[^>"]|"[^"]*")*)>(.*?)<\/code>\s*$/)
    if (demo) {
      flush()
      const [, file, attrs, label] = demo
      segments.push({ type: 'demo', file, label: label.trim(), debug: /\bdebug\b/.test(attrs), semantic: path.basename(file).startsWith('_') })
      continue
    }
    // either quote: Splitter writes component='Splitter'
    const tok = !inFence && line.match(/^\s*<ComponentTokenTable component=(["'])([^"']+)\1[^>]*>\s*<\/ComponentTokenTable>\s*$/)
    if (tok) { flush(); segments.push({ type: 'tokens', component: tok[2] }); continue }
    // other antd site widgets used on component pages (Icon: searchable icon list)
    const widget = !inFence && line.match(/^\s*<(IconSearch)\s*(?:\/>|><\/\1>)\s*$/)
    if (widget) { flush(); segments.push({ type: 'widget', name: widget[1] }); continue }
    text.push(line)
  }
  flush()
  return { segments, css: styles.join('\n') }
}

function resolveDemo(dir, file) {
  const base = path.join(dir, 'demo', file)
  for (const f of [base, base + '.tsx', base + '.ts', base + '.jsx', path.join(base, 'index.tsx')]) {
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return f
  }
  return null
}

// ---------- write one component ----------
function convert(name) {
  const srcDir = path.join(SRC_COMPONENTS, name)
  const { meta, body } = splitFrontmatter(fs.readFileSync(path.join(srcDir, 'index.en-US.md'), 'utf8'))
  const title = meta.title
  const group = GROUPS.includes(typeof meta.group === 'string' ? meta.group : meta.group?.title)
    ? (typeof meta.group === 'string' ? meta.group : meta.group.title)
    : 'Other'
  const outDir = path.join(OUT, name)
  // Update in place (write only what changed) so a running Storybook keeps its index.
  fs.mkdirSync(outDir, { recursive: true })
  // debug demos never become stories (parseDoc below): they are not copied either (they hold Chinese text)
  const debugDemos = new Set(parseDoc(body).segments.filter((x) => x.type === 'demo' && x.debug).map((x) => x.file.replace(/\.(tsx|ts|jsx)$/, '')))
  for (const f of fs.readdirSync(path.join(srcDir, 'demo'), { recursive: true })) {
    const from = path.join(srcDir, 'demo', f)
    if (fs.statSync(from).isDirectory()) continue
    if (debugDemos.has(f.replace(/\\/g, '/').replace(/\.(tsx|ts|jsx|md)$/, ''))) continue
    // Chinese-only demos are not copied at all (scripts/no-chinese.mjs)
    if (CHINESE_ONLY_DEMOS.has(`${name}/${f.replace(/\.md$/, '.tsx')}`)) continue
    const patch = DEMO_PATCHES[name]
    let content = fs.readFileSync(from)
    if (/\.(tsx|ts|jsx)$/.test(f)) {
      // @fabi/ui imports and fabi- class names: the code shown is the code that runs (B5)
      content = a11yPatch(fabiCode(globalPatch(content.toString('utf8'))))
      if (patch) content = patch(content, f)
      // no Chinese in the design system (scripts/no-chinese.mjs)
      content = noChinese(content, name, path.basename(f))
      if (path.basename(f).startsWith('_semantic')) content = dropCnLocale(content)
      if (DARK_DEMOS[name]?.includes(f)) content = darkPatch(content)
    } else if (/\.md$/.test(f)) {
      content = halfWidth(dropZhSection(content.toString('utf8')))
    }
    writeIfChanged(path.join(outDir, 'demo', f), content)
  }
  // The antd site helpers live in src/_dumi (Vite does not serve dot-folders like .dumi).
  for (const f of fs.readdirSync(path.join(outDir, 'demo'), { recursive: true })) {
    const p = path.join(outDir, 'demo', f)
    if (!/\.(tsx|ts|jsx)$/.test(p)) continue
    const t = fs.readFileSync(p, 'utf8')
    if (t.includes('/.dumi/')) writeIfChanged(p, t.replaceAll('/.dumi/', '/_dumi/'))
  }

  const parsed = parseDoc(body)
  const segments = parsed.segments
  // a11y: the ghost-button demo backdrop rgb(190,200,200) leaves white text at 1.7:1 → neutral-8
  const css = parsed.css.replace(/rgb\(190,\s*200,\s*200\)/g, '#595959')
    // Ant-hosted background images in page CSS (e.g. Empty) → local illustration
    .replace(new RegExp(ANT_MEDIA.source, 'gi'), '/mock-assets/illustration.svg')
  const cat = createCatalog(`components/${name}`)
  // every text in Vietnamese (translation) and English (source); see bilingual() above
  const description = debrand(cat.t(fixMarkdown(meta.description ?? '')), 'vi')
  const descriptionEn = debrand(fixMarkdown(meta.description ?? ''), 'en')
  // names the generated file already uses; story exports must not collide with them
  const used = new Set(['DocCanvas', 'LocalizedControls', 'DocMarkdown', 'DocTitle', 'DocUnstyled', 'ComponentTokenTable', 'DocsPage', 'meta', 'Story', 'css', 'argDocsVi', 'useDocsLocale'])
  const imports = []
  const stories = []
  const page = []
  const skipped = []
  let n = 0
  let argDocsVi = null

  // the text of every markdown block in both languages: shared files the page embeds (Tooltip / Popover /
  // Popconfirm props and FAQ, Skeleton props; translated in this page's catalog), translation, brand cleanup,
  // then the in-page links of each language
  const embed = (md, lang) => md.replace(/^&lt;embed src="([^"]+)">&lt;\/embed>[ \t]*$/gm, (m, src) => {
    const shared = fixMarkdown(fs.readFileSync(path.join(srcDir, src), 'utf8'))
    return lang === 'vi' ? cat.t(shared) : shared
  })
  const mdSegments = segments.filter((s) => s.type === 'md')
  for (const s of mdSegments) {
    s.vi = debrand(containers(embed(cat.t(s.md), 'vi'), 'vi'), 'vi')
    s.en = debrand(containers(embed(s.md, 'en'), 'en'), 'en')
  }
  const links = pageAnchors(mdSegments, body)
  for (const s of mdSegments) {
    s.vi = links.vi(s.vi)
    s.en = links.en(s.en)
  }

  // Playground: live component driven by args, with Controls built from the API table
  const pg = PLAYGROUNDS[name]
  if (pg) {
    // argTypes from the English API table (EN is the source language; the Controls addon panel shows them in
    // both languages); in VN the Controls table on the docs page shows the cells of the Vietnamese API table
    // (LocalizedControls), as the API table on the same page does
    const pageMdVi = mdSegments.map((s) => s.vi).join('\n')
    const pageMd = mdSegments.map((s) => s.en).join('\n')
    const argTypes = argTypesFromApi(pageMd)
    argDocsVi = {}
    for (const [k, at] of Object.entries(argTypesFromApi(pageMdVi))) {
      if (!argTypes[k]) continue
      const cells = { description: at.description, type: at.table.type?.summary, defaultValue: at.table.defaultValue?.summary }
      const en = { description: argTypes[k].description, type: argTypes[k].table.type?.summary, defaultValue: argTypes[k].table.defaultValue?.summary }
      const diff = Object.fromEntries(Object.entries(cells).filter(([c, v]) => v !== undefined && v !== en[c]))
      if (Object.keys(diff).length) argDocsVi[k] = diff
    }
    const names = [pg.component, ...(pg.extra ?? [])]
    names.forEach((x) => used.add(x))
    used.add('Playground')
    imports.push(`import { ${[...new Set(names)].join(', ')} } from '@fabi/ui'`)
    const pc = playCode(`${name}/Playground`)
    // accessible name for the playground control (same rules as a11yPatch)
    const pgArgs = { ...pg.args }
    if (pg.component === 'Slider') pgArgs.ariaLabelForHandle ??= 'Slider'
    else if (pg.component in ALT_TAGS) pgArgs.alt ??= ALT_TAGS[pg.component] || 'Image'
    else if (pg.component in NAMED_CONTROLS) pgArgs['aria-label'] ??= pgArgs.placeholder ?? NAMED_CONTROLS[pg.component]
    const argsCode = JSON.stringify(pgArgs).replace(/\}$/, pc.spies ? `${Object.keys(pgArgs).length ? ', ' : ''}${pc.spies}}` : '}')
    stories.push(`/** Playground: change the props in the Controls panel. */
export const Playground: Story = {
  name: 'Playground',
  args: ${argsCode},
  argTypes: ${JSON.stringify(argTypes)},
  render: (args) => ${pg.wrap ? `<${pg.component} {...args}>${pg.wrap}</${pg.component}>` : `<${pg.component} {...args} />`},
  parameters: {
    // the code shown under the Playground: the JSX for the current args (follows the Controls)
    docs: { source: { type: 'dynamic', language: 'tsx' } },
    // its tag names (the components are forwardRef objects without a display name in a build) and props (the
    // Actions spies are not code)
    jsx: {
      displayName: (el: { type: unknown }) => (typeof el.type === 'string' ? el.type : new Map<unknown, string>([${[...new Set(names)].map((x) => `[${x}, '${x}']`).join(', ')}]).get(el.type) ?? 'Component'),
      filterProps: (value: unknown) => value !== undefined && typeof value !== 'function',
    },
  },
${pc.play}}`)
    // "Playground" is the story's name, so the heading stays English in both languages
    page.push(`      <h2 lang="en">Playground</h2>`)
    page.push(mdBlock(PLAYGROUND_HINT.vi, PLAYGROUND_HINT.en))
    page.push(`      <DocCanvas of={Playground} sourceState="shown" />`)
    page.push(`      <LocalizedControls of={Playground} vi={argDocsVi} />`)
  }

  for (const seg of segments) {
    if (seg.type === 'md') {
      const md = mdBlock(seg.vi, seg.en)
      if (md) page.push(md)
      continue
    }
    if (seg.type === 'widget') {
      imports.push(`import ${seg.name} from '../../_dumi/theme/builtins/${seg.name}'`)
      page.push(`      <DocUnstyled><div className="fabi-sb-block"><${seg.name} /></div></DocUnstyled>`)
      continue
    }
    if (seg.type === 'tokens') { page.push(`      <DocUnstyled><div className="fabi-sb-block"><ComponentTokenTable component=${js(seg.component)} /></div></DocUnstyled>`); continue }
    const abs = resolveDemo(srcDir, seg.file)
    if (!abs) { skipped.push(`${seg.file} (file not found)`); continue }
    if (seg.debug) { skipped.push(`${seg.file} (debug)`); continue }
    if (SKIP_DEMOS.has(`${name}/${path.basename(abs)}`)) { skipped.push(`${seg.file} (Alibaba CDN)`); continue }
    if (CHINESE_ONLY_DEMOS.has(`${name}/${path.basename(abs)}`)) { skipped.push(`${seg.file} (Chinese only)`); continue }
    const rel = './' + path.relative(outDir, path.join(outDir, 'demo', path.relative(path.join(srcDir, 'demo'), abs))).replace(/\\/g, '/')
    const imp = `Demo${n}`
    imports.push(`import ${imp} from ${js(rel.replace(/\.(tsx|ts|jsx)$/, ''))}`)
    if (seg.semantic) {
      page.push(`      <DocUnstyled><div className="fabi-sb-block fabi-sb-semantic"><${imp} /></div></DocUnstyled>`)
      n++
      continue
    }
    imports.push(`import ${imp}Source from ${js(rel + '?raw')}`)
    const id = identifier(seg.label || path.basename(seg.file, path.extname(seg.file)), used)
    const leftChinese = findChinese(fs.readFileSync(path.join(outDir, rel), 'utf8'))
    if (leftChinese.length) skipped.push(`${seg.file} (CHINESE LEFT: ${leftChinese[0].trim().slice(0, 60)})`)
    const descSource = demoDescription(abs.replace(/\.(tsx|ts|jsx)$/, '.md'))
    const desc = links.vi(debrand(cat.t(descSource), 'vi'))
    const descEn = links.en(debrand(descSource, 'en'))
    // example titles = story names: English in both languages
    const label = seg.label
    const demoPlay = playCode(`${name}/${path.basename(abs)}`)
    const ex = A11Y_EXEMPT[`${name}:${seg.label}`]
    const a11y = ex ? `\n    // a11y exception: ${ex.why}\n    a11y: { config: { rules: ${JSON.stringify(ex.rules.map((id) => ({ id, enabled: false })))} } },` : ''
    stories.push(`/** ${seg.label.replace(/\*\//g, '* /')} */
export const ${id}: Story = {
  name: ${js(label)},
  render: () => <${imp} />,
  parameters: {
    docs: {
      description: { story: ${js(desc)} },
      source: { code: ${imp}Source, language: 'tsx' },
    },${a11y}
  },
${demoPlay.play}}`)
    // id as on the antd site (#date-picker-demo-format), which the docs text links to; lang: the title is English
    const anchor = `${name}-demo-${seg.file.replace(/\.(tsx|ts|jsx)$/, '').replace(/\/index$/, '').split('/').pop()}`.toLowerCase()
    page.push(`      <h3 id=${js(anchor)} className="fabi-sb-demo-title" lang="en">${escapeJsxText(label)}</h3>`)
    if (desc || descEn) page.push(mdBlock(desc, descEn))
    page.push(`      <DocCanvas of={${id}} sourceState="hidden" />`)
    // packages the example needs besides @fabi/ui and React
    const deps = depsNote(fs.readFileSync(path.join(outDir, rel), 'utf8'))
    if (deps) page.push(`      ${deps}`)
    n++
  }

  const file = `// Generated by scripts/convert.mjs (${name}) — do not edit by hand. Third-party licences: NOTICE.md.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Canvas as DocCanvas, Markdown as DocMarkdown, Title as DocTitle, Unstyled as DocUnstyled } from '@storybook/addon-docs/blocks'
import { useDocsLocale } from '../../../.storybook/locale'
${argDocsVi ? "import { LocalizedControls, type ArgDocs } from '../../../.storybook/docsBlocks'\n" : ''}import ComponentTokenTable from '../../_dumi/theme/builtins/ComponentTokenTable'
${/play:|fn\(\)/.test(stories.join('\n')) ? "import { expect, fn, screen, waitFor, within } from 'storybook/test'\n" : ''}${imports.join('\n')}

const css = ${js(css)}
${argDocsVi ? `\n// Controls table cells of the Vietnamese API table (Language toolbar VN)\nconst argDocsVi: Record<string, ArgDocs> = ${JSON.stringify(argDocsVi)}\n` : ''}
/** Docs page in the language of the Language toolbar (VN / EN). */
function DocsPage() {
  const vi = useDocsLocale() === 'vi'
  return (
    <>
      {css && <style>{css}</style>}
      <DocTitle />
${mdBlock(description, descriptionEn)}
${page.filter(Boolean).join('\n')}
    </>
  )
}

const meta = {
  title: ${js(`Components/${group}/${title}`)},
  tags: ['autodocs'],
  decorators: [(Story) => (<>{css && <style>{css}</style>}<Story /></>)],
  parameters: {
    docs: { page: DocsPage, description: { component: ${js(description)} } },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

${stories.join('\n\n')}
`
  writeIfChanged(path.join(outDir, `${title.replace(/[^A-Za-z0-9]/g, '')}.stories.tsx`), file)
  const [translated, strings] = cat.save()
  return { name, title, group, stories: stories.length, skipped, translated, strings }
}

function writeIfChanged(file, content) {
  const buf = Buffer.isBuffer(content) ? content : Buffer.from(content)
  if (fs.existsSync(file) && fs.readFileSync(file).equals(buf)) return
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, buf)
}

function escapeJsxText(s) {
  return s.replace(/[{}<>]/g, (c) => `{${js(c)}}`)
}

export { ANTD, ROOT, SITE, ANT_MEDIA, js, splitFrontmatter, demoDescription, fixMarkdown, halfWidth, containers, debrand, writeIfChanged, escapeJsxText, bilingual, mdBlock, jsxText, pageAnchors }

// Run only when called directly (scripts/convert-pages.mjs imports the helpers above).
const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
const report = isMain ? names.map(convert) : []
if (isMain) for (const r of report) {
  console.log(`${r.title.padEnd(16)} ${r.group.padEnd(13)} ${String(r.stories).padStart(3)} stories  vi ${r.translated}/${r.strings}${r.skipped.length ? `  skipped: ${r.skipped.length}` : ''}`)
}
if (isMain) fs.writeFileSync(path.join(ROOT, 'convert-report.json'), JSON.stringify(report, null, 2))

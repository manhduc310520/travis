// No Chinese anywhere in the FABi CMS Design System (user decision 2026-10-14: "không được phép có tiếng trung
// trong bộ design system này"). Demos whose whole point is Chinese text are skipped; the others get English /
// Vietnamese-market equivalents (₫ instead of \uffe5, plain punctuation instead of full-width). Applied to the demo
// code by scripts/convert.mjs after its other demo patches; `findChinese()` reports anything left.

/** Demos that only make sense with Chinese characters (spacing of two CJK characters, the Chinese lunar calendar) */
export const CHINESE_ONLY_DEMOS = new Set(['button/chinese-chars-loading.tsx', 'button/chinese-space.tsx', 'calendar/lunar.tsx'])

const EDITS = {
  'typography/basic.tsx': [
    // the demo shows the same article in English and in Chinese: keep the English one
    [/\n\s*<Divider \/>\n\s*<Title>\u4ecb\u7ecd<\/Title>[\s\S]*?\u6309<Text keyboard>Esc<\/Text>\u952e\u9000\u51fa\u9605\u8bfb……\n\s*<\/Paragraph>\n/, '\n'],
  ],
  'config-provider/locale.tsx': [
    [/import zhCN from '@fabi\/ui\/locale\/zh_CN';/, "import viVN from '@fabi/ui/locale/vi_VN';"],
    [/import 'dayjs\/locale\/zh-cn';/, "import 'dayjs/locale/vi';"],
    [/dayjs\.locale\('zh-cn'\);/, "dayjs.locale('vi');"],
    [/<Radio\.Button key="cn" value=\{zhCN\}>\s*\u4e2d\u6587\s*<\/Radio\.Button>/, '<Radio.Button key="vi" value={viVN}>\n            Vietnamese\n          </Radio.Button>'],
  ],
  'modal/locale.tsx': [[/'\u786e\u8ba4'|"\u786e\u8ba4"/g, (m) => m[0] + 'OK' + m[0]], [/'\u53d6\u6d88'|"\u53d6\u6d88"/g, (m) => m[0] + 'Cancel' + m[0]]],
  'rate/character.tsx': [[/character="\u597d"/, 'character="A"']],
  'select/option-label-center.tsx': [[/\u8bf7\u9009\u62e9/g, 'Select'], [/\u57ce\u5e02/g, 'City']],
  'statistic/timer.tsx': [[/format="D \u5929 H \u65f6 m \u5206 s \u79d2"/g, 'format="D [d] H [h] m [m] s [s]"']],
  'table/ajax.tsx': [[/\/\/ \u5904\u7406\u5176\u4ed6\u53c2\u6570/, '// other parameters']],
  'table/bordered.tsx': [[/'\uffe5300,000\.00'/, "'300.000 ₫'"], [/'\uffe51,256,000\.00'/, "'1.256.000 ₫'"], [/'\uffe5120,000\.00'/, "'120.000 ₫'"]],
  'input/presuffix.tsx': [[/prefix="\uffe5" suffix="RMB"/g, 'prefix="₫" suffix="VND"']],
  'input-number/presuffix.tsx': [[/prefix="\uffe5"/g, 'prefix="₫"']],
}

// full-width punctuation that slips into English demo text
const PUNCT = [[/\uff08/g, ' ('], [/\uff09/g, ')'], [/\uff1a/g, ': '], [/\uff0c/g, ', '], [/\uffe5/g, '₫']]

/** Demo code without Chinese (component = folder name, file = demo file name) */
export function noChinese(code, component, file) {
  for (const [find, repl] of EDITS[`${component}/${file}`] ?? []) code = code.replace(find, repl)
  for (const [find, repl] of PUNCT) code = code.replace(find, repl)
  return code
}

const CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff01-\uff60]/

/** Lines that still hold Chinese characters, outside comments of the cn locale tables */
export function findChinese(code) {
  return code.split('\n').filter((l) => CJK.test(l) && !/^\s*(?:cn|zh|zhCN|'zh-CN'):/.test(l))
}

/** A demo's .md without its Chinese description (`## zh-CN` section) */
export const dropZhSection = (md) => md.replace(/^## zh-CN[ \t]*\r?\n[\s\S]*?(?=^## |(?![\s\S]))/m, '')

/** Semantic DOM demos: drop the `cn: { … }` locale table (only `en` is shown; the docs' useLocale is English) */
export const dropCnLocale = (code) => code.replace(/^([ \t]*)cn: \{\r?\n[\s\S]*?\r?\n\1\},?\r?\n/m, '')

// The docs describe the one version FABi CMS ships (Ant Design 6.6.5), so version history goes (user decision
// 2026-10-14): the Version column of API tables, deprecated props (~~name~~) and deprecated sections, "since 5.x"
// notes and notes about older versions or old browsers. The Global Config column keeps whether a prop can be set
// in ConfigProvider (✓ / ×) without the version. Runs on both languages after translation (scripts/convert.mjs
// debrand), so the translation catalog keeps matching the English source.

const VERSION_HEAD = /^(?:version|phiên bản)$/i
const GLOBAL_HEAD = /^(?:global config|cấu hình chung)$/i
const HAS_VERSION = /\d+\.\d+/
const splitRow = (line) => line.trim().replace(/^\|/, '').replace(/(?<!\\)\|$/, '').split(/(?<!\\)\|/).map((c) => c.trim())

/** One markdown table (header, separator, rows) → the cleaned table lines ([] when no row is left). */
function cleanTable(lines) {
  const [head, sep, ...rows] = lines.map(splitRow)
  if (!sep || !sep.every((c) => /^:?-*:?$/.test(c))) return lines
  // the Version column, and an unnamed column that only holds versions
  const drop = new Set(head.flatMap((h, i) => (VERSION_HEAD.test(h) || (!h && rows.every((r) => !r[i] || r[i] === '-' || HAS_VERSION.test(r[i]))) ? [i] : [])))
  const global = head.findIndex((h) => GLOBAL_HEAD.test(h))
  const version = head.findIndex((h) => VERSION_HEAD.test(h))
  // deprecated: ~~name~~, or a Version cell "< 5.4.0" (only for older versions)
  const kept = rows.filter((r) => !/~~/.test(r[0] ?? '') && !/^(?:<|&lt;)\s*\d/.test(r[version] ?? ''))
  if (!kept.length) return []
  return [head, sep, ...kept].map((r, k) => {
    const cells = r.map((c, i) => (k >= 2 && i === global && HAS_VERSION.test(c) ? '✓' : c))
    return `| ${cells.filter((_, i) => !drop.has(i)).join(' | ')} |`
  })
}

const DEPRECATED_HEADING = /^(#{2,6}) .*\*\*(?:Deprecated|Ngừng hỗ trợ|Đã ngừng hỗ trợ)\*\*/
const DEPRECATED_NOTE = /^> \*\*(?:Deprecated|Ngừng hỗ trợ|Đã ngừng hỗ trợ)\*\*/

/** Tables and deprecated sections, outside code fences. */
function cleanBlocks(md) {
  const lines = md.split('\n')
  const out = []
  let fence = false
  let skipLevel = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^\s*(```|~~~)/.test(line)) fence = !fence
    if (!fence) {
      const h = line.match(/^(#{1,6}) /)
      if (h && skipLevel && h[1].length <= skipLevel) skipLevel = 0
      const dep = line.match(DEPRECATED_HEADING)
      if (dep) { skipLevel = dep[1].length; continue }
      // a section whose first line is a "> **Deprecated**" note (Collapse.Panel)
      if (h) {
        let j = i + 1
        while (j < lines.length && !lines[j].trim()) j++
        if (DEPRECATED_NOTE.test(lines[j] ?? '')) { skipLevel = h[1].length; continue }
      }
    }
    if (skipLevel) continue
    if (!fence && /^\|/.test(line)) {
      const table = []
      for (; i < lines.length && /^\|/.test(lines[i]); i++) table.push(lines[i])
      i--
      out.push(...cleanTable(table))
      continue
    }
    out.push(line)
  }
  return out.join('\n')
}

// Sentences about versions. Each entry: [pattern, replacement]; English and Vietnamese (the translation of the
// same sentence) side by side. Whole lines end with \n? so the paragraph break closes up.
const NOTE_EDITS = [
  // notes that only describe older versions → removed
  [/^> (?:After version `[\d.]+`, we rewrite|Từ phiên bản `[\d.]+`, \w+ được viết lại)[^\n]*\n?/gm, ''],
  [/^> (?:vertical gutter was supported|gutter theo chiều dọc được hỗ trợ)[^\n]*\n?/gm, ''],
  [/^> `description` (?:is supported in version|được hỗ trợ từ phiên bản)[^\n]*\n?/gm, ''],
  [/^> (?:Note: `style` and `className` props are moved to Drawer panel in v5|Lưu ý: các prop `style` và `className` đã được chuyển sang panel của Drawer ở v5)[^\n]*\n?/gm, ''],
  [/^\*\*(?:Note: v4 using sticky|Lưu ý: v4 dùng sticky)[^\n]*\n?/gm, ''],
  [/^> (?:Based on `flex layout`|Dựa trên `flex layout`)[^\n]*\n?/gm, ''],
  [/^- (?:Setting offset in two directions individually|Việc đặt độ lệch riêng cho từng hướng)[^\n]*\n?/gm, ''],
  [/ ?(?:The `danger` is a property of buttons since version 4\.0\.|`danger` là thuộc tính của button từ phiên bản 4\.0\.)/g, ''],
  [/ ?(?:`IE8\/9` do not support local thumbnail show\. Please use `thumbUrl` instead\.|`IE8\/9` không hỗ trợ hiển thị ảnh thu nhỏ cục bộ\. Hãy dùng `thumbUrl` thay thế\.)/g, ''],
  [/ ?(?:Use `visible` under 4\.23\.0|Dưới 4\.23\.0 dùng `visible`)/g, ''],
  [/ It will merge to `\{ originFileObj: File \}` in the next major version\. Current version is compatible to get origin file by `info\.file\.originFileObj`\. You can change this before a major release\./g, ' The original file is also available as `info.file.originFileObj`.'],
  [/ Ở phiên bản major tiếp theo, nó sẽ được gộp thành `\{ originFileObj: File \}`\. Phiên bản hiện tại đã tương thích với việc lấy tệp gốc qua `info\.file\.originFileObj`\.[^\n]*/g, ' Tệp gốc cũng lấy được qua `info.file.originFileObj`.'],
  // the same advice without the version
  [/^> When using version >= 5\.6\.0, we prefer to configuring the panel by `items`\./gm, '> We recommend configuring the panels with `items`.'],
  [/^> Khi dùng phiên bản >= 5\.6\.0, chúng tôi khuyến nghị cấu hình panel bằng `items`\./gm, '> Nên cấu hình panel bằng `items`.'],
  [/^> Since the `5\.17\.0`, we provided the `loading` prop[^\n]*/gm, '> `loading` shows a Skeleton while the content loads and only accepts a `boolean`.'],
  [/^> Từ `5\.17\.0`, chúng tôi cung cấp prop `loading`[^\n]*/gm, '> `loading` hiện khung Skeleton trong lúc tải nội dung, chỉ nhận kiểu `boolean`.'],
  [/^(#{2,6}) In version `5\.25\.0\+`, the `:target`/gm, '$1 The `:target`'],
  [/^(#{2,6}) Ở phiên bản `5\.25\.0\+`, pseudo-class `:target`/gm, '$1 Pseudo-class `:target`'],
  [/ Since `5\.8\.0`, preset value supports callback function\./g, ' Preset values can also be callback functions.'],
  [/ Từ `5\.8\.0`, giá trị định sẵn hỗ trợ hàm callback\./g, ' Giá trị định sẵn cũng có thể là hàm callback.'],
  [/ Note: The `suffix` prop for Input\.Password is supported starting from version `5\.27\.0`\./g, ' Input.Password also accepts `suffix`.'],
  [/ Lưu ý: prop `suffix` của Input\.Password được hỗ trợ từ phiên bản `5\.27\.0`\./g, ' Input.Password cũng nhận `suffix`.'],
  [/ Note that the `icon` prop for CheckableTag is only supported in version `>=5\.27\.0`\./g, ' CheckableTag also accepts `icon`.'],
  [/ Lưu ý prop `icon` của CheckableTag chỉ được hỗ trợ từ phiên bản `>=5\.27\.0`\./g, ' CheckableTag cũng nhận prop `icon`.'],
  [/ \(v6\)/g, ''],
  // old browsers
  [/, (?:valid above IE10|dùng được từ IE10 trở lên)/g, ''],
  [/ ?(?:`IE10\+` supported\.|Hỗ trợ từ `IE10\+`\.)/g, ''],
  [/^> The use of the `type` attribute is deprecated/gm, '> Do not set the `type` attribute.'],
  [/^> Việc dùng thuộc tính `type` đã bị deprecated/gm, '> Không nên đặt thuộc tính `type`.'],
  [/ ?\((?:>=5\.3\.0 recommended|khuyến nghị từ >=5\.3\.0)[^)]*\)/g, ''],
  [/ which , the methods came from `message\/notification\/Modal` has been deprecated in 5\.x\./g, ' instead of the static `message` / `notification` / `Modal` methods.'],
  [/; các phương thức từ `message\/notification\/Modal` đã bị deprecated từ 5\.x\./g, ' thay cho các phương thức tĩnh của `message` / `notification` / `Modal`.'],
  [/ ?(?:`info` argument is added in|Tham số `info` được thêm từ) 4\.4\.0/g, ''],
  [/^DatePicker default set `locale` as `en` in v4\. You can config DatePicker `locale` prop or ConfigProvider `locale` prop instead\./gm, 'Set the `locale` prop of DatePicker or of ConfigProvider.'],
  [/^DatePicker mặc định đặt `locale` là `en` ở v4\.[^\n]*/gm, 'Hãy đặt prop `locale` của DatePicker hoặc của ConfigProvider.'],
  [/ ?\((?:like `getFieldDecorator` in 3\.x|như `getFieldDecorator` ở 3\.x)\)/g, ''],
  [/^`5\.12\.0` add `selector`/gm, '`Form.useWatch` also accepts a `selector` function.'],
  [/^`5\.12\.0` thêm `selector`/gm, '`Form.useWatch` cũng nhận hàm `selector`.'],
  [/ ?(?:and was added in|và được thêm vào ở) `4\.22\.0`/g, ''],
  [/ were added in `5\.4\.0` to obtain/g, ' give'],
  [/ được thêm vào ở `5\.4\.0` để lấy/g, ' cho biết'],
  [/^We introduced SVG icons in version `3\.9\.0`, replacing font icons\./gm, 'Icons are SVG, not an icon font.'],
  [/^Chúng tôi đưa icon SVG vào từ phiên bản `3\.9\.0`, thay cho font icon\. Việc này mang lại/gm, 'Icon dùng SVG, không dùng font icon, nên có'],
  [/^> ⚠️ (?:Given the extra bundle size|Do dung lượng bundle)[^\n]*\n(?:>[^\n]*\n?)*/gm, ''],
  [/^(?:The properties `theme`, `component` and `twoToneColor` were added in `3\.9\.0`|Các thuộc tính `theme`, `component` và `twoToneColor` được thêm vào ở `3\.9\.0`)[^\n]*\n?/gm, ''],
  [/, `filterDropdownOpen` (?:and|và) `onFilterDropdownOpenChange` (?:were available before|khả dụng trước) `<5\.22\.0`/g, ''],
  [/ since `4\.1\.0`\./g, '.'],
  [/ từ `4\.1\.0` Pagination/g, ' Pagination'],
  [/ \(add `direction` support since 5\.9\.0\+\)/g, ' (also receives `direction`)'],
  [/ \(thêm hỗ trợ `direction` từ 5\.9\.0\+\)/g, ' (cũng nhận `direction`)'],
  [/ Please note that there does exist a bug which makes an event still trigger even when the file is not in the list before `4\.13\.0`\./g, ''],
  [/ Lưu ý rằng trước `4\.13\.0` có một lỗi[^\n.]*\./g, ''],
  [/^(#{2,6}) Why `overflow: hidden` style is added since version 5\.18\.0\?/gm, '$1 Why is the `overflow: hidden` style added?'],
  [/^(#{2,6}) Vì sao style `overflow: hidden` được thêm từ phiên bản 5\.18\.0\?/gm, '$1 Vì sao có style `overflow: hidden`?'],
  // sentence openers: "Added in `4.20.0`. ", "New in 4.7.0. ", "Note: `type` is added in `5.14.0`.", "Since `5.20.2`, when",
  // "Before `3.4.0`: The"
  [/ ?(?:Added in|New in|Thêm từ|Thêm vào từ|Thêm vào ở|Mới từ) `?\d+\.\d+\.\d+`?\.(?: |$)/gm, ''],
  [/ ?(?:Note: `\w+` is added in|Lưu ý: `\w+` được thêm từ) `\d+\.\d+\.\d+`\./g, ''],
  [/(^|\. )(?:Since|Starting from version|Từ phiên bản|Từ) `\d+\.\d+\.\d+`, (\p{L})/gmu, (_, pre, c) => pre + c.toUpperCase()],
  [/(?:Before|Trước) `\d+\.\d+\.\d+`: /g, ''],
  // short forms: "(since 5.1.0)", "(introduced in 2.5.0)", "(từ `4.16.0`)", "(4.3.0+)", "**4.5.0+**" after a heading,
  // "5.7.0: " before a sentence in a table cell
  [/ ?\((?:supported since|since|introduced in|added in|hỗ trợ từ|thêm từ|từ|có từ) `?(?:antd@)?\d+\.\d+(?:\.\d+)?\+?`?\)/gi, ''],
  [/ ?\(`?\d+\.\d+\.\d+\+`?\)/g, ''],
  [/ \*\*\d+\.\d+\.\d+\+\*\*/g, ''],
  [/ \d+\.\d+\.\d+: (\p{L})/gu, (_, c) => ` ${c.toUpperCase()}`],
]

const FENCE = /^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[ \t]*$/gm
const notes = (text) => NOTE_EDITS.reduce((t, [find, repl]) => t.replace(find, repl), text)

/** Version notes inside a code block (comments only; the code stays). */
const codeNotes = (code) => code
  // comment lines that only date a prop ("/** `info` added in `5.16.0` */")
  .replace(/^[ \t]*\/\*\*[^\n]*\badded in `?\d+\.\d+\.\d+`?[^\n]*\*\/[ \t]*\n/gm, '')
  // "// 5.13.0+" on its own line, or after the code
  .replace(/^[ \t]*\/\/ \d+\.\d+\.\d+\+[ \t]*\n/gm, '')
  .replace(/[ \t]*\/\/ \d+\.\d+\.\d+\+[ \t]*$/gm, '')
  // Modal: "// on 4.8.0 or above, you can pass a function…"
  .replace(/\/\/ on \d+\.\d+\.\d+ or above, you can/g, '// you can also')
  // Form: "// New in 5.5.0. Only validate content…"
  .replace(/\/\/ New in \d+\.\d+\.\d+\. /g, '// ')
  // "// support after 5.21.0" at the end of a line
  .replace(/[ \t]*\/\/ support after v?\d+\.\d+(?:\.\d+)?[ \t]*$/gm, '')
  // Descriptions: "// works when >= 5.8.0, recommended" above the current usage, and the old usage after
  // "// works when <5.8.0 , deprecated…" (removed with its code)
  .replace(/^[ \t]*\/\/ works when >= ?\d+\.\d+\.\d+[^\n]*\n+/gm, '')
  .replace(/\n+[ \t]*\/\/ works when < ?\d+\.\d+\.\d+[^\n]*\n[\s\S]*?(?=\n[ \t]*(?:`{3,}|~{3,}))/g, '')

/** Remove version history from one markdown text (either language); code blocks stay as they are. */
export function dropVersionNotes(md) {
  const blocks = cleanBlocks(md)
  let out = ''
  let last = 0
  for (const m of blocks.matchAll(FENCE)) {
    out += notes(blocks.slice(last, m.index)) + codeNotes(m[0])
    last = m.index + m[0].length
  }
  return out + notes(blocks.slice(last))
}

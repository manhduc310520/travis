// Sentence-level brand edits on the docs, Vietnamese (BRAND_EDITS) and English (BRAND_EDITS_EN)
// (user decisions 2026-09-30, item 9; English added 2026-10-01 for the EN / VN switch):
//   A  component features            "Ant Design …"  → "FABi CMS Design System …"
//   B  notes about the antd library  "Ant Design …"  → neutral "thư viện" / "hệ thống" (EN "the library" / "the system")
//   C  Ant history, team, company, inspiration (Design Tokens pages) → deleted; where the
//      sentence also states a rule of the system, only the Ant part is removed.
// Applied by debrand(md, lang) in convert.mjs (Vietnamese after translation). Review what is left with
// `npm run check:brand` (terminal, both languages).
export const BRAND_EDITS = [
  // ---- A: component pages → FABi CMS Design System
  ['Ant Design cung cấp 5 loại button.', 'FABi CMS Design System cung cấp 5 loại button.'],
  ['Ant Design hỗ trợ ba kích thước button', 'FABi CMS Design System hỗ trợ ba kích thước button'],
  ['Ant Design hỗ trợ kích thước collapse', 'FABi CMS Design System hỗ trợ kích thước collapse'],
  ['Ant Design hỗ trợ ba kích thước trigger', 'FABi CMS Design System hỗ trợ ba kích thước trigger'],
  ['Trong Ant Design, các hành động bổ sung', 'Trong FABi CMS Design System, các hành động bổ sung'],
  ['Ant Design cần giải quyết nhiều bài toán', 'FABi CMS Design System cần giải quyết nhiều bài toán'],
  ['Ant Design hỗ trợ kích thước danh sách', 'FABi CMS Design System hỗ trợ kích thước danh sách'],
  ['Ant Design cung cấp hai kiểu điều hướng', 'FABi CMS Design System cung cấp hai kiểu điều hướng'],
  ['Ant Design có 3 loại Tabs', 'FABi CMS Design System có 3 loại Tabs'],
  ['content="Ant Design"', 'content="FABi CMS"'],
  ['Màu thương hiệu của Ant Design lấy từ màu blue trong bảng màu cơ bản, giá trị Hex là `#1677ff`',
    'Màu thương hiệu của FABi CMS Design System là Geek Blue trong bảng màu cơ bản, giá trị Hex là `#1d39c4`'],
  ['Ant Design ưu tiên họ font mặc định của hệ thống, sau đó cung cấp thêm một bộ font thay thế',
    'FABi CMS Design System dùng font Be Vietnam Pro, kèm một bộ font thay thế'],

  // ---- B: notes about the library → neutral
  ['Ant Design không chuyển layout', 'Thư viện không chuyển layout'],
  ['Ant Design v6 mặc định dùng CSS variable', 'Thư viện (v6) mặc định dùng CSS variable'],
  ['tất cả component của Ant Design chỉ hoạt động', 'tất cả component của thư viện chỉ hoạt động'],
  ['component bố cục lưới của Ant Design không đáp ứng', 'component bố cục lưới của thư viện không đáp ứng'],
  ['Ant Design cho phép bạn tuỳ chỉnh', 'Hệ thống cho phép bạn tuỳ chỉnh'],
  ['Ant Design tích hợp sẵn một số animation', 'Thư viện tích hợp sẵn một số animation'],
  ['Ant Design sẽ không còn tạo style', 'thư viện sẽ không còn tạo style'],
  // a version number, not the library ("của button từ antd 4.0"; EN "since version 4.0")
  ['button từ antd 4.0', 'button từ phiên bản 4.0'],

  // ---- C: Colors
  ['Ant Design chia hệ thống màu thành hai cấp:', 'Hệ thống màu được chia thành hai cấp:'],
  [' trong thiết kế của Ant Financial', ''],
  ['Đội thiết kế của Ant Design ưu tiên thiết kế bằng mô hình màu HSB', 'Nên thiết kế bằng mô hình màu HSB'],
  [/^Hệ thống màu cấp hệ thống của Ant Design cũng xuất phát[^\n]*?(Định nghĩa bảng màu trung tính)/m, '$1'],
  ['Bảng màu cơ bản của Ant Design gồm', 'Bảng màu cơ bản gồm'],
  ['Bảng màu của Ant Design còn có khả năng mở rộng thêm. Sau khi các nhà thiết kế và lập trình viên nghiên cứu kỹ, chúng tôi đã xây dựng một bộ công cụ tạo màu',
    'Bảng màu còn có khả năng mở rộng thêm nhờ một bộ công cụ tạo màu'],
  [' của AntV', ''],
  ['thuật toán tạo màu của Ant Design', 'thuật toán tạo màu'],
  ['Bảng màu chức năng của Ant Design', 'Bảng màu chức năng'],
  ['Màu trung tính của Ant Design dựa trên', 'Màu trung tính dựa trên'],
  ['Trong thiết kế ứng dụng quản trị của Ant Financial, thái độ của chúng tôi đối với màu sắc là tiết chế.', 'Trong thiết kế ứng dụng quản trị, màu sắc được dùng tiết chế.'],

  // ---- C: Font
  ['Hệ thống typography của Ant Design dựa trên', 'Hệ thống typography dựa trên'],
  ['Chúng tôi đặc biệt khuyến nghị dùng hệ thống này vì nó đã được kiểm chứng qua rất nhiều sản phẩm Ant. ', ''],
  [/^Chúng tôi đã cập nhật cỡ chữ gốc của Ant Design[^\n]*\n?/m, ''],
  [/Ant Design lấy cảm hứng từ thang âm ngũ cung và quy luật tự nhiên để định nghĩa/, 'Hệ thống định nghĩa'],
  ['Trong hệ thống thị giác của Ant Design, cỡ chữ gốc', 'Cỡ chữ gốc'],

  // ---- C: Layout
  [/Chúng tôi được truyền cảm hứng từ[^\n]*?hình thành bố cục giao diện của Ant Design dựa trên/, 'Bố cục giao diện dựa trên'],
  ['Hai kiểu thích ứng điển hình của Ant Design:', 'Hai kiểu thích ứng điển hình:'],
  ['Ant Design dùng hệ thống lưới', 'Hệ thống dùng lưới'],
  ['Ant Design dùng kiến trúc lưới 24 cột.', 'Hệ thống dùng kiến trúc lưới 24 cột.'],
  ['Các nhà thiết kế của Ant Design luôn ghi nhớ 4 điều sau khi trao đổi với kỹ sư:', 'Khi trao đổi với kỹ sư, nhà thiết kế nên ghi nhớ 4 điều sau:'],
  [/Các dự án của AntFin[^.]*\. Để giúp/, 'Để giúp'],
  [', Ant Design đề xuất khái niệm thang đo chung của UI', ', hệ thống đề xuất khái niệm thang đo chung của UI'],
  ['Kết quả của Ant Design về không gian bố cục', 'Các quy tắc về không gian bố cục'],

  // font stack shown on the Font page = the real FABi CMS stack (brand.ts FONT_FAMILY)
  ['@font-family: -apple-system, BlinkMacSystemFont,', "@font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont,"],
  [/team ant design/gi, 'team thiết kế'],

  // ---- second sweep (2026-09-30): Ant sources the first pass missed
  // Typography / Button / Icon notes that promote Ant packages
  [/[^.\n]*@ant-design\/happy-work-theme[^.\n]*\.\s*/g, ''],
  [/[^\n]*Hãy nhớ dùng `@ant-design\/icons@6\.x` với `antd@6\.x`[^\n]*\n?/g, ''],
  // icons ship inside @fabi/ui: no icons / antd version pairing (Icon FAQ on @layer)
  ['1. dùng `@ant-design/icons@6.x` với `antd@6.x`.', '1. import icon từ `@fabi/ui/icons` (có sẵn trong `@fabi/ui`).'],
  [/^[^\n]*Ant Motion[^\n]*\n?/gm, ''],
  // version history of the upstream package ("Component này có từ `antd@5.0.0`.", "(… từ phiên bản antd@4.24.0)")
  [/[^.\n|]*có từ (?:phiên bản )?`?antd@[\d.]+`?\.?[ \t]*/g, ''],
  [/\s*\([^()\n]*antd@[\d.]+[^()\n]*\)/g, ''],

  // ---- C: Motion, Shadow
  [/^> Ant Motion là thư viện animation[^\n]*\n?/m, ''],
  ['từ ngôn ngữ thiết kế cốt lõi của Ant Design:', 'từ ngôn ngữ thiết kế cốt lõi:'],
  ['Trong Ant Design, các hướng bóng', 'Các hướng bóng'],
  ['Ant Design đã áp dụng cách biểu diễn bóng ba lớp từ phiên bản 4.0, giúp', 'hệ thống dùng cách biểu diễn bóng ba lớp, giúp'],

  // ---- Customize Theme: zero-runtime mode needs a prebuilt CSS file that @fabi/ui 0.1.0 does not ship
  // (antd/dist/antd.css uses ant- classes, not fabi-) (2026-10-01)
  [/Từ 6\.0\.0, chúng tôi cung cấp chế độ `zeroRuntime`[\s\S]*?để tạo style tĩnh\./,
    'Thư viện có chế độ `zeroRuntime`: không tạo style lúc runtime, ứng dụng tự import một file CSS dựng sẵn. ' +
    '**@fabi/ui 0.1.0 chưa hỗ trợ chế độ này**: gói không kèm file CSS dựng sẵn, còn `antd/dist/antd.css` dùng class ' +
    '`ant-` nên không áp lên component `fabi-`. Giữ `zeroRuntime` tắt (mặc định).\n\n' +
    'Có thể tự tạo CSS tĩnh cho một số component bằng `@fabi/ui/static-style-extract` (FABi chưa kiểm thử cách này):'],
  ['không tạo style lúc runtime, cần import thêm file CSS |', 'không tạo style lúc runtime, cần import thêm file CSS. @fabi/ui 0.1.0 chưa hỗ trợ |'],
]

// The same decisions on the English docs (EN in the Language toolbar, 2026-10-01): the English source
// sentence of each Vietnamese rule above, plus English-only phrasing ("the library" for antd).
export const BRAND_EDITS_EN = [
  // ---- A: component pages → FABi CMS Design System
  ['In Ant Design we provide 5 types of button.', 'FABi CMS Design System provides 5 types of button.'],
  ['Ant Design supports three sizes of buttons', 'FABi CMS Design System supports three sizes of buttons'],
  ['Ant Design supports a default collapse size', 'FABi CMS Design System supports a default collapse size'],
  ['Ant Design supports three trigger sizes', 'FABi CMS Design System supports three trigger sizes'],
  ['placed at corner of drawer in Ant Design,', 'placed at corner of drawer in FABi CMS Design System,'],
  ['Ant Design needs to solve a lot of information storage problems', 'FABi CMS Design System needs to solve a lot of information storage problems'],
  ['Ant Design supports a default list size', 'FABi CMS Design System supports a default list size'],
  ['Ant Design offers two navigation options', 'FABi CMS Design System offers two navigation options'],
  ['Ant Design has 3 types of Tabs', 'FABi CMS Design System has 3 types of Tabs'],
  ['content="Ant Design"', 'content="FABi CMS"'],
  ["Ant Design's brand color comes from blue of the base color palette, it's Hex value is `#1677ff`",
    "FABi CMS Design System's brand color is Geek Blue of the base color palette, its Hex value is `#1d39c4`"],
  ['Ant Design prefers the system default font family and then also provides a set of alternative font libraries',
    'FABi CMS Design System uses the Be Vietnam Pro font, with a set of alternative font libraries'],

  // ---- B: notes about the library → neutral
  ['Ant Design does not switch this default layout', 'The library does not switch this default layout'],
  ['Ant Design v6 uses CSS variables by default', 'The library (v6) uses CSS variables by default'],
  ['all Ant Design components only work', 'all components of the library only work'],
  ['If the Ant Design grid layout component does not meet', 'If the grid layout component of the library does not meet'],
  ['Ant Design allows you to customize our design tokens', 'The system allows you to customize its design tokens'],
  ['Ant Design includes some built-in component interaction animations', 'The library includes some built-in component interaction animations'],
  // English phrasing around "antd" before it becomes "the library" (convert.mjs neutralLibraryName)
  ['buttons after antd 4.0', 'buttons since version 4.0'],
  ['Can be any antd Component name', 'Can be any component name of the library'],
  ['use antd `label`', "use the library's `label`"],
  [/\bantd (components?|component)\b/g, "the library's $1"],

  // ---- C: Colors
  ['Ant Design interprets the color system into two levels:', 'The color system has two levels:'],
  [' in the design of Ant Financial', ''],
  ["Ant Design's design team preferred to design with the HSB color model", 'It is best to design with the HSB color model'],
  [/^Ant Design system-level color system also comes from[^\n]*?(The definition of neutral color palette)/m, '$1'],
  ["Ant Design's base color palette totals", 'The base color palette totals'],
  ["Ant Design's color palette also has the ability to further extend. After careful elaboration by designers and programmers, we have come up with a set of color generation tools",
    'The color palette can be extended further with a set of color generation tools'],
  [`the principle that AntV's "`, 'the principle of "'],
  ["Ant Design's color generation algorithm", 'the color generation algorithm'],
  ["Ant Design's functional color palette", 'The functional color palette'],
  ['The neutral color of Ant Design is based on', 'The neutral color is based on'],
  ['In the design of background applications of Ant Financial, our attitude towards color is restrained.', 'In the design of admin applications, color is used with restraint.'],

  // ---- C: Font
  ['The Ant Design typography system is based on', 'The typography system is based on'],
  ['We strongly recommend it since it has been verified by a large number of Ant products. ', ''],
  [/^We have updated Ant Design's base font size[^\n]*\n?/m, ''],
  ['Ant Design was inspired by the pentatonic scale and natural law to define', 'The system defines'],
  ["In Ant Design's visual system, our recommended base font size", 'The recommended base font size'],

  // ---- C: Layout
  [/We were inspired by the architectural ethic[^\n]*?formed the interface layout of Ant Design based on/, 'The interface layout is based on'],
  ["Ant Design's two typical adaptation type:", 'Two typical adaptation types:'],
  ['Ant Design uses the grid system', 'The system uses a grid'],
  ['Ant Design uses a 24-grid architecture.', 'The system uses a 24-grid architecture.'],
  ["Ant Design's designers keep the following 4 things in mind in the communication with engineers:", 'When working with engineers, designers should keep the following 4 things in mind:'],
  [/AntFin's projects[^.]*\. In order to help/, 'In order to help'],
  [', Ant Design proposed the concept of UI common scales', ', the system proposes the concept of UI common scales'],
  ['The result of Ant Design in layout space is not to limit design output', 'The layout space rules are not meant to limit design output'],

  // font stack shown on the Font page = the real FABi CMS stack (brand.ts FONT_FAMILY)
  ['@font-family: -apple-system, BlinkMacSystemFont,', "@font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont,"],
  [/(?:the )?ant design team/gi, 'the design team'],

  // ---- second sweep: Ant packages, Ant Motion, version history of the upstream package
  [/[^.\n]*@ant-design\/happy-work-theme[^.\n]*\.\s*/g, ''],
  [/[^\n]*Remember to use `@ant-design\/icons@6\.x` with `antd@6\.x`[^\n]*\n?/g, ''],
  ['1. use `@ant-design/icons@6.x` with `antd@6.x`.', '1. import the icons from `@fabi/ui/icons` (they ship with `@fabi/ui`).'],
  [/^[^\n]*Ant Motion[^\n]*\n?/gm, ''],
  [/[^.\n|]*available since `?antd@[\d.]+`?\.?[ \t]*/g, ''],
  [/\s*\([^()\n]*antd@[\d.]+[^()\n]*\)/g, ''],

  // ---- C: Motion, Shadow
  ["from Ant Design's core design language:", 'from the core design language:'],
  ['In Ant Design, different shadow directions', 'Different shadow directions'],
  ['Ant Design adopted a three-layer shadow expression method in version 4.0, making', 'the system uses a three-layer shadow expression method, making'],

  // ---- Customize Theme: zero-runtime mode needs a prebuilt CSS file that @fabi/ui 0.1.0 does not ship
  [/Starting from 6\.0\.0, we provide `zeroRuntime` mode[\s\S]*?to generate static styles\./,
    'The library has a `zeroRuntime` mode: no styles are generated at runtime, and the app imports a prebuilt CSS file. ' +
    '**@fabi/ui 0.1.0 does not support this mode yet**: the package ships no prebuilt CSS file, and `antd/dist/antd.css` uses ' +
    '`ant-` classes, so it does not style `fabi-` components. Keep `zeroRuntime` off (the default).\n\n' +
    'You can generate static CSS for some components with `@fabi/ui/static-style-extract` (FABi has not tested this):'],
  ['which will not generate style at runtime, need to import additional CSS file |', 'which will not generate style at runtime, need to import additional CSS file. Not supported by @fabi/ui 0.1.0 |'],
]

export function applyBrandEdits(md, lang = 'vi') {
  for (const [find, repl] of lang === 'en' ? BRAND_EDITS_EN : BRAND_EDITS) md = typeof find === 'string' ? md.split(find).join(repl) : md.replace(find, repl)
  return md
}

# Hướng dẫn bảo trì & mở rộng fc

> Cách thêm component, variant, template, icon, token và đưa lên Storybook. Nhóm `Legacy/*` thời antd
> đã xoá khỏi Figma ngày 2026-09-27 (mục 13).

## 0. Đọc cùng

- `CLAUDE.md` của chủ design system (nằm ngoài repo, quy tắc design đầy đủ). Phần áp dụng cho code đã có trong mục "Style" của `docs/fc-component-conventions.md` và mục "Rules" của `AGENTS.md`; cần bản đầy đủ thì hỏi chủ design system.
- `AGENTS.md`: quy tắc code, lệnh, những bẫy đã gặp.
- `docs/fc-component-conventions.md`: quy ước dựng một component (cấu trúc, hành vi, style, story).
- `docs/token-naming-spec.md`: đặc tả tên token, danh sách từ được phép.
- `docs/fc-component-tokens-proposal.md`: mọi biến `Component/*` và lý do tạo.
- `docs/fc-worklog.md`: đã làm gì, vì sao, checksum từng lần export.

### 0.1 Chuẩn bị
- **Chủ design system:** người giữ quyền sửa file Figma và duyệt PR vào `main`. Tên và kênh liên hệ chưa ghi trong repo: hỏi chủ repo. Mọi mục "hỏi trước" gửi kèm bảng đề xuất (mục 3.1 bước 4).
- **Máy:** Node 22 (như CI). Đặt biến môi trường `UNTITLEDUI_PRO_TOKEN` (xin chủ repo), rồi `npm ci`. Thiếu token thì cài lỗi ở gói `@untitledui-pro/icons`.
- **Figma:** quyền sửa file Figma của FABi CMS (key và link file nằm trong `CLAUDE.md` trên máy chủ dự án; không ghi vào repo hay Storybook vì repo công khai); Claude Code có Figma MCP. Nạp skill `figma-use` trước mọi lần gọi `use_figma` (export, tạo biến, gắn biến). Đọc set có sẵn bằng `get_design_context` / `get_metadata` (nạp skill `figma-design-to-code` trước).
- `scripts/figma-export.js` chỉ chạy được qua `use_figma` (dùng `return` ở cấp cao nhất), không dán vào console plugin.

## 1. Bức tranh tổng

```
Figma FABi CMS  (nguồn chân lý: Variables 0–5 + effect style Shadow/*)
   │  scripts/figma-export.js, chạy qua use_figma, 6 lát
   ▼
tokens/figma-export.json       ← node scripts/merge-figma-export.mjs
   │  npm run build:tokens
   ▼
src/fc/tokens.css · src/fc/tokens.meta.ts · tokens/fc.tokens.json   (file sinh ra)
   │  var(--fc-*)
   ▼
src/fc/components/*  →  src/components/*  (template)  →  Storybook
   │  push main
   ▼
GitHub Actions → https://manhduc310520.github.io/travis/
```

- Luồng đi một chiều. Sửa ở Figma, chạy lại pipeline.
- Không sửa tay file sinh ra: `src/fc/tokens.css`, `src/fc/tokens.meta.ts`, `tokens/fc.tokens.json`. `tokens/figma-export.json` chỉ sinh bằng `merge-figma-export.mjs`; ngoại lệ duy nhất là đường tắt ở mục 7.7.

## 2. Tôi muốn… → làm gì

| Tôi muốn | Làm ở đâu | Mục |
|---|---|---|
| Đổi giá trị một token (màu, khoảng cách, cỡ chữ…) | Figma → export → `build:tokens` | 7.1 |
| Thêm token semantic (`Color/*`, `Space/*`…) | Hỏi trước. Figma `2. Colors` / `3. Dimensions` / `4. Typography` | 7.2 |
| Thêm token riêng của component | Hỏi trước. Figma `5. Components` | 7.3 |
| Thêm / sửa shadow | Effect style `Shadow/*` | 7.4 |
| Đổi tên / xoá token | Figma, rồi sửa code theo chốt chặn | 7.5 |
| Thêm component mới | Figma → token → code → story → kiểm | 3 |
| Thêm variant / prop cho component có sẵn | Figma trước, rồi code | 4 |
| Thêm màn hình mẫu (template) | `src/components/` | 5 |
| Thêm icon | `src/icons.tsx` | 6 |
| Sửa lỗi hiển thị: màu / số sai | Sửa ở Figma, export lại. Không vá trong code | 7.1 |
| Sửa lỗi hiển thị: bố cục / hành vi | CSS module / `.tsx` của component, rồi checklist | 9 |

## 3. Thêm component mới

### 3.1 Trước khi làm
1. Có cần là component không?
   - Không làm thành component: Affix (dùng CSS `position: sticky`), List (Deprecated), Layout / App shells và Search Modal (là template, mục 5).
   - Chỉ dựng khi có màn hình cần: Carousel, Masonry, Mentions, QRCode, Watermark, Tour, Rate, ColorPicker, FloatButton, Anchor, Splitter (`docs/fc-roadmap.md`).
2. Quét file Figma: component / pattern / layout có sẵn thì dùng lại. Thiếu thì ghép từ cái có sẵn.
3. Buộc phải tạo component mới: **hỏi chủ design system trước**. Cũng hỏi trước khi tạo biến `Component/*` mới.
4. Trình duyệt một bảng: API chính (props) + danh sách token `Component/*`, giống các bảng trong `docs/fc-component-tokens-proposal.md`.

### 3.2 Phía Figma
0. **Set đã có trong Figma** (xem `docs/migration/figma-variant-inventory.md`; mọi component trong danh sách "chỉ dựng khi có màn hình cần" đều đã có set): KHÔNG dựng lại.
   - Đọc set có sẵn, kiểm mọi lớp đã gắn biến semantic / `Component/*`, không có lớp trỏ vào biến đã xoá.
   - Map property sang prop (mục 4 bước 2). Thuộc tính số như `Rate[0–5, bước 0.5]` → vd `value` + `allowsHalf`.
   - State code cần mà set chưa có (vd Rate disabled / read-only) → mục 4 bước 1: hỏi trước, dựng ở Figma trước.
   - Bỏ qua bước 3, 4, 6. Story lấy từ danh sách ở `docs/fc-variant-coverage.md`.
1. Tạo phiên bản có tên trong lịch sử phiên bản Figma trước khi ghi. Làm theo đợt, kiểm sau mỗi đợt.
2. Tạo token `Component/*` đã được duyệt (mục 7.3 bước 1–5).
3. Dựng component set đúng chuẩn: auto-layout, variants, gắn lớp vào semantic hoặc `Component/*` vừa tạo (7.3 bước 6).
   - Không gắn `Global/*` hay `Brand/*`.
   - Đặt tên set, property, layer theo quy ước đang có trong file (xem `docs/migration/figma-variant-inventory.md`).
4. Có khung ví dụ "Light Mode" trên trang, như các trang component khác.
5. Export token (7.6), hoặc đường tắt 7.7 khi chỉ thêm vài biến.
6. Thêm component vào `docs/migration/figma-variant-inventory.md`, cùng định dạng: `Sets:` (Prop[Opt|Opt], Bool?) và `Examples:`. File này sinh từ một lần quét 2026-09-26; repo chưa có script quét lại, nên thêm tay.

### 3.3 Phía code
Quy tắc cấu trúc / hành vi / style / JSDoc / i18n: `docs/fc-component-conventions.md`. Dưới đây chỉ phần conventions chưa nói.
1. Tạo `src/fc/components/<Name>/<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx`. Helper để cùng thư mục (vd `Cascader/tree.ts`, `Modal/useOpenState.ts`).
2. Kế thừa props của primitive React Aria, như Button: `Omit<AriaButtonProps, 'className' | 'style' | 'children'>`.
   - Không có primitive trùng tên: ghép từ primitive gần nhất có đủ bàn phím / ARIA, vd Rate = `RadioGroup` + `Radio` (mỗi sao một radio, `isDisabled` / `isReadOnly` có sẵn), props `Omit<RadioGroupProps, 'className' | 'style' | 'children'>`. Ghi lựa chọn vào JSDoc và worklog.
3. Dùng lại mảnh chung, không viết lại: `cx` (`src/fc/space.ts`); lớp nổi `overlay.module.css`; hàng lựa chọn `listItem.module.css`; màu phân loại `PaletteHue` (`src/fc/palette.ts`) + `palette.module.css`.
   - Field: `src/fc/components/Input/field.tsx` (`FieldChromeProps`, `useFieldSize`, `controlClasses`, `fieldFrame`) để nhận cỡ từ `<Form size>` và prop `tooltip`.
4. Lớp nổi mở ngay lần render đầu (`defaultOpen`) phải chờ `usePortalReady()` (`src/fc/components/Modal/useOpenState.ts`). Không tự đặt portal container.
5. CSS module: cấu trúc như Button / Tag (biến cục bộ `--_*`, lớp màu set biến, lớp variant quyết định tô gì); trạng thái qua `data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled`, `data-selected`. Đầu file ghi chú ứng với frame / binding Figma nào.
   - Figma vẽ viền bên trong khung, nên token lưu khoảng cách ngoài. CSS trừ viền: `calc(var(--fc-component-button-padding-inline) - var(--fc-stroke-width-base))`.
6. Nhiều chuỗi hiển thị thì gom vào type `<Name>Labels` (như `PaginationLabels`, `TableLabels`).
7. Icon lấy từ `src/icons.tsx` (mục 6), không import thẳng từ `@untitledui-pro/icons`.
8. Export trong `src/fc/index.ts`: `export { Name }` và `export type { NameProps }` từ `'./components/Name/Name'`.
9. Agent con: theo mục "Cấu trúc" và "Kiểm trước khi báo xong" của conventions (không sửa `index.ts`, `.storybook/*`, `tokens/*`, `src/fc/tokens.*`, `overlay` / `listItem` module; không chạy Storybook, trình duyệt, git), báo lại cho người điều phối.

### 3.4 Story
- Theo mục "Story" của `docs/fc-component-conventions.md`. Lớp nổi thêm decorator `minHeight`, vì React Aria giới hạn popover theo chiều cao `<body>` (Select dùng `minHeight: 360`).

### 3.5 Kiểm và ghi lại
1. Chạy checklist mục 9. Cặp màu chữ / nền mới → thêm vào `PAIRS` (mục 7.2 bước 8).
2. (Người điều phối) Mở Storybook (`npm run storybook`), đổi brand / mode / density trên toolbar: 20 tổ hợp. Thử bàn phím. Xem tab Accessibility (axe).
3. Ghi lại:
   - `docs/fc-worklog.md`: component, số token + checksum, chỗ lệch Figma / `CLAUDE.md`, câu hỏi mở.
   - `docs/fc-component-tokens-proposal.md`: bảng token mới.
   - `docs/fc-roadmap.md`: bỏ tên khỏi dòng "Không làm", thêm vào dòng đợt mới kèm ✅ và màn hình cần nó.
   - `docs/fc-variant-coverage.md`: cập nhật mục của component bằng ký hiệu ✅ / ➕ / ⚠️.
4. Commit và deploy (mục 10).

## 4. Thêm variant / prop cho component có sẵn

1. Option phải có trong component set Figma. Chưa có thì hỏi trước, dựng ở Figma trước.
2. Map property Figma sang prop như các component đã làm:
   - `Type` → `variant`. `Size[Default|Large|Small]` → `size: 'md' | 'lg' | 'sm'`.
   - Boolean (`Danger`, `Ghost`) → prop boolean. `Icon Start?` → `iconStart`.
   - Figma `State` (Hover / Pressed / Focused) **không** là prop: đến từ data attribute React Aria.
   - Tên khác palette: Figma "Pink" = `magenta`; Tag "Processing" = `info`.
3. Cần giá trị riêng → token `Component/*` trước (mục 7.3). Không thì dùng semantic.
4. Mở rộng union type đã export (`ButtonVariant`, `TagVariant`…), thêm JSDoc. Giữ hành vi mặc định cũ; prop cũ vẫn chạy như lối tắt.
5. CSS đặt trong cấu trúc lớp sẵn có của component. Thêm disabled, focus, reduced-motion cho lớp mới.
6. Kiểm tương phản ở Light **và** Dark, mọi brand. Cặp semantic mới → `PAIRS`.
7. Thêm story cho option mới, thêm vào `argTypes`.
8. Ghi worklog. Nếu cập nhật `docs/fc-variant-coverage.md`, dùng ký hiệu sẵn có: ✅ đã có, ➕ thêm mới, ⚠️ chưa làm / gần đúng (kèm lý do).

## 5. Thêm màn hình mẫu (template)

1. Bám frame layout Figma: cùng cấu trúc trang, lưới, spacing, vị trí header / sidebar / nội dung.
2. File phẳng trong `src/components/`: `<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx`. Dữ liệu mẫu ở `<name>Samples.ts`.
3. Chỉ ghép từ fc: component từ `'../fc'`; mảnh chung chưa export (`cx` ở `../fc/space`, `ScrollArea`, `usePortalReady` ở `../fc/components/Modal/useOpenState`, `overlay.module.css`, `listItem.module.css`) import thẳng đường dẫn như `SearchModal.tsx`; icon từ `'../icons'`.
4. Màn sản phẩm là nội dung đặt trong `AppShell`. Màn danh sách dùng lại khuôn `RestaurantListPage`: breadcrumb + một nút primary, hàng bộ lọc, một `Table` có `Empty` / `Spin`.
5. Responsive:
   - Bố cục thuần CSS dùng `@media` với px của breakpoint (767 = `--fc-breakpoint-sm-max`).
   - Chỉ dùng `useMediaQuery(DESKTOP_QUERY)` (`src/components/useMediaQuery.ts`) cho việc CSS không làm được (sidebar hay Drawer).
   - Không ẩn / hiện chỉ dựa vào việc có truyền callback hay không.
6. Giá trị Figma chưa có biến (vd sidebar 256px): hỏi chủ design system trước có tạo biến `Component/*` không. Trong lúc chờ, để px thô kèm ghi chú frame Figma (như `AppShell.module.css`) và ghi vào worklog mục câu hỏi mở.
7. Story: `title: 'Templates/<Name>'`, `parameters: { layout: 'fullscreen' }`. Phủ các trạng thái (rỗng, có dữ liệu, không khớp, đang tải, mobile).
8. Kiểm bằng `npm run lint` (toàn repo). `npx oxlint src/fc` trong conventions chỉ đủ cho component, không quét `src/components/`.

## 6. Thêm icon

1. Chọn icon trên trang `🍑 Icon` của Figma (Untitled UI, tên kebab-case, vd `home-03`). Tên code là PascalCase (`Home03`). Tra toàn bộ ở Storybook "Design Tokens/Icons".
2. Kiểm icon đã có trong `src/icons.tsx` chưa. Chưa có thì thêm một dòng vào đúng nhóm chú thích, theo mẫu các dòng sẵn có:
   ```ts
   export const Home01 = sized(UI.Home01)                // mặc định 16px
   export const ChevronDown = sized(UI.ChevronDown, 12)  // chevron / mũi tên 12px
   ```
   - Cỡ mặc định 16. Chevron / mũi tên 12. Cỡ khác theo tiền lệ trong file.
   - Icon X để đóng / gỡ / xoá (`X`, `XClose`, `XCircle`) luôn 16 ở mọi component (`--fc-typography-size-lg`: 16 Default, 14 Compact). CSS của component không được thu nhỏ nó (vd nút `Button` cỡ `sm` phải đặt `--_icon-size`).
   - Icon lớn hiển thị trạng thái (Result, trạng thái rỗng của Search Modal): nét `--fc-stroke-width-strong` (2px) với `vector-effect: non-scaling-stroke`.
3. Nút chỉ có icon phải có `aria-label`. Icon trang trí dùng `aria-hidden="true"`.
   - Icon kiểu đặc (vd sao đã chọn của Rate): thêm `import * as UISolid from '@untitledui-pro/icons/solid'` vào `src/icons.tsx`, export với hậu tố `Solid` (`export const Star01Solid = sized(UISolid.Star01, 20)`). Không import package ở nơi khác. Hỏi trước nếu Figma dùng icon nét rồi tô bằng fill.
4. Logo, cờ, hình minh hoạ thương hiệu không phải icon UI: SVG nội tuyến trong `src/components/brandAssets.tsx`.
5. Chạy `npx tsc --noEmit -p tsconfig.app.json`: tên không có trong package sẽ báo lỗi.

## 7. Thêm / sửa token

Chung cho mọi thay đổi:
- Không chạy lệnh Figma khác khi đang có job ghi Figma dài: chúng làm chậm nhau.
- Trước khi sửa biến hoặc binding có sẵn: sao lưu giá trị cũ ra `docs/migration/figma-backup-<việc>.json`, kèm ghi chú cách khôi phục (xem các file `figma-backup-*` có sẵn).

### 7.1 Đổi giá trị token
1. Tìm biến trong Figma. Sửa theo từng mode: Light / Dark (`2. Colors`), Default / Compact (`3. Dimensions`, `4. Typography`), `Value` (`5. Components`).
2. Giữ nguyên kiểu giá trị đang có của biến: alias `Global/Light|Dark/…`, alias `Brand/Light|Dark/…` (mọi token accent, `Header-Start|End`: phải giữ để đổi theo brand), alias token semantic khác, hoặc giá trị thô (vd `Content/Neutral*`, `Border/Control`). Đổi alias thì trỏ cùng tầng. Sửa tương phản thì lấy bậc nhỏ nhất vẫn đạt. Sửa màu brand thì sửa trong `1. Brand`, từng mode brand.
3. Plugin API không ghi được giá trị alias + độ mờ (vd `Brand/*/Outline-Accent`): sửa tay trong Figma.
4. Export (7.6), rồi `npm run build:tokens` và `npm run audit:contrast`.
5. Sửa chữ trên các trang docs Figma: 🎨 Colors, 📏 Size, Space & Radius, 🔠 Typography, 💡 Effects. Ô màu gắn biến nên tự đổi, nhưng cột chữ Value / Group thì không.
6. Xem lại trong Storybook ở các theme bị ảnh hưởng. Ghi worklog.

### 7.2 Thêm token semantic
1. Dùng lại token có sẵn trước. Chỉ tạo khi chủ design system đồng ý (tiền lệ: `Color/Border/Control`, worklog §16).
2. Đặt tên theo `docs/token-naming-spec.md` §4–§5, chỉ dùng từ trong danh sách được phép.
   - Từ chưa có trong §5 (vd `highlight`): khi hỏi ở bước 1, đề xuất từ + nghĩa + vì sao từ có sẵn không dùng được. Được đồng ý thì thêm từ vào §5 của spec trong cùng commit, rồi mới tạo biến.
3. Collection theo loại. Biến mới nằm ở **cuối** collection.
   - `Color/*` → `2. Colors`.
   - `Size/*`, `Space/*`, `Radius/*`, `Stroke/*`, `Breakpoint/*` → `3. Dimensions`.
   - `Typography/*` → `4. Typography`.
4. Giá trị: alias `Global/Light/…` / `Global/Dark/…` theo spec; token accent (đổi theo brand) alias `Brand/Light/…` / `Brand/Dark/…`. Không có bậc phù hợp thì hỏi trước khi dùng giá trị thô.
5. Scope đúng loại (vd màu viền: Stroke). Code syntax WEB: `var(--fc-<đường dẫn viết thường, / thành ->)`, vd `var(--fc-color-border-control)`.
6. Gắn biến vào node. Thêm dòng cho token trên trang docs Figma tương ứng.
7. Export, `npm run build:tokens`. Token xuất hiện trong `src/fc/tokens.css` dưới `[data-mode="light"]` / `[data-mode="dark"]` (hoặc `[data-density=…]`); giống nhau mọi mode thì dưới `[data-mode]` / `[data-density]`.
8. Thêm `[nhãn, fg, bg, min]` vào `PAIRS` trong `scripts/audit-contrast.mjs` (4.5 cho chữ, 3 cho phi chữ), tên viết thường như trong code (`color/background/highlight`, tên Figma báo "Unknown token"). Chạy `npm run audit:contrast`.
   - Token chữ / viền / icon / focus: cặp với nền nó nằm trên.
   - Token nền mới: cặp mỗi màu chữ sẽ đặt lên nó, vd `['Chữ chính trên highlight', 'color/content/neutral-strong', 'color/background/highlight', 4.5]` (như các cặp `*-faded`).
9. Trang Storybook "Design Tokens" lọc theo tiền tố cố định (`tokensWithPrefix('color/border/')` trong `src/fc/docs/*.stories.tsx`). Tiền tố mới cần thêm story.

### 7.3 Thêm token `Component/*`
1. Chỉ tạo khi đúng "Nguyên tắc chọn" trong `docs/fc-component-tokens-proposal.md`:
   - Giá trị thang chung không diễn tả được, hoặc lựa chọn designer muốn chỉnh riêng.
   - Màu theo vai trò (hover / active / danger) dùng thẳng semantic.
   - Không tạo token cho số tính được từ số khác.
2. Hỏi trước, kèm bảng: tên, giá trị / alias, lý do.
3. Tên `Component/{Component}/{Element}-{Property}-{Variant}-{State}-{Scale}`.
   - `{Component}` hiện theo tên component trong code, một đoạn PascalCase: `TreeSelect`, `InputNumber` → `--fc-component-treeselect-…`.
   - Quy tắc cho tên nhiều từ mới chưa chốt (mục 14): hỏi trước khi tạo nhóm như `Search-Modal`.
4. Tạo trong `5. Components`, mode `Value`. Có bậc semantic khớp thì alias, không thì số thô.
   - Collection chỉ có một mode, nên **số thô không co theo Compact**. Muốn co thì alias token có density (vd Spin → `Size/*`).
   - Mọi số xuất ra CSS đều thêm `px` (trừ `Typography/Weight/*`). Token không đơn vị (opacity, line-height tỉ lệ, `Component/*/Font-Weight`) chưa được hỗ trợ: độ đậm alias vào `Typography/Weight/*`, còn lại hỏi trước.
5. Scope theo loại (gap / width-height / font-size / line-height / fill / stroke). Code syntax `var(--fc-component-…)`.
6. Gắn node của component set vào biến mới.
   - Chỉ gắn ở component gốc (node không nằm trong instance). Instance tự thừa hưởng; gắn thêm vào lớp trong instance sẽ tạo override mới và cắt lớp đó khỏi component gốc.
   - Lớp trong instance chỉ gắn tại chỗ khi nó đã là override (Figma liệt kê trong `instance.overrides` của một instance trên cùng trang).
   - Trang nhiều instance (Button) tốn khoảng 0,2 giây mỗi lần ghi. Ghi trong một vòng đồng bộ (nạp font trước, không `await` giữa các lần ghi), mỗi lượt ≤ 60–70 giây, chạy lại tới khi hết. Mẫu có sẵn: `docs/migration/legacy-rebind.figma.js` (node gốc), `docs/migration/legacy-rebind-instances.figma.js` (override trong instance).
7. Export đầy đủ 6 lát (7.6), `npm run build:tokens`. Token nằm trong khối `[data-brand], [data-mode], [data-density]`, nên tự tính lại trong vùng `data-mode="dark"` lồng bên trong.
8. Dùng trong CSS: `var(--fc-component-<name>-…)`.
9. Ghi bảng vào `docs/fc-component-tokens-proposal.md`, ghi số biến và checksum vào worklog.

### 7.4 Thêm / sửa shadow
- Shadow là **effect style**, không phải biến. Chỉ có hai style `Shadow/*` dùng cho code: `Shadow/Light` (panel) và `Shadow/Base` (mọi bề mặt nổi). Dùng theo flat-first trong `CLAUDE.md`.
- Effect style khác trong file (vd `Component/Button/*Shadow`) không được export, không dùng cho component mới.
- Chỉ style tên bắt đầu `Shadow/` được export; chỉ các lớp DROP_SHADOW / INNER_SHADOW đang hiện.
- Màu shadow xuất ra dạng giá trị cố định: biến gắn vào màu shadow không theo sang code. Shadow giống nhau ở Light và Dark (nằm ở `:root`).
- Gộp / xoá một style: chuyển node sang style còn lại trước, rồi xoá style, xoá dòng trên trang 💡 Effects.
- Export đầy đủ (7.6); lát `effects` là lát chứa shadow. Code dùng `var(--fc-shadow-base)` / `var(--fc-shadow-light)`; lớp nổi đã có sẵn qua `overlay.module.css` `.surface`.

### 7.5 Đổi tên / xoá token
1. Đổi tên trong Figma. Binding theo ID nên không gãy. Sửa Code syntax theo tên mới.
2. Export, `npm run build:tokens`:
   - Dừng trước khi ghi nếu biến khác còn alias tên cũ.
   - Báo lỗi (sau khi đã ghi file) nếu code trong `src/fc/` còn dùng `--fc-*` không tồn tại.
3. Chốt chặn không quét `src/components/`, `.storybook/`, `src/Welcome.mdx`. Tự tìm:
   ```bash
   grep -rn "fc-ten-cu" src .storybook
   ```
4. Chỉ xoá biến khi **0 tham chiếu**: node (kể cả instance), style, và biến khác alias vào nó.

### 7.6 Export đầy đủ (cách chuẩn)
1. Qua tool `use_figma` trên file Figma của FABi CMS, chạy `scripts/figma-export.js` 6 lần, mỗi lần sửa `const SLICE = '…'`: `global`, `palette`, `semantic`, `rest`, `component`, `effects`. Mỗi lần trả tối đa khoảng 20 KB. Script chỉ đọc.
2. Lưu mỗi kết quả ra một file. Repo chưa quy định chỗ lưu và chưa chứa file lát nào: lưu ngoài repo.
3. Ghép:
   ```bash
   node scripts/merge-figma-export.mjs global.json palette.json semantic.json rest.json component.json effects.json
   ```
   - Báo lỗi khi thiếu collection, mode lệch giữa hai lát, hoặc một biến bị export hai lần.
4. So số biến in ra với lần trước. Hiện tại: global 242, brand 30, colors 236, dimensions 66, typography 23, components 272, effects 2.
5. Chạy `npm run build:tokens`, `npm run audit:contrast`.
6. Xem diff của file sinh ra: chỉ thay đổi đúng chỗ đã sửa trong Figma.
7. Kiểm file khớp Figma: `node scripts/export-checksum.mjs` phải trùng với `figma-export.js` chạy `SLICE = 'checksum'`.

### 7.7 Đường tắt: thêm vài biến, không export lại toàn bộ
- Theo `AGENTS.md`: chép biến mới vào cuối collection tương ứng trong `tokens/figma-export.json`, đúng thứ tự Figma. Sửa giá trị thì sửa tại chỗ.
- Chép nguyên giá trị Figma, kể cả số float32 (vd `Stroke/Width/Icon` = `1.2000000476837158`).
- Rồi so checksum giữa Figma và local. Phải khớp cả 6 lát mới đi tiếp.
  - Figma: chạy `scripts/figma-export.js` qua `use_figma` với `SLICE = 'checksum'`, trả mã của cả 6 lát trong một lần.
  - Local: `node scripts/export-checksum.mjs`.
  - Mã là FNV-1a 32-bit trên bản JSON đã sắp xếp khoá, vì Figma không trả collection / biến theo thứ tự cố định. Checksum trong worklog trước §23 tính theo thứ tự, không so được với cách này.
- Dòng `_source` trong file vẫn giữ ngày export cũ.
- Lát `component` đã khoảng 16,6 KB trên giới hạn 20 KB: các đợt sau có thể phải tách lát.

## 8. Đặt tên

- Tên token (biến Figma, biến CSS, token component, state, shadow): `docs/token-naming-spec.md` §1–§6. Vd `Space/Padding/SM` → `--fc-space-padding-sm`; `Component/Menu/Item-Background-Selected`.

| Thứ | Quy tắc | Ví dụ |
|---|---|---|
| Component | `src/fc/components/<Name>/<Name>.tsx` | `Select/Select.tsx` |
| Template | `src/components/<Name>.tsx`, dữ liệu `<name>Samples.ts` | `restaurantSamples.ts` |
| Story | `Components/<Nhóm>/<Name>` (nhóm và thứ tự theo trang Figma, khai báo trong `storySort` của `.storybook/preview.tsx`), `Templates/<Name>`, `Design Tokens/<Trang>` | `Components/General/Button` |
| Nhãn nhiều chuỗi | `<Name>Labels` | `TableLabels` |
| Sao lưu Figma | `docs/migration/figma-backup-<việc>.json` | `figma-backup-wave5-legacy.json` |

- Tên duy nhất trong toàn file. Hai tên chỉ khác hoa / thường làm `build:tokens` báo lỗi.
- Không ghi mode, không ghi giá trị vào tên (trừ thư mục `Global/{Light|Dark}`, `Brand/{Light|Dark}`).

## 9. Checklist trước khi commit

```bash
npx tsc --noEmit -p tsconfig.app.json   # 0 lỗi. Không dùng -p . (không kiểm gì)
npm run lint                            # oxlint toàn repo, 0 lỗi
npm run build:tokens                    # sinh lại token + chốt chặn
npm run audit:contrast                  # phải in: below minimum: 0 (checked = 10 × số cặp PAIRS, hiện 240; mỗi cặp mới +10)
npm run build-storybook                 # tuỳ chọn: giống bước cuối của CI
```

- [ ] Không hex, `rgba()`, px lẻ trong CSS module; không `Global/*`, `Brand/*`.
- [ ] Cặp màu mới đã vào `PAIRS` (số lượt kiểm tăng theo).
- [ ] File sinh ra (`src/fc/tokens.css`, `src/fc/tokens.meta.ts`, `tokens/fc.tokens.json`) và `tokens/figma-export.json` (sinh bằng `merge-figma-export.mjs`, hoặc sửa theo 7.7) được commit cùng thay đổi.
- [ ] Sao lưu mới trong `docs/migration/` được commit.
- [ ] Mỗi variant Figma có story; đã xem ở Light và Dark.
- [ ] Worklog đã ghi.

## 10. Commit & deploy

1. Tạo nhánh từ `main`, commit (kèm file sinh ra + sao lưu). Mở PR vào `main`: CI chỉ build Storybook, không deploy.
2. Chủ design system duyệt → merge. Push vào `main` chạy `.github/workflows/storybook.yml`:
   - `npm ci` → `npm run build:tokens` → `npm run audit:contrast` → `npm run build-storybook` → GitHub Pages.
   - Chờ job `deploy` xanh trên tab Actions rồi mới mở URL.
   - Deploy lại không cần sửa code: chạy tay workflow (`workflow_dispatch`) và **chọn nhánh `main`** (workflow không tự chặn nhánh khác).
   - Nhánh `fc-design-system` đang trùng commit với `main` (`1743f94`), không có gì chưa merge: chưa rõ còn dùng, đừng làm việc trên nó khi chưa hỏi.
3. CI **không** chạy tsc và lint: phải chạy ở máy trước khi push.
4. `npm ci` cần secret `UNTITLEDUI_PRO_TOKEN` (gói icon trả phí, `.npmrc`). Thiếu secret thì CI lỗi ngay bước cài.
5. Xem kết quả: https://manhduc310520.github.io/travis/
6. So ảnh (tuỳ chọn, không nằm trong CI): `npm run chromatic` (`chromatic.config.json`).

## 11. Bảo trì định kỳ

- **Sau mọi thay đổi biến trong Figma:** export (7.6), `build:tokens`, `audit:contrast`, commit file sinh ra.
- **QA Storybook** (sau mỗi đợt lớn): chạy ở tab trình duyệt đang hiện (foreground). Tab ẩn làm chậm timer và đóng băng animation. Đừng sửa module mà preview import (`src/fc/index.ts`, `field.tsx`…) khi đang chạy.
- **Nâng cấp `react-aria-components` / `react-aria` / Storybook:** kiểm lại
  - `src/fc/i18n/vi-VN.ts`: chuỗi mới của React Aria sẽ hiện tiếng Anh.
  - `UNSTABLE_Toast*` trong `src/fc/components/Message/toast.tsx`, `UNSAFE_PortalProvider` trong `src/fc/FcTheme.tsx`.
  - Bộ lọc cảnh báo `act()` trong `.storybook/preview.tsx`.
  - Rồi checklist mục 9 + QA Storybook đầy đủ.
- **Một số devDependencies ghim `latest`** (vitest, playwright…): tạo lại lockfile có thể nhảy major.
- **Thêm brand mới** (mode mới trong `1. Brand`): thêm vào type `FcBrand` và mảng `FC_BRANDS` trong `src/fc/axes.ts`; trong `scripts/audit-contrast.mjs` thêm brand vào vòng lặp **và** sửa hệ số `5` ở `const checked = 5 * 2 * PAIRS.length` (tốt nhất dùng độ dài danh sách brand), rồi cập nhật số lượt kiểm ở mục 9. Không thì brand mới không được kiểm tương phản.
- **Giữ tài liệu khớp:** `docs/fc-worklog.md`, `docs/fc-roadmap.md`, `AGENTS.md`, và file này.

## 12. Lỗi thường gặp

| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| `tsc` luôn 0 lỗi | Chạy `-p .` (file giải pháp, không kiểm gì) | `npx tsc --noEmit -p tsconfig.app.json` |
| `build:tokens`: "Code references fc tokens that do not exist" | Code dùng token đã đổi tên / xoá, hoặc gõ sai | Sửa tên trong code, hoặc tạo token ở Figma trước |
| `build:tokens`: "aliases missing token" | Đổi tên trong Figma còn sót biến alias | Sửa alias ở Figma, export lại |
| `build:tokens`: "Media queries off the breakpoint tokens" | `@media` trong `src/fc` dùng px không phải breakpoint | Dùng 480 / 575 / 576 / 767 / 768 / 991 / 992 / 1199 / 1200 / 1599 / 1600 |
| `build:tokens` lỗi nhưng file sinh ra đã đổi | Chốt chặn chạy sau khi ghi file | Sửa lỗi rồi chạy lại; đừng commit bản lỗi |
| Template dùng token sai mà build vẫn qua | Chốt chặn chỉ quét `src/fc/` | Tự grep `src/components/` |
| `audit:contrast` exit 1, in `✗ nhãn: brand.mode tỉ lệ` | Cặp màu dưới ngưỡng | Sửa giá trị ở Figma (7.1), không vá code |
| axe báo tương phản placeholder | Quy ước: placeholder dùng màu disabled | Chấp nhận, không sửa |
| `merge-figma-export`: "Missing collections" | Thiếu lát | Chạy đủ 6 lát |
| Biến `Component/*` mới không có trong export | Tên không bắt đầu đúng `Component/` (phân biệt hoa / thường) | Đổi tên trong Figma |
| Token component không co ở Compact | `5. Components` một mode, giá trị là số thô | Alias vào token có density |
| Nút mở menu bị tối, thiếu tương phản ở Dark | React Aria giữ `data-pressed` khi menu mở | Style `aria-expanded="true"` bằng màu gốc (như Button) |
| Popover trong story bị cắt | React Aria giới hạn theo chiều cao `<body>` | Decorator `minHeight` |
| Lớp nổi `defaultOpen` không hiện | Portal container của FcTheme có sau một lần render | `usePortalReady()` |
| Storybook "Unable to index files" | Index cũ sau nhiều lần hot reload | Khởi động lại dev server |
| Icon lệch dòng chữ ngoài Storybook | Thiếu `src/index.css` (`.fabi-icon`) | Import `src/index.css` |
| `use_figma` rớt kết nối khi gắn lại nhiều node | Mỗi lần ghi 0,2–0,34 giây, lượt quá dài | Lượt ≤ 60–70 giây; phần đã ghi vẫn giữ, chạy lại (script phải chạy lại được) |
| `setBoundVariable('maxWidth', …)` trên node chữ: "invalid field for text node" | Plugin API không gắn biến vào min / max width của text | Gắn tay trong Figma, hoặc gỡ binding (giá trị giữ nguyên) |
| Sửa node chữ báo font không tải được (vd "SF Pro Text") | Font không có trong Figma | Bỏ qua node đó, ghi lại; đổi font trong Figma nếu cần sửa |
| Gắn `width` cho icon xong thì mất binding `height` | Lớp khoá tỉ lệ: chiều cao đi theo chiều rộng | Bình thường, không cần gắn lại |
| CI lỗi ở `npm ci` | Thiếu secret `UNTITLEDUI_PRO_TOKEN` | Thêm secret trong Settings của repo |

## 13. Lịch sử & sao lưu

- **Ant Design đã gỡ 2026-09-27.** Code cũ: `docs/migration/legacy-antd-stories-2026-09-26.zip`, `docs/migration/legacy-antd-theme-2026-09-27.tgz`, và lịch sử git trước commit `1743f94`. Lint chặn import `antd` / `@ant-design/*`.
- **Nhóm `Legacy/*` trong `5. Components`** (biến thời antd) **đã xoá 2026-09-27**: xem `docs/fc-worklog.md` §23. 568 lớp (chủ yếu icon đã swap lồng trong instance, API không gắn lại được) còn trỏ vào biến đã xoá, giá trị giữ nguyên; sửa tay trong Figma nếu cần. Sao lưu: `docs/migration/figma-backup-legacy-vars.txt`.
- Sao lưu Figma khác trong `docs/migration/`, mỗi file có ghi chú cách khôi phục:
  - `figma-backup-before-fc.json`, `fc-rename-map.json` / `.md`: đổi tên giai đoạn 1.
  - `figma-backup-before-global-split.json`: trước khi tách `0. Global`.
  - `figma-backup-before-contrast.json`: trước khi sửa tương phản.
  - `figma-backup-border-control.json`: binding trước khi thêm `Color/Border/Control`.
  - `figma-backup-wave4-legacy.json`, `figma-backup-wave5-legacy.json`: giá trị trước khi alias ở đợt 4, 5.
- Tài liệu thời antd (chỉ để tra cứu): `docs/migration/CLAUDE.antd-v6.backup.md`, `docs/migration/legacy/`.
- `docs/migration/verify-tokens.mjs` không chạy được nữa (import `src/theme/*` đã xoá).

## 14. Việc còn mở (chưa có trong repo)

- Script ghép lại chỉ một lát vào `tokens/figma-export.json` (merge hiện đòi đủ 6 lát).
- Quy định scope Figma cho từng loại biến (radius, padding, màu chữ…) và có ẩn biến mới khỏi thư viện không.
- Token semantic mới: bắt buộc alias Global, hay được dùng giá trị thô như `Color/Border/Control`?
- Tên nhóm component nhiều từ: `TreeSelect` (theo export) hay `Search-Modal` (đề xuất ở worklog §19)?
- Hỗ trợ token không đơn vị (opacity, line-height tỉ lệ, font-weight ngoài `Typography/Weight/*`).
- Mở rộng chốt chặn `build:tokens` sang `src/components/`, `.storybook/`; CI kiểm file sinh ra khớp export.
- Script QA Storybook (iframe + axe) và đo token ở 20 tổ hợp theme chưa nằm trong repo.

# Token `Component/*` — đợt 1–2 (đã duyệt, đã làm)

> Soạn 2026-09-26, hướng A: gọn, làm theo từng đợt. **Duyệt 2026-09-26**: danh sách 41 biến, đổi
> tên nhóm cũ thành `Legacy/`, số thô không co theo Compact. Kết quả thực hiện: xem mục cuối.
> Tên theo `docs/token-naming-spec.md`: `Component/{Component}/{Element}-{Property}-{Variant}-{State}-{Scale}`.
> Code: `--fc-component-{component}-{…}` (chữ thường), ví dụ `--fc-component-switch-track-height`.

## Nguyên tắc chọn

1. **Chỉ tạo token cho quyết định riêng của component**: kích thước thang chung không diễn tả được, hoặc một lựa chọn designer có thể muốn chỉnh (ví dụ màu rãnh Switch khi tắt). Trạng thái màu theo vai trò (hover / active / danger…) vẫn dùng thẳng token semantic.
2. **Alias vào token chung khi có bậc khớp**, để tự đổi theo Light / Dark, brand và Compact. Chỉ để **số thô** khi không có bậc nào khớp.
3. **Bỏ số lẻ kiểu antd** (15, 7, 11 = "16 trừ viền 1px"). Token lưu giá trị thiết kế (16, 8), code tự trừ viền. Giao diện vẫn giữ nguyên.
4. **Bỏ hẳn nhóm `Global`** (biến chỉ trỏ lại token semantic).
5. **Không tạo token cho số tính được từ số khác.** Ví dụ núm Switch = chiều cao rãnh − 2 × khoảng đệm.

## Danh sách — 41 biến (thay 375 biến cũ của 12 component)

### Button — 6
| Biến mới | Giá trị | Thay biến cũ |
|---|---|---|
| `Component/Button/Padding-Inline` | → `Space/Padding/Base` (16) | `paddingInline` = 15 |
| `Component/Button/Padding-Inline-SM` | → `Space/Padding/XS` (8) | `paddingInlineSM` = 7 |
| `Component/Button/Padding-Inline-LG` | → `Space/Padding/Base` (16) | `paddingInlineLG` = 15 |
| `Component/Button/Icon-Size` | → `Typography/Size/LG` (16) | `onlyIconSize` |
| `Component/Button/Icon-Size-SM` | → `Typography/Size/Base` (14) | `onlyIconSizeSM` = 14 |
| `Component/Button/Icon-Size-LG` | 18 | `onlyIconSizeLG` = 18 |

⚠️ Code hiện để icon 16px ở mọi cỡ nút; khi dùng token sẽ theo Figma (nhỏ 14, lớn 18).

### Input — 1
| Biến mới | Giá trị | Thay biến cũ |
|---|---|---|
| `Component/Input/Addon-Background` | → `Color/Fill/Alternate` | `addonBg` |

Padding ngang đã có ở tầng chung (`Space/Padding-Inline/Control`, `-SM`), không cần token riêng.

### Radio — 2 (kiểu nút)
| Biến mới | Giá trị | Thay biến cũ |
|---|---|---|
| `Component/Radio/Button-Padding-Inline` | → `Space/Padding/Base` (16) | `buttonPaddingInline` = 15 |
| `Component/Radio/Button-Padding-Inline-SM` | → `Space/Padding/XS` (8) | (mới, code đang dùng) |

Ô tròn dùng `Size/Control/Interactive` (tầng chung); chấm = nửa ô, tính trong code.

### Switch — 8
| Biến mới | Giá trị | Thay biến cũ |
|---|---|---|
| `Component/Switch/Track-Width` | 44 | `trackMinWidth` |
| `Component/Switch/Track-Width-SM` | 28 | `trackMinWidthSM` |
| `Component/Switch/Track-Height` | 22 | `trackHeight` |
| `Component/Switch/Track-Height-SM` | 16 | `trackHeightSM` |
| `Component/Switch/Track-Padding` | 2 | `trackPadding` |
| `Component/Switch/Track-Background` | → `Color/Content/Neutral-Light` | (mới) |
| `Component/Switch/Track-Background-Hover` | → `Color/Content/Neutral` | (mới) |
| `Component/Switch/Handle-Background` | → `Color/Content/On-Solid` | `handleBg` → Palette/White |

- Bỏ `handleSize`, `innerMinMargin`, `innerMaxMargin` (6 biến): đều tính được từ chiều cao rãnh và khoảng đệm.
- `Track-Background` cố ý đậm hơn xám của Figma kit (3.36:1 thay vì 1.8:1): switch phải thấy trạng thái ở mức 3:1.

### Tag — 5
| Biến mới | Giá trị | Thay biến cũ |
|---|---|---|
| `Component/Tag/Background-Default` | → `Color/Background/Neutral` | `defaultBg` |
| `Component/Tag/Content-Default` | → `Color/Content/Neutral-Strong` | `defaultColor` |
| `Component/Tag/Padding-Inline` | → `Space/Padding/XS` (8) | (mới, code đang dùng 8 − viền) |
| `Component/Tag/Font-Size` | → `Typography/Size/SM` (12) | (mới) |
| `Component/Tag/Line-Height` | → `Typography/Line-Height/SM` (20) | (mới) |

⚠️ Code hiện dùng nền `Color/Fill/Alternate` cho Tag mặc định, lệch Figma (`Background/Neutral`, đậm hơn một chút). Khi dùng token sẽ theo Figma.

### Badge — 4
| Biến mới | Giá trị | Thay biến cũ |
|---|---|---|
| `Component/Badge/Indicator-Height` | 20 | `indicatorHeight` |
| `Component/Badge/Indicator-Height-SM` | 14 | `indicatorHeightSM` → Typography/Size/Base |
| `Component/Badge/Dot-Size` | 6 | `dotSize` + `statusSize` (gộp, cùng 6) |
| `Component/Badge/Font-Size` | → `Typography/Size/SM` (12) | `textFontSize`, `textFontSizeSM` |

`Indicator-Height-SM` để số thô: đây là chiều cao, bản cũ trỏ nhầm vào cỡ chữ.

### Avatar — 10
| Biến mới | Giá trị | Thay biến cũ |
|---|---|---|
| `Component/Avatar/Size` | → `Size/Control/Base` (32) | `containerSize` |
| `Component/Avatar/Size-SM` | → `Size/Control/SM` (24) | `containerSizeSM` |
| `Component/Avatar/Size-LG` | → `Size/Control/LG` (40) | `containerSizeLG` |
| `Component/Avatar/Icon-Size` | 18 | `iconFontSize` |
| `Component/Avatar/Icon-Size-SM` | → `Typography/Size/Base` (14) | `iconFontSizeSM` |
| `Component/Avatar/Icon-Size-LG` | → `Typography/Size/Heading-3` (24) | `iconFontSizeLG` |
| `Component/Avatar/Font-Size` | → `Typography/Size/SM` (12) | `textFontSize`, `-SM`, `-LG` |

> **Sửa 2026-09-26** (anh/chị báo chữ trong Avatar to quá): đo lại Figma thì chữ Avatar luôn **12px** ở mọi
> cỡ, chỉ icon mới là 14 / 18 / 24. Bản đầu gộp cỡ chữ và cỡ icon làm một (theo antd). Đã đổi tên 3 biến
> `Font-Size*` → `Icon-Size*`, thêm `Font-Size` = 12, trỏ lại `Legacy/Avatar/Component/textFontSize*`,
> gắn 8 lớp chữ trong bộ Avatar Figma vào biến mới. Tổng đợt 1–2 thành 42 biến.
| `Component/Avatar/Background-Default` | → `Color/Fill/Neutral` | (mới) |
| `Component/Avatar/Content-Default` | → `Color/Content/Neutral` | (mới) |
| `Component/Avatar/Group-Margin-Inline` | → `Space/Margin/XS` (8; code dùng −8) | `groupOverlapping` = −8 |
| `Component/Avatar/Group-Border` | → `Color/Border/Container` | `groupBorderColor` |

### Tooltip — 3
| Biến mới | Giá trị | Thay biến cũ |
|---|---|---|
| `Component/Tooltip/Max-Width` | 250 | `maxWidth` |
| `Component/Tooltip/Background` | → `Color/Background/Spotlight` | (mới) |
| `Component/Tooltip/Content` | → `Color/Content/On-Solid` | (mới) |

### Divider — 2
| Biến mới | Giá trị | Thay biến cũ |
|---|---|---|
| `Component/Divider/Margin-Block` | → `Space/Margin/LG` (24) | (mới) |
| `Component/Divider/Margin-Inline-Vertical` | → `Space/Margin/XS` (8) | `verticalMarginInline` |

### Không cần token riêng — 0
- **Checkbox**: ô dùng `Size/Control/Interactive`, màu theo semantic. Nhóm cũ chỉ có 20 biến `Global`.
- **Typography**: dùng Text style và Heading style sẵn có. Nhóm cũ chỉ có 30 biến `Global`.
- **Space, Flex, Grid**: dùng thang `Space/Margin/*` và `Breakpoint/*`.

## Làm thế nào sau khi duyệt

1. **Figma — tạo biến**
   - 41 biến trong collection `5. Components` (mode `Value`), nhóm `Component/…`.
   - Scope đặt đúng loại (gap / width-height / fill / text…).
   - Code syntax: `var(--fc-component-…)`.
2. **Figma — chuyển binding**
   - Quét các trang component, đổi node đang gắn biến cũ `Components/<X>/…` sang biến mới hoặc token semantic tương ứng.
   - Báo số node đã đổi.
3. **Pipeline**
   - Export thêm nhóm `Component/`.
   - `build:tokens` sinh `--fc-component-*`, khai báo ở mọi phần tử có theme (`[data-brand]`, `[data-mode]`, `[data-density]`). Nhờ vậy alias tự tính lại khi một vùng đổi mode, như nền tối cố định của Button Ghost.
   - Chốt chặn cũ vẫn chạy: token không tồn tại thì build lỗi.
4. **Code**
   - CSS module đọc `--fc-component-*` thay số cứng; bỏ ghi chú "chưa có token" ở Switch và Tooltip.
   - Chỉ 2 thay đổi nhìn thấy được: icon Button theo cỡ nút, nền Tag mặc định theo Figma.
5. **Xóa nhóm cũ** `Components/<X>` của 12 component (375 biến), khi binding đã về 0.
6. **Kiểm**: build, contrast audit, đo token thật trong trình duyệt ở 20 tổ hợp theme, axe các story fc.

## Câu hỏi kèm theo

- **Tên nhóm cũ.** Trong bảng biến, `Components/` (cũ) và `Component/` (mới) nằm cạnh nhau, dễ nhầm. Đề xuất đổi tên nhóm cũ thành `Legacy/…` cho tới khi xóa. Đổi tên không làm gãy binding, vì Figma gắn biến theo ID.
- **Số thô không đổi theo Compact.** Ví dụ Switch 44×22, Badge 20, Tooltip 250: ở Compact vẫn giữ nguyên, giống code hiện tại. Nếu muốn co theo Compact thì phải thêm mode Default / Compact cho collection `5. Components`.

→ Anh/chị trả lời: **có** đổi tên `Legacy/`, **giữ không co**.

## Kết quả thực hiện (2026-09-26)

### Figma
- **Biến mới:** tạo 41 biến `Component/*` trong `5. Components` (mode `Value`).
  - Scope theo loại: gap / width-height / font-size / line-height / fill / stroke.
  - Code syntax: `var(--fc-component-…)`.
- **Đổi tên nhóm cũ:** `Components/…` → **`Legacy/…`**, 1.961 biến. Collection giờ chỉ còn 2 nhóm: `Legacy/` và `Component/`.
- **Nối biến cũ vào biến mới (khác kế hoạch).**
  - Kế hoạch là gắn lại từng node rồi xóa 375 biến cũ. Đo thực tế: khoảng 42.000 binding, mỗi lần ghi mất khoảng 0,34 giây, vì Figma tính lại mọi instance (Button có hàng nghìn instance). Tổng cộng khoảng 4 giờ, không hợp lý.
  - Thay vào đó, 49 biến cũ có biến mới tương ứng được đổi thành **alias trỏ vào biến mới**. Ví dụ `Legacy/Button/Component/paddingInline` → `Component/Button/Padding-Inline`.
  - Mọi node đang gắn biến cũ lấy giá trị từ biến mới ngay, không cần sửa node nào.
  - 326 biến cũ còn lại vốn đã chỉ trỏ lại token chung (pass-through), nên giữ nguyên.
- **Gắn lại trực tiếp** (thay đổi phụ thuộc ngữ cảnh, không alias được cả biến):
  - Switch: rãnh tắt của 12 biến thể (trừ disabled) → `Component/Switch/Track-Background`.
  - Avatar mặc định: chữ (8) và icon (8) → `Component/Avatar/Content-Default`. Nền đi theo alias → `Background-Default`.
  - Tag: 114 padding ngang → `Component/Tag/Padding-Inline`.
  - Tooltip, Divider và 98 node Button đã được gắn thẳng biến mới ở lượt chạy thử.
- **Số thô giữ nguyên** (bị bỏ khỏi danh sách vì tính được từ số khác):
  - Switch: núm 18 / 12, lề chữ 9 / 24 / 6 / 18.
  - Radio: chấm 8.
  - Input: padding dọc LG 7 / SM 0.
  - Button: `line` 1.2.
  - Avatar: chồng −8. Figma không nhân âm một biến, nên không trỏ được vào `Group-Margin-Inline` (+8).
- **Figma thay đổi nhìn thấy được**, đều để khớp code:
  - Padding: Button 15 → 16, Input 11 → 12, Radio kiểu nút 15 → 16. Figma vẽ viền bên trong khung, nên giá trị mới là khoảng cách từ mép ngoài tới nội dung, bằng đúng code.
  - Switch: rãnh tắt đậm hơn.
  - Avatar mặc định: nền nhạt, chữ và icon xám (trước là nền xám 25%, chữ trắng, chỉ đạt 1,8:1).
- **Còn lại:** xóa 375 biến `Legacy/` của 12 component. Cần gắn lại khoảng 42.000 binding, tốn khoảng 4 giờ chạy, nên để làm dần hoặc khi gỡ hẳn thư viện cũ. Hiện tại không gây hại: chúng chỉ còn là alias trỏ vào token mới.

### Pipeline và code
- **Export:** thêm lát `component` (`scripts/figma-export.js`), chỉ lấy `Component/*`, bỏ qua `Legacy/*`.
  - Merge thêm collection `components`. Checksum FNV-1a khớp Figma (`e30897db`).
- **Build:** `build:tokens` sinh 41 biến `--fc-component-*` trong khối `[data-brand], [data-mode], [data-density]`, nên alias tự tính lại ở vùng lồng đổi mode. Tổng 638 token.
- **Code fc:** Button, Input (addon), Radio (kiểu nút), Switch, Tag, Badge, Avatar, Tooltip và Divider đọc `--fc-component-*`.
  - Không còn số cứng 44 / 22 / 2 / 9 / 24 / 20 / 14 / 6 / 18 / 250 trong CSS.
  - Lề chữ Switch tính từ núm.
- **Đổi giao diện code** (theo Figma, đúng như đề xuất):
  - Icon trong Button theo cỡ nút: 14 / 16 / 18.
  - Nền Tag mặc định: `Background/Neutral` (`#F5F5F5` / `#272727`).
- **Kiểm:**
  - Đo trong trình duyệt: Light/Default và Dark/Compact/Green.
  - `audit:contrast` 210/210, tsc 0 lỗi, oxlint 0 lỗi.
  - axe + console các story fc ở 5 theme (kết quả ghi trong worklog mục 17).

---

## Đợt 3 — 62 biến (tạo 2026-09-26, làm theo kế hoạch đã duyệt)

Cách làm như đợt 1–2: chỉ giá trị riêng của component, alias vào token chung khi có bậc khớp, trỏ
`Legacy/<X>/Component/*` tương ứng sang (35 biến cũ). Số đo lấy từ Figma (xem `docs/fc-worklog.md` mục 19).

| Component | Biến | Ghi chú |
|---|---|---|
| Popover (2) | `Padding` → Padding/SM 12 · `Radius` → Radius/LG 8 | Figma bo 8 (CLAUDE.md ghi 4 — theo Figma) |
| Dropdown (5) | `Padding` → XXS 4 · `Radius` → LG · `Item-Height` → Control/Base 32 · `Item-Padding-Inline` → SM 12 · `Item-Radius` → Radius/SM 4 | |
| Select (10) | `Menu-Padding` · `Menu-Radius` · `Option-Height` · `Option-Padding-Inline` · `Option-Background-Hover` → Item-Hover · `Option-Background-Selected` → Item-Selected · `Tag-Background` → Fill/Neutral · `Tag-Height` 24 / `-SM` 16 / `-LG` 32 | Chọn nhiều: tick xám như Figma; chọn một: chỉ tô nền |
| Menu (11) | `Item-Height` 32 · `Item-Radius` 8 · `Item-Padding-Inline` → Padding/MD 20 · `Item-Margin-Inline` 4 · `Item-Background-Hover` · `Item-Background-Selected` · `Item-Content-Selected` → Content/Accent · `Icon-Size` 16 · `Collapsed-Width` 80 · `Sub-Background` → Fill/Alternate · `Group-Content` → Content/Description | Menu Dark = vùng `data-mode="dark"` (màu #001529 của Figma nằm ngoài palette) |
| Tabs (7) | `Gutter` → Margin/XL 32 · `Ink-Bar-Size` → Stroke/Strong 2 · `Card-Height` 40 / `-SM` 32 / `-LG` 48 · `Card-Background` → Fill/Alternate · `Card-Gap` 2 | |
| Breadcrumb (4) | `Separator-Margin` 8 · `Content` → Content/Description · `Content-Current` → Neutral-Strong · `Icon-Size` 14 | |
| Pagination (4) | `Item-Size` 32 / `-SM` 24 / `-LG` 40 · `Item-Radius` → Radius/Base | |
| Modal (6) | `Width` 520 · `Padding-Block` → MD 20 · `Padding-Inline` → LG 24 · `Radius` · `Title-Font-Size` → Size/LG · `Mask` → Background/Overlay | Padding 20 × 24 thống nhất (Figma header 16 / footer 24 lệch nhau) |
| Drawer (5) | `Width` 400 · `Padding` 24 · `Header-Padding-Block` 16 · `Footer-Padding-Block` 8 · `Footer-Padding-Inline` 16 | |
| Message (3) | `Min-Height` → Control/LG 40 · `Padding-Inline` 12 · `Radius` 8 | |
| Notification (5) | `Width` 384 · `Padding-Block` 20 · `Padding-Inline` 24 · `Radius` 8 · `Icon-Size` 24 | |

Popconfirm và Image không cần biến riêng (dùng token của Popover / semantic).

---

## Đợt 4 — tạo 2026-09-26 (theo kế hoạch đã duyệt)

Cách làm như đợt 3. Mỗi agent đọc Figma rồi đề xuất biến; tôi tạo trong `5. Components`, gắn Code syntax
`var(--fc-component-…)`, trỏ `Legacy/<X>/Component/*` tương ứng sang. Giá trị cũ của các biến Legacy được sao lưu ở
`docs/migration/figma-backup-wave4-legacy.json`. Lần xuất lát `component` khớp checksum Figma (FNV-1a).

**Lượt 1 — 64 biến, 43 biến Legacy trỏ sang (tổng `Component/*`: 168):**

| Component | Biến | Ghi chú |
|---|---|---|
| Skeleton (7) | `Background` → Fill/Area · `Background-Shimmer` → Fill/Neutral-Strong · `Block-Radius` → Radius/SM · `Title-Height` 16 · `Paragraph-Height` 16 · `Paragraph-Margin-Top` 28 · `Image-Size` 96 | |
| Spin (4) | `Dot-Size-SM` → Size/Base · `Dot-Size` → Size/XL · `Dot-Size-LG` → Control/Base · `Content-Height` 400 | Chấm co theo Compact |
| Card (7) | `Header-Padding-Inline` 16 / `-SM` 12 · `Body-Padding` 16 / `-SM` 12 · `Header-Background` → Transparent · `Title-Font-Size` → Size/Base · `Actions-Background` → Container | Figma padding 16 (CLAUDE.md ghi 24 — theo Figma). Sửa luôn lỗi Figma: `headerFontSize` / `-SM` bị đảo (12 ↔ 14) |
| Descriptions (5) | `Label-Background` → Fill/Alternate · `Label-Content` → Content/Label · `Title-Margin-Bottom` → Margin/MD · `Item-Padding-Bottom` / `-End` → Padding/Base | Nhãn Figma cũ (Neutral-Light) chỉ 3.1:1 → Content/Label |
| Statistic (2) | `Content-Font-Size` → Heading-3 · `Title-Font-Size` → Size/Base | |
| Alert (7) | `Padding-Block` 8 · `Padding-Inline` 12 · `Padding-Block-Description` 20 · `Padding-Inline-Description` 24 · `Icon-Size` 16 · `Icon-Size-Description` 24 · `Radius` 8 | |
| Result (5) | `Icon-Size` 40 · `Title-Font-Size` → Heading-5 · `Subtitle-Font-Size` → Size/Base · `Content-Padding-Inline` 40 · `Content-Background` → Fill/Alternate | Icon Figma 42 → 40 (lưới 4px) |
| Empty (2) | `Image-Width` 184 · `Image-Width-SM` 120 | |
| Progress (10) | `Track` → Fill/Neutral · `Fill` → Content/Info · `Circle-Text` → Neutral-Strong · `Line-Size` 8 / `-SM` 6 · `Circle-Size` 120 / `-SM` 80 · `Step-Width` 32 / `-SM` 2 · `Steps-Gap` 2 | Thanh chạy đổi từ Solid/Info (2.5:1 trên nền Dark) sang Content/Info (≥ 3.65:1) — Figma đổi theo |
| Steps (10) | `Icon-Size` 32 / `-SM` 24 · `Custom-Icon-Size` 24 · `Icon-Font-Size` 14 · `Title-Line-Height` 32 · `Dot-Size` 8 · `Dot-Size-Current` 10 · `Description-Max-Width` 140 · `Nav-Arrow` → Content/Disabled · `Panel-Arrow-Width` 56 | |
| Timeline (5) | `Tail` → Border/Neutral-Faded · `Tail-Width` → Stroke/Strong · `Dot-Background` → Container · `Item-Padding-Bottom` → Padding/MD · `Dot-Size` 10 | |

Giá trị lệch lưới 4px giữ theo Figma (phần tử mảnh, không phải khoảng cách): Progress 6 / 2, Steps và Timeline chấm 10.
Figma đổi hiển thị ở 4 chỗ khi trỏ Legacy sang: nhãn Descriptions đậm hơn, thanh Progress đậm hơn, tiêu đề
"Card / Basic with Inner inside" 12 → 14, icon Result 42 → 40.

# Nhật ký công việc — design system `fc` (FABi CMS)

> Ghi ngày 2026-09-26 (đêm), sau đợt làm tự động khi anh/chị đi ngủ.
> Tài liệu tạm, đi cùng `docs/fc-roadmap.md`. Xóa ở giai đoạn 5.
> Chưa có commit git nào — mọi thay đổi đang nằm trong thư mục làm việc.

## Đọc nhanh

**Đêm nay đã làm (theo kế hoạch):**
1. Trang **Token Naming** (Figma): gắn lại toàn bộ sang biến/style của mình, không còn biến Zen.
2. **Sửa độ tương phản** (tier 1): 44 cặp màu dưới chuẩn → 0. Kiểm 170/170 cặp đạt.
3. **Rà soát đồng bộ** Figma ↔ code ↔ Storybook: khớp hoàn toàn (số liệu ở mục 12).
4. **Đợt 2** — 8 component mới trong code (Input, Checkbox, Radio, Switch, Tag, Badge, Avatar, Tooltip).
5. Nhật ký này.

**Cần anh/chị quyết** (chi tiết mục 13):
- Duyệt các giá trị contrast mới (đặc biệt yellow brand và màu chữ cảnh báo).
- Có thêm token viền cho control (`Color/Border/Control`) để viền input/checkbox đạt 3:1 không.
- Duyệt cuối đợt 2 → xóa story antd cũ của 8 component, thiết kế token `Component/*` trong Figma.

---

## 1. Tìm hiểu và định hướng

- Đọc repo `fabi-design-system`, mở Storybook, đọc artifact nghiên cứu Wheel, trang
  Wheel/HRV Design System, bản ghi bài nói về design token, bài Medium "Design tokens: what, why
  and how", ảnh lưới đặt tên.
- Kết nối file Figma của FABi CMS, đọc kỹ 5 collection biến.
- So sánh cách đặt tên của Wheel với bộ token cũ → anh/chị chọn đổi sang kiểu Wheel, namespace
  riêng **`fc`** (FABi CMS), đổi toàn bộ.
- Yêu cầu: **không còn dấu vết Ant Design** → chọn **mức C**: bỏ hẳn `antd` khỏi code, viết lại
  ~50 component trên React Aria + CSS Modules + biến `--fc-*`. Lộ trình 5 giai đoạn trong
  `docs/fc-roadmap.md`.

## 2. Giai đoạn 0 — Đặc tả tên

`docs/token-naming-spec.md`: `/` cho nhóm, `-` trong leaf; thứ tự ô cố định; property
`background · content · border · fill · solid · outline`; role, scale mức nhấn, state (trạng thái
nghỉ bỏ trống, ghép tối đa hai state). Namespace `fc` chỉ ở CSS và Code syntax.

## 3. Giai đoạn 1 — Đổi tên trong Figma

- 331 biến đổi tên, 11 biến xóa (10 Pink gộp vào Magenta + biến mồ côi `Color`); 46 liên kết Pink
  trên trang Button chuyển sang Magenta trước khi xóa. Code syntax `var(--fc-…)` cho mọi biến.
- Bản sao lưu: `docs/migration/figma-backup-before-fc.json`.
- **1b — trang tài liệu Figma**: 🎨 Colors (466 chỗ), 📏 Size, Space & Radius (138), 💡 Effects (10),
  🔠 Typography (8). Cột Group tính từ dữ liệu thật, mô tả tiếng Việt. Effect style → `Shadow/*`,
  text style Normal/Strong → Regular/Semibold. Bảng Item & Outline rộng 1440, section Brand
  Colors rộng 1680 (giữ lề 120px theo yêu cầu).
- Anh/chị tự bỏ tiền tố `fc ·` ở tên collection cho dễ nhìn.

## 4. Giai đoạn 2 — Pipeline token

`scripts/figma-export.js` (chạy qua Figma MCP) → `tokens/figma-export.json` →
`npm run build:tokens` → `tokens/fc.tokens.json` (DTCG) + `src/fc/tokens.css` + `src/fc/tokens.meta.ts`.
Kiểm chứng: 6.620/6.620 giá trị trong trình duyệt; đối chiếu code cũ 1.192/1.192. Sửa 4 lỗi có sẵn
trong Figma (success/warning/danger-faded Light, info-light-hover Dark).

## 5. Giai đoạn 3 — Nền móng code

Chọn **React Aria Components 1.21.1** (duy nhất phủ đủ Table, DatePicker, Tree, Upload).
`src/fc/`: `FcTheme`, `tokens.css`, `base.css` (chỉ trong `.fc-root`), `axes.ts`, `index.ts`.
Storybook bọc story `fc/…` bằng `FcTheme`, thanh Brand/Mode/Density dùng chung. Lint cấm
`antd`, `@ant-design/*`, `src/theme` trong `src/fc/`. Button mẫu.

## 6. Đợt 1 — Bố cục

Flex, Space, Row/Col, Divider, Title/Text/Paragraph/Link: 24 story, 880/880 kiểm tra token ở 20 tổ
hợp theme, axe sạch (trừ contrast do token). `build:tokens` chặn media query lệch token breakpoint.
Trang Storybook **Design Tokens** (Color, Border, Layout, Font) viết lại, giá trị đo trực tiếp.
Duyệt cuối đợt: sửa contrast trước đợt 2, xóa story cũ, giữ nhóm token component Figma cũ.

## 7. Tách tầng Global kiểu Zen

- Collection mới **`0. Global`** (một mode, ẩn khỏi thư viện): 242 giá trị gốc `Global/{Light|Dark}/{Hue}/{Step}`.
- `1. Brand`: `Brand/{Light|Dark}/Primary-1…10`; bỏ `brand/primary-N`.
- `2. Colors`: 61 alias semantic trỏ thẳng Global; 122 biến bảng màu cũ đổi thành
  `Color/Palette/{Hue}/{Step}` (giữ ID nên ~3.000 liên kết không phải gắn lại) + `Color/Palette/Accent/1…10`.
- Giải thích (đã thống nhất): `Light`/`Dark` trong tên Global chỉ là thư mục; collection một mode
  không đổi theo theme, nên màu thô (Tag, Avatar, chart) cần `Color/Palette` hai mode đứng giữa.
- Kiểm chứng: 0 giá trị semantic/palette đổi; 11.860/11.860 trong trình duyệt.

## 8. Viết hoa chữ đầu (giống Zen)

593 biến 0–4 → `Color/Background/Accent-Faded-Hover`, thang cỡ viết hoa (`SM`, `LG`); 3 effect
style `Shadow/*`. Code vẫn viết thường — `tokens-lib.mjs` hạ chữ thường khi đọc; build ra giống hệt
từng byte. 364 chip trên các trang docs đổi theo. Script gộp mới `scripts/merge-figma-export.mjs`.

## 9. Trang Token Naming (Figma)

14 ô (Namespace, Mode, Tier, Component, Category, Hue, Property, Layer, Element, Variant, Role,
Position, Scale & Level, State) điền bằng từ vựng thật của `fc`; phần Example 12 tên thật tô màu
theo nhóm + biến CSS. Footer mẫu đè nội dung → đã dời.

## 10. Đêm nay

### 10a. Trang Token Naming — gắn lại sang hệ thống của mình
229 lớp màu và 208 chữ đang dùng **biến/style của thư viện Zen** → đổi sang biến/style local:
chữ `Color/Content/Neutral-Strong`, 4 màu nhóm `Color/Palette/{Cyan,Purple,Magenta,Green}/8`, nền khối
`Color/Palette/{…}/1` và `Color/Fill/Area`, style `Text Base/Regular` + `Heading/4`. Khối Namespace
trước gắn thẳng `Brand/Light/Primary-1` (trái quy tắc) → `Color/Palette/Blue/1`. Còn 0 tham chiếu Zen.

### 10b. Sửa độ tương phản
Bảng trước/sau trong `docs/fc-roadmap.md` (mục "Sửa độ tương phản"). Tóm tắt:
- 3 biến Brand mới: `Content-Accent` (Light/Dark), `Solid-Accent` (Light) — bậc đầu tiên đạt chuẩn
  cho từng brand. Nút primary chỉ đổi ở **yellow** (bậc 8 → 9); 4 brand kia giữ nguyên.
- Chữ accent, link, mô tả, thành công, cảnh báo, lỗi; nút danger ở Dark.
- Vòng focus trong code dùng `Color/Solid/Accent` nét 2px (trước dùng màu bậc 3, gần như vô hình).
- Theme antd cũ sinh lại từ Figma để các màn hình cũ cũng đạt chuẩn.
- Sao lưu + cách hoàn tác: `docs/migration/figma-backup-before-contrast.json`.

### 10c. Rà soát đồng bộ (xem mục 12)
Phát hiện và sửa trong lúc rà:
- Trang Colors: 9 giá trị + 1 Group lệch sau contrast; **thiếu dòng `Color/Palette/Indigo/8`**;
  ô màu trong bảng là hex cứng (không tự cập nhật) → gắn biến thật cho 375 ô.
- Story dùng token không tồn tại (`--fc-space-padding-xxl`) → sửa, và thêm chốt chặn vào build.
- Lỗi lint có sẵn trong `Card.stories.tsx` (gọi hook trong render vô danh) → sửa.

### 10d. Đợt 2 — Control cơ bản (code)
| Component | Có gì |
|---|---|
| `TextField`, `TextArea` | nhãn, dấu bắt buộc, mô tả, báo lỗi (kể cả `validate`), 3 cỡ, outlined/filled, prefix/suffix, warning, ẩn/hiện mật khẩu |
| `Checkbox`, `CheckboxGroup` | chọn, một phần, invalid, disabled, nhóm ngang/dọc |
| `Radio`, `RadioGroup` | kiểu Figma (đĩa accent + chấm trắng), mô tả, lỗi, disabled |
| `Switch` | 2 cỡ theo Figma, có/không nhãn |
| `Tag` | default, 4 trạng thái, 12 dải preset, không viền, nút đóng |
| `Badge`, `StatusBadge` | số (ngưỡng `99+`), chấm, đứng riêng, 2 cỡ, chấm trạng thái + chữ |
| `Avatar`, `AvatarGroup` | ảnh (lỗi → chữ), chữ, icon, 3 cỡ, tròn/vuông, màu dải, nhóm `+N` |
| `Tooltip` | 4 hướng, tự lật, có mũi tên, render trong portal có theme |

Nền móng thêm: `FcTheme` tạo portal có theme trên `document.body` (lớp nổi đợt 3 dùng chung);
phụ thuộc `react-aria` (cùng họ React Aria). Lỗi tìm thấy khi tự kiểm và đã sửa:
- TextField đè mất kết quả `validate` (luôn truyền `isInvalid={false}`).
- Tooltip mở sẵn (`defaultOpen`) không hiện vì lúc render đầu portal chưa tồn tại.
- Chữ đơn vị trong affix Input thiếu tương phản.
Đã thử bàn phím: Tab vào nút hiện tooltip và vòng focus accent 2px; checkbox/radio/switch do
React Aria xử lý phím (Space, mũi tên).

## 11. Chốt chặn tự động hiện có

| Lệnh | Chặn gì |
|---|---|
| `npm run build:tokens` | alias gãy; media query lệch breakpoint; **code dùng token không tồn tại** (mới) |
| `npm run audit:contrast` | **strict** (mới): 21 cặp × 5 brand × 2 mode phải đạt (17 cặp lúc đầu, thêm 4 cặp viền control ở mục 16) |
| `node --experimental-strip-types docs/migration/verify-tokens.mjs` | theme antd cũ phải khớp Figma |
| `npx oxlint`, `npx tsc --noEmit -p tsconfig.app.json` | lint, kiểu (`-p .` không kiểm gì: `tsconfig.json` gốc chỉ là file "solution" trỏ sang các project con) |

## 12. Kết quả rà soát đồng bộ

| Kiểm tra | Kết quả |
|---|---|
| Export Figma ↔ file code (checksum FNV-1a 4 phần) | khớp tuyệt đối |
| Mọi token × 20 tổ hợp theme, đo trong trình duyệt | 11.920 / 11.920 |
| Theme antd cũ ↔ Figma | 1.192 / 1.192 |
| Cặp tương phản | 170 / 170 đạt |
| Token bị code tham chiếu nhưng không tồn tại | 0 |
| Trang Figma 🎨 Colors — Value/Group so với biến | khớp sau khi sửa (mục 10c) |
| Trang Figma 📏 Size, Space & Radius | 44 dòng khớp |
| Trang Figma 🔠 Typography | khớp (cỡ chữ, line-height, style gắn biến) |
| Component đợt 2 — style thật so với token, 20 tổ hợp | 300 / 300 (Checkbox, Radio, Switch, Tag, Badge, Tooltip 200; Input 100) |
| Story `fc/` + Design Tokens: 94 story × 4 theme = 376 lượt | 0 lỗi render, 0 lỗi console; axe: xem ghi chú dưới |
| tsc / oxlint | 0 lỗi; 7 cảnh báo, đều ở file cũ (không có trong `src/fc`). *Đính chính:* lần đo này dùng `tsc -p .` nên thực ra chưa kiểm kiểu; đo lại bằng `-p tsconfig.app.json` ở đợt đối chiếu variant (mục 15): 0 lỗi |

Ghi chú axe (sau khi bỏ luật `region` — luật cấp trang, không áp dụng cho component):
- `Input / WithAffixes`: chữ đơn vị "VNĐ" dùng màu icon (3.36:1) → **đã sửa** (chữ trong affix dùng
  `Color/Content/Description`, icon giữ màu icon). Chạy lại: sạch ở 4 theme.
- `Typography / Tones`: chữ tone `disabled` 1.8–2.2:1 — WCAG 1.4.3 miễn trừ nội dung vô hiệu.
- `Design Tokens / Icons` (trang antd cũ, Dark): chữ mã phụ 4.36:1 — sửa khi viết lại trang Icons.
- Tooltip không đóng bằng Escape **khi chạy trong khung trình duyệt ẩn**: do trình duyệt đóng băng
  animation xuất hiện ở tab nền (đã kiểm chứng: tắt animation thì đóng đúng). Không phải lỗi sản phẩm.

## 13. Cần anh/chị quyết

1. ~~Giá trị contrast mới~~ — **đã duyệt** 2026-09-26.
2. ~~Viền control 3:1~~ — **đã làm** 2026-09-26: thêm `Color/Border/Control` (mục 16).
3. ~~Duyệt cuối đợt 2~~ — **đã duyệt**; 9 story antd cũ đã xóa (`git rm`). ~~Token `Component/*`~~ —
   **đã duyệt và làm** 2026-09-26 (mục 17).
4. Chưa commit git — anh/chị muốn tôi commit theo từng phần không.
5. ~~Placeholder 1.8:1~~ — **đã quyết: giữ quy ước** "Placeholder màu disabled" (placeholder chỉ là gợi ý,
   luôn có nhãn thật đi kèm). axe sẽ còn báo các ô này; đó là chủ ý, không phải lỗi.
6. ~~Xóa story List~~ — **đã xóa** (`git rm`); bỏ List khỏi đợt 4 trong roadmap.

## 14. Việc tiếp theo theo kế hoạch

- Đưa shadow (effect style) vào pipeline token — cần cho đợt 3.
- **Đợt 3**: Select, Dropdown, Menu, Tabs, Breadcrumb, Pagination, Modal, Drawer, Popover,
  Popconfirm, Message; rồi viết lại `AppShell`, `AppHeader`, `RestaurantListPage`.
- Kiểm chứng ghi đè nhãn tiếng Việt của React Aria (không có sẵn vi-VN) ở Select.
- Giai đoạn 5: gỡ `antd`, viết lại `CLAUDE.md` (đã duyệt), xóa tài liệu tạm.

## 15. Đối chiếu variant Figma ↔ Storybook

Chi tiết từng component: `docs/fc-variant-coverage.md`. Bảng kiểm kê Figma: `docs/migration/figma-variant-inventory.md`.

- **Storybook:** 260 → **500 story**; còn **499** sau khi xóa story List (Deprecated).
- **14 component fc:** bổ sung tính năng thật cho đủ variant Figma, không chỉ thêm story.
  - Button: variant / color / ghost / shape / ButtonGroup.
  - Input: variant, `showCount`, addon, và 2 component mới `SearchField` và `OtpField`.
  - Badge: component mới `Ribbon`. Tag: component mới `CheckableTag` và `TagAddButton`.
  - Switch: loading và chữ trong rãnh. Tooltip: màu, bật / tắt mũi tên.
  - Typography: `size`, `keyboard`, `editable`. Còn lại Radio, Divider, Space, Avatar.
  - Module dùng chung `src/fc/palette.ts`: mỗi dải màu một "bậc đậm" đạt 4.5:1 ở cả hai mode.
- **44 component antd cũ:** 5 agent thêm story theo bảng kiểm kê; tạo mới file Tour, Affix, Message, Notification.
- **Rà soát:** 500 story + 106 story fc × 4 theme. Tìm thấy và sửa:
  - 2 lỗi tương phản fc: Button Ghost, Switch có chữ ở Dark.
  - 1 cảnh báo Storybook (control màu).
  - Khoảng 60 chỗ thiếu tên truy cập ở story cũ.
- **Phần không sửa ở mức story** (token theme cũ, lỗi nội bộ antd, miễn trừ): ghi ở mục D của file chi tiết.

## 16. Duyệt contrast, thêm `Color/Border/Control`

- **Contrast tier 1:** anh/chị duyệt giá trị (không đổi gì thêm).
- **`Color/Border/Control`** (`2. Colors`): Light `#8C8C8C`, Dark `#737373`, scope Stroke,
  code `--fc-color-border-control`.
  - Chọn bậc xám nhạt nhất vẫn đạt 3:1 trên container / layout / elevated / alternate / neutral của
    từng mode.
- **Figma**
  - 465 stroke của component chính chuyển sang biến mới. Chia theo trang: Input 126, InputNumber 108,
    Radio 85, Select 39, Button 38, DatePicker 36, TimePicker 27, ColorPicker 4, Checkbox 2.
  - Instance (Mentions, AutoComplete, Cascader, TreeSelect, Form…) tự theo component chính.
  - Giữ nguyên: biến thể disabled, biến viền disabled của Button, vạch chia InputNumber, ô màu ColorPicker.
  - Sao lưu: `docs/migration/figma-backup-border-control.json`.
  - Trang 🎨 Colors thêm dòng `Color/Border/Control`; mô tả `Border/Neutral` đổi thành
    "card, bảng, control bị vô hiệu".
- **Pipeline:** export lát `semantic` khớp checksum FNV-1a với Figma (`d508a245`, 104 biến); 597 token.
- **Code fc:** Input (ô, addon, OTP), Checkbox, Radio (tròn và kiểu nút), Button default/dashed,
  TagAddButton.
  - Đo trong trình duyệt: `#8c8c8c` Light, `#737373` Dark; disabled vẫn `#d9d9d9` / `#424242`.
- **Kiểm:** `audit:contrast` 210/210 (thêm 4 cặp viền control), `build:tokens` đạt, tsc 0 lỗi.
- **Giới hạn:** theme antd cũ (`src/theme`) chưa đổi viền. Story cũ vẫn viền nhạt tới khi gỡ antd.

## 17. Token `Component/*` (đợt 1–2)

Anh/chị duyệt: danh sách 41 biến, đổi tên nhóm cũ thành `Legacy/`, số thô không co theo Compact.
Chi tiết từng biến và lý do: `docs/fc-component-tokens-proposal.md`.

- **Figma**
  - Tạo 41 biến `Component/*`. Nhóm cũ đổi tên `Components/` → `Legacy/` (1.961 biến).
  - 49 biến cũ thành alias trỏ vào biến mới, nên mọi binding cũ tự lấy giá trị mới.
  - Gắn lại trực tiếp: rãnh Switch 12, chữ và icon Avatar 8 + 8, padding Tag 114; thêm Tooltip, Divider và 98 node Button ở lượt chạy thử.
- **Vì sao chưa xóa 375 biến `Legacy/`:** khoảng 42.000 binding; mỗi lần ghi khoảng 0,34 giây vì Figma tính lại mọi instance, tổng khoảng 4 giờ. Alias cho kết quả hiển thị giống hệt, xóa dần sau.
- **Figma thay đổi để khớp code**
  - Padding: Button 15 → 16, Input 11 → 12, Radio kiểu nút 15 → 16 (Figma vẽ viền bên trong khung).
  - Switch: rãnh tắt đậm hơn.
  - Avatar mặc định: nền nhạt, chữ và icon xám.
- **Pipeline**
  - Lát export `component` mới; collection `components`; checksum khớp Figma (`e30897db`).
  - 41 biến `--fc-component-*` sinh trong khối `[data-brand], [data-mode], [data-density]`. Tổng 638 token.
- **Code:** Button, Input, Radio, Switch, Tag, Badge, Avatar, Tooltip, Divider đọc `--fc-component-*`.
  - Đổi nhìn thấy được: icon Button 14 / 16 / 18 theo cỡ; nền Tag mặc định `#F5F5F5` / `#272727`.
- **Kiểm**
  - Đo trong trình duyệt ở Light/Default và Dark/Compact/Green.
  - `audit:contrast` 210/210, tsc 0 lỗi, oxlint 0 lỗi.
  - 106 story fc × 5 theme = 530 lượt: 0 lỗi render, 0 lỗi console. axe chỉ còn tone `disabled` của Typography (miễn trừ WCAG).
  - 2 lượt Badge / Yellow quá hạn tải; chạy lại riêng: đạt, khoảng 1 giây.
- **Figma, chưa sửa (ngoài phạm vi):** Tag Status kiểu solid "Default" và "Processing" có icon gần như chìm vào nền. Code fc đã xử lý màu chữ và icon cho tag solid.

## 18. Storybook: fc thành "Components", xóa story antd cũ

Anh/chị yêu cầu (2026-09-26): "đổi tên fc thành COMPONENTS cho đồng bộ, sau đó xóa bộ cũ".

- **Đổi tiêu đề:** 14 story fc `fc/Components/*` → `Components/*`.
  - Đường dẫn story đổi theo: `fc-components-button--…` → `components-button--…`.
- **Xóa 51 file story antd cũ** trong `src/components/*.stories.tsx`: 47 file có trong git (`git rm`), 4 file mới chưa commit (Tour, Affix, Message, Notification).
  - **Sao lưu trước khi xóa:** `docs/migration/legacy-antd-stories-2026-09-26.zip` (51 file, gồm cả phần mở rộng variant làm hôm nay, chưa commit).
  - Còn lại trong `src/components/`: 3 template (AppHeader, AppShell, RestaurantListPage) và story của chúng.
- **`.storybook/preview.tsx`**
  - FcTheme bọc các tiêu đề `Components/` (trước là `fc/`) và trang có `parameters.fcTheme`. Chỉ `Templates/` còn dùng theme antd cũ.
  - Thêm `storySort` cố định thứ tự: Introduction, Design Tokens, Components, Templates.
- **`src/Welcome.mdx`, `AGENTS.md`:** cập nhật mô tả.
- **Sidebar sau khi đổi:** Introduction (1), Design Tokens (28), **Components (14 component fc, 120 mục)**, Templates (11). Tổng 137 story.
- **Hệ quả:** 51 component antd chưa làm lại (Select, Table, Modal…) không còn story, cho tới khi dựng lại ở đợt 3–5. Cần xem lại thì mở file zip.
- **Kiểm:** tsc 0 lỗi, oxlint 0 lỗi, `build:tokens` đạt. Toàn bộ 137 story:
  - 0 lỗi render, 0 lỗi / cảnh báo console.
  - 128 story dùng FcTheme (mọi story `Components/` và Design Tokens); 9 story Templates dùng theme antd.
  - axe: chỉ còn tone `disabled` của Typography (miễn trừ).

## 19. Đợt 3 — lớp nổi, điều hướng, thông báo (+ Image)

Kế hoạch: `docs/fc-plan-waves-3-5.md` (anh/chị duyệt: "có kế hoạch rồi thì làm thôi").

### Nền móng
- **Shadow:** gộp `Shadow/Strong` vào `Shadow/Base` (hai giá trị vốn giống hệt).
  - Figma: 531 node + 7 bản sao ẩn chuyển sang `Shadow/Base`; xóa style `Strong` và dòng của nó trên trang 💡 Effects.
  - Pipeline: lát export thứ 6 `effects` → `--fc-shadow-base`, `--fc-shadow-light` (DTCG kiểu `shadow`).
- **Tiếng Việt cho React Aria:** `src/fc/i18n/vi-VN.ts`.
  - React Aria có 34 ngôn ngữ, không có tiếng Việt. Bộ này dịch khoảng 150 chuỗi của 22 gói, lấy en-US làm nền nên gói mới vẫn chạy.
  - Nạp qua từ điển toàn cục mà React Aria đọc (`Symbol.for('react-aria.i18n.strings')`).
  - FcTheme cài tự động, thêm prop `locale` (mặc định `vi-VN`) + `I18nProvider` + `lang`.
  - Đã kiểm trong trình duyệt: "Clear search" → "Xóa tìm kiếm".
- **Module dùng chung:**
  - `src/fc/overlay.module.css`: bề mặt nổi Elevated + Shadow/Base, animation theo hướng, mũi tên 16 × 8.
  - `src/fc/listItem.module.css`: dòng lựa chọn (hover / selected / disabled / danger / icon / mô tả / phụ / tick / tiêu đề nhóm / đường chia).
- **Quy ước cho mọi đợt sau:** `docs/fc-component-conventions.md`.
- **Icon:** thêm 43 icon vào `src/icons.tsx` (chevron trái / lên, zoom, xoay, lật, copy, printer…).

### Token (62 biến `Component/*`)
- Chi tiết: `docs/fc-component-tokens-proposal.md` mục "Đợt 3".
- Trỏ 35 biến `Legacy/` sang. Export lát `component` khớp checksum Figma.

### Component
| Component | Người làm | Điểm chính |
|---|---|---|
| Popover | tôi | click / hover (hover không modal, không giữ focus), 12 hướng, mũi tên, `PopoverPanel` dùng chung |
| Popconfirm | tôi | `alertdialog`, `onConfirm` trả Promise thì nút OK quay chờ |
| Dropdown | tôi | item icon / mô tả / phụ / disabled / danger / đã chọn; nhóm; đường chia; menu con; mũi tên; footer (menu đặt trong dialog để Tab tới được); `DropdownButton` tách đôi. Mở bằng bấm, không bằng hover |
| Select | tôi | một / nhiều (tag có ×, `maxCount`, `maxTagCount`) / tìm kiếm (ComboBox); 4 kiểu viền × status × 3 cỡ; prefix; nút xóa; nhóm; menu rỗng; mở trên / dưới |
| Image *(thêm theo yêu cầu)* | tôi | lớp phủ "Xem trước", ảnh lỗi, 11 tỷ lệ cố định × dọc / ngang, trình xem (tải về, lật, xoay, zoom, ← →, "1 / 3"), `ImageGroup`. Trình xem ghim Dark mode |
| Menu | agent | inline / vertical / thu gọn (tooltip), Dark = vùng `data-mode="dark"`, menu con Disclosure / popover, nhóm, danger, `aria-current` |
| Tabs | agent | 4 phía, 3 cỡ, card, editable-card (Delete đóng tab, nút + ngoài `tablist`), icon, badge, ink bar trượt (`SelectionIndicator`) |
| Breadcrumb | agent (+ tôi ghép Dropdown) | cơ bản, icon, item có Dropdown, dấu phân cách tùy chỉnh |
| Pagination | agent (+ tôi ghép Select) | Basic, More, Jumper, Mini, Simple, Prev/Next, tổng số, đổi số dòng / trang |
| Modal | agent | cơ bản, footer tùy chỉnh, Information × 4, Confirm (danger), `useModal()` trả Promise |
| Drawer | agent | 4 phía, nút phụ, footer, large, không nút đóng |
| Message, Notification | agent | `message.*`, `notification.*`, `<Toaster />`, dùng chung một hàng đợi toast; warning / error đọc ngay (`role=alert`) |

### Sửa trong lúc làm
- **Avatar:** anh/chị báo chữ to quá → chữ luôn 12px như Figma, icon 14 / 18 / 24.
  - Token: `Font-Size*` → `Icon-Size*`, thêm `Font-Size` = 12.
- **Token contrast:** `Color/Content/Description` Dark chỉ 4.47:1 trên nền Elevated → đổi sang `Content/Neutral` (như Light).
  - `audit:contrast` thêm 3 cặp (mô tả / chữ phụ trên elevated, alternate): 240/240. Trang 🎨 Colors cập nhật.
- **Chỉnh story:** Select có chiều cao tối thiểu. React Aria giới hạn menu theo chiều cao `<body>`, nên story thấp cắt mất menu; ứng dụng thật không bị.
- **Nút đang mở menu / popover:** React Aria giữ nút ở trạng thái "đang nhấn" suốt lúc menu mở.
  - Màu `*-Active` (tối hơn) chỉ đạt 2.6–4.0:1 trên nền Dark, nên nút mở menu bị đọc khó.
  - Sửa ở Button: khi `aria-expanded="true"` dùng màu gốc (`Content/Accent` + viền `Solid/Accent`, danger tương tự), đạt 4.5:1 mọi brand / mode — giống Select đang mở. Nhấn tức thời vẫn dùng `*-Active` như Figma.
  - Không đổi token: `*-Hover` / `*-Active` vốn là trạng thái thoáng qua (như Ant Design gốc).
- **Vùng cuộn Modal / Drawer:** gắn `tabindex="0"` ngay trước lần vẽ đầu (layout effect) thay vì chờ state, để vùng cuộn luôn Tab tới được.
- **ImageGroup treo trình duyệt:** giá trị context đổi mỗi lần render → ảnh đăng ký lại vô hạn. Giữ context ổn định, tính vị trí ảnh từ id.
- **Menu thu gọn:** popover con thiếu `role` / `id` cho `aria-controls` → bọc trong `Dialog` của React Aria.
- **Select nhiều giá trị khi disabled:** tag vẫn dùng màu thường (thiếu tương phản) → tag cũng disabled.
- **Trang Icons (cũ, antd):** bài kiểm chờ lưới lọc xong (`waitFor`), hết chập chờn khi QA chạy dồn.

### Template (sau đợt 3)
- **AppHeader** viết lại bằng fc, theo Figma "*Navbar" (trang ❖ Header):
  - LG: logo iPOS.vn · ô tìm kiếm 360 (mở Search Modal, phím ⌘K / Ctrl+K) · AI · ngôn ngữ (Việt Nam / English / China, cờ lấy từ Figma) · hòm thư (Popover: 2 tab có số đếm, tin theo ngày, "Quản lý hòm thư") · tài khoản (Dropdown: đổi cửa hàng, cài đặt, đăng xuất).
  - "Type = Title": mũi tên quay lại + tiêu đề trang thay cho logo.
  - SM (< 768px): nút menu, ô tìm kiếm co giãn, icon, avatar.
  - Nền: gradient `Header-Start → Header-End` từ trên xuống (Figma vẽ dọc; bản antd cũ vẽ ngang).
  - Các nút trên thanh nằm trong vùng `data-mode="dark"` (hover / nhấn đúng cho nền tối); chữ, icon và vòng focus màu On-Solid (vòng focus accent sẽ chìm trên nền accent).
- **AppShell** viết lại bằng fc, theo Figma "App Shells Items / Menu":
  - 14 mục tiếng Việt với đúng icon Figma; khối dưới "Thu gọn" (256 → 80, tooltip khi thu) và "Mở rộng" (danh sách ứng dụng kết nối, mở sang bên).
  - Dưới 768px: sidebar vào Drawer, mở từ nút menu của header.
- **Dropdown:** nhóm (`type: 'group'`) nhận `selectionMode` / `selectedKeys` riêng (React Aria hỗ trợ sẵn), tiêu đề nhóm không bắt buộc. Nhờ vậy một menu có cả danh sách chọn một (tài khoản) lẫn hành động thường (đăng xuất).
- **Search Modal** (agent dựng, tôi nối vào AppShell), theo Figma "Search Modal" (6 trạng thái):
  - React Aria `Autocomplete` + SearchField fc + Menu có nhóm theo đường dẫn ("Nhà hàng / Danh sách nhà hàng").
  - Lọc không dấu, mọi từ phải khớp nhãn hoặc đường dẫn; ↑↓ đi qua các nhóm, Enter chọn, Esc đóng; con trỏ luôn ở ô tìm.
  - Trạng thái: gợi ý (chưa gõ) · Gần đây + "Xoá lịch sử" · kết quả · không tìm thấy; vùng `status` đọc "N kết quả".
  - Footer phím tắt (ESC / ↑ / ↓ / ↵) dùng `<kbd>`, ẩn dưới 576px (điện thoại không có bàn phím).
  - Lệch Figma: tiêu đề gợi ý Medium → Semibold; mô tả "không tìm thấy" dùng Description (Figma 3.4:1); phím tắt dùng màu Description thay vì Disabled (là thông tin thật); sửa lỗi gõ "Nhâp" → "Nhập".
  - Còn mở: kích thước 650 × 450 chưa có biến (đề xuất `Component/Search-Modal/Width|Height`); nền footer Figma bind `Seed/Background` chỉ lộ ở Dark — có vẻ bind nhầm, cần designer xem.
  - axe sạch ở Light và Dark/Green/Compact; play test qua.
- **Menu:** item có menu con nhận `popupHeader` (hiện trên danh sách trong popover) → ô "Tìm kiếm" lọc ứng dụng của "Mở rộng" như Figma (không dấu vẫn tìm được: "hoa don" → "Hoá đơn…").
- **Avatar:** `alt=""` = avatar trang trí (tên đã in bên cạnh) → ẩn khỏi trình đọc màn hình thay vì `role="img"` không tên.
- **Storybook:** Templates được bọc cả FcTheme lẫn ConfigProvider antd trong lúc chuyển đổi (trang RestaurantListPage bên trong còn là antd tới đợt 4).
- **Lệch Figma (có lý do):**
  - Tên người dùng Figma dùng Medium 500 → dùng Regular 400 (CLAUDE.md chỉ cho 2 độ đậm).
  - Chữ "Tìm kiếm" trong ô: Figma màu placeholder (1.8:1). Ở đây ô là một nút mở Search Modal nên chữ là nhãn của nút → dùng `Content/Description` (4.5:1).
  - Icon AI: Figma tô gradient góc (angular), SVG không có → gradient thẳng qua cùng 4 màu.
  - "cài đặt tài khoản" → "Cài đặt tài khoản" (viết hoa đầu câu).
- **Cần anh/chị xem trong Figma:** mục "Kế toán vo" có vẻ gõ thiếu (bản antd cũ ghi "Accounting & Banking"); đang giữ đúng chữ Figma.

## 20. Đợt 4 — hiển thị dữ liệu (12 component) + RestaurantListPage

Làm theo kế hoạch đã duyệt (`docs/fc-plan-waves-3-5.md`). 5 agent dựng song song, mỗi agent đọc Figma (chỉ đọc) và đề xuất token; tôi ghép, tạo token trong Figma, xuất, build, kiểm.

### Component
| Component | Điểm chính |
|---|---|
| Table | Dữ liệu kiểu antd (`columns` / `dataSource`) + tên trạng thái React Aria; 3 cỡ, có viền, tiêu đề / footer, phân trang (Pagination fc), sắp xếp, lọc (Dropdown + "Đặt lại" / "Áp dụng"), tìm trong header (Popover), chọn dòng checkbox / radio, mở rộng dòng (tree table có sẵn của React Aria: `treegrid`, ← → mở / đóng), header dính, rỗng = Empty, đang tải = Spin |
| Card, CardMeta | 2 cỡ, không viền, Tabs trên đầu, ảnh bìa + meta + hàng thao tác (nút thật có tên), Inner, lưới 4 / 3 / 2, đang tải |
| Descriptions | `dl` thật; 3 cỡ, có viền (cột thẳng hàng bằng subgrid), dọc / ngang, số cột, `span` |
| Statistic, Countdown | Số định dạng vi-VN, tăng / giảm (màu + mũi tên + chữ ẩn), đếm ngược không đọc từng giây, báo "Đã hết thời gian" một lần |
| Empty | Ảnh 1 / 2 (lấy từ Figma, xám theo Light / Dark), 2 cỡ, nút hành động |
| Result | info / success / warning / error / 403 / 404 / 500 (hình từ Figma) / icon riêng, khung chi tiết lỗi |
| Alert | 4 loại, mô tả, banner, hành động, đóng (icon / chữ) có animation; `role=alert` cho lỗi / cảnh báo |
| Progress | Thanh / tròn / dashboard, trạng thái, đầu tròn / vuông, dạng bước, gradient (chỉ màu có tên), 6 vị trí số; ProgressBar hoặc Meter |
| Steps | Cơ bản / chấm / navigation / inline / panel, dọc, nhỏ, % trên bước hiện tại, bấm để chuyển bước |
| Timeline | Trái / phải / xen kẽ, ngang, màu item, chấm riêng, pending, đảo thứ tự |
| Skeleton (+ Avatar / Button / Input / Image) | Cơ bản / phức hợp, nhấp nháy (tắt khi giảm chuyển động), một thông báo "Đang tải…" cho trình đọc màn hình |
| Spin | 3 cỡ, chữ kèm, phủ lên nội dung (mờ + `inert` + `aria-busy`), trễ, toàn màn hình |

### Token (78 biến `Component/*`, tổng 182)
- Chi tiết: `docs/fc-component-tokens-proposal.md` mục "Đợt 4". 61 biến `Legacy/*` trỏ sang; giá trị cũ sao lưu ở `docs/migration/figma-backup-wave4-legacy.json`.
- Xuất lát `component` khớp checksum Figma (4a46598f). `build:tokens` đạt, `audit:contrast` 240/240.
- Figma đổi hiển thị ở 4 chỗ (sửa tương phản / lỗi): nhãn Descriptions (3.1:1 → Content/Label), thanh Progress (Solid/Info → Content/Info), tiêu đề "Card / Basic with Inner inside" 12 → 14, icon Result 42 → 40.

### Tôi chỉnh sau khi ghép
- Alert: tiêu đề về `Content/Heading` như Figma, icon giữ màu trạng thái (nhận biết loại không chỉ nhờ nền).
- Table: trạng thái rỗng dùng `Empty`, đang tải dùng `Spin` (thay chữ trơn và icon tự vẽ).
- Icon mới vào `src/icons.tsx`: `FilterFunnel01` (12px), `FaceSmile`.

### RestaurantListPage (viết lại bằng fc)
- Breadcrumb · "Tiện ích" (Dropdown) · "Tạo nhà hàng" (primary duy nhất) · ô tìm (không dấu) · lọc thành phố · chọn cột hiển thị (Dropdown chọn nhiều) · Table có sắp xếp, trạng thái bằng StatusBadge, phân trang khi > 10 dòng · rỗng / không khớp (nút "Xoá tìm kiếm và bộ lọc", dạng default) · đang tải.
- Nội dung tiếng Việt (nhà hàng ở Hà Nội / TP.HCM / Đà Nẵng). Frame Figma "Empty Search" mà bản antd ghi nguồn không còn trong file → giữ bố cục cũ.
- Storybook: Templates giờ chỉ dùng FcTheme; không còn file nào ngoài `src/theme` import antd.

### Lệch Figma / CLAUDE.md (theo báo cáo agent, tôi đã duyệt)
- Table bo 8 (Figma) thay vì vuông (CLAUDE.md) — nằm sau `Component/Table/Radius`, đổi 0 là xong.
- Card padding 16 (Figma) thay vì 24 (CLAUDE.md).
- Chữ / icon Figma dưới chuẩn tương phản được nâng lên: nhãn Descriptions, phụ đề Result, "Close Text" của Alert, caret sắp xếp, chấm chờ của Steps / Timeline, màu thanh Progress trên nền Dark.
- Độ đậm Medium 500 trong Figma (header bảng, tab đang chọn) → 600 hoặc 400 (chỉ 2 độ đậm).
- Giá trị lệch lưới 4px giữ theo Figma cho phần tử mảnh: Progress 6 / 2, chấm Steps / Timeline 10.

### Câu hỏi mở cho anh/chị
1. Alert: icon màu trạng thái (đang làm) hay xám như Figma? Result đang để icon xám như Figma.
2. Thanh Progress mặc định đầu tròn (Figma) — CLAUDE.md để dạng pill cho avatar / badge / dot. Giữ tròn?
3. Statistic trong Card: Figma dùng bóng nhẹ + bo 4; đang dùng Card phẳng (flat-first). Có cần biến thể Card nổi?
4. Figma có vài lỗi nên sửa tại nguồn: icon trạng thái Progress / Steps nét trắng (vô hình trên nền sáng), `Legacy/Card` cỡ chữ tiêu đề bị đảo (đã sửa qua alias), ảnh Empty 2 dùng hex rời.

## 21. Đợt 5 — nhập liệu phức tạp (14 component)

7 agent dựng song song (brief chung, Figma chỉ đọc); tôi ghép, tạo token, xuất, build, kiểm.

| Component | Điểm chính |
|---|---|
| Form, FormItem | React Aria `Form`; dọc / ngang / inline, 3 cỡ truyền xuống mọi field, dấu bắt buộc / "(không bắt buộc)", tooltip nhãn, lỗi tiếng Việt (kể cả lỗi trình duyệt), lỗi từ server theo `name` |
| InputNumber | `NumberField` + khung field chung; nút tăng giảm, prefix / suffix / addon, định dạng vi-VN ("12.000 ₫") |
| Slider | Một / hai đầu, dọc, đảo chiều, mốc, chấm, bước chỉ theo mốc, icon hai đầu, bong bóng giá trị |
| Segmented | `ToggleButtonGroup` + chỉ báo trượt; 3 cỡ, block, dọc, bo tròn, icon |
| Collapse | `DisclosureGroup`; có viền / không viền / ghost, 3 cỡ, accordion, icon trái / phải, phần phụ trên header (bấm không mở / đóng) |
| DatePicker, DateRangePicker, MultiDatePicker | Ngày / ngày giờ / tháng / năm, khoảng (2 tháng), preset ("7 ngày qua"…), nhiều ngày; dd/MM/yyyy, tuần bắt đầu thứ Hai, "Tháng 1", "T2…CN" |
| Calendar | Toàn trang / dạng thẻ, chế độ tháng / năm, header riêng, ô có ghi chú, số tuần |
| TimePicker, TimeRangePicker (+ `TimeColumns`) | Gõ trực tiếp + cột giờ / phút / giây, "Bây giờ" / "OK", bước, giờ bị khoá, ca qua đêm; DatePicker dùng lại `TimeColumns` |
| Tree | Chọn, checkbox 3 trạng thái, đường nối, kiểu thư mục, kéo thả có vạch thả, tải bất đồng bộ, tìm có tô sáng |
| TreeSelect | Field mở Tree; một / nhiều (tag), tìm, chiến lược giá trị (con / cha / tất cả) |
| Cascader | Cột cạnh nhau, mở bằng bấm / rê, chọn nhiều (tag), tìm theo đường dẫn không dấu |
| AutoComplete | `ComboBox` cho phép giá trị tự do, nhóm, kèm nút tìm |
| Transfer | 2 `GridList` có checkbox, chọn tất cả, tìm, một chiều, báo "Đã chuyển 3 mục" |
| Upload | Nút / kéo thả, danh sách chữ / ảnh / ảnh thẻ / ảnh tròn, tiến độ (Progress), lỗi + thử lại, xem trước bằng `ImagePreview` |

### Token (90 biến `Component/*`, tổng 272)
- 89 biến `Legacy/*` trỏ sang; sao lưu `docs/migration/figma-backup-wave5-legacy.json`. Checksum lát `component` khớp (8b95bc90).
- Figma đổi hiển thị (sửa tương phản): Slider track / thumb (Border/Accent-Light 1.7:1 → Solid/Accent), rail (→ Border/Neutral-Faded), dấu bắt buộc Form (Solid/Danger → Content/Danger). Giá trị lệch lưới được làm tròn: InputNumber 90 → 92, nút tăng giảm 22 → 24, ảnh thẻ Upload 102 → 104, hàng tháng / năm 66 → 64, ô chọn tháng Calendar 70 → 96 (vừa "Tháng 12").

### Tôi chỉnh sau khi ghép
- TextField, TextArea, SearchField, Select nhận cỡ từ `<Form size>` và prop `tooltip`.
- Nhãn mọi field theo nhãn Form của Figma (màu Heading, `*` sau chữ, cách field 8px).
- `ImagePreview` được export; Upload dùng nó thay vì gắn một `Image` ẩn.
- Icon lấy thẳng từ package được chuyển vào `src/icons.tsx`: `Inbox01`, `ImagePlus`, `Paperclip`, `FaceFrown`, `Folder`, `MinusSquare`, `PlusSquare`.

### Câu hỏi mở cho anh/chị (chi tiết trong báo cáo từng agent)
1. Chữ khi danh sách rỗng: "Chưa có dữ liệu" (Figma Cascader / AutoComplete) hay "Không có dữ liệu" (Select / Empty)? Nên thống nhất một.
2. Segmented: thêm viền 1px cho mục đang chọn (Figma trắng trên xám chỉ 1.09:1) — giữ viền hay theo Figma?
3. Tìm kiếm của Cascader / TreeSelect đặt ở đầu menu (giữ đúng ngữ nghĩa danh sách), không gõ thẳng vào ô như antd.
4. Calendar: đổi tháng / năm ở header có đổi luôn ngày đang chọn không?

## 22. Giai đoạn 5 — gỡ Ant Design

- `npm uninstall antd @ant-design/icons`; thêm `@internationalized/date` (trước chỉ có gián tiếp qua React Aria).
- Xoá `src/theme/` (theme antd cũ), `scripts/audit-tokens.mjs`, `generate-css-vars.mjs`, `swap-icons.py`, script `validate:tokens` / `generate:css-vars`. Sao lưu: `docs/migration/legacy-antd-theme-2026-09-27.tgz`.
- Trang "Design Tokens/Icons" viết lại bằng fc.
- `.storybook/preview.tsx`: một decorator `FcTheme` cho mọi trang; bỏ tham số `fcTheme` trong các story.
- `src/index.css`: bỏ các bản vá CSS cho `.ant-*`.
- Lint: cấm import `antd` / `@ant-design/*` trong toàn bộ `src` và `.storybook`.
- CI: `build:tokens` + `audit:contrast` thay cho `validate:tokens`.
- Tài liệu: `AGENTS.md`, `README.md` viết lại; `design-tokens.md`, `naming-guidelines.md`, `token-contract.md` (mô tả kiến trúc antd) chuyển vào `docs/migration/legacy/`.
- Còn nhắc antd trong code: chỉ quy tắc lint cấm import. Chú thích "(antd `loading`)"… đã viết lại.
- **Chưa làm, chờ anh/chị:** viết lại `CLAUDE.md` (file quy ước chung của anh/chị, vẫn ghi "Ant Design v6"); xoá biến `Legacy/*` trong Figma; commit git.
- **Cập nhật:** anh/chị duyệt cả ba. `CLAUDE.md` đã viết lại (bản cũ: `docs/migration/CLAUDE.antd-v6.backup.md`). Commit `1743f94` đã push lên `main`, Storybook live đã deploy. Việc xoá `Legacy/*`: xem mục 23.

## 23. Xoá biến `Legacy/*` trong Figma — XONG 2026-09-27

Anh/chị: "làm kỹ nhé". Đã xoá cả 1.961 biến. Collection `5. Components` giờ chỉ còn 272 biến `Component/*`. Token export không đổi (checksum 6 lát trùng với trước khi xoá).

**Sao lưu:** `docs/migration/figma-backup-legacy-vars.txt` (1.961 dòng `Tên|Kiểu|Giá trị|Scopes`, checksum nội dung đã sắp xếp `f2749ed9`). Muốn quay lại: File → Show version history trong Figma.

### Cách làm
Mỗi binding tới `Legacy/*` được gắn sang cuối chuỗi alias (biến không-Legacy đầu tiên). 103 biến Legacy mang giá trị thô: gỡ binding, giữ giá trị. Script trong `docs/migration/`:

| Bước | Script | Việc |
|---|---|---|
| A. Node gốc | `legacy-rebind.figma.js` | Mọi node không nằm trong instance, trên 99 trang. Trang Button: 2.400 node, mỗi lần ghi khoảng 0,2 giây (Button lồng trong gần như mọi component), 56 lượt. |
| Style | (một lần chạy) | Text style `Text Base/Semibold` → `Typography/Size/Base`; effect style `Component/Button/*Shadow` → `Color/Outline/*`, `Stroke/Width/Outline`. Giá trị không đổi. |
| Steps | (một lần chạy) | 64 node chữ gắn `maxWidth`: API không gắn biến được vào `maxWidth` của text, nên gỡ binding (giữ 140 = `Component/Steps/Description-Max-Width`). Có thể gắn tay trong Figma. |
| B. Override trong instance | `legacy-rebind-instances.figma.js` | Chỉ sửa binding Figma liệt kê trong `instance.overrides` trên cùng trang (kể cả trường `boundVariables`). Binding thừa hưởng để nguyên, tự theo khi tầng gốc được sửa. Chạy nhiều lượt tới khi hết. |
| Component mồ côi | `legacy-rebind-orphans.figma.js` | Component (set) đã xoá khỏi canvas nhưng instance vẫn dùng (vd `_Table`, `Button / Basic`, các icon antd `*Outlined`). Pha A không thấy chúng. |
| Nội dung ngoài canvas | `legacy-rebind-offcanvas.figma.js` | Nội dung mặc định của SLOT (Table "Content Columns", Alert/Popconfirm "Items", "Head", "Footer"…) nằm trong khung không thuộc trang nào. |

### Kết quả
- Hơn 30.000 binding được gắn lại sang biến semantic / `Component/*`.
- **568 node còn trỏ vào biến đã xoá** (giá trị hiển thị không đổi; Figma hiện là biến đã bị xoá):
  - Phần lớn là kích thước icon đã swap trong instance lồng nhau (`Menu iconSize`, `Button onlyIconSize`) và chữ trong bản sao ở Draft / AI Design. Plugin API bỏ qua mọi lệnh gắn biến lên các lớp này (thử cả gỡ rồi gắn, mở khoá tỉ lệ).
  - Chữ vạch mốc Slider trong component Form: gắn lẫn gỡ đều không ăn.
  - 1 lớp chữ font "SF Pro Text" (không có trong Figma), trang Block.
  - Theo trang: Draft 304, AI Design 124, Form 58, Menu 56, Block 13, App Shells 9, AutoComplete 3, TreeSelect 1.
  - Sửa tay nếu cần: chọn lớp trong Figma, gắn lại biến ở panel bên phải.
- Kiểm: `node scripts/export-checksum.mjs` trùng `figma-export.js` (`SLICE = 'checksum'`) ở cả 6 lát (global `fe8901fb`, palette `d8d49014`, semantic `b7bdd2b8`, rest `ba7e2034`, component `9492136e`, effects `440897b4`). `build:tokens`, `audit:contrast` 240/240.

### Bài học (đã ghi vào `AGENTS.md` và hướng dẫn bảo trì)
- Figma không trả biến / collection theo thứ tự cố định: checksum phải tính trên bản đã sắp xếp khoá (`scripts/export-checksum.mjs`).
- Gắn biến trong instance chỉ khi đó là override thật; gắn thừa tạo override mới và cắt lớp khỏi component gốc.
- Component xoá khỏi canvas và nội dung mặc định của SLOT vẫn giữ binding; phải tìm từ ID của lớp trong instance.
- Mỗi lượt `use_figma` ≤ 60–70 giây; ghi trong một vòng đồng bộ.

## 24. Icon đóng 16px, nét icon trạng thái 2px, tên FABi CMS (2026-09-27)

Anh/chị yêu cầu:
- **Icon X để đóng / gỡ / xoá luôn 16px** (trước 12–14px).
  - Code: `XClose` mặc định 16; Tag, Tabs, Alert dùng `--fc-typography-size-lg` (16 Default, 14 Compact); nút đóng Modal, Drawer, Notification đặt `--_icon-size`. Đo lại 134 story: mọi nút đóng / gỡ đều 16px.
  - Figma: `x-line` 16×16 ở 16 biến thể Alert, Tag Closeable, 6 biến thể thẻ Select. Tabs và `_Button Close` (Modal / Drawer / Notification) vốn đã 16.
- **Icon Result và trạng thái rỗng của Search Modal: nét 2px** (`Stroke/Width/Strong`).
  - Code: `Result.module.css`, `SearchModal.module.css`.
  - Figma: 5 biến thể Result (Success, Info, Warning, Error, Custom icon). Search Modal trong Figma đã là 2px.
- **Tên "FABi CMS Design System"** (không phải "FABi Design System"): tiêu đề Storybook (`.storybook/manager.ts`), trang Welcome, `README.md`, `AGENTS.md`, `CLAUDE.md`, nội dung mẫu trong story Form / Upload.
  - Giữ nguyên: "FABi Online" (tên kênh đặt món, tooltip mẫu trong Form) và tên miền email `@fabi.vn`.

## Phụ lục — file chính đã tạo/sửa đêm nay

- Figma: trang Token Naming, 🎨 Colors, 💡 Effects; biến `Brand/*/Content-Accent`, `Brand/Light/Solid-Accent`, 11 giá trị semantic.
- `src/fc/FcTheme.tsx`, `src/fc/index.ts`, `src/fc/components/{Input,Checkbox,Radio,Switch,Tag,Badge,Avatar,Tooltip}/*`
- `src/fc/components/{Button,Typography}/*.module.css`, `src/fc/docs/TokenTable.module.css` (vòng focus)
- `scripts/build-tokens.mjs` (chốt chặn), `scripts/audit-contrast.mjs` (strict, thêm cặp), `scripts/tokens-lib.mjs`, `scripts/figma-export.js`, `scripts/merge-figma-export.mjs`
- `tokens/*`, `src/fc/tokens.css`, `src/fc/tokens.meta.ts` (sinh lại)
- `src/theme/semanticTokens.ts`, `src/theme/tokens.css` (theme cũ theo Figma)
- `src/components/Card.stories.tsx` (sửa lỗi lint có sẵn)
- `package.json` (+ `react-aria`)
- `docs/token-naming-spec.md`, `docs/fc-roadmap.md`, `AGENTS.md`, `docs/migration/*`

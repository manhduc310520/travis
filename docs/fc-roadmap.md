# Lộ trình chuyển sang design system `fc`

> Tài liệu tạm thời. Xóa ở giai đoạn 5, khi repo không còn phụ thuộc thư viện cũ.
> Chốt ngày 2026-09-26.

## Mục tiêu

FABi CMS có design system riêng mang tên `fc`: token, component và tài liệu
đều của FABi. Tiêu chí hoàn thành: tìm trong repo (trừ `node_modules`) ra
**0 kết quả** cho `antd` và `Ant Design`.

## Quyết định đã chốt

| Chủ đề | Quyết định |
|---|---|
| Tên token | Theo [token-naming-spec.md](./token-naming-spec.md), namespace `fc` |
| Namespace | Chỉ ở biến CSS `--fc-*` và Code syntax; không ở tên collection hay đường dẫn biến Figma |
| Phân cách | `/` cho nhóm, `-` trong leaf |
| Viết hoa | Figma viết hoa chữ đầu mọi từ (`Color/Background/Accent-Faded`), thang cỡ viết hoa toàn bộ (`SM`, `LG`); code viết thường |
| Tầng màu | Kiểu Zen: `0. Global` một mode (`global/light\|dark/…`) → `2. Colors` semantic + `color/palette` để màu thô đổi theo Light/Dark |
| Chữ + icon | `content` |
| Thành công | `success` |
| Lớp hành vi | Thư viện headless (không có giao diện), chọn ở giai đoạn 3 sau khi đánh giá |
| Style | CSS Modules + biến `--fc-*` |
| Phạm vi component | Đợt 1–5; bỏ đợt 6 |
| Component token | Thiết kế lại khi viết từng component; bộ cũ xóa sau đó |

## Giai đoạn

| GĐ | Việc | Cổng duyệt |
|---|---|---|
| 0 | Duyệt đặc tả tên | Bạn duyệt `token-naming-spec.md` |
| 1 | Figma: đổi tên tầng 1–4 (~360 biến), tên collection, Code syntax `var(--fc-…)`; sửa dễ: đổi tên dải màu, gộp Pink vào Magenta, biến mồ côi `Color`, tên gõ sai | Bạn duyệt bảng đổi tên trước khi ghi vào Figma |
| 2 | Xuất biến Figma → `tokens/fc.tokens.json` (DTCG) → sinh `tokens.css` theo `data-brand` / `data-mode` / `data-density` | So giá trị trước/sau: không đổi |
| 3 | Nền móng `src/fc/`: đánh giá và chọn thư viện headless, cấu trúc thư mục, Storybook đổi theme bằng `data-*` | Bạn duyệt lựa chọn thư viện |
| 4 | Viết component theo đợt (bên dưới). Mỗi component: token Figma → React → story → a11y → so ảnh 20 tổ hợp theme → xóa bản cũ | Duyệt cuối mỗi đợt |
| 5 | Gỡ thư viện cũ, dọn tài liệu, viết lại `CLAUDE.md`, xóa file này | Grep = 0 |

## Tiến độ

| GĐ | Trạng thái | Ghi chú |
|---|---|---|
| 0 | ✅ Xong 2026-09-26 | Đặc tả được duyệt |
| 1 | ✅ Xong 2026-09-26 | 331 biến đổi tên, 11 biến xóa (10 Pink + `Color`), 4 collection đổi tên thành `fc · …` (sau đó bỏ tiền tố cho dễ nhìn), Code syntax `var(--fc-…)` cho mọi biến, 2 mô tả được dọn. 46 liên kết Pink trên trang Button chuyển sang Magenta (cùng giá trị). Không giá trị nào đổi, không alias nào gãy. Bản sao lưu: `migration/figma-backup-before-fc.json`. |
| 1b | ✅ Xong 2026-09-26 | Trang tài liệu Figma: 🎨 Colors (466 chỗ), 📏 Size, Space & Radius (138), 💡 Effects (10), 🔠 Typography (8 nhãn). Tên token `fc`, cột Group tính lại từ dữ liệu thật (Brand / Global / Alias / Value), cột Value lấy giá trị thật, mô tả tiếng Việt. Effect style `boxShadow*` → `shadow/base·strong·light`; 6 text style Normal/Strong → Regular/Semibold. Bảng Item & Outline rộng 1440, section Brand Colors rộng 1680. |
| 2 | ✅ Xong 2026-09-26 | `tokens/figma-export.json` (xuất qua `scripts/figma-export.js`, checksum khớp Figma) → `npm run build:tokens` → `tokens/fc.tokens.json` (DTCG) + `src/fc/tokens.css` (`--fc-*`, alias giữ dạng `var()`). Trình duyệt: 6.620/6.620 giá trị khớp. Đối chiếu code cũ (`docs/migration/verify-tokens.mjs`): 1.192/1.192. Đã sửa 4 lỗi có sẵn trong Figma: success/warning/danger-faded Light về bậc 1; info-light-hover Dark → `border/accent-light-hover`. |
| 3 | ✅ Xong 2026-09-26 | Thư viện hành vi: **React Aria Components 1.21.1** (duy nhất phủ đủ Table, DatePicker, Tree, Upload). `src/fc/`: `tokens.css`, `base.css` (chỉ trong `.fc-root`), `FcTheme`, `axes.ts`, `index.ts`, mỗi component một thư mục `.tsx` + `.module.css` + `.stories.tsx`. Storybook: story có tiêu đề `fc/…` được bọc bằng `FcTheme`, dùng chung thanh Brand/Mode/Density. Lint: cấm import `antd`, `@ant-design/*`, `src/theme` bên trong `src/fc/`. Button mẫu (`fc/Components/Button`) kiểm chứng cả luồng ở blue·light·default và green·dark·compact, vòng focus bàn phím, trạng thái disabled/pending; story cũ vẫn chạy. |

Bổ sung 2026-09-26 (theo yêu cầu, trước đợt 1): 4 trang Storybook **Design Tokens**
(Color, Border, Layout, Font) viết lại trong `src/fc/docs/` — danh sách token lấy từ
`src/fc/tokens.meta.ts` (sinh bởi `build:tokens`), cột CSS là `var(--fc-…)` trùng
Code syntax Figma, cột Giá trị đo trực tiếp và đổi theo thanh Brand/Mode/Density.
Trang cũ đọc `src/theme` đã xóa; trang Icons giữ nguyên.

Còn mở từ giai đoạn 3:
- React Aria có 34 ngôn ngữ, **không có tiếng Việt**: ngày/số định dạng đúng qua `Intl`, nhưng nhãn có sẵn (Previous, Next, Clear…) là tiếng Anh. Kiểm chứng cách ghi đè khi làm component đầu tiên có nhãn có sẵn (Select ở đợt 3).
- Button mẫu đang dùng thẳng token ngữ nghĩa. Token `component/button/…` trong Figma thiết kế ở đợt 2.

~~Còn mở: `shadow/strong` cùng giá trị với `shadow/base`~~ — **đã gộp** 2026-09-26: 531 node (+7 bản sao
ẩn) chuyển sang `Shadow/Base`, xóa style `Shadow/Strong` và dòng của nó trên trang 💡 Effects.
Effect style `Component/*` và `iconGlass/*` để lại cho giai đoạn 4.

Lưu ý: biến thể `Color=Pink` của Button vẫn còn (nay dùng màu magenta). Theo
quy ước, màu preset không dùng cho nút — xử lý khi viết lại Button ở đợt 2.

### Đợt 1 (Bố cục) — xong 2026-09-26 (duyệt: sửa contrast trước đợt 2, xóa story cũ, giữ nhóm token Figma cũ)

Flex, Space, Row/Col (Grid), Divider, Title/Text/Paragraph/Link. Không cần token
`component/…` mới (token cũ của Divider/Space/Typography chỉ là alias chuyển tiếp).
- 24/24 story hiển thị; 880/880 kiểm tra token khớp ở 20 tổ hợp theme.
- `build:tokens` thêm bước chặn media query lệch token breakpoint.
- axe: 0 vi phạm cấu trúc/nhãn/bàn phím. Vi phạm độ tương phản do giá trị token
  (54/110 cặp) đã sửa ở mục "Sửa độ tương phản" bên dưới.

### Bổ sung 2026-09-26: tách tầng Global theo kiểu Zen

Trước đó bảng màu gốc `global/color/{hue}-{step}` nằm trong `2. Colors` và có 2 mode,
lẫn với token semantic. Đã tách:
- **`0. Global`** (mới, một mode `Value`, ẩn khỏi thư viện): 242 giá trị gốc
  `global/light/{hue}/{step}`, `global/dark/{hue}/{step}`, `global/white`, `global/transparent`.
- **`1. Brand`:** thêm `brand/light/primary-1…10`, `brand/dark/primary-1…10`; xóa 10 biến
  `brand/primary-N` (có 2 mode ngầm qua bảng màu cũ). 25 giá trị brand khác trỏ thẳng Global.
- **`2. Colors`:** 61 alias semantic trỏ thẳng Global. 122 biến bảng màu cũ đổi tên thành
  `color/palette/{hue}/{step}` (giữ nguyên ID, nên ~3.000 liên kết trên layer vẫn đổi theo
  Light/Dark mà không phải gắn lại); thêm `color/palette/accent/1…10`. Lý do giữ palette:
  Global không đổi theo mode, nên màu thô (Tag, Avatar, chart) cần một biến 2 mode đứng giữa.
- Layer: gắn lại mọi liên kết `brand/primary-N` (gồm cả điểm dừng gradient) sang
  `color/palette/accent/N`; quét 99 trang còn 0.
- Trang 🎨 Colors: 151 chip đổi tên (bảng Brand Colors ghi alias thật ở mode Light,
  Base Color Palettes ghi `color/palette/…`). Storybook Color thêm mục Palette và Global.
- Code: `scripts/figma-export.js` xuất 4 phần (global, palette, semantic, rest);
  `build:tokens` đặt biến Global ở `:root`.
- Kiểm chứng: 0 giá trị semantic hay palette đổi (6.620 phép so với bản cũ); trình duyệt
  11.860/11.860 ở 20 tổ hợp; `verify-tokens` 1.192/1.192. Bản sao lưu:
  `migration/figma-backup-before-global-split.json`.
- Ngoại lệ: `brand/{light,dark}/outline-accent` là giá trị ghép alias + độ mờ, Plugin API
  không ghi được, nên vẫn trỏ `color/palette` (giá trị đúng).

### Bổ sung 2026-09-26: viết hoa chữ đầu trong Figma

Theo yêu cầu (giống Zen): 593 biến ở collection 0–4 đổi sang Title Case, thang cỡ viết hoa
toàn bộ (`Space/Padding-Inline/Control-SM`); 3 effect style `Shadow/*`. Chỉ đổi tên hiển thị:
ID, liên kết, Code syntax `var(--fc-…)` giữ nguyên. `scripts/tokens-lib.mjs` hạ chữ thường khi
đọc export, nên `tokens.css`, `tokens.meta.ts`, `fc.tokens.json` build lại **giống hệt từng byte**
(checksum 4 phần xuất khớp Figma). Trang docs Figma: 295 chip (Colors), 65 (Size, Space &
Radius), 4 (Effects). Muốn quay lại: hạ chữ thường tên biến (tên cũ toàn chữ thường).

### Sửa độ tương phản (tier 1) — xong và **đã duyệt** 2026-09-26

Làm trong đêm theo kế hoạch đã duyệt ("sửa contrast trước đợt 2"). Mỗi thay đổi là **bậc
nhỏ nhất** đạt chuẩn, tính tự động (`docs/migration/contrast-proposal.mjs`). Sao lưu giá
trị cũ: `migration/figma-backup-before-contrast.json`.

| Biến | Trước | Sau |
|---|---|---|
| `Brand/Light/Content-Accent` (mới) | — | blue 7 · green 8 · yellow 9 · magenta 7 · orange 8 |
| `Brand/Dark/Content-Accent` (mới) | — | blue 7 · green 6 · yellow 6 · magenta 7 · orange 6 |
| `Brand/Light/Solid-Accent` (mới) | — | bậc 8, riêng yellow bậc 9 |
| `Color/Content/Accent` | `Brand/*/Primary-6` | `Brand/{Light,Dark}/Content-Accent` |
| `Color/Solid/Accent` Light | `Brand/Light/Primary-8` | `Brand/Light/Solid-Accent` (chỉ yellow đổi) |
| `Color/Content/Link` | `Color/Solid/Info` | `Color/Content/Info` |
| `Color/Content/Description` Light | `Neutral-Light` (45%) | `Neutral` (65%) |
| `Color/Content/Success` Light | `Global/Light/Green/6` | `Global/Light/Green/8` |
| `Color/Content/Warning` Light | `Global/Light/Amber/6` | `Global/Light/Amber/9` |
| `Color/Content/Danger` | `#FF4D4F` / `#DC4446` | `Global/Light/Red/7` / `Global/Dark/Red/8` |
| `Color/Solid/Danger` Dark | `#DC4446` | `Global/Dark/Red/6` |

- Vòng focus trong code: `Color/Border/Accent-Light` (1.1–2.3:1) → `Color/Solid/Accent`, nét 2px
  (đúng spec). `npm run audit:contrast` giờ **strict**, 170/170 cặp đạt (thêm chữ trạng thái
  trên nền nhạt, tooltip, focus danger).
- Figma: trang 🎨 Colors cập nhật 9 giá trị + 1 Group; mọi ô màu (135 semantic, 240 palette)
  gắn biến thật thay cho hex cứng; thêm dòng `Color/Palette/Indigo/8` còn thiếu.
- Theme antd cũ (`src/theme/semanticTokens.ts`) sinh lại từ export → `verify-tokens` 1.192/1.192;
  `colorLink` giờ tách khỏi `colorPrimary` (theo Figma).
- **Viền control (duyệt 2026-09-26):** `Color/Border/Neutral` chỉ 1.4–1.8:1 so với nền, không đạt
  WCAG 1.4.11 (3:1).
  - Thêm `Color/Border/Control`: Light `#8C8C8C`, Dark `#737373`, scope Stroke. Đạt 3.08–4.43:1 trên
    container / layout / elevated / neutral.
  - Figma: 465 stroke trong component chính chuyển sang biến mới (Button default/dashed, Input,
    InputNumber, Select, DatePicker, TimePicker, Checkbox, Radio, trigger ColorPicker). Instance tự
    theo. Biến thể disabled, vạch chia trong InputNumber và ô màu giữ nguyên.
  - Sao lưu binding cũ: `migration/figma-backup-border-control.json`. Trang 🎨 Colors thêm một dòng.
  - Code fc: Input (ô, addon, OTP), Checkbox, Radio (tròn và kiểu nút), Button default/dashed,
    TagAddButton. `audit:contrast` thêm 4 cặp, đạt 210/210.
  - Theme antd cũ chưa đổi (hết khi gỡ antd ở giai đoạn 5).
- Placeholder 1.8–2.2:1 giữ theo CLAUDE.md (anh/chị quyết 2026-09-26). Chữ tone `disabled` 1.8:1
  được WCAG miễn trừ.

### Đợt 2 (Control cơ bản) — xong 2026-09-26 (duyệt; đã xóa 9 story antd cũ: Button, Input, Checkbox, Radio, Switch, Tag, Badge, Avatar, Tooltip)

TextField/TextArea, Checkbox/CheckboxGroup, Radio/RadioGroup, Switch, Tag, Badge/StatusBadge,
Avatar/AvatarGroup, Tooltip (+ Button có từ giai đoạn 3). 40 story mới (`fc/Components/*`).
- `FcTheme` render thêm một portal có theme trên `document.body` (qua `UNSAFE_PortalProvider`
  của `react-aria`, nay là phụ thuộc trực tiếp) — lớp nổi đợt 3 dùng chung.
- `build:tokens` chặn thêm: code tham chiếu token không tồn tại → build lỗi.
- **Token `Component/*` (duyệt và làm 2026-09-26):**
  - 41 biến cho 14 component đợt 1–2; nhóm cũ đổi tên `Legacy/` và trỏ vào biến mới.
  - Code đọc `--fc-component-*`. Chi tiết: `fc-component-tokens-proposal.md`.
  - Còn lại: xóa 375 biến `Legacy/` của 12 component (khoảng 42.000 binding, làm dần).
  - Từ đợt 3, mỗi component thiết kế token `Component/*` cùng lúc với code.
- Khác Figma có chủ đích: rãnh Switch tắt đậm hơn (3.36:1 thay vì 1.8:1); chữ Tag preset
  dùng bậc đạt 4.5:1 cho từng dải (7–9) thay vì luôn bậc 7.
- Kiểm chứng: style thật so với token 300/300 ở 20 tổ hợp; 94 story × 4 theme: 0 lỗi render/console,
  axe sạch trừ 2 ngoại lệ đã biết (chữ disabled được miễn trừ; trang Icons antd cũ). tsc/oxlint 0 lỗi.

### Đợt 3 (Lớp nổi, điều hướng, thông báo) — xong 2026-09-26

- **Component:** Popover, Popconfirm, Dropdown (+ DropdownButton), Select, Menu, Tabs, Breadcrumb, Pagination, Modal (+ ConfirmModal, InfoModal, useModal), Drawer, Message, Notification (+ Toaster).
- **Image:** thêm theo yêu cầu, chuyển ra khỏi nhóm "chỉ làm khi cần".
- **Nền móng:**
  - Shadow vào pipeline (gộp Strong → Base).
  - Tiếng Việt cho React Aria.
  - `overlay.module.css`, `listItem.module.css`, `ScrollArea`, `docs/fc-component-conventions.md`.
- **Token:** 62 biến `Component/*` mới. Avatar sửa: `Font-Size` → `Icon-Size` + `Font-Size` 12. `Content/Description` Dark → Neutral.
- **Chi tiết:** `fc-worklog.md` mục 19; kế hoạch `fc-plan-waves-3-5.md`.
- **Template:** `AppHeader`, `AppShell` viết lại bằng fc, mẫu Search Modal dựng mới (Templates) ✅. Chi tiết: `docs/fc-worklog.md` §19.

## Đợt component

1. **Bố cục:** Flex, Space, Grid, Divider, Typography ✅
2. **Control cơ bản:** Button, Input, Checkbox, Radio, Switch, Tag, Badge, Avatar, Tooltip ✅
3. **Lớp nổi, điều hướng, thông báo:** Select, Dropdown, Menu, Tabs, Breadcrumb, Pagination, Modal, Drawer, Popover, Popconfirm, Message, Notification, Image ✅ — `AppShell`, `AppHeader`, Search Modal ✅
4. **Dữ liệu:** Table, Card, Descriptions, Empty, Skeleton, Spin, Progress, Alert, Result, Steps, Statistic, Timeline ✅ — `RestaurantListPage` viết lại bằng fc ✅
   (bỏ List 2026-09-26: Deprecated trong Figma và antd 6.6; story đã xóa)
5. **Phức tạp:** Form, DatePicker, TimePicker, Calendar, Upload, Tree, TreeSelect, Cascader, Transfer, AutoComplete, InputNumber, Slider, Segmented, Collapse ✅

**Giai đoạn 5 (gỡ antd):** ✅ 2026-09-27 — xem `docs/fc-worklog.md` §22. Còn chờ: viết lại `CLAUDE.md`, xoá `Legacy/*` trong Figma.

**Không làm (chỉ làm khi có màn hình cần):** Carousel, Masonry, Mentions, QRCode,
Watermark, Tour, Rate, ColorPicker, FloatButton, Anchor, Splitter. (Image đã làm ở đợt 3.)

## Trong lúc chuyển đổi

- Component cũ và mới chạy song song. Đổi tên trong Figma không làm hỏng code
  cũ, vì code cũ chép cứng giá trị.
- Mọi thao tác ghi vào Figma: tạo phiên bản có tên trước, làm theo đợt, kiểm
  tra sau mỗi đợt.

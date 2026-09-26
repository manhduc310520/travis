# Kế hoạch đợt 3, 4, 5 — dựng lại toàn bộ component fc

> Soạn 2026-09-26. **Đã duyệt 2026-09-26** ("có kế hoạch rồi thì làm thôi"): phạm vi 3 đợt, thêm
> Notification / Statistic / Timeline; làm liền mạch, báo cáo cuối mỗi đợt. Shadow: gộp `Strong`
> vào `Base` (đã làm).
> Nguồn: `docs/fc-roadmap.md`, kiểm kê Figma `docs/migration/figma-variant-inventory.md`,
> use case cũ trong `docs/migration/legacy-antd-stories-2026-09-26.zip`,
> React Aria Components 1.21.1 (đã kiểm từng primitive có sẵn).

## Tóm tắt

| Đợt | Nội dung | Số component | Nền móng cần làm trước | Sau đợt |
|---|---|---|---|---|
| 3 | Lớp nổi, điều hướng, thông báo | 12 | Shadow vào pipeline, bề mặt lớp nổi, dòng list chung, tiếng Việt cho React Aria | Viết lại `AppHeader`, `AppShell`, mẫu Search Modal |
| 4 | Hiển thị dữ liệu | 12 | — | Viết lại `RestaurantListPage` |
| 5 | Nhập liệu phức tạp | 14 | Kiến trúc Form (nhãn, bắt buộc, lỗi) | Giai đoạn 5: gỡ antd |

Tổng khi xong: 14 (đã có) + 38 = **52 component**. Nhóm "chỉ làm khi có màn hình cần" giữ nguyên (12).

**Thêm so với lộ trình cũ** (bị sót, Figma có trang riêng):
- **Notification** vào đợt 3: dùng chung hệ thống toast với Message.
- **Statistic, Timeline** vào đợt 4.

**Không làm thành component:**
- Affix: dùng CSS `position: sticky`.
- List: Deprecated.
- Layout / App shells: là template.
- Search Modal: là mẫu cấp ứng dụng, dựng trong Templates.

## Cách làm mỗi đợt (giống đợt 1–2)

Mỗi đợt có **2 lần anh/chị duyệt**, ở giữa tôi tự làm:

1. **Duyệt đầu đợt:** một bảng gồm API chính và danh sách token `Component/*` cho từng component (như đề xuất đợt 1–2).
2. **Tôi làm, cho mỗi component:**
   - Đọc trang Figma, kiểm kê variant và use case cũ trong file zip.
   - Tạo token `Component/*` trong Figma, trỏ biến `Legacy/` tương ứng sang (cách alias, không gắn lại từng node), export lát `component`.
   - Dựng trên React Aria + CSS Modules, chỉ dùng `--fc-*`.
   - Story đủ mọi variant của Figma, nhãn tiếng Việt.
3. **Kiểm, cho mỗi component:**
   - tsc, oxlint, chốt chặn `build:tokens`, `audit:contrast` (thêm cặp màu mới).
   - Đo token thật trong trình duyệt ở 20 tổ hợp theme.
   - axe ở 5 theme; thử bàn phím.
4. **Duyệt cuối đợt:** anh/chị xem trong Storybook; tôi ghi chi tiết từng component vào worklog.

## Đợt 3 — Lớp nổi, điều hướng, thông báo (12)

### Nền móng (làm trước)
| Việc | Vì sao |
|---|---|
| **Shadow vào pipeline:** export effect style `Shadow/Light · Base` → `--fc-shadow-light`, `--fc-shadow-base` | Mọi lớp nổi cần shadow (quy tắc "Elevated phân biệt bằng shadow"). `Shadow/Strong` đã gộp vào `Base`. |
| **Bề mặt lớp nổi dùng chung:** nền Elevated, bo 8px / 4px, shadow, mũi tên, animation, portal có theme (đã có từ đợt 2) | Dùng cho Popover, Popconfirm, Dropdown, Select; sau này cho DatePicker, Cascader, TreeSelect. |
| **Dòng list dùng chung:** hover / selected / disabled / danger / icon / phần phụ | Dùng chung cho Select, Dropdown, Menu; sau này AutoComplete, Cascader. Token `Color/Background/Item-*` đã có. |
| **Tiếng Việt cho React Aria:** thử nghiệm ngắn | React Aria không có sẵn `vi-VN` (có 34 ngôn ngữ, không có tiếng Việt), nên các chuỗi nội bộ (đọc cho trình đọc màn hình, "Clear", "Dismiss"…) sẽ ra tiếng Anh. Thử nạp bộ chuỗi tiếng Việt vào từ điển toàn cục của React Aria. Nếu không được: mọi nhãn do fc tự truyền (đã làm vậy ở đợt 2). Ngày tháng và số đã tự định dạng đúng `vi-VN` qua Intl. |

### Component
| Component | Dựng trên | Variant Figma phải đủ | Cỡ |
|---|---|---|---|
| **Popover** | DialogTrigger + Popover + Dialog | 12 hướng, có/không mũi tên, tiêu đề + nội dung, trigger hover/click/focus | S |
| **Popconfirm** | Popover + Dialog (`alertdialog`) + 2 Button | 12 hướng, icon cảnh báo, OK / Hủy, danger | S |
| **Dropdown** | MenuTrigger + Menu + Popover, SubmenuTrigger | 6 hướng, mũi tên, menu con, trạng thái item (default / hover / disabled / selected / danger / icon / phần phụ), nút tách đôi (Button Twofold), footer có nút | M |
| **Menu** (điều hướng bên) | NavigationTree hoặc Disclosure (chọn sau khi thử) | Inline / Vertical, thu gọn (tooltip khi thu), Light / Dark, nhóm, menu con, item lỗi, disabled | L |
| **Select** | Select + ListBox + Popover (có sẵn `selectionMode="multiple"`); tìm kiếm → ComboBox; nhiều giá trị hiện bằng TagGroup trong ô | Outlined / Filled / Borderless / Underlined × Basic / Multiple / Search × Status × 3 cỡ, prefix, giới hạn số lượng, menu rỗng, mở trên / dưới | L |
| **Tabs** | Tabs | Trên / dưới / trái / phải, 3 cỡ, Card, Container (thêm / đóng tab), icon, badge | M |
| **Breadcrumb** | Breadcrumbs | Cơ bản, item có dropdown, icon, trang hiện tại | S |
| **Pagination** | Tự dựng: `nav` + Button, NumberField, Select | Basic, Jumper, Mini, Mini Jumper, More, Simple, Prev / Next, đổi số dòng / trang, 3 cỡ, disabled | M |
| **Modal** | DialogTrigger + ModalOverlay + Modal + Dialog | Cơ bản (chữ / slot), footer tùy chỉnh, Information (info / success / error / warning), Confirmation, mask 45%. Kèm hook `useConfirm()` thay cho `Modal.confirm` của antd | M |
| **Drawer** | ModalOverlay + Modal (trượt vào) | 4 phía, nút phụ trên header, footer, không nút đóng, cỡ | M |
| **Message** | UNSTABLE_ToastRegion + ToastQueue | 5 loại (thường / thành công / lỗi / cảnh báo / đang tải), tự tắt | M |
| **Notification** | Cùng hệ toast, vùng góc màn hình | 5 loại, có / không icon, có nút hành động, đóng | S |

**Sau đợt 3:** viết lại `AppHeader` và `AppShell` bằng fc (Menu, Dropdown, Avatar, Badge, Input), và dựng mẫu **Search Modal** trong Templates.

## Đợt 4 — Hiển thị dữ liệu (12)

| Component | Dựng trên | Variant Figma phải đủ | Cỡ |
|---|---|---|---|
| **Table** | RAC Table (+ Virtualizer khi nhiều dòng) | 3 cỡ, có viền, tiêu đề / footer / phân trang (Pagination đợt 3), sắp xếp, lọc (Dropdown), tìm trong header, chọn dòng checkbox / radio, mở rộng dòng (tự dựng: React Aria Table chưa có sẵn), kiểu ô (chữ / Badge / Tag / Avatar / Switch / Progress / nút / Dropdown) | L |
| **Card** | Tự dựng | Cơ bản, 2 cỡ, không viền, có Tabs, ảnh bìa + meta + hành động, lưới 4 / 3 / 2 cột | M |
| **Descriptions** | Tự dựng (`dl`) | 3 cỡ, có viền, ô trạng thái | S |
| **Empty** | Tự dựng + minh họa SVG từ Figma | Ảnh 1 / 2, 2 cỡ | S |
| **Skeleton** | Tự dựng | Cơ bản / phức hợp, avatar / input / button / ảnh, nhấp nháy | S |
| **Spin** | Tự dựng | 3 cỡ, có chữ, phủ lên khung, bọc nội dung | S |
| **Progress** | ProgressBar / Meter | Thanh / tròn / dashboard, 3 cỡ, trạng thái, đầu tròn / vuông, dạng bước, gradient (chỉ màu brand), vị trí số | M |
| **Alert** | Tự dựng (`role=alert` / `status`) | 4 loại, mô tả, banner, hành động, đóng (chữ / icon) | S |
| **Result** | Tự dựng + minh họa SVG từ Figma | info / success / warning / error / 403 / 404 / 500 / icon riêng | M |
| **Steps** | Tự dựng (list có trạng thái) | Cơ bản, nhỏ, dọc, chấm, icon riêng, navigation, inline, panel, có tiến độ | M |
| **Statistic** | Tự dựng | Cơ bản, tăng / giảm, trong Card, đếm ngược | S |
| **Timeline** | Tự dựng (list) | Trái / phải / xen kẽ, ngang, màu item, chấm riêng | S |

**Sau đợt 4:** viết lại `RestaurantListPage` bằng fc (Table, Pagination, Select, Input, Tag, Badge).

## Đợt 5 — Nhập liệu phức tạp (14)

### Nền móng
**Kiến trúc Form:** nhãn, dấu bắt buộc / tuỳ chọn, tooltip nhãn, mô tả, lỗi, bố cục dọc / ngang / inline, 3 cỡ — trên RAC Form + các field đã có. Làm đầu đợt vì mọi field còn lại dùng chung.

| Component | Dựng trên | Variant Figma phải đủ | Cỡ |
|---|---|---|---|
| **Form** | RAC Form + field fc | Dọc / ngang / inline, 3 cỡ, 18 loại trường, form đăng nhập | M |
| **InputNumber** | NumberField | 3 cỡ, 4 kiểu viền, status, prefix / suffix, addon, nút tăng giảm | M |
| **Slider** | Slider | Một / hai đầu, dọc, đảo chiều, mốc, có icon, kèm InputNumber | M |
| **Segmented** | ToggleButtonGroup | 3 cỡ, block, dọc, bo tròn, icon, item disabled | S |
| **Collapse** | DisclosureGroup | Cơ bản / không viền / ghost, 3 cỡ, icon trái / phải, disabled, phần phụ | S |
| **AutoComplete** | ComboBox (cho phép giá trị tự do) | 3 cỡ, không viền, nhóm, rỗng, kèm nút | M |
| **DatePicker** | DatePicker / DateRangePicker + Calendar | Ngày / ngày giờ / tháng / năm, khoảng, preset, nhiều ngày, 4 kiểu viền × status × cỡ, prefix; định dạng `dd/MM/yyyy` | L |
| **TimePicker** | TimeField + cột giờ tự dựng (ListBox) | Chọn giờ dạng cột, khoảng, 4 kiểu viền × status × cỡ | L |
| **Calendar** | Calendar | Tháng / năm, dạng thẻ / toàn trang, header riêng, ô có ghi chú, số tuần | M |
| **Tree** | Tree (+ kéo thả của React Aria) | Cơ bản, checkbox, icon, đường nối, leaf, kéo thả | L |
| **TreeSelect** | Trigger + Popover + Tree | Cơ bản, checkbox (nhiều), mở trên / dưới | M |
| **Cascader** | Popover + các cột ListBox tự điều phối | 4 hướng mở, item checkbox (nhiều), disabled, mở cột bằng hover / click | L |
| **Transfer** | 2 GridList + checkbox + nút chuyển | Tìm kiếm, footer, status warning / error, disabled | M |
| **Upload** | FileTrigger + DropZone | Nút, kéo thả, danh sách chữ / ảnh / ảnh tròn / thẻ ảnh, đang tải / lỗi / xong (Progress đợt 4); không gọi mạng trong story | M |

## Giai đoạn 5 — Gỡ antd (sau đợt 5)

1. Mọi template dùng fc; gỡ `antd`, `@ant-design/*` khỏi `package.json`.
2. Xóa `src/theme` (theme antd cũ) và các script chỉ phục vụ nó (`verify-tokens`, `generate:css-vars`).
3. **Figma `Legacy/`:** vì mỗi đợt đã alias sang biến mới, lúc này có thể xóa dần.
   - Xóa thật cần gắn lại binding (ước tính vài giờ chạy tự động, chia nhiều phiên).
   - Anh/chị quyết lúc đó: xóa hẳn, hay để nguyên nhóm `Legacy/` (không ảnh hưởng gì).
4. Viết lại `CLAUDE.md` theo hệ thống fc (đã duyệt), dọn tài liệu tạm.
5. Chốt: 0 kết quả khi tìm `antd` / `Ant Design` trong code.

## Rủi ro đã biết

| Rủi ro | Cách xử lý |
|---|---|
| Toast của React Aria đang là API `UNSTABLE_` | Bọc sau API `message.*` / `notification.*` của fc; đổi bên trong không ảnh hưởng nơi dùng |
| Không có tiếng Việt sẵn | Thử nghiệm ở nền móng đợt 3; phương án dự phòng: fc tự truyền mọi nhãn |
| Menu điều hướng: `NavigationTree` còn mới | Thử trước; không ổn thì dựng bằng Disclosure + Link |
| Cascader, TimePicker (cột), Transfer không có primitive sẵn | Tự điều phối bàn phím; xếp cỡ L, làm cuối đợt |
| Minh họa Empty / Result cần file SVG | Tải từ Figma (MCP `download_assets`), tối ưu, không dùng ảnh antd |
| Gắn lại binding trong Figma rất chậm (khoảng 0,34 giây / lần) | Luôn dùng cách alias; không gắn lại hàng loạt |

## Cần anh/chị quyết để bắt đầu

1. **Duyệt kế hoạch này**: phạm vi 3 đợt; thêm Notification, Statistic, Timeline; giữ nhóm "chỉ làm khi cần".
2. **Cách duyệt mỗi đợt**: 2 lần (đầu đợt: API + token; cuối đợt: review) — hay chỉ duyệt cuối đợt để nhanh hơn?
3. **Shadow**: `Shadow/Base` và `Shadow/Strong` đang cùng giá trị trong Figma — giữ 2 tên cùng giá trị, hay chỉnh `Strong` đậm hơn cho Modal / Drawer?

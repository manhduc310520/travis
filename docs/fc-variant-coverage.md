# Đối chiếu variant Figma ↔ Storybook — ghi chú từng component

> Làm ngày 2026-09-26 theo yêu cầu "check toàn bộ variant trong Figma vs Storybook và update đủ use case".
> Nguồn Figma: `docs/migration/figma-variant-inventory.md` (kiểm kê tự động 65 trang).
> Storybook: 260 → **500 story**; còn **499** sau khi xóa story List (Deprecated). Chưa commit git.

**Cách làm**
- **14 component `fc/`** (hệ thống mới): tôi tự làm, vì phần lớn chỗ thiếu là **tính năng**, không chỉ story.
- **44 component antd cũ** (`Components/…`): 5 agent chạy song song, mỗi agent bám bảng kiểm kê. Antd đã có sẵn tính năng, nên chỉ cần thêm story.
- Không story cũ nào bị xóa.

Quy ước trong bảng: ✅ đã có đủ · ➕ thêm mới trong đợt này · ⚠️ không làm hoặc làm gần đúng (có lý do).

---

## A. Component fc (hệ thống mới)

### Button
- ➕ **Tính năng mới**
  - `variant`: `dashed`, `solid`, `outlined`, `filled` (giữ `primary / default / text / link`).
  - `color`: default, primary, danger và 12 dải màu.
  - `ghost`, `shape` (`round` / `circle`), component `ButtonGroup` (ngang / dọc).
- ➕ **Story mới**
  - `Types`, `Round`, `Danger`, `Ghost`, `IconOnly` (có circle và 3 cỡ).
  - `ColorVariants`: lưới 6 fill × 6 màu, đúng bộ Figma "Color (optional)".
  - `SolidColors`, `Sizes`, `Group` (ngang / dọc, primary / default, cỡ nhỏ / lớn).
- Màu dải (Magenta = "Pink" của Figma, Purple, Cyan…) dùng bậc đạt 4.5:1 ở cả Light và Dark, chữ đổi trắng / đen theo mode.
- ⚠️ Pink của Figma ứng với **Magenta**, vì Pink đã gộp vào Magenta từ giai đoạn 1.

### Typography
- ➕ **Tính năng mới**: `size` cho Text / Paragraph (SM 12/20 · Base 14/22 · LG 16/24), `keyboard` (`<kbd>`), Link `underline` (luôn gạch chân), Title `editable` (bút sửa, Enter lưu, Esc hủy).
- ➕ **Story mới**: `Sizes`, `EditableTitle`; `Styles` thêm Keyboard; `Links` thêm link gạch chân.
- ⚠️ **Italic không làm**: CLAUDE.md cấm italic trong UI.

### Divider
- ➕ `variant`: `solid / dashed / dotted`; `dashed` vẫn dùng được.
- ➕ Story `Dotted`, `LineStyles` (3 kiểu × chữ thường / tiêu đề / không chữ), `VerticalLineStyles`.

### Grid
- ✅ `TwentyFourColumns` đã có 1 / 2 / 3 / 4 / 6 / 8 cột, khớp Figma Columns.

### Space
- ➕ Size `none` (Figma Space=None).
- ➕ Story `Slots` (1–8 và 12 ô, ngang / dọc), `AllSizes` (None / Small / Middle / Large).

### Checkbox
- ✅ Chưa chọn / đã chọn / một phần / disabled / invalid.
- ➕ Story `WithoutLabel` (Label=false, có `aria-label`), `WithTooltip` (nút trợ giúp đặt cạnh nhãn, không nằm trong nhãn để khỏi đổi trạng thái khi bấm).

### Input
- ➕ **Tính năng**
  - Variant `underlined`, `borderless`; status `success`.
  - `showCount` (input + textarea).
  - `addonBefore` / `addonAfter` (Figma Pre / Post Tab).
- ➕ **Component mới `SearchField`**: icon trong ô; nút default; nút primary icon; nút primary có chữ; 3 cỡ.
- ➕ **Component mới `OtpField`**
  - 4 / 6 / 8 ô, dấu phân cách, status error / warning, filled / borderless, 3 cỡ, disabled.
  - Hành vi: tự nhảy ô, dán cả mã, Backspace lùi ô.
- ➕ **Story mới**: `Variants` (4 kiểu), `Status`, `ShowCount`, `PrePostTab`, `Search`, `Otp`.
- ⚠️ Pre / Post Tab dạng **Select** chờ đợt 3 (chưa có Select fc).

### Radio
- ➕ `RadioGroup appearance="button"`: `buttonStyle` outlined / solid, 3 cỡ, `block` (Figma "Radio / Radio Button").
- ➕ Story `WithoutLabel`, `ButtonStyle` (outlined, solid, sm, lg, block, lựa chọn disabled).

### Switch
- ➕ `isLoading`: spinner trong núm, khóa thao tác, giữ màu trạng thái.
- ➕ `checkedContent` / `uncheckedContent`: chữ, số hoặc icon trong rãnh (Figma "Number and Icon").
- ➕ Story `Loading`, `WithContent`.
- Khi có nội dung, rãnh tắt đậm hơn để chữ trắng đạt 4.5:1.

### Avatar
- ➕ Size dạng số px (Figma Size=Custom); màu dải dùng bảng màu chung.
- ➕ Story `CustomSize`, `WithBadge` (tròn / vuông × 4 cỡ, chấm và số), `GroupSizes` (sm / md / lg).

### Badge
- ➕ **Component mới `Ribbon`**: màu mặc định (accent) và 7 màu Figma (Volcano = vermilion, Daybreak Blue = blue, Magenta, Dust Red = red, Cyan, Polar Green = green, Golden Purple = purple); đặt đầu / cuối.
- ➕ `StatusBadge` không chữ (Label=false, bắt buộc `aria-label`).
- ➕ Story `Ribbons`, `StatusDotOnly`.

### Tag
- ➕ **Tính năng**
  - `variant`: `outlined / filled / solid` cho mọi màu (Figma Type).
  - **Component mới** `CheckableTag` (Figma Checkable) và `TagAddButton` (Figma "Add New").
- ➕ **Story mới**: `Presets` (12 dải × 3 variant), `StatusVariants` (5 trạng thái × 3 variant, có icon), `Checkable`, `AddNew`.
- Tag solid màu success / warning dùng bậc đậm của green / amber: `Solid/Success` và `Solid/Warning` quá sáng cho chữ trắng ở Dark.
- ⚠️ **Tag icon mạng xã hội** (Twitter / Youtube / Facebook / LinkedIn) không làm: bộ icon không có logo thương hiệu, và màu thương hiệu nằm ngoài palette.

### Tooltip
- ➕ `showArrow`, `color` (12 dải), hỗ trợ đủ 12 hướng.
- ➕ Story `AllPlacements` (12 hướng mở cùng lúc), `WithoutArrow`, `ColorPresets`.
- ⚠️ **Màu Custom tự chọn không làm**: quy tắc cấm màu ngoài palette.

### Flex
- Figma không có trang Flex; story giữ nguyên.

---

## B. Component antd cũ (`Components/…`)

> **Đã xóa 2026-09-26** theo yêu cầu (Storybook chỉ giữ component fc, tiêu đề `Components/…`).
> Toàn bộ story dưới đây nằm trong `docs/migration/legacy-antd-stories-2026-09-26.zip`, dùng làm
> tham chiếu use case khi dựng lại từng component ở đợt 3–5.

### Nhóm điều hướng & lớp nổi
- **Anchor**: `Default` (cấp 1–2), `Horizontal`; ➕ `ScrollSpy`.
- **Breadcrumb**: ➕ `WithDropdown`; `Default` hiện đủ trạng thái link / hover / trang hiện tại; `WithIcon` có icon-only và icon + chữ.
- **Dropdown**
  - ➕ `BasicInline`, `InlinePlacements` và `ButtonPlacements` (6 hướng mở sẵn).
  - ➕ `SplitButton` (Button Twofold; `Dropdown.Button` đã deprecated nên dựng từ `Space.Compact`).
  - ➕ `MenuItemStates`, `WithArrow`, `WithFooterButton`.
- **Menu**
  - ➕ `Vertical`, `DarkInline`, `DarkVertical`, `DarkCollapsed`, `ItemTypes` (icon, submenu, group, disabled, lỗi).
  - ⚠️ Không có prop `Logo?`.
  - ⚠️ "Vertical collapsed" trùng với collapsed trong antd.
- **Pagination**: ➕ `More`, `Jumper`, `MiniJumper`, `PrevAndNext`, `Sizes`, `Disabled`.
- **Steps**
  - ➕ `SmallVertical`, `CustomIcon`, `Dot`, `DotVertical`, `WithProgress`, `Inline`, `Navigation`, `NavigationSmall`, `Panel` (Type 1 & 2).
  - ⚠️ `Direction=Steps` chưa rõ nghĩa, chưa ánh xạ.
- **Tabs**: ➕ `Placements` (4 phía), `Sizes`, `CardSizes`, `EditableCard` (Container, thêm / đóng tab), `WithIconAndBadge`.
- **Popover**: ➕ `TriggerTypes`, `WithoutArrow`, `Placements` (12 hướng).
- **Popconfirm**: ➕ `Interactive`, `Placements` (12 hướng).
- **Tour** (file mới): `Basic`, `WithoutImage`, `NonModal`, `NonModalPlacements`, `Placements`, `Indicators`.

### Nhóm chọn & picker
- **Select**: ➕ `Sizes`, `Variants` (outlined / filled / borderless / underlined), `Status`, `WithPrefix`, `MaxCount`, `Placements`, `EmptyMenu`.
- **AutoComplete**
  - ➕ `Sizes`, `Borderless`, `Open`, `MenuTypes` (thường / nhóm / rỗng), `WithButton`, `WithButtonOpen`.
  - ⚠️ Kiểu có nút không có cỡ: antd cảnh báo khi đặt size.
- **Cascader**: ➕ `Sizes`, `Placements` (4 hướng), `MenuItemTypes` (thường / checkbox / disabled), `Disabled`.
- **TreeSelect**: ➕ `Sizes`, `Open`, `Placements`.
- **DatePicker**: ➕ `PickerTypes` (ngày / ngày giờ / tháng / năm, đơn và khoảng), `Sizes`, `Variants`, `Status`, `Multiple`, `WithPrefix`, `Open`, `OpenRange`, `Presets`.
- **TimePicker**: ➕ `Sizes`, `Variants`, `Status`, `WithPrefix`, `Open`.
- **ColorPicker**
  - ➕ `Sizes`, `Open`, `Presets`, `AllowClear`, `Gradient`.
  - ⚠️ "Direction" và "Show Icon" của popup chưa rõ nghĩa, chưa làm.
- **Mentions**
  - ➕ `Sizes`, `OpenBottom`, `OpenTop`, `OpenLarge`, `OpenSmall`.
  - ⚠️ Antd không có prop `open`, nên story tự gõ "@" để mở danh sách. Trên trang Docs các story này hiển thị ở trạng thái đóng.

### Nhóm nhập liệu & form
- **InputNumber**: ➕ `Sizes`, `PrefixSuffix`, `PrePostTab` (chữ / icon / select), `Variants`, `FilledStatus`, `Spinner`. `WithSuffix` đã sửa để hết màu cứng `#fafafa`, vốn làm hỏng Dark.
- **Rate**: ➕ `AllValues` (0 → 5, bước 0.5), `WithText`, `Sizes`, `CustomCharacter`.
- **Slider**: ➕ `Vertical`, `Reverse`, `WithIcons`, `WithInputNumber`.
- **Transfer**: ➕ `WithSearch`, `WithFooter`, `Status`, `Disabled`. Sửa lỗi cũ: `Default` bị đơ vì truyền `targetKeys` cố định.
- **Upload**: ➕ `ButtonStates`, `TextList`, `PictureList`, `PictureCircle`; `PictureCard` đủ trạng thái. Ảnh là SVG nội tuyến, không gọi mạng.
- **Form**
  - ➕ `Horizontal`, `Inline`.
  - ➕ `FieldTypesVertical` và `FieldTypesHorizontal`: đủ 18 loại trường Figma.
  - ➕ `Login` (MD / SM), `InlineLogin`.
  - Giữ nguyên các story anh/chị đã chỉnh.
- **Segmented**: ➕ `Round`, `Vertical`, `WithIcons`, `DisabledItem`, `Sizes`.
- **Affix** (file mới): thanh tiêu đề ghim trên danh sách cuộn.

### Nhóm hiển thị dữ liệu
- **Calendar**: ➕ `BasicYear`, `Card`, `CardYear`, `CardYearCustomHeader`, `ShowWeek`, `NoticeCells`.
- **Card** (chỉ thêm phần thiếu): ➕ `BorderlessWithTabs`, `GridColumns` (4 / 3 / 2), `WithoutImage`.
- **Carousel**: ➕ `DotPlacement` (4 phía), `Arrows`.
- **Collapse**: ➕ `Borderless`, `Ghost`, `Sizes`, `ExpandIconRight`, `DisabledItem`, `ExtraNode`.
- **Descriptions**: ➕ `BorderedSizes`, `WithStatus`.
- **Empty**: ➕ `Images`, `Sizes` (⚠️ SM dùng class nội bộ của antd, vì antd không có prop size).
- **Image**: ➕ `HoverMask`, `PreviewDesktop`, `PreviewMobile`, `FixedRatio`. Mọi ảnh là SVG nội tuyến.
- **QRCode**: ➕ `InPopover`, `Loading`, `Expired`; `WithIconSlot` giờ có icon giữa.
- **Statistic**: ➕ `Basic`, `Countdown`; `WithTrend` và `InCards` hiện đủ tăng / giảm.
- **Table**: ➕ `WithTitleFooterPagination`, `Bordered`, `Sizes`, `HeaderSortFilterSearch`, `CellTypes`, `RowSelection`, `ExpandableRows`.
- **Timeline**: ➕ `Right`, `ItemColors`, `CustomDot`, `Horizontal`.
- **Tree**: ➕ `WithIcon`, `ShowLine`, `Draggable`.

### Nhóm phản hồi & khác
- **Alert**: ➕ `CustomActions`, `BannerTypes`, `CloseTextAndIcon`.
- **Drawer**: ➕ `Placements` (4 phía), `ExtraActions`, `WithFooter`, `WithoutCloseIcon`, `Interactive`.
- **Modal**: ➕ `BasicText`, `CustomFooter`, `WithOverlay`, `Information` (info / success / error / warning), `InformationTriggers`, `Confirmation`, `Interactive`.
- **Message** (file mới): `Default`, `Types` (5 loại), `Triggers`.
- **Notification** (file mới): `Default`, `Types`, `WithActions`, `WithoutIcon`, `Triggers`.
- **Progress**: ➕ `LineSizes`, `CircleStatuses`, `Dashboard`, `Steps`, `CircleSteps`, `Gradient`, `Linecap`, `ValuePosition`.
- **Result**: ➕ `Info`, `Warning`, `Forbidden` (403), `ServerError` (500), `CustomIcon`.
- **Skeleton**: ➕ `Elements`, `Compositions` (đủ 7 ví dụ Figma), `ActiveElements`.
- **Spin**: ➕ `SizesWithDescription`, `InsideContainer`, `Nested`.
- **Watermark**: ➕ `MultiLine`, `ImageWatermark`.
- **FloatButton**: ➕ `TypesAndShapes`, `Badges`, `WithDescription`, `WithTooltip`, `Group` (vuông / tròn × dọc / ngang), `Menu`.
- **Masonry**: ➕ `TwoColumns`, `ThreeColumns`, `Responsive` (⚠️ Figma "Type 1/2/3" chưa rõ nghĩa).
- **Splitter**: ➕ `Horizontal`, `Vertical`, `MultiplePanels`, `Collapsible`, `Complex`.

### Không có story (có chủ đích)
- **Search Modal**: mẫu ở cấp ứng dụng, không phải component antd.
- **Layout / App shells**: đã có trong `Templates/AppShell`.
- **List**: Deprecated trong Figma.

---

## C. Trạng thái hover / pressed
Figma vẽ riêng các State như Hover, Pressed, Focused. Trong Storybook, các trạng thái này hiện khi **tương tác thật** (rê chuột, bấm, Tab), không dựng thành story tĩnh. Riêng fc dùng React Aria nên mọi trạng thái đều có thuộc tính `data-*` tương ứng.

---

## D. Rà soát sau khi sửa

### Cách kiểm
- **Toàn bộ 500 story**, theme mặc định (Light / Blue / Default): lỗi render, story trắng, lỗi và cảnh báo console, axe-core.
- **106 story fc** thêm ở 4 theme: Dark / Green, Light / Magenta / Compact, Dark / Orange / Compact, Light / Yellow.
- Tắt luật axe `region`, vì đây là luật cấp trang, không áp cho component lẻ.
- Xem tận mắt các story mở sẵn lớp nổi (Popover / Tooltip 12 hướng, Dropdown, Select mở…): lớp nổi hiện đúng chỗ.
- Sửa xong thì chạy lại toàn bộ (kết quả ở cuối mục).

### Lượt 1 tìm thấy
- **0** lỗi render, **0** story trắng.
- **Console, fc:** 4 story Playground (Avatar, Button, Tag, Tooltip) báo "Control of type color only supports string".
- **Console, cũ:** Drawer báo `act(...)` (chỉ ở dev); List báo "deprecated".
- **axe:** 144 story có vi phạm. Phần lớn là **thiếu tên truy cập** (nhãn ô nhập, nút chỉ có icon, ảnh thiếu `alt`, thanh tiến trình không tên) ở story antd cũ.
- **axe, fc:** 2 lỗi thật, chỉ lộ ra ở theme khác mặc định (xem dưới).

### Đã sửa — fc
- **Button / Ghost**
  - Nền story trước là xám Spotlight, nên chữ primary / danger chỉ đạt 2.5–3.4:1 (Light / Magenta 2.75, Dark / Green 3.37, Dark / Orange 3.21).
  - Nay nền story ghim Dark mode (`data-mode="dark"` + nền Container). Chữ accent / danger dùng bậc chỉnh cho Dark, đạt 4.5:1 với mọi brand.
  - Ghost vốn dành cho nền tối / nền màu, nên đây là cách trình bày đúng ngữ cảnh.
- **Switch có chữ trong rãnh**, Dark: chữ trắng trên rãnh xám sáng chỉ 2.2:1.
  - Khi tắt, chữ nay dùng `Color/Content/On-Solid-Neutral`: trắng ở Light, đen ở Dark (đạt trên 9:1).
  - Khi bật, giữ chữ trắng trên nền accent.
- **Storybook** (`.storybook/preview.tsx`): bộ đoán control màu đổi thành `/(^background|Color)$/`.
  - Prop `color` của fc là lựa chọn palette có tên, nên hiện dạng select.
  - `bgColor`, `strokeColor`… vẫn có bảng chọn màu.
  - Hết cảnh báo ở cả 4 Playground.

### Đã sửa — story antd cũ (thêm tên truy cập, không đổi giao diện)
| Component | Sửa |
|---|---|
| Alert | `Banner`: chữ chú thích bỏ hex `#8c8c8c` (3.36:1), dùng token `colorTextDescription`. `CloseTextAndIcon`: nút đóng icon có `aria-label` |
| Anchor | `ScrollSpy`: khung cuộn có `tabIndex=0`, `role="region"` và nhãn (dùng được bàn phím) |
| AutoComplete | Mọi ô có `aria-label`; nút tìm chỉ có icon được đặt tên qua icon `role="img"` |
| Breadcrumb | `WithIcon`: link Home chỉ có icon có `aria-label` |
| Card | `CustomSemanticStyling` (chép từ docs antd): bỏ hết hex và `fontWeight: 500`, dùng token (`purple7`, `magenta7`, `boxShadowTertiary`, `fontWeightStrong`) |
| Cascader | Mọi ô có `aria-label` |
| Drawer | Ô nhập trong drawer có `aria-label` khớp nhãn hiển thị |
| FloatButton | Mọi nút chỉ có icon có `aria-label`. Nút có badge đọc cả số ("Help (5)"). Nút mở menu đọc "Open menu" / "Close menu" theo trạng thái |
| Form | `ValidateStatus`: 4 ô có nhãn. `FieldTypes*`: Select mã vùng có nhãn, núm Slider có `ariaLabelForHandle` |
| Image | Mọi ảnh có `alt`, nên nút xem trước cũng có tên. `PreviewGroup` đặt tên cả ảnh trong trình xem |
| InputNumber | Mọi ô và Select tab trước / sau có `aria-label` |
| Progress | Cả 41 thanh / vòng tiến trình có `aria-label` theo chú thích |
| QRCode | Canvas có nhãn "QR code for https://ipos.vn" |
| Rate | `CustomCharacter`: mỗi ô chọn có tên ("3 hearts") |
| Segmented | `WithIcons`: 3 lựa chọn chỉ có icon có tên (List / Board / Grid) |
| Select | Mọi Select có `aria-label` |
| Slider | Mọi núm có tên; khoảng dùng "Range start / Range end" |
| Spin | `Nested`: Switch có nhãn "Loading state" |
| Table | `CellTypes`: Progress và Switch trong bảng có tên theo từng dòng. `HeaderSortFilterSearch`: nút lọc có tên "Search name" |
| TreeSelect | Mọi ô có `aria-label` |
| RestaurantListPage (template thật) | Select lọc thành phố có `aria-label="Filter by city"`; hết lỗi ở 3 story RestaurantListPage và 3 story AppShell |

### Còn lại — không sửa ở mức story
**1. Giá trị token của theme antd cũ** (fc đã xử lý phần tương ứng):
- Placeholder 25% đen (`#bfbfbf`, 1.8:1): Select, AutoComplete, Cascader, TreeSelect, Form; cũng là màu ngày ngoài tháng của Calendar.
  - CLAUDE.md quy định "Placeholder màu disabled", nên đây là **quyết định thiết kế** → đưa vào mục cần anh/chị quyết.
  - fc Input dùng `Color/Content/Placeholder`, cùng giá trị.
- Chữ phụ 45% (`#8c8c8c`, 3.36:1): nhãn Descriptions.
  - fc đã đổi `Content/Description` Light thành mức Neutral (đạt); theme cũ còn `colorTextTertiary`.
- Chữ cảnh báo `#d48806` (2.86:1): DatePicker / TimePicker / InputNumber viền trống trạng thái warning.
  - fc đã dùng `Amber/9` cho chữ cảnh báo.
- Tag preset cyan trong Table (`#08979c` trên nền cyan nhạt, 3.39:1): Tag fc đã dùng bậc đạt 4.5:1.

**2. Nằm trong antd, không có prop để sửa** (hết khi thay bằng fc ở đợt 3–4):
- Menu thả xuống đang mở của AutoComplete, Cascader, Select, TreeSelect: `aria-valid-attr-value`, `aria-required-children`, `aria-allowed-attr`.
- Hai Select tháng / năm ở đầu Calendar không có nhãn; ô ngày có ghi chú dài cuộn được nhưng không nhận focus.
- ColorPicker: ô nhập và thanh chọn sắc độ trong bảng không có nhãn.
- DatePicker / TimePicker: cột giờ cuộn được nhưng không nhận focus.
- Skeleton: tiêu đề `<h3>` rỗng.
- Table: cột chọn / cột mở rộng có tiêu đề rỗng; `aria-hidden-focus` khi chọn dạng radio.
- Tabs `EditableCard`: nút "+" nằm trong `tablist`.
- Transfer: checkbox trong danh sách không có nhãn.
- Upload: thanh tiến trình không tên.
- Modal `Information` / `Confirmation`: bản xem tĩnh dựng bằng panel nội bộ của antd.
  - antd ép tiêu đề rỗng cho loại này, nên hộp thoại không có tên.
  - Có thể vá bằng cách sửa DOM ngoài React, nhưng tôi **không làm**.

**3. Miễn trừ theo WCAG 1.4.3** (nội dung bị vô hiệu): chữ disabled ở Pagination, các story `Disabled`, và tone `disabled` của Typography fc.

**4. Console**
- **Drawer** `act(...)`: Storybook dev bọc mỗi lần render story trong `act()` của React; animation mở drawer của antd cập nhật state trong khoảng đó. Chỉ có ở dev, không ảnh hưởng sản phẩm; hết khi có Drawer fc.
- **List**: antd 6.6 báo List deprecated (gợi ý `Listy`), Figma cũng đánh dấu Deprecated → **đã xóa story List** (anh/chị duyệt 2026-09-26) và bỏ List khỏi đợt 4 trong roadmap.

**Placeholder:** giữ quy ước "Placeholder màu disabled" (anh/chị quyết 2026-09-26). Placeholder chỉ là gợi ý, luôn có nhãn thật đi kèm; axe vẫn sẽ báo các ô này, đó là chủ ý.

### Kết quả chạy lại sau khi sửa
| | Lượt 1 | Sau khi sửa |
|---|---|---|
| Lỗi render / story trắng | 0 | 0 |
| Cảnh báo console fc | 4 | **0** |
| Console story cũ | Drawer `act` (dev), List deprecated | chỉ còn Drawer `act` (dev); story List đã xóa |
| Story có vi phạm axe | 144 | **76**, tất cả thuộc nhóm 1–3 ở trên |
| Vi phạm axe ở fc | Ghost ở 3 theme, Switch ở Dark | **0**. Đã kiểm lại 7 story bị ảnh hưởng × 7 theme và toàn bộ fc ở theme mặc định; chỉ còn tone disabled, được miễn trừ |
| `tsc -p tsconfig.app.json` | | 0 lỗi |
| `oxlint` | | 0 lỗi, 7 cảnh báo cũ |
| `build:tokens` (chốt chặn) | | đạt |

76 story còn lại chia theo nguồn (tính theo lượt vi phạm; một story có thể thuộc nhiều nhóm):
- **Placeholder / disabled của theme cũ:** 43 (`#bfbfbf`, `#c7c7c7`, `#b8b8b8`).
- **Chữ cảnh báo `#d48806`:** 3. **Chữ phụ 45%:** 1. **Tag cyan:** 1.
- **Nội bộ antd:** các story Calendar, ColorPicker, Transfer, Skeleton, Upload, Modal, Table, Tabs, và menu mở của Select-family.

# Đặc tả đặt tên token `fc` — FABi CMS

> Trạng thái: **v4 — đã áp dụng vào Figma.** Cùng ngày 2026-09-26: v2 duyệt và áp dụng;
> v3 tách tầng Global theo kiểu Zen, thêm `Color/Palette`; v4 viết hoa chữ đầu trong Figma.

`fc` là bộ token riêng của FABi CMS. Cấu trúc tên dựa trên 5 nhóm của Wheel
(Namespace · Set · Object · Base · Modifier), nhưng sửa những chỗ Wheel tự
mâu thuẫn: mỗi từ chỉ thuộc một ô, thứ tự ô cố định, mỗi role một thang scale.

## 1. Mỗi token có ba dạng tên — cùng một gốc

| Nơi | Dạng | Ví dụ |
|---|---|---|
| Biến Figma | `Category/Property/Leaf` | `Color/Content/Neutral-Strong` |
| Code syntax (Web) trong Dev Mode | `var(--fc-…)` | `var(--fc-color-content-neutral-strong)` |
| Biến CSS | `--fc-` + tên Figma viết thường, `/` thành `-` | `--fc-color-content-neutral-strong` |

Tên Figma là nguồn gốc. Hai dạng còn lại **suy ra máy móc** từ nó (viết thường, `/`
thành `-`), không ai đặt tay. Pipeline code (`scripts/tokens-lib.mjs`) cũng tự hạ chữ thường.

## 2. Namespace và collection

- Namespace **`fc`** chỉ nằm ở tên biến CSS (`--fc-…`) và Code syntax, không
  nằm trong đường dẫn biến Figma hay tên collection (bỏ cho dễ nhìn, 2026-09-26).
- Collection và mode:

| Collection | Mode | Chứa |
|---|---|---|
| `0. Global` | `Value` (một mode) | Giá trị gốc: `Global/Light/…`, `Global/Dark/…`. Ẩn khỏi thư viện, scope rỗng |
| `1. Brand` | `Blue` · `Green` · `Yellow` · `Magenta` · `Orange` | `Brand/Light/…`, `Brand/Dark/…` |
| `2. Colors` | `Light` · `Dark` | Token màu `Color/…`, gồm cả `Color/Palette/…` |
| `3. Dimensions` | `Default` · `Compact` | `Size`, `Space`, `Radius`, `Stroke`, `Breakpoint` |
| `4. Typography` | `Default` · `Compact` | `Typography/…` |
| `5. Components` | `Value` (một mode) | `Component/…` (mới, thiết kế theo từng đợt — `docs/fc-component-tokens-proposal.md`) · `Legacy/…` (bộ antd cũ, không export, xóa dần) |

## 3. Dấu phân cách và viết hoa

- `/` chỉ cho **nhóm** (thư mục trong Figma): tầng, category, property, component.
- `-` nối các ô trong **leaf**, để tên cuối tự đọc được và tìm được.
- **Viết hoa trong Figma** (giống Zen): mỗi từ viết hoa chữ đầu, cả nhóm lẫn leaf
  (`Color/Background/Accent-Faded-Hover`). Thang cỡ viết tắt viết hoa toàn bộ:
  `XXS` · `XS` · `SM` · `MS` · `MD` · `LG` · `XL` · `XXL`. Số giữ nguyên (`Blue/6`, `Heading-1`).
- **Viết thường trong code**: biến CSS và Code syntax là cùng đường dẫn viết thường
  (`--fc-color-background-accent-faded-hover`).
- Không viết tắt, trừ thang cỡ.

## 4. Thứ tự ô theo tầng

| Tầng | Cấu trúc | Ví dụ |
|---|---|---|
| Global | `Global/{Light\|Dark}/{Hue}/{Step}` · `Global/White` · `Global/Transparent` | `Global/Light/Blue/6` |
| Brand | `Brand/{Light\|Dark}/{Leaf}` | `Brand/Light/Primary-8` · `Brand/Dark/Solid-Accent` |
| Bảng màu | `Color/Palette/{Hue}/{Step}` · `Color/Palette/Accent/{Step}` · `Color/Palette/{White\|Transparent}` | `Color/Palette/Blue/6` |
| Màu | `Color/{Property}/{Role}-{Scale}-{State}` | `Color/Background/Accent-Faded-Hover` |
| Kích thước | `{Category}/{Property}/{Scale}` | `Space/Padding/SM` · `Radius/LG` |
| Chữ | `Typography/{Property}/{Scale}` | `Typography/Size/Heading-1` |
| Component | `Component/{Component}/{Element}-{Property}-{Variant}-{State}-{Scale}` | `Component/Menu/Item-Background-Selected` |

Ô không dùng thì bỏ. **Thứ tự không bao giờ đổi.**

Ở Global và bảng màu, bậc (`step`) là một nhóm riêng (`Blue/6`, không phải
`Blue-6`) để Figma xếp mỗi dải màu thành một nhóm.

Component token được thiết kế **cùng lúc với component**: chỉ tạo token cho giá
trị component thật sự cần tùy biến, và alias thẳng vào token màu/kích thước
chung. Không có nhóm trung gian chuyển tiếp.

### Ba tầng màu

```
Global/Light/Blue/1  #E6F4FF ─┐
                              ├─→ Color/Palette/Blue/1          → Tag, Avatar, chart
Global/Dark/Blue/1   #111A2C ─┘
                              └─→ Color/Background/Accent-Faded  → component, UI chính
```

- **Global** giữ giá trị gốc. `Light`/`Dark` trong tên chỉ là **thư mục** để người
  tìm màu. Figma không đọc tên: collection này chỉ có một mode, nên biến Global
  **không đổi khi frame chuyển Light/Dark**.
- **Token semantic** (`Color/Background/…`, `Color/Content/…`…) trỏ thẳng vào
  Global: cột Light trỏ `Global/Light/…`, cột Dark trỏ `Global/Dark/…`.
- **`Color/Palette`** làm đúng việc đổi mode đó cho **màu thô không có nghĩa semantic**.
  Mỗi bậc màu một tên, cột Light trỏ `Global/Light/…`, cột Dark trỏ `Global/Dark/…`.
  `Color/Palette/Accent/{Step}` là dải của brand đang chọn (qua `Brand/{Light|Dark}/Primary-{Step}`).

Ai gắn gì:

| Dùng cho | Gắn vào |
|---|---|
| Component và UI chính (nút, input, chữ, viền, nền) | `Color/*` semantic |
| Tag màu, Avatar màu, chart, phân loại | `Color/Palette/*` |
| Bất cứ layer nào | **Không bao giờ** gắn thẳng `Global/*` hay `Brand/*`, vì layer sẽ kẹt một màu khi đổi theme hoặc brand |

**Ngoại lệ đã biết:** `Brand/Light/Outline-Accent` và `Brand/Dark/Outline-Accent`
là giá trị ghép alias + độ mờ (`Color/Palette/{Hue}/6` 10%, `Color/Palette/{Hue}/5`
15%). Plugin API không ghi được loại giá trị này, nên chúng vẫn trỏ vào
`Color/Palette` thay vì Global. Giá trị vẫn đúng, vì mỗi biến chỉ được dùng qua
`Color/Outline/Accent` ở đúng mode của nó.

## 5. Từ được phép cho từng ô

Các danh sách dưới đây ghi từ ở dạng code (viết thường). Trong Figma, viết hoa theo mục 3:
`accent` → `Accent`, `sm` → `SM`.

### Hue (Global và bảng màu)

`blue` · `indigo` · `purple` · `magenta` · `red` · `vermilion` · `orange` ·
`amber` · `yellow` · `lime` · `green` · `cyan` — bậc `1` (nhạt nhất) → `10` (đậm nhất).

### Property — màu

| Từ | Nghĩa |
|---|---|
| `background` | màu nền |
| `content` | màu chữ **và** icon |
| `border` | viền, đường kẻ, đường chia |
| `fill` | nền trung tính bán trong suốt (hover, vùng nhấn nhẹ) |
| `solid` | màu chính của một role, dùng được cho nền, chữ hoặc viền |
| `outline` | vòng sáng khi focus |

### Role

- Ngữ nghĩa: `neutral` · `accent` (màu brand) · `info` · `success` · `warning` · `danger` · `link`
- Bề mặt (với `background`, `fill`, `border`): `container` · `elevated` · `layout` · `spotlight` ·
  `overlay` · `header` · `item` (dòng trong list, menu) · `plain` (control không viền, không nền) ·
  `alternate` (nền xen kẽ) · `area` (vùng nội dung) · `handle` (núm kéo) ·
  `control` (chỉ với `border`: viền ô nhập, checkbox, radio, nút default — đạt 3:1)
- Mục đích (chỉ với `content`): `heading` · `label` · `description` · `placeholder` · `disabled` ·
  `icon` · `on-solid` · `on-solid-neutral`

### Seed

`Color/Seed/Background` · `Color/Seed/Content` · `Size/Seed/Step` · `Size/Seed/Unit`:
giá trị gốc mà các token khác được tính ra từ đó. Không dùng trực tiếp trong thiết kế.

### Scale

- **Mức nhấn (màu):** `heavy` · `strong` · *(bỏ trống = gốc)* · `light` · `faded`
- **Cỡ:** `xxs` · `xs` · `sm` · `ms` · `base` · `md` · `lg` · `xl` · `xxl`
  (`ms` = giữa `sm` và `md`). Khi leaf chỉ có scale, bậc gốc ghi `base`.
- **Heading:** `heading-1` … `heading-5`

### State

`hover` · `active` · `selected` · `checked` · `focus` · `disabled`.
Trạng thái nghỉ **bỏ trống** — không bao giờ ghi `default` cho state.
Được ghép tối đa hai state: trạng thái bền (`selected`, `checked`) đứng trước,
trạng thái tương tác (`hover`, `active`, `focus`, `disabled`) đứng sau —
vd `item-selected-hover`.

### Variant (tầng component)

Trùng tên biến thể của component: `default` · `primary` · `danger` · `dashed` ·
`text` · `link` · `ghost` · `solid` · `dark` (giao diện tối riêng của một
component như Menu — **không phải** mode Dark).

### Element (tầng component)

Bộ phận của component: `item` · `cell` · `header` · `title` · `handle` · `icon` ·
`dot` · `track` · `rail` · `option` · `node` · `label` · `trigger` · `footer` ·
`bar` · `arrow` · `body` · `row` · `column` · `selector` · … (danh sách chốt
cùng bảng đổi tên).

### Category và property — kích thước và chữ

| Category | Property | Ví dụ |
|---|---|---|
| `size` | `scale` (thang chung) · `control` (chiều cao control) · `popup-arrow` · `seed` | `Size/Scale/MD` · `Size/Control/LG` |
| `space` | `padding` · `padding-inline` · `padding-block` · `margin` | `Space/Padding-Inline/Control-SM` |
| `radius` | *(không có)* | `Radius/LG` |
| `stroke` | `width` | `Stroke/Width/Focus` |
| `breakpoint` | *(không có)*, hậu tố `-min` / `-max` | `Breakpoint/MD-Max` |
| `typography` | `family` · `size` · `line-height` · `weight` | `Typography/Weight/Semibold` |

Ở tầng component, property kích thước dùng trực tiếp: `size` · `height` ·
`width` · `padding` · `padding-inline` · `padding-block` · `margin` · `gap` ·
`radius` · `border-width` · `font-size` · `font-weight` · `line-height` · `opacity`.

### Style (không phải variable)

- **Effect style — shadow:** `Shadow/{Scale}` theo thang mức nhấn: `Shadow/Light` (panel,
  khối cần tách nhẹ) · `Shadow/Base` (mọi bề mặt nổi: dropdown, popover, modal, drawer, thông
  báo). `Shadow/Strong` đã gộp vào `Shadow/Base` (2026-09-26, hai giá trị vốn giống hệt).
- **Text style:** `Text {Base|SM|LG}/{Regular|Medium|Semibold|Underline|Delete|Italic}`
  và `Heading/{1…5}`. Tên độ đậm trùng với `Typography/Weight/*`.

## 6. Quy tắc

1. **Một từ một ô.** `background`, `border`, `content` luôn là property;
   element chỉ là bộ phận của component.
2. **`default` chỉ là variant**, không bao giờ là state.
3. **Mỗi role dùng một thang scale.**
4. **Không mã hóa mode vào tên.** Light/Dark là mode. Hai ngoại lệ, đều là tầng
   không ai gắn trực tiếp: `Global/{Light|Dark}/…` (Global chỉ có một mode) và
   `Brand/{Light|Dark}/…` (collection Brand đã dùng mode cho brand).
5. **Không mã hóa giá trị vào tên** (không `space-2 = 8px`) — density Compact đổi giá trị.
6. **Tên phải duy nhất** trong toàn file.

## 7. Ví dụ

| Tên | Ý nghĩa |
|---|---|
| `Global/Light/Blue/6` | Giá trị gốc: bậc 6 dải xanh dương, phía Light |
| `Brand/Light/Primary-8` | Bậc 8 dải màu brand đang chọn, phía Light |
| `Color/Palette/Blue/6` | Bậc 6 dải xanh dương, tự đổi theo Light/Dark: tag, chart |
| `Color/Palette/Accent/6` | Bậc 6 dải màu brand, tự đổi theo brand và Light/Dark |
| `Color/Solid/Accent` | Màu brand chính: nút chính, checkbox đã chọn, focus |
| `Color/Solid/Accent-Hover` | Như trên, khi hover |
| `Color/Background/Accent-Faded` | Nền brand rất nhạt: item đang chọn, tag |
| `Color/Border/Accent-Light` | Viền brand nhạt |
| `Color/Border/Control` | Viền control (ô nhập, checkbox, radio, nút default), đạt 3:1 trên mọi nền; disabled dùng `Border/Neutral` |
| `Color/Content/Accent` | Chữ và icon màu brand |
| `Color/Content/Neutral-Strong` | Chữ chính |
| `Color/Content/Neutral` | Chữ phụ |
| `Color/Content/Neutral-Light` | Chữ mô tả, icon |
| `Color/Content/Neutral-Faded` | Chữ mờ nhất |
| `Color/Content/Disabled` | Chữ khi bị vô hiệu |
| `Color/Content/On-Solid` | Chữ đặt trên nền `solid` |
| `Color/Solid/Danger` | Màu lỗi chính |
| `Color/Background/Success-Faded` | Nền thành công rất nhạt |
| `Color/Outline/Danger` | Vòng focus khi lỗi |
| `Color/Background/Container` | Nền card, bảng, form |
| `Color/Background/Layout` | Nền trang |
| `Color/Background/Overlay` | Lớp phủ sau modal |
| `Color/Fill/Neutral` | Nền hover trung tính |
| `Space/Padding/SM` | Padding nhỏ |
| `Size/Control/LG` | Chiều cao control lớn |
| `Radius/Base` | Bo góc control |
| `Stroke/Width/Focus` | Độ dày vòng focus |
| `Breakpoint/MD-Max` | Cận trên màn hình md |
| `Typography/Size/Heading-1` | Cỡ chữ heading 1 |
| `Typography/Weight/Semibold` | Độ đậm tiêu đề |
| `Component/Button/Background-Default-Hover` | Nền nút default khi hover |
| `Component/Button/Content-Primary` | Chữ nút primary |
| `Component/Button/Padding-Inline-SM` | Padding ngang nút nhỏ |
| `Component/Menu/Item-Background-Selected` | Nền item menu đang chọn |
| `Component/Menu/Item-Background-Dark` | Nền item của menu giao diện tối |
| `Component/Input/Border-Active` | Viền input khi đang nhập |
| `Component/Switch/Handle-Size` | Kích thước núm switch |

# Quy ước dựng component fc

> Áp dụng cho mọi component trong `src/fc/components/`. Đọc cùng `AGENTS.md`, `CLAUDE.md`,
> `docs/token-naming-spec.md`. Tham khảo component có sẵn: `Button`, `Input` (`field.tsx`),
> `Tooltip`, `Tag`, `Switch`.

## Cấu trúc
- Một thư mục mỗi component: `src/fc/components/<Name>/<Name>.tsx` + `<Name>.module.css` + `<Name>.stories.tsx`.
- Không sửa `src/fc/index.ts`, `.storybook/*`, `tokens/*`, `src/fc/tokens.*`: báo lại export cần thêm.
- Không dùng `antd` / `@ant-design/*` (đã gỡ 2026-09-27; lint chặn).
- Icon: `import { … } from '../../../icons'` (Untitled UI, mặc định 16px). Nút chỉ có icon phải có `aria-label`.

## Hành vi
- Dựng trên `react-aria-components` 1.21.1 (đã có: Select, ComboBox, Menu, MenuTrigger, SubmenuTrigger, Popover, Dialog, DialogTrigger, Modal, ModalOverlay, Tabs, SelectionIndicator, Breadcrumbs, Link, Disclosure, DisclosureGroup, ListBox, GridList, Table, Tree, TagGroup, NumberField, Slider, ToggleButtonGroup, DatePicker, Calendar, TimeField, UNSTABLE_Toast*, FileTrigger, DropZone, Form…).
- Tên prop theo React Aria (`isDisabled`, `isOpen`, `onOpenChange`, `onAction`, `selectedKey`…). Cỡ: `size?: 'sm' | 'md' | 'lg'`.
- Nhãn mặc định hiển thị bằng **tiếng Việt**, luôn cho truyền đè qua prop. Chuỗi nội bộ của React Aria đã là tiếng Việt (`src/fc/i18n/vi-VN.ts`, FcTheme cài sẵn). Ngày tháng và số định dạng `vi-VN`.
- JSDoc ngắn trên component và prop, ghi rõ ứng với Figma set / property nào.

## Style
- CSS Modules, **chỉ dùng biến `--fc-*`**. Không hex, không `rgba()`, không px lẻ.
  - Ngoại lệ duy nhất: `1px` hairline viết bằng `var(--fc-stroke-width-base)`.
- **Token component trước:** giá trị riêng của component lấy từ `--fc-component-<name>-*`. Danh sách ở `src/fc/tokens.css`, khối `[data-brand], [data-mode], [data-density]`. Còn lại dùng token semantic:
  - Màu: `--fc-color-*`.
  - Khoảng cách: `--fc-space-*`.
  - Kích thước: `--fc-size-*`.
  - Bo góc: `--fc-radius-*`.
  - Chữ: `--fc-typography-*`.
  - Shadow: `--fc-shadow-base` / `--fc-shadow-light`.
- **Lớp nổi:** dùng `src/fc/overlay.module.css`.
  - `.surface`: nền Elevated, `Shadow/Base`, animation. Set `--_radius`, `--_padding`.
  - `.arrow`: mũi tên 16 × 8.
- **Danh sách lựa chọn:** dùng `src/fc/listItem.module.css`.
  - Lớp: `.list`, `.item`, `.danger`, `.icon`, `.label`, `.description`, `.extra`, `.check`, `.header`, `.separator`, `.empty`.
  - Set `--_item-height`, `--_item-padding-inline`, `--_item-radius`, `--_item-bg-hover`, `--_item-bg-selected`.
- Không sửa 2 module dùng chung trên; cần thêm thì báo lại.
- **Viền control** (ô nhập, checkbox, nút default): `--fc-color-border-control` (3:1). Disabled, card, bảng, divider: `--fc-color-border-neutral*`.
- **Vòng focus:** `outline: var(--fc-stroke-width-outline) solid var(--fc-color-solid-accent); outline-offset: 1px;` trên `[data-focus-visible]`.
- **Tương phản:** chữ 4.5:1, viền và icon trạng thái 3:1, ở cả Light và Dark. Chữ trên nền màu: `--fc-color-content-on-solid` (trên accent / danger / info) hoặc `--fc-color-content-on-solid-neutral` (trên dải palette).
- **Chỉ 2 độ đậm:** 400 và 600. Không dùng độ đậm để báo trạng thái (dùng màu, nền, dấu tick, gạch chân).
- **Bo góc:** control 6 (`--fc-radius-base`), bề mặt (card, modal, drawer, popover, dropdown) 8 (`--fc-radius-lg`), tag / tooltip 4 (`--fc-radius-sm`).
- Chỉ **một** hành động primary trên mỗi bề mặt.
- **Chuyển động:** có `@media (prefers-reduced-motion: reduce)` tắt animation.
- **Vùng tối cố định** (ví dụ Menu Dark): đặt `data-mode="dark"` trên phần tử gốc; token tự tính lại (token component khai báo trên mọi phần tử có `data-mode`). Không tự chế màu tối.

## Story
- `title: 'Components/<Name>'`, `component`, `args`, `argTypes`. Prop màu có tên (palette) dùng `control: 'select'`.
- Mỗi variant trong Figma có ít nhất một story. Danh sách variant: `docs/migration/figma-variant-inventory.md`. Use case cũ: `docs/migration/legacy-antd-stories-2026-09-26.zip`.
- JSDoc trên mỗi story ghi Figma set / property tương ứng.
- Nội dung ví dụ bằng tiếng Việt, ngữ cảnh nhà hàng / POS (FABi CMS).
- Lớp nổi: có story mở sẵn (`defaultOpen`) để xem không cần bấm, và story tương tác thật.
- Không gọi mạng (ảnh dùng SVG nội tuyến hoặc icon).

## Kiểm trước khi báo xong
- `npx tsc --noEmit -p tsconfig.app.json` (không dùng `-p .`: nó không kiểm gì).
- `npx oxlint src/fc`.
- `npm run build:tokens`: chốt chặn token không tồn tại và media query lệch breakpoint.
- Không chạy Storybook hay trình duyệt, không dùng git (người điều phối kiểm tra trình duyệt và axe).

## Báo lại
- File đã tạo.
- API (props chính).
- Export cần thêm vào `src/fc/index.ts`.
- Variant Figma đã phủ / chưa phủ (lý do).
- Quyết định lệch Figma hoặc CLAUDE.md.
- Việc còn mở.

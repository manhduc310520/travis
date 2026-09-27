import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Map01, Plus } from '../../../icons'
import { Button } from '../Button/Button'
import { Cascader, type CascaderOption, type CascaderValue } from './Cascader'

/** Provinces / cities → districts → wards (sample data, not exhaustive). */
const AREAS: CascaderOption[] = [
  {
    key: 'hn', label: 'Hà Nội', children: [
      { key: 'hoan-kiem', label: 'Hoàn Kiếm', children: [
        { key: 'trang-tien', label: 'Tràng Tiền' }, { key: 'hang-bac', label: 'Hàng Bạc' }, { key: 'hang-trong', label: 'Hàng Trống' },
      ] },
      { key: 'ba-dinh', label: 'Ba Đình', children: [
        { key: 'dien-bien', label: 'Điện Biên' }, { key: 'kim-ma', label: 'Kim Mã' }, { key: 'ngoc-ha', label: 'Ngọc Hà' },
      ] },
      { key: 'dong-da', label: 'Đống Đa', children: [
        { key: 'van-mieu', label: 'Văn Miếu' }, { key: 'lang-thuong', label: 'Láng Thượng' }, { key: 'o-cho-dua', label: 'Ô Chợ Dừa', isDisabled: true },
      ] },
      { key: 'cau-giay', label: 'Cầu Giấy', isDisabled: true, children: [{ key: 'dich-vong', label: 'Dịch Vọng' }] },
    ],
  },
  {
    key: 'hcm', label: 'TP. Hồ Chí Minh', children: [
      { key: 'q1', label: 'Quận 1', children: [
        { key: 'ben-nghe', label: 'Bến Nghé' }, { key: 'ben-thanh', label: 'Bến Thành' }, { key: 'da-kao', label: 'Đa Kao' },
      ] },
      { key: 'q3', label: 'Quận 3', children: [{ key: 'vo-thi-sau', label: 'Võ Thị Sáu' }, { key: 'p9', label: 'Phường 9' }] },
      { key: 'binh-thanh', label: 'Bình Thạnh', children: [{ key: 'p1', label: 'Phường 1' }, { key: 'p2', label: 'Phường 2' }] },
    ],
  },
  {
    key: 'dn', label: 'Đà Nẵng', children: [
      { key: 'hai-chau', label: 'Hải Châu', children: [{ key: 'thach-thang', label: 'Thạch Thang' }, { key: 'phuoc-ninh', label: 'Phước Ninh' }] },
      { key: 'son-tra', label: 'Sơn Trà', children: [{ key: 'an-hai-bac', label: 'An Hải Bắc' }, { key: 'man-thai', label: 'Mân Thái' }] },
    ],
  },
  { key: 'ct', label: 'Cần Thơ', isDisabled: true, children: [{ key: 'ninh-kieu', label: 'Ninh Kiều' }] },
]

/** Menu → category → dish: a branch can be a valid choice too (changeOnSelect). */
const MENU: CascaderOption[] = [
  {
    key: 'food', label: 'Đồ ăn', children: [
      { key: 'main', label: 'Món chính', children: [{ key: 'com-tam', label: 'Cơm tấm sườn' }, { key: 'pho-bo', label: 'Phở bò' }, { key: 'bun-cha', label: 'Bún chả' }] },
      { key: 'side', label: 'Món phụ', children: [{ key: 'nem', label: 'Nem rán' }, { key: 'goi-cuon', label: 'Gỏi cuốn' }] },
    ],
  },
  {
    key: 'drink', label: 'Đồ uống', children: [
      { key: 'coffee', label: 'Cà phê', children: [{ key: 'den-da', label: 'Cà phê đen đá' }, { key: 'bac-xiu', label: 'Bạc xỉu' }] },
      { key: 'tea', label: 'Trà', children: [{ key: 'tra-dao', label: 'Trà đào cam sả' }, { key: 'tra-sen', label: 'Trà sen vàng' }] },
    ],
  },
]

const OPEN_PATH = ['hn', 'hoan-kiem', 'trang-tien']

const meta = {
  title: 'Components/Cascader',
  component: Cascader,
  args: { label: 'Khu vực giao hàng', options: AREAS, placeholder: 'Chọn tỉnh / quận / phường', size: 'md', variant: 'outlined' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outlined', 'filled', 'borderless', 'underlined'] },
    status: { control: 'inline-radio', options: [undefined, 'error', 'warning'] },
    selectionMode: { control: 'inline-radio', options: ['single', 'multiple'] },
    placement: { control: 'select', options: ['bottom start', 'bottom end', 'top start', 'top end'] },
    expandTrigger: { control: 'inline-radio', options: ['click', 'hover'] },
    options: { control: false },
  },
  // Room for the open menu (180 high) under the field in the story frame.
  decorators: [(Story) => <div style={{ width: 320, minHeight: 300 }}><Story /></div>],
} satisfies Meta<typeof Cascader>
export default meta
type Story = StoryObj<typeof meta>

const column = { display: 'grid', gap: 'var(--fc-space-margin-base)', width: 320 } as const

export const Playground: Story = {}

/** Figma Cascader Active=Yes, Placement=Bottom Left: the chosen path is open, one column per level, the open branch tinted. */
export const Open: Story = { args: { defaultValue: OPEN_PATH, defaultOpen: true } }

/**
 * Figma Placement: Bottom Left / Bottom Right / Top Left / Top Right (`bottom start` / `bottom end` /
 * `top start` / `top end`). Change `placement` in Controls; the menu flips when there is no room.
 */
export const Placement: Story = {
  args: { defaultValue: OPEN_PATH, defaultOpen: true, placement: 'top end' },
  decorators: [(Story) => <div style={{ paddingTop: 220, paddingInlineStart: 240 }}><Story /></div>],
}

/** The four placements, closed: click a field to open its menu on that side. */
export const Placements: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 240px)', gap: 'var(--fc-space-margin-xl)', paddingBlock: 200, paddingInline: 240 }}>
      {(['top start', 'top end', 'bottom start', 'bottom end'] as const).map((p) => (
        <Cascader key={p} {...args} label={p} placement={p} defaultValue={OPEN_PATH} />
      ))}
    </div>
  ),
}

/** Field chrome shared with TextField / Select: Outlined, Filled, Borderless, Underlined. */
export const Variants: Story = {
  render: (args) => (
    <div style={column}>
      {(['outlined', 'filled', 'borderless', 'underlined'] as const).map((v) => (
        <Cascader key={v} {...args} variant={v} label={v} defaultValue={OPEN_PATH} />
      ))}
    </div>
  ),
}

/** Status: Error (announced as invalid) / Warning. */
export const Status: Story = {
  render: (args) => (
    <div style={column}>
      <Cascader {...args} status="error" errorMessage="Vui lòng chọn khu vực giao hàng" isRequired />
      <Cascader {...args} status="warning" defaultValue={['hcm', 'q1', 'ben-nghe']} description="Khu vực này đang quá tải đơn" />
    </div>
  ),
}

/** Figma Size: Small / Default / Large. */
export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      {(['sm', 'md', 'lg'] as const).map((s) => <Cascader key={s} {...args} size={s} label={`Cỡ ${s}`} defaultValue={OPEN_PATH} />)}
    </div>
  ),
}

/**
 * Figma menu item Type=Checkbox: tick a ward, a district or a whole city; a partly ticked
 * branch shows a dash. Clicking a branch's name opens it, its box ticks it. A fully ticked
 * branch becomes one tag.
 */
export const Multiple: Story = {
  args: {
    label: 'Khu vực áp dụng khuyến mãi',
    selectionMode: 'multiple',
    defaultValue: [['hn', 'hoan-kiem'], ['hn', 'ba-dinh', 'kim-ma'], ['dn']],
    allowClear: true,
    defaultOpen: true,
  },
}

/** Multiple in the three sizes, with `maxTagCount` collapsing extra tags into "+N". */
export const MultipleSizes: Story = {
  render: (args) => (
    <div style={column}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Cascader
          key={s}
          {...args}
          size={s}
          label={`Cỡ ${s}`}
          selectionMode="multiple"
          maxTagCount={2}
          defaultValue={[['hn', 'hoan-kiem'], ['hcm', 'q1'], ['dn', 'son-tra'], ['hcm', 'q3', 'p9']]}
        />
      ))}
    </div>
  ),
}

/** `expandTrigger="hover"`: columns open as the pointer moves; click still chooses. */
export const ExpandOnHover: Story = { args: { expandTrigger: 'hover' } }

/** `changeOnSelect`: a branch is a valid choice (a whole category), not only a leaf. */
export const ChangeOnSelect: Story = {
  args: { label: 'Nhóm món', options: MENU, changeOnSelect: true, placeholder: 'Chọn nhóm hoặc món', defaultValue: ['drink', 'coffee'] },
}

/** `showSearch`: type part of any level — "hoan kiem" finds "Hà Nội / Hoàn Kiếm / …" (accents ignored). */
export const Search: Story = { args: { showSearch: true, allowClear: true } }

/** Search in multiple mode: tick results straight from the list. */
export const SearchMultiple: Story = { args: { showSearch: true, selectionMode: 'multiple', label: 'Khu vực áp dụng' } }

/** Figma menu item State=Disabled ("Cầu Giấy", "Cần Thơ", "Ô Chợ Dừa") and a disabled field. */
export const Disabled: Story = {
  render: (args) => (
    <div style={column}>
      <Cascader {...args} label="Có mục vô hiệu" defaultValue={['hn', 'dong-da', 'van-mieu']} />
      <Cascader {...args} label="Vô hiệu" isDisabled defaultValue={OPEN_PATH} />
      <Cascader {...args} label="Vô hiệu (nhiều)" isDisabled selectionMode="multiple" defaultValue={[['hn', 'hoan-kiem'], ['dn']]} />
    </div>
  ),
}

/** `displayRender`: custom text for the chosen path — here the ward first, then its district and city. */
export const CustomDisplay: Story = {
  args: {
    defaultValue: OPEN_PATH,
    prefix: <Map01 />,
    displayRender: (labels, nodes) => (
      <>
        {labels[labels.length - 1]}
        <span style={{ color: 'var(--fc-color-content-description)' }}>
          {' · '}{nodes.slice(0, -1).reverse().map((n) => n.textValue ?? String(n.label)).join(', ')}
        </span>
      </>
    ),
  },
}

/** Figma Cascader Menu "Footer": content under the columns — here a secondary action. */
export const WithFooter: Story = {
  args: {
    defaultOpen: true,
    defaultValue: OPEN_PATH,
    footer: <Button variant="text" size="sm" iconStart={<Plus />}>Thêm khu vực mới</Button>,
  },
}

/** Controlled value, shown under the field. */
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<CascaderValue>(['hcm', 'q1', 'ben-thanh'])
    return (
      <div style={column}>
        <Cascader {...args} value={value} onChange={setValue} allowClear />
        <code style={{ fontSize: 'var(--fc-typography-size-sm)' }}>{JSON.stringify(value)}</code>
      </div>
    )
  },
}

/** Nothing to choose (Empty, size SM). */
export const EmptyMenu: Story = { args: { options: [], defaultOpen: true, label: 'Khu vực' } }

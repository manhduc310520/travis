import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Selection } from 'react-aria-components'
import { ChevronDown, Copy01, DotsHorizontal, Edit01, Eye, Printer, Receipt, Send01, Trash01 } from '../../../icons'
import { Button } from '../Button/Button'
import { Dropdown, DropdownButton, type DropdownItem, type DropdownPlacement } from './Dropdown'

const ORDER_ACTIONS: DropdownItem[] = [
  { key: 'view', label: 'Xem chi tiết', icon: <Eye /> },
  { key: 'edit', label: 'Sửa đơn', icon: <Edit01 />, extra: 'Ctrl E' },
  { key: 'copy', label: 'Nhân bản', icon: <Copy01 /> },
  { type: 'divider', key: 'd1' },
  {
    key: 'print',
    label: 'In',
    icon: <Printer />,
    children: [
      { key: 'print-receipt', label: 'Hóa đơn bán lẻ' },
      { key: 'print-vat', label: 'Hóa đơn VAT' },
      { key: 'print-kitchen', label: 'Phiếu bếp' },
    ],
  },
  { key: 'send', label: 'Gửi cho bếp', icon: <Send01 />, isDisabled: true },
  { type: 'divider', key: 'd2' },
  { key: 'delete', label: 'Xóa đơn', icon: <Trash01 />, danger: true },
]

const meta = {
  title: 'Components/Navigation/Dropdown',
  component: Dropdown,
  args: {
    items: ORDER_ACTIONS,
    placement: 'bottom start',
    showArrow: false,
    'aria-label': 'Thao tác với đơn hàng',
    children: <Button iconEnd={<ChevronDown />}>Thao tác</Button>,
  },
  argTypes: {
    placement: { control: 'select', options: ['bottom start', 'bottom', 'bottom end', 'top start', 'top', 'top end'] },
    items: { control: false },
    children: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dropdown>
export default meta
type Story = StoryObj<typeof meta>

/** Figma Type "Button Basic". Opens on press, not hover, so it works with keyboard and touch. */
export const Playground: Story = {}

/** Open on first render: icons, extra (shortcut), divider, submenu, disabled and danger items. */
export const Open: Story = { args: { defaultOpen: true } }

/** Figma Type "Basic Inline": a text trigger inside content. */
export const BasicInline: Story = {
  args: { children: <Button variant="link" iconEnd={<ChevronDown />}>Bàn 12</Button>, defaultOpen: true },
}

/** Icon-only trigger, e.g. the "…" at the end of a table row. */
export const IconTrigger: Story = {
  args: { children: <Button variant="text" aria-label="Thao tác" iconStart={<DotsHorizontal />} />, placement: 'bottom end', defaultOpen: true },
}

/** Figma item states: Default, Selected (check + tint), Disabled, Danger; icons and two-line items. */
export const ItemStates: Story = {
  args: {
    defaultOpen: true,
    selectionMode: 'single',
    defaultSelectedKeys: ['table'],
    'aria-label': 'Hiển thị',
    items: [
      { key: 'table', label: 'Bảng', description: 'Mỗi đơn một dòng' },
      { key: 'cards', label: 'Thẻ', description: 'Ảnh món và tổng tiền' },
      { key: 'kanban', label: 'Theo trạng thái', description: 'Chờ · Đang làm · Xong', isDisabled: true },
    ],
    children: <Button iconEnd={<ChevronDown />}>Hiển thị</Button>,
  },
}

function MultiSelectDemo() {
  const [keys, setKeys] = useState<Selection>(new Set(['dine-in', 'takeaway']))
  const count = keys === 'all' ? 3 : keys.size
  return (
    <Dropdown
      aria-label="Lọc kênh bán"
      selectionMode="multiple"
      selectedKeys={keys}
      onSelectionChange={setKeys}
      items={[
        { key: 'dine-in', label: 'Tại quán' },
        { key: 'takeaway', label: 'Mang về' },
        { key: 'delivery', label: 'Giao hàng' },
      ]}
    >
      <Button iconEnd={<ChevronDown />}>Kênh bán ({count})</Button>
    </Dropdown>
  )
}

/** Multiple selection stays open while toggling. */
export const MultipleSelection: Story = { render: () => <MultiSelectDemo /> }

/** Figma "Submenu?": groups with titles, dividers and a nested menu. */
export const GroupsAndSubmenu: Story = {
  args: {
    defaultOpen: true,
    'aria-label': 'Xuất báo cáo',
    items: [
      {
        type: 'group',
        key: 'sales',
        label: 'Doanh thu',
        children: [
          { key: 'day', label: 'Theo ngày' },
          { key: 'month', label: 'Theo tháng' },
        ],
      },
      {
        type: 'group',
        key: 'stock',
        label: 'Kho',
        children: [
          { key: 'in', label: 'Nhập kho' },
          { key: 'export', label: 'Xuất ra', icon: <Receipt />, children: [{ key: 'xlsx', label: 'Excel (.xlsx)' }, { key: 'pdf', label: 'PDF' }] },
        ],
      },
    ],
    children: <Button iconEnd={<ChevronDown />}>Báo cáo</Button>,
  },
}

/** Figma Arrow=Yes. */
export const WithArrow: Story = { args: { showArrow: true, placement: 'bottom', defaultOpen: true } }

/** Figma "Button?" row: the menu sits in a dialog so Tab reaches the footer. */
export const WithFooter: Story = {
  args: {
    defaultOpen: true,
    selectionMode: 'multiple',
    defaultSelectedKeys: ['pho'],
    'aria-label': 'Chọn món',
    items: [
      { key: 'pho', label: 'Phở bò' },
      { key: 'bun', label: 'Bún chả' },
      { key: 'com', label: 'Cơm tấm' },
    ],
    footer: <Button size="sm" variant="primary">Áp dụng</Button>,
    children: <Button iconEnd={<ChevronDown />}>Món ăn</Button>,
  },
}

const PLACEMENTS: DropdownPlacement[] = ['bottom start', 'bottom', 'bottom end', 'top start', 'top', 'top end']

/** Figma Placement: the six positions. A menu takes focus, so open one at a time. */
export const Placements: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, max-content)', gap: 'var(--fc-space-margin-xxl)', justifyContent: 'center', padding: 'calc(var(--fc-space-padding-xl) * 4) 0' }}>
      {PLACEMENTS.map((p) => (
        <Dropdown key={p} placement={p} items={ORDER_ACTIONS.slice(0, 3)} aria-label={p}>
          <Button iconEnd={<ChevronDown />}>{p}</Button>
        </Dropdown>
      ))}
    </div>
  ),
}

/** Figma "Button Twofold": main action + arrow for the rest. */
export const SplitButton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--fc-space-margin-base)' }}>
      <DropdownButton items={ORDER_ACTIONS.slice(0, 3)} aria-label="Thao tác khác">Lưu nháp</DropdownButton>
      <DropdownButton variant="primary" items={ORDER_ACTIONS.slice(0, 3)} aria-label="Thao tác khác" iconStart={<Send01 />}>Gửi bếp</DropdownButton>
      <DropdownButton size="sm" items={ORDER_ACTIONS.slice(0, 3)} aria-label="Thao tác khác">Nhỏ</DropdownButton>
    </div>
  ),
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState, type ReactNode } from 'react'
import type { Key } from 'react-aria-components'
import { BookOpen01, Home01, Receipt, Settings01, ShoppingCart01, Users01 } from '../../../icons'
import { Badge } from '../Badge/Badge'
import { Button } from '../Button/Button'
import { Tabs, type TabsItem, type TabsSize } from './Tabs'

const panel = (text: string) => <p style={{ margin: 0 }}>{text}</p>

const items: TabsItem[] = [
  { key: 'info', label: 'Thông tin chung', content: panel('Tên, địa chỉ và giờ mở cửa của nhà hàng.') },
  { key: 'menu', label: 'Thực đơn', content: panel('Danh sách món, nhóm món và giá bán.') },
  { key: 'promo', label: 'Khuyến mãi', content: panel('Chương trình giảm giá đang áp dụng.') },
  { key: 'staff', label: 'Nhân viên', content: panel('Tài khoản thu ngân và phục vụ.'), isDisabled: true },
]

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  args: { items, variant: 'line', placement: 'top', size: 'md', defaultSelectedKey: 'info', 'aria-label': 'Cài đặt nhà hàng' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['line', 'card', 'editable-card'] },
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    items: { control: false },
    extra: { control: false },
  },
} satisfies Meta<typeof Tabs>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-xl)' } as const
const caption = {
  marginBottom: 'var(--fc-space-margin-xxs)',
  color: 'var(--fc-color-content-description)',
  fontSize: 'var(--fc-typography-size-sm)',
  lineHeight: 'var(--fc-typography-line-height-sm)',
} as const

function Captioned({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={caption}>{label}</div>
      {children}
    </div>
  )
}

const SIZES: [TabsSize, string][] = [['sm', 'Small'], ['md', 'Default'], ['lg', 'Large']]

export const Playground: Story = {}

/** Figma `Tabs / Basic` Placement=Top, Size=Default. "Nhân viên" (Staff) is a disabled tab. */
export const Line: Story = {}

/** Figma `Tabs / Basic` Placement: Top, Bottom, Left, Right. Left / Right use Up / Down arrows. */
export const Placements: Story = {
  render: (args) => (
    <div style={{ ...stack, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <Captioned key={p} label={`Placement=${p}`}>
          <Tabs {...args} placement={p} aria-label={`Cài đặt nhà hàng (${p})`} />
        </Captioned>
      ))}
    </div>
  ),
}

/** Figma `Tabs / Basic` Size: Small, Default, Large. */
export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      {SIZES.map(([size, label]) => (
        <Captioned key={size} label={`Size=${label}`}>
          <Tabs {...args} size={size} aria-label={`Cài đặt nhà hàng (${label})`} />
        </Captioned>
      ))}
    </div>
  ),
}

/** Figma `Tabs / Card`, Size=Default. */
export const Card: Story = { args: { variant: 'card' } }

/** Figma `Tabs / Card` Size: Small, Default, Large. */
export const CardSizes: Story = {
  render: (args) => (
    <div style={stack}>
      {SIZES.map(([size, label]) => (
        <Captioned key={size} label={`Size=${label}`}>
          <Tabs {...args} variant="card" size={size} aria-label={`Cài đặt nhà hàng (${label})`} />
        </Captioned>
      ))}
    </div>
  ),
}

/** Card tabs on the other three sides — same component, placement applies to every variant. */
export const CardPlacements: Story = {
  render: (args) => (
    <div style={{ ...stack, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <Captioned key={p} label={`Placement=${p}`}>
          <Tabs {...args} variant="card" placement={p} aria-label={`Cài đặt nhà hàng (${p})`} />
        </Captioned>
      ))}
    </div>
  ),
}

/**
 * One editable strip (Figma `Tabs / Container`): "+" appends an order tab,
 * × or Delete on a focused tab closes it. "Bàn 1" (Table 1) is not closable,
 * so both `Closeable?` states show.
 */
function EditableDemo({ size }: { size: TabsSize }) {
  const [tabs, setTabs] = useState<TabsItem[]>([
    { key: 't1', label: 'Bàn 1', closable: false, content: panel('Đơn của bàn 1: 2 phở bò, 1 trà đá.') },
    { key: 't2', label: 'Bàn 2', content: panel('Đơn của bàn 2: 1 cơm tấm sườn.') },
    { key: 't3', label: 'Mang đi #12', content: panel('Đơn mang đi #12: 3 bánh mì.') },
  ])
  const [selected, setSelected] = useState<Key>('t1')
  const next = useRef(4)

  const add = () => {
    const key = `t${next.current}`
    setTabs((t) => [...t, { key, label: `Bàn ${next.current}`, content: panel(`Đơn mới của bàn ${next.current}.`) }])
    next.current += 1
    setSelected(key)
  }
  const close = (key: Key) => {
    const index = tabs.findIndex((t) => t.key === key)
    const remaining = tabs.filter((t) => t.key !== key)
    setTabs(remaining)
    // The neighbour that slides into its place (or the new last tab) takes over.
    if (key === selected && remaining.length > 0) setSelected(remaining[Math.min(index, remaining.length - 1)].key)
  }

  return (
    <Tabs
      variant="editable-card"
      size={size}
      items={tabs}
      selectedKey={selected}
      onSelectionChange={setSelected}
      onAdd={add}
      onClose={close}
      aria-label={`Đơn đang mở (${size})`}
    />
  )
}

/** Figma `Tabs / Container` Size: Small, Default, Large — add button and closable tabs. */
export const EditableCard: Story = {
  render: () => (
    <div style={stack}>
      {SIZES.map(([size, label]) => (
        <Captioned key={size} label={`Size=${label}`}>
          <EditableDemo size={size} />
        </Captioned>
      ))}
    </div>
  ),
}

/** Figma tab item `Icon?` and `Badge?` (fc `Badge`, small). The badge's number is part of the tab's name. */
export const WithIconAndBadge: Story = {
  args: {
    defaultSelectedKey: 'overview',
    items: [
      { key: 'overview', icon: <Home01 />, label: 'Tổng quan', content: panel('Doanh thu hôm nay và số đơn.') },
      { key: 'orders', icon: <ShoppingCart01 />, label: 'Đơn mới', badge: <Badge count={5} size="sm" />, content: panel('5 đơn đang chờ xác nhận.') },
      { key: 'menu', icon: <BookOpen01 />, label: 'Thực đơn', content: panel('48 món đang bán.') },
      { key: 'settings', icon: <Settings01 />, 'aria-label': 'Cài đặt', content: panel('Cài đặt chung.') },
    ],
  },
}

/** Optional `extra` slot at the end of the bar (a default button — the page's primary action lives elsewhere). */
export const WithExtra: Story = {
  args: {
    extra: <Button size="sm" iconStart={<Receipt />}>Xuất báo cáo</Button>,
    items: [
      { key: 'day', label: 'Hôm nay', content: panel('Báo cáo doanh thu hôm nay.') },
      { key: 'week', label: 'Tuần này', content: panel('Báo cáo doanh thu tuần này.') },
      { key: 'month', label: 'Tháng này', content: panel('Báo cáo doanh thu tháng này.') },
    ],
    defaultSelectedKey: 'day',
  },
}

/** The whole tab set disabled (`isDisabled`). */
export const Disabled: Story = {
  args: {
    isDisabled: true,
    items: [
      { key: 'a', icon: <Users01 />, label: 'Nhân viên', content: panel('Chỉ quản lý được sửa.') },
      { key: 'b', label: 'Ca làm việc', content: panel('Lịch ca tuần này.') },
    ],
    defaultSelectedKey: 'a',
  },
}

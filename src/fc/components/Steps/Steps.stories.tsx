import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { CheckCircle, CreditCard01, Receipt, Truck01 } from '../../../icons'
import { Steps, type StepItem } from './Steps'

// Figma Time? = `subTitle`; Description? = `description`.
const orderSteps: StepItem[] = [
  { title: 'Tiếp nhận đơn', description: 'Thu ngân xác nhận đơn.' },
  { title: 'Chế biến', subTitle: '00:08:12', description: 'Bếp đang làm món.' },
  { title: 'Giao món', description: 'Phục vụ mang ra bàn.' },
]

const setupSteps: StepItem[] = [
  { title: 'Thông tin cửa hàng', description: 'Tên, địa chỉ, giờ mở cửa.' },
  { title: 'Thực đơn', description: 'Nhóm món và giá bán.' },
  { title: 'Thanh toán', description: 'Tiền mặt, thẻ, ví điện tử.' },
  { title: 'Kích hoạt', description: 'Mở bán trên POS.' },
]

const meta = {
  title: 'Components/Steps',
  component: Steps,
  args: { items: orderSteps, current: 1, type: 'default', orientation: 'horizontal', size: 'md', labelPlacement: 'horizontal', variant: 'filled' },
  argTypes: {
    current: { control: { type: 'number', min: 0, max: 3 } },
    status: { control: 'select', options: [undefined, 'wait', 'process', 'finish', 'error'] },
    type: { control: 'select', options: ['default', 'dot', 'navigation', 'inline', 'panel'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    labelPlacement: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    variant: { control: 'inline-radio', options: ['filled', 'outlined'] },
    percent: { control: { type: 'range', min: 0, max: 100 } },
    items: { control: false },
    labels: { control: false },
    onChange: { control: false },
  },
} satisfies Meta<typeof Steps>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-xl)' } as const

export const Playground: Story = {}

/** Figma "Steps" Type=Basic, Size=Medium, Direction=Horizontal; item Status Finish → Process → Wait follows `current`, Time? shown on step 2. */
export const Basic: Story = {}

/** Figma Size=Small, Direction=Horizontal. */
export const Small: Story = { args: { size: 'sm' } }

/** Figma item Status=Error, set on the current step with `status`. */
export const WithError: Story = { args: { status: 'error', items: setupSteps, current: 2 } }

/** Figma "Steps Item / Horizontal" Center=Yes: icon on the line, text centred below. */
export const LabelVertical: Story = { args: { labelPlacement: 'vertical', items: setupSteps, current: 1 } }

/** Figma Type=Basic, Direction=Vertical (Size Medium and Small). */
export const Vertical: Story = {
  render: (args) => (
    <div style={{ ...stack, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
      <Steps {...args} orientation="vertical" items={setupSteps} aria-label="Thiết lập cửa hàng" />
      <Steps {...args} orientation="vertical" size="sm" items={setupSteps} aria-label="Thiết lập cửa hàng (nhỏ)" />
    </div>
  ),
}

/** Figma Type=Custom Icon: each item's `icon` replaces the numbered circle. */
export const CustomIcon: Story = {
  args: {
    current: 2,
    items: [
      { title: 'Đặt món', icon: <Receipt /> },
      { title: 'Thanh toán', icon: <CreditCard01 /> },
      { title: 'Giao hàng', icon: <Truck01 /> },
      { title: 'Hoàn tất', icon: <CheckCircle /> },
    ],
  },
}

/** Figma Type=Dot, Direction=Horizontal ("Steps Item / Dot Horizontal", Order First / Center / Last). */
export const Dot: Story = { args: { type: 'dot', items: setupSteps } }

/** Figma Type=Dot, Direction=Vertical. */
export const DotVertical: Story = { args: { type: 'dot', orientation: 'vertical', items: setupSteps } }

/** Figma Progress Icon State=Progress: a ring around the current step shows how far it has got. */
export const WithProgress: Story = { args: { percent: 60 } }

function ClickableDemo(args: Story['args']) {
  const [current, setCurrent] = useState(1)
  return (
    <Steps
      {...args}
      items={setupSteps.map((s, i) => (i === 3 ? { ...s, isDisabled: true } : s))}
      current={current}
      onChange={setCurrent}
      aria-label="Thiết lập cửa hàng"
    />
  )
}

/** Figma State=Hover: with `onChange` each step is a button (hover, focus ring, disabled). "Kích hoạt" is disabled. */
export const Clickable: Story = { render: (args) => <ClickableDemo {...args} /> }

function NavigationDemo({ size }: { size: 'sm' | 'md' }) {
  const [current, setCurrent] = useState(0)
  return (
    <Steps
      type="navigation"
      size={size}
      current={current}
      onChange={setCurrent}
      aria-label="Tạo chương trình khuyến mãi"
      items={[
        { title: 'Điều kiện', subTitle: '00:00:05', description: 'Chi nhánh, thời gian.' },
        { title: 'Ưu đãi', subTitle: '00:01:02', description: 'Giảm giá, tặng món.' },
        { title: 'Xác nhận', description: 'Xem lại và kích hoạt.' },
      ]}
    />
  )
}

/** Figma Type=Navigation, Size=Medium: clickable, the current step is underlined. */
export const Navigation: Story = { render: () => <NavigationDemo size="md" /> }

/** Figma Type=Navigation, Size=Small. */
export const NavigationSmall: Story = { render: () => <NavigationDemo size="sm" /> }

/**
 * Figma Type=Inline ("Steps Item / Inline Step"): a compact strip inside a
 * list row. Descriptions are read by screen readers only.
 */
export const Inline: Story = {
  render: () => {
    const rows = [
      { order: 'Đơn #1024 · Bàn 5', current: 0 },
      { order: 'Đơn #1025 · Mang về', current: 1, status: 'error' as const },
      { order: 'Đơn #1026 · Bàn 12', current: 2 },
    ]
    const items: StepItem[] = [
      { title: 'Nhận', description: 'Đã nhận đơn.' },
      { title: 'Bếp', description: 'Đang chế biến.' },
      { title: 'Giao', description: 'Mang ra bàn.' },
      { title: 'Xong', description: 'Đã thanh toán.' },
    ]
    return (
      <div style={{ display: 'grid', maxWidth: 480 }}>
        {rows.map((r) => (
          <div
            key={r.order}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--fc-space-padding-sm) 0',
              borderBottom: 'var(--fc-stroke-width-base) solid var(--fc-color-border-neutral-light)',
            }}
          >
            <span>{r.order}</span>
            <Steps type="inline" current={r.current} status={r.status} items={items} aria-label={`Tiến trình ${r.order}`} />
          </div>
        ))}
      </div>
    )
  },
}

function PanelDemo() {
  const [current, setCurrent] = useState(0)
  const items: StepItem[] = [
    { title: 'Bước 1', subTitle: '00:00', description: 'Chọn chi nhánh.' },
    { title: 'Bước 2', description: 'Nhập tồn kho.', status: 'error' },
    { title: 'Bước 3', description: 'Đối soát.' },
  ]
  return (
    <div style={stack}>
      <Steps type="panel" current={current} onChange={setCurrent} items={items} aria-label="Kiểm kho (Type 1)" />
      <Steps type="panel" variant="outlined" size="sm" current={current} onChange={setCurrent} items={items} aria-label="Kiểm kho (Type 2)" />
    </div>
  )
}

/**
 * Figma "Panel Steps" Type=1 (`filled`) and Type=2 (`outlined`, small).
 * Step states Default / Hover / Active: click a step to make it current.
 */
export const Panel: Story = { render: () => <PanelDemo /> }

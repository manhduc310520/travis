import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bell01, ShoppingCart01 } from '../../../icons'
import { Button } from '../Button/Button'
import { Badge, Ribbon, StatusBadge } from './Badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { count: 5, overflowCount: 99, showZero: false, dot: false, size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
  render: (args) => (
    <Badge {...args}>
      <Button aria-label="Thông báo" iconStart={<Bell01 />} />
    </Badge>
  ),
} satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 'var(--fc-space-margin-lg)', alignItems: 'center', flexWrap: 'wrap' } as const

export const Playground: Story = {}

export const Counts: Story = {
  render: () => (
    <div style={row}>
      <Badge count={3} label="3 thông báo mới"><Button aria-label="Thông báo" iconStart={<Bell01 />} /></Badge>
      <Badge count={42} label="42 đơn chờ xử lý"><Button aria-label="Đơn hàng" iconStart={<ShoppingCart01 />} /></Badge>
      <Badge count={128} label="Hơn 99 đơn chờ"><Button aria-label="Đơn hàng" iconStart={<ShoppingCart01 />} /></Badge>
      <Badge count={0} showZero label="Không có thông báo"><Button aria-label="Thông báo" iconStart={<Bell01 />} /></Badge>
      <Badge count={7} size="sm" label="7 tin nhắn"><Button aria-label="Tin nhắn" iconStart={<Bell01 />} /></Badge>
    </div>
  ),
}

export const Dot: Story = {
  render: () => (
    <div style={row}>
      <Badge dot label="Có thông báo mới"><Button aria-label="Thông báo" iconStart={<Bell01 />} /></Badge>
    </div>
  ),
}

export const Standalone: Story = {
  render: () => (
    <div style={row}>
      <Badge count={12} label="12 đơn mới" />
      <Badge count={1200} overflowCount={999} label="Hơn 999 đơn" />
      <Badge count={4} size="sm" />
    </div>
  ),
}

export const Status: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-xs)' }}>
      <StatusBadge status="success">Đang mở cửa</StatusBadge>
      <StatusBadge status="processing">Đang đồng bộ thực đơn</StatusBadge>
      <StatusBadge status="warning">Sắp hết nguyên liệu</StatusBadge>
      <StatusBadge status="error">Mất kết nối máy in</StatusBadge>
      <StatusBadge status="default">Tạm ngừng</StatusBadge>
    </div>
  ),
}

/** Figma Status Label=false: the dot alone, named for assistive tech. */
export const StatusDotOnly: Story = {
  render: () => (
    <div style={row}>
      <StatusBadge status="success" aria-label="Đang mở cửa" />
      <StatusBadge status="processing" aria-label="Đang đồng bộ" />
      <StatusBadge status="warning" aria-label="Sắp hết nguyên liệu" />
      <StatusBadge status="error" aria-label="Mất kết nối" />
      <StatusBadge status="default" aria-label="Tạm ngừng" />
    </div>
  ),
}

const card = {
  width: 220,
  padding: 'var(--fc-space-padding-lg)',
  border: 'var(--fc-stroke-width-base) solid var(--fc-color-border-neutral-light)',
  borderRadius: 'var(--fc-radius-lg)',
  background: 'var(--fc-color-background-container)',
} as const

/** Figma "Badge / Ribbon": default (brand) and the seven Figma colours, start and end. */
export const Ribbons: Story = {
  render: () => (
    <div style={{ ...row, gap: 'var(--fc-space-margin-xl)', alignItems: 'flex-start' }}>
      <Ribbon text="Bán chạy"><div style={card}>Phở bò tái — 55.000đ</div></Ribbon>
      {(['vermilion', 'blue', 'magenta', 'red', 'cyan', 'green', 'purple'] as const).map((c) => (
        <Ribbon key={c} text={c} color={c}><div style={card}>Món mới trong tuần</div></Ribbon>
      ))}
      <Ribbon text="Đầu thẻ" placement="start"><div style={card}>Ribbon đặt phía đầu</div></Ribbon>
    </div>
  ),
}

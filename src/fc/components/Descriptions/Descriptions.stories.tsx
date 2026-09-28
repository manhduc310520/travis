import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Edit01 } from '../../../icons'
import { StatusBadge } from '../Badge/Badge'
import { Button } from '../Button/Button'
import { Tag } from '../Tag/Tag'
import { Descriptions, type DescriptionsItem, type DescriptionsSize } from './Descriptions'

const restaurant: DescriptionsItem[] = [
  { key: 'name', label: 'Tên nhà hàng', content: 'Phở Hà Nội – Quận 1' },
  { key: 'phone', label: 'Điện thoại', content: '028 3822 1234' },
  { key: 'hours', label: 'Giờ mở cửa', content: '07:00 – 22:00' },
  { key: 'manager', label: 'Quản lý', content: 'Nguyễn Thị Lan' },
  { key: 'address', label: 'Địa chỉ', content: '12 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', span: 2 },
]

/** Figma bordered example: plain cells, one status cell (Figma Variant=Status), money in vi-VN format. */
const order: DescriptionsItem[] = [
  { key: 'code', label: 'Mã đơn', content: 'HD-2026-00931' },
  { key: 'table', label: 'Bàn', content: 'Bàn 12 · Tầng 2' },
  { key: 'cashier', label: 'Thu ngân', content: 'Trần Minh Khoa' },
  { key: 'opened', label: 'Giờ vào', content: '26/09/2026 18:05' },
  { key: 'closed', label: 'Giờ thanh toán', content: '26/09/2026 19:42', span: 2 },
  { key: 'status', label: 'Trạng thái', content: <StatusBadge status="success">Đã thanh toán</StatusBadge>, span: 3 },
  { key: 'subtotal', label: 'Tạm tính', content: '1.250.000 ₫' },
  { key: 'discount', label: 'Giảm giá', content: '125.000 ₫' },
  { key: 'total', label: 'Thành tiền', content: '1.125.000 ₫' },
]

const meta = {
  title: 'Components/Data Display/Descriptions',
  component: Descriptions,
  args: {
    title: 'Thông tin nhà hàng',
    items: restaurant,
    bordered: false,
    layout: 'horizontal',
    column: 3,
    size: 'lg',
    colon: true,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    layout: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    column: { control: { type: 'number', min: 1, max: 6 } },
    titleLevel: { control: 'select', options: [2, 3, 4, 5, 6] },
    items: { control: false },
    extra: { control: false },
  },
} satisfies Meta<typeof Descriptions>
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

const SIZES: [DescriptionsSize, string][] = [['lg', 'Large'], ['md', 'Medium'], ['sm', 'Small']]

/** Figma `Descriptions / Basic`: title, 3 columns, "Label: value"; the address spans 2 columns. */
export const Basic: Story = {}

/** Figma `Descriptions` (bordered), Size=Large. Status cell = Figma `Descriptions Item / Border` Variant=Status. */
export const Bordered: Story = {
  args: { title: 'Chi tiết hoá đơn', items: order, bordered: true },
}

/** Figma `Descriptions` Size: Large / Medium / Small, bordered. */
export const BorderedSizes: Story = {
  render: (args) => (
    <div style={stack}>
      {SIZES.map(([size, label]) => (
        <Captioned key={size} label={`Size=${label}`}>
          <Descriptions {...args} title="Chi tiết hoá đơn" items={order} bordered size={size} />
        </Captioned>
      ))}
    </div>
  ),
}

/** Label above value (`layout="vertical"`), basic and bordered; 2 columns. */
export const Vertical: Story = {
  render: (args) => (
    <div style={stack}>
      <Captioned label="Vertical">
        <Descriptions {...args} layout="vertical" column={2} />
      </Captioned>
      <Captioned label="Vertical, bordered, Size=Medium">
        <Descriptions {...args} title="Chi tiết hoá đơn" items={order} layout="vertical" bordered size="md" column={3} />
      </Captioned>
    </div>
  ),
}

/** Column count 1 / 2 / 4 — the last item of each row stretches so no row has a hole. */
export const Columns: Story = {
  render: (args) => (
    <div style={stack}>
      {[1, 2, 4].map((column) => (
        <Captioned key={column} label={`column=${column}`}>
          <Descriptions {...args} title={undefined} items={order.slice(0, 5)} bordered size="sm" column={column} />
        </Captioned>
      ))}
    </div>
  ),
}

/** Title with an extra action at the end of the row (one default button — not primary). */
export const TitleAndExtra: Story = {
  args: {
    extra: <Button size="sm" iconStart={<Edit01 />}>Sửa</Button>,
    items: [
      ...restaurant.slice(0, 4),
      { key: 'status', label: 'Trạng thái', content: <StatusBadge status="processing">Đang phục vụ</StatusBadge> },
      { key: 'type', label: 'Loại hình', content: <Tag>Nhà hàng</Tag> },
    ],
  },
}

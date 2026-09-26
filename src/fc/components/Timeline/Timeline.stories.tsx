import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Clock, CreditCard01, Receipt } from '../../../icons'
import { PALETTE_HUES } from '../../palette'
import { Button } from '../Button/Button'
import { Timeline, type TimelineItem } from './Timeline'

const orderHistory: TimelineItem[] = [
  { content: 'Tạo đơn #1024 tại quầy — 09:12' },
  { content: 'Bếp nhận 4 món — 09:13' },
  { content: 'Phục vụ mang món ra bàn 5 — 09:31' },
  { content: 'Khách thanh toán thẻ 385.000 ₫ — 10:02' },
]

const meta = {
  title: 'Components/Timeline',
  component: Timeline,
  args: { items: orderHistory, orientation: 'vertical', textPlacement: 'end', reverse: false, 'aria-label': 'Lịch sử đơn #1024' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    textPlacement: { control: 'inline-radio', options: ['start', 'end', 'alternate'] },
    pending: { control: 'text' },
    items: { control: false },
    pendingDot: { control: false },
    labels: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
} satisfies Meta<typeof Timeline>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Figma "Timeline" Text Placement=Right: the line first, content after it. */
export const Basic: Story = {}

/** Figma Text Placement=Left: content before the line, aligned to it. */
export const Start: Story = { args: { textPlacement: 'start' } }

/** Content on alternating sides of a centred line. */
export const Alternate: Story = { args: { textPlacement: 'alternate' } }

/** Figma Text Placement=Alternate: a label column (the time) on the other side of the line. */
export const WithLabel: Story = {
  args: {
    items: [
      { label: '09:12', content: 'Tạo đơn #1024 tại quầy' },
      { label: '09:13', content: 'Bếp nhận 4 món' },
      { label: '09:31', content: 'Phục vụ mang món ra bàn 5' },
      { label: '10:02', content: 'Khách thanh toán thẻ 385.000 ₫' },
    ],
  },
}

/** Figma "Timeline Item / Basic" Color Blue / Gray / Green / Red (accent / neutral / success / danger), plus warning. */
export const ItemColors: Story = {
  args: {
    items: [
      { content: 'Đang xử lý — mặc định', color: 'accent' },
      { content: 'Chưa bắt đầu', color: 'neutral' },
      { content: 'Đã giao thành công', color: 'success' },
      { content: 'Giao trễ 10 phút', color: 'warning' },
      { content: 'Hủy món: hết nguyên liệu', color: 'danger' },
    ],
  },
}

/** Palette hues, for categorising (e.g. one colour per branch). */
export const PaletteColors: Story = {
  args: { items: PALETTE_HUES.map((h) => ({ content: `Chi nhánh màu ${h}`, color: h })) },
}

/** Figma "Timeline Item / Custom": an icon replaces the dot; `color` tints it. */
export const CustomDot: Story = {
  args: {
    items: [
      { content: 'Tạo đơn #1024', dot: <Receipt /> },
      { content: 'Chờ bếp xác nhận', dot: <Clock />, color: 'warning' },
      { content: 'Thanh toán thẻ', dot: <CreditCard01 />, color: 'success' },
    ],
  },
}

/** `pending`: a last item with a spinner for what is still happening. */
export const Pending: Story = { args: { pending: 'Đang chờ khách xác nhận hóa đơn…' } }

function ReverseDemo() {
  const [reverse, setReverse] = useState(true)
  return (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-md)', justifyItems: 'start' }}>
      <Timeline items={orderHistory} pending reverse={reverse} aria-label="Lịch sử đơn #1024" />
      <Button onPress={() => setReverse((r) => !r)}>{reverse ? 'Cũ nhất trước' : 'Mới nhất trước'}</Button>
    </div>
  )
}

/** `reverse`: newest first (the pending item moves to the top). */
export const Reverse: Story = { render: () => <ReverseDemo /> }

const shifts: TimelineItem[] = [
  { content: 'Mở ca' },
  { content: 'Nhập kho', color: 'success' },
  { content: 'Đối soát', color: 'danger' },
  { content: 'Đóng ca', color: 'neutral' },
]

/** Figma "Timeline / Horizontal" Text Placement Top (`start`) / Center (`alternate`) / Bottom (`end`). */
export const Horizontal: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-xl)' }}>
      <Timeline orientation="horizontal" textPlacement="start" items={shifts} aria-label="Ca làm việc (chữ trên)" />
      <Timeline orientation="horizontal" textPlacement="alternate" items={shifts} aria-label="Ca làm việc (xen kẽ)" />
      <Timeline orientation="horizontal" textPlacement="end" items={shifts} aria-label="Ca làm việc (chữ dưới)" />
    </div>
  ),
}

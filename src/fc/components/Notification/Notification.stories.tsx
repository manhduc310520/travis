import { useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ShoppingCart01 } from '../../../icons'
import { Button } from '../Button/Button'
import { message } from '../Message/messageApi'
import { Toaster } from '../Message/Toaster'
import { NotificationCard, NotificationRegion } from './Notification'
import { notification } from './notificationApi'

const meta = {
  title: 'Components/Notification',
  component: NotificationCard,
  args: {
    type: 'info',
    title: 'Đơn hàng mới #1024',
    description: 'Bàn 12 · 3 món · 245.000đ. Bếp đã nhận phiếu.',
    showIcon: true,
  },
  argTypes: {
    type: { control: 'select', options: ['basic', 'info', 'success', 'warning', 'error'] },
    title: { control: 'text' },
    description: { control: 'text' },
    actions: { control: false },
    icon: { control: false },
  },
} satisfies Meta<typeof NotificationCard>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--fc-space-margin-base)' } as const
const row = { display: 'flex', gap: 'var(--fc-space-margin-xs)', flexWrap: 'wrap' } as const

/** Figma "❖ Notification", one card drawn in place; pick Type and Show Icon? in the controls. */
export const Playground: Story = {}

/** Figma Type = Basic, Info, Success, Warning, Error (Show Icon? = true, Buttons? = false). */
export const Types: Story = {
  render: () => (
    <div style={stack}>
      <NotificationCard type="basic" title="Ca làm việc sắp kết thúc" description="Nhớ chốt két và in báo cáo ca trước 22:00." />
      <NotificationCard type="info" title="Đơn hàng mới #1024" description="Bàn 12 · 3 món · 245.000đ. Bếp đã nhận phiếu." />
      <NotificationCard type="success" title="Đã lưu thực đơn" description="Thực đơn mùa hè áp dụng cho 3 chi nhánh từ ngày 01/10/2026." />
      <NotificationCard type="warning" title="Sắp hết nguyên liệu" description="Còn 5 phần bò tái cho ca tối tại chi nhánh Quận 1." />
      <NotificationCard type="error" title="Không thể kết nối máy in" description="Kiểm tra cáp mạng của máy in bếp rồi thử lại." />
    </div>
  ),
}

/** Figma Buttons? = true: footer actions as fc Button size sm — one primary, the rest default. */
export const WithActions: Story = {
  args: {
    actions: [{ label: 'Để sau' }, { label: 'Xem đơn', variant: 'primary' }],
  },
}

/** Figma Show Icon? = false. */
export const WithoutIcon: Story = {
  args: {
    type: 'success',
    showIcon: false,
    title: 'Đã lưu thực đơn',
    description: 'Thực đơn mùa hè áp dụng cho 3 chi nhánh từ ngày 01/10/2026.',
  },
}

/** Type = Basic with a custom icon (`icon`), drawn in the accent colour. */
export const CustomIcon: Story = {
  args: {
    type: 'basic',
    icon: <ShoppingCart01 />,
    title: 'Đơn mang đi #2048',
    description: 'Khách hẹn lấy lúc 12:30 · 2 món.',
  },
}

const newOrder = () =>
  notification.info({
    title: 'Đơn hàng mới #1024',
    description: 'Bàn 12 · 3 món · 245.000đ. Bếp đã nhận phiếu.',
    actions: [{ label: 'Để sau' }, { label: 'Xem đơn', variant: 'primary' }],
  })

/**
 * The real queue: each button calls `notification.*`. Notifications stack in
 * the top-right corner, newest first, and close after 4.5 s — except the one
 * with actions, which stays until closed. Hover or focus pauses the timers;
 * F6 moves keyboard focus to the region.
 */
export const Interactive: Story = {
  render: () => (
    <>
      <div style={row}>
        <Button onPress={newOrder}>Đơn mới (có nút)</Button>
        <Button onPress={() => notification.success({ title: 'Đã lưu thực đơn', description: 'Thực đơn mùa hè áp dụng cho 3 chi nhánh từ ngày 01/10/2026.' })}>
          Thành công
        </Button>
        <Button onPress={() => notification.error({ title: 'Không thể kết nối máy in', description: 'Kiểm tra cáp mạng của máy in bếp rồi thử lại.' })}>
          Lỗi
        </Button>
        <Button onPress={() => notification.warning({ title: 'Sắp hết nguyên liệu', description: 'Còn 5 phần bò tái cho ca tối tại chi nhánh Quận 1.' })}>
          Cảnh báo
        </Button>
        <Button onPress={() => notification.open({ title: 'Ca làm việc sắp kết thúc', description: 'Nhớ chốt két và in báo cáo ca trước 22:00.' })}>
          Cơ bản
        </Button>
      </div>
      <NotificationRegion />
    </>
  ),
}

/** `<Toaster />` renders both regions once: messages top centre, notifications top right. */
export const WithToaster: Story = {
  render: () => (
    <>
      <div style={row}>
        <Button onPress={() => message.success('Đã lưu thực đơn')}>Message</Button>
        <Button onPress={newOrder}>Notification</Button>
      </div>
      <Toaster />
    </>
  ),
}

function LiveNotifications() {
  useEffect(() => {
    const closers = [
      notification.error({ title: 'Không thể kết nối máy in', description: 'Kiểm tra cáp mạng của máy in bếp rồi thử lại.', duration: 0 }),
      notification.success({ title: 'Đã lưu thực đơn', description: 'Thực đơn mùa hè áp dụng cho 3 chi nhánh từ ngày 01/10/2026.', duration: 0 }),
      newOrder(),
    ]
    return () => closers.forEach((close) => close())
  }, [])
  return <NotificationRegion />
}

/**
 * The live region open on load, held open (`duration: 0`), for visual and
 * accessibility review without pressing anything. Kept off the docs page,
 * where it would sit over the other stories.
 */
export const LiveOpen: Story = {
  tags: ['!autodocs'],
  render: () => <LiveNotifications />,
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Button, Statistic } from 'antd'

const meta: Meta<typeof Card> = { component: Card, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: { title: 'Trà sữa 344', style: { width: 320 }, children: 'Cầu Giấy, Hà Nội' },
}
export const WithExtra: Story = {
  args: {
    title: 'Doanh thu hôm nay',
    extra: <Button type="link">Xem tất cả</Button>,
    style: { width: 320 },
    children: <Statistic value={112893} suffix="đ" />,
  },
}
export const Small: Story = {
  args: { title: 'Nhỏ gọn', size: 'small', style: { width: 280 }, children: 'Mật độ cao hơn' },
}
export const Loading: Story = { args: { title: 'Đang tải', loading: true, style: { width: 320 } } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Button, Statistic } from 'antd'

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Components/Card',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's card/Card.d.ts — written from the API.
  argTypes: {
    title: { description: 'Card title.', control: 'text' },
    extra: { description: 'Content rendered at the top-right, alongside the title.', control: false },
    size: { description: 'Card density — default or small.', control: 'select', options: ['default', 'small'] },
    loading: { description: 'Shows a skeleton placeholder instead of the children.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: { title: 'Trà sữa 344', style: { maxWidth: 320 }, children: 'Cầu Giấy, Hà Nội' },
}
export const WithExtra: Story = {
  args: {
    title: 'Doanh thu hôm nay',
    extra: <Button type="link">Xem tất cả</Button>,
    style: { maxWidth: 320 },
    children: <Statistic value={112893} suffix="đ" />,
  },
}
export const Small: Story = {
  args: { title: 'Nhỏ gọn', size: 'small', style: { width: 280 }, children: 'Mật độ cao hơn' },
}
export const Loading: Story = { args: { title: 'Đang tải', loading: true, style: { maxWidth: 320 } } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, Avatar, Space } from 'antd'
import { Bell01 } from '../icons'
const meta: Meta<typeof Badge> = { component: Badge, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Badge>

export const Count: Story = { args: { count: 5, children: <Avatar shape="square" /> } }
export const Overflow: Story = { args: { count: 120, overflowCount: 99, children: <Avatar shape="square" /> } }
export const Dot: Story = { args: { dot: true, children: <Bell01 size={20} /> } }

export const Status: Story = {
  render: () => (
    <Space orientation="vertical">
      <Badge status="success" text="Đang hoạt động" />
      <Badge status="processing" text="Đang đồng bộ" />
      <Badge status="warning" text="Sắp hết hạn" />
      <Badge status="error" text="Mất kết nối" />
      <Badge status="default" text="Tạm dừng" />
    </Space>
  ),
}

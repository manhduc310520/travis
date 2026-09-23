import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, Avatar, Space } from 'antd'
import { Bell01 } from '../icons'
const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'Components/Badge',
  tags: ['ai-generated', 'needs-work'],
  // `count`/`overflowCount`/`dot` descriptions are antd's own JSDoc from
  // badge/Badge.d.ts, copied as-is. `status`/`text` have no JSDoc there.
  argTypes: {
    count: { description: 'Number to show in badge.', control: 'number' },
    overflowCount: { description: 'Max count to show.', control: 'number' },
    dot: { description: 'Whether to show red dot without number.', control: 'boolean' },
    status: {
      description: 'Renders as a status dot instead of a count, colored by this semantic status.',
      control: 'select',
      options: ['success', 'processing', 'default', 'error', 'warning'],
    },
    text: { description: 'Text shown next to a status dot.', control: 'text' },
  },
}
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

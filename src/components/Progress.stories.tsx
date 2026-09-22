import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress, Space } from 'antd'

const meta: Meta<typeof Progress> = { component: Progress, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Progress>

export const Line: Story = { args: { percent: 60, style: { width: 320 } } }
export const Circle: Story = { args: { type: 'circle', percent: 72 } }
export const Statuses: Story = {
  render: () => (
    <Space orientation="vertical" style={{ width: 320 }}>
      <Progress percent={100} status="success" />
      <Progress percent={40} status="exception" />
      <Progress percent={60} status="active" />
    </Space>
  ),
}

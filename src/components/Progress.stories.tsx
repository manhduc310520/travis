import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress, Space } from 'antd'

const meta: Meta<typeof Progress> = {
  component: Progress,
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's progress types — written from the API.
  argTypes: {
    percent: { description: 'Completion percentage, 0–100.', control: 'number' },
    type: { description: 'Visual shape of the progress indicator.', control: 'select', options: ['line', 'circle', 'dashboard'] },
    status: { description: 'Overrides the color/icon to reflect an outcome.', control: 'select', options: ['normal', 'active', 'success', 'exception'] },
  },
}
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

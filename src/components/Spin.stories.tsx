import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spin, Space, Card } from 'antd'

const meta: Meta<typeof Spin> = { component: Spin, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Spin>

export const Sizes: Story = {
  render: () => (
    <Space size="large">
      <Spin size="small" />
      <Spin />
      <Spin size="large" />
    </Space>
  ),
}

export const WithTip: Story = {
  render: () => (
    <Spin description="Đang tải dữ liệu">
      <Card style={{ width: 320, height: 120 }} />
    </Spin>
  ),
}

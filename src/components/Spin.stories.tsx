import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spin, Space, Card } from 'antd'

const meta: Meta<typeof Spin> = {
  component: Spin,
  tags: ['ai-generated', 'needs-work'],
  // Every story uses a custom `render`, none set `args` — the Docs page's
  // argTypes table only renders once at least one arg exists. No JSDoc on
  // these in antd's spin types — written from the API. (`tip` is the
  // deprecated predecessor of `description`, already noted elsewhere in
  // this project's AntD-v6-renamed-props fixes — not re-documented here.)
  args: { size: 'default' },
  argTypes: {
    size: { description: 'Size of the spinner.', control: 'select', options: ['small', 'default', 'large'] },
    description: { description: 'Text shown below the spinner.', control: 'text' },
  },
}
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
      <Card style={{ maxWidth: 320, height: 120 }} />
    </Spin>
  ),
}

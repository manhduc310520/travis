import type { Meta, StoryObj } from '@storybook/react-vite'
import { Watermark, Card } from 'antd'

const meta: Meta<typeof Watermark> = {
  component: Watermark,
  tags: ['ai-generated', 'needs-work'],
  // The story uses a custom `render` with no `args` — the Docs page's
  // argTypes table only renders once at least one arg exists. No JSDoc on
  // `content` in antd's watermark types — written from the API.
  args: { content: 'iPOS.vn' },
  argTypes: {
    content: { description: 'Text (or array of lines) repeated across the watermark.', control: 'text' },
  },
}
export default meta
type Story = StoryObj<typeof Watermark>

export const Default: Story = {
  render: () => (
    <Watermark content="iPOS.vn">
      <Card style={{ maxWidth: 480, height: 200 }}>Báo cáo nội bộ</Card>
    </Watermark>
  ),
}

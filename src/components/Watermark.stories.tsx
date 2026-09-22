import type { Meta, StoryObj } from '@storybook/react-vite'
import { Watermark, Card } from 'antd'

const meta: Meta<typeof Watermark> = { component: Watermark, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Watermark>

export const Default: Story = {
  render: () => (
    <Watermark content="iPOS.vn">
      <Card style={{ width: 480, height: 200 }}>Báo cáo nội bộ</Card>
    </Watermark>
  ),
}

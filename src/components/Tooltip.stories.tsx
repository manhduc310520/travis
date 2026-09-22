import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, Button } from 'antd'

const meta: Meta<typeof Tooltip> = { component: Tooltip, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <div style={{ height: 160, paddingTop: 60 }}>
      <Tooltip title="Xuất báo cáo dạng Excel" open>
        <Button>Xuất báo cáo</Button>
      </Tooltip>
    </div>
  ),
}

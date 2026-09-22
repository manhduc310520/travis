import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover, Button } from 'antd'

const meta: Meta<typeof Popover> = { component: Popover, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <div style={{ height: 240, paddingTop: 100 }}>
      <Popover title="Tiện ích" content={<div>Xuất Excel<br />In danh sách</div>} open>
        <Button>Tiện ích</Button>
      </Popover>
    </div>
  ),
}

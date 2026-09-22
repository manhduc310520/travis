import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popconfirm, Button } from 'antd'

const meta: Meta<typeof Popconfirm> = { component: Popconfirm, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Popconfirm>

export const Default: Story = {
  render: () => (
    <div style={{ height: 200, paddingTop: 80 }}>
      <Popconfirm title="Xoá nhà hàng này?" okText="Xoá" cancelText="Huỷ" open>
        <Button danger>Xoá</Button>
      </Popconfirm>
    </div>
  ),
}

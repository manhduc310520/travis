import type { Meta, StoryObj } from '@storybook/react-vite'
import { Drawer, Form, Input } from 'antd'

const meta: Meta<typeof Drawer> = { component: Drawer, title: 'Components/Drawer', tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Drawer>

export const Open: Story = {
  args: {
    open: true,
    title: 'Bộ lọc',
    placement: 'right',
    getContainer: false,
    size: 320,
    children: (
      <Form layout="vertical">
        <Form.Item label="Tên nhà hàng">
          <Input />
        </Form.Item>
      </Form>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
}

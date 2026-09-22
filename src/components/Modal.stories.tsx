import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal, Form, Input } from 'antd'

const meta: Meta<typeof Modal> = { component: Modal, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Modal>

export const Open: Story = {
  args: {
    open: true,
    title: 'Tạo nhà hàng',
    okText: 'Tạo',
    cancelText: 'Huỷ',
    getContainer: false,
    children: (
      <Form layout="vertical">
        <Form.Item label="Tên nhà hàng">
          <Input placeholder="Trà sữa 344" />
        </Form.Item>
      </Form>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 420 }}>
        <Story />
      </div>
    ),
  ],
}

export const Confirm: Story = {
  args: {
    open: true,
    title: 'Xoá nhà hàng này?',
    okText: 'Xoá',
    okButtonProps: { danger: true },
    cancelText: 'Huỷ',
    getContainer: false,
    children: <p>Hành động này không thể hoàn tác.</p>,
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 360 }}>
        <Story />
      </div>
    ),
  ],
}

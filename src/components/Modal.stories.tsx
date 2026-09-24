import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal, Form, Input } from 'antd'

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: 'Components/Modal',
  tags: ['ai-generated', 'needs-work'],
  // `open`/`confirmLoading`/`width`/`okText`/`cancelText` descriptions are
  // antd's own JSDoc from modal/interface.d.ts, copied as-is.
  argTypes: {
    open: { description: 'Whether the modal dialog is visible or not.', control: 'boolean' },
    confirmLoading: { description: 'Whether to apply loading visual effect for the OK button or not.', control: 'boolean' },
    width: { description: 'Width of the modal dialog.', control: 'number' },
    okText: { description: 'Text of the OK button.', control: 'text' },
    cancelText: { description: 'Text of the Cancel button.', control: 'text' },
    okButtonProps: { description: 'Props passed through to the OK button (e.g. { danger: true }).', control: false },
  },
}
export default meta
type Story = StoryObj<typeof Modal>

export const Open: Story = {
  args: {
    open: true,
    title: 'Basic Modal',
    okText: 'OK',
    cancelText: 'Cancel',
    getContainer: false,
    children: (
      <Form layout="vertical">
        <Form.Item label="Name">
          <Input placeholder="Please input" />
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
    title: 'Are you sure delete this task?',
    okText: 'Delete',
    okButtonProps: { danger: true },
    cancelText: 'Cancel',
    getContainer: false,
    children: <p>This action cannot be undone.</p>,
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 360 }}>
        <Story />
      </div>
    ),
  ],
}

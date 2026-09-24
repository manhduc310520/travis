import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Form, Input, Select, Button, Switch } from 'antd'

const meta: Meta<typeof Form> = {
  component: Form,
  title: 'Components/Form',
  tags: ['ai-generated', 'needs-work'],
  // Every story uses a custom `render` and none set `args` — the Docs
  // page's argTypes table only renders once at least one arg exists.
  args: { layout: 'vertical' },
  // No JSDoc on `layout` in antd's form/Form.d.ts. Field-level props
  // (`rules`, `validateStatus`, `help`) belong to `Form.Item`, a different
  // component from the one documented here, so they aren't listed as
  // argTypes on this meta.
  argTypes: {
    layout: {
      description: 'Position of labels relative to their fields.',
      control: 'select',
      options: ['horizontal', 'vertical', 'inline'],
    },
  },
}
export default meta
type Story = StoryObj<typeof Form>

export const Vertical: Story = {
  render: () => (
    <Form layout="vertical" style={{ maxWidth: 420 }}>
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input placeholder="Please input" />
      </Form.Item>
      <Form.Item label="Select" name="select">
        <Select placeholder="Please select" options={[{ value: 'option-1', label: 'Option 1' }, { value: 'option-2', label: 'Option 2' }]} />
      </Form.Item>
      <Form.Item label="Switch" name="switch" valuePropName="checked">
        <Switch defaultChecked />
      </Form.Item>
      <Button type="primary">Submit</Button>
    </Form>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Name')).toBeVisible()
  },
}

export const Horizontal: Story = {
  render: () => (
    <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} style={{ maxWidth: 560 }}>
      <Form.Item label="Name"><Input /></Form.Item>
      <Form.Item label="Phone"><Input /></Form.Item>
    </Form>
  ),
}

export const WithErrors: Story = {
  render: () => (
    <Form layout="vertical" style={{ maxWidth: 420 }}>
      <Form.Item label="Name" validateStatus="error" help="Please input your name!">
        <Input />
      </Form.Item>
      <Form.Item label="Email" validateStatus="warning" help="The input is not a valid email!">
        <Input defaultValue="abc@" />
      </Form.Item>
    </Form>
  ),
}

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
      <Form.Item label="Tên nhà hàng" name="name" rules={[{ required: true }]}>
        <Input placeholder="Trà sữa 344" />
      </Form.Item>
      <Form.Item label="Thành phố" name="city">
        <Select options={[{ value: 'hn', label: 'Hà Nội' }, { value: 'dn', label: 'Đà Nẵng' }]} />
      </Form.Item>
      <Form.Item label="Đang hoạt động" name="active" valuePropName="checked">
        <Switch defaultChecked />
      </Form.Item>
      <Button type="primary">Tạo nhà hàng</Button>
    </Form>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Tên nhà hàng')).toBeVisible()
  },
}

export const Horizontal: Story = {
  render: () => (
    <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} style={{ maxWidth: 560 }}>
      <Form.Item label="Tên nhà hàng"><Input /></Form.Item>
      <Form.Item label="Số điện thoại"><Input /></Form.Item>
    </Form>
  ),
}

export const WithErrors: Story = {
  render: () => (
    <Form layout="vertical" style={{ maxWidth: 420 }}>
      <Form.Item label="Tên nhà hàng" validateStatus="error" help="Tên không được để trống">
        <Input />
      </Form.Item>
      <Form.Item label="Email" validateStatus="warning" help="Định dạng có vẻ chưa đúng">
        <Input defaultValue="abc@" />
      </Form.Item>
    </Form>
  ),
}

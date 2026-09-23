import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox, Space } from 'antd'

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: 'Components/Checkbox',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's Checkbox.d.ts — written from the API.
  argTypes: {
    defaultChecked: { description: 'Whether the checkbox is checked on initial render (uncontrolled).', control: 'boolean' },
    disabled: { description: 'Disables the checkbox.', control: 'boolean' },
    indeterminate: { description: 'Shows a dash instead of a check — visual only, does not affect the checked state.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = { args: { children: 'Nhận thông báo' } }
export const Checked: Story = { args: { children: 'Nhận thông báo', defaultChecked: true } }
export const Disabled: Story = { args: { children: 'Không khả dụng', disabled: true } }
export const Group: Story = {
  render: () => (
    <Space orientation="vertical">
      <Checkbox defaultChecked>Hà Nội</Checkbox>
      <Checkbox>Đà Nẵng</Checkbox>
      <Checkbox indeterminate>TP. Hồ Chí Minh</Checkbox>
    </Space>
  ),
}

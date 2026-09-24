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

export const Default: Story = { args: { children: 'Checkbox' } }
export const Checked: Story = { args: { children: 'Checkbox', defaultChecked: true } }
export const Disabled: Story = { args: { children: 'Disabled', disabled: true } }
export const Group: Story = {
  render: () => (
    <Space orientation="vertical">
      <Checkbox defaultChecked>Apple</Checkbox>
      <Checkbox>Pear</Checkbox>
      <Checkbox indeterminate>Orange</Checkbox>
    </Space>
  ),
}

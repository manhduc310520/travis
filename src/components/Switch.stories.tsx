import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from 'antd'

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: 'Components/Switch',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's switch types — written from the API.
  argTypes: {
    defaultChecked: { description: 'Whether the switch is on at initial render (uncontrolled).', control: 'boolean' },
    size: { description: 'Size of the switch.', control: 'select', options: ['default', 'small'] },
    disabled: { description: 'Disables the switch.', control: 'boolean' },
    checkedChildren: { description: 'Content shown inside the switch when on.', control: 'text' },
    unCheckedChildren: { description: 'Content shown inside the switch when off.', control: 'text' },
  },
}
export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = { args: { defaultChecked: true } }
export const Small: Story = { args: { size: 'small', defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } }
export const WithLabels: Story = { args: { checkedChildren: 'Bật', unCheckedChildren: 'Tắt', defaultChecked: true } }

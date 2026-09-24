import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cascader } from 'antd'

const meta: Meta<typeof Cascader> = {
  component: Cascader,
  title: 'Components/Cascader',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's cascader types — written from the API.
  argTypes: {
    options: { description: 'The nested list of selectable options.', control: false },
    multiple: { description: 'Allows selecting more than one leaf/branch at once.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Cascader>

const options = [
  { value: 'option-1', label: 'Option 1', children: [{ value: 'option-1-1', label: 'Option 1-1' }, { value: 'option-1-2', label: 'Option 1-2' }] },
  { value: 'option-2', label: 'Option 2', children: [{ value: 'option-2-1', label: 'Option 2-1' }] },
]

export const Default: Story = { args: { options, placeholder: 'Please select', style: { width: 280 } } }
export const Multiple: Story = { args: { options, multiple: true, placeholder: 'Please select', style: { maxWidth: 320 } } }

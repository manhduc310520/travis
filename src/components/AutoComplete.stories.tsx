import type { Meta, StoryObj } from '@storybook/react-vite'
import { AutoComplete } from 'antd'

const meta: Meta<typeof AutoComplete> = {
  component: AutoComplete,
  title: 'Components/AutoComplete',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's auto-complete types — written from the API.
  argTypes: {
    options: { description: 'The list of suggestions shown while typing.', control: false },
    disabled: { description: 'Disables the input.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof AutoComplete>

const options = [{ value: 'Option 1' }, { value: 'Option 2' }, { value: 'Option 3' }]

export const Default: Story = { args: { options, placeholder: 'Input here', style: { width: 280 } } }
export const Disabled: Story = { args: { options, disabled: true, placeholder: 'Disabled', style: { width: 280 } } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from 'antd'

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: 'Components/DatePicker',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc found on these in antd's generated picker types — written
  // from the API surface.
  argTypes: {
    picker: {
      description: 'Granularity of the picker panel.',
      control: 'select',
      options: ['date', 'week', 'month', 'quarter', 'year'],
    },
    disabled: { description: 'Disables the input.', control: 'boolean' },
    status: { description: 'Validation state — colors the border and focus ring.', control: 'select', options: ['', 'warning', 'error'] },
  },
}
export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = { args: { placeholder: 'Select date' } }
export const Range: Story = { render: () => <DatePicker.RangePicker /> }
export const Month: Story = { args: { picker: 'month', placeholder: 'Select month' } }
export const Disabled: Story = { args: { disabled: true } }
export const Invalid: Story = { args: { status: 'error', placeholder: 'Select date' } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { TimePicker } from 'antd'

const meta: Meta<typeof TimePicker> = {
  component: TimePicker,
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc found on these in antd's time-picker types — written from the API.
  argTypes: {
    use12Hours: { description: 'Shows a 12-hour clock with an AM/PM column instead of 24-hour.', control: 'boolean' },
    format: { description: 'dayjs format string controlling how the time is displayed/parsed.', control: 'text' },
    disabled: { description: 'Disables the input.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof TimePicker>

export const Default: Story = { args: { placeholder: 'Giờ mở cửa' } }
export const Range: Story = { render: () => <TimePicker.RangePicker /> }
export const TwelveHour: Story = { args: { use12Hours: true, format: 'h:mm a' } }
export const Disabled: Story = { args: { disabled: true } }

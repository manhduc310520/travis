import type { Meta, StoryObj } from '@storybook/react-vite'
import { TimePicker } from 'antd'

const meta: Meta<typeof TimePicker> = { component: TimePicker, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof TimePicker>

export const Default: Story = { args: { placeholder: 'Giờ mở cửa' } }
export const Range: Story = { render: () => <TimePicker.RangePicker /> }
export const TwelveHour: Story = { args: { use12Hours: true, format: 'h:mm a' } }
export const Disabled: Story = { args: { disabled: true } }

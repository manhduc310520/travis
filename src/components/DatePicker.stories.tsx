import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from 'antd'

const meta: Meta<typeof DatePicker> = { component: DatePicker, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = { args: { placeholder: 'Chọn ngày' } }
export const Range: Story = { render: () => <DatePicker.RangePicker /> }
export const Month: Story = { args: { picker: 'month', placeholder: 'Chọn tháng' } }
export const Disabled: Story = { args: { disabled: true } }
export const Invalid: Story = { args: { status: 'error', placeholder: 'Bắt buộc' } }

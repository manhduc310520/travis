import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputNumber } from 'antd'

const meta: Meta<typeof InputNumber> = { component: InputNumber, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof InputNumber>

export const Default: Story = { args: { defaultValue: 45000, min: 0, step: 1000 } }
export const WithSuffix: Story = { args: { defaultValue: 45000, addonAfter: 'đ', min: 0 } }
export const Disabled: Story = { args: { defaultValue: 45000, disabled: true } }
export const Invalid: Story = { args: { defaultValue: -1, status: 'error' } }

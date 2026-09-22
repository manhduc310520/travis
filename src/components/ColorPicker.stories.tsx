import type { Meta, StoryObj } from '@storybook/react-vite'
import { ColorPicker } from 'antd'

const meta: Meta<typeof ColorPicker> = { component: ColorPicker, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof ColorPicker>

export const Default: Story = { args: { defaultValue: '#003EB3' } }
export const WithText: Story = { args: { defaultValue: '#003EB3', showText: true } }
export const Disabled: Story = { args: { defaultValue: '#003EB3', disabled: true } }

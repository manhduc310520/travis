import type { Meta, StoryObj } from '@storybook/react-vite'
import { Rate } from 'antd'

const meta: Meta<typeof Rate> = { component: Rate, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Rate>

export const Default: Story = { args: { defaultValue: 4 } }
export const HalfStar: Story = { args: { allowHalf: true, defaultValue: 3.5 } }
export const Disabled: Story = { args: { defaultValue: 4, disabled: true } }

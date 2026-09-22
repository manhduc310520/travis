import type { Meta, StoryObj } from '@storybook/react-vite'
import { Segmented } from 'antd'

const meta: Meta<typeof Segmented> = { component: Segmented, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Segmented>

const options = ['Ngày', 'Tuần', 'Tháng']

export const Default: Story = { args: { options, defaultValue: 'Tuần' } }
export const Block: Story = { args: { options, block: true, style: { width: 360 } } }
export const Disabled: Story = { args: { options, disabled: true } }

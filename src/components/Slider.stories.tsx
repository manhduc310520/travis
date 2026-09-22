import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from 'antd'

const meta: Meta<typeof Slider> = { component: Slider, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = { args: { defaultValue: 40, style: { width: 320 } } }
export const RangeMode: Story = { args: { range: true, defaultValue: [20, 60], style: { width: 320 } } }
export const WithMarks: Story = {
  args: { defaultValue: 50, style: { width: 320 }, marks: { 0: '0', 50: '50', 100: '100' } },
}
export const Disabled: Story = { args: { defaultValue: 40, disabled: true, style: { width: 320 } } }

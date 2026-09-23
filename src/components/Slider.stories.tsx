import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from 'antd'

const meta: Meta<typeof Slider> = {
  component: Slider,
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's slider types — written from the API.
  argTypes: {
    range: { description: 'Selects a span (two handles) instead of a single value.', control: 'boolean' },
    marks: { description: 'Labeled tick marks at specific values.', control: false },
    disabled: { description: 'Disables the slider.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = { args: { defaultValue: 40, style: { maxWidth: 320 } } }
export const RangeMode: Story = { args: { range: true, defaultValue: [20, 60], style: { maxWidth: 320 } } }
export const WithMarks: Story = {
  args: { defaultValue: 50, style: { maxWidth: 320 }, marks: { 0: '0', 50: '50', 100: '100' } },
}
export const Disabled: Story = { args: { defaultValue: 40, disabled: true, style: { maxWidth: 320 } } }

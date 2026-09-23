import type { Meta, StoryObj } from '@storybook/react-vite'
import { ColorPicker } from 'antd'

const meta: Meta<typeof ColorPicker> = {
  component: ColorPicker,
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's color-picker types — written from the API.
  argTypes: {
    disabled: { description: 'Disables the color picker.', control: 'boolean' },
    showText: { description: 'Shows the hex value as text next to the swatch.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof ColorPicker>

export const Default: Story = { args: { defaultValue: '#003EB3' } }
export const WithText: Story = { args: { defaultValue: '#003EB3', showText: true } }
export const Disabled: Story = { args: { defaultValue: '#003EB3', disabled: true } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Rate } from 'antd'

const meta: Meta<typeof Rate> = {
  component: Rate,
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's rate types — written from the API.
  argTypes: {
    defaultValue: { description: 'Rating shown on initial render (uncontrolled).', control: 'number' },
    allowHalf: { description: 'Allows selecting a half-star value.', control: 'boolean' },
    disabled: { description: 'Disables the rating (read-only display).', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Rate>

export const Default: Story = { args: { defaultValue: 4 } }
export const HalfStar: Story = { args: { allowHalf: true, defaultValue: 3.5 } }
export const Disabled: Story = { args: { defaultValue: 4, disabled: true } }

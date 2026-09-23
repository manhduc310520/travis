import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from 'antd'

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's Skeleton.d.ts — written from the API.
  argTypes: {
    avatar: { description: 'Shows a placeholder avatar (true), or pass config to customize its shape/size.', control: 'boolean' },
    paragraph: { description: 'Shows placeholder text lines (true), or pass { rows } to set how many.', control: false },
    active: { description: 'Animates the placeholder with a shimmer effect.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = { args: { style: { maxWidth: 480 } } }
export const WithAvatar: Story = { args: { avatar: true, paragraph: { rows: 3 }, style: { maxWidth: 480 } } }
export const Active: Story = { args: { active: true, style: { maxWidth: 480 } } }

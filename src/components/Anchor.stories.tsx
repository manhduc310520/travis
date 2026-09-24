import type { Meta, StoryObj } from '@storybook/react-vite'
import { Anchor } from 'antd'

const meta: Meta<typeof Anchor> = {
  component: Anchor,
  title: 'Components/Anchor',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's Anchor.d.ts — written from the API surface.
  argTypes: {
    items: { description: 'The list of link targets to render.', control: false },
    direction: { description: 'Layout direction of the link list.', control: 'select', options: ['vertical', 'horizontal'] },
  },
}
export default meta
type Story = StoryObj<typeof Anchor>

export const Default: Story = {
  args: {
    items: [
      { key: '1', href: '#part-1', title: 'Part 1' },
      { key: '2', href: '#part-2', title: 'Part 2' },
      { key: '3', href: '#part-3', title: 'Part 3' },
    ],
  },
}

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    items: [
      { key: '1', href: '#part-1', title: 'Part 1' },
      { key: '2', href: '#part-2', title: 'Part 2' },
    ],
  },
}

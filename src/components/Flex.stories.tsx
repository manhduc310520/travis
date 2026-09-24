import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flex, Button } from 'antd'

const meta: Meta<typeof Flex> = {
  component: Flex,
  title: 'Components/Flex',
  tags: ['ai-generated', 'needs-work'],
  // Every story uses a custom `render`, none set `args` — the Docs page's
  // argTypes table only renders once at least one arg exists.
  args: { gap: 'middle' },
  // No JSDoc on these in antd's flex/interface.d.ts — written from the API.
  argTypes: {
    gap: { description: 'Space between children.', control: 'select', options: ['small', 'middle', 'large'] },
    justify: { description: 'CSS justify-content — alignment along the main axis.', control: false },
    vertical: { description: 'Stacks children top-to-bottom instead of left-to-right.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Flex>

export const Gap: Story = {
  render: () => (
    <Flex gap="middle">
      <Button type="primary">Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Flex>
  ),
}

export const SpaceBetween: Story = {
  render: () => (
    <Flex justify="space-between" style={{ maxWidth: 480 }}>
      <Button>Left</Button>
      <Button>Right</Button>
    </Flex>
  ),
}

export const VerticalStack: Story = {
  render: () => (
    <Flex vertical gap="small" style={{ width: 240 }}>
      <Button type="primary">Primary Button</Button>
      <Button>Default Button</Button>
    </Flex>
  ),
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Steps } from 'antd'

const meta: Meta<typeof Steps> = {
  component: Steps,
  title: 'Components/Steps',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's steps types — written from the API.
  argTypes: {
    current: { description: 'Index (0-based) of the active step.', control: 'number' },
    orientation: { description: 'Layout direction of the steps.', control: 'select', options: ['horizontal', 'vertical'] },
    size: { description: 'Size of the step indicators.', control: 'select', options: ['default', 'small'] },
    status: {
      description: 'Status of the current step (overridden per-item by that item\'s own `status`).',
      control: 'select',
      options: ['wait', 'process', 'finish', 'error'],
    },
  },
}
export default meta
type Story = StoryObj<typeof Steps>

const items = [
  { title: 'Step 1', content: 'This is a description.' },
  { title: 'Step 2', content: 'This is a description.' },
  { title: 'Step 3', content: 'This is a description.' },
]

export const Horizontal: Story = { args: { current: 1, items } }
export const Vertical: Story = { args: { current: 1, orientation: 'vertical', items } }
export const Small: Story = { args: { current: 1, size: 'small', items } }
export const WithError: Story = { args: { current: 1, status: 'error', items } }

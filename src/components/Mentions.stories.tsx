import type { Meta, StoryObj } from '@storybook/react-vite'
import { Mentions } from 'antd'

const meta: Meta<typeof Mentions> = {
  component: Mentions,
  title: 'Components/Mentions',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on `options` in antd's mentions types — written from the API.
  argTypes: {
    options: { description: 'The list of people/values suggested after typing @.', control: false },
  },
}
export default meta
type Story = StoryObj<typeof Mentions>

export const Default: Story = {
  args: {
    placeholder: 'Input @ to mention people',
    style: { maxWidth: 320 },
    options: [{ value: 'john', label: 'john' }, { value: 'jane', label: 'jane' }, { value: 'alex', label: 'alex' }],
  },
}

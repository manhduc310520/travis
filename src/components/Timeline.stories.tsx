import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline } from 'antd'

const meta: Meta<typeof Timeline> = {
  component: Timeline,
  title: 'Components/Timeline',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's timeline types — written from the API.
  argTypes: {
    items: { description: 'The list of timeline entries.', control: false },
    mode: { description: 'Placement of entries relative to the center line.', control: 'select', options: ['left', 'alternate', 'right'] },
  },
}
export default meta
type Story = StoryObj<typeof Timeline>

const items = [
  { content: 'Create a services site 2015-09-01' },
  { content: 'Solve initial network problems 2015-09-01', color: 'green' },
  { content: 'Technical testing 2015-09-01', color: 'red' },
  { content: 'Network problems being solved 2015-09-01' },
]

export const Default: Story = { args: { items } }
export const Alternate: Story = { args: { items, mode: 'alternate' } }

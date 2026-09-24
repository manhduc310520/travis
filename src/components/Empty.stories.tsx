import type { Meta, StoryObj } from '@storybook/react-vite'
import { Empty, Button } from 'antd'

const meta: Meta<typeof Empty> = {
  component: Empty,
  title: 'Components/Empty',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's empty/index.d.ts — written from the API.
  argTypes: {
    description: { description: 'Text shown under the image.', control: 'text' },
    image: { description: 'The illustration — a URL, node, or one of Empty.PRESENTED_IMAGE_*.', control: false },
  },
}
export default meta
type Story = StoryObj<typeof Empty>

export const Default: Story = { args: { description: 'No data' } }

export const WithAction: Story = {
  args: {
    description: 'Try changing your filters or search terms',
    children: <Button type="primary">Clear search and filters</Button>,
  },
}

export const Simple: Story = { args: { image: Empty.PRESENTED_IMAGE_SIMPLE, description: 'No data' } }

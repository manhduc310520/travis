import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from 'antd'
import { Home01 } from '../icons'
const meta: Meta<typeof Breadcrumb> = {
  component: Breadcrumb,
  title: 'Components/Breadcrumb',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on `items` in antd's breadcrumb types — written from the API.
  argTypes: {
    items: { description: 'The trail of items, rendered left to right with separators between them.', control: false },
  },
}
export default meta
type Story = StoryObj<typeof Breadcrumb>

export const Default: Story = {
  args: { items: [{ title: 'Home' }, { title: 'Application Center' }, { title: 'Application List' }] },
}

export const WithIcon: Story = {
  args: {
    items: [
      { title: <Home01 /> },
      { title: <a href="#">Application Center</a> },
      { title: 'Application List' },
    ],
  },
}

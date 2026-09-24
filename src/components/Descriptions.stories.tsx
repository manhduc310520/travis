import type { Meta, StoryObj } from '@storybook/react-vite'
import { Descriptions } from 'antd'

const meta: Meta<typeof Descriptions> = {
  component: Descriptions,
  title: 'Components/Descriptions',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's descriptions/index.d.ts — written from the API.
  argTypes: {
    title: { description: 'Title shown above the list.', control: 'text' },
    bordered: { description: 'Draws borders around each label/value cell.', control: 'boolean' },
    column: { description: 'Number of label/value pairs per row.', control: 'number' },
    layout: { description: 'Label position relative to its value.', control: 'select', options: ['horizontal', 'vertical'] },
  },
}
export default meta
type Story = StoryObj<typeof Descriptions>

const items = [
  { key: '1', label: 'UserName', children: 'John Brown' },
  { key: '2', label: 'Telephone', children: '555-0100' },
  { key: '3', label: 'Live', children: 'New York' },
  { key: '4', label: 'Address', children: 'No. 1 Lake Park' },
]

export const Default: Story = { args: { title: 'User Info', items } }
export const Bordered: Story = { args: { title: 'User Info', bordered: true, items, column: 2 } }
export const Vertical: Story = { args: { layout: 'vertical', bordered: true, items, column: 2 } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from 'antd'

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  title: 'Components/Tabs',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's tabs types — written from the API.
  argTypes: {
    items: { description: 'The list of tabs.', control: false },
    type: { description: 'Visual style of the tab strip.', control: 'select', options: ['line', 'card', 'editable-card'] },
    centered: { description: 'Centers the tab strip instead of left-aligning it.', control: 'boolean' },
    size: { description: 'Size of the tab strip.', control: 'select', options: ['large', 'middle', 'small'] },
  },
}
export default meta
type Story = StoryObj<typeof Tabs>

const items = [
  { key: '1', label: 'Tab 1', children: 'Content of Tab Pane 1' },
  { key: '2', label: 'Tab 2', children: 'Content of Tab Pane 2' },
  { key: '3', label: 'Tab 3', children: 'Content of Tab Pane 3' },
]

export const Line: Story = { args: { items, defaultActiveKey: '1' } }
export const Card: Story = { args: { items, type: 'card' } }
export const Centered: Story = { args: { items, centered: true } }
export const Small: Story = { args: { items, size: 'small' } }

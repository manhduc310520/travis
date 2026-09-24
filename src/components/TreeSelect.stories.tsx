import type { Meta, StoryObj } from '@storybook/react-vite'
import { TreeSelect } from 'antd'

const meta: Meta<typeof TreeSelect> = {
  component: TreeSelect,
  title: 'Components/TreeSelect',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc found on these in antd's tree-select types — written from the API.
  argTypes: {
    treeData: { description: 'The nested list of selectable nodes.', control: false },
    treeCheckable: { description: 'Shows checkboxes and allows selecting multiple nodes.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof TreeSelect>

const treeData = [
  {
    title: 'Parent 1', value: 'parent-1',
    children: [{ title: 'Child 1-1', value: 'child-1-1' }, { title: 'Child 1-2', value: 'child-1-2' }],
  },
  { title: 'Parent 2', value: 'parent-2', children: [{ title: 'Child 2-1', value: 'child-2-1' }] },
]

export const Default: Story = { args: { treeData, placeholder: 'Please select', style: { width: 280 } } }
export const Checkable: Story = { args: { treeData, treeCheckable: true, placeholder: 'Please select', style: { maxWidth: 320 } } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { TreeSelect } from 'antd'

const meta: Meta<typeof TreeSelect> = {
  component: TreeSelect,
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
    title: 'Đồ uống', value: 'drink',
    children: [{ title: 'Trà sữa', value: 'milktea' }, { title: 'Cà phê', value: 'coffee' }],
  },
  { title: 'Đồ ăn', value: 'food', children: [{ title: 'Gà rán', value: 'chicken' }] },
]

export const Default: Story = { args: { treeData, placeholder: 'Chọn nhóm món', style: { width: 280 } } }
export const Checkable: Story = { args: { treeData, treeCheckable: true, placeholder: 'Chọn nhiều', style: { maxWidth: 320 } } }

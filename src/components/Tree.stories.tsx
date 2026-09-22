import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tree } from 'antd'

const meta: Meta<typeof Tree> = { component: Tree, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Tree>

const treeData = [
  {
    title: 'Đồ uống',
    key: 'drink',
    children: [
      { title: 'Trà sữa', key: 'milktea' },
      { title: 'Cà phê', key: 'coffee' },
    ],
  },
  { title: 'Đồ ăn', key: 'food', children: [{ title: 'Gà rán', key: 'chicken' }] },
]

export const Default: Story = { args: { treeData, defaultExpandAll: true } }
export const Checkable: Story = { args: { treeData, checkable: true, defaultExpandAll: true } }

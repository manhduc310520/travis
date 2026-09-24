import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tree } from 'antd'

const meta: Meta<typeof Tree> = {
  component: Tree,
  title: 'Components/Tree',
  tags: ['ai-generated', 'needs-work'],
  // `defaultExpandAll`'s description is antd's own JSDoc from Tree.d.ts,
  // copied as-is. `treeData`/`checkable` have no JSDoc there.
  argTypes: {
    treeData: { description: 'The nested list of nodes.', control: false },
    defaultExpandAll: { description: 'Expand all tree nodes by default.', control: 'boolean' },
    checkable: { description: 'Shows a checkbox on every node.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Tree>

const treeData = [
  {
    title: 'Parent 1',
    key: 'parent-1',
    children: [
      { title: 'Child 1-1', key: 'child-1-1' },
      { title: 'Child 1-2', key: 'child-1-2' },
    ],
  },
  { title: 'Parent 2', key: 'parent-2', children: [{ title: 'Child 2-1', key: 'child-2-1' }] },
]

export const Default: Story = { args: { treeData, defaultExpandAll: true } }
export const Checkable: Story = { args: { treeData, checkable: true, defaultExpandAll: true } }

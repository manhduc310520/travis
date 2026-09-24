import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dropdown, Button, Space } from 'antd'
import { ChevronDown, Edit01, Eye, Trash01 } from '../icons'
const meta: Meta<typeof Dropdown> = { component: Dropdown, title: 'Components/Dropdown', tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Dropdown>

const items = [
  { key: 'view', icon: <Eye />, label: 'View' },
  { key: 'edit', icon: <Edit01 />, label: 'Edit' },
  { type: 'divider' as const },
  { key: 'delete', icon: <Trash01 />, label: 'Delete', danger: true },
]

export const Default: Story = {
  render: () => (
    <Dropdown menu={{ items }}>
      <Button>
        <Space>Hover me<ChevronDown /></Space>
      </Button>
    </Dropdown>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <div style={{ height: 220 }}>
      <Dropdown menu={{ items }} open>
        <Button>Actions</Button>
      </Dropdown>
    </div>
  ),
}

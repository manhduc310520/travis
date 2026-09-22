import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dropdown, Button, Space } from 'antd'
import { ChevronDown, Edit01, Eye, Trash01 } from '../icons'
const meta: Meta<typeof Dropdown> = { component: Dropdown, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Dropdown>

const items = [
  { key: 'view', icon: <Eye />, label: 'Xem' },
  { key: 'edit', icon: <Edit01 />, label: 'Sửa' },
  { type: 'divider' as const },
  { key: 'delete', icon: <Trash01 />, label: 'Xoá', danger: true },
]

export const Default: Story = {
  render: () => (
    <Dropdown menu={{ items }}>
      <Button>
        <Space>Tiện ích<ChevronDown /></Space>
      </Button>
    </Dropdown>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <div style={{ height: 220 }}>
      <Dropdown menu={{ items }} open>
        <Button>Tiện ích</Button>
      </Dropdown>
    </div>
  ),
}

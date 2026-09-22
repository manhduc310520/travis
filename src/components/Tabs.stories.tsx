import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from 'antd'

const meta: Meta<typeof Tabs> = { component: Tabs, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Tabs>

const items = [
  { key: '1', label: 'Thông tin chung', children: 'Tên, địa chỉ, số điện thoại' },
  { key: '2', label: 'Thực đơn', children: 'Danh sách món và giá' },
  { key: '3', label: 'Nhân viên', children: 'Ca làm và phân quyền' },
]

export const Line: Story = { args: { items, defaultActiveKey: '1' } }
export const Card: Story = { args: { items, type: 'card' } }
export const Centered: Story = { args: { items, centered: true } }
export const Small: Story = { args: { items, size: 'small' } }

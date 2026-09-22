import type { Meta, StoryObj } from '@storybook/react-vite'
import { Menu } from 'antd'
import { Building02, PieChart01, Settings01, Users01 } from '../icons'
const meta: Meta<typeof Menu> = { component: Menu, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Menu>

const items = [
  { key: 'home', icon: <PieChart01 />, label: 'Trang chủ' },
  {
    key: 'restaurants', icon: <Building02 />, label: 'Nhà hàng',
    children: [
      { key: 'list', label: 'Danh sách nhà hàng' },
      { key: 'payment', label: 'Phương thức thanh toán' },
      { key: 'area', label: 'Khu vực' },
    ],
  },
  { key: 'staff', icon: <Users01 />, label: 'Nhân viên' },
  { key: 'devices', icon: <Settings01 />, label: 'Thiết bị' },
]

export const Inline: Story = {
  render: () => (
    <Menu mode="inline" defaultSelectedKeys={['list']} defaultOpenKeys={['restaurants']} items={items} style={{ width: 240 }} />
  ),
}

export const Horizontal: Story = {
  render: () => <Menu mode="horizontal" defaultSelectedKeys={['home']} items={items.slice(0, 3)} />,
}

export const Collapsed: Story = {
  render: () => <Menu mode="inline" inlineCollapsed defaultSelectedKeys={['home']} items={items} style={{ width: 80 }} />,
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from 'antd'
import { Home01 } from '../icons'
const meta: Meta<typeof Breadcrumb> = { component: Breadcrumb, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Breadcrumb>

export const Default: Story = {
  args: { items: [{ title: 'Trang chủ' }, { title: 'Nhà hàng' }, { title: 'Danh sách nhà hàng' }] },
}

export const WithIcon: Story = {
  args: {
    items: [
      { title: <Home01 /> },
      { title: <a href="#">Nhà hàng</a> },
      { title: 'Danh sách nhà hàng' },
    ],
  },
}

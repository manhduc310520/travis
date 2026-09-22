import type { Meta, StoryObj } from '@storybook/react-vite'
import { Anchor } from 'antd'

const meta: Meta<typeof Anchor> = { component: Anchor, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Anchor>

export const Default: Story = {
  args: {
    items: [
      { key: '1', href: '#general', title: 'Thông tin chung' },
      { key: '2', href: '#menu', title: 'Thực đơn' },
      { key: '3', href: '#staff', title: 'Nhân viên' },
    ],
  },
}

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    items: [
      { key: '1', href: '#general', title: 'Thông tin chung' },
      { key: '2', href: '#menu', title: 'Thực đơn' },
    ],
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Steps } from 'antd'

const meta: Meta<typeof Steps> = { component: Steps, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Steps>

const items = [
  { title: 'Thông tin', description: 'Tên và địa chỉ' },
  { title: 'Thực đơn', description: 'Nhập món' },
  { title: 'Hoàn tất', description: 'Kiểm tra lại' },
]

export const Horizontal: Story = { args: { current: 1, items } }
export const Vertical: Story = { args: { current: 1, orientation: 'vertical', items } }
export const Small: Story = { args: { current: 1, size: 'small', items } }
export const WithError: Story = { args: { current: 1, status: 'error', items } }

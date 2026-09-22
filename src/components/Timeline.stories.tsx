import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline } from 'antd'

const meta: Meta<typeof Timeline> = { component: Timeline, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Timeline>

const items = [
  { children: 'Tạo nhà hàng 09:00' },
  { children: 'Nhập thực đơn 10:30', color: 'green' },
  { children: 'Kết nối máy POS 14:00', color: 'red' },
  { children: 'Bắt đầu bán 18:00' },
]

export const Default: Story = { args: { items } }
export const Alternate: Story = { args: { items, mode: 'alternate' } }

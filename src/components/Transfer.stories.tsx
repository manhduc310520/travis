import type { Meta, StoryObj } from '@storybook/react-vite'
import { Transfer } from 'antd'

const meta: Meta<typeof Transfer> = { component: Transfer, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Transfer>

const dataSource = Array.from({ length: 8 }, (_, i) => ({
  key: String(i), title: `Món số ${i + 1}`,
}))

export const Default: Story = {
  args: {
    dataSource,
    targetKeys: ['1', '3'],
    render: (item) => item.title ?? '',
    titles: ['Chưa chọn', 'Đã chọn'],
  },
}

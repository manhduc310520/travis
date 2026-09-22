import type { Meta, StoryObj } from '@storybook/react-vite'
import { Empty, Button } from 'antd'

const meta: Meta<typeof Empty> = { component: Empty, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Empty>

export const Default: Story = { args: { description: 'Không tìm thấy dữ liệu' } }

export const WithAction: Story = {
  args: {
    description: 'Hãy thay đổi bộ lọc hoặc điều kiện tìm kiếm',
    children: <Button type="primary">Xoá tìm kiếm và bộ lọc</Button>,
  },
}

export const Simple: Story = { args: { image: Empty.PRESENTED_IMAGE_SIMPLE, description: 'Trống' } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag, Space } from 'antd'

const meta: Meta<typeof Tag> = { component: Tag, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Tag>

const presets = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']

export const Default: Story = { args: { children: 'Đang hoạt động' } }

export const Status: Story = {
  render: () => (
    <Space wrap>
      <Tag color="success">Thành công</Tag>
      <Tag color="processing">Đang xử lý</Tag>
      <Tag color="warning">Cảnh báo</Tag>
      <Tag color="error">Lỗi</Tag>
      <Tag color="default">Tạm dừng</Tag>
    </Space>
  ),
}

export const Presets: Story = {
  render: () => (
    <Space wrap>
      {presets.map((c) => (
        <Tag key={c} color={c}>{c}</Tag>
      ))}
    </Space>
  ),
}

export const Closable: Story = { args: { children: 'Hà Nội', closable: true } }

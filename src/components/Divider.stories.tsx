import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider, Typography } from 'antd'

const meta: Meta<typeof Divider> = { component: Divider, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Divider>

export const Horizontal: Story = {
  render: () => (
    <div>
      <Typography.Text>Phần trên</Typography.Text>
      <Divider />
      <Typography.Text>Phần dưới</Typography.Text>
    </div>
  ),
}

export const WithTitle: Story = { args: { children: 'Thông tin cửa hàng' } }

export const Dashed: Story = { args: { dashed: true } }

export const Vertical: Story = {
  render: () => (
    <div>
      <Typography.Text>Sửa</Typography.Text>
      <Divider orientation="vertical" />
      <Typography.Text>Xoá</Typography.Text>
      <Divider orientation="vertical" />
      <Typography.Text>Nhân bản</Typography.Text>
    </div>
  ),
}

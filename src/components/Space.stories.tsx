import type { Meta, StoryObj } from '@storybook/react-vite'
import { Space, Button } from 'antd'

const meta: Meta<typeof Space> = { component: Space, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Space>

export const Horizontal: Story = {
  render: () => (
    <Space>
      <Button type="primary">Lưu</Button>
      <Button>Huỷ</Button>
    </Space>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Space orientation="vertical">
      <Button type="primary">Lưu</Button>
      <Button>Huỷ</Button>
    </Space>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Space orientation="vertical" size="large">
      <Space size="small"><Button>small</Button><Button>small</Button></Space>
      <Space size="middle"><Button>middle</Button><Button>middle</Button></Space>
      <Space size="large"><Button>large</Button><Button>large</Button></Space>
    </Space>
  ),
}

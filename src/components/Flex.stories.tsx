import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flex, Button } from 'antd'

const meta: Meta<typeof Flex> = { component: Flex, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Flex>

export const Gap: Story = {
  render: () => (
    <Flex gap="middle">
      <Button type="primary">Một</Button>
      <Button>Hai</Button>
      <Button>Ba</Button>
    </Flex>
  ),
}

export const SpaceBetween: Story = {
  render: () => (
    <Flex justify="space-between" style={{ width: 480 }}>
      <Button>Trái</Button>
      <Button>Phải</Button>
    </Flex>
  ),
}

export const VerticalStack: Story = {
  render: () => (
    <Flex vertical gap="small" style={{ width: 240 }}>
      <Button type="primary">Tạo nhà hàng</Button>
      <Button>Nhập từ file</Button>
    </Flex>
  ),
}

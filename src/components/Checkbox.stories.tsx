import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox, Space } from 'antd'

const meta: Meta<typeof Checkbox> = { component: Checkbox, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = { args: { children: 'Nhận thông báo' } }
export const Checked: Story = { args: { children: 'Nhận thông báo', defaultChecked: true } }
export const Disabled: Story = { args: { children: 'Không khả dụng', disabled: true } }
export const Group: Story = {
  render: () => (
    <Space orientation="vertical">
      <Checkbox defaultChecked>Hà Nội</Checkbox>
      <Checkbox>Đà Nẵng</Checkbox>
      <Checkbox indeterminate>TP. Hồ Chí Minh</Checkbox>
    </Space>
  ),
}

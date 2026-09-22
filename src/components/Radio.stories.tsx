import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio, Space } from 'antd'

const meta: Meta<typeof Radio> = { component: Radio, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Radio>

export const Group: Story = {
  render: () => (
    <Radio.Group defaultValue="all">
      <Space orientation="vertical">
        <Radio value="all">Tất cả thành phố</Radio>
        <Radio value="hn">Hà Nội</Radio>
        <Radio value="dn">Đà Nẵng</Radio>
      </Space>
    </Radio.Group>
  ),
}

export const ButtonGroup: Story = {
  render: () => (
    <Radio.Group defaultValue="week" buttonStyle="solid">
      <Radio.Button value="day">Ngày</Radio.Button>
      <Radio.Button value="week">Tuần</Radio.Button>
      <Radio.Button value="month">Tháng</Radio.Button>
    </Radio.Group>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Radio.Group defaultValue="a" disabled>
      <Radio value="a">Khoá</Radio>
      <Radio value="b">Khoá</Radio>
    </Radio.Group>
  ),
}

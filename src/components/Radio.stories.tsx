import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio, Space } from 'antd'

const meta: Meta<typeof Radio> = {
  component: Radio,
  title: 'Components/Radio',
  tags: ['ai-generated', 'needs-work'],
  // Every story renders `Radio.Group`/`Radio.Button`, not the bare `Radio`
  // named in this meta's `component` — `buttonStyle`/`defaultValue` belong
  // to `Radio.Group`, a different component, so they aren't listed here.
  // Adding a default so the Docs page's argTypes table has something to key
  // off (it doesn't render with zero args across every story).
  args: { disabled: false },
  argTypes: {
    disabled: { description: 'Disables this radio.', control: 'boolean' },
  },
}
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

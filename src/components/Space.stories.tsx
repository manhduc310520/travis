import type { Meta, StoryObj } from '@storybook/react-vite'
import { Space, Button } from 'antd'

const meta: Meta<typeof Space> = {
  component: Space,
  title: 'Components/Space',
  tags: ['ai-generated', 'needs-work'],
  // Every story uses a custom `render`, none set `args` — the Docs page's
  // argTypes table only renders once at least one arg exists. No JSDoc on
  // these in antd's space types — written from the API.
  args: { orientation: 'horizontal' },
  argTypes: {
    orientation: { description: 'Stacking direction of the children.', control: 'select', options: ['horizontal', 'vertical'] },
    size: { description: 'Gap between children.', control: 'select', options: ['small', 'middle', 'large'] },
  },
}
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

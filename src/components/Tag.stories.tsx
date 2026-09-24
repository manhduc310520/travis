import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag, Space } from 'antd'
import { XClose } from '../icons'

const meta: Meta<typeof Tag> = {
  component: Tag,
  title: 'Components/Tag',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's tag types — written from the API.
  argTypes: {
    color: { description: 'Preset semantic color (success/error/...) or one of the palette colors (magenta/blue/...).', control: 'text' },
    closable: { description: 'Shows a close ("x") affordance that removes the tag.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Tag>

const presets = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']

export const Default: Story = { args: { children: 'Tag' } }

export const Status: Story = {
  render: () => (
    <Space wrap>
      <Tag color="success">Success</Tag>
      <Tag color="processing">Processing</Tag>
      <Tag color="warning">Warning</Tag>
      <Tag color="error">Error</Tag>
      <Tag color="default">Default</Tag>
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

export const Closable: Story = { args: { children: 'Closable', closable: true, closeIcon: <XClose size={10} /> } }

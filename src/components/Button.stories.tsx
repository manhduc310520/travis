import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button, Space } from 'antd'
import { Plus } from '../icons'
const meta = {
  component: Button,
  tags: ['ai-generated', 'needs-work'],
  args: { children: 'Tạo nhà hàng' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { type: 'primary' },
  play: async ({ canvas }) => {
    const btn = canvas.getByRole('button', { name: /tạo nhà hàng/i })
    await expect(btn).toHaveTextContent('Tạo nhà hàng')
  },
}

export const Default: Story = { args: { type: 'default' } }

export const Disabled: Story = {
  args: { type: 'primary', disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toBeDisabled()
  },
}

export const WithIcon: Story = {
  args: { type: 'primary', icon: <Plus /> },
}

export const Sizes: Story = {
  render: (args) => (
    <Space>
      <Button {...args} size="small" />
      <Button {...args} size="middle" />
      <Button {...args} size="large" />
    </Space>
  ),
  args: { type: 'primary' },
}

export const AllTypes: Story = {
  render: () => (
    <Space wrap>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
      <Button type="text">Text</Button>
      <Button type="link">Link</Button>
      <Button danger>Danger</Button>
    </Space>
  ),
}

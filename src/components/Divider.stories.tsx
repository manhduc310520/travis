import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider, Typography } from 'antd'

const meta: Meta<typeof Divider> = { component: Divider, title: 'Components/Divider', tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Divider>

export const Horizontal: Story = {
  render: () => (
    <div>
      <Typography.Text>Text above</Typography.Text>
      <Divider />
      <Typography.Text>Text below</Typography.Text>
    </div>
  ),
}

export const WithTitle: Story = { args: { children: 'Text' } }

export const Dashed: Story = { args: { dashed: true } }

export const Vertical: Story = {
  render: () => (
    <div>
      <Typography.Text>Text</Typography.Text>
      <Divider orientation="vertical" />
      <Typography.Text>Link</Typography.Text>
      <Divider orientation="vertical" />
      <Typography.Text>Link</Typography.Text>
    </div>
  ),
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, Space } from 'antd'
import { User01 } from '../icons'
const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: 'Components/Avatar',
  tags: ['ai-generated', 'needs-work'],
  // `shape`/`icon` descriptions are antd's own JSDoc from avatar.d.ts,
  // copied as-is. `size` has no JSDoc there.
  argTypes: {
    shape: { description: 'Shape of avatar.', control: 'select', options: ['circle', 'square'] },
    size: { description: 'Size of the avatar.', control: 'select', options: ['small', 'default', 'large'] },
    icon: { description: 'Icon to be used in avatar.', control: false },
  },
}
export default meta
type Story = StoryObj<typeof Avatar>

export const Icon: Story = { args: { icon: <User01 /> } }
export const Text: Story = { args: { children: 'CN' } }

export const Sizes: Story = {
  render: () => (
    <Space>
      <Avatar size="small" icon={<User01 />} />
      <Avatar icon={<User01 />} />
      <Avatar size="large" icon={<User01 />} />
    </Space>
  ),
}

export const Group: Story = {
  render: () => (
    <Avatar.Group max={{ count: 3 }}>
      <Avatar>A</Avatar>
      <Avatar>B</Avatar>
      <Avatar>C</Avatar>
      <Avatar>D</Avatar>
    </Avatar.Group>
  ),
}

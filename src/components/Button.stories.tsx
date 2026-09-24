import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button, Space } from 'antd'
import { Plus } from '../icons'
const meta = {
  component: Button,
  title: 'Components/Button',
  tags: ['ai-generated', 'needs-work'],
  args: { children: 'Button' },
  // Ant Design's own BaseButtonProps carries no JSDoc for these — unlike
  // Alert/Divider/Steps elsewhere in this project, there's no official text
  // to copy. Descriptions below are written from the actual API surface,
  // not guessed: each is basic, unambiguous behavior (verified against
  // button.d.ts), not an inferred detail.
  argTypes: {
    type: {
      description: 'Visual style of the button.',
      control: 'select',
      options: ['primary', 'default', 'dashed', 'text', 'link'],
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      description: 'Button height.',
      control: 'select',
      options: ['large', 'middle', 'small'],
      table: { defaultValue: { summary: 'middle' } },
    },
    disabled: { description: 'Disables the button — no click, no hover/active states.', control: 'boolean' },
    danger: { description: 'Recolors the button to the danger/error semantic color.', control: 'boolean' },
    ghost: { description: 'Makes the background transparent, for use on a colored surface.', control: 'boolean' },
    block: { description: 'Stretches the button to fill the width of its parent.', control: 'boolean' },
    loading: { description: 'Shows a spinner and disables the button while true.', control: 'boolean' },
    icon: { description: 'Icon rendered before the label.', control: false },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { type: 'primary' },
  play: async ({ canvas }) => {
    const btn = canvas.getByRole('button', { name: /button/i })
    await expect(btn).toHaveTextContent('Button')
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

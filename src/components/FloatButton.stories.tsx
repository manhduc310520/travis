import type { Meta, StoryObj } from '@storybook/react-vite'
import { FloatButton } from 'antd'
import { HelpCircle, Plus } from '../icons'
const meta: Meta<typeof FloatButton> = {
  component: FloatButton,
  title: 'Components/FloatButton',
  tags: ['ai-generated', 'needs-work'],
  // Every story uses a custom `render`, none set `args` — the Docs page's
  // argTypes table only renders once at least one arg exists.
  args: { type: 'default' },
  // No JSDoc found on these in antd's float-button types — written from the API.
  argTypes: {
    type: { description: 'Visual style of the button.', control: 'select', options: ['default', 'primary'] },
    icon: { description: 'Icon shown inside the button.', control: false },
  },
}
export default meta
type Story = StoryObj<typeof FloatButton>

export const Default: Story = {
  render: () => (
    <div style={{ height: 240, position: 'relative' }}>
      <FloatButton icon={<HelpCircle />} style={{ position: 'absolute', right: 24, bottom: 24 }} />
    </div>
  ),
}

export const PrimaryType: Story = {
  render: () => (
    <div style={{ height: 240, position: 'relative' }}>
      <FloatButton type="primary" icon={<Plus />} style={{ position: 'absolute', right: 24, bottom: 24 }} />
    </div>
  ),
}

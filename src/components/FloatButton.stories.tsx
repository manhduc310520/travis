import type { Meta, StoryObj } from '@storybook/react-vite'
import { FloatButton } from 'antd'
import { HelpCircle, Plus } from '../icons'
const meta: Meta<typeof FloatButton> = { component: FloatButton, tags: ['ai-generated', 'needs-work'] }
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

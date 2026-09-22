import type { Meta, StoryObj } from '@storybook/react-vite'
import { Mentions } from 'antd'

const meta: Meta<typeof Mentions> = { component: Mentions, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Mentions>

export const Default: Story = {
  args: {
    placeholder: 'Gõ @ để nhắc tên',
    style: { width: 320 },
    options: [{ value: 'chanh', label: 'chanh' }, { value: 'travis', label: 'travis' }],
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, Button } from 'antd'

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: 'Components/Tooltip',
  tags: ['ai-generated', 'needs-work'],
  // The story uses a custom `render` with no `args` — the Docs page's
  // argTypes table only renders once at least one arg exists. No JSDoc on
  // `title` in antd's tooltip types — written from the API.
  args: { title: 'Prompt text' },
  argTypes: {
    title: { description: 'Content shown in the tooltip popup.', control: 'text' },
  },
}
export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <div style={{ height: 160, paddingTop: 60 }}>
      <Tooltip title="Prompt text" open>
        <Button>Hover me</Button>
      </Tooltip>
    </div>
  ),
}

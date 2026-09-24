import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover, Button } from 'antd'

const meta: Meta<typeof Popover> = {
  component: Popover,
  title: 'Components/Popover',
  tags: ['ai-generated', 'needs-work'],
  // The story uses a custom `render` with no `args` — the Docs page's
  // argTypes table only renders once at least one arg exists. No JSDoc on
  // these in antd's popover types — written from the API.
  args: { title: 'Title' },
  argTypes: {
    title: { description: 'Title shown at the top of the popup.', control: 'text' },
    content: { description: 'Body content of the popup.', control: false },
  },
}
export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <div style={{ height: 240, paddingTop: 100 }}>
      <Popover title="Title" content={<div>Content<br />Content</div>} open>
        <Button>Hover me</Button>
      </Popover>
    </div>
  ),
}

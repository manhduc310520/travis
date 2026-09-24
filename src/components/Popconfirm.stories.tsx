import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popconfirm, Button } from 'antd'

const meta: Meta<typeof Popconfirm> = {
  component: Popconfirm,
  title: 'Components/Popconfirm',
  tags: ['ai-generated', 'needs-work'],
  // The story uses a custom `render` with no `args` — the Docs page's
  // argTypes table only renders once at least one arg exists. No JSDoc on
  // these in antd's popconfirm types — written from the API.
  args: { title: 'Are you sure to delete this task?' },
  argTypes: {
    title: { description: 'Confirmation question shown in the popup.', control: 'text' },
    okText: { description: 'Text of the confirm button.', control: 'text' },
    cancelText: { description: 'Text of the cancel button.', control: 'text' },
  },
}
export default meta
type Story = StoryObj<typeof Popconfirm>

export const Default: Story = {
  render: () => (
    <div style={{ height: 200, paddingTop: 80 }}>
      <Popconfirm title="Are you sure to delete this task?" okText="Yes" cancelText="No" open>
        <Button danger>Delete</Button>
      </Popconfirm>
    </div>
  ),
}

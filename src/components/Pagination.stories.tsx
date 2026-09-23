import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from 'antd'

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  title: 'Components/Pagination',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's pagination types — written from the API.
  argTypes: {
    total: { description: 'Total number of items being paginated.', control: 'number' },
    showSizeChanger: { description: 'Shows a control to change how many items per page.', control: 'boolean' },
    showQuickJumper: { description: 'Shows an input to jump directly to a page number.', control: 'boolean' },
    simple: { description: 'Compact layout — just prev/next and a page input.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = { args: { total: 240, defaultCurrent: 1 } }
export const WithSizeChanger: Story = { args: { total: 240, showSizeChanger: true, showQuickJumper: true } }
export const Small: Story = { args: { total: 240, size: 'small' } }
export const Simple: Story = { args: { total: 240, simple: true } }

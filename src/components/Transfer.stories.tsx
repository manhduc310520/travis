import type { Meta, StoryObj } from '@storybook/react-vite'
import { Transfer } from 'antd'

const meta: Meta<typeof Transfer> = {
  component: Transfer,
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's transfer types — written from the API.
  argTypes: {
    dataSource: { description: 'The full list of items to move between the two lists.', control: false },
    targetKeys: { description: 'Keys currently on the right (target) side.', control: false },
    titles: { description: 'Header text for the [left, right] lists.', control: false },
  },
}
export default meta
type Story = StoryObj<typeof Transfer>

const dataSource = Array.from({ length: 8 }, (_, i) => ({
  key: String(i), title: `Món số ${i + 1}`,
}))

export const Default: Story = {
  args: {
    dataSource,
    targetKeys: ['1', '3'],
    render: (item) => item.title ?? '',
    titles: ['Chưa chọn', 'Đã chọn'],
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Descriptions } from 'antd'

const meta: Meta<typeof Descriptions> = {
  component: Descriptions,
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's descriptions/index.d.ts — written from the API.
  argTypes: {
    title: { description: 'Title shown above the list.', control: 'text' },
    bordered: { description: 'Draws borders around each label/value cell.', control: 'boolean' },
    column: { description: 'Number of label/value pairs per row.', control: 'number' },
    layout: { description: 'Label position relative to its value.', control: 'select', options: ['horizontal', 'vertical'] },
  },
}
export default meta
type Story = StoryObj<typeof Descriptions>

const items = [
  { key: '1', label: 'Pos ID', children: 'POS-1042' },
  { key: '2', label: 'Tên nhà hàng', children: 'Trà sữa 344' },
  { key: '3', label: 'Địa điểm', children: 'Cầu Giấy, Hà Nội' },
  { key: '4', label: 'Số điện thoại', children: '0900 000 000' },
]

export const Default: Story = { args: { title: 'Thông tin nhà hàng', items } }
export const Bordered: Story = { args: { title: 'Thông tin nhà hàng', bordered: true, items, column: 2 } }
export const Vertical: Story = { args: { layout: 'vertical', bordered: true, items, column: 2 } }

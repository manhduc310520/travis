import type { Meta, StoryObj } from '@storybook/react-vite'
import { Collapse } from 'antd'

const meta: Meta<typeof Collapse> = {
  component: Collapse,
  tags: ['ai-generated', 'needs-work'],
  // `accordion`'s only JSDoc in antd's Collapse.d.ts is Chinese-only
  // ("手风琴效果" — accordion effect); described here in English from the
  // verified behavior instead of machine-translating that comment.
  // `items`/`defaultActiveKey` have no JSDoc at all.
  argTypes: {
    items: { description: 'The list of panels.', control: false },
    defaultActiveKey: { description: 'Key(s) expanded on initial render (uncontrolled).', control: false },
    accordion: { description: 'Only one panel can be open at a time; opening one closes the others.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Collapse>

const items = [
  { key: '1', label: 'Thông tin chung', children: <p>Tên, địa chỉ, số điện thoại</p> },
  { key: '2', label: 'Giờ mở cửa', children: <p>07:00 đến 22:00</p> },
  { key: '3', label: 'Phương thức thanh toán', children: <p>Tiền mặt, thẻ, ví điện tử</p> },
]

export const Default: Story = { args: { items, defaultActiveKey: ['1'], style: { maxWidth: 480 } } }
export const Accordion: Story = { args: { items, accordion: true, style: { maxWidth: 480 } } }

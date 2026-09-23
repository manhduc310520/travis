import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cascader } from 'antd'

const meta: Meta<typeof Cascader> = {
  component: Cascader,
  title: 'Components/Cascader',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's cascader types — written from the API.
  argTypes: {
    options: { description: 'The nested list of selectable options.', control: false },
    multiple: { description: 'Allows selecting more than one leaf/branch at once.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Cascader>

const options = [
  { value: 'hn', label: 'Hà Nội', children: [{ value: 'cg', label: 'Cầu Giấy' }, { value: 'dd', label: 'Đống Đa' }] },
  { value: 'hcm', label: 'TP. Hồ Chí Minh', children: [{ value: 'q1', label: 'Quận 1' }] },
]

export const Default: Story = { args: { options, placeholder: 'Chọn khu vực', style: { width: 280 } } }
export const Multiple: Story = { args: { options, multiple: true, placeholder: 'Chọn nhiều', style: { maxWidth: 320 } } }

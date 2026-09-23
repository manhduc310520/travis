import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from 'antd'

const meta: Meta<typeof Select> = {
  component: Select,
  title: 'Components/Select',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's select/index.d.ts — written from the API
  // surface. `mode` options are the public SelectProps union ('multiple' |
  // 'tags') — the internal type also lists 'combobox' and a
  // SECRET_COMBOBOX constant, neither of which is part of the public API.
  argTypes: {
    options: { description: 'The list of selectable options.', control: false },
    mode: {
      description: 'Set to allow multiple selections; "tags" also lets the user type a value not in options.',
      control: 'select',
      options: [undefined, 'multiple', 'tags'],
    },
    showSearch: { description: 'Whether the typed input filters the option list.', control: 'boolean' },
    disabled: { description: 'Disables the select.', control: 'boolean' },
    status: {
      description: 'Validation state — colors the border and focus ring.',
      control: 'select',
      options: ['', 'warning', 'error'],
    },
  },
}
export default meta
type Story = StoryObj<typeof Select>

const options = [
  { value: 'all', label: 'Tất cả thành phố' },
  { value: 'hn', label: 'Hà Nội' },
  { value: 'dn', label: 'Đà Nẵng' },
  { value: 'hcm', label: 'TP. Hồ Chí Minh' },
]

export const Default: Story = { args: { options, defaultValue: 'all', style: { width: 240 } } }
export const Multiple: Story = { args: { options, mode: 'multiple', defaultValue: ['hn', 'dn'], style: { maxWidth: 320 } } }
export const Searchable: Story = { args: { options, showSearch: true, placeholder: 'Chọn thành phố', style: { width: 240 } } }
export const Disabled: Story = { args: { options, defaultValue: 'all', disabled: true, style: { width: 240 } } }
export const Invalid: Story = { args: { options, status: 'error', placeholder: 'Bắt buộc chọn', style: { width: 240 } } }

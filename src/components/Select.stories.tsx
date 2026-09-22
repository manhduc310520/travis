import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from 'antd'

const meta: Meta<typeof Select> = { component: Select, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Select>

const options = [
  { value: 'all', label: 'Tất cả thành phố' },
  { value: 'hn', label: 'Hà Nội' },
  { value: 'dn', label: 'Đà Nẵng' },
  { value: 'hcm', label: 'TP. Hồ Chí Minh' },
]

export const Default: Story = { args: { options, defaultValue: 'all', style: { width: 240 } } }
export const Multiple: Story = { args: { options, mode: 'multiple', defaultValue: ['hn', 'dn'], style: { width: 320 } } }
export const Searchable: Story = { args: { options, showSearch: true, placeholder: 'Chọn thành phố', style: { width: 240 } } }
export const Disabled: Story = { args: { options, defaultValue: 'all', disabled: true, style: { width: 240 } } }
export const Invalid: Story = { args: { options, status: 'error', placeholder: 'Bắt buộc chọn', style: { width: 240 } } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { AutoComplete } from 'antd'

const meta: Meta<typeof AutoComplete> = { component: AutoComplete, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof AutoComplete>

const options = [{ value: 'Trà sữa 344' }, { value: 'Trà sữa 345' }, { value: 'Gà rán 365' }]

export const Default: Story = { args: { options, placeholder: 'Tìm nhà hàng', style: { width: 280 } } }
export const Disabled: Story = { args: { options, disabled: true, placeholder: 'Khoá', style: { width: 280 } } }

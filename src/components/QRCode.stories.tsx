import type { Meta, StoryObj } from '@storybook/react-vite'
import { QRCode } from 'antd'

const meta: Meta<typeof QRCode> = { component: QRCode, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof QRCode>

export const Default: Story = { args: { value: 'https://ipos.vn' } }
export const WithIconSlot: Story = { args: { value: 'https://ipos.vn', size: 160, bordered: true } }

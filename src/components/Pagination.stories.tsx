import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from 'antd'

const meta: Meta<typeof Pagination> = { component: Pagination, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = { args: { total: 240, defaultCurrent: 1 } }
export const WithSizeChanger: Story = { args: { total: 240, showSizeChanger: true, showQuickJumper: true } }
export const Small: Story = { args: { total: 240, size: 'small' } }
export const Simple: Story = { args: { total: 240, simple: true } }

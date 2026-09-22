import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from 'antd'

const meta: Meta<typeof Skeleton> = { component: Skeleton, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = { args: { style: { maxWidth: 480 } } }
export const WithAvatar: Story = { args: { avatar: true, paragraph: { rows: 3 }, style: { maxWidth: 480 } } }
export const Active: Story = { args: { active: true, style: { maxWidth: 480 } } }

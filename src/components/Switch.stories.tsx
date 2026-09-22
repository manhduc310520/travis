import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from 'antd'

const meta: Meta<typeof Switch> = { component: Switch, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = { args: { defaultChecked: true } }
export const Small: Story = { args: { size: 'small', defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } }
export const WithLabels: Story = { args: { checkedChildren: 'Bật', unCheckedChildren: 'Tắt', defaultChecked: true } }

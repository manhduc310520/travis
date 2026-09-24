import type { Meta, StoryObj } from '@storybook/react-vite'
import { Menu } from 'antd'
import { Building02, PieChart01, Settings01, Users01 } from '../icons'
const meta: Meta<typeof Menu> = {
  component: Menu,
  title: 'Components/Menu',
  tags: ['ai-generated', 'needs-work'],
  // Every story uses a custom `render`, none set `args` — the Docs page's
  // argTypes table only renders once at least one arg exists. No JSDoc on
  // these in antd's menu types — written from the API.
  args: { mode: 'inline' },
  argTypes: {
    mode: { description: 'Layout direction of the menu.', control: 'select', options: ['vertical', 'horizontal', 'inline'] },
    items: { description: 'The list of menu items, nestable via `children`.', control: false },
    inlineCollapsed: { description: 'Collapses to icon-only width (mode="inline" only).', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Menu>

const items = [
  { key: 'home', icon: <PieChart01 />, label: 'Navigation One' },
  {
    key: 'restaurants', icon: <Building02 />, label: 'Navigation Two',
    children: [
      { key: 'list', label: 'Option 1' },
      { key: 'payment', label: 'Option 2' },
      { key: 'area', label: 'Option 3' },
    ],
  },
  { key: 'staff', icon: <Users01 />, label: 'Navigation Three' },
  { key: 'devices', icon: <Settings01 />, label: 'Navigation Four' },
]

export const Inline: Story = {
  render: () => (
    <Menu mode="inline" defaultSelectedKeys={['list']} defaultOpenKeys={['restaurants']} items={items} style={{ width: 240 }} />
  ),
}

export const Horizontal: Story = {
  render: () => <Menu mode="horizontal" defaultSelectedKeys={['home']} items={items.slice(0, 3)} />,
}

export const Collapsed: Story = {
  render: () => <Menu mode="inline" inlineCollapsed defaultSelectedKeys={['home']} items={items} style={{ width: 80 }} />,
}

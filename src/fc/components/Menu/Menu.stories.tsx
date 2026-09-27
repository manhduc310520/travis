import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Key } from 'react-aria-components'
import {
  BarChart01,
  BookOpen01,
  Building02,
  ChevronLeftDouble,
  ChevronRightDouble,
  Home03,
  LogOut01,
  Monitor03,
  Receipt,
  Settings01,
  Trash01,
  Truck01,
  Users01,
} from '../../../icons'
import { Button } from '../Button/Button'
import { Menu, type MenuItemDef } from './Menu'

/** FABi CMS side navigation: links, submenus (one nested), groups, divider, danger. */
const NAV: MenuItemDef[] = [
  { key: 'overview', label: 'Tổng quan', icon: <Home03 />, href: '#/tong-quan' },
  {
    key: 'menu',
    label: 'Thực đơn',
    icon: <BookOpen01 />,
    children: [
      { key: 'menu-items', label: 'Món ăn', href: '#/thuc-don/mon-an' },
      { key: 'menu-categories', label: 'Danh mục món', href: '#/thuc-don/danh-muc' },
      { key: 'menu-combos', label: 'Combo & set menu', href: '#/thuc-don/combo' },
      {
        key: 'menu-toppings',
        label: 'Topping',
        children: [
          { key: 'topping-list', label: 'Danh sách topping', href: '#/thuc-don/topping' },
          { key: 'topping-groups', label: 'Nhóm topping', href: '#/thuc-don/nhom-topping' },
        ],
      },
    ],
  },
  {
    key: 'orders',
    label: 'Đơn hàng',
    icon: <Receipt />,
    children: [
      { key: 'orders-all', label: 'Tất cả đơn', href: '#/don-hang' },
      { key: 'orders-delivery', label: 'Đơn giao hàng', href: '#/don-hang/giao-hang' },
      { key: 'orders-cancelled', label: 'Đơn đã hủy', href: '#/don-hang/da-huy' },
    ],
  },
  { key: 'customers', label: 'Khách hàng', icon: <Users01 />, href: '#/khach-hang' },
  {
    key: 'reports',
    label: 'Báo cáo',
    icon: <BarChart01 />,
    children: [
      {
        type: 'group',
        key: 'reports-sales',
        label: 'Doanh thu',
        children: [
          { key: 'report-day', label: 'Theo ngày', href: '#/bao-cao/theo-ngay' },
          { key: 'report-branch', label: 'Theo chi nhánh', href: '#/bao-cao/chi-nhanh' },
        ],
      },
      {
        type: 'group',
        key: 'reports-items',
        label: 'Mặt hàng',
        children: [
          { key: 'report-best', label: 'Món bán chạy', href: '#/bao-cao/ban-chay' },
          { key: 'report-stock', label: 'Tồn kho', href: '#/bao-cao/ton-kho', isDisabled: true },
        ],
      },
    ],
  },
  { key: 'branches', label: 'Chi nhánh', icon: <Building02 />, href: '#/chi-nhanh' },
  { type: 'divider', key: 'divider' },
  { key: 'settings', label: 'Cài đặt', icon: <Settings01 />, href: '#/cai-dat' },
  { key: 'logout', label: 'Đăng xuất', icon: <LogOut01 />, danger: true },
]

/** Brand mark for the Figma "Logo?" slot: mark only when collapsed. */
function Logo({ isCollapsed }: { isCollapsed: boolean }) {
  const size = 'var(--fc-size-control-base)'
  return (
    <>
      <svg
        viewBox="0 0 32 32"
        {...(isCollapsed ? { role: 'img', 'aria-label': 'FABi CMS' } : { 'aria-hidden': true })}
        style={{ inlineSize: size, blockSize: size, flex: 'none' }}
      >
        <rect width="32" height="32" rx="8" style={{ fill: 'var(--fc-color-solid-accent)' }} />
        <path d="M11 8h11v4h-7v3h6v4h-6v5h-4z" style={{ fill: 'var(--fc-color-content-on-solid)' }} />
      </svg>
      {!isCollapsed && (
        <span style={{ fontSize: 'var(--fc-typography-size-lg)', lineHeight: 'var(--fc-typography-line-height-lg)', fontWeight: 'var(--fc-typography-weight-semibold)' }}>
          FABi CMS
        </span>
      )}
    </>
  )
}
const logo = (state: { isCollapsed: boolean }) => <Logo {...state} />

/** Width of an expanded side menu (256). A collapsed menu sizes itself (Component/Menu/Collapsed-Width). */
const EXPANDED_WIDTH = 'calc(var(--fc-size-control-base) * 8)'

/**
 * Stories that open a submenu popover on load render in their own iframe on
 * the Docs page: the popover is modal (focus moves in, the rest goes inert).
 */
const OPEN_POPOVER = { docs: { story: { inline: false, height: '520px' } } }

const meta = {
  title: 'Components/Menu',
  component: Menu,
  args: {
    items: NAV,
    'aria-label': 'Điều hướng chính',
    mode: 'inline',
    theme: 'light',
    isCollapsed: false,
    defaultSelectedKey: 'menu-items',
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['inline', 'vertical'] },
    theme: { control: 'inline-radio', options: ['light', 'dark'] },
    items: { control: false },
    logo: { control: false },
  },
  render: (args) => (
    <div style={{ inlineSize: EXPANDED_WIDTH }}>
      <Menu {...args} />
    </div>
  ),
} satisfies Meta<typeof Menu>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Figma Theme=Light, Mode=Inline, Collapsed=No, Logo. Submenus expand in place; group titles inside "Báo cáo" (Reports). */
export const Inline: Story = {
  args: { logo, defaultOpenKeys: ['menu', 'reports'] },
}

/** Figma Theme=Light, Mode=Inline, Collapsed=Yes: icons only, tooltip with the label, "Thực đơn" (Menu) popover open. */
export const InlineCollapsed: Story = {
  args: { logo, isCollapsed: true, defaultOpenKeys: ['menu'] },
  parameters: OPEN_POPOVER,
}

/** Figma Theme=Dark, Mode=Inline, Collapsed=No: data-mode="dark", current page as a solid accent row. */
export const DarkInline: Story = {
  args: { logo, theme: 'dark', defaultOpenKeys: ['menu', 'reports'] },
}

/** Figma Theme=Light, Mode=Vertical, Collapsed=No: submenus open in a popover to the side. */
export const Vertical: Story = {
  args: { mode: 'vertical', defaultOpenKeys: ['menu'] },
  parameters: OPEN_POPOVER,
}

/** Figma Theme=Dark, Mode=Vertical, Collapsed=No: the popover is dark too. */
export const DarkVertical: Story = {
  args: { mode: 'vertical', theme: 'dark', defaultOpenKeys: ['menu'] },
  parameters: OPEN_POPOVER,
}

/** Figma Theme=Light, Mode=Vertical, Collapsed=Yes. */
export const VerticalCollapsed: Story = {
  args: { mode: 'vertical', isCollapsed: true, defaultOpenKeys: ['reports'] },
  parameters: OPEN_POPOVER,
}

/** Figma Theme=Dark, Mode=Vertical, Collapsed=Yes. */
export const DarkVerticalCollapsed: Story = {
  args: { mode: 'vertical', theme: 'dark', isCollapsed: true, defaultOpenKeys: ['menu'] },
  parameters: OPEN_POPOVER,
}

const STATES: MenuItemDef[] = [
  {
    type: 'group',
    key: 'sales',
    label: 'Bán hàng',
    children: [
      { key: 'pos', label: 'Thu ngân', icon: <Monitor03 />, href: '#/thu-ngan' },
      {
        key: 'orders',
        label: 'Đơn hàng',
        icon: <Receipt />,
        children: [
          { key: 'orders-open', label: 'Đang phục vụ', href: '#/don-hang/dang-phuc-vu' },
          { key: 'orders-paid', label: 'Đã thanh toán', href: '#/don-hang/da-thanh-toan' },
        ],
      },
      { key: 'delivery', label: 'Giao hàng', icon: <Truck01 />, href: '#/giao-hang', isDisabled: true },
    ],
  },
  { type: 'divider', key: 'divider' },
  { key: 'close-branch', label: 'Đóng chi nhánh', icon: <Trash01 />, danger: true },
]

/**
 * Item states, Light and Dark: current page ("Thu ngân", aria-current="page"),
 * icon, submenu (open), group title ("Bán hàng"), disabled ("Giao hàng"),
 * Figma Status=Error ("Đóng chi nhánh"). Hover and Tab to see hover / focus.
 */
export const ItemStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--fc-space-margin-lg)', alignItems: 'flex-start' }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div key={theme} style={{ inlineSize: EXPANDED_WIDTH }}>
          <Menu items={STATES} theme={theme} aria-label={`Trạng thái mục (${theme})`} defaultSelectedKey="pos" defaultOpenKeys={['orders']} />
        </div>
      ))}
    </div>
  ),
}

function CollapsibleMenu() {
  const [isCollapsed, setCollapsed] = useState(false)
  const [current, setCurrent] = useState<Key>('overview')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--fc-space-margin-xs)', inlineSize: EXPANDED_WIDTH }}>
      <Button iconStart={isCollapsed ? <ChevronRightDouble /> : <ChevronLeftDouble />} onPress={() => setCollapsed((c) => !c)}>
        {isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
      </Button>
      <Menu items={NAV} logo={logo} isCollapsed={isCollapsed} selectedKey={current} onAction={setCurrent} />
      <p style={{ margin: 0, color: 'var(--fc-color-content-description)' }}>Trang hiện tại: {String(current)}</p>
    </div>
  )
}

/**
 * Interactive: the button toggles Figma Collapsed. The current page is
 * controlled (`selectedKey` + `onAction`); submenus expanded inline stay
 * expanded after collapsing and expanding again.
 */
export const Collapsible: Story = {
  render: () => <CollapsibleMenu />,
}

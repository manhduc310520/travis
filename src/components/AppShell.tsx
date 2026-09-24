import { useState, type ReactNode } from 'react'
import { Drawer, Grid, Layout, Menu, theme } from 'antd'
import {
  Building02,
  CheckCircleBroken,
  ChevronRight,
  File06,
  FileSearch02,
  Grid01,
  Home03,
  LayoutAlt03,
  LayoutLeft,
  Mail01,
  Menu02,
  Monitor03,
  PieChart04,
  Printer,
  ShoppingCart01,
  Tag03,
  Users01,
} from '../icons'
import { AppHeader } from './AppHeader'

const { Sider, Content } = Layout

/**
 * The full nav, read directly off the Figma instance
 * `App Shells > Components > App Shells Items / Menu` (node 27784:136759) —
 * 14 top-level items, each with the exact icon instance bound to it in
 * Figma (e.g. "Home" -> `home-03`, not a guessed equivalent). Earlier
 * versions of this file had only 6 items; this is the full list.
 */
const navItems = [
  { key: 'home', icon: <Home03 />, label: 'Home' },
  {
    key: 'restaurants',
    icon: <Building02 />,
    label: 'Restaurants',
    children: [
      { key: 'list', label: 'Restaurant List' },
      { key: 'payment', label: 'Payment Methods' },
      { key: 'source', label: 'Order Sources' },
      { key: 'printer', label: 'Printer Locations' },
      { key: 'area', label: 'Areas' },
      { key: 'tables', label: 'Table Management' },
      { key: 'map', label: 'Floor Plan' },
      { key: 'invoice', label: 'Invoice Templates' },
      { key: 'momo', label: 'Merchant Momo' },
      { key: 'pos', label: 'POS Connections' },
    ],
  },
  { key: 'menu', icon: <LayoutAlt03 />, label: 'Menu' },
  { key: 'promo', icon: <Tag03 />, label: 'Promotions' },
  { key: 'devices', icon: <Printer />, label: 'Devices' },
  { key: 'staff', icon: <Users01 />, label: 'Staff' },
  { key: 'reports', icon: <PieChart04 />, label: 'Reports' },
  { key: 'apps', icon: <Grid01 />, label: 'Apps' },
  { key: 'marketplace', icon: <ShoppingCart01 />, label: 'Marketplace' },
  { key: 'accounting', icon: <FileSearch02 />, label: 'Accounting & Banking' },
  { key: 'timekeeping', icon: <CheckCircleBroken />, label: 'Timekeeping' },
  { key: 'multichannel', icon: <Monitor03 />, label: 'Multichannel Orders' },
  { key: 'support', icon: <Mail01 />, label: 'Feedback & Support' },
  { key: 'einvoice', icon: <File06 />, label: 'E-invoices' },
]

export type AppShellProps = {
  /** Page body rendered inside the grey content area. */
  children?: ReactNode
  /** Which nav key is highlighted. */
  selectedKey?: string
  /** Total height of the shell. */
  height?: number | string
}

/**
 * The FABi CMS frame: gradient header, fixed sidebar, grey content well.
 *
 * This is the template layer — the thing Ant Design does not ship. Every screen
 * in the product sits inside it, so a new module is a content problem rather
 * than a layout problem.
 *
 * Sidebar padding (16px top, 8px each side) is Figma's own spec, measured off
 * the same instance the nav list came from: the sidebar's `Content` slot
 * carries that exact padding before Ant Design's own per-item padding/margin
 * tokens take over. Skipping it was why the icons sat flush against the
 * sidebar edge while the header logo — which does have this outer inset —
 * did not line up with them.
 *
 * Responsive: the Figma source is desktop-only (file name literally says
 * "Design Component Desktop"), so there is no frame to copy pixel-for-pixel
 * below `md`. Behaviour instead follows Ant Design's own reference pattern
 * (the one Ant Design Pro ships): the sidebar isn't squeezed or scrolled, it's
 * removed entirely below `md` (768px) and replaced by a hamburger button in
 * the header that opens the same `Menu` inside an Ant Design `Drawer` — no
 * custom drawer, just the library's own component. Selecting an item closes
 * the drawer.
 */
export function AppShell({ children, selectedKey = 'list', height = 768 }: AppShellProps) {
  const { token } = theme.useToken()
  const screens = Grid.useBreakpoint()
  const isDesktop = screens.md ?? true
  const [drawerOpen, setDrawerOpen] = useState(false)

  const nav = (
    <>
      <div style={{ flex: 1, overflowY: 'auto', paddingBlockStart: token.padding, paddingInline: token.paddingXS }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={['restaurants']}
          items={navItems}
          style={{ borderInlineEnd: 0 }}
          onClick={() => setDrawerOpen(false)}
        />
      </div>
      <div style={{ borderTop: `1px solid ${token.colorSplit}`, paddingInline: token.paddingXS, paddingBlock: token.paddingXS }}>
        <Menu
          mode="inline"
          selectable={false}
          style={{ borderInlineEnd: 0 }}
          items={[
            { key: 'collapse', icon: <LayoutLeft />, label: 'Collapse' },
            {
              key: 'expand',
              icon: <Menu02 />,
              label: 'Expand',
              extra: <ChevronRight size={12} />,
            },
          ]}
        />
      </div>
    </>
  )

  return (
    <Layout style={{ height, overflow: 'hidden' }}>
      <AppHeader onMenuClick={isDesktop ? undefined : () => setDrawerOpen(true)} />
      <Layout>
        {isDesktop && (
          <Sider
            width={256}
            style={{
              background: token.colorBgContainer,
              borderInlineEnd: `1px solid ${token.colorSplit}`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {nav}
          </Sider>
        )}

        {!isDesktop && (
          <Drawer
            title="iPOS.vn"
            placement="left"
            size={280}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
          >
            {nav}
          </Drawer>
        )}

        <Content
          style={{
            background: token.colorBgLayout,
            padding: isDesktop ? token.padding : token.paddingSM,
            overflowY: 'auto',
            minWidth: 0,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

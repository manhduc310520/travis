import { useState, type ReactNode } from 'react'
import { Drawer, Grid, Layout, Menu, theme } from 'antd'
import {
  BookOpen01,
  Building02,
  Home01,
  LayoutLeft,
  Menu02,
  Printer,
  Tag01,
  Users01,
  ChevronRight,
} from '../icons'
import { AppHeader } from './AppHeader'

const { Sider, Content } = Layout

const navItems = [
  { key: 'home', icon: <Home01 />, label: 'Trang chủ' },
  {
    key: 'restaurants',
    icon: <Building02 />,
    label: 'Nhà hàng',
    children: [
      { key: 'list', label: 'Danh sách nhà hàng' },
      { key: 'payment', label: 'Phương thức thanh toán' },
      { key: 'source', label: 'Nguồn đơn hàng' },
      { key: 'printer', label: 'Vị trí máy in' },
      { key: 'area', label: 'Khu vực' },
      { key: 'tables', label: 'Quản lý bàn' },
      { key: 'map', label: 'Sơ đồ bàn' },
      { key: 'invoice', label: 'Mẫu hoá đơn' },
      { key: 'momo', label: 'Merchant Momo' },
      { key: 'pos', label: 'Liên kết điểm bán hàng' },
    ],
  },
  { key: 'menu', icon: <BookOpen01 />, label: 'Thực đơn' },
  { key: 'promo', icon: <Tag01 />, label: 'Chương trình' },
  { key: 'devices', icon: <Printer />, label: 'Thiết bị' },
  { key: 'staff', icon: <Users01 />, label: 'Nhân viên' },
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
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={['restaurants']}
          items={navItems}
          style={{ borderInlineEnd: 0 }}
          onClick={() => setDrawerOpen(false)}
        />
      </div>
      <div style={{ borderTop: `1px solid ${token.colorSplit}` }}>
        <Menu
          mode="inline"
          selectable={false}
          style={{ borderInlineEnd: 0 }}
          items={[
            { key: 'collapse', icon: <LayoutLeft />, label: 'Thu gọn' },
            {
              key: 'expand',
              icon: <Menu02 />,
              label: 'Mở rộng',
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
            width={280}
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

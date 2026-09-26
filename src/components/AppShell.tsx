import { useState, type ReactNode } from 'react'
import type { Key } from 'react-aria-components'
import { Drawer, Menu, SearchField, type MenuItemDef } from '../fc'
import { LayoutAlt02, Mail01, Menu01 } from '../icons'
import { cx } from '../fc/space'
import { AppHeader, type AppHeaderProps } from './AppHeader'
import { EXTENSIONS, NAV_ITEMS, fold } from './appShellNav'
import { SearchModal } from './SearchModal'
import { FEATURES, HISTORY } from './searchModalSamples'
import { DESKTOP_QUERY, useMediaQuery } from './useMediaQuery'
import styles from './AppShell.module.css'

export interface AppShellProps {
  /** Page body, drawn in the grey content well (Color/Background/Layout). */
  children?: ReactNode
  /** The current page in the side navigation. */
  selectedKey?: Key
  onNavigate?: (key: Key) => void
  /** Figma variant Size=SM: icons only, 80 wide, labels in tooltips. */
  defaultCollapsed?: boolean
  /** Total height of the shell. */
  height?: number | string
  /** Passed to the header (title, user, languages…). Its search box opens the Search Modal. */
  header?: Partial<AppHeaderProps>
  /** `auto` follows the viewport (desktop from 768px); stories can pin one layout. */
  layout?: 'auto' | 'desktop' | 'mobile'
}

/**
 * The FABi CMS frame: header, side navigation, content well. Every screen of
 * the product sits inside it, so a new module is a content problem, not a
 * layout one.
 *
 * Desktop (Figma "App Shells", 256 wide): navigation, then a bottom block
 * with "Thu gọn" (collapse to the 80-wide icon rail) and "Mở rộng" (connected
 * apps, opening to the side). Below `md` the side navigation moves into a
 * Drawer opened by the header's menu button — Figma draws only the SM
 * header, so the drawer follows the standard admin pattern.
 */
export function AppShell({
  children,
  selectedKey: selectedProp,
  onNavigate,
  defaultCollapsed = false,
  height = 768,
  header,
  layout = 'auto',
}: AppShellProps) {
  const wide = useMediaQuery(DESKTOP_QUERY)
  const isDesktop = layout === 'auto' ? wide : layout === 'desktop'
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedState, setSelected] = useState<Key>('restaurants')
  const [searchOpen, setSearchOpen] = useState(false)
  const [history, setHistory] = useState(HISTORY)
  const [extQuery, setExtQuery] = useState('')
  const extMatches = EXTENSIONS.filter((label) => fold(label).includes(fold(extQuery.trim())))
  const extensionItems: MenuItemDef[] = extMatches.length
    ? extMatches.map((label) => ({ key: `ext:${label}`, icon: <Mail01 />, label }))
    : [{ key: 'ext:none', label: 'Không tìm thấy ứng dụng', isDisabled: true }]
  const selectedKey = selectedProp ?? selectedState

  const navigate = (key: Key) => {
    if (String(key).startsWith('ext:')) return
    setSelected(key)
    onNavigate?.(key)
    setDrawerOpen(false)
  }

  const nav = (isCollapsed: boolean) => (
    <Menu
      items={NAV_ITEMS}
      selectedKey={selectedKey}
      onAction={navigate}
      isCollapsed={isCollapsed}
      aria-label="Điều hướng chính"
      className={styles.nav}
    />
  )

  const bottom = (withCollapse: boolean) => (
    <Menu
      mode="vertical"
      isCollapsed={collapsed && withCollapse}
      selectedKey={null}
      aria-label="Tuỳ chọn thanh bên"
      className={styles.nav}
      onAction={(key) => (key === 'collapse' ? setCollapsed((c) => !c) : navigate(key))}
      items={[
        ...(withCollapse
          ? [{ key: 'collapse', icon: <LayoutAlt02 />, label: collapsed ? 'Hiện đầy đủ' : 'Thu gọn' }]
          : []),
        {
          key: 'more',
          icon: <Menu01 />,
          label: 'Mở rộng',
          children: extensionItems,
          popupHeader: <SearchField aria-label="Tìm ứng dụng" placeholder="Tìm kiếm" value={extQuery} onChange={setExtQuery} />,
        },
      ]}
    />
  )

  return (
    <div className={styles.shell} style={{ height }}>
      <AppHeader layout={layout} {...header} onMenuClick={() => setDrawerOpen(true)} onSearchOpen={() => setSearchOpen(true)} />
      <div className={styles.body}>
        {isDesktop ? (
          <aside className={cx(styles.sider, collapsed && styles.collapsed)}>
            <div className={styles.scroll}>{nav(collapsed)}</div>
            <div className={styles.bottom}>{bottom(true)}</div>
          </aside>
        ) : (
          <Drawer placement="left" title="iPOS.vn" isOpen={drawerOpen} onOpenChange={setDrawerOpen}>
            <div className={styles.drawerNav}>
              {nav(false)}
              <div className={styles.bottom}>{bottom(false)}</div>
            </div>
          </Drawer>
        )}
        <main className={styles.content}>{children}</main>
      </div>
      <SearchModal
        isOpen={searchOpen}
        onOpenChange={setSearchOpen}
        groups={FEATURES}
        history={history}
        onClearHistory={() => setHistory([])}
        onAction={(key) => onNavigate?.(key)}
      />
    </div>
  )
}

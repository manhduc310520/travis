import { Avatar, Grid, Input, Space, theme, Typography } from 'antd'
import { Bell01, ChevronDown, Menu02, SearchMd, User01 } from '../icons'

export type AppHeaderProps = {
  /** Product wordmark shown on the left. */
  brandName?: string
  /** Small line under the wordmark. */
  tagline?: string
  /** Name rendered beside the avatar. */
  userName?: string
  /** Calls this when the hamburger is clicked. The button only ever renders
   *  below the `md` breakpoint — passing this prop on desktop does nothing,
   *  by design, so a story can supply it unconditionally without it leaking
   *  into the desktop layout. AppShell passes it to open the nav drawer. */
  onMenuClick?: () => void
}

/**
 * The FABi CMS top bar.
 *
 * Its background is the one part of the system with no Ant Design equivalent:
 * a two-stop gradient driven by `colorHeaderBgStart` and `colorHeaderBgEnd`.
 * Those arrive as CSS variables from the Storybook preview, so the bar follows
 * whichever brand is selected in the toolbar.
 *
 * Responsive: the desktop layout is three fixed-width columns (wordmark,
 * search, actions) so the search bar stays centred. Below `md` (768px) that
 * assumption stops holding — the wordmark and actions alone don't leave room
 * for a 360px search field — so it switches to a fluid flex row: the wordmark
 * drops entirely (the hamburger takes its place), username text drops, the
 * search field fills whatever width is left.
 */
export function AppHeader({
  brandName = 'iPOS.vn',
  tagline = 'MAKE F&B BUSINESS BETTER',
  userName = 'Chanh dev',
  onMenuClick,
}: AppHeaderProps) {
  const { token } = theme.useToken()
  const screens = Grid.useBreakpoint()
  const isDesktop = screens.md ?? true

  return (
    <header
      style={{
        background: 'var(--fabi-header-bg)',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        paddingInline: isDesktop ? token.padding : token.paddingSM,
        flexShrink: 0,
      }}
    >
      {!isDesktop && onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Mở menu điều hướng"
          style={{
            background: 'transparent',
            border: 0,
            padding: 4,
            display: 'flex',
            color: '#fff',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Menu02 size={20} />
        </button>
      )}

      {isDesktop && (
        // Figma's Navbar has 16px of its own padding, then the logo sits
        // inside a nested "Menu Item / Horizontal" wrapper with another 16px
        // — 32px total. `header`'s own paddingInline only covers the first
        // 16; this makes up the rest so the wordmark lines up with the
        // sidebar icons below it instead of sitting 16px too far left.
        <div style={{ width: 208, flexShrink: 0, lineHeight: 1.1, overflow: 'hidden', paddingLeft: token.padding }}>
          <div
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: -0.3,
              whiteSpace: 'nowrap',
            }}
          >
            {brandName}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 8, letterSpacing: 0.6 }}>
            {tagline}
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <Input
          prefix={<SearchMd style={{ color: token.colorTextPlaceholder }} />}
          suffix={
            isDesktop ? (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                ⌘ K
              </Typography.Text>
            ) : undefined
          }
          placeholder="Tìm kiếm"
          style={{ width: '100%', maxWidth: isDesktop ? 360 : undefined }}
          aria-label="Tìm kiếm"
        />
      </div>

      <Space size={isDesktop ? 16 : 8} style={{ width: isDesktop ? 208 : undefined, justifyContent: 'flex-end', flexShrink: 0 }}>
        <Bell01 size={18} style={{ color: '#fff' }} aria-label="Thông báo" />
        <Space size={8}>
          <Avatar size={28} icon={<User01 />} />
          {isDesktop && (
            <>
              <span style={{ color: '#fff', whiteSpace: 'nowrap' }}>{userName}</span>
              <ChevronDown size={12} style={{ color: '#fff' }} />
            </>
          )}
        </Space>
      </Space>
    </header>
  )
}

import { useEffect, useState, type ReactNode } from 'react'
import { Button as AriaButton, type Key } from 'react-aria-components'
import { Avatar, Badge, Button, Dropdown, Link, Popover, Tabs, type DropdownItem } from '../fc'
import { ArrowNarrowLeft, Bell02, ChevronDown, LogOut01, Menu01, SearchSm, Settings01 } from '../icons'
import { ScrollArea } from '../fc/ScrollArea'
import { cx } from '../fc/space'
import { AiIcon, FlagChina, FlagUnitedStates, FlagVietnam, LogoWordmark } from './brandAssets'
import { DESKTOP_QUERY, useMediaQuery } from './useMediaQuery'
import { SAMPLE_ACCOUNTS, SAMPLE_NOTICES, type AppAccount, type InboxMessage } from './appHeaderSamples'
import styles from './AppHeader.module.css'

export type { AppAccount, InboxMessage } from './appHeaderSamples'

/** Figma "Language Item" menu: "Việt Nam" / "English" / "China". */
export type AppLanguage = 'vi' | 'en' | 'zh'

const LANGUAGES: { key: AppLanguage; label: string; Flag: typeof FlagVietnam }[] = [
  { key: 'vi', label: 'Việt Nam', Flag: FlagVietnam },
  { key: 'en', label: 'English', Flag: FlagUnitedStates },
  { key: 'zh', label: 'China', Flag: FlagChina },
]

export interface AppHeaderProps {
  /** Signed-in user shown beside the avatar (desktop). */
  userName?: string
  /** Avatar picture; without one the avatar shows the name's first letter. */
  userAvatarSrc?: string
  /**
   * Figma "Type = Title": a back arrow and the page title replace the logo,
   * for pages opened from somewhere else, e.g. "Hóa đơn điện tử" (E-invoices).
   */
  title?: ReactNode
  onBack?: () => void
  /** Hamburger (Figma "Breakpoint=SM"): opens the navigation drawer. Shown only on the mobile layout. */
  onMenuClick?: () => void
  /** Opens the Search Modal. Also bound to ⌘K / Ctrl+K. */
  onSearchOpen?: () => void
  /** AI assistant button. */
  onAiClick?: () => void
  language?: AppLanguage
  onLanguageChange?: (language: AppLanguage) => void
  /** "Thông báo" (Notices) tab of the inbox popover. */
  notices?: InboxMessage[]
  /** "Hòm thư" (Mailbox) tab of the inbox popover. */
  mails?: InboxMessage[]
  onManageInbox?: () => void
  /** Stores / accounts the user can switch between. */
  accounts?: AppAccount[]
  accountKey?: Key
  onAccountChange?: (key: Key) => void
  onAccountSettings?: () => void
  onLogout?: () => void
  /** `auto` follows the viewport (LG from 768px); stories can pin one layout. */
  layout?: 'auto' | 'desktop' | 'mobile'
  className?: string
}

/**
 * The FABi CMS top bar, Figma "*Navbar" (page ❖ Header).
 *
 * The bar is Color/Background/Header-Start → Header-End, top to bottom, in
 * both modes. The buttons on it sit in a `data-mode="dark"` region, so their
 * hover and focus tokens are the ones made for a dark surface; the search box
 * keeps the page's mode (white in Light, as in Figma). Menus and the inbox
 * open in the page's mode too, since they portal out of the bar.
 */
export function AppHeader({
  userName = 'Chanh dev',
  userAvatarSrc,
  title,
  onBack,
  onMenuClick,
  onSearchOpen,
  onAiClick,
  language: languageProp,
  onLanguageChange,
  notices = SAMPLE_NOTICES,
  mails = SAMPLE_NOTICES,
  onManageInbox,
  accounts = SAMPLE_ACCOUNTS,
  accountKey: accountProp,
  onAccountChange,
  onAccountSettings,
  onLogout,
  layout = 'auto',
  className,
}: AppHeaderProps) {
  const wide = useMediaQuery(DESKTOP_QUERY)
  const isDesktop = layout === 'auto' ? wide : layout === 'desktop'

  // Uncontrolled fallbacks so the header works on its own in a story.
  const [languageState, setLanguage] = useState<AppLanguage>('vi')
  const language = languageProp ?? languageState
  const [accountState, setAccount] = useState<Key>(accounts[0]?.key ?? '')
  const accountKey = accountProp ?? accountState
  const current = LANGUAGES.find((l) => l.key === language) ?? LANGUAGES[0]

  // ⌘K / Ctrl+K opens search from anywhere on the page.
  useEffect(() => {
    if (!onSearchOpen) return undefined
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onSearchOpen()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onSearchOpen])

  const languageItems: DropdownItem[] = [
    {
      type: 'group',
      key: 'languages',
      'aria-label': 'Ngôn ngữ',
      selectionMode: 'single',
      selectedKeys: [language],
      onSelectionChange: (keys) => {
        const next = [...keys][0] as AppLanguage | undefined
        if (!next) return
        setLanguage(next)
        onLanguageChange?.(next)
      },
      children: LANGUAGES.map(({ key, label, Flag }) => ({ key, label, icon: <Flag /> })),
    },
  ]

  const accountItems: DropdownItem[] = [
    {
      type: 'group',
      key: 'accounts',
      'aria-label': 'Tài khoản',
      selectionMode: 'single',
      selectedKeys: [accountKey],
      onSelectionChange: (keys) => {
        const next = [...keys][0]
        if (next == null) return
        setAccount(next)
        onAccountChange?.(next)
      },
      children: accounts.map((a) => ({
        key: a.key,
        label: a.name,
        icon: <Avatar size="sm" alt="">{a.name.charAt(0)}</Avatar>,
      })),
    },
    { type: 'divider', key: 'd1' },
    { key: 'settings', label: 'Cài đặt tài khoản', icon: <Settings01 /> },
    { type: 'divider', key: 'd2' },
    { key: 'logout', label: 'Đăng xuất', icon: <LogOut01 /> },
  ]

  const avatar = (
    <Avatar size="sm" src={userAvatarSrc} alt={userAvatarSrc ? userName : ''}>
      {userName.charAt(0)}
    </Avatar>
  )

  return (
    <header className={cx(styles.header, isDesktop ? styles.desktop : styles.mobile, className)}>
      <div className={styles.start} data-mode="dark">
        {!isDesktop && onMenuClick && (
          <Button variant="text" iconStart={<Menu01 />} aria-label="Mở menu điều hướng" onPress={onMenuClick} />
        )}
        {isDesktop && title != null && (
          <>
            {onBack && <Button variant="text" iconStart={<ArrowNarrowLeft />} aria-label="Quay lại" onPress={onBack} />}
            <h1 className={styles.title}>{title}</h1>
          </>
        )}
        {isDesktop && title == null && <LogoWordmark className={styles.logo} />}
      </div>

      <AriaButton className={styles.search} onPress={onSearchOpen} aria-label="Tìm kiếm" aria-keyshortcuts="Meta+K Control+K">
        <SearchSm className={styles.searchIcon} />
        <span className={styles.searchText}>Tìm kiếm</span>
        {isDesktop && <kbd className={styles.shortcut}>{isMac() ? '⌘ K' : 'Ctrl K'}</kbd>}
      </AriaButton>

      <div className={styles.actions} data-mode="dark">
        <Button variant="text" iconStart={<AiIcon />} aria-label="Trợ lý AI" onPress={onAiClick} />

        <Dropdown items={languageItems} placement="bottom end" aria-label="Ngôn ngữ">
          <Button variant="text" iconStart={<current.Flag />} aria-label={`Ngôn ngữ: ${current.label}`} />
        </Dropdown>

        <Popover
          trigger="click"
          placement="bottom end"
          showArrow={false}
          title="Hòm thư"
          width={452}
          content={<Inbox notices={notices} mails={mails} onManage={onManageInbox} />}
        >
          <Button variant="text" iconStart={<Bell02 />} aria-label="Hòm thư" />
        </Popover>

        <Dropdown
          items={accountItems}
          placement="bottom end"
          aria-label="Tài khoản"
          onAction={(key) => {
            if (key === 'settings') onAccountSettings?.()
            if (key === 'logout') onLogout?.()
          }}
        >
          {isDesktop ? (
            <Button variant="text" className={styles.account} aria-label={`Tài khoản: ${userName}`}>
              {avatar}
              <span className={styles.userName}>{userName}</span>
              <ChevronDown className={styles.chevron} />
            </Button>
          ) : (
            <Button variant="text" className={styles.account} aria-label={`Tài khoản: ${userName}`}>
              {avatar}
            </Button>
          )}
        </Dropdown>
      </div>
    </header>
  )
}

function isMac() {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
}

/** Figma "Notification / Open": title, two tabs with counts, rows by date, "Quản lý hòm thư" (Manage mailbox). */
function Inbox({ notices, mails, onManage }: { notices: InboxMessage[]; mails: InboxMessage[]; onManage?: () => void }) {
  return (
    <div className={styles.inbox}>
      <Tabs
        aria-label="Hòm thư"
        items={[
          { key: 'notices', label: 'Thông báo', badge: <Badge count={notices.length} size="sm" />, content: <InboxList messages={notices} /> },
          { key: 'mails', label: 'Hòm thư', badge: <Badge count={mails.length} size="sm" />, content: <InboxList messages={mails} /> },
        ]}
      />
      <div className={styles.inboxFooter}>
        <Link onPress={onManage} className={styles.manage}>
          Quản lý hòm thư
          <Settings01 />
        </Link>
      </div>
    </div>
  )
}

function InboxList({ messages }: { messages: InboxMessage[] }) {
  const byDate = new Map<string, InboxMessage[]>()
  for (const m of messages) byDate.set(m.date, [...(byDate.get(m.date) ?? []), m])
  if (messages.length === 0) return <p className={styles.inboxEmpty}>Chưa có tin nào</p>
  return (
    <ScrollArea className={styles.inboxList}>
      {[...byDate].map(([date, rows]) => (
        <section key={date} aria-label={date}>
          <h3 className={styles.inboxDate}>{date}</h3>
          <ul className={styles.inboxRows}>
            {rows.map((m) => (
              <li key={m.key} className={styles.inboxRow}>
                <span className={styles.inboxSender}>{m.sender}</span>
                <span className={styles.inboxTime}>{m.time}</span>
                <span className={styles.inboxText}>{m.text}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </ScrollArea>
  )
}

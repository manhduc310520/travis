import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import {
  Button as AriaButton,
  Dialog,
  DialogTrigger,
  Disclosure,
  DisclosurePanel,
  Link,
  Popover as AriaPopover,
  type Key,
} from 'react-aria-components'
import { ChevronDown, ChevronRight } from '../../../icons'
import { cx } from '../../space'
import overlay from '../../overlay.module.css'
import { Tooltip } from '../Tooltip/Tooltip'
import styles from './Menu.module.css'

/** A page link, or a submenu when it has `children`. */
export interface MenuItemEntry {
  type?: 'item'
  key: Key
  /** Visible text. In a collapsed menu it stays the accessible name and shows in a tooltip. */
  label: ReactNode
  /** 16px icon (Figma "Icon"). A collapsed menu shows only the icon (or the label's first letter without one). */
  icon?: ReactNode
  /** Destination of the link. Without it the item is a link-role element that only fires `onAction`. */
  href?: string
  isDisabled?: boolean
  /** Figma Status=Error: destructive entry such as "Đăng xuất" (Log out). */
  danger?: boolean
  /** Figma "Submenu": inline mode expands in place, vertical / collapsed opens a popover to the side. */
  children?: MenuItemDef[]
  /**
   * Shown above the submenu inside its popover (vertical / collapsed mode),
   * e.g. a SearchField that filters `children` (Figma "App Shells Menu Bottom").
   */
  popupHeader?: ReactNode
}

/** Figma "Group Title": a titled run of items. */
export interface MenuGroupEntry {
  type: 'group'
  key: Key
  label: ReactNode
  children: MenuItemDef[]
}

export interface MenuDividerEntry {
  type: 'divider'
  key: Key
}

/** One entry of the menu: a link, a submenu, a titled group or a divider. */
export type MenuItemDef = MenuItemEntry | MenuGroupEntry | MenuDividerEntry

/** Figma Mode: `inline` expands submenus in place, `vertical` opens them in a popover to the side. */
export type MenuMode = 'inline' | 'vertical'
/** Figma Theme: `light` follows the surrounding mode, `dark` pins a dark surface. */
export type MenuTheme = 'light' | 'dark'

export interface MenuProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: MenuItemDef[]
  /**
   * Key of the current page (controlled). That item gets `aria-current="page"`
   * and the selected style; the submenus leading to it are marked too.
   */
  selectedKey?: Key | null
  /** Current page when uncontrolled; activating another item moves it. */
  defaultSelectedKey?: Key
  /** Open submenus (controlled). In vertical / collapsed mode: the chain of open popovers. */
  openKeys?: Iterable<Key>
  /**
   * Open submenus when uncontrolled. Inline defaults to the submenus that
   * lead to the current page. In vertical / collapsed mode they open as
   * popovers on first render.
   */
  defaultOpenKeys?: Iterable<Key>
  onOpenChange?: (keys: Set<Key>) => void
  /** Figma Mode. */
  mode?: MenuMode
  /** Figma Theme. `dark` renders with `data-mode="dark"`, so every token resolves to Dark. */
  theme?: MenuTheme
  /** Figma Collapsed=Yes: icons only, 80px wide, a tooltip with the label, submenus in popovers. */
  isCollapsed?: boolean
  /** Fires when a link is activated (click, Enter). */
  onAction?: (key: Key) => void
  /** Figma "Logo?": brand mark above the items. A function receives the collapsed state. */
  logo?: ReactNode | ((state: { isCollapsed: boolean }) => ReactNode)
  /** Names the navigation landmark. */
  'aria-label'?: string
}

interface MenuState {
  selectedKey: Key | null
  /** Submenus that contain the current page. */
  selectedPath: Set<Key>
  open: Set<Key>
  setOpen: (key: Key, isOpen: boolean) => void
  activate: (key: Key) => void
  /** Vertical or collapsed: submenus open as popovers. */
  isPopup: boolean
  isCollapsed: boolean
  isDark: boolean
}

const MenuStateContext = createContext<MenuState | null>(null)

function useMenuState() {
  const state = useContext(MenuStateContext)
  if (!state) throw new Error('Menu entries must render inside <Menu>.')
  return state
}

/** Keys of the submenus leading to `target` (not including it), or null when absent. */
function pathTo(items: MenuItemDef[], target: Key | null | undefined): Key[] | null {
  if (target == null) return null
  for (const entry of items) {
    if (entry.type === 'divider') continue
    if (entry.type === 'group') {
      const found = pathTo(entry.children, target)
      if (found) return found
      continue
    }
    if (entry.key === target) return []
    if (entry.children) {
      const found = pathTo(entry.children, target)
      if (found) return [entry.key, ...found]
    }
  }
  return null
}

/** Keys of every submenu inside `items`, at any depth. */
function submenuKeys(items: MenuItemDef[]): Key[] {
  return items.flatMap((entry) => {
    if (entry.type === 'divider') return []
    if (entry.type === 'group') return submenuKeys(entry.children)
    return entry.children?.length ? [entry.key, ...submenuKeys(entry.children)] : []
  })
}

function findItem(items: MenuItemDef[], key: Key): MenuItemEntry | null {
  for (const entry of items) {
    if (entry.type === 'divider') continue
    const found = entry.type === 'group' ? findItem(entry.children, key) : entry.key === key ? entry : entry.children ? findItem(entry.children, key) : null
    if (found) return found
  }
  return null
}

const levelStyle = (level: number) => ({ '--_level': level }) as CSSProperties

const ROVING_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End'])

/**
 * Up / Down / Home / End move focus between the visible items of one list
 * (the menu or one popover). Tab still reaches every item, so this is a
 * shortcut, not the only way through.
 */
function moveFocus(e: KeyboardEvent<HTMLUListElement>) {
  if (e.defaultPrevented || !ROVING_KEYS.has(e.key)) return
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[data-fc-menu-item]')).filter(
    (el) => !el.hasAttribute('data-disabled') && !el.closest('[hidden]'),
  )
  const index = items.indexOf(document.activeElement as HTMLElement)
  // Focus is in a nested popover (portalled, so not in this list): its own list handles the key.
  if (index === -1) return
  e.preventDefault()
  const last = items.length - 1
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? last : Math.min(Math.max(index + (e.key === 'ArrowDown' ? 1 : -1), 0), last)
  items[next].focus()
}

/**
 * List inside a submenu popover. On open it focuses the current page (or the
 * first enabled item), so Up / Down work straight away; React Aria then skips
 * focusing the popover itself.
 */
function PopupList({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null)
  useEffect(() => {
    const list = ref.current
    const target =
      list?.querySelector<HTMLElement>('[data-fc-menu-item][aria-current="page"]') ??
      list?.querySelector<HTMLElement>('[data-fc-menu-item]:not([data-disabled])')
    target?.focus({ preventScroll: true })
  }, [])
  return (
    <ul ref={ref} className={styles.popupList} onKeyDown={moveFocus}>
      {children}
    </ul>
  )
}

/** Icon (or initial when collapsed), label, chevron. */
function ItemContent({ item, iconOnly, arrow }: { item: MenuItemEntry; iconOnly: boolean; arrow?: ReactNode }) {
  let lead: ReactNode = null
  if (item.icon != null) lead = <span className={styles.icon} aria-hidden="true">{item.icon}</span>
  else if (iconOnly && typeof item.label === 'string') lead = <span className={styles.initial} aria-hidden="true">{item.label.charAt(0)}</span>
  return (
    <>
      {lead}
      <span className={iconOnly ? styles.srOnly : styles.label}>{item.label}</span>
      {arrow != null && !iconOnly && <span className={styles.arrow} aria-hidden="true">{arrow}</span>}
    </>
  )
}

interface EntryProps {
  level: number
  /** Rendered inside a submenu popover. */
  inPopup: boolean
}

function Entries({ entries, level, inPopup }: EntryProps & { entries: MenuItemDef[] }): ReactNode {
  return entries.map((entry) => {
    if (entry.type === 'divider') return <li key={entry.key} className={styles.divider} aria-hidden="true" />
    if (entry.type === 'group') return <GroupEntry key={entry.key} group={entry} level={level} inPopup={inPopup} />
    if (entry.children?.length) {
      return <SubmenuEntry key={entry.key} item={entry} level={level} inPopup={inPopup} />
    }
    return <LinkEntry key={entry.key} item={entry} level={level} inPopup={inPopup} />
  })
}

function GroupEntry({ group, level, inPopup }: EntryProps & { group: MenuGroupEntry }) {
  const { isCollapsed } = useMenuState()
  const id = useId()
  // Collapsed: no room for the title, so a rule separates the group and the title stays for screen readers.
  const iconOnly = isCollapsed && !inPopup
  return (
    <li className={styles.group}>
      {iconOnly ? (
        <div className={styles.groupRule}>
          <span id={id} className={styles.srOnly}>{group.label}</span>
        </div>
      ) : (
        <div id={id} className={styles.groupTitle} style={levelStyle(level)}>{group.label}</div>
      )}
      <ul className={styles.groupList} aria-labelledby={id}>
        <Entries entries={group.children} level={level} inPopup={inPopup} />
      </ul>
    </li>
  )
}

function LinkEntry({ item, level, inPopup }: EntryProps & { item: MenuItemEntry }) {
  const state = useMenuState()
  const iconOnly = state.isCollapsed && !inPopup
  const isCurrent = item.key === state.selectedKey
  const link = (
    <Link
      href={item.href}
      isDisabled={item.isDisabled}
      aria-current={isCurrent ? 'page' : undefined}
      onPress={() => state.activate(item.key)}
      className={cx(styles.item, item.danger && styles.danger, iconOnly && styles.iconOnly)}
      style={levelStyle(level)}
      data-fc-menu-item=""
    >
      <ItemContent item={item} iconOnly={iconOnly} />
    </Link>
  )
  return (
    <li className={styles.entry}>
      {iconOnly ? <Tooltip content={item.label} placement="end">{link}</Tooltip> : link}
    </li>
  )
}

function SubmenuEntry({ item, level, inPopup }: EntryProps & { item: MenuItemEntry }) {
  const state = useMenuState()
  const isOpen = state.open.has(item.key)
  const onOpenChange = (next: boolean) => state.setOpen(item.key, next)
  const isAncestor = state.selectedPath.has(item.key)
  const children = item.children ?? []

  if (!state.isPopup) {
    return (
      <li className={styles.entry}>
        <Disclosure isExpanded={isOpen} onExpandedChange={onOpenChange} isDisabled={item.isDisabled} className={styles.disclosure}>
          <AriaButton
            slot="trigger"
            className={cx(styles.item, item.danger && styles.danger, isAncestor && styles.childSelected)}
            style={levelStyle(level)}
            data-fc-menu-item=""
          >
            <ItemContent item={item} iconOnly={false} arrow={<ChevronDown />} />
          </AriaButton>
          <DisclosurePanel className={styles.panel}>
            <ul className={styles.subList}>
              <Entries entries={children} level={level + 1} inPopup={false} />
            </ul>
          </DisclosurePanel>
        </Disclosure>
      </li>
    )
  }

  const iconOnly = state.isCollapsed && !inPopup
  const trigger = (
    <AriaButton
      isDisabled={item.isDisabled}
      className={cx(styles.item, item.danger && styles.danger, iconOnly && styles.iconOnly, isAncestor && styles.childSelected)}
      data-fc-menu-item=""
    >
      <ItemContent item={item} iconOnly={iconOnly} arrow={<ChevronRight />} />
    </AriaButton>
  )
  return (
    <li className={styles.entry}>
      <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
        {iconOnly ? <Tooltip content={item.label} placement="end">{trigger}</Tooltip> : trigger}
        {/* Portalled out of the menu, so it carries the dark mode itself. Named by its trigger. */}
        <AriaPopover
          placement="end top"
          crossOffset={-4}
          className={cx(overlay.surface, styles.popover, state.isDark && styles.dark)}
          data-mode={state.isDark ? 'dark' : undefined}
        >
          {/* Dialog carries the id and role the trigger's aria-controls points at. */}
          <Dialog className={styles.popupDialog}>
            {item.popupHeader != null && <div className={styles.popupHeader}>{item.popupHeader}</div>}
            <PopupList>
              <Entries entries={children} level={0} inPopup />
            </PopupList>
          </Dialog>
        </AriaPopover>
      </DialogTrigger>
    </li>
  )
}

/**
 * Figma "❖ Menu": the side navigation of the CMS. It is navigation, not an
 * action menu: a `<nav>` landmark with a list of links; the current page
 * carries `aria-current="page"`. For a list of actions use Dropdown.
 *
 * Figma axes: Theme[Light|Dark] → `theme`, Mode[Inline|Vertical] → `mode`,
 * Collapsed[No|Yes] → `isCollapsed`, Logo → `logo`. Items: icon, submenu,
 * group title, Status=Error (`danger`), disabled.
 */
export function Menu({
  items,
  selectedKey: selectedProp,
  defaultSelectedKey,
  openKeys,
  defaultOpenKeys,
  onOpenChange,
  mode = 'inline',
  theme = 'light',
  isCollapsed = false,
  onAction,
  logo,
  'aria-label': ariaLabel = 'Điều hướng chính',
  className,
  ...rest
}: MenuProps) {
  const isPopup = mode === 'vertical' || isCollapsed
  const isDark = theme === 'dark'

  const [selectedState, setSelectedState] = useState<Key | null>(defaultSelectedKey ?? null)
  const selectedKey = selectedProp !== undefined ? selectedProp : selectedState

  // Inline and popup keep separate open sets, so collapsing the menu does not
  // pop open the popovers of the submenus that were expanded inline.
  const [openState, setOpenState] = useState(() => {
    const initial = defaultOpenKeys ? [...defaultOpenKeys] : null
    return {
      inline: new Set<Key>(initial ?? pathTo(items, selectedProp ?? defaultSelectedKey) ?? []),
      popup: new Set<Key>(isPopup ? initial ?? [] : []),
    }
  })
  const open = openKeys !== undefined ? new Set(openKeys) : isPopup ? openState.popup : openState.inline

  const commit = (next: Set<Key>) => {
    if (openKeys === undefined) setOpenState((prev) => (isPopup ? { ...prev, popup: next } : { ...prev, inline: next }))
    onOpenChange?.(next)
  }

  const setOpen = (key: Key, isOpen: boolean) => {
    let next: Set<Key>
    if (isPopup) {
      // Popovers form one chain: opening one closes those off its path.
      next = isOpen ? new Set([...(pathTo(items, key) ?? []), key]) : new Set(open)
      if (!isOpen) {
        next.delete(key)
        for (const k of submenuKeys(findItem(items, key)?.children ?? [])) next.delete(k)
      }
    } else {
      next = new Set(open)
      if (isOpen) next.add(key)
      else next.delete(key)
    }
    commit(next)
  }

  const activate = (key: Key) => {
    if (selectedProp === undefined) setSelectedState(key)
    onAction?.(key)
    if (isPopup && open.size > 0) commit(new Set())
  }

  const state: MenuState = {
    selectedKey,
    selectedPath: new Set(pathTo(items, selectedKey) ?? []),
    open,
    setOpen,
    activate,
    isPopup,
    isCollapsed,
    isDark,
  }

  return (
    <nav
      {...rest}
      aria-label={ariaLabel}
      data-mode={isDark ? 'dark' : undefined}
      className={cx(styles.menu, isDark && styles.dark, isCollapsed && styles.collapsed, className)}
    >
      {logo != null && <div className={styles.logo}>{typeof logo === 'function' ? logo({ isCollapsed }) : logo}</div>}
      <MenuStateContext.Provider value={state}>
        <ul className={styles.list} onKeyDown={moveFocus}>
          <Entries entries={items} level={0} inPopup={false} />
        </ul>
      </MenuStateContext.Provider>
    </nav>
  )
}

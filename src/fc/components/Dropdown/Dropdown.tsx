import { useState, type ReactElement, type ReactNode } from 'react'
import {
  Dialog,
  DialogTrigger,
  Header,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  OverlayArrow,
  Popover as AriaPopover,
  Separator,
  SubmenuTrigger,
  Text,
  type Key,
  type Selection,
} from 'react-aria-components'
import { Check, ChevronDown, ChevronRight } from '../../../icons'
import { cx } from '../../space'
import list from '../../listItem.module.css'
import overlay from '../../overlay.module.css'
import { Button, ButtonGroup, type ButtonSize, type ButtonVariant } from '../Button/Button'
import styles from './Dropdown.module.css'

/** One entry of the menu: an action, a titled group or a divider. */
export type DropdownItem =
  | {
      type?: 'item'
      key: Key
      label: ReactNode
      /** Text for type-ahead and screen readers when `label` is not a string. */
      textValue?: string
      icon?: ReactNode
      /** Second line under the label. */
      description?: ReactNode
      /** Right-hand extra (Figma "Extra"): shortcut, count… */
      extra?: ReactNode
      isDisabled?: boolean
      /** Figma "Danger": destructive action. */
      danger?: boolean
      href?: string
      /** Figma "Submenu": nested items open to the side. */
      children?: DropdownItem[]
    }
  | {
      type: 'group'
      key: Key
      /** Group title (Figma "Group"). Without one, give the group an `aria-label`. */
      label?: ReactNode
      'aria-label'?: string
      children: DropdownItem[]
      /**
       * Selection inside this group only, so one menu can mix a pick-one list
       * (accounts, languages) with plain actions (settings, log out).
       */
      selectionMode?: 'single' | 'multiple'
      selectedKeys?: Iterable<Key>
      defaultSelectedKeys?: Iterable<Key>
      onSelectionChange?: (keys: Selection) => void
    }
  | { type: 'divider'; key: Key }

/** Figma Placement: Bottom Left / Bottom / Bottom Right / Top Left / Top / Top Right. */
export type DropdownPlacement = 'bottom start' | 'bottom' | 'bottom end' | 'top start' | 'top' | 'top end'

export interface DropdownProps {
  items: DropdownItem[]
  onAction?: (key: Key) => void
  /** `single` / `multiple` show a check on selected items (Figma item State=Selected). */
  selectionMode?: 'none' | 'single' | 'multiple'
  selectedKeys?: Iterable<Key>
  defaultSelectedKeys?: Iterable<Key>
  onSelectionChange?: (keys: Selection) => void
  placement?: DropdownPlacement
  /** Figma Arrow. */
  showArrow?: boolean
  /**
   * Figma "Button?" row under the menu (e.g. "Áp dụng"). With a footer the
   * menu sits in a dialog so Tab can reach the footer.
   */
  footer?: ReactNode
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /** Names the menu, e.g. "Thao tác với đơn hàng". Defaults to the trigger's text. */
  'aria-label'?: string
  /** The trigger: a React Aria pressable (fc Button…). Opens on press (not hover) so it works for keyboard and touch. */
  children: ReactElement
  className?: string
}

function itemText(item: { label: ReactNode; textValue?: string }) {
  return item.textValue ?? (typeof item.label === 'string' ? item.label : undefined)
}

/** Items of one menu level; submenus recurse. */
function renderItems(items: DropdownItem[]): ReactNode[] {
  return items.map((item) => {
    if (item.type === 'divider') return <Separator key={item.key} className={list.separator} />
    if (item.type === 'group') {
      return (
        <MenuSection
          key={item.key}
          id={item.key}
          aria-label={item['aria-label']}
          selectionMode={item.selectionMode}
          selectedKeys={item.selectedKeys}
          defaultSelectedKeys={item.defaultSelectedKeys}
          onSelectionChange={item.onSelectionChange}
        >
          {item.label != null && <Header className={list.header}>{item.label}</Header>}
          {renderItems(item.children)}
        </MenuSection>
      )
    }
    const row = (
      <MenuItem
        key={item.key}
        id={item.key}
        textValue={itemText(item)}
        href={item.href}
        isDisabled={item.isDisabled}
        className={cx(list.item, styles.item, item.danger && list.danger)}
      >
        {({ isSelected, selectionMode, hasSubmenu }) => (
          <>
            {item.icon != null && <span className={list.icon} aria-hidden="true">{item.icon}</span>}
            <span className={styles.text}>
              <Text slot="label" className={list.label}>{item.label}</Text>
              {item.description != null && <Text slot="description" className={list.description}>{item.description}</Text>}
            </span>
            {item.extra != null && <span className={list.extra}>{item.extra}</span>}
            {hasSubmenu && <span className={list.extra} aria-hidden="true"><ChevronRight /></span>}
            {selectionMode !== 'none' && isSelected && <span className={list.check} aria-hidden="true"><Check /></span>}
          </>
        )}
      </MenuItem>
    )
    if (!item.children?.length) return row
    return (
      <SubmenuTrigger key={item.key}>
        {row}
        <AriaPopover className={cx(overlay.surface, styles.popover, styles.submenu)} offset={-4}>
          <Menu className={cx(list.list, styles.menu)}>{renderItems(item.children)}</Menu>
        </AriaPopover>
      </SubmenuTrigger>
    )
  })
}

/**
 * Figma "❖ Dropdown": a menu of actions opened from a trigger. For choosing a
 * value in a form use Select; for page navigation use Menu.
 */
export function Dropdown({
  items,
  onAction,
  selectionMode = 'none',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  placement = 'bottom start',
  showArrow = false,
  footer,
  defaultOpen,
  isOpen: controlled,
  onOpenChange,
  'aria-label': ariaLabel,
  children,
  className,
}: DropdownProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen ?? false)
  const isOpen = controlled ?? uncontrolled
  const setOpen = (next: boolean) => {
    if (controlled === undefined) setUncontrolled(next)
    onOpenChange?.(next)
  }

  const menuProps = {
    'aria-label': ariaLabel,
    onAction,
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    className: cx(list.list, styles.menu),
  }
  const arrow = showArrow && (
    <OverlayArrow className={overlay.arrow}>
      <svg viewBox="0 0 16 8" aria-hidden="true"><path d="M0 0 8 8 16 0Z" /></svg>
    </OverlayArrow>
  )
  const popoverClass = cx(overlay.surface, styles.popover, className)
  const offset = showArrow ? 12 : 4

  if (footer != null) {
    return (
      <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
        {children}
        <AriaPopover placement={placement} offset={offset} className={popoverClass}>
          {arrow}
          <Dialog className={styles.dialog} aria-label={ariaLabel ?? 'Menu'}>
            <Menu
              {...menuProps}
              autoFocus="first"
              onAction={(key) => {
                onAction?.(key)
                if (selectionMode === 'none') setOpen(false)
              }}
            >
              {renderItems(items)}
            </Menu>
            <div className={styles.footer}>{footer}</div>
          </Dialog>
        </AriaPopover>
      </DialogTrigger>
    )
  }

  return (
    <MenuTrigger isOpen={isOpen} onOpenChange={setOpen}>
      {children}
      <AriaPopover placement={placement} offset={offset} className={popoverClass}>
        {arrow}
        <Menu {...menuProps}>{renderItems(items)}</Menu>
      </AriaPopover>
    </MenuTrigger>
  )
}

export interface DropdownButtonProps extends Omit<DropdownProps, 'children'> {
  /** Label of the main action. */
  children: ReactNode
  /** The main action (left part). */
  onPress?: () => void
  variant?: Extract<ButtonVariant, 'primary' | 'default' | 'dashed'>
  size?: ButtonSize
  danger?: boolean
  isDisabled?: boolean
  iconStart?: ReactNode
  /** Accessible name of the arrow part. */
  menuLabel?: string
}

/**
 * Figma "Button Twofold": a main action joined to an arrow button that opens
 * the other actions.
 */
export function DropdownButton({
  children,
  onPress,
  variant = 'default',
  size = 'md',
  danger,
  isDisabled,
  iconStart,
  menuLabel = 'Thêm thao tác',
  placement = 'bottom end',
  ...dropdown
}: DropdownButtonProps) {
  const button = { variant, size, danger, isDisabled }
  return (
    <ButtonGroup>
      <Button {...button} iconStart={iconStart} onPress={onPress}>{children}</Button>
      <Dropdown {...dropdown} placement={placement}>
        <Button {...button} aria-label={menuLabel} iconStart={<ChevronDown />} />
      </Dropdown>
    </ButtonGroup>
  )
}

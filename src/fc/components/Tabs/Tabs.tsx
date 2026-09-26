import { useId, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import {
  Button as AriaButton,
  SelectionIndicator,
  Tab,
  TabList,
  TabPanel,
  Tabs as AriaTabs,
  type Key,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components'
import { Plus, XClose } from '../../../icons'
import { cx } from '../../space'
import styles from './Tabs.module.css'

/**
 * Figma "❖ Tabs": `line` = `Tabs / Basic`, `card` = `Tabs / Card`,
 * `editable-card` = `Tabs / Container` (closable tabs + add button).
 */
export type TabsVariant = 'line' | 'card' | 'editable-card'
/** Figma `Tabs / Basic` Placement: which side the tab strip sits on. */
export type TabsPlacement = 'top' | 'bottom' | 'left' | 'right'
/** Figma Size: Small / Default / Large. */
export type TabsSize = 'sm' | 'md' | 'lg'

export interface TabsItem {
  /** Unique key, passed to `onSelectionChange` and `onClose`. */
  key: Key
  /** Omit for an icon-only tab — then `aria-label` is required. */
  label?: ReactNode
  /** Figma tab item `Icon?`: shown before the label. */
  icon?: ReactNode
  /** Figma tab item `Badge?`: an fc `<Badge>` after the label, e.g. `<Badge count={5} size="sm" />`. */
  badge?: ReactNode
  isDisabled?: boolean
  /** Figma tab item `Closeable?` — `editable-card` with `onClose` only. Defaults to true. */
  closable?: boolean
  /** The tab panel. */
  content?: ReactNode
  /** Accessible name when the tab shows only an icon. */
  'aria-label'?: string
}

export interface TabsProps extends Omit<AriaTabsProps, 'children' | 'className' | 'style' | 'orientation' | 'aria-label' | 'aria-labelledby'> {
  items: TabsItem[]
  variant?: TabsVariant
  /** `left` / `right` lay the tab list out vertically (Up / Down arrows move between tabs). */
  placement?: TabsPlacement
  size?: TabsSize
  /** Content at the end of the tab bar (a button, a filter…). */
  extra?: ReactNode
  /**
   * `editable-card`: a closable tab asks to be removed — by its × or by Delete / Backspace
   * while it has focus. Remove it from `items`; if it was selected, select a neighbour.
   */
  onClose?: (key: Key) => void
  /** `editable-card`: the add button was pressed. Append an item (and usually select it). */
  onAdd?: () => void
  /** `editable-card`: hide the add button. */
  hideAdd?: boolean
  /** Name of the add button. */
  addLabel?: string
  /** Read to screen-reader users on a closable tab: how to close it from the keyboard. */
  closeHint?: string
  /** Names the tab list, e.g. "Cài đặt nhà hàng". */
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
}

const stop = (e: PointerEvent | MouseEvent) => e.stopPropagation()
const keepFocus = (e: MouseEvent) => {
  // Clicking × must not focus (and so select) the tab it sits on.
  e.preventDefault()
  e.stopPropagation()
}

/**
 * Figma "❖ Tabs". Built on React Aria `Tabs`: arrow keys move between tabs,
 * selection follows focus, disabled tabs are skipped. The active line tab
 * gets the accent colour and a 2px ink bar that slides between tabs
 * (React Aria `SelectionIndicator`); weight never changes.
 *
 * Closing a tab: the × is a pointer shortcut only (a button inside a `tab`
 * would be a nested interactive control). Keyboard users press Delete or
 * Backspace on the focused tab; `closeHint` tells screen-reader users so.
 */
export function Tabs({
  items,
  variant = 'line',
  placement = 'top',
  size = 'md',
  extra,
  onClose,
  onAdd,
  hideAdd = false,
  addLabel = 'Thêm tab',
  closeHint = 'Nhấn Delete để đóng tab',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className,
  ...rest
}: TabsProps) {
  const hintId = useId()
  const vertical = placement === 'left' || placement === 'right'
  const editable = variant === 'editable-card'
  const isCard = variant !== 'line'
  const isClosable = (item: TabsItem) => editable && onClose != null && item.closable !== false && !item.isDisabled && !rest.isDisabled

  const onKeyDownCapture = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Delete' && e.key !== 'Backspace') return
    const tab = (e.target as HTMLElement).closest<HTMLElement>('[data-fc-tab-key]')
    const item = tab && items.find((i) => String(i.key) === tab.dataset.fcTabKey)
    if (item && isClosable(item)) {
      e.preventDefault()
      onClose?.(item.key)
    }
  }

  return (
    <AriaTabs
      {...rest}
      orientation={vertical ? 'vertical' : 'horizontal'}
      className={cx(
        styles.tabs,
        styles[placement],
        size !== 'md' && styles[size],
        className,
      )}
    >
      <div
        className={cx(styles.nav, styles[`nav-${placement}`], isCard && styles.navCard)}
        onKeyDownCapture={editable && onClose ? onKeyDownCapture : undefined}
      >
        <TabList aria-label={ariaLabel} aria-labelledby={ariaLabelledby} className={cx(styles.list, isCard && styles.listCard)}>
          {items.map((item) => {
            const closable = isClosable(item)
            return (
              <Tab
                key={String(item.key)}
                id={item.key}
                isDisabled={item.isDisabled}
                aria-label={item['aria-label']}
                aria-describedby={closable ? hintId : undefined}
                data-fc-tab-key={String(item.key)}
                className={cx(
                  styles.tab,
                  vertical && styles.tabVertical,
                  isCard && cx(styles.tabCard, styles[`tabCard-${placement}`]),
                )}
              >
                {item.icon != null && <span className={styles.icon}>{item.icon}</span>}
                {(item.label != null || item.badge != null) && (
                  <span className={styles.label}>
                    {item.label}
                    {item.badge != null && <> <span className={styles.badge}>{item.badge}</span></>}
                  </span>
                )}
                {closable && (
                  <span
                    aria-hidden="true"
                    className={styles.close}
                    onPointerDown={stop}
                    onPointerUp={stop}
                    onMouseDown={keepFocus}
                    onClick={(e) => {
                      e.stopPropagation()
                      onClose?.(item.key)
                    }}
                  >
                    <XClose />
                  </span>
                )}
                {variant === 'line' && <SelectionIndicator className={cx(styles.ink, styles[`ink-${placement}`])} />}
              </Tab>
            )
          })}
        </TabList>
        {editable && !hideAdd && (
          <AriaButton className={cx(styles.add, vertical && styles.addVertical)} aria-label={addLabel} onPress={onAdd} isDisabled={rest.isDisabled}>
            <Plus />
          </AriaButton>
        )}
        {extra != null && <div className={cx(styles.extra, vertical && styles.extraVertical)}>{extra}</div>}
        {editable && onClose && <span id={hintId} hidden>{closeHint}</span>}
      </div>
      {items.map((item) => (
        <TabPanel key={String(item.key)} id={item.key} className={styles.panel}>
          {item.content}
        </TabPanel>
      ))}
    </AriaTabs>
  )
}

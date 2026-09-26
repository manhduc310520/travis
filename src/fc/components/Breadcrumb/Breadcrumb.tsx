import type { ReactElement, ReactNode } from 'react'
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  Button as AriaButton,
  Link,
  type Key,
} from 'react-aria-components'
import { ChevronDown } from '../../../icons'
import { cx } from '../../space'
import styles from './Breadcrumb.module.css'

export interface BreadcrumbItem {
  /** Passed to `onAction`. Defaults to the item's index. */
  key?: Key
  /** Figma link `Label?`. Omit for an icon-only item — then `aria-label` is required. */
  label?: ReactNode
  /** Figma link `Icon?` (Figma Type=Icon), shown before the label. */
  icon?: ReactNode
  /** Where the item goes. Without `href` the item is still pressable (`onAction`). */
  href?: string
  /** Accessible name for an icon-only item, e.g. "Trang chủ". */
  'aria-label'?: string
  /**
   * Figma Type=Dropdown — slot for the fc Dropdown. The item renders a
   * trigger (icon + label + chevron, a React Aria `Button`) and hands it to
   * this function to wrap: `menu: (trigger) => <Dropdown items={…}>{trigger}</Dropdown>`.
   */
  menu?: (trigger: ReactElement) => ReactNode
}

export interface BreadcrumbItemState {
  /** Last item: the current page. */
  isCurrent: boolean
  isDisabled: boolean
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** Between items. Defaults to "/". Always hidden from assistive tech. */
  separator?: ReactNode
  /** An item (other than the current page) was pressed. */
  onAction?: (key: Key) => void
  isDisabled?: boolean
  /**
   * Escape hatch: render an item's content yourself (the separator is still
   * added). A React Aria `Link` inside picks up the `onAction` / disabled
   * wiring. Return `undefined` to fall back to the default rendering.
   */
  renderItem?: (item: BreadcrumbItem, state: BreadcrumbItemState) => ReactNode
  /** Name of the navigation landmark. */
  'aria-label'?: string
  className?: string
}

function Content({ item }: { item: BreadcrumbItem }) {
  const iconOnly = item.label == null
  return (
    <>
      {item.icon != null && (
        <span
          className={styles.icon}
          role={iconOnly ? 'img' : undefined}
          aria-label={iconOnly ? item['aria-label'] : undefined}
          aria-hidden={iconOnly ? undefined : true}
        >
          {item.icon}
        </span>
      )}
      {item.label != null && <span>{item.label}</span>}
    </>
  )
}

/**
 * Figma "❖ Breadcrumb" (Type: Basic, Icon, Dropdown). Built on React Aria
 * `Breadcrumbs`: a `nav` landmark around an ordered list. Earlier items are
 * links in Component/Breadcrumb/Content; hover and the current page use
 * Content-Current. The last item is the current page — plain text with
 * `aria-current="page"`, not a link (Figma link State=Current).
 */
export function Breadcrumb({
  items,
  separator = '/',
  onAction,
  isDisabled = false,
  renderItem,
  'aria-label': ariaLabel = 'Đường dẫn',
  className,
}: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel} className={cx(styles.breadcrumb, className)}>
      <AriaBreadcrumbs aria-label={ariaLabel} isDisabled={isDisabled} onAction={onAction} className={styles.list}>
        {items.map((item, index) => {
          const key = item.key ?? index
          const isCurrent = index === items.length - 1
          const custom = renderItem?.(item, { isCurrent, isDisabled: isDisabled || isCurrent })
          let content: ReactNode
          if (custom !== undefined) {
            content = custom
          } else if (item.menu != null) {
            // Figma Type=Dropdown: the caller's fc Dropdown wraps this trigger.
            const menu = item.menu(
              <AriaButton className={cx(styles.link, isCurrent && styles.current)} isDisabled={isDisabled}>
                <Content item={item} />
                <ChevronDown className={styles.chevron} aria-hidden="true" />
              </AriaButton>,
            )
            content = isCurrent ? <span aria-current="page">{menu}</span> : menu
          } else if (isCurrent) {
            content = (
              <span aria-current="page" className={cx(styles.link, styles.current)}>
                <Content item={item} />
              </span>
            )
          } else {
            content = (
              <Link href={item.href} className={styles.link}>
                <Content item={item} />
              </Link>
            )
          }
          return (
            <AriaBreadcrumb key={String(key)} id={key} className={styles.item}>
              {content}
              {!isCurrent && <span aria-hidden="true" className={styles.separator}>{separator}</span>}
            </AriaBreadcrumb>
          )
        })}
      </AriaBreadcrumbs>
    </nav>
  )
}

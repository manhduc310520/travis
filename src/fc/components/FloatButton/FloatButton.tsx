import {
  Children,
  isValidElement,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components'
import { DotsVertical, XClose } from '../../../icons'
import { cx } from '../../space'
import { Badge } from '../Badge/Badge'
import { Tooltip } from '../Tooltip/Tooltip'
import styles from './FloatButton.module.css'

export type FloatButtonType = 'default' | 'primary'
export type FloatButtonShape = 'square' | 'circle'

export interface FloatButtonBadge {
  /** Figma Badge=Small: a number. Hidden at 0. */
  count?: number
  /** Figma Badge=Dot. */
  dot?: boolean
  /** Screen-reader text for the badge, e.g. "5 đơn mới". Defaults to the count. */
  label?: string
}

export interface FloatButtonProps extends Omit<AriaButtonProps, 'className' | 'style' | 'children' | 'type'> {
  /** Figma `FloatButton` Type (visual; the HTML type is always "button"). `primary` is the page's one main floating action. */
  type?: FloatButtonType
  /** Figma `FloatButton` Shape. */
  shape?: FloatButtonShape
  /** Figma Icon / Icon Name. Any icon from `src/icons.tsx`; it is drawn at 24px like Figma. */
  icon?: ReactNode
  /** Figma Description / Description Text: one short line under the icon (the button stays 40 × 40). */
  description?: ReactNode
  /** Figma Badge (None / Dot / Small). */
  badge?: FloatButtonBadge
  /** Figma Tooltip: text shown on hover / focus. */
  tooltip?: ReactNode
  /** Figma shows the tooltip on the left. */
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end'
  /** Open the tooltip on first render (docs / screenshots). */
  tooltipDefaultOpen?: boolean
  /** Pin to the bottom-right corner of the viewport (antd default). Off by default so it can sit in a Group or Menu. */
  affix?: boolean
  /** Icon-only float buttons need `aria-label`. */
  'aria-label'?: string
  /** The underlying `<button>`. */
  ref?: Ref<HTMLButtonElement>
  className?: string
}

/**
 * Figma set `FloatButton`: a 40 × 40 floating action button (`Size/Control/LG`)
 * with `Shadow/Base` and a 24px icon. Square = `Radius/LG`, Circle = pill.
 */
export function FloatButton({
  type = 'default',
  shape = 'square',
  icon,
  description,
  badge,
  tooltip,
  tooltipPlacement = 'left',
  tooltipDefaultOpen,
  affix = false,
  className,
  ...rest
}: FloatButtonProps) {
  let node: ReactNode = (
    <AriaButton {...rest} className={cx(styles.button, styles[type], styles[shape], className)}>
      {icon != null && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      {description != null && <span className={styles.description}>{description}</span>}
    </AriaButton>
  )
  if (tooltip != null) {
    node = (
      <Tooltip content={tooltip} placement={tooltipPlacement} defaultOpen={tooltipDefaultOpen}>
        {node as ReactElement}
      </Tooltip>
    )
  }
  if (badge && (badge.dot || (badge.count ?? 0) > 0)) {
    // A standalone Badge positioned by this component's own class, so the
    // offset never depends on how Badge orders its internal spans.
    node = (
      <span className={cx(styles.badged, shape === 'circle' ? styles.badgedCircle : styles.badgedSquare)}>
        {node}
        <Badge count={badge.count} dot={badge.dot} label={badge.label} size="sm" className={styles.badge} />
      </span>
    )
  }
  if (affix) return <div className={styles.affix}>{node}</div>
  return node
}

export interface FloatButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Figma `FloatButton Group` Type. `square`: one shadowed panel; each item
   * sits in a 4px cell (Figma `FloatButton / FloatButton Item / Group Item`,
   * flat, `Radius/SM`) with a hairline between items. `circle`: separate round
   * buttons `Space/Margin/Base` apart.
   */
  shape?: FloatButtonShape
  /** Figma Direction. */
  direction?: 'vertical' | 'horizontal'
  /** Pin to the bottom-right corner of the viewport. */
  affix?: boolean
  /** Name of the group, e.g. "Công cụ nhanh". */
  'aria-label'?: string
  children: ReactNode
}

export function FloatButtonGroup({ shape = 'square', direction = 'vertical', affix = false, className, children, ...rest }: FloatButtonGroupProps) {
  const square = shape === 'square'
  return (
    <div
      role="group"
      {...rest}
      className={cx(
        styles.group,
        square ? styles.groupSquare : styles.groupCircle,
        direction === 'horizontal' && styles.horizontal,
        affix && styles.affix,
        className,
      )}
    >
      {square
        ? Children.toArray(children).map((child, i) => (
            <div key={isValidElement(child) && child.key != null ? child.key : i} className={styles.groupCell}>
              {child}
            </div>
          ))
        : children}
    </div>
  )
}

export interface FloatButtonMenuProps {
  /** Figma `FloatButton Menu` Placement: where the items open relative to the trigger. */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Figma Open. Controlled. */
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /** Trigger icon while closed. Defaults to a vertical ellipsis; open shows a 16px close (X) icon. */
  icon?: ReactNode
  /** Trigger name while closed. */
  openLabel?: string
  /** Trigger name while open. */
  closeLabel?: string
  /** Accessible name of the items group (the trigger points to it with `aria-controls`). */
  itemsLabel?: string
  /** Figma trigger Badge (the Figma Menu examples show Badge=Dot on the trigger). */
  badge?: FloatButtonBadge
  /** Pin to the bottom-right corner of the viewport. */
  affix?: boolean
  /** The menu items: circle `FloatButton`s. */
  children: ReactNode
  className?: string
}

/**
 * Figma `FloatButton Menu`: a primary circle trigger that reveals a row / column
 * of float buttons `Space/Margin/Base` away. The items float over the page
 * (they do not push the layout). Escape closes the menu and returns focus to
 * the trigger.
 */
export function FloatButtonMenu({
  placement = 'top',
  isOpen,
  defaultOpen = false,
  onOpenChange,
  icon = <DotsVertical />,
  openLabel = 'Mở menu',
  closeLabel = 'Đóng menu',
  itemsLabel = 'Công cụ nhanh',
  badge,
  affix = false,
  children,
  className,
}: FloatButtonMenuProps) {
  const [inner, setInner] = useState(defaultOpen)
  const open = isOpen ?? inner
  const itemsId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const setOpen = (next: boolean) => {
    if (isOpen === undefined) setInner(next)
    onOpenChange?.(next)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape' || !open) return
    e.stopPropagation()
    setOpen(false)
    triggerRef.current?.focus()
  }
  return (
    <div className={cx(styles.menu, styles[`menu-${placement}`], affix && styles.affix, className)} onKeyDown={onKeyDown}>
      <FloatButton
        ref={triggerRef}
        type="primary"
        shape="circle"
        icon={open ? <XClose className={styles.closeIcon} /> : icon}
        badge={badge}
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        aria-controls={open ? itemsId : undefined}
        onPress={() => setOpen(!open)}
      />
      {open && (
        <div
          id={itemsId}
          role="group"
          aria-label={itemsLabel}
          className={cx(styles.menuItems, (placement === 'left' || placement === 'right') && styles.horizontal)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

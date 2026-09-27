import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../space'
import type { PaletteHue } from '../../palette'
import palette from '../../palette.module.css'
import styles from './Badge.module.css'

export type BadgeStatus = 'default' | 'processing' | 'success' | 'warning' | 'error'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Number shown in the indicator. Hidden at 0 unless `showZero`. */
  count?: number
  /** Above this the indicator reads `{overflowCount}+`. */
  overflowCount?: number
  showZero?: boolean
  /** A dot instead of a number. Give it a `label` — a dot alone says nothing to a screen reader. */
  dot?: boolean
  /** Screen-reader text for the indicator, e.g. "12 đơn mới" (12 new orders). Defaults to the count. */
  label?: string
  size?: 'sm' | 'md'
  /** What the badge sits on (icon, avatar, button). Without children the indicator stands alone. */
  children?: ReactNode
}

export function Badge({ count, overflowCount = 99, showZero = false, dot = false, label, size = 'md', children, className, ...rest }: BadgeProps) {
  const hasCount = typeof count === 'number' && (count > 0 || showZero)
  const visible = dot || hasCount
  const text = hasCount ? (count > overflowCount ? `${overflowCount}+` : String(count)) : ''
  const indicator = visible && (
    <span
      className={cx(styles.indicator, dot ? styles.dot : styles.count, size === 'sm' && styles.sm, children != null && styles.attached)}
      role={label ? 'status' : undefined}
    >
      {!dot && <span aria-hidden={label ? true : undefined}>{text}</span>}
      {label && <span className={styles.srOnly}>{label}</span>}
    </span>
  )
  if (children == null) return <span {...rest} className={cx(styles.standalone, className)}>{indicator}</span>
  return (
    <span {...rest} className={cx(styles.wrapper, className)}>
      {children}
      {indicator}
    </span>
  )
}

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus
  /**
   * The status in words — colour alone never carries the meaning. Without
   * visible text (Figma Label=false) pass `aria-label` instead.
   */
  children?: ReactNode
}

export function StatusBadge({ status, children, className, ...rest }: StatusBadgeProps) {
  const dotOnly = children == null
  return (
    <span {...rest} role={dotOnly ? 'img' : undefined} className={cx(styles.status, className)}>
      <span className={cx(styles.statusDot, styles[status])} aria-hidden="true" />
      {children}
    </span>
  )
}

export interface RibbonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** The ribbon's text. */
  text: ReactNode
  /** `default` = brand accent; a palette hue otherwise (Figma Ribbon colours). */
  color?: 'default' | PaletteHue
  placement?: 'start' | 'end'
  /** The card or box the ribbon sits on. */
  children: ReactNode
}

/** Figma "Badge / Ribbon": a label folded over the top corner of a card. */
export function Ribbon({ text, color = 'default', placement = 'end', children, className, ...rest }: RibbonProps) {
  return (
    <div {...rest} className={cx(styles.ribbonWrapper, className)}>
      {children}
      <span className={cx(styles.ribbon, placement === 'start' && styles.ribbonStart, color !== 'default' && cx(styles.ribbonHue, palette[color]))}>
        {text}
        <span className={styles.ribbonCorner} aria-hidden="true" />
      </span>
    </div>
  )
}

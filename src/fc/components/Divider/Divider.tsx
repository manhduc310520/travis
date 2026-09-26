import type { ReactNode } from 'react'
import { Separator } from 'react-aria-components'
import { cx } from '../../space'
import styles from './Divider.module.css'

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  /** Figma Variant: Solid, Dashed, Dotted. */
  variant?: 'solid' | 'dashed' | 'dotted'
  /** Shortcut for `variant="dashed"`. */
  dashed?: boolean
  /** Horizontal only: text in the rule. */
  children?: ReactNode
  titlePlacement?: 'start' | 'center' | 'end'
  /** Title in body text style instead of a heading. */
  plain?: boolean
  className?: string
}

export function Divider({ orientation = 'horizontal', variant = 'solid', dashed = false, children, titlePlacement = 'center', plain = false, className }: DividerProps) {
  const line = dashed ? 'dashed' : variant
  const lineClass = line !== 'solid' && styles[line]
  if (orientation === 'horizontal' && children != null) {
    // A separator's children are hidden from assistive tech, so a titled
    // divider is ordinary text between two drawn rules instead.
    return (
      <div className={cx(styles.titled, titlePlacement !== 'center' && styles[titlePlacement], plain && styles.plain, lineClass, className)}>
        {children}
      </div>
    )
  }
  return (
    <Separator
      orientation={orientation}
      className={cx(orientation === 'vertical' ? styles.vertical : styles.divider, lineClass, className)}
    />
  )
}

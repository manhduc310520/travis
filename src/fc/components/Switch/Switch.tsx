import type { ReactNode } from 'react'
import { Switch as AriaSwitch, type SwitchProps as AriaSwitchProps } from 'react-aria-components'
import { cx } from '../../space'
import styles from './Switch.module.css'

export type SwitchSize = 'sm' | 'md'

export interface SwitchProps extends Omit<AriaSwitchProps, 'className' | 'style' | 'children'> {
  size?: SwitchSize
  /** Figma State=Loading: spinner in the handle; the switch can't be toggled meanwhile. */
  isLoading?: boolean
  /** Figma "Number and Icon": short text, a number or an icon inside the track when on… */
  checkedContent?: ReactNode
  /** …and when off. */
  uncheckedContent?: ReactNode
  /** The visible label. Without it, pass `aria-label`. */
  children?: ReactNode
  className?: string
}

export function Switch({ size = 'md', isLoading = false, checkedContent, uncheckedContent, isDisabled, children, className, ...rest }: SwitchProps) {
  const hasContent = checkedContent != null || uncheckedContent != null
  return (
    <AriaSwitch
      {...rest}
      isDisabled={isDisabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cx(styles.switch, size === 'sm' && styles.sm, hasContent && styles.hasContent, isLoading && styles.loading, className)}
    >
      {({ isSelected }) => (
        <>
          <span className={styles.track} aria-hidden="true">
            {hasContent && <span className={styles.inner}>{isSelected ? checkedContent : uncheckedContent}</span>}
            <span className={styles.handle}>{isLoading && <span className={styles.spinner} />}</span>
          </span>
          {children != null && <span className={styles.label}>{children}</span>}
        </>
      )}
    </AriaSwitch>
  )
}

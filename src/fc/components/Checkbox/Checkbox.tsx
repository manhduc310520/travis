import type { ReactNode } from 'react'
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  FieldError,
  Label,
  Text,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type CheckboxProps as AriaCheckboxProps,
} from 'react-aria-components'
import { cx } from '../../space'
import styles from './Checkbox.module.css'

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'className' | 'style' | 'children'> {
  /** The visible label. Without it, pass `aria-label`. */
  children?: ReactNode
  className?: string
}

export function Checkbox({ children, className, ...rest }: CheckboxProps) {
  return (
    <AriaCheckbox {...rest} className={cx(styles.checkbox, className)}>
      {({ isSelected, isIndeterminate }) => (
        <>
          <span className={styles.box} aria-hidden="true">
            {isIndeterminate ? (
              <span className={styles.dash} />
            ) : (
              isSelected && (
                <svg className={styles.check} viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6.25 5 8.75 9.5 3.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )
            )}
          </span>
          {children != null && <span className={styles.label}>{children}</span>}
        </>
      )}
    </AriaCheckbox>
  )
}

export interface CheckboxGroupProps extends Omit<AriaCheckboxGroupProps, 'className' | 'style' | 'children'> {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  orientation?: 'horizontal' | 'vertical'
  children?: ReactNode
  className?: string
}

export function CheckboxGroup({ label, description, errorMessage, orientation = 'horizontal', children, className, ...rest }: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup {...rest} className={cx(styles.group, className)}>
      {label != null && <Label className={styles.groupLabel}>{label}</Label>}
      <div className={cx(styles.items, orientation === 'vertical' && styles.vertical)}>{children}</div>
      {description != null && <Text slot="description" className={styles.description}>{description}</Text>}
      <FieldError className={styles.error}>{errorMessage}</FieldError>
    </AriaCheckboxGroup>
  )
}

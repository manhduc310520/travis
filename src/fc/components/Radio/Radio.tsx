import type { ReactNode } from 'react'
import {
  FieldError,
  Label,
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  Text,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from 'react-aria-components'
import { cx } from '../../space'
import styles from './Radio.module.css'

export interface RadioProps extends Omit<AriaRadioProps, 'className' | 'style' | 'children'> {
  children?: ReactNode
  className?: string
}

export function Radio({ children, className, ...rest }: RadioProps) {
  return (
    <AriaRadio {...rest} className={cx(styles.radio, className)}>
      <span className={styles.circle} aria-hidden="true" />
      {children != null && <span className={styles.label}>{children}</span>}
    </AriaRadio>
  )
}

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'className' | 'style' | 'children'> {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  /** Figma "Radio / Radio Button": options drawn as joined buttons instead of circles. */
  appearance?: 'default' | 'button'
  /** Button appearance only — Figma Style: Outlined (accent border) or Solid (accent fill). */
  buttonStyle?: 'outlined' | 'solid'
  /** Button appearance only. */
  size?: 'sm' | 'md' | 'lg'
  /** Button appearance only — stretch the buttons across the container (Figma Block=On). */
  block?: boolean
  children?: ReactNode
  className?: string
}

/** `orientation` defaults to horizontal (options in a row), like the Figma component. */
export function RadioGroup({
  label, description, errorMessage, orientation = 'horizontal', appearance = 'default', buttonStyle = 'outlined', size = 'md', block = false,
  children, className, ...rest
}: RadioGroupProps) {
  const buttons = appearance === 'button'
  return (
    <AriaRadioGroup {...rest} orientation={buttons ? 'horizontal' : orientation} className={cx(styles.group, className)}>
      {label != null && <Label className={styles.groupLabel}>{label}</Label>}
      <div
        className={cx(
          styles.items,
          !buttons && orientation === 'vertical' && styles.vertical,
          buttons && styles.buttons,
          buttons && buttonStyle === 'solid' && styles.solid,
          buttons && size !== 'md' && styles[size],
          buttons && block && styles.block,
        )}
      >
        {children}
      </div>
      {description != null && <Text slot="description" className={styles.description}>{description}</Text>}
      <FieldError className={styles.error}>{errorMessage}</FieldError>
    </AriaRadioGroup>
  )
}

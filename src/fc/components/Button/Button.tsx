import type { HTMLAttributes, ReactNode } from 'react'
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components'
import { cx } from '../../space'
import type { PaletteHue } from '../../palette'
import palette from '../../palette.module.css'
import styles from './Button.module.css'

/**
 * Figma has two button sets. `Button / Basic` uses a Type — `primary`,
 * `default`, `dashed`, `text`, `link` — and `Button / Color (optional)` a
 * fill — `solid`, `outlined`, `dashed`, `filled`, `text`, `link` — combined
 * with a colour. Both are accepted here: a Type is a preset of fill + colour
 * (`primary` = solid primary, `default` = outlined default…).
 */
export type ButtonVariant = 'primary' | 'default' | 'dashed' | 'text' | 'link' | 'solid' | 'outlined' | 'filled'
export type ButtonColor = 'default' | 'primary' | 'danger' | PaletteHue
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonShape = 'default' | 'round' | 'circle'

export interface ButtonProps extends Omit<AriaButtonProps, 'className' | 'style' | 'children'> {
  /** One `primary` per screen; everything else steps down to `default`. */
  variant?: ButtonVariant
  /** Overrides the colour the variant implies. Palette hues are for categorised actions, not the main action. */
  color?: ButtonColor
  size?: ButtonSize
  /** `round` = pill ends; `circle` = icon-only round button. */
  shape?: ButtonShape
  /** Destructive action — shortcut for `color="danger"`. */
  danger?: boolean
  /** Transparent background, coloured border and text — for buttons on a coloured or dark surface. */
  ghost?: boolean
  /** Stretch to the container width. */
  block?: boolean
  iconStart?: ReactNode
  iconEnd?: ReactNode
  /** Icon-only buttons need `aria-label` — there is no visible text to name them. */
  children?: ReactNode
  className?: string
}

const FILL: Record<ButtonVariant, 'solid' | 'outlined' | 'dashed' | 'filled' | 'text' | 'link'> = {
  primary: 'solid', default: 'outlined', dashed: 'dashed', text: 'text', link: 'link',
  solid: 'solid', outlined: 'outlined', filled: 'filled',
}

export function Button({
  variant = 'default',
  color,
  size = 'md',
  shape = 'default',
  danger = false,
  ghost = false,
  block = false,
  iconStart,
  iconEnd,
  children,
  className,
  ...rest
}: ButtonProps) {
  const fill = FILL[variant]
  const tone: ButtonColor | 'link' = danger ? 'danger' : color ?? (variant === 'primary' ? 'primary' : variant === 'link' ? 'link' : 'default')
  const isHue = tone !== 'default' && tone !== 'primary' && tone !== 'danger' && tone !== 'link'
  const iconOnly = children == null && (iconStart != null || iconEnd != null)
  const classes = cx(
    styles.button,
    styles[fill],
    isHue ? cx(styles['c-hue'], palette[tone]) : styles[`c-${tone}`],
    size !== 'md' && styles[size],
    shape !== 'default' && styles[shape],
    ghost && styles.ghost,
    block && styles.block,
    iconOnly && styles.iconOnly,
    className,
  )

  return (
    <AriaButton {...rest} className={classes}>
      {({ isPending }) => (
        <>
          {isPending ? <span className={styles.spinner} aria-hidden="true" /> : iconStart}
          {children}
          {!isPending && iconEnd}
        </>
      )}
    </AriaButton>
  )
}

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma "Button Group Compact": buttons joined into one control. */
  orientation?: 'horizontal' | 'vertical'
  /** Name of the group for assistive tech, e.g. "Căn lề". */
  'aria-label'?: string
  children: ReactNode
}

export function ButtonGroup({ orientation = 'horizontal', className, children, ...rest }: ButtonGroupProps) {
  return (
    <div {...rest} role="group" className={cx(styles.group, orientation === 'vertical' && styles.groupVertical, className)}>
      {children}
    </div>
  )
}

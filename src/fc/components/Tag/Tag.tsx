import type { HTMLAttributes, ReactNode } from 'react'
import { Button as AriaButton, ToggleButton, type ToggleButtonProps } from 'react-aria-components'
import { Plus, X } from '../../../icons'
import { cx } from '../../space'
import type { PaletteHue } from '../../palette'
import palette from '../../palette.module.css'
import styles from './Tag.module.css'

/** Preset hues come from Color/Palette — for categorising, never for important status (use Alert / Badge). */
export type TagHue = PaletteHue
/** `info` is Figma's "Processing" status. */
export type TagColor = 'default' | 'success' | 'info' | 'warning' | 'danger' | TagHue
/** Figma Type: Outlined (tint + border), Filled (tint, no border), Solid (strong fill). */
export type TagVariant = 'outlined' | 'filled' | 'solid'

const STATUS = new Set(['default', 'success', 'info', 'warning', 'danger'])
/** Status colours whose Solid tag borrows a palette hue for its fill (see Tag.module.css). */
const SOLID_HUE: Partial<Record<TagColor, PaletteHue>> = { success: 'green', warning: 'amber' }

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  color?: TagColor
  variant?: TagVariant
  icon?: ReactNode
  /** Shortcut for `variant="filled"` (no border). */
  bordered?: boolean
  /** Shows a close button that calls this. */
  onClose?: () => void
  /** Accessible name of the close button. */
  closeLabel?: string
}

export function Tag({ color = 'default', variant = 'outlined', icon, bordered = true, onClose, closeLabel = 'Gỡ thẻ', className, children, ...rest }: TagProps) {
  const v = !bordered && variant === 'outlined' ? 'filled' : variant
  const isStatus = STATUS.has(color)
  const hue = isStatus ? SOLID_HUE[color] : (color as PaletteHue)
  return (
    <span {...rest} className={cx(styles.tag, styles[v], isStatus ? styles[color] : styles.hue, hue && palette[hue], className)}>
      {icon}
      {children}
      {onClose && (
        <AriaButton className={styles.close} aria-label={closeLabel} onPress={onClose}>
          <X size={12} />
        </AriaButton>
      )}
    </span>
  )
}

export interface CheckableTagProps extends Omit<ToggleButtonProps, 'className' | 'style' | 'children'> {
  children?: ReactNode
  className?: string
}

/** Figma "Tag / Checkable": a tag that toggles on press, for filters. */
export function CheckableTag({ className, children, ...rest }: CheckableTagProps) {
  return (
    <ToggleButton {...rest} className={cx(styles.tag, styles.checkable, className)}>
      {children}
    </ToggleButton>
  )
}

export interface TagAddButtonProps {
  onPress?: () => void
  children?: ReactNode
  className?: string
}

/** Figma "Tag / Basic" Variant=Add New: a dashed tag that starts adding a tag. */
export function TagAddButton({ onPress, children = 'Thêm thẻ', className }: TagAddButtonProps) {
  return (
    <AriaButton className={cx(styles.tag, styles.add, className)} onPress={onPress}>
      <Plus size={12} />
      {children}
    </AriaButton>
  )
}

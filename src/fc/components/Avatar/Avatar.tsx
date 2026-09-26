import { Children, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { User01 } from '../../../icons'
import { cx } from '../../space'
import type { PaletteHue } from '../../palette'
import palette from '../../palette.module.css'
import styles from './Avatar.module.css'

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarShape = 'circle' | 'square'

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  src?: string
  /**
   * Who or what the avatar shows: its accessible name. Pass `""` when the
   * name is already printed beside it (menus, headers); the avatar is then
   * hidden from assistive tech instead of being announced twice.
   */
  alt: string
  /** Initials or short text shown when there is no image (or it fails to load). */
  children?: ReactNode
  /** Icon shown when there is neither an image nor text. Defaults to a person. */
  icon?: ReactNode
  /** sm 24 / md 32 / lg 40 (the control heights), or a number of px (Figma Size=Custom). */
  size?: AvatarSize | number
  shape?: AvatarShape
  /** Palette hue for the text/icon fallback. Default is neutral grey. */
  color?: 'default' | PaletteHue
}

export function Avatar({ src, alt, children, icon, size = 'md', shape = 'circle', color = 'default', className, style, ...rest }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImage = src != null && !failed
  const custom = typeof size === 'number'
  // Custom sizes (Figma Size=Custom): icon at half the box; text stays 12px.
  const sizeStyle = custom ? ({ '--_size': `${size}px`, '--_icon': `${Math.round(size / 2)}px` } as CSSProperties) : undefined
  return (
    <span
      {...rest}
      // alt="" marks a decorative avatar (a name is printed next to it): hide it.
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      style={{ ...sizeStyle, ...style }}
      className={cx(
        styles.avatar,
        !custom && size !== 'md' && styles[size],
        shape === 'square' && styles.square,
        !showImage && (color === 'default' ? styles.default : cx(styles.hue, palette[color])),
        className,
      )}
    >
      {showImage ? (
        <img className={styles.image} src={src} alt="" onError={() => setFailed(true)} />
      ) : (
        <span className={styles.fallback} aria-hidden="true">{children ?? icon ?? <User01 />}</span>
      )}
    </span>
  )
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Show at most this many; the rest collapse into a `+N` avatar. */
  max?: number
  size?: AvatarSize
  /** Accessible name of the `+N` avatar; receives the hidden count. */
  moreLabel?: (hidden: number) => string
  children: ReactNode
}

export function AvatarGroup({ max, size = 'md', moreLabel = (n) => `và ${n} người khác`, children, className, ...rest }: AvatarGroupProps) {
  const items = Children.toArray(children)
  const shown = max != null && items.length > max ? items.slice(0, max) : items
  const hidden = items.length - shown.length
  return (
    <div {...rest} role="group" className={cx(styles.group, className)}>
      {shown}
      {hidden > 0 && <Avatar alt={moreLabel(hidden)} size={size}>+{hidden}</Avatar>}
    </div>
  )
}

import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../space'
import styles from './Skeleton.module.css'

export type SkeletonSize = 'sm' | 'md' | 'lg'
type Length = number | string

const len = (value: Length | undefined) => (typeof value === 'number' ? `${value}px` : value)

interface SkeletonElementProps {
  /** Shimmer while waiting. Inside `<Skeleton isActive>` it is inherited. Off under `prefers-reduced-motion`. */
  isActive?: boolean
  className?: string
  style?: CSSProperties
}

export interface SkeletonAvatarProps extends SkeletonElementProps {
  /** Figma "Skeleton Avatar Item" Size: Small / Default / Large = the fc Avatar sizes (24 / 32 / 40), or px. */
  size?: SkeletonSize | number
  /** Figma Shape: Circle / Square. A square takes the fc Avatar radius for its size. */
  shape?: 'circle' | 'square'
}

/** Figma "Skeleton / Skeleton Avatar Item": stands in for an fc `Avatar`. Decorative (hidden from assistive tech). */
export function SkeletonAvatar({ size = 'md', shape = 'circle', isActive, className, style }: SkeletonAvatarProps) {
  const custom = typeof size === 'number'
  return (
    <span
      aria-hidden="true"
      className={cx(styles.block, styles.avatar, !custom && size !== 'md' && styles[size], shape === 'square' && styles.square, isActive && styles.active, className)}
      style={custom ? ({ '--_size': `${size}px`, ...style } as CSSProperties) : style}
    />
  )
}

export interface SkeletonButtonProps extends SkeletonElementProps {
  /** Figma "Skeleton Button Item" Size: Small / Default / Large = the fc Button heights and radii. */
  size?: SkeletonSize
  /** Figma Shape: Default / Round (pill) / Circle (icon-only button). */
  shape?: 'default' | 'round' | 'circle'
  /** Stretch to the container width. */
  block?: boolean
}

/** Figma "Skeleton / Skeleton Button Item": stands in for an fc `Button` (twice as wide as it is tall). Decorative. */
export function SkeletonButton({ size = 'md', shape = 'default', block = false, isActive, className, style }: SkeletonButtonProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(styles.block, styles.button, size !== 'md' && styles[size], shape !== 'default' && styles[shape], block && styles.full, isActive && styles.active, className)}
      style={style}
    />
  )
}

export interface SkeletonInputProps extends SkeletonElementProps {
  /** Figma "Skeleton Input Item" Size: Small / Default / Large = the fc TextField heights and radii. */
  size?: SkeletonSize
  /** Like an fc TextField the bar fills its container; pass a width (px or any CSS length) to shorten it. */
  width?: Length
}

/** Figma "Skeleton / Skeleton Input Item": stands in for an fc `TextField` / `Select`. Decorative. */
export function SkeletonInput({ size = 'md', width, isActive, className, style }: SkeletonInputProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(styles.block, styles.input, size !== 'md' && styles[size], isActive && styles.active, className)}
      style={width != null ? { width: len(width), ...style } : style}
    />
  )
}

export interface SkeletonImageProps extends SkeletonElementProps {
  /** Figma "Skeleton Image Item" Type: Image (picture glyph) / Dot Chart (`chart`). */
  type?: 'image' | 'chart'
  /** Default Component/Skeleton/Image-Size (96) square. */
  width?: Length
  height?: Length
}

/** Figma "Skeleton / Skeleton Image Item": a picture or chart placeholder. Decorative. */
export function SkeletonImage({ type = 'image', width, height, isActive, className, style }: SkeletonImageProps) {
  const size = width != null || height != null ? { width: len(width), height: len(height) } : undefined
  return (
    <span aria-hidden="true" className={cx(styles.block, styles.image, isActive && styles.active, className)} style={{ ...size, ...style }}>
      {type === 'chart' ? <DotChartGlyph /> : <ImageGlyph />}
    </span>
  )
}

/* Glyphs exported from Figma (Skeleton Image Item, Type=Image / Dot Chart); fill = currentColor (Color/Fill/Neutral-Strong). */
function ImageGlyph() {
  return (
    <svg viewBox="0 0 48 39" fill="currentColor" focusable="false">
      <path d="M15.9875 11.1913C15.9875 12.5236 15.5207 13.6555 14.587 14.587C13.6533 15.5185 12.5214 15.9854 11.1913 15.9875C9.8611 15.9896 8.72918 15.5228 7.79551 14.587C6.86184 13.6512 6.395 12.5193 6.395 11.1913C6.395 9.86323 6.86184 8.73131 7.79551 7.79551C8.72918 6.85971 9.8611 6.39287 11.1913 6.395C12.5214 6.39714 13.6533 6.86397 14.587 7.79551C15.5207 8.72705 15.9875 9.85896 15.9875 11.1913ZM41.5675 20.7838V31.975H6.395V27.1788L14.3888 19.185L18.3856 23.1819L31.1756 10.3919L41.5675 20.7838ZM43.9657 3.1975H3.99688C3.77945 3.1975 3.59186 3.27637 3.43412 3.43412C3.27637 3.59186 3.1975 3.77945 3.1975 3.99688V34.3731C3.1975 34.5906 3.27637 34.7782 3.43412 34.9359C3.59186 35.0937 3.77945 35.1725 3.99688 35.1725H43.9657C44.1831 35.1725 44.3707 35.0937 44.5284 34.9359C44.6862 34.7782 44.765 34.5906 44.765 34.3731V3.99688C44.765 3.77945 44.6862 3.59186 44.5284 3.43412C44.3707 3.27637 44.1831 3.1975 43.9657 3.1975ZM47.9625 3.99688V34.3731C47.9625 35.4731 47.5714 36.4142 46.789 37.1965C46.0067 37.9789 45.0656 38.37 43.9657 38.37H3.99688C2.89694 38.37 1.95581 37.9789 1.17348 37.1965C0.391161 36.4142 0 35.4731 0 34.3731V3.99688C0 2.89694 0.391161 1.95581 1.17348 1.17348C1.95581 0.391161 2.89694 0 3.99688 0H43.9657C45.0656 0 46.0067 0.391161 46.789 1.17348C47.5714 1.95581 47.9625 2.89694 47.9625 3.99688Z" />
    </svg>
  )
}

function DotChartGlyph() {
  // Figma's 40 × 37 chart, centred in the image glyph's 48 × 39 box so both types sit at the same size.
  return (
    <svg viewBox="-4 -1 48 39" fill="currentColor" focusable="false">
      <path d="M39.5833 32.9167H3.75V0.416667C3.75 0.1875 3.5625 0 3.33333 0H0.416667C0.1875 0 0 0.1875 0 0.416667V36.25C0 36.4792 0.1875 36.6667 0.416667 36.6667H39.5833C39.8125 36.6667 40 36.4792 40 36.25V33.3333C40 33.1042 39.8125 32.9167 39.5833 32.9167ZM8.33333 23.125C8.33333 24.0091 8.68452 24.8569 9.30964 25.482C9.93477 26.1071 10.7826 26.4583 11.6667 26.4583C12.5507 26.4583 13.3986 26.1071 14.0237 25.482C14.6488 24.8569 15 24.0091 15 23.125C15 22.2409 14.6488 21.3931 14.0237 20.768C13.3986 20.1429 12.5507 19.7917 11.6667 19.7917C10.7826 19.7917 9.93477 20.1429 9.30964 20.768C8.68452 21.3931 8.33333 22.2409 8.33333 23.125ZM14.4792 11.4583C14.4792 12.1214 14.7426 12.7573 15.2114 13.2261C15.6802 13.6949 16.3161 13.9583 16.9792 13.9583C17.6422 13.9583 18.2781 13.6949 18.7469 13.2261C19.2158 12.7573 19.4792 12.1214 19.4792 11.4583C19.4792 10.7953 19.2158 10.1594 18.7469 9.69057C18.2781 9.22173 17.6422 8.95833 16.9792 8.95833C16.3161 8.95833 15.6802 9.22173 15.2114 9.69057C14.7426 10.1594 14.4792 10.7953 14.4792 11.4583ZM22.7083 23.3333C22.7083 24.6594 23.2351 25.9312 24.1728 26.8689C25.1105 27.8066 26.3822 28.3333 27.7083 28.3333C29.0344 28.3333 30.3062 27.8066 31.2439 26.8689C32.1815 25.9312 32.7083 24.6594 32.7083 23.3333C32.7083 22.0073 32.1815 20.7355 31.2439 19.7978C30.3062 18.8601 29.0344 18.3333 27.7083 18.3333C26.3822 18.3333 25.1105 18.8601 24.1728 19.7978C23.2351 20.7355 22.7083 22.0073 22.7083 23.3333ZM30.4167 6.97917C30.4167 7.75272 30.724 8.49458 31.2709 9.04156C31.8179 9.58854 32.5598 9.89583 33.3333 9.89583C34.1069 9.89583 34.8487 9.58854 35.3957 9.04156C35.9427 8.49458 36.25 7.75272 36.25 6.97917C36.25 6.20562 35.9427 5.46375 35.3957 4.91677C34.8487 4.36979 34.1069 4.0625 33.3333 4.0625C32.5598 4.0625 31.8179 4.36979 31.2709 4.91677C30.724 5.46375 30.4167 6.20562 30.4167 6.97917Z" />
    </svg>
  )
}

export interface SkeletonProps {
  /** While true (default) the placeholder shows; when false, `children` render instead. */
  isLoading?: boolean
  /** Shimmer animation. Off under `prefers-reduced-motion`. */
  isActive?: boolean
  /** Figma Type=Complex: an avatar beside the text. Default Large circle, as in Figma. */
  avatar?: boolean | Pick<SkeletonAvatarProps, 'size' | 'shape'>
  /** Title bar (Figma "Skeleton Heading Item"). Default on, 50% wide. */
  title?: boolean | { width?: Length }
  /**
   * Paragraph rows (Figma "Skeleton Paragraph Item"). Default on: 3 rows (Basic), 4 with an avatar (Complex).
   * `width` sets the last row; an array sets each row in turn.
   */
  paragraph?: boolean | { rows?: number; width?: Length | Length[] }
  /** Figma `Input?`: a small input bar under the title. */
  input?: boolean
  /** Figma `Images?`: an image and a chart placeholder above the paragraph. */
  images?: boolean
  /** Figma `Button?`: a small button under the paragraph. */
  button?: boolean
  /** Pill ends on the title and paragraph bars. */
  round?: boolean
  /** Custom placeholder layout (e.g. composed from SkeletonImage / SkeletonButton) replacing title + paragraph. */
  fallback?: ReactNode
  /** Status read by assistive tech while loading. `""` for none, when a parent already announces loading. */
  label?: string
  /** The loaded content. */
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * Figma "❖ Skeleton" (set `Skeleton`: Type Basic / Complex, `Images?`, `Input?`, `Button?`).
 * Grey blocks where content is still loading. The blocks are hidden from
 * assistive tech; one visually hidden `role="status"` says "Đang tải…" (Loading…)
 * instead. That status element stays mounted when loading ends, so a later
 * reload is announced reliably.
 */
export function Skeleton({
  isLoading = true,
  isActive = false,
  avatar = false,
  title = true,
  paragraph = true,
  input = false,
  images = false,
  button = false,
  round = false,
  fallback,
  label = 'Đang tải…',
  children,
  className,
  style,
}: SkeletonProps) {
  const status = label !== '' && (
    <span role="status" className={styles.srOnly}>
      {isLoading ? label : ''}
    </span>
  )

  if (!isLoading) {
    return (
      <div className={styles.loaded}>
        {status}
        {children}
      </div>
    )
  }

  let body: ReactNode = fallback
  if (fallback == null) {
    const avatarProps = typeof avatar === 'object' ? avatar : {}
    const titleWidth = typeof title === 'object' ? len(title.width) : undefined
    const para = typeof paragraph === 'object' ? paragraph : {}
    const rows = para.rows ?? (avatar ? 4 : 3)
    const rowWidth = (i: number) =>
      Array.isArray(para.width) ? len(para.width[i]) : i === rows - 1 ? len(para.width) : undefined

    body = (
      <>
        {avatar !== false && <SkeletonAvatar size={avatarProps.size ?? 'lg'} shape={avatarProps.shape} />}
        <span className={styles.content}>
          {title !== false && <span className={cx(styles.block, styles.title)} style={titleWidth ? { width: titleWidth } : undefined} />}
          {input && <SkeletonInput size="sm" className={styles.inlineInput} />}
          {images && (
            <span className={styles.images}>
              <SkeletonImage />
              <SkeletonImage type="chart" />
            </span>
          )}
          {paragraph !== false && rows > 0 && (
            <span className={styles.paragraph}>
              {Array.from({ length: rows }, (_, i) => {
                const width = rowWidth(i)
                return <span key={i} className={cx(styles.block, styles.row)} style={width ? { width } : undefined} />
              })}
            </span>
          )}
          {button && <SkeletonButton size="sm" />}
        </span>
      </>
    )
  }

  return (
    <div className={cx(styles.skeleton, isActive && styles.active, round && styles.round, className)} style={style}>
      {status}
      <div aria-hidden="true" className={fallback == null ? styles.layout : undefined}>
        {body}
      </div>
    </div>
  )
}

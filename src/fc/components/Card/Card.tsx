import { Children, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../space'
import { Tabs, type TabsProps } from '../Tabs/Tabs'
import styles from './Card.module.css'

/** Figma `Card / Basic` Size: Medium (`md`, default) / Small (`sm`). */
export type CardSize = 'sm' | 'md'
/** Figma `Card / Basic` Borderless: False (`outlined`) / True (`borderless`). */
export type CardVariant = 'outlined' | 'borderless'
type HeadingLevel = 2 | 3 | 4 | 5 | 6

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma `Title`: the header title (14px semibold, one line with ellipsis). */
  title?: ReactNode
  /** Heading level of the title. Defaults to 3 — set it to fit the page outline. */
  titleLevel?: HeadingLevel
  /** Figma "More": content at the end of the header — a link or a small button. */
  extra?: ReactNode
  size?: CardSize
  /** `borderless` drops the outline; put it on the Layout background so it still stands out. */
  variant?: CardVariant
  /** Figma `Card / Inner`: a card nested in another card's body — tinted header. */
  inner?: boolean
  /** Figma `Card / Advanced` Image: a picture above the body, edge to edge. */
  cover?: ReactNode
  /**
   * Figma `Card / Advanced` footer: one cell per action, split by hairlines.
   * Pass real controls (e.g. icon-only `Button variant="text" size="sm"` with an `aria-label`).
   */
  actions?: ReactNode[]
  /** Accessible name of the actions list. */
  actionsLabel?: string
  /**
   * Figma `Card / Basic` Tabs=True: an fc `Tabs` strip under the header. Each tab item's
   * `content` is the body; `children`, if any, follow the tabs. The size follows the card.
   */
  tabs?: Omit<TabsProps, 'size'>
  /** Shows a placeholder body instead of `children` / `tabs` while data loads. */
  isLoading?: boolean
  /** Read to screen readers in place of the placeholder. */
  loadingLabel?: string
  children?: ReactNode
}

/**
 * Figma "❖ Card": a Container surface (8px radius, 1px `Border/Neutral-Light`)
 * with an optional header (title + extra), cover, body, tabs and actions row.
 * Flat: no shadow — it separates from the page by its outline and tone.
 */
export function Card({
  title,
  titleLevel = 3,
  extra,
  size = 'md',
  variant = 'outlined',
  inner = false,
  cover,
  actions,
  actionsLabel = 'Thao tác',
  tabs,
  isLoading = false,
  loadingLabel = 'Đang tải nội dung',
  children,
  className,
  ...rest
}: CardProps) {
  const Heading = `h${titleLevel}` as const
  const hasHeader = title != null || extra != null
  const actionList = actions ? Children.toArray(actions) : []

  let body: ReactNode = null
  if (isLoading) {
    body = (
      <div className={styles.body} aria-busy="true">
        <span className={styles.srOnly}>{loadingLabel}</span>
        <div className={styles.skeleton} aria-hidden="true">
          <span className={cx(styles.bone, styles.boneTitle)} />
          <span className={styles.bone} />
          <span className={styles.bone} />
          <span className={cx(styles.bone, styles.boneLast)} />
        </div>
      </div>
    )
  } else if (tabs) {
    body = (
      <div className={styles.tabsBody}>
        <Tabs {...tabs} size={size} />
        {children}
      </div>
    )
  } else if (children != null) {
    body = <div className={styles.body}>{children}</div>
  }

  return (
    <div
      {...rest}
      className={cx(
        styles.card,
        size === 'sm' && styles.sm,
        variant === 'borderless' && styles.borderless,
        inner && styles.inner,
        className,
      )}
    >
      {hasHeader && (
        <div className={styles.header}>
          {title != null && <Heading className={styles.title}>{title}</Heading>}
          {extra != null && <div className={styles.extra}>{extra}</div>}
        </div>
      )}
      {cover != null && <div className={styles.cover}>{cover}</div>}
      {body}
      {actionList.length > 0 && (
        <ul className={styles.actions} aria-label={actionsLabel}>
          {actionList.map((action, i) => (
            <li key={i} className={styles.action}>{action}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export interface CardMetaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma `Card / Advanced` Type=Advanced: an fc `Avatar` before the text. */
  avatar?: ReactNode
  /** 16px semibold. */
  title?: ReactNode
  /** Heading level of the title; defaults to 3 (the card usually has no header of its own). */
  titleLevel?: HeadingLevel
  /** Secondary line in `Content/Description`. */
  description?: ReactNode
}

/** Figma `Card / Advanced` body: avatar + title + description, as one block in the card body. */
export function CardMeta({ avatar, title, titleLevel = 3, description, className, ...rest }: CardMetaProps) {
  const Heading = `h${titleLevel}` as const
  return (
    <div {...rest} className={cx(styles.meta, className)}>
      {avatar != null && <div className={styles.metaAvatar}>{avatar}</div>}
      <div className={styles.metaText}>
        {title != null && <Heading className={styles.metaTitle}>{title}</Heading>}
        {description != null && <div className={styles.metaDescription}>{description}</div>}
      </div>
    </div>
  )
}

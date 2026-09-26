import type { FC, HTMLAttributes, ReactNode } from 'react'
import { AlertTriangle, CheckCircle, SearchSm, XCircle, type IconProps } from '../../../icons'
import { cx } from '../../space'
import { Forbidden, NotFound, ServerError } from './illustrations'
import styles from './Result.module.css'

/** Figma `Result` Status (Custom icon = any status plus `icon`). */
export type ResultStatus = 'info' | 'success' | 'warning' | 'error' | '403' | '404' | '500'

type IconStatus = 'info' | 'success' | 'warning' | 'error'
type PageStatus = '403' | '404' | '500'

/** The glyphs Figma draws per Status (Info is `search-sm`, Warning `alert-triangle`). */
const ICON: Record<IconStatus, FC<IconProps>> = {
  info: SearchSm,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

const ILLUSTRATION: Record<PageStatus, FC<{ className?: string }>> = {
  '403': Forbidden,
  '404': NotFound,
  '500': ServerError,
}

/** Default subtitles of the error pages; pass `subtitle` to replace, `null` to hide. */
const PAGE_SUBTITLE: Record<PageStatus, string> = {
  '403': 'Xin lỗi, bạn không có quyền truy cập trang này.',
  '404': 'Xin lỗi, trang bạn tìm không tồn tại.',
  '500': 'Xin lỗi, máy chủ đang gặp sự cố. Vui lòng thử lại sau.',
}

const isPage = (status: ResultStatus): status is PageStatus => status in ILLUSTRATION

export interface ResultProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /**
   * Figma Status. `info` / `success` / `warning` / `error` draw a 40px line
   * icon; `403` / `404` / `500` draw the Figma illustration.
   */
  status?: ResultStatus
  /** Figma Status=Custom icon: replaces the status icon or illustration. `null` hides it. */
  icon?: ReactNode
  /** 16 / 600 heading. Error pages default to their code ("404"). */
  title?: ReactNode
  /** Supporting text under the title. Error pages get a Vietnamese default. */
  subtitle?: ReactNode
  /** Figma "Buttons" slot: actions under the text — one primary, the rest default. */
  extra?: ReactNode
  /** Figma "Error Details" slot: extra content on a tinted panel below the actions. */
  children?: ReactNode
  /** Level of the title heading. Default 2. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

/**
 * Figma "❖ Result" — the outcome of an action or a whole-page state: a
 * status icon (or the 403 / 404 / 500 illustration), title, subtitle,
 * actions and optional detail content, centred. The icon is decorative;
 * the title carries the message.
 */
export function Result({
  status = 'info',
  icon,
  title,
  subtitle,
  extra,
  children,
  headingLevel = 2,
  className,
  ...rest
}: ResultProps) {
  const page = isPage(status) ? status : undefined
  const heading = title === undefined && page ? page : title
  const sub = subtitle === undefined && page ? PAGE_SUBTITLE[page] : subtitle
  const Heading = `h${headingLevel}` as 'h2'

  let visual: ReactNode = null
  if (icon !== undefined) {
    visual = icon != null && <div className={styles.icon} aria-hidden="true">{icon}</div>
  } else if (page) {
    const Art = ILLUSTRATION[page]
    visual = <div className={styles.image}><Art className={styles.art} /></div>
  } else {
    const Glyph = ICON[status as IconStatus]
    visual = <div className={styles.icon} aria-hidden="true"><Glyph /></div>
  }

  return (
    <div {...rest} className={cx(styles.result, className)}>
      {visual}
      {(heading != null || sub != null) && (
        <div className={styles.text}>
          {heading != null && <Heading className={styles.title}>{heading}</Heading>}
          {sub != null && <div className={styles.subtitle}>{sub}</div>}
        </div>
      )}
      {extra != null && <div className={styles.extra}>{extra}</div>}
      {children != null && <div className={styles.content}>{children}</div>}
    </div>
  )
}

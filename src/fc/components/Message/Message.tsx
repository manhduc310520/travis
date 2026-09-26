import type { FC, ReactNode } from 'react'
import { Text } from 'react-aria-components'
import { AlertCircle, CheckCircle, InfoCircle, Loading02, XCircle, type IconProps } from '../../../icons'
import { cx } from '../../space'
import overlay from '../../overlay.module.css'
import { messageQueue, type MessageType } from './messageApi'
import { ToastContent, ToastItem, ToastRegion } from './toast'
import styles from './Message.module.css'

const ICON: Record<MessageType, FC<IconProps>> = {
  info: InfoCircle,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  loading: Loading02,
}

/** Read before the text, so the type is not carried by colour and shape alone. */
const ICON_LABEL: Record<MessageType, string | undefined> = {
  info: 'Thông tin',
  success: 'Thành công',
  warning: 'Cảnh báo',
  error: 'Lỗi',
  loading: undefined, // the text already says it ("Đang …")
}

interface MessageBodyProps {
  type: MessageType
  iconLabel?: string
  /** Inside a live toast the text is React Aria's title slot (names the alertdialog). */
  live?: boolean
  children: ReactNode
}

function MessageBody({ type, iconLabel, live, children }: MessageBodyProps) {
  const Icon = ICON[type]
  const label = iconLabel ?? ICON_LABEL[type]
  return (
    <>
      <span className={cx(styles.icon, styles[type])} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
        <Icon aria-hidden="true" />
      </span>
      {live ? (
        <Text slot="title" className={styles.text}>{children}</Text>
      ) : (
        <span className={styles.text}>{children}</span>
      )}
    </>
  )
}

export interface MessageCardProps {
  /** Figma Type: Normal → `info`, Success, Warning, Error, Loading. */
  type?: MessageType
  /** Screen-reader name of the icon. Defaults to the Vietnamese type name ("Lỗi"…). */
  iconLabel?: string
  /** The message, one short sentence. */
  children: ReactNode
  className?: string
}

/**
 * Figma "❖ Message" drawn in place, outside the queue — for documentation
 * and static previews. In the app call `message.success(…)` instead.
 */
export function MessageCard({ type = 'info', iconLabel, children, className }: MessageCardProps) {
  return (
    <div className={cx(overlay.surface, styles.message, className)}>
      <div className={styles.content}>
        <MessageBody type={type} iconLabel={iconLabel}>{children}</MessageBody>
      </div>
    </div>
  )
}

export interface MessageRegionProps {
  /** Name of the landmark region. */
  'aria-label'?: string
}

/**
 * Where `message.*` calls appear: centred at the top of the viewport, newest
 * first. Render it once, inside `FcTheme` (it portals into FcTheme's themed
 * container). Timers pause while the pointer or focus is on a message; F6
 * reaches the region from the keyboard. Info, success and loading are
 * announced politely, warning and error assertively.
 */
export function MessageRegion({ 'aria-label': label = 'Thông báo nhanh' }: MessageRegionProps) {
  return (
    <ToastRegion queue={messageQueue} className={styles.region} aria-label={label}>
      {(toast) => {
        const { type, content, iconLabel } = toast.content
        return (
          <ToastItem queue={messageQueue} toast={toast} className={cx(overlay.surface, styles.message)}>
            <ToastContent polite={type !== 'warning' && type !== 'error'} className={styles.content}>
              <MessageBody type={type} iconLabel={iconLabel} live>{content}</MessageBody>
            </ToastContent>
          </ToastItem>
        )
      }}
    </ToastRegion>
  )
}

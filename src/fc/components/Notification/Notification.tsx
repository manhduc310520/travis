import type { FC } from 'react'
import { Text } from 'react-aria-components'
import { AlertCircle, CheckCircle, InfoCircle, X, XCircle, type IconProps } from '../../../icons'
import { cx } from '../../space'
import overlay from '../../overlay.module.css'
import { Button } from '../Button/Button'
import { ToastContent, ToastItem, ToastRegion } from '../Message/toast'
import { notificationQueue, type NotificationAction, type NotificationContent, type NotificationType } from './notificationApi'
import styles from './Notification.module.css'

type IconType = Exclude<NotificationType, 'basic'>

const ICON: Record<IconType, FC<IconProps>> = {
  info: InfoCircle,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
}

/** Read before the title, so the type is not carried by colour and shape alone. */
const ICON_LABEL: Record<IconType, string> = {
  info: 'Thông tin',
  success: 'Thành công',
  warning: 'Cảnh báo',
  error: 'Lỗi',
}

const CLOSE_LABEL = 'Đóng thông báo'

interface BodyProps extends Omit<NotificationContent, 'actions'> {
  /** Inside a live toast, title and description fill React Aria's slots (name and describe the alertdialog). */
  live?: boolean
}

function NotificationBody({ title, description, type = 'basic', showIcon = true, icon, iconLabel, live }: BodyProps) {
  const TypeIcon = type === 'basic' ? undefined : ICON[type]
  const glyph = icon ?? (TypeIcon ? <TypeIcon aria-hidden="true" /> : null)
  // A custom icon is decorative unless named; a type icon is named after the type.
  const label = iconLabel ?? (icon == null && type !== 'basic' ? ICON_LABEL[type] : undefined)
  return (
    <>
      {showIcon && glyph != null && (
        <span className={cx(styles.icon, styles[type])} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
          {glyph}
        </span>
      )}
      <div className={styles.body}>
        {live ? (
          <Text slot="title" elementType="div" className={styles.title}>{title}</Text>
        ) : (
          <div className={styles.title}>{title}</div>
        )}
        {description != null && (live ? (
          <Text slot="description" elementType="div" className={styles.description}>{description}</Text>
        ) : (
          <div className={styles.description}>{description}</div>
        ))}
      </div>
    </>
  )
}

function NotificationActions({ actions, onClose }: { actions: NotificationAction[]; onClose?: () => void }) {
  // One primary per surface: any primary after the first steps down to default.
  const primary = actions.findIndex((a) => a.variant === 'primary')
  return (
    <div className={styles.actions}>
      {actions.map(({ label, onPress, variant = 'default', danger, keepOpen }, i) => (
        <Button
          key={i}
          size="sm"
          variant={variant === 'primary' && i !== primary ? 'default' : variant}
          danger={danger}
          onPress={() => {
            onPress?.()
            if (!keepOpen) onClose?.()
          }}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}

function CloseButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return <Button className={styles.close} variant="text" size="sm" aria-label={label} iconStart={<X />} onPress={onPress} />
}

export interface NotificationCardProps extends NotificationContent {
  /** Called by the close button and, unless `keepOpen`, after an action. */
  onClose?: () => void
  /** Accessible name of the close button. */
  closeLabel?: string
  className?: string
}

/**
 * Figma "❖ Notification" drawn in place, outside the queue — for
 * documentation and static previews. In the app call `notification.open(…)`.
 */
export function NotificationCard({ actions, onClose, closeLabel = CLOSE_LABEL, className, ...content }: NotificationCardProps) {
  return (
    <div className={cx(overlay.surface, styles.notice, className)}>
      <div className={styles.main}>
        <NotificationBody {...content} />
      </div>
      {actions != null && actions.length > 0 && <NotificationActions actions={actions} onClose={onClose} />}
      <CloseButton label={closeLabel} onPress={onClose} />
    </div>
  )
}

export interface NotificationRegionProps {
  /** Name of the landmark region. */
  'aria-label'?: string
  /** Accessible name of every close button. */
  closeLabel?: string
}

/**
 * Where `notification.*` calls appear: top-right, newest first. Render it
 * once, inside `FcTheme` (it portals into FcTheme's themed container).
 * Timers pause while the pointer or focus is on a notification; F6 reaches
 * the region from the keyboard. Basic, info and success are announced
 * politely, warning and error assertively.
 */
export function NotificationRegion({ 'aria-label': label = 'Thông báo', closeLabel = CLOSE_LABEL }: NotificationRegionProps) {
  return (
    <ToastRegion queue={notificationQueue} className={styles.region} aria-label={label}>
      {(toast) => {
        const { actions, ...content } = toast.content
        const close = () => notificationQueue.close(toast.key)
        return (
          <ToastItem queue={notificationQueue} toast={toast} className={cx(overlay.surface, styles.notice)}>
            <ToastContent polite={content.type !== 'warning' && content.type !== 'error'} className={styles.main}>
              <NotificationBody {...content} live />
            </ToastContent>
            {actions != null && actions.length > 0 && <NotificationActions actions={actions} onClose={close} />}
            <CloseButton label={closeLabel} onPress={close} />
          </ToastItem>
        )
      }}
    </ToastRegion>
  )
}

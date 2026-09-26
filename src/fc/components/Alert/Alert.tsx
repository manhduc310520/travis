import { useEffect, useRef, useState, type CSSProperties, type FC, type HTMLAttributes, type ReactNode } from 'react'
import { Button as AriaButton } from 'react-aria-components'
import { AlertCircle, CheckCircle, InfoCircle, X, XCircle, type IconProps } from '../../../icons'
import { cx } from '../../space'
import styles from './Alert.module.css'

/** Figma `Alert` Type. */
export type AlertType = 'info' | 'success' | 'warning' | 'error'

/** The circle icons the Figma Alert instances use per Type. */
const ICON: Record<AlertType, FC<IconProps>> = {
  info: InfoCircle,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
}

/** Read before the title, so the type is not carried by colour and shape alone. */
const TYPE_LABEL: Record<AlertType, string> = {
  info: 'Thông tin',
  success: 'Thành công',
  warning: 'Cảnh báo',
  error: 'Lỗi',
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma Type. Default `info` (`warning` when `banner`). */
  type?: AlertType
  /** Figma "Title text". */
  title: ReactNode
  /** Figma Description=True: a second line of copy; the alert switches to its roomier layout (24px icon, 16px title). */
  description?: ReactNode
  /** Shows the type icon (or `icon`). Default true, as in every Figma variant. */
  showIcon?: boolean
  /** Replaces the type icon. Decorative unless `iconLabel` is given. */
  icon?: ReactNode
  /** Accessible name of the icon. Default: the type ("Lỗi", "Cảnh báo"…) for the type icon. */
  iconLabel?: string
  /** Figma Banner=True: no border, no radius — sits flush at the top of a page or panel. */
  banner?: boolean
  /** Figma "Custom Actions": buttons or links at the end, before the close button. */
  action?: ReactNode
  /** Figma "Close Icon": an × button that dismisses the alert. */
  closable?: boolean
  /** Figma "Close Text": a text close button (e.g. "Đã hiểu") instead of the ×. Implies `closable`. */
  closeText?: ReactNode
  /** Accessible name of the × button. */
  closeLabel?: string
  /** Called when the close button is pressed, before the exit animation. */
  onClose?: () => void
  /** Called once the alert has left (after the exit animation, at once under reduced motion). */
  afterClose?: () => void
}

type Phase = 'open' | 'exiting' | 'closed'

/**
 * Figma "❖ Alert" — an inline message about the page or a section: faded
 * status background, status-coloured icon and title. Error and warning are
 * announced assertively (`role="alert"`), info and success politely
 * (`role="status"`); pass `role` to override. For status that matters use
 * Alert (or Badge), never Tag. Closing collapses it, then unmounts it.
 */
export function Alert({
  type,
  title,
  description,
  showIcon = true,
  icon,
  iconLabel,
  banner = false,
  action,
  closable = false,
  closeText,
  closeLabel = 'Đóng',
  onClose,
  afterClose,
  role,
  className,
  style,
  ...rest
}: AlertProps) {
  const kind: AlertType = type ?? (banner ? 'warning' : 'info')
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('open')
  const [height, setHeight] = useState<number>()
  const afterCloseRef = useRef(afterClose)
  useEffect(() => {
    afterCloseRef.current = afterClose
  })

  // Wait for the collapse animation (none under reduced motion), then unmount.
  useEffect(() => {
    if (phase !== 'exiting') return
    let active = true
    const finish = () => {
      if (!active) return
      setPhase('closed')
      afterCloseRef.current?.()
    }
    const animations = ref.current?.getAnimations?.() ?? []
    if (animations.length === 0) finish()
    else Promise.all(animations.map((a) => a.finished)).then(finish, () => {})
    return () => {
      active = false
    }
  }, [phase])

  if (phase === 'closed') return null

  const close = () => {
    if (phase !== 'open') return
    onClose?.()
    setHeight(ref.current?.offsetHeight)
    setPhase('exiting')
  }

  const TypeIcon = ICON[kind]
  const label = iconLabel ?? (icon == null ? TYPE_LABEL[kind] : undefined)
  const hasClose = closable || closeText != null
  const merged = height != null ? ({ ...style, '--_height': `${height}px` } as CSSProperties) : style

  return (
    <div
      {...rest}
      ref={ref}
      role={role ?? (kind === 'error' || kind === 'warning' ? 'alert' : 'status')}
      className={cx(styles.alert, styles[kind], description != null && styles.withDescription, banner && styles.banner, className)}
      style={merged}
      data-exiting={phase === 'exiting' || undefined}
    >
      {showIcon && (
        <span className={styles.icon} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
          {icon ?? <TypeIcon />}
        </span>
      )}
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          {description != null && <div className={styles.description}>{description}</div>}
        </div>
        {(action != null || hasClose) && (
          <div className={styles.actions}>
            {action}
            {hasClose && (
              <AriaButton
                className={cx(styles.close, closeText != null && styles.closeText)}
                aria-label={closeText != null ? undefined : closeLabel}
                onPress={close}
              >
                {closeText ?? <X />}
              </AriaButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

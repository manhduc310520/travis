import type { ReactNode } from 'react'
import { FcToastQueue, toTimeout } from '../Message/toastQueue'
import type { CloseToast } from '../Message/messageApi'

/** Figma "❖ Notification" Type: Basic (no icon), Info, Success, Warning, Error. */
export type NotificationType = 'basic' | 'info' | 'success' | 'warning' | 'error'

/** A button in the notification's footer (Figma Buttons?=true), drawn as an fc `Button` size `sm`. */
export interface NotificationAction {
  label: string
  onPress?: () => void
  /** One `primary` per notification: any further primary renders as `default`. */
  variant?: 'primary' | 'default' | 'text' | 'link'
  danger?: boolean
  /** Keep the notification open after the press. By default an action closes it. */
  keepOpen?: boolean
}

/** What a notification shows — shared by `notification.open` and `NotificationCard`. */
export interface NotificationContent {
  /** First line, 600 weight; also names the notification for screen readers. */
  title: ReactNode
  description?: ReactNode
  /** Figma Type. Default `basic`. */
  type?: NotificationType
  /** Figma Show Icon?. Default true; `basic` has no icon unless `icon` is given. */
  showIcon?: boolean
  /** Replaces the type icon (24px), e.g. a cart for a new order. */
  icon?: ReactNode
  /** Screen-reader name of the icon. Defaults to the Vietnamese type name ("Lỗi"…). */
  iconLabel?: string
  /** Figma Buttons?: footer actions, right-aligned. */
  actions?: NotificationAction[]
}

export interface NotificationConfig extends NotificationContent {
  /**
   * Seconds before it closes. Default 4.5; 0 = stays until closed. With
   * `actions` the default is 0: people need time to reach the buttons.
   */
  duration?: number
  /** Called when the notification closes (timer, close button, action or `close()`); not on `notification.destroy()`. */
  onClose?: () => void
}

/** @internal The single queue `notification` writes to and `NotificationRegion` reads. */
export const notificationQueue = new FcToastQueue<NotificationContent>()

function open({ duration, onClose, ...content }: NotificationConfig): CloseToast {
  const seconds = duration ?? (content.actions?.length ? 0 : 4.5)
  const key = notificationQueue.add(content, { timeout: toTimeout(seconds), onClose })
  return () => notificationQueue.close(key)
}

type NotificationFn = (config: Omit<NotificationConfig, 'type'>) => CloseToast

/**
 * Figma "❖ Notification": a titled notice in the top-right corner, stacked,
 * with an optional icon, description and actions. Call it from anywhere;
 * render `<NotificationRegion />` (or `<Toaster />`) once inside `FcTheme`.
 *
 * ```ts
 * notification.info({
 *   title: 'Đơn hàng mới #1024',
 *   description: 'Bàn 12 · 3 món · 245.000đ',
 *   actions: [{ label: 'Xem đơn', variant: 'primary', onPress: openOrder }],
 * })
 * ```
 */
export const notification: {
  open: (config: NotificationConfig) => CloseToast
  info: NotificationFn
  success: NotificationFn
  warning: NotificationFn
  error: NotificationFn
  /** Closes every notification at once, without animation. */
  destroy: () => void
} = {
  open,
  info: (config) => open({ ...config, type: 'info' }),
  success: (config) => open({ ...config, type: 'success' }),
  warning: (config) => open({ ...config, type: 'warning' }),
  error: (config) => open({ ...config, type: 'error' }),
  destroy: () => notificationQueue.clear(),
}

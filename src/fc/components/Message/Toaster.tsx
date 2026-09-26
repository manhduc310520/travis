import { NotificationRegion, type NotificationRegionProps } from '../Notification/Notification'
import { MessageRegion, type MessageRegionProps } from './Message'

export interface ToasterProps {
  /** Forwarded to `MessageRegion`. */
  message?: MessageRegionProps
  /** Forwarded to `NotificationRegion`. */
  notification?: NotificationRegionProps
}

/**
 * Both toast regions in one: `message.*` at the top centre, `notification.*`
 * at the top right. Render it once, inside `FcTheme`, next to the app:
 *
 * ```tsx
 * <FcTheme><App /><Toaster /></FcTheme>
 * ```
 */
export function Toaster({ message, notification }: ToasterProps) {
  return (
    <>
      <MessageRegion {...message} />
      <NotificationRegion {...notification} />
    </>
  )
}

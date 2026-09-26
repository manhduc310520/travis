import { useEffect, useId, useState, useSyncExternalStore, type ReactElement, type ReactNode } from 'react'
import { useUNSAFE_PortalContext } from 'react-aria'
import {
  UNSTABLE_Toast,
  UNSTABLE_ToastContent,
  UNSTABLE_ToastRegion,
  type QueuedToast,
} from 'react-aria-components'
import type { FcToastQueue } from './toastQueue'

/*
 * Shared building blocks of Message and Notification. Internal: the public
 * API is `message`, `notification`, `MessageRegion`, `NotificationRegion`
 * and `Toaster`.
 */

interface ToastRegionProps<T> {
  queue: FcToastQueue<T>
  className: string
  /** Names the landmark (F6 moves between landmarks). */
  'aria-label': string
  children: (toast: QueuedToast<T>) => ReactElement
}

/**
 * React Aria portals the region into the container that `UNSAFE_PortalProvider`
 * hands out — inside `FcTheme`, the themed `.fc-portal` element on
 * `document.body`, where every `--fc-*` value resolves. Until that container
 * exists (first render) React Aria renders nothing, then renders again.
 */
export function ToastRegion<T>({ queue, className, 'aria-label': label, children }: ToastRegionProps<T>) {
  const id = useId()
  const isActive = useSyncExternalStore(queue.subscribeFc, () => queue.activeRegion() === id, () => false)
  useEffect(() => queue.attachRegion(id), [queue, id])

  const { getContainer } = useUNSAFE_PortalContext()
  useEffect(() => {
    if (import.meta.env.DEV && !getContainer) {
      console.warn(`fc: <${label}> region rendered outside <FcTheme>; toasts land on document.body where --fc-* tokens do not resolve.`)
    }
  }, [getContainer, label])

  if (!isActive) return null
  return (
    <UNSTABLE_ToastRegion queue={queue} className={className} aria-label={label}>
      {({ toast }) => children(toast)}
    </UNSTABLE_ToastRegion>
  )
}

interface ToastItemProps<T> {
  queue: FcToastQueue<T>
  toast: QueuedToast<T>
  className: string
  children: ReactNode
}

/**
 * One toast (`role="alertdialog"`, focusable, timers pause while the region
 * is hovered or focused). React Aria's Toast has no entering / exiting
 * states, so they are set here with the same data attributes React Aria's
 * overlays use, and `overlay.module.css` animates them.
 */
export function ToastItem<T>({ queue, toast, className, children }: ToastItemProps<T>) {
  const isExiting = useSyncExternalStore(queue.subscribeFc, () => queue.isExiting(toast.key), () => false)
  const [isEntering, setEntering] = useState(true)
  return (
    <UNSTABLE_Toast
      toast={toast}
      className={className}
      data-entering={isEntering || undefined}
      data-exiting={isExiting || undefined}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setEntering(false)
      }}
    >
      {children}
    </UNSTABLE_Toast>
  )
}

interface ToastContentProps {
  /**
   * The live part of the toast. React Aria announces it as `role="alert"`
   * (assertive); `polite` switches to `role="status"` so routine feedback
   * (saved, syncing) waits for the screen reader to finish speaking.
   */
  polite: boolean
  className: string
  children: ReactNode
}

export function ToastContent({ polite, className, children }: ToastContentProps) {
  return (
    <UNSTABLE_ToastContent className={className} role={polite ? 'status' : undefined}>
      {children}
    </UNSTABLE_ToastContent>
  )
}

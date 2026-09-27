import type { ReactNode } from 'react'
import { FcToastQueue, toTimeout } from './toastQueue'

/** Figma "❖ Message" Type: Normal → `info`, Success, Warning, Error, Loading. */
export type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading'

export interface MessageOptions {
  /** Seconds before it closes. Default 3; `loading` stays until closed. 0 = stays until closed. */
  duration?: number
  /** Called when the message closes (timer or `close()`); not on `message.destroy()`. */
  onClose?: () => void
  /** Screen-reader name of the type icon, e.g. "Lỗi" (Error). Defaults to the Vietnamese type name. */
  iconLabel?: string
}

/** Closes the message it was returned for. Safe to call more than once. */
export type CloseToast = () => void

/** @internal What `MessageRegion` renders for each queued message. */
export interface MessageContent {
  type: MessageType
  content: ReactNode
  iconLabel?: string
}

/** @internal The single queue `message` writes to and `MessageRegion` reads. */
export const messageQueue = new FcToastQueue<MessageContent>()

function show(type: MessageType, content: ReactNode, { duration, onClose, iconLabel }: MessageOptions = {}): CloseToast {
  const seconds = duration ?? (type === 'loading' ? 0 : 3)
  const key = messageQueue.add({ type, content, iconLabel }, { timeout: toTimeout(seconds), onClose })
  return () => messageQueue.close(key)
}

type MessageFn = (content: ReactNode, options?: MessageOptions) => CloseToast

/**
 * Figma "❖ Message": short feedback centred at the top of the screen,
 * stacked, closing by itself. Call it from anywhere (event handlers, data
 * hooks); render `<MessageRegion />` (or `<Toaster />`) once inside `FcTheme`.
 *
 * ```ts
 * message.success('Đã lưu thực đơn')
 * const done = message.loading('Đang đồng bộ đơn hàng…')
 * await sync(); done(); message.success('Đã đồng bộ 12 đơn hàng')
 * ```
 */
export const message: {
  info: MessageFn
  success: MessageFn
  warning: MessageFn
  error: MessageFn
  /** Spinning icon; stays until the returned `close()` runs (or `duration`). */
  loading: MessageFn
  /** Closes every message at once, without animation. */
  destroy: () => void
} = {
  info: (content, options) => show('info', content, options),
  success: (content, options) => show('success', content, options),
  warning: (content, options) => show('warning', content, options),
  error: (content, options) => show('error', content, options),
  loading: (content, options) => show('loading', content, options),
  destroy: () => messageQueue.clear(),
}

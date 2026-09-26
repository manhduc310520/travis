import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Dialog, Modal as AriaModal, ModalOverlay } from 'react-aria-components'
import { cx } from '../../space'
import overlay from '../../overlay.module.css'
import { usePortalReady } from '../Modal/useOpenState'
import styles from './Spin.module.css'

export type SpinSize = 'sm' | 'md' | 'lg'

export interface SpinProps {
  /** Whether it spins. Default true. Wrapping children, false shows them as usual. */
  isSpinning?: boolean
  /** Figma Size: Small / Medium / Large → indicator 14 / 20 / 32 (Component/Spin/Dot-Size*). */
  size?: SpinSize
  /** Figma `Tip?` + `Tip Text`: text under the indicator. */
  tip?: ReactNode
  /** Status read by assistive tech when there is no `tip`. */
  label?: string
  /** Milliseconds `isSpinning` must stay true before anything shows, so fast loads don't flash. */
  delay?: number
  /** Cover the whole page: a mask plus an elevated panel, blocking pointer and keyboard until done. `children`, if any, render as-is underneath. */
  fullscreen?: boolean
  /** Figma `Icon` (instance swap): replaces the four dots. It is rotated and sized like them. */
  indicator?: ReactNode
  /**
   * Content to cover while spinning. It keeps its layout, is dimmed, and is
   * `inert` + `aria-busy` (no pointer, keyboard or screen-reader access) until done.
   */
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/** True once `on` has stayed true for `delay` ms; false as soon as `on` is false. */
function useDelayed(on: boolean, delay: number) {
  const [elapsed, setElapsed] = useState(false)
  useEffect(() => {
    if (!on || delay <= 0) return undefined
    const timer = window.setTimeout(() => setElapsed(true), delay)
    return () => {
      window.clearTimeout(timer)
      setElapsed(false)
    }
  }, [on, delay])
  return on && (delay <= 0 || elapsed)
}

/** Figma "Spin / Spinner": four dots at 50 / 30 / 100 / 60 % opacity, turning. */
function Dots() {
  return (
    <>
      <span className={cx(styles.dot, styles.dot1)} />
      <span className={cx(styles.dot, styles.dot2)} />
      <span className={cx(styles.dot, styles.dot3)} />
      <span className={cx(styles.dot, styles.dot4)} />
    </>
  )
}

/**
 * Figma "❖ Spin" (set `Spin`: Size, `Tip?`, `Icon`). Three uses:
 * - alone: an inline-flex `role="status"` block (indicator + tip);
 * - wrapping `children`: an overlay on the content while it reloads;
 * - `fullscreen`: a page-blocking mask (React Aria modal) with the spinner on an elevated panel.
 *
 * The indicator is hidden from assistive tech; the status says the tip, or
 * `label` ("Đang tải…"). It turns like the Button's pending spinner (steady
 * linear rotation, slowed rather than stopped under prefers-reduced-motion).
 */
export function Spin({
  isSpinning = true,
  size = 'md',
  tip,
  label = 'Đang tải…',
  delay = 0,
  fullscreen = false,
  indicator,
  children,
  className,
  style,
}: SpinProps) {
  const shown = useDelayed(isSpinning, delay)
  const spinClass = cx(styles.spin, size !== 'md' && styles[size])
  const icon = <span className={styles.indicator} aria-hidden="true">{indicator ?? <Dots />}</span>
  const body = (
    <>
      {icon}
      {tip != null ? <span className={styles.tip}>{tip}</span> : <span className={styles.srOnly}>{label}</span>}
    </>
  )

  if (fullscreen) {
    return (
      <>
        {children}
        <FullscreenSpin isOpen={shown} icon={icon} tip={tip} label={label} className={cx(spinClass, className)} style={style} />
      </>
    )
  }

  if (children != null) {
    return (
      <NestedSpin shown={shown} spinClass={spinClass} body={body} className={className} style={style}>
        {children}
      </NestedSpin>
    )
  }

  return (
    <div role="status" className={cx(spinClass, !shown && styles.idle, className)} style={style}>
      {shown && body}
    </div>
  )
}

interface NestedSpinProps {
  shown: boolean
  spinClass: string
  body: ReactNode
  children: ReactNode
  className?: string
  style?: CSSProperties
}

function NestedSpin({ shown, spinClass, body, children, className, style }: NestedSpinProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  // Content turning inert would drop keyboard focus to <body>. Park it on the
  // status overlay (announced as "Đang tải…") and bring it back afterwards.
  useLayoutEffect(() => {
    const active = document.activeElement
    if (shown) {
      if (active instanceof HTMLElement && contentRef.current?.contains(active)) {
        restoreRef.current = active
        statusRef.current?.focus({ preventScroll: true })
      }
    } else if (restoreRef.current) {
      const target = restoreRef.current
      restoreRef.current = null
      if (target.isConnected && (active == null || active === document.body || active === statusRef.current)) {
        target.focus({ preventScroll: true })
      }
    }
  }, [shown])

  return (
    <div className={cx(styles.nested, className)} style={style}>
      <div ref={contentRef} className={cx(styles.content, shown && styles.busy)} inert={shown} aria-busy={shown || undefined}>
        {children}
      </div>
      {/* Always mounted, so going busy is announced; it becomes the overlay while spinning. */}
      <div ref={statusRef} role="status" tabIndex={shown ? -1 : undefined} className={shown ? styles.overlay : styles.srOnly}>
        {shown && <div className={spinClass}>{body}</div>}
      </div>
    </div>
  )
}

interface FullscreenSpinProps {
  isOpen: boolean
  icon: ReactNode
  tip: ReactNode
  label: string
  className: string
  style?: CSSProperties
}

function FullscreenSpin({ isOpen, icon, tip, label, className, style }: FullscreenSpinProps) {
  const tipId = useId()
  // Open on the first render: wait for FcTheme's portal container (see usePortalReady).
  const portalReady = usePortalReady()
  if (!portalReady) return null
  // Focus moves to the dialog, whose name is the status: the visible tip, else `label`.
  const name = tip != null ? { 'aria-labelledby': tipId } : { 'aria-label': label }
  return (
    <ModalOverlay isOpen={isOpen} isDismissable={false} isKeyboardDismissDisabled className={styles.mask}>
      <AriaModal className={overlay.surface}>
        <Dialog {...name} className={cx(className, styles.panelBody)} style={style}>
          {icon}
          {tip != null && <span id={tipId} className={styles.tip}>{tip}</span>}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  )
}

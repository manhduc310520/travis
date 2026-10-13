import { useEffect, useLayoutEffect, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import {
  Button as AriaButton,
  Dialog,
  Heading,
  Modal as AriaModal,
  ModalOverlay,
  OverlayArrow,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from 'react-aria-components'
import { XClose } from '../../../icons'
import { cx } from '../../space'
import overlay from '../../overlay.module.css'
import { Button } from '../Button/Button'
import styles from './Tour.module.css'

export type TourPlacement = NonNullable<AriaPopoverProps['placement']>

export interface TourStep {
  /**
   * Element the step points at. Leave it out (or pass `null`) for a centred
   * step: the panel sits in the middle of the viewport, without an arrow, over
   * the mask (or without one when `mask={false}`).
   */
  target?: RefObject<HTMLElement | null> | null
  /** Figma "Title" text (14 / 600, Color/Content/Neutral-Strong). */
  title: ReactNode
  /** Figma "Text" (14 / 400, Color/Content/Neutral-Strong). */
  description?: ReactNode
  /**
   * Figma "Image?" / "Image Content": cover shown above the title, full width
   * (Figma sample: 21:9). An inline SVG or `<img>` fills the width.
   */
  cover?: ReactNode
  /** Overrides the tour placement for this step. */
  placement?: TourPlacement
}

export interface TourProps {
  steps: TourStep[]
  /**
   * Figma Type: `default` = Elevated panel (Type=Basic); `primary` = accent
   * panel (Type=Non-modal in Figma, where it is shown without a mask).
   */
  type?: 'default' | 'primary'
  /** Dim the page and spotlight the target. `false` = non-modal tour (page stays usable). */
  mask?: boolean
  /** Figma Placement — 12 positions. Default `bottom`. */
  placement?: TourPlacement
  /** Figma `Tour / Tour Item / Indicator`: `slider` (dots, default) or `number` ("1/3"). */
  indicator?: 'slider' | 'number'
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /** Controlled step index (0-based). */
  current?: number
  defaultCurrent?: number
  onChange?: (current: number) => void
  /** Called on the last step's finish button. */
  onFinish?: () => void
  /** Panel width (numbers are px). Default 520, the width of the Figma docs examples. */
  width?: number | string
  /** Button labels (Vietnamese by default). */
  labels?: { prev?: string; next?: string; finish?: string; close?: string }
  className?: string
}

const DEFAULT_LABELS = { prev: 'Quay lại', next: 'Tiếp theo', finish: 'Hoàn tất', close: 'Đóng hướng dẫn' }

/**
 * Figma "❖ Tour": a step-by-step guide panel anchored to page elements, with a
 * cover, title, description, step indicator and Previous / Next actions.
 * Padding Space/Padding/Base, gaps Space/Padding/XS (panel, text) and
 * Space/Margin/Base (cover → text), small buttons, 24px close button.
 * Built on the React Aria Popover (focus management, Escape, positioning); a
 * step without a target is centred with React Aria ModalOverlay + Modal.
 */
export function Tour({
  steps,
  type = 'default',
  mask = true,
  placement = 'bottom',
  indicator = 'slider',
  isOpen: openProp,
  defaultOpen = false,
  onOpenChange,
  current: currentProp,
  defaultCurrent = 0,
  onChange,
  onFinish,
  width = 520,
  labels,
  className,
}: TourProps) {
  const [openState, setOpenState] = useState(defaultOpen)
  const [currentState, setCurrentState] = useState(defaultCurrent)
  const isOpen = openProp ?? openState
  const current = Math.min(currentProp ?? currentState, steps.length - 1)
  const l = { ...DEFAULT_LABELS, ...labels }

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }
  const go = (next: number) => {
    if (currentProp === undefined) setCurrentState(next)
    onChange?.(next)
  }

  const step = steps[current]
  const target = step?.target ?? undefined
  const rect = useTargetRect(isOpen && mask ? target : undefined)
  if (!step || !isOpen) return null
  const isLast = current === steps.length - 1
  const primary = type === 'primary'

  const panelClass = cx(overlay.surface, styles.tour, primary ? styles.primary : styles.basic, className)
  const panelStyle = { width, '--_max': 'calc(100vw - var(--fc-space-margin-lg))' } as CSSProperties

  const body = (
    <Dialog className={styles.dialog}>
      <AriaButton className={styles.close} aria-label={l.close} onPress={() => setOpen(false)}>
        <XClose />
      </AriaButton>
      <div className={styles.content}>
        {step.cover != null && <div className={styles.cover}>{step.cover}</div>}
        <div className={styles.text}>
          <Heading slot="title" className={styles.title}>{step.title}</Heading>
          {step.description != null && <div className={styles.description}>{step.description}</div>}
        </div>
      </div>
      <div className={styles.footer}>
        {indicator === 'number' ? (
          <span className={styles.number}>
            {current + 1}
            <span className={styles.separator}>/</span>
            {steps.length}
          </span>
        ) : (
          <span className={styles.dots} aria-label={`Bước ${current + 1} / ${steps.length}`} role="img">
            {steps.map((_, i) => (
              <span key={i} className={cx(styles.dot, i === current && styles.dotActive)} />
            ))}
          </span>
        )}
        <span className={styles.actions}>
          {current > 0 && (
            // Figma Type=Non-modal: Previous is the Ghost default button.
            <Button size="sm" variant="default" ghost={primary} onPress={() => go(current - 1)}>
              {l.prev}
            </Button>
          )}
          <Button
            size="sm"
            // Figma Type=Non-modal: Next is a default button filled On-Solid with Solid/Accent text.
            variant={primary ? 'default' : 'primary'}
            className={primary ? styles.nextOnAccent : undefined}
            onPress={() => {
              if (isLast) { onFinish?.(); setOpen(false) } else go(current + 1)
            }}
          >
            {isLast ? l.finish : l.next}
          </Button>
        </span>
      </div>
    </Dialog>
  )

  // No target: centred panel, no arrow.
  if (!target) {
    if (!mask) {
      // Non-modal: the page stays usable, so no ModalOverlay (it would block it).
      const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
      return (
        <div className={styles.center}>
          <div className={panelClass} style={panelStyle} onKeyDown={onKeyDown}>{body}</div>
        </div>
      )
    }
    return (
      <ModalOverlay
        isOpen
        isDismissable
        onOpenChange={(open) => { if (!open) setOpen(false) }}
        className={cx(styles.center, styles.centerMask)}
      >
        <AriaModal className={panelClass} style={panelStyle}>{body}</AriaModal>
      </ModalOverlay>
    )
  }

  return (
    <>
      {mask && rect && (
        <div
          aria-hidden="true"
          className={styles.spotlight}
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        />
      )}
      <AriaPopover
        triggerRef={target}
        isOpen
        isNonModal={!mask}
        onOpenChange={(open) => { if (!open) setOpen(false) }}
        placement={step.placement ?? placement}
        // Same as the fc Popover with an arrow: 8px arrow + 4px gap to the target.
        offset={12}
        className={panelClass}
        style={panelStyle}
      >
        <OverlayArrow className={cx(overlay.arrow, primary && styles.arrowPrimary)}>
          <svg viewBox="0 0 16 8" aria-hidden="true"><path d="M0 0 8 8 16 0Z" /></svg>
        </OverlayArrow>
        {body}
      </AriaPopover>
    </>
  )
}

/** Tracks the target's viewport rect for the mask spotlight. */
function useTargetRect(target: RefObject<HTMLElement | null> | undefined) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const update = () => setRect(target?.current?.getBoundingClientRect() ?? null)
  useLayoutEffect(update, [target])
  useEffect(() => {
    if (!target) return
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])
  return rect
}

import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react'
import {
  Dialog,
  DialogTrigger,
  Heading,
  OverlayArrow,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from 'react-aria-components'
import { cx } from '../../space'
import overlay from '../../overlay.module.css'
import styles from './Popover.module.css'

export type PopoverPlacement = NonNullable<AriaPopoverProps['placement']>

export interface PopoverProps {
  /** Figma "Popover" body: the floating content. */
  content: ReactNode
  /** First line (600 weight); also names the dialog for screen readers. */
  title?: ReactNode
  /** Figma Placement — 12 positions: `top`, `top start`, `top end`, `left top`, … */
  placement?: PopoverPlacement
  /** Figma Arrow. */
  showArrow?: boolean
  /**
   * `click` (default) opens on press and moves focus into the popover;
   * `hover` opens on pointer hover or keyboard focus of the trigger and never
   * traps focus. Keep interactive content (buttons, fields) on `click`.
   */
  trigger?: 'click' | 'hover'
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /** Needed when there is no `title`: the dialog must have a name. */
  'aria-label'?: string
  /** Width of the panel; defaults to its content. */
  width?: number | string
  /**
   * The trigger. With `click` it must be a React Aria pressable (fc Button,
   * Link…). With `hover` any focusable element works.
   */
  children: ReactElement
  className?: string
}

export function Popover(props: PopoverProps) {
  return props.trigger === 'hover' ? <HoverPopover {...props} /> : <ClickPopover {...props} />
}

interface PanelProps extends Omit<PopoverProps, 'children' | 'trigger' | 'defaultOpen'> {
  triggerRef?: AriaPopoverProps['triggerRef']
  isNonModal?: boolean
  onPointerEnter?: () => void
  onPointerLeave?: () => void
}

/** The floating panel, shared by the click and hover triggers (and by Popconfirm). */
export function PopoverPanel({
  content,
  title,
  placement = 'top',
  showArrow = true,
  width,
  className,
  'aria-label': ariaLabel,
  triggerRef,
  isNonModal,
  isOpen,
  onOpenChange,
  onPointerEnter,
  onPointerLeave,
  role,
}: PanelProps & { role?: 'dialog' | 'alertdialog' }) {
  return (
    <AriaPopover
      triggerRef={triggerRef}
      isNonModal={isNonModal}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement={placement}
      offset={showArrow ? 12 : 4}
      className={cx(overlay.surface, styles.popover, className)}
      style={width != null ? { width } : undefined}
    >
      {showArrow && (
        <OverlayArrow className={overlay.arrow}>
          <svg viewBox="0 0 16 8" aria-hidden="true"><path d="M0 0 8 8 16 0Z" /></svg>
        </OverlayArrow>
      )}
      <div className={styles.inner} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
        <Dialog role={role} className={styles.dialog} aria-label={title == null ? ariaLabel : undefined}>
          {title != null && <Heading slot="title" className={styles.title}>{title}</Heading>}
          {content != null && <div className={styles.content}>{content}</div>}
        </Dialog>
      </div>
    </AriaPopover>
  )
}

function ClickPopover({ children, defaultOpen, isOpen, onOpenChange, trigger: _trigger, ...panel }: PopoverProps) {
  return (
    <DialogTrigger defaultOpen={defaultOpen} isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
      <PopoverPanel {...panel} />
    </DialogTrigger>
  )
}

/** Hover / focus trigger: non-modal, closes shortly after the pointer leaves both trigger and panel. */
function HoverPopover({ children, defaultOpen = false, isOpen: controlled, onOpenChange, trigger: _trigger, ...panel }: PopoverProps) {
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const isOpen = controlled ?? uncontrolled
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const setOpen = (next: boolean) => {
    clearTimeout(timer.current)
    if (controlled === undefined) setUncontrolled(next)
    onOpenChange?.(next)
  }
  const open = () => setOpen(true)
  const closeSoon = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), 150)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <>
      <span
        ref={triggerRef}
        className={styles.hoverTrigger}
        onPointerEnter={open}
        onPointerLeave={closeSoon}
        onFocus={open}
        onBlur={closeSoon}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
      >
        {children}
      </span>
      <PopoverPanel
        {...panel}
        triggerRef={triggerRef}
        isOpen={isOpen}
        isNonModal
        onOpenChange={setOpen}
        onPointerEnter={open}
        onPointerLeave={closeSoon}
      />
    </>
  )
}

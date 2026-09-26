import { useState, type ReactElement, type ReactNode } from 'react'
import { DialogTrigger, Heading } from 'react-aria-components'
import { AlertCircle } from '../../../icons'
import { Button } from '../Button/Button'
import { PopoverPanel, type PopoverPlacement } from '../Popover/Popover'
import styles from './Popconfirm.module.css'

export interface PopconfirmProps {
  /** The question. Names the alert dialog. */
  title: ReactNode
  description?: ReactNode
  okText?: string
  cancelText?: string
  /** May return a promise: the OK button shows a spinner until it settles, then the popover closes. */
  onConfirm?: () => void | Promise<unknown>
  onCancel?: () => void
  /** Destructive confirmation: the OK button turns danger. */
  danger?: boolean
  /** Replaces the warning icon; `null` hides it. */
  icon?: ReactNode | null
  showCancel?: boolean
  /** Figma Placement — the same 12 positions as Popover. */
  placement?: PopoverPlacement
  showArrow?: boolean
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /** The trigger: a React Aria pressable (fc Button, Link…). */
  children: ReactElement
}

/**
 * Figma "❖ Popconfirm": a small alert dialog anchored to the action it
 * confirms. Focus moves to it on open and returns to the trigger on close.
 */
export function Popconfirm({
  title,
  description,
  okText = 'Đồng ý',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
  danger = false,
  icon,
  showCancel = true,
  placement = 'top',
  showArrow = true,
  defaultOpen = false,
  isOpen: controlled,
  onOpenChange,
  children,
}: PopconfirmProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const [pending, setPending] = useState(false)
  const isOpen = controlled ?? uncontrolled
  const setOpen = (next: boolean) => {
    if (controlled === undefined) setUncontrolled(next)
    onOpenChange?.(next)
  }

  const confirm = async () => {
    const result = onConfirm?.()
    if (result instanceof Promise) {
      setPending(true)
      try { await result } finally { setPending(false) }
    }
    setOpen(false)
  }
  const cancel = () => {
    onCancel?.()
    setOpen(false)
  }

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
      {children}
      <PopoverPanel
        role="alertdialog"
        placement={placement}
        showArrow={showArrow}
        content={
          <>
            <div className={styles.body}>
              {icon !== null && <span className={styles.icon} aria-hidden="true">{icon ?? <AlertCircle />}</span>}
              <div className={styles.text}>
                <Heading slot="title" className={styles.title}>{title}</Heading>
                {description != null && <div className={styles.description}>{description}</div>}
              </div>
            </div>
            <div className={styles.actions}>
              {showCancel && <Button size="sm" onPress={cancel} isDisabled={pending}>{cancelText}</Button>}
              <Button size="sm" variant="primary" danger={danger} isPending={pending} onPress={confirm}>{okText}</Button>
            </div>
          </>
        }
      />
    </DialogTrigger>
  )
}

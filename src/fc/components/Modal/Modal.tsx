import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  Dialog,
  DialogTrigger,
  Heading,
  Modal as AriaModal,
  ModalOverlay,
  Text as AriaText,
} from 'react-aria-components'
import { AlertCircle, CheckCircle, InfoCircle, X, XCircle } from '../../../icons'
import { cx } from '../../space'
import { ScrollArea } from '../../ScrollArea'
import overlay from '../../overlay.module.css'
import { Button, type ButtonProps } from '../Button/Button'
import { cssLength, useOpenState, usePortalReady, type OpenStateProps } from './useOpenState'
import styles from './Modal.module.css'

/**
 * Opens the Modal (or ConfirmModal / InfoModal) placed after its trigger:
 * `<ModalTrigger><Button>Mở hộp thoại</Button><Modal …/></ModalTrigger>`. It is React
 * Aria's `DialogTrigger`: it takes `defaultOpen`, `isOpen`, `onOpenChange`.
 */
export const ModalTrigger = DialogTrigger

/** Props an OK / Cancel button can take besides its label and press handler. */
export type ModalButtonProps = Omit<ButtonProps, 'onPress' | 'children'>

/** Figma `Modal / Information` Status. */
export type ModalStatus = 'info' | 'success' | 'warning' | 'error'

interface ModalFrameProps extends OpenStateProps {
  /**
   * Close when the mask is clicked. Esc always closes unless
   * `isKeyboardDismissDisabled`.
   */
  isDismissable?: boolean
  isKeyboardDismissDisabled?: boolean
  /** Figma width 520 (Component/Modal/Width). Numbers are px. */
  width?: number | string
  /** Names the dialog when there is no `title`. */
  'aria-label'?: string
  className?: string
}

export interface ModalProps extends ModalFrameProps {
  /** Header text (16 / 600). Also names the dialog for screen readers. */
  title?: ReactNode
  /** Figma `Modal / Basic` Type=Text (plain copy) or Type=Slot (any content: form, list…). */
  children?: ReactNode
  /**
   * Default: "Hủy" (Cancel) + "Đồng ý" (OK, primary), right-aligned. `null` hides the
   * footer. A node replaces it; a function receives `close` (closes without
   * calling `onCancel`).
   */
  footer?: ReactNode | ((close: () => void) => ReactNode)
  okText?: ReactNode
  cancelText?: ReactNode
  /**
   * OK pressed. The modal then closes, unless this returns `false`. A promise
   * shows the OK button pending and closes when it resolves (not to `false`);
   * a rejected promise keeps the modal open.
   */
  onOk?: () => unknown
  /** Cancel, the close icon, Esc and a mask click. The modal closes afterwards. */
  onCancel?: () => void
  /** Destructive OK (primary danger). Still the only primary button. */
  danger?: boolean
  /** Hold the OK button pending (e.g. while a request you track runs). */
  confirmLoading?: boolean
  okButtonProps?: ModalButtonProps
  cancelButtonProps?: ModalButtonProps
  /** Close icon, 24 × 24, top right (Figma close button). */
  closable?: boolean
  /** Accessible name of the close icon. */
  closeLabel?: string
  role?: 'dialog' | 'alertdialog'
}

const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | undefined)?.then === 'function'

/**
 * Shared behaviour of every modal: open state, `onCancel` on each way of
 * dismissing, and an OK handler that waits for a returned promise.
 */
function useModalActions(props: OpenStateProps & Pick<ModalProps, 'onOk' | 'onCancel'>) {
  const [open, setOpen] = useOpenState(props)
  const [pending, setPending] = useState(false)

  const close = () => setOpen(false)
  const cancel = () => {
    props.onCancel?.()
    setOpen(false)
  }
  const ok = () => {
    const result = props.onOk?.()
    if (isThenable(result)) {
      setPending(true)
      result.then(
        (value) => {
          setPending(false)
          if (value !== false) close()
        },
        (error: unknown) => {
          setPending(false)
          throw error
        },
      )
    } else if (result !== false) {
      close()
    }
  }

  return { open, close, cancel, ok, pending }
}

/** Mask + elevated surface + dialog. Dismissing (Esc, mask) runs `onDismiss`. */
function ModalFrame({
  open,
  onDismiss,
  isDismissable,
  isKeyboardDismissDisabled,
  width,
  role = 'dialog',
  'aria-label': ariaLabel,
  className,
  children,
}: Omit<ModalFrameProps, keyof OpenStateProps> & { open: boolean; onDismiss: () => void; role?: 'dialog' | 'alertdialog'; children: ReactNode }) {
  const portalReady = usePortalReady()
  if (!portalReady) return null
  const style = width != null ? ({ '--_width': cssLength(width) } as CSSProperties) : undefined
  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={(next) => { if (!next) onDismiss() }}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      className={styles.mask}
    >
      <AriaModal className={cx(overlay.surface, styles.modal, className)} style={style}>
        <Dialog role={role} aria-label={ariaLabel} className={styles.dialog}>
          {children}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  )
}

/**
 * Figma "❖ Modal" — `Modal / Basic` (Type = Text | Slot). Width 520, radius
 * 8, Elevated surface with Shadow/Base over a Background/Overlay mask.
 * Header (title + close icon), body, footer: "Hủy" (Cancel) + "Đồng ý"
 * (OK), right aligned, 8 apart. One primary action only.
 *
 * Built on React Aria `ModalOverlay` + `Modal` + `Dialog`: focus moves in,
 * stays trapped and returns to the trigger; Esc closes; the page behind is
 * inert and does not scroll. Open it with `ModalTrigger` or control it with
 * `isOpen` / `onOpenChange`.
 */
export function Modal({
  title,
  children,
  footer,
  okText = 'Đồng ý',
  cancelText = 'Hủy',
  onOk,
  onCancel,
  danger = false,
  confirmLoading = false,
  okButtonProps,
  cancelButtonProps,
  closable = true,
  closeLabel = 'Đóng',
  isOpen,
  defaultOpen,
  onOpenChange,
  isDismissable = true,
  ...frame
}: ModalProps) {
  const { open, close, cancel, ok, pending } = useModalActions({ isOpen, defaultOpen, onOpenChange, onOk, onCancel })
  const hasHeader = title != null || closable

  let footerNode: ReactNode
  if (footer === undefined) {
    footerNode = (
      <>
        <Button {...cancelButtonProps} onPress={cancel}>{cancelText}</Button>
        <Button
          variant="primary"
          danger={danger}
          {...okButtonProps}
          isPending={confirmLoading || pending || okButtonProps?.isPending}
          onPress={ok}
        >
          {okText}
        </Button>
      </>
    )
  } else {
    footerNode = typeof footer === 'function' ? footer(close) : footer
  }

  return (
    <ModalFrame {...frame} open={open} onDismiss={cancel} isDismissable={isDismissable}>
      {hasHeader && (
        <div className={styles.header}>
          {title != null && <Heading slot="title" className={styles.title}>{title}</Heading>}
          {closable && (
            <Button variant="text" size="sm" aria-label={closeLabel} iconStart={<X />} className={styles.close} onPress={cancel} />
          )}
        </div>
      )}
      <ScrollArea className={styles.body}>{children}</ScrollArea>
      {footerNode != null && footerNode !== false && <div className={styles.footer}>{footerNode}</div>}
    </ModalFrame>
  )
}

const STATUS_ICON: Record<ModalStatus | 'confirm', ReactNode> = {
  confirm: <AlertCircle />,
  info: <InfoCircle />,
  success: <CheckCircle />,
  warning: <AlertCircle />,
  error: <XCircle />,
}

export interface ConfirmModalProps extends ModalFrameProps {
  /** One-line question or statement, e.g. "Xóa món ăn?" (Delete dish?). Names the dialog. */
  title: ReactNode
  /** Detail under the title. Read out as the dialog's description. */
  children?: ReactNode
  /** Replaces the status icon. */
  icon?: ReactNode
  okText?: ReactNode
  cancelText?: ReactNode
  /** Same contract as `Modal.onOk`: `false` keeps it open, a promise shows OK pending. */
  onOk?: () => unknown
  /** Cancel, Esc and (if `isDismissable`) a mask click. */
  onCancel?: () => void
  /** Destructive confirmation: OK turns danger and focus starts on "Hủy" (Cancel). */
  danger?: boolean
  confirmLoading?: boolean
  okButtonProps?: ModalButtonProps
  cancelButtonProps?: ModalButtonProps
}

export interface InfoModalProps extends Omit<ConfirmModalProps, 'cancelText' | 'cancelButtonProps' | 'danger'> {
  /** Figma `Modal / Information` Status: icon and its colour. */
  status?: ModalStatus
}

/**
 * Figma `Modal / Information` layout: status icon + title + content, then
 * the buttons. `type="confirm"` adds "Hủy" (Cancel). Used by ConfirmModal, InfoModal
 * and `useModal()`; not exported from the package.
 */
export function StatusModal({
  type,
  title,
  children,
  icon,
  okText = 'Đồng ý',
  cancelText = 'Hủy',
  onOk,
  onCancel,
  danger = false,
  confirmLoading = false,
  okButtonProps,
  cancelButtonProps,
  isOpen,
  defaultOpen,
  onOpenChange,
  isDismissable = false,
  className,
  ...frame
}: ConfirmModalProps & { type: ModalStatus | 'confirm' }) {
  const { open, cancel, ok, pending } = useModalActions({ isOpen, defaultOpen, onOpenChange, onOk, onCancel })
  const isConfirm = type === 'confirm'

  return (
    <ModalFrame
      {...frame}
      open={open}
      onDismiss={cancel}
      isDismissable={isDismissable}
      role="alertdialog"
      className={className}
    >
      <div className={cx(styles.body, styles.statusBody)}>
        <span className={cx(styles.icon, styles[type])} aria-hidden="true">{icon ?? STATUS_ICON[type]}</span>
        <Heading slot="title" className={styles.title}>{title}</Heading>
        {children != null && (
          <AriaText slot="description" elementType="div" className={styles.content}>{children}</AriaText>
        )}
      </div>
      <div className={styles.footer}>
        {isConfirm && (
          <Button autoFocus={danger} {...cancelButtonProps} onPress={cancel}>{cancelText}</Button>
        )}
        <Button
          variant="primary"
          danger={isConfirm && danger}
          autoFocus={!(isConfirm && danger)}
          {...okButtonProps}
          isPending={confirmLoading || pending || okButtonProps?.isPending}
          onPress={ok}
        >
          {okText}
        </Button>
      </div>
    </ModalFrame>
  )
}

/**
 * Figma "Modal" confirmation example: warning icon, question, detail,
 * "Hủy" (Cancel) + "Đồng ý" (OK). For deleting, set `danger` and a verb as
 * `okText`, e.g. "Xóa" (Delete). Announced as an `alertdialog`; the mask does not close it.
 */
export function ConfirmModal(props: ConfirmModalProps) {
  return <StatusModal {...props} type="confirm" />
}

/**
 * Figma `Modal / Information` — Status = Info | Success | Warning | Error.
 * A single "Đồng ý" (OK) acknowledges the message.
 */
export function InfoModal({ status = 'info', ...props }: InfoModalProps) {
  return <StatusModal {...props} type={status} />
}

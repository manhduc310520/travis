import type { CSSProperties, ReactNode } from 'react'
import { Dialog, DialogTrigger, Heading, Modal as AriaModal, ModalOverlay } from 'react-aria-components'
import { X } from '../../../icons'
import { cx } from '../../space'
import { ScrollArea } from '../../ScrollArea'
import overlay from '../../overlay.module.css'
import { Button } from '../Button/Button'
import { cssLength, useOpenState, usePortalReady, type OpenStateProps } from '../Modal/useOpenState'
import styles from './Drawer.module.css'

/**
 * Opens the Drawer placed after its trigger:
 * `<DrawerTrigger><Button>Xem đơn hàng</Button><Drawer …/></DrawerTrigger>`. It is
 * React Aria's `DialogTrigger` (`defaultOpen`, `isOpen`, `onOpenChange`).
 */
export const DrawerTrigger = DialogTrigger

/** Figma Placement: the viewport edge the drawer slides from. */
export type DrawerPlacement = 'right' | 'left' | 'top' | 'bottom'

export interface DrawerProps extends OpenStateProps {
  /** Figma Placement. */
  placement?: DrawerPlacement
  /** Header text (16 / 600). Also names the dialog for screen readers. */
  title?: ReactNode
  /**
   * Figma "Button Outline?" / "Button Primary?": actions at the right of the
   * header, e.g. "Hủy" + "Lưu". Keep one primary across header and footer.
   */
  extra?: ReactNode
  /** Figma "Footer?": bar under the body, content right-aligned, 8 apart. */
  footer?: ReactNode
  /** Figma "Close Icon?": icon button left of the title. Esc still closes without it. */
  closable?: boolean
  /** Accessible name of the close icon. */
  closeLabel?: string
  /**
   * `default` = 400 (Component/Drawer/Width; the height for top / bottom),
   * `large` = 736.
   */
  size?: 'default' | 'large'
  /** Overrides the width of a left / right drawer. Numbers are px. */
  width?: number | string
  /** Overrides the height of a top / bottom drawer. Numbers are px. */
  height?: number | string
  /** Close when the mask is clicked. */
  isDismissable?: boolean
  isKeyboardDismissDisabled?: boolean
  /** Names the dialog when there is no `title`. */
  'aria-label'?: string
  /** Scrolling content. */
  children?: ReactNode
  className?: string
}

/**
 * Figma "❖ Drawer" — Placement = Right | Top | Bottom | Left, with Close
 * Icon?, header actions (Button Outline? / Button Primary?) and Footer?.
 * A panel attached to one viewport edge over a Background/Overlay mask:
 * 400 wide (or tall), Elevated surface, Shadow/Base, no radius. Header
 * padding 16 × 24, body 24 (scrolls), footer 8 × 16.
 *
 * Built on React Aria `ModalOverlay` + `Modal` + `Dialog`: focus is trapped
 * and restored, Esc closes, the page behind is inert. Open it with
 * `DrawerTrigger` or control it with `isOpen` / `onOpenChange`.
 */
export function Drawer({
  placement = 'right',
  title,
  extra,
  footer,
  closable = true,
  closeLabel = 'Đóng',
  size = 'default',
  width,
  height,
  isOpen,
  defaultOpen,
  onOpenChange,
  isDismissable = true,
  isKeyboardDismissDisabled,
  'aria-label': ariaLabel,
  children,
  className,
}: DrawerProps) {
  const [open, setOpen] = useOpenState({ isOpen, defaultOpen, onOpenChange })
  const portalReady = usePortalReady()
  if (!portalReady) return null

  const horizontal = placement === 'left' || placement === 'right'
  const override = horizontal ? width : height
  const style = override != null ? ({ '--_size': cssLength(override) } as CSSProperties) : undefined
  const hasHeader = title != null || extra != null || closable

  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={setOpen}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      className={styles.mask}
    >
      <AriaModal
        className={cx(overlay.surface, styles.drawer, styles[placement], size === 'large' && styles.large, className)}
        style={style}
      >
        <Dialog aria-label={ariaLabel} className={styles.dialog}>
          {hasHeader && (
            <div className={styles.header}>
              {closable && (
                <Button
                  variant="text"
                  size="sm"
                  aria-label={closeLabel}
                  iconStart={<X />}
                  className={styles.close}
                  onPress={() => setOpen(false)}
                />
              )}
              {title != null && <Heading slot="title" className={styles.title}>{title}</Heading>}
              {extra != null && <div className={styles.extra}>{extra}</div>}
            </div>
          )}
          <ScrollArea className={styles.body}>{children}</ScrollArea>
          {footer != null && <div className={styles.footer}>{footer}</div>}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  )
}

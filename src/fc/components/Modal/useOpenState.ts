import { useContext, useState } from 'react'
import { OverlayTriggerStateContext } from 'react-aria-components'
import { useUNSAFE_PortalContext } from 'react-aria'

export interface OpenStateProps {
  /** Controlled open state. */
  isOpen?: boolean
  /** Uncontrolled initial state. */
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

/**
 * Open state shared by Modal and Drawer. Inside a `ModalTrigger` /
 * `DrawerTrigger` (React Aria `DialogTrigger`) with no `isOpen` /
 * `defaultOpen` of its own, the trigger owns the state; otherwise the props
 * do (controlled or uncontrolled). The overlay is then always rendered
 * controlled, so every way of closing it goes through one place.
 */
export function useOpenState({ isOpen, defaultOpen, onOpenChange }: OpenStateProps) {
  const trigger = useContext(OverlayTriggerStateContext)
  const [uncontrolled, setUncontrolled] = useState(defaultOpen ?? false)
  const fromTrigger = trigger != null && isOpen === undefined && defaultOpen === undefined
  const open = fromTrigger ? trigger.isOpen : (isOpen ?? uncontrolled)

  const setOpen = (next: boolean) => {
    if (fromTrigger) trigger.setOpen(next)
    else if (isOpen === undefined) setUncontrolled(next)
    onOpenChange?.(next)
  }

  return [open, setOpen] as const
}

/**
 * False until FcTheme's themed portal container exists (it arrives one render
 * after mount). An overlay open on the first render (`defaultOpen`) waits for
 * it: mounted earlier, React Aria's modal would find no element to keep while
 * making the rest of the page inert, and would not try again.
 */
export function usePortalReady() {
  const { getContainer } = useUNSAFE_PortalContext()
  return getContainer == null || getContainer() != null
}

/** `520` → `520px`; strings (`60vw`, `var(--…)`) pass through. */
export const cssLength = (value: number | string | undefined) => (typeof value === 'number' ? `${value}px` : value)

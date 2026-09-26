import type { ReactNode } from 'react'
import { cx } from './space'
import { useScrollableFocus } from './useScrollableFocus'
import styles from './scrollArea.module.css'

/**
 * A block that scrolls its overflow and, only while it overflows, joins the
 * tab order so keyboard users can scroll it (Modal / Drawer bodies, long
 * lists). Mounts with its content, so it works inside overlays that render
 * only while open.
 */
export function ScrollArea({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useScrollableFocus<HTMLDivElement>()
  return (
    <div ref={ref} className={cx(styles.area, className)}>
      {children}
    </div>
  )
}

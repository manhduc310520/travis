import { useCallback, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../space'
import styles from './Affix.module.css'

export interface AffixProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Distance in px from the top of the scroll container at which the content pins.
   * Figma ❖ Affix example: the pinned frame sits 16px from the top of the viewport.
   * Defaults to 0 when `offsetBottom` is not set.
   */
  offsetTop?: number
  /** Distance in px from the bottom of the scroll container at which the content pins (e.g. a save bar). */
  offsetBottom?: number
  /** Called when the pinned state changes. */
  onChange?: (affixed: boolean) => void
  children?: ReactNode
}

/** Nearest scrollable ancestor, or `null` for the window. */
function scrollParent(node: HTMLElement | null): HTMLElement | null {
  let el = node?.parentElement ?? null
  while (el && el !== document.body && el !== document.documentElement) {
    const { overflowY } = getComputedStyle(el)
    if (/(auto|scroll|overlay)/.test(overflowY)) return el
    el = el.parentElement
  }
  return null
}

/**
 * Pins its content inside the nearest scroll container (or the page) once the
 * user scrolls past it. Figma: page ❖ Affix, "Affix" frame wrapping a
 * `Slot / Basic` — no component set, the Affix itself has no visuals; the
 * pinned content brings its own surface.
 *
 * Built on CSS `position: sticky`, so it needs no `target` and follows the
 * layout (the pinned content keeps its width and space in the flow). The
 * pinned state is exposed as `data-affixed` for styling (e.g. show a divider
 * only while pinned) and via `onChange`. Like any sticky element it stays
 * inside its parent element: when the parent scrolls out of view the content
 * leaves with it and the state turns back to not pinned.
 */
export function Affix({ offsetTop, offsetBottom, onChange, className, style, children, ...rest }: AffixProps) {
  const bottom = offsetBottom != null && offsetTop == null
  const offset = bottom ? offsetBottom : (offsetTop ?? 0)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [affixed, setAffixed] = useState(false)
  const affixedRef = useRef(false)
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const measure = useCallback(() => {
    const sentinel = sentinelRef.current
    const el = boxRef.current
    if (!sentinel || !el) return
    const parent = scrollParent(sentinel)
    const box = parent?.getBoundingClientRect()
    const edgeTop = box ? box.top + (parent?.clientTop ?? 0) : 0
    const edgeBottom = box && parent ? edgeTop + parent.clientHeight : window.innerHeight
    const mark = sentinel.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    // Pinned = its place in the flow has passed the edge AND the element is
    // still held at the offset line. Once the parent element scrolls away,
    // sticky lets go and the element moves past the line, so this turns false.
    const next = bottom
      ? mark.bottom > edgeBottom - offset + 0.5 && rect.bottom <= edgeBottom - offset + 0.5
      : mark.top < edgeTop + offset - 0.5 && rect.top >= edgeTop + offset - 0.5
    if (affixedRef.current === next) return
    affixedRef.current = next
    setAffixed(next)
    onChangeRef.current?.(next)
  }, [bottom, offset])

  useEffect(() => {
    let frame = 0
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    schedule()
    document.addEventListener('scroll', schedule, { capture: true, passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('scroll', schedule, { capture: true })
      window.removeEventListener('resize', schedule)
    }
  }, [measure])

  const sentinel = <div ref={sentinelRef} className={styles.sentinel} aria-hidden />
  return (
    <>
      {!bottom && sentinel}
      <div
        {...rest}
        ref={boxRef}
        className={cx(styles.affix, className)}
        data-affixed={affixed || undefined}
        style={{ ...(bottom ? { bottom: offset } : { top: offset }), ...style } as CSSProperties}
      >
        {children}
      </div>
      {bottom && sentinel}
    </>
  )
}

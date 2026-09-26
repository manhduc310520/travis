import { useLayoutEffect, useRef } from 'react'

/**
 * A region that scrolls must be reachable by keyboard so it can be scrolled
 * with the arrow keys (WCAG 2.1.1, axe `scrollable-region-focusable`).
 * Returns a ref; the element gets `tabindex="0"` only while it actually
 * overflows, so short content adds no extra tab stop.
 *
 * The attribute is written on the element, not kept in React state: it is set
 * before the first paint (layout effect) and after every resize, with no
 * re-render in between that could leave an overflowing region unfocusable.
 */
export function useScrollableFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const update = () => {
      const overflows = el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1
      if (overflows) el.setAttribute('tabindex', '0')
      else el.removeAttribute('tabindex')
    }
    update()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(update)
    observer.observe(el)
    for (const child of Array.from(el.children)) observer.observe(child)
    return () => observer.disconnect()
  }, [])
  return ref
}

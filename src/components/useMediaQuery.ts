import { useSyncExternalStore } from 'react'

/**
 * Whether a CSS media query matches, kept in sync with the viewport.
 * Layout that only CSS needs stays in CSS; this is for what CSS cannot do,
 * like rendering the sidebar as a drawer below the `md` breakpoint.
 */
export function useMediaQuery(query: string, serverValue = true) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}

/** Figma "Breakpoint=LG" from `--fc-breakpoint-md` (768px) up; below it, "Breakpoint=SM". */
export const DESKTOP_QUERY = '(min-width: 768px)'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-aria-components'
import { cx } from '../../space'
import styles from './Anchor.module.css'

export interface AnchorItem {
  /** Identifies the item for `activeKey` / `onChange`. */
  key: string
  /** Target of the link, e.g. `#thuc-don`. Scroll spy looks the element up by this id. */
  href: string
  /** Visible label. */
  title: ReactNode
  /** Figma Anchor Item `Level=2`: nested links, indented. Vertical only. */
  children?: AnchorItem[]
}

export interface AnchorProps {
  items: AnchorItem[]
  /** Figma Anchor `Direction`. Horizontal is single-level (children are ignored). */
  direction?: 'vertical' | 'horizontal'
  /** Controlled active item (Figma Anchor Item `State=Active`). */
  activeKey?: string | null
  /** Uncontrolled initial active item. */
  defaultActiveKey?: string | null
  /** The active item changed (link pressed or scroll spy). */
  onChange?: (key: string) => void
  /**
   * The scrolling element that holds the sections: scroll spy follows it and
   * pressing a link scrolls it. Omit to use the window.
   */
  getContainer?: () => HTMLElement | null
  /** Derive the active item from the scroll position. Default `true`. */
  scrollSpy?: boolean
  /**
   * Distance from the top of the container at which a section counts as
   * reached; pressing a link scrolls its section to this line (e.g. the height
   * of a sticky header).
   */
  offsetTop?: number
  /** Name of the navigation landmark. Defaults to "Mục lục". */
  'aria-label'?: string
  className?: string
}

function flatten(items: AnchorItem[]): AnchorItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flatten(item.children) : [])])
}

/** Scroll spy pauses this long after the last scroll event of a pressed link's scroll. */
const SPY_LOCK_MS = 150

function targetOf(href: string): HTMLElement | null {
  if (!href.startsWith('#') || href.length < 2) return null
  return document.getElementById(decodeURIComponent(href.slice(1)))
}

/**
 * Figma "❖ Anchor" (set `Anchor`, Direction: Vertical | Horizontal; items
 * `Anchor / Anchor Item`, State: Default | Active, Level: 1 | 2). A `nav`
 * landmark with a list of React Aria `Link`s to sections of the page.
 * Vertical: a rail on the left, the active item gets an accent bar and accent
 * text. Horizontal: the active item gets an accent underline. The active link
 * carries `aria-current="location"`. With `scrollSpy` (default) the active
 * item follows the scroll position of `getContainer()` (or the window);
 * pressing a link scrolls its target into view.
 */
export function Anchor({
  items,
  direction = 'vertical',
  activeKey,
  defaultActiveKey = null,
  onChange,
  getContainer,
  scrollSpy = true,
  offsetTop = 0,
  'aria-label': ariaLabel = 'Mục lục',
  className,
}: AnchorProps) {
  const [innerKey, setInnerKey] = useState<string | null>(defaultActiveKey)
  const current = activeKey !== undefined ? activeKey : innerKey

  // Latest values for the scroll listener, so it is not re-bound on every change.
  const latest = useRef({ current, onChange })
  useEffect(() => {
    latest.current = { current, onChange }
  }, [current, onChange])

  // While a pressed link scrolls its section into view, scroll spy waits until
  // the scrolling stops: the pressed item stays active instead of flickering
  // through the sections in between (or losing to the previous section when
  // the last one cannot reach the top).
  const spyLock = useRef<number | undefined>(undefined)
  const lockSpy = useCallback(() => {
    window.clearTimeout(spyLock.current)
    spyLock.current = window.setTimeout(() => {
      spyLock.current = undefined
    }, SPY_LOCK_MS)
  }, [])
  useEffect(() => () => window.clearTimeout(spyLock.current), [])

  const select = (key: string) => {
    if (activeKey === undefined) setInnerKey(key)
    if (key !== current) onChange?.(key)
  }

  useEffect(() => {
    if (!scrollSpy) return
    const container = getContainer?.() ?? null
    const scroller: HTMLElement | Window = container ?? window
    const all = direction === 'horizontal' ? items : flatten(items)
    const onScroll = () => {
      if (spyLock.current !== undefined) {
        lockSpy()
        return
      }
      const top = (container ? container.getBoundingClientRect().top : 0) + offsetTop
      let found: string | null = null
      for (const item of all) {
        const el = targetOf(item.href)
        if (el && el.getBoundingClientRect().top - top <= 5) found = item.key
      }
      if (found != null && found !== latest.current.current) {
        setInnerKey(found)
        latest.current.onChange?.(found)
        latest.current = { ...latest.current, current: found }
      }
    }
    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [scrollSpy, getContainer, items, direction, offsetTop, lockSpy])

  const press = (item: AnchorItem) => {
    lockSpy()
    select(item.key)
    const el = targetOf(item.href)
    if (!el) return
    // Bring the section to `offsetTop` below the top of the container (or the
    // window), the line scroll spy uses. Instant with reduced motion.
    const behavior: ScrollBehavior = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    const container = getContainer?.() ?? null
    if (container) {
      const delta = el.getBoundingClientRect().top - container.getBoundingClientRect().top - offsetTop
      container.scrollTo({ top: container.scrollTop + delta, behavior })
    } else if (offsetTop) {
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - offsetTop, behavior })
    } else {
      el.scrollIntoView({ behavior, block: 'start' })
    }
  }

  const renderItems = (list: AnchorItem[], level: 1 | 2): ReactNode =>
    list.map((item) => {
      const isActive = item.key === current
      return (
        <li key={item.key} className={styles.item}>
          <Link
            href={item.href}
            className={cx(styles.link, level === 2 && styles.level2)}
            data-active={isActive || undefined}
            aria-current={isActive ? 'location' : undefined}
            onClick={(e) => {
              // Keep the URL clean and scroll ourselves (container-aware, reduced motion).
              if (targetOf(item.href)) e.preventDefault()
            }}
            onPress={() => press(item)}
          >
            {item.title}
          </Link>
          {direction === 'vertical' && level === 1 && item.children && item.children.length > 0 && (
            <ul className={styles.sublist}>{renderItems(item.children, 2)}</ul>
          )}
        </li>
      )
    })

  return (
    <nav
      aria-label={ariaLabel}
      className={cx(styles.anchor, direction === 'horizontal' ? styles.horizontal : styles.vertical, className)}
    >
      <ul className={styles.list}>{renderItems(items, 1)}</ul>
    </nav>
  )
}

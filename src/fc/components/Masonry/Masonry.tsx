import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type ReactNode,
} from 'react'
import { cx, gapVar, type SpaceScale } from '../../space'
import styles from './Masonry.module.css'

export type MasonryBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

/** A fixed column count, or a count per breakpoint (applies from that breakpoint up, like `Col`). */
export type MasonryColumns = number | Partial<Record<MasonryBreakpoint, number>>

export interface MasonryProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Figma `Masonry` → property `Columns` (2 | 3 | 4). Also takes a breakpoint map
   * (`{ xs: 1, md: 3, lg: 4 }`) read against the `breakpoint/*` tokens. Default 3 (the middle
   * docs example; the Figma set's default variant is `Columns=4`).
   */
  columns?: MasonryColumns
  /**
   * Step of the spacing scale between items — one step for both axes or `[column, row]`.
   * Figma uses 16px both ways (raw value, no variable bound) → `base` (default).
   */
  gap?: SpaceScale | [SpaceScale, SpaceScale]
  /**
   * `balanced` (default) measures each item and places it in the shortest column, so the
   * columns end at similar heights. `sequential` deals items round-robin (item 1 → column 1,
   * item 2 → column 2…), which keeps a predictable order but can leave ragged columns.
   */
  placement?: 'balanced' | 'sequential'
  /** Items to lay out. Each direct child is one masonry item (Figma `Slot / Basic`). */
  children?: ReactNode
}

const BREAKPOINTS: MasonryBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

/** Reads `--fc-breakpoint-*` so the thresholds stay in sync with the token export. */
function readBreakpoint(name: MasonryBreakpoint): number | undefined {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--fc-breakpoint-${name}`)
  const px = Number.parseFloat(value)
  return Number.isFinite(px) ? px : undefined
}

const subscribeResize = (onChange: () => void) => {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

function useColumnCount(columns: MasonryColumns): number {
  const resolve = useCallback((): number => {
    if (typeof columns === 'number') return columns
    const width = window.innerWidth
    let count = 1
    for (const bp of BREAKPOINTS) {
      const value = columns[bp]
      if (value === undefined) continue
      const min = bp === 'xs' ? 0 : readBreakpoint(bp)
      if (min !== undefined && width >= min) count = value
    }
    return count
  }, [columns])
  // Server render: a map falls back to its smallest breakpoint's count.
  const serverCount = typeof columns === 'number' ? columns : (BREAKPOINTS.map((bp) => columns[bp]).find((v) => v !== undefined) ?? 1)
  const count = useSyncExternalStore(subscribeResize, resolve, () => serverCount)
  return Math.max(1, Math.floor(count))
}

const roundRobin = (length: number, count: number) => Array.from({ length }, (_, i) => i % count)

/**
 * Masonry — Figma set `Masonry` (page "❖ Masonry"), properties `Columns` 2 | 3 | 4.
 * Lays items of different heights into equal-width columns with no row alignment,
 * e.g. a dish gallery or a board of order notes. Children render in column order
 * (column 1 top to bottom, then column 2…), which is also the keyboard order.
 */
export function Masonry({
  columns = 3,
  gap = 'base',
  placement = 'balanced',
  className,
  style,
  children,
  ...rest
}: MasonryProps) {
  const items = Children.toArray(children)
  const count = useColumnCount(columns)
  const [colGap, rowGap] = Array.isArray(gap) ? gap : [gap, gap]
  const keys: Key[] = items.map((child, i) => (isValidElement(child) && child.key !== null ? child.key : i))
  const signature = `${count}#${keys.join('|')}`

  const rootRef = useRef<HTMLDivElement>(null)
  const [measured, setMeasured] = useState<{ signature: string; columns: number[] } | null>(null)

  // Balanced placement: measure every item (ResizeObserver also fires once on observe)
  // and put each one, in order, into the column that is currently shortest.
  useEffect(() => {
    const root = rootRef.current
    if (placement === 'sequential' || !root || typeof ResizeObserver === 'undefined') return undefined
    let frame = 0
    const measure = () => {
      const heights: number[] = []
      root.querySelectorAll<HTMLElement>('[data-masonry-index]').forEach((el) => {
        heights[Number(el.dataset.masonryIndex)] = el.getBoundingClientRect().height
      })
      const totals = new Array<number>(count).fill(0)
      const next = Array.from({ length: heights.length }, (_, i) => {
        let target = 0
        for (let c = 1; c < count; c += 1) if (totals[c] < totals[target]) target = c
        totals[target] += heights[i] ?? 0
        return target
      })
      setMeasured((prev) =>
        prev && prev.signature === signature && prev.columns.length === next.length && prev.columns.every((v, i) => v === next[i])
          ? prev
          : { signature, columns: next },
      )
    }
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    })
    root.querySelectorAll('[data-masonry-index]').forEach((el) => observer.observe(el))
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
    // `measured` is a dependency so items that moved column (and remounted) are observed again.
  }, [signature, count, placement, measured])

  const assignment =
    placement === 'balanced' && measured && measured.signature === signature && measured.columns.length === items.length
      ? measured.columns
      : roundRobin(items.length, count)

  const buckets: { key: Key; index: number; node: ReactNode }[][] = Array.from({ length: count }, () => [])
  items.forEach((node, index) => {
    buckets[Math.min(assignment[index], count - 1)].push({ key: keys[index], index, node })
  })

  const layout = {
    '--_col-gap': gapVar(colGap),
    '--_row-gap': gapVar(rowGap),
    ...style,
  } as CSSProperties

  return (
    <div {...rest} ref={rootRef} className={cx(styles.masonry, className)} style={layout} data-columns={count}>
      {buckets.map((bucket, c) => (
        <div key={c} className={styles.column}>
          {bucket.map(({ key, index, node }) => (
            <div key={key} className={styles.item} data-masonry-index={index}>
              {node}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

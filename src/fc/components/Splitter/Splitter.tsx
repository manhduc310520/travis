import { Children, Fragment, isValidElement, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactElement, ReactNode, RefObject } from 'react'
import { mergeProps, useFocusRing, useHover } from 'react-aria'
import { Button as AriaButton } from 'react-aria-components'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '../../../icons'
import { cx } from '../../space'
import styles from './Splitter.module.css'

/** A panel size as a share of the splitter, e.g. `'40%'`. */
export type SplitterSize = `${number}%`

export interface SplitterPanelProps {
  /** Starting size. Panels without one share the remaining space equally. */
  defaultSize?: SplitterSize
  /** Smallest size the panel can be dragged to. Collapsing ignores it. */
  min?: SplitterSize
  /** Largest size the panel can be dragged to. */
  max?: SplitterSize
  /**
   * Figma `Collapsible` on the adjacent bars: shows `Splitter / Collapse Button`
   * arrows that fold this panel away and bring it back to its previous size.
   */
  collapsible?: boolean
  /** `false` gives the bar after this panel Figma bar dragger `State=Disabled`. */
  resizable?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/**
 * One pane of a `Splitter`. Only meaningful as a direct child of `Splitter`,
 * which reads its props and renders it.
 */
export function SplitterPanel({ className, style, children }: SplitterPanelProps) {
  return <div className={cx(styles.panel, className)} style={style}>{children}</div>
}

/** Accessible names of the collapse buttons. "Before" is the left / top panel. */
export interface SplitterCollapseLabels {
  collapseBefore: string
  expandBefore: string
  collapseAfter: string
  expandAfter: string
}

const DEFAULT_LABELS: Record<'vertical' | 'horizontal', SplitterCollapseLabels> = {
  vertical: {
    collapseBefore: 'Thu gọn khung trái',
    expandBefore: 'Mở rộng khung trái',
    collapseAfter: 'Thu gọn khung phải',
    expandAfter: 'Mở rộng khung phải',
  },
  horizontal: {
    collapseBefore: 'Thu gọn khung trên',
    expandBefore: 'Mở rộng khung trên',
    collapseAfter: 'Thu gọn khung dưới',
    expandAfter: 'Mở rộng khung dưới',
  },
}

export interface SplitterProps {
  /**
   * Figma `Orientation`: the direction of the bars, which is also their
   * `aria-orientation`. `vertical` (default, Figma example "Vertical"): upright
   * bars, panels side by side, dragged left / right. `horizontal` (Figma
   * example "Horizontal"): flat bars, panels stacked, dragged up / down.
   */
  orientation?: 'vertical' | 'horizontal'
  /** Called with every panel size (percent) while dragging or collapsing. */
  onResize?: (sizes: number[]) => void
  /** Called once when a drag, key press or collapse ends. */
  onResizeEnd?: (sizes: number[]) => void
  /** Accessible name prefix for the bars. Default "Thanh chia". */
  barLabel?: string
  /** Overrides the collapse button names (defaults name the left / right or top / bottom panel). */
  collapseLabels?: Partial<SplitterCollapseLabels>
  className?: string
  style?: CSSProperties
  /** `SplitterPanel` elements. */
  children?: ReactNode
}

const pct = (size: SplitterSize | undefined) => (size == null ? undefined : Number.parseFloat(size))

function initialSizes(panels: SplitterPanelProps[]) {
  const given = panels.map((p) => pct(p.defaultSize))
  const used = given.reduce<number>((sum, v) => sum + (v ?? 0), 0)
  const open = given.filter((v) => v == null).length
  const share = open ? Math.max(0, 100 - used) / open : 0
  return given.map((v) => v ?? share)
}

const KEY_STEP = 1
const KEY_STEP_LARGE = 10
/** Sizes at or below this (percent) count as collapsed. */
const CLOSED = 0.001

/** Collapse or expand panel `target`, handing size to / taking it from `other` across the same bar. */
interface Fold {
  kind: 'collapse' | 'expand'
  target: number
  other: number
  /** Accessible name of the collapse button that runs it. */
  label: string
}

/**
 * Figma set `Splitter` (page "❖ Splitter"): resizable panels separated by a
 * hairline bar with a small trigger in the middle and, on collapsible panels,
 * collapse arrows on both sides of it. Built on the WAI-ARIA window splitter
 * pattern (`role="separator"`), since React Aria has no splitter primitive.
 *
 * Keyboard on a focused bar: arrow keys move it 1 % (Shift for 10 %). Home and
 * End move it to the limits and collapse a collapsible panel on that side.
 * Enter restores a collapsed panel, or collapses the panel before the bar
 * (the one after it when only that one is collapsible).
 */
export function Splitter({
  orientation = 'vertical',
  onResize,
  onResizeEnd,
  barLabel = 'Thanh chia',
  collapseLabels,
  className,
  style,
  children,
}: SplitterProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<SplitterPanelProps>[]
  const panels = items.map((el) => el.props)
  const [sizes, setSizes] = useState(() => initialSizes(panels))
  const rootRef = useRef<HTMLDivElement>(null)
  // Latest sizes for end-of-gesture callbacks, which run before a re-render.
  const latest = useRef(sizes)
  // Size each collapsed panel had, so expanding brings it back.
  const saved = useRef<Record<number, number>>({})
  const id = useId()
  const labels = { ...DEFAULT_LABELS[orientation], ...collapseLabels }

  const limits = (i: number) => {
    const p = panels[i]
    return { min: pct(p?.min) ?? 0, max: pct(p?.max) ?? 100 }
  }
  const isClosed = (i: number) => (sizes[i] ?? 0) <= CLOSED

  /** Moves bar `i` (between panel i and i+1) by `delta` percent, respecting both panels' limits. */
  const move = (current: number[], i: number, delta: number) => {
    const a = current[i] ?? 0
    const b = current[i + 1] ?? 0
    const la = limits(i)
    const lb = limits(i + 1)
    const lo = Math.max(la.min - a, b - lb.max)
    const hi = Math.min(la.max - a, b - lb.min)
    let d = Math.min(hi, Math.max(lo, delta))
    // Never move against the requested direction: a collapsed panel sits below
    // its `min`, and clamping alone would snap it open on a key press toward it.
    if (d * delta < 0) d = 0
    const next = [...current]
    next[i] = a + d
    next[i + 1] = b - d
    return next
  }

  const commit = (next: number[]) => {
    latest.current = next
    setSizes(next)
    onResize?.(next)
  }

  /** Folds panel `target` away, handing its size to `other` across the same bar. */
  const collapse = (target: number, other: number) => {
    const current = latest.current
    const next = [...current]
    saved.current[target] = current[target] ?? 0
    next[other] = (current[other] ?? 0) + (current[target] ?? 0)
    next[target] = 0
    commit(next)
    onResizeEnd?.(next)
  }

  /** Brings panel `target` back to its remembered size, taken from `other`. */
  const expand = (target: number, other: number) => {
    const current = latest.current
    const { min, max } = limits(target)
    const pair = (current[target] ?? 0) + (current[other] ?? 0)
    const wanted = saved.current[target] ?? pct(panels[target]?.defaultSize) ?? pair / 2
    const give = Math.min(Math.max(wanted, min), max, pair)
    const next = [...current]
    next[target] = give
    next[other] = pair - give
    delete saved.current[target]
    commit(next)
    onResizeEnd?.(next)
  }

  const fold = (f: Fold) => (f.kind === 'collapse' ? collapse(f.target, f.other) : expand(f.target, f.other))

  return (
    <div
      ref={rootRef}
      className={cx(styles.splitter, className)}
      style={style}
      data-orientation={orientation}
    >
      {items.map((el, i) => {
        const closed = isClosed(i)
        let bar: ReactNode = null
        if (i < items.length - 1) {
          const before = panels[i]
          const after = panels[i + 1]
          const afterClosed = isClosed(i + 1)
          const a = sizes[i] ?? 0
          const pair = a + (sizes[i + 1] ?? 0)
          const la = limits(i)
          const lb = limits(i + 1)
          const valueMin = before?.collapsible ? 0 : Math.max(la.min, pair - lb.max)
          const valueMax = Math.max(valueMin, after?.collapsible ? pair : Math.min(la.max, pair - lb.min))

          const bothOpen = !closed && !afterClosed
          const collapseBefore: Fold | undefined = before?.collapsible && bothOpen ? { kind: 'collapse', target: i, other: i + 1, label: labels.collapseBefore } : undefined
          const collapseAfter: Fold | undefined = after?.collapsible && bothOpen ? { kind: 'collapse', target: i + 1, other: i, label: labels.collapseAfter } : undefined
          const expandBefore: Fold | undefined = before?.collapsible && closed ? { kind: 'expand', target: i, other: i + 1, label: labels.expandBefore } : undefined
          const expandAfter: Fold | undefined = after?.collapsible && afterClosed ? { kind: 'expand', target: i + 1, other: i, label: labels.expandAfter } : undefined

          bar = (
            <Bar
              vertical={orientation === 'vertical'}
              value={Math.min(valueMax, Math.max(valueMin, a))}
              min={valueMin}
              max={valueMax}
              label={`${barLabel} ${i + 1}`}
              controls={`${id}-${i} ${id}-${i + 1}`}
              isDisabled={before?.resizable === false || after?.resizable === false}
              // The start arrow moves the bar toward the start: it expands the
              // collapsed panel after the bar, or collapses the one before it.
              toStart={expandAfter ?? collapseBefore}
              toEnd={expandBefore ?? collapseAfter}
              toggle={expandAfter ?? expandBefore ?? collapseBefore ?? collapseAfter}
              home={collapseBefore}
              end={collapseAfter}
              onFold={fold}
              onDelta={(delta, from) => commit(move(from ?? latest.current, i, delta))}
              onRelease={() => onResizeEnd?.(latest.current)}
              getSizes={() => latest.current}
              rootRef={rootRef}
            />
          )
        }
        return (
          <Fragment key={el.key ?? i}>
            <div
              id={`${id}-${i}`}
              className={styles.slot}
              style={{ flexBasis: `${sizes[i] ?? 0}%` }}
              data-collapsed={closed || undefined}
              // A collapsed panel keeps its content mounted but out of reach.
              inert={closed || undefined}
            >
              {el}
            </div>
            {bar}
          </Fragment>
        )
      })}
    </div>
  )
}

interface BarProps {
  vertical: boolean
  value: number
  min: number
  max: number
  label: string
  /** Ids of the two panels the bar resizes. */
  controls: string
  isDisabled: boolean
  toStart?: Fold
  toEnd?: Fold
  /** Enter: restore a collapsed neighbour, else collapse one. */
  toggle?: Fold
  /** Home / End: collapse the panel on that side when it is collapsible. */
  home?: Fold
  end?: Fold
  onFold: (fold: Fold) => void
  onDelta: (deltaPercent: number, from?: number[]) => void
  onRelease: () => void
  getSizes: () => number[]
  rootRef: RefObject<HTMLDivElement | null>
}

/**
 * Figma `Splitter / Bar Dragger` (`State=Default | Hover | Active | Disabled`)
 * plus the two `Splitter / Collapse Button`s beside its trigger. The buttons
 * are siblings of the separator, not children, because a separator's children
 * are presentational to assistive technology.
 */
function Bar({
  vertical,
  value,
  min,
  max,
  label,
  controls,
  isDisabled,
  toStart,
  toEnd,
  toggle,
  home,
  end,
  onFold,
  onDelta,
  onRelease,
  getSizes,
  rootRef,
}: BarProps) {
  const [isDragging, setDragging] = useState(false)
  const drag = useRef<{ start: number; sizes: number[] } | null>(null)
  const { focusProps, isFocusVisible } = useFocusRing()
  const { hoverProps, isHovered } = useHover({ isDisabled })

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (isDisabled || e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { start: vertical ? e.clientX : e.clientY, sizes: getSizes() }
    setDragging(true)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current
    if (!drag.current || !root) return
    const total = vertical ? root.clientWidth : root.clientHeight
    if (!total) return
    const px = (vertical ? e.clientX : e.clientY) - drag.current.start
    onDelta((px / total) * 100, drag.current.sizes)
  }
  const onPointerUp = () => {
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    onRelease()
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isDisabled) return
    const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP
    const back = vertical ? 'ArrowLeft' : 'ArrowUp'
    const fwd = vertical ? 'ArrowRight' : 'ArrowDown'
    // Window splitter pattern: Enter toggles a collapse; Home / End may
    // collapse the panel on that side completely.
    const action = e.key === 'Enter' ? toggle : e.key === 'Home' ? home : e.key === 'End' ? end : undefined
    if (action) {
      e.preventDefault()
      onFold(action)
      return
    }
    let delta: number | null = null
    if (e.key === back) delta = -step
    else if (e.key === fwd) delta = step
    else if (e.key === 'Home') delta = -100
    else if (e.key === 'End') delta = 100
    if (delta == null) return
    e.preventDefault()
    onDelta(delta)
    onRelease()
  }

  const StartIcon = vertical ? ChevronLeft : ChevronUp
  const EndIcon = vertical ? ChevronRight : ChevronDown
  // With a focusable bar, keyboard users collapse with Enter / Home / End, so
  // the arrows stay out of the Tab order; a disabled bar cannot take focus.
  const excludeFromTabOrder = !isDisabled

  return (
    <div className={styles.bar} data-orientation={vertical ? 'vertical' : 'horizontal'}>
      <div
        {...mergeProps(focusProps, hoverProps)}
        role="separator"
        tabIndex={isDisabled ? undefined : 0}
        aria-label={label}
        aria-controls={controls}
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        aria-valuenow={Math.round(value)}
        aria-valuemin={Math.round(min)}
        aria-valuemax={Math.round(max)}
        aria-disabled={isDisabled || undefined}
        className={styles.handle}
        data-hovered={isHovered || undefined}
        data-dragging={isDragging || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-disabled={isDisabled || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <span className={styles.trigger} />
      </div>
      {toStart && (
        <AriaButton className={cx(styles.collapse, styles.start)} aria-label={toStart.label} excludeFromTabOrder={excludeFromTabOrder} onPress={() => onFold(toStart)}>
          <StartIcon aria-hidden="true" />
        </AriaButton>
      )}
      {toEnd && (
        <AriaButton className={cx(styles.collapse, styles.end)} aria-label={toEnd.label} excludeFromTabOrder={excludeFromTabOrder} onPress={() => onFold(toEnd)}>
          <EndIcon aria-hidden="true" />
        </AriaButton>
      )}
    </div>
  )
}

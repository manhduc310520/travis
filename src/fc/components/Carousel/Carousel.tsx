import { Children, useCallback, useEffect, useState, type CSSProperties, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react'
import { mergeProps, useFocusRing } from 'react-aria'
import { Button as AriaButton } from 'react-aria-components'
import { cx } from '../../space'
import styles from './Carousel.module.css'

/** Figma `Carousel` → `Dot Placement`. `start` / `end` also switch to vertical sliding. */
export type CarouselDotPlacement = 'bottom' | 'top' | 'start' | 'end'

export interface CarouselProps {
  /** One child per slide. */
  children: ReactNode
  /** Figma `Dot Placement` (Bottom | Top | Start | End). Default `bottom`. */
  dotPlacement?: CarouselDotPlacement
  /** Figma `Arrows` (boolean, default True): previous / next arrows over the slides. Default `true`. */
  arrows?: boolean
  /** Show the pagination dots (Figma `Carousel / Carousel Dots`). Default `true`. */
  dots?: boolean
  /** Advance automatically; `true` = every 3000 ms, or pass the interval in ms. Pauses on hover and focus. */
  autoplay?: boolean | number
  /** Wrap from the last slide back to the first. Default `true`. */
  infinite?: boolean
  /** Controlled slide index. */
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Accessible name of the carousel region. Default 'Băng chuyền'. */
  'aria-label'?: string
  /** Height of the carousel. Start / End (vertical sliding) need a definite height, from here or the parent. */
  height?: number | string
  /** Vietnamese labels, overridable: arrow buttons, the dots group and each slide / dot. */
  labels?: { previous?: string; next?: string; dots?: string; slide?: (n: number, total: number) => string }
  className?: string
  style?: CSSProperties
}

const DEFAULT_LABELS = {
  previous: 'Trang chiếu trước',
  next: 'Trang chiếu sau',
  dots: 'Chọn trang chiếu',
  slide: (n: number, total: number) => `Trang chiếu ${n} / ${total}`,
}

type ArrowPosition = 'left' | 'right' | 'top' | 'bottom'

/* Chevron geometry of the Figma set `Carousel / Arrow` (Position = Left | Right | Top | Bottom):
   an 8 × 16 open chevron in a 16 × 16 box. Stroke colour and width come from the CSS. */
const ARROW_PATH: Record<ArrowPosition, string> = {
  right: 'M4 0 12 8 4 16',
  left: 'M12 0 4 8 12 16',
  top: 'M0 12 8 4 16 12',
  bottom: 'M0 4 8 12 16 4',
}

/** Figma `Carousel / Arrow`. Not an Untitled UI icon: the set draws its own 8 × 16 chevron. */
function ArrowIcon({ position }: { position: ArrowPosition }) {
  return (
    <svg className={styles.arrowIcon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={ARROW_PATH[position]} />
    </svg>
  )
}

/**
 * Figma `Carousel` (page "❖ Carousel"): slides with pagination dots (`Dot Placement`,
 * sub-sets `Carousel / Carousel Dots` and `Carousel / Carousel Dot` State = Default | Hover | Active)
 * and optional arrows (`Arrows`, set `Carousel / Arrow`).
 *
 * Keyboard: Left / Right (Up / Down for Start / End) move between slides while focus is on a dot,
 * an arrow or the carousel itself. When both dots and arrows are hidden, the carousel region
 * becomes focusable so it can still be controlled from the keyboard.
 */
export function Carousel({
  children,
  dotPlacement = 'bottom',
  arrows = true,
  dots = true,
  autoplay = false,
  infinite = true,
  index,
  defaultIndex = 0,
  onIndexChange,
  'aria-label': ariaLabel = 'Băng chuyền',
  labels,
  height,
  className,
  style,
}: CarouselProps) {
  const slides = Children.toArray(children)
  const total = slides.length
  const [inner, setInner] = useState(defaultIndex)
  const current = Math.min(Math.max(index ?? inner, 0), Math.max(total - 1, 0))
  const [paused, setPaused] = useState(false)
  const vertical = dotPlacement === 'start' || dotPlacement === 'end'
  const text = { ...DEFAULT_LABELS, ...labels }
  const { focusProps, isFocusVisible } = useFocusRing()

  const go = useCallback(
    (next: number) => {
      if (total === 0) return
      let target = next
      if (infinite) target = ((next % total) + total) % total
      else target = Math.min(Math.max(next, 0), total - 1)
      if (index === undefined) setInner(target)
      onIndexChange?.(target)
    },
    [index, infinite, onIndexChange, total],
  )

  const interval = typeof autoplay === 'number' ? autoplay : autoplay ? 3000 : 0
  useEffect(() => {
    if (!interval || paused || total < 2) return
    const id = window.setTimeout(() => go(current + 1), interval)
    return () => window.clearTimeout(id)
  }, [interval, paused, current, go, total])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Keys typed inside slide content (inputs, links, a nested carousel…) keep their own meaning.
    // The viewport is the root's first child.
    if (e.defaultPrevented || e.currentTarget.firstElementChild?.contains(e.target as Node)) return
    const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft'
    const nextKey = vertical ? 'ArrowDown' : 'ArrowRight'
    if (e.key === prevKey) { e.preventDefault(); go(current - 1) }
    else if (e.key === nextKey) { e.preventDefault(); go(current + 1) }
  }

  const showArrows = arrows && total > 1
  const showDots = dots && total > 1
  // No dots and no arrows: the region itself takes focus so the arrow keys still work.
  const regionFocusable = !showArrows && !showDots && total > 1
  const canPrev = infinite || current > 0
  const canNext = infinite || current < total - 1

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={regionFocusable ? 0 : undefined}
      className={cx(styles.root, className)}
      style={height === undefined ? style : { height, ...style }}
      data-placement={dotPlacement}
      data-vertical={vertical || undefined}
      data-focus-visible={(regionFocusable && isFocusVisible) || undefined}
      {...mergeProps(focusProps, {
        onKeyDown,
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
        onFocus: () => setPaused(true),
        onBlur: (e: FocusEvent<HTMLDivElement>) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false)
        },
      })}
    >
      <div className={styles.viewport} aria-live={interval && !paused ? 'off' : 'polite'}>
        <div className={styles.track} style={{ '--_index': current } as CSSProperties}>
          {slides.map((slide, i) => (
            <div
              key={i}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={text.slide(i + 1, total)}
              aria-hidden={i !== current || undefined}
              inert={i !== current || undefined}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <AriaButton className={cx(styles.arrow, styles.prev)} aria-label={text.previous} isDisabled={!canPrev} onPress={() => go(current - 1)}>
            <ArrowIcon position={vertical ? 'top' : 'left'} />
          </AriaButton>
          <AriaButton className={cx(styles.arrow, styles.next)} aria-label={text.next} isDisabled={!canNext} onPress={() => go(current + 1)}>
            <ArrowIcon position={vertical ? 'bottom' : 'right'} />
          </AriaButton>
        </>
      )}

      {showDots && (
        <div className={styles.dots} role="group" aria-label={text.dots}>
          {slides.map((_, i) => (
            <AriaButton
              key={i}
              className={styles.dot}
              aria-label={text.slide(i + 1, total)}
              aria-current={i === current || undefined}
              data-active={i === current || undefined}
              onPress={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

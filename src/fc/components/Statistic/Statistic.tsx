import { useEffect, useId, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { ArrowDown, ArrowUp } from '../../../icons'
import { cx } from '../../space'
import { formatDuration, formatNumber, hasSubSecond } from './format'
import styles from './Statistic.module.css'

/** Figma `Statistic` Type: Up / Down (Basic = no trend). */
export type StatisticTrend = 'up' | 'down'

interface StatisticBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'prefix'> {
  /** Figma `Title`: the label above the value (Content/Description). */
  title?: ReactNode
  /**
   * Figma `Icon` / `Show Icon`: a decorative icon before the value, in the
   * description colour. With `trend` it defaults to the matching arrow; pass
   * `null` to hide it (Figma Show Icon=False).
   */
  icon?: ReactNode
  /** Before the value, same size (e.g. a currency sign). */
  prefix?: ReactNode
  /** After the value, same size (e.g. "%" or "đơn" (orders)). */
  suffix?: ReactNode
}

export interface StatisticProps extends StatisticBaseProps {
  /** Figma `Content`. Numbers are formatted with `Intl.NumberFormat` (vi-VN: 112.893 · 11,28); other strings show as given. */
  value?: number | string
  /** Fixed number of decimals. */
  precision?: number
  /** Extra `Intl.NumberFormat` options, e.g. `{ style: 'currency', currency: 'VND' }` or `{ notation: 'compact' }`. */
  formatOptions?: Intl.NumberFormatOptions
  /** Number locale. */
  locale?: string
  /** Renders the value yourself (skips the number formatting). */
  formatter?: (value: number | string) => ReactNode
  /**
   * Figma Type Up / Down: success / danger value colour, an arrow, and a
   * visually hidden word ("Tăng" / "Giảm": up / down) so the direction never rests on colour.
   */
  trend?: StatisticTrend
  /** The hidden words read before the value for each trend. */
  trendLabels?: Record<StatisticTrend, string>
}

const TREND_ICON: Record<StatisticTrend, ReactNode> = { up: <ArrowUp />, down: <ArrowDown /> }
const TREND_LABELS: Record<StatisticTrend, string> = { up: 'Tăng', down: 'Giảm' }

/** Figma "❖ Statistic": a titled number for dashboards (revenue, orders, guests). */
export function Statistic({
  title,
  value,
  precision,
  formatOptions,
  locale = 'vi-VN',
  formatter,
  trend,
  trendLabels = TREND_LABELS,
  icon,
  prefix,
  suffix,
  className,
  ...rest
}: StatisticProps) {
  const display = useMemo(() => {
    if (value == null) return null
    if (formatter) return formatter(value)
    return formatNumber(value, { locale, precision, formatOptions })
  }, [value, formatter, locale, precision, formatOptions])
  const shownIcon = icon === undefined && trend ? TREND_ICON[trend] : icon

  return (
    <div {...rest} className={cx(styles.statistic, className)}>
      {title != null && <div className={styles.title}>{title}</div>}
      <div className={cx(styles.value, trend && styles[trend])}>
        {shownIcon != null && shownIcon !== false && (
          <span className={styles.icon} aria-hidden="true">{shownIcon}</span>
        )}
        {trend && <span className={styles.srOnly}>{trendLabels[trend]} </span>}
        {prefix != null && <span className={styles.affix}>{prefix}</span>}
        <span className={styles.number}>{display}</span>
        {suffix != null && <span className={styles.affix}>{suffix}</span>}
      </div>
    </div>
  )
}

export interface CountdownProps extends Omit<StatisticBaseProps, 'onChange'> {
  /** The deadline: a `Date` or a timestamp in ms. */
  value: number | Date
  /**
   * Figma `Statistic / Countdown` Type 1 = `HH:mm:ss`, Type 2 = `HH:mm:ss:SSS`.
   * Tokens `D H m s` (repeat to zero-pad), `SSS` = ms; `[text]` is literal: `D [ngày] HH [giờ] mm [phút]`.
   */
  format?: string
  /** Called once when the countdown reaches zero (not if the deadline had already passed on mount). */
  onFinish?: () => void
  /** Called on every tick with the ms left. */
  onChange?: (remaining: number) => void
  /** Announced politely to screen readers when the countdown reaches zero. */
  finishedLabel?: string
}

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Figma "Statistic / Countdown". The value is a `role="timer"` (not live):
 * screen readers read it when the user gets there instead of every tick.
 * Reaching zero is announced once through a polite status. Ticks once a
 * second — on the second — or ~30 times a second when the format shows ms
 * (once a second with reduced motion). The timer is cleared on unmount.
 */
export function Countdown({
  value,
  format = 'HH:mm:ss',
  onFinish,
  onChange,
  finishedLabel = 'Đã hết thời gian',
  title,
  icon,
  prefix,
  suffix,
  className,
  ...rest
}: CountdownProps) {
  const deadline = typeof value === 'number' ? value : value.getTime()
  const titleId = useId()
  const [now, setNow] = useState(() => Date.now())
  const [finishedAt, setFinishedAt] = useState<number | null>(null)
  const handlers = useRef({ onFinish, onChange })
  useEffect(() => {
    handlers.current = { onFinish, onChange }
  })

  useEffect(() => {
    const fast = hasSubSecond(format) && !reducedMotion()
    // Only a countdown that was running when it started can "finish".
    const running = deadline > Date.now()
    let timer: ReturnType<typeof setTimeout> | undefined
    const tick = () => {
      const t = Date.now()
      const left = deadline - t
      setNow(t)
      handlers.current.onChange?.(Math.max(0, left))
      if (left <= 0) {
        if (running) {
          setFinishedAt(deadline)
          handlers.current.onFinish?.()
        }
        return
      }
      timer = setTimeout(tick, fast ? 33 : left % 1000 || 1000)
    }
    timer = setTimeout(tick, 0)
    return () => clearTimeout(timer)
  }, [deadline, format])

  return (
    <div {...rest} className={cx(styles.statistic, className)}>
      {title != null && <div id={titleId} className={styles.title}>{title}</div>}
      <div className={styles.value}>
        {icon != null && icon !== false && <span className={styles.icon} aria-hidden="true">{icon}</span>}
        {prefix != null && <span className={styles.affix}>{prefix}</span>}
        <span role="timer" aria-live="off" aria-labelledby={title != null ? titleId : undefined} className={styles.number}>
          {formatDuration(deadline - now, format)}
        </span>
        {suffix != null && <span className={styles.affix}>{suffix}</span>}
      </div>
      <span role="status" className={styles.srOnly}>{finishedAt === deadline ? finishedLabel : ''}</span>
    </div>
  )
}

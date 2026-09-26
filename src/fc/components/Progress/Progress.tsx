import { useId, type CSSProperties, type HTMLAttributes, type JSX, type ReactNode, type Ref } from 'react'
import { mergeProps } from 'react-aria'
import { Focusable, Label, Meter, ProgressBar, type ProgressBarProps } from 'react-aria-components'
import { Check, CheckCircle, X, XCircle } from '../../../icons'
import { cx } from '../../space'
import type { PaletteHue } from '../../palette'
import palette from '../../palette.module.css'
import { Tooltip } from '../Tooltip/Tooltip'
import styles from './Progress.module.css'

/** Figma sets "Progress / Standard" (line), "Progress / Circle", "Progress / Dashboard". */
export type ProgressType = 'line' | 'circle' | 'dashboard'
/** Figma Status Normal / Success / Exception, plus `active` (a moving sheen on the line: work is running). */
export type ProgressStatus = 'normal' | 'active' | 'success' | 'exception'
/** Figma Size Small / Medium. A number is Figma Size=Custom (see `size`). */
export type ProgressSize = 'sm' | 'md'
/**
 * Fill colour. `default` is Component/Progress/Fill; the status roles follow
 * the semantic colours; a palette hue is for categorising (charts, KPIs).
 */
export type ProgressColor = 'default' | 'success' | 'warning' | 'danger' | PaletteHue
/** Figma "Progress / Gradient": two named colours — never a raw hex. */
export interface ProgressGradient {
  from: ProgressColor
  to: ProgressColor
}
/** Figma "Progress / Value Position": Position Outside (start / end / bottom) or Inside (start / center / end). */
export type ProgressValuePosition = 'end' | 'start' | 'bottom' | 'inside-start' | 'inside-center' | 'inside-end'

/** Words read by screen readers after the value, overridable one by one. */
export interface ProgressLabels {
  success: string
  exception: string
}

const LABELS: ProgressLabels = { success: 'hoàn tất', exception: 'bị lỗi' }

export interface ProgressProps {
  /** 0–100. */
  percent?: number
  type?: ProgressType
  /** Defaults to `success` at 100 %, `normal` below. */
  status?: ProgressStatus
  /**
   * `sm` / `md`, or a number of px (Figma Size=Custom): the bar's thickness
   * for `line`, the diameter for `circle` / `dashboard`. Circles under 60px
   * show their value in a tooltip (Figma "Responsive circular progress bar").
   */
  size?: ProgressSize | number
  /** Figma strokeLinecap Round / Square. Ignored by `steps` (always square). */
  strokeLinecap?: 'round' | 'square'
  /** Figma "Progress / Steps" (line) and "Circular progress bar / Custom" Count (circle, dashboard): split into this many segments. */
  steps?: number
  /** A colour or a two-colour gradient. Overrides the status colour; the status icon stays. */
  strokeColor?: ProgressColor | ProgressGradient
  /** Circle / dashboard only: ring thickness as a % of the diameter. Default 5 (6px at 120px). */
  strokeWidth?: number
  /** Figma showInfo: the value (or the status icon) next to / inside the graphic. */
  showInfo?: boolean
  /** Line only. Inside positions make the bar tall enough to hold the text. */
  valuePosition?: ProgressValuePosition
  /** Custom visible text, e.g. `(p) => \`${p} / 100 món\``. A string result is also what screen readers hear. */
  format?: (percent: number) => ReactNode
  /** Visible label: above a line, beside a circle. Without it pass `aria-label`. */
  label?: ReactNode
  /**
   * The value is a measurement in a known range (stock level, tables in use,
   * storage), not the progress of a task: renders a React Aria `Meter`
   * (role `meter`) instead of a `ProgressBar`.
   */
  isMeter?: boolean
  labels?: Partial<ProgressLabels>
  'aria-label'?: string
  'aria-labelledby'?: string
  id?: string
  className?: string
  style?: CSSProperties
}

const percentFormat = new Intl.NumberFormat('vi-VN', { style: 'percent', maximumFractionDigits: 1 })
const clamp = (n: number) => Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0))

const TONE: Record<string, string | undefined> = {
  default: styles.toneDefault,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
}
const END: Record<string, string | undefined> = {
  default: styles.endDefault,
  success: styles.endSuccess,
  warning: styles.endWarning,
  danger: styles.endDanger,
}
/** Class that sets `--_fill` (the colour, or the gradient start) for a named colour. */
const toneClass = (c: ProgressColor) => TONE[c] ?? cx(styles.toneHue, palette[c])
/** Class that sets `--_to` (the gradient end). Goes on an inner element so a second palette hue can apply. */
const endClass = (c: ProgressColor) => END[c] ?? cx(styles.endHue, palette[c])

/** Dashboard: the gap at the bottom, in degrees (Figma arc 135° → 405°). */
const DASHBOARD_GAP = 90
/** Gap between circle segments, in % of the path. */
const SEGMENT_GAP = 1.5
/** Circles smaller than this move the value into a tooltip. */
const TINY_CIRCLE = 60

/**
 * Figma "❖ Progress". A React Aria `ProgressBar` (or `Meter`, see
 * `isMeter`) drawn as a bar, a ring or a dashboard gauge. The value is always
 * exposed as `aria-valuetext` (plus "hoàn tất" / "bị lỗi" for the final
 * states); the visible percentage is hidden from assistive tech so it isn't
 * read twice. Fill colours reach 3:1 against the track in Light and Dark.
 */
export function Progress({
  percent = 0,
  type = 'line',
  status,
  size = 'md',
  strokeLinecap = 'round',
  steps,
  strokeColor,
  strokeWidth,
  showInfo = true,
  valuePosition = 'end',
  format,
  label,
  isMeter = false,
  labels,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  id,
  className,
  style,
}: ProgressProps) {
  const t = { ...LABELS, ...labels }
  // SVG ids end up in url(#…): keep them to safe characters.
  const gradientId = `fc-progress-${useId().replace(/[^\w-]/g, '')}`
  const pct = clamp(percent)
  const st: ProgressStatus = status ?? (pct >= 100 ? 'success' : 'normal')
  const custom = typeof size === 'number'
  const gradient = typeof strokeColor === 'object' ? strokeColor : undefined
  const fillColor: ProgressColor =
    typeof strokeColor === 'string' ? strokeColor : gradient ? gradient.from : st === 'success' ? 'success' : st === 'exception' ? 'danger' : 'default'

  const formatted = format?.(pct)
  const text: ReactNode = formatted ?? percentFormat.format(pct / 100)
  const baseText = typeof formatted === 'string' ? formatted : percentFormat.format(pct / 100)
  const valueText = st === 'success' ? `${baseText}, ${t.success}` : st === 'exception' ? `${baseText}, ${t.exception}` : baseText
  // Success / exception show an icon instead of the number, unless the caller formats the text.
  const statusIcon = formatted === undefined && (st === 'success' || st === 'exception')

  const isCircle = type !== 'line'
  const tiny = isCircle && custom && size < TINY_CIRCLE
  const segmentCount = steps && steps > 0 ? Math.floor(steps) : 0
  const filledSegments = Math.round((segmentCount * pct) / 100)

  const rootClass = cx(
    styles.progress,
    isCircle ? styles.circle : styles.line,
    !custom && size === 'sm' && styles.sm,
    toneClass(fillColor),
    st === 'active' && type === 'line' && !segmentCount && styles.active,
    strokeLinecap === 'square' && styles.square,
    className,
  )

  const sizeStyle = custom
    ? ({ [isCircle ? '--_size' : '--_thickness']: `${size}px` } as CSSProperties)
    : undefined

  // ---------- the visible value ----------
  const info = (placement: 'line' | 'circle') => {
    if (!showInfo) return null
    if (statusIcon) {
      const Icon = placement === 'circle' ? (st === 'success' ? Check : X) : st === 'success' ? CheckCircle : XCircle
      return (
        <span className={cx(styles.info, styles.statusIcon, st === 'success' ? styles.iconSuccess : styles.iconException)} aria-hidden="true">
          <Icon />
        </span>
      )
    }
    return <span className={styles.info} aria-hidden="true">{text}</span>
  }

  let graphic: ReactNode
  if (!isCircle) {
    const inside = valuePosition.startsWith('inside') && !segmentCount
    const insideAlign = inside ? valuePosition.slice('inside-'.length) : null
    const track = segmentCount ? (
      <span className={cx(styles.steps, gradient && endClass(gradient.to))}>
        {Array.from({ length: segmentCount }, (_, i) => (
          <span key={i} className={cx(styles.step, i < filledSegments && styles.stepOn)} />
        ))}
      </span>
    ) : (
      <span className={cx(styles.track, inside && styles.insideTrack, gradient && cx(styles.gradient, endClass(gradient.to)))}>
        <span
          className={cx(styles.fill, pct === 0 && styles.empty)}
          style={{ width: `${pct}%`, '--_pct': Math.max(pct, 1) } as CSSProperties}
        >
          {inside && showInfo && (
            <span className={cx(styles.insideText, insideAlign && styles[`inside-${insideAlign}`])} aria-hidden="true">{text}</span>
          )}
        </span>
      </span>
    )
    // Steps have no inside text: an inside position falls back to the end.
    const outside = inside ? null : valuePosition.startsWith('inside') ? 'end' : valuePosition
    graphic = (
      <>
        <span className={cx(styles.row, segmentCount > 0 && styles.stepsRow, outside === 'start' && styles.rowStart)}>
          {outside === 'start' && info('line')}
          {track}
          {outside === 'end' && info('line')}
        </span>
        {outside === 'bottom' && <span className={styles.bottom}>{info('line')}</span>}
      </>
    )
  } else {
    const dashboard = type === 'dashboard'
    const arc = dashboard ? (360 - DASHBOARD_GAP) / 3.6 : 100 // % of the full path length
    const rotate = dashboard ? 90 + DASHBOARD_GAP / 2 : -90
    const sw = strokeWidth ?? (custom ? Math.max(5, (2 / size) * 100) : 5)
    const r = 50 - sw / 2
    const cap = strokeLinecap === 'square' ? 'butt' : 'round'
    const circleProps = {
      cx: 50,
      cy: 50,
      r,
      strokeWidth: sw,
      pathLength: 100,
      transform: `rotate(${rotate} 50 50)`,
    }
    const strokeStyle = gradient ? ({ stroke: `url(#${gradientId})` } as CSSProperties) : undefined
    let rings: ReactNode
    if (segmentCount) {
      const gaps = dashboard ? segmentCount - 1 : segmentCount
      const seg = (arc - gaps * SEGMENT_GAP) / segmentCount
      rings = Array.from({ length: segmentCount }, (_, i) => (
        <circle
          key={i}
          {...circleProps}
          className={i < filledSegments ? styles.arc : styles.trail}
          style={i < filledSegments ? strokeStyle : undefined}
          strokeDasharray={`${seg} 100`}
          strokeDashoffset={-i * (seg + SEGMENT_GAP)}
        />
      ))
    } else {
      rings = (
        <>
          <circle {...circleProps} className={styles.trail} strokeDasharray={`${arc} 100`} strokeLinecap={dashboard ? cap : undefined} />
          {pct > 0 && (
            <circle
              {...circleProps}
              className={styles.arc}
              style={strokeStyle}
              strokeDasharray={`${(arc * pct) / 100} 100`}
              strokeLinecap={cap}
            />
          )}
        </>
      )
    }
    // Text size follows the diameter: 120+ → Heading-3, 80+ → LG, below → SM.
    const tier = custom ? (size >= 120 ? undefined : size >= 80 ? styles.tierSm : styles.tierXs) : undefined
    graphic = (
      <span className={cx(styles.circleBox, tier)}>
        <svg className={cx(styles.svg, gradient && endClass(gradient.to))} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          {gradient && (
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" className={styles.stopFrom} />
                <stop offset="1" className={styles.stopTo} />
              </linearGradient>
            </defs>
          )}
          {rings}
        </svg>
        {!tiny && <span className={styles.circleInfo}>{info('circle')}</span>}
      </span>
    )
  }

  const shared = {
    value: pct,
    valueLabel: valueText,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    id,
    className: rootClass,
    style: { ...sizeStyle, ...style },
  }
  const labelNode = label != null && <Label className={styles.label}>{label}</Label>
  const content = isCircle ? (
    <>
      {graphic}
      {labelNode}
    </>
  ) : (
    <>
      {labelNode}
      {graphic}
    </>
  )

  if (tiny && showInfo) {
    // The value no longer fits: it moves to a tooltip, and the gauge becomes
    // focusable so keyboard users can open it too.
    return (
      <Tooltip content={valueText}>
        <Focusable>
          <FocusableGauge isMeter={isMeter} gauge={shared}>{content}</FocusableGauge>
        </Focusable>
      </Tooltip>
    )
  }
  return isMeter ? <Meter {...shared}>{content}</Meter> : <ProgressBar {...shared}>{content}</ProgressBar>
}

interface FocusableGaugeProps extends HTMLAttributes<HTMLDivElement> {
  isMeter: boolean
  gauge: Pick<ProgressBarProps, 'value' | 'valueLabel' | 'aria-label' | 'aria-labelledby' | 'id'> & { className: string; style: CSSProperties }
  children: ReactNode
  ref?: Ref<HTMLDivElement>
}

/**
 * React Aria's ProgressBar / Meter drop focus handlers and `tabIndex`. The
 * tooltip trigger's props (focus, hover, `aria-describedby`) arrive here from
 * `<Focusable>` and are put back onto the rendered element.
 */
function FocusableGauge({ isMeter, gauge, children, ref, ...dom }: FocusableGaugeProps) {
  const render = (p: JSX.IntrinsicElements['div']) => <div {...mergeProps(p, dom)} tabIndex={0} />
  return isMeter ? (
    <Meter {...gauge} ref={ref} render={render}>{children}</Meter>
  ) : (
    <ProgressBar {...gauge} ref={ref} render={render}>{children}</ProgressBar>
  )
}

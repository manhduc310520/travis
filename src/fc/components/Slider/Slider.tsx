import { useMemo, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import {
  I18nProvider,
  Slider as AriaSlider,
  SliderThumb,
  SliderTrack,
  useLocale,
  type SliderProps as AriaSliderProps,
  type SliderRenderProps,
} from 'react-aria-components'
import { cx } from '../../space'
import { fieldFrame } from '../Input/field'
import styles from './Slider.module.css'

type SliderValue = number | number[]

/** When the value bubble above a thumb shows. `auto` = hover, keyboard focus and while dragging. */
export type SliderTooltip = 'auto' | 'always' | 'never'

export interface SliderProps<T extends SliderValue = number>
  extends Omit<AriaSliderProps<T>, 'className' | 'style' | 'children' | 'step' | 'value' | 'defaultValue' | 'onChange' | 'onChangeEnd'> {
  /** A number for one thumb; an array (e.g. `[20, 60]`) for a range — one thumb per entry. */
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  /** Called once the user lets go (pointer up, or after each key press). */
  onChangeEnd?: (value: T) => void
  /**
   * Distance between selectable values. `null` = only the `marks` can be picked
   * (arrow keys and dragging jump from mark to mark).
   */
  step?: number | null
  /**
   * Figma `Slider / Basic` Reverse: the maximum sits on the left. Horizontal
   * sliders only — a vertical slider always has its minimum at the bottom.
   */
  isReversed?: boolean
  /** Figma `Slider Rail` Marks: a dot and a label at each value, e.g. `{ 0: '0°C', 37: '37°C' }`. */
  marks?: Record<number, ReactNode>
  /**
   * Whether the track fills the chosen span (default). `false` draws no track and
   * highlights only the marks that equal the value.
   */
  included?: boolean
  /** A dot at every step. */
  dots?: boolean
  /** Figma handle State=Hover / Pressed: the value bubble. */
  tooltip?: SliderTooltip
  /** Text of the value bubble. Defaults to the value formatted with `formatOptions`. */
  formatTooltip?: (value: number) => ReactNode
  /** Figma `Slider / Icon`: an icon at the minimum end of the track… */
  iconStart?: ReactNode
  /** …and at the maximum end. */
  iconEnd?: ReactNode
  /** Visible label. Without it, pass `aria-label`. */
  label?: ReactNode
  /** Accessible name of each thumb in a range. Defaults to "Từ" / "Đến" for two thumbs. */
  thumbLabels?: string[]
  className?: string
}

const toArray = (v: SliderValue | undefined, fallback: number) => (v == null ? [fallback] : Array.isArray(v) ? v : [v])
const sameValues = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i])
const nearest = (list: number[], v: number) => list.reduce((best, m) => (Math.abs(m - v) < Math.abs(best - v) ? m : best), list[0])
const decimals = (v: number) => {
  const s = String(v)
  return s.includes('.') ? s.length - s.indexOf('.') - 1 : 0
}

/**
 * React Aria mirrors a horizontal slider when the locale is right-to-left, and
 * keeps everything else right: pointer, drag, arrow keys that follow the thumb,
 * Home / End, and the value announced to screen readers. So a reversed slider
 * renders under the same language with the Arabic script subtag, which only
 * flips the direction: numbers still format as the language does ("1.234,5").
 */
function reversedLocale(locale: string) {
  try {
    const base = new Intl.Locale(locale)
    return new Intl.Locale(base.language, { script: 'Arab', region: base.region }).toString()
  } catch {
    return `${locale.split('-')[0]}-Arab`
  }
}

/**
 * Figma "❖ Slider" (`Slider / Basic`, `Slider / Icon`, `Slider / InputNumber`).
 * Built on React Aria `Slider`: arrow keys (Shift = page), Page Up / Down,
 * Home / End; pressing the rail moves the nearest thumb.
 *
 * The thumb ring and the track use Color/Solid/Accent (3:1 against the rail
 * and the surface, WCAG 1.4.11) instead of the kit's pale Border/Accent-Light.
 */
export function Slider<T extends SliderValue = number>({
  value,
  defaultValue,
  onChange,
  onChangeEnd,
  step = 1,
  orientation = 'horizontal',
  isReversed = false,
  marks,
  included = true,
  dots = false,
  tooltip = 'auto',
  formatTooltip,
  iconStart,
  iconEnd,
  label,
  thumbLabels,
  minValue = 0,
  maxValue = 100,
  isDisabled,
  className,
  ...rest
}: SliderProps<T>) {
  const { locale } = useLocale()
  const vertical = orientation === 'vertical'
  const flipped = isReversed && !vertical
  const isRange = Array.isArray(value ?? defaultValue)
  const [inner, setInner] = useState(() => toArray(defaultValue, minValue))
  const values = value != null ? toArray(value, minValue) : inner

  const markList = useMemo(
    () => Object.keys(marks ?? {}).map(Number).filter((m) => Number.isFinite(m) && m >= minValue && m <= maxValue).sort((a, b) => a - b),
    [marks, minValue, maxValue],
  )
  const marksOnly = step === null && markList.length > 0
  // With `step={null}` React Aria still needs a step: the finest precision among the marks.
  const ariaStep = marksOnly ? 10 ** -Math.max(0, ...markList.map(decimals)) : (step ?? 1)
  const snap = (vs: number[]) => (marksOnly ? vs.map((v) => nearest(markList, v)) : vs)
  const out = (vs: number[]) => (isRange ? vs : vs[0]) as T

  const update = (next: number[]) => {
    if (sameValues(next, values)) return
    if (value == null) setInner(next)
    onChange?.(out(next))
  }

  const percent = (v: number) => (maxValue === minValue ? 0 : (v - minValue) / (maxValue - minValue))
  /** Where a value sits along the rail, from the start edge (left, or bottom when vertical). */
  const place = (v: number): CSSProperties => {
    const p = percent(v)
    return vertical ? { bottom: `${p * 100}%` } : { left: `${(flipped ? 1 - p : p) * 100}%` }
  }

  const low = values.length > 1 ? Math.min(...values) : minValue
  const high = Math.max(...values)
  const isActive = (v: number) => (included ? v >= low && v <= high : values.includes(v))

  const fillStyle = (): CSSProperties => {
    const a = percent(low)
    const b = percent(high)
    if (vertical) return { bottom: `${a * 100}%`, height: `${(b - a) * 100}%` }
    return { left: `${(flipped ? 1 - b : a) * 100}%`, width: `${(b - a) * 100}%` }
  }

  const stepDots = useMemo(() => {
    if (!dots || step == null || step <= 0) return []
    const list: number[] = []
    for (let v = minValue; v <= maxValue + 1e-9; v += step) list.push(Math.round(v * 1e6) / 1e6)
    return list
  }, [dots, step, minValue, maxValue])
  const dotValues = [...new Set([...stepDots, ...markList])]
  const hasLabels = markList.some((m) => marks?.[m] != null && marks[m] !== '')

  // `step={null}`: keys move to the neighbouring mark (React Aria would move by `ariaStep`).
  const onKeyDownCapture = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!marksOnly || isDisabled) return
    const thumb = (e.target as HTMLElement).closest<HTMLElement>('[data-fc-thumb]')
    if (!thumb) return
    const i = Number(thumb.dataset.fcThumb)
    const forward = flipped ? 'ArrowLeft' : 'ArrowRight'
    const backward = flipped ? 'ArrowRight' : 'ArrowLeft'
    const lo = i > 0 ? values[i - 1] : -Infinity
    const hi = i < values.length - 1 ? values[i + 1] : Infinity
    const allowed = markList.filter((m) => m >= lo && m <= hi)
    if (!allowed.length) return
    const at = allowed.indexOf(nearest(allowed, values[i]))
    let target: number
    if (e.key === forward || e.key === 'ArrowUp' || e.key === 'PageUp') target = allowed[Math.min(at + 1, allowed.length - 1)]
    else if (e.key === backward || e.key === 'ArrowDown' || e.key === 'PageDown') target = allowed[Math.max(at - 1, 0)]
    else if (e.key === 'Home') target = allowed[0]
    else if (e.key === 'End') target = allowed[allowed.length - 1]
    else return
    e.preventDefault()
    e.stopPropagation()
    const next = values.slice()
    next[i] = target
    update(next)
    if (!sameValues(next, values)) onChangeEnd?.(out(next))
  }

  // Icons follow the values: iconStart at the minimum end (left, right when reversed, bottom when vertical).
  const minFirst = !vertical && !flipped
  const before = minFirst ? iconStart : iconEnd
  const after = minFirst ? iconEnd : iconStart

  const names = thumbLabels ?? (values.length === 2 ? ['Từ', 'Đến'] : [])
  const frame = fieldFrame({ label })

  const slider = (
    <AriaSlider<number[]>
      {...rest}
      value={values}
      onChange={(vs) => update(snap(vs))}
      onChangeEnd={(vs) => onChangeEnd?.(out(snap(vs)))}
      minValue={minValue}
      maxValue={maxValue}
      step={ariaStep}
      orientation={orientation}
      isDisabled={isDisabled}
      className={cx(styles.slider, vertical && styles.vertical, className)}
    >
      {({ state }: SliderRenderProps) => (
        <>
          {frame.label}
          <div className={cx(styles.body, vertical && styles.bodyVertical)} onKeyDownCapture={onKeyDownCapture}>
            {before != null && <span className={styles.icon} aria-hidden="true">{before}</span>}
            <SliderTrack
              className={cx(styles.track, vertical && styles.trackVertical, hasLabels && !vertical && styles.labelsBelow)}
            >
              <div className={cx(styles.rail, vertical && styles.railVertical)} />
              {included && <div className={cx(styles.fill, vertical && styles.fillVertical)} style={fillStyle()} />}
              {dotValues.map((v) => (
                <span
                  key={`d${v}`}
                  aria-hidden="true"
                  className={cx(styles.dot, vertical && styles.dotVertical, isActive(v) && styles.dotActive)}
                  style={place(v)}
                />
              ))}
              {markList.map((m) =>
                marks?.[m] == null || marks[m] === '' ? null : (
                  <span
                    key={`l${m}`}
                    aria-hidden="true"
                    className={cx(styles.markLabel, vertical && styles.markLabelVertical, isActive(m) && styles.markLabelActive)}
                    style={place(m)}
                  >
                    {marks[m]}
                  </span>
                ),
              )}
              {values.map((v, i) => (
                <SliderThumb
                  key={i}
                  index={i}
                  aria-label={names[i]}
                  data-fc-thumb={i}
                  className={cx(styles.thumb, vertical && styles.thumbVertical)}
                >
                  {tooltip !== 'never' && (
                    <span
                      aria-hidden="true"
                      className={cx(styles.bubble, vertical ? styles.bubbleEnd : styles.bubbleTop, tooltip === 'always' && styles.bubbleAlways)}
                    >
                      {formatTooltip ? formatTooltip(v) : state.getThumbValueLabel(i)}
                    </span>
                  )}
                </SliderThumb>
              ))}
            </SliderTrack>
            {after != null && <span className={styles.icon} aria-hidden="true">{after}</span>}
          </div>
        </>
      )}
    </AriaSlider>
  )

  return flipped ? <I18nProvider locale={reversedLocale(locale)}>{slider}</I18nProvider> : slider
}

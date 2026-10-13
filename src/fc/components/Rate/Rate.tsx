import { useState, type ReactNode } from 'react'
import { Radio, RadioGroup, type RadioGroupProps } from 'react-aria-components'
import { Star01 } from '../../../icons'
import { cx } from '../../space'
import { Tooltip } from '../Tooltip/Tooltip'
import { Text } from '../Typography/Typography'
import styles from './Rate.module.css'

/** Figma `Rate / Rate Star` → `Size`: Small / Default / Large. */
export type RateSize = 'sm' | 'md' | 'lg'

export interface RateProps
  extends Omit<RadioGroupProps, 'value' | 'defaultValue' | 'onChange' | 'children' | 'className' | 'style' | 'orientation'> {
  /** Figma `Rate` → `Rate` (0 – 5). Controlled value. */
  value?: number
  /** Uncontrolled initial value. */
  defaultValue?: number
  onChange?: (value: number) => void
  /** Number of stars. Figma draws 5. */
  count?: number
  /** Allow half steps (Figma `Rate=0.5`, `1.5` …). Each star then has two hit areas. */
  allowHalf?: boolean
  /**
   * Clicking the selected star again resets the score to 0 (`onChange(0)`). Keyboard users clear
   * with Delete or Backspace. Default `true`, like the old antd Rate.
   */
  allowClear?: boolean
  /** Figma `Rate / Rate Star` → `Size`. Default `md` (20px). */
  size?: RateSize
  /**
   * Figma `Rate / Rate Star` → `Icon` (instance swap): replaces the star glyph with text, an icon,
   * or a function of the star index (0-based).
   */
  character?: ReactNode | ((index: number) => ReactNode)
  /** One word per whole star ("Tệ", "Tốt" …). Used for the `Text?` caption and each star's accessible name. */
  labels?: string[]
  /** Figma `Text?`: caption after the stars. Shows `labels[n - 1]` when given, otherwise the number. */
  showText?: boolean
  /**
   * One tooltip per star (fc `Tooltip`), shown while the pointer is over an interactive star or
   * while a star has keyboard focus. Screen readers get it as the star's description.
   */
  tooltips?: ReactNode[]
  className?: string
}

const formatValue = (v: number) => v.toLocaleString('vi-VN')

/**
 * Figma `Rate` (page "❖ Rate"): a row of Untitled UI `star-01` stars, 8px apart
 * (`Space/Margin/XS`), outline `Stroke/Width/Icon`, filled with `Color/Palette/Yellow/6`.
 * Built on React Aria `RadioGroup`: every step is a radio, so arrow keys change the value and
 * screen readers announce "3 sao". Hovering previews the value.
 */
export function Rate({
  value: valueProp,
  defaultValue = 0,
  onChange,
  count = 5,
  allowHalf = false,
  allowClear = true,
  size = 'md',
  character,
  labels,
  showText = false,
  tooltips,
  isDisabled,
  isReadOnly,
  className,
  'aria-label': ariaLabel = 'Đánh giá',
  ...rest
}: RateProps) {
  const [inner, setInner] = useState(defaultValue)
  const [hover, setHover] = useState<number | null>(null)
  // The step just cleared by a click: its hover preview stays off until the pointer leaves it.
  const [clearedAt, setClearedAt] = useState<number | null>(null)
  const [focusTip, setFocusTip] = useState<number | null>(null)
  const value = valueProp ?? inner
  const interactive = !isDisabled && !isReadOnly
  const shown = interactive && hover != null && hover !== clearedAt ? hover : value
  const hoverStar = interactive && hover != null ? Math.ceil(hover) - 1 : null

  const setValue = (next: number) => {
    if (valueProp === undefined) setInner(next)
    onChange?.(next)
  }

  const clear = (step: number | null) => {
    if (!interactive || !allowClear || value === 0) return
    setClearedAt(step)
    setValue(0)
  }

  const nameOf = (v: number) => {
    const word = Number.isInteger(v) ? labels?.[v - 1] : undefined
    return word ? `${formatValue(v)} sao, ${word}` : `${formatValue(v)} sao`
  }

  const glyph = (i: number) =>
    character === undefined ? <Star01 className={styles.svg} /> : typeof character === 'function' ? character(i) : character

  const text = labels?.[Math.ceil(shown) - 1] ?? (shown > 0 ? formatValue(shown) : '')

  return (
    <div className={cx(styles.rate, styles[size], !interactive && styles.static, className)}>
      <RadioGroup
        {...rest}
        aria-label={ariaLabel}
        orientation="horizontal"
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        value={value > 0 ? String(value) : null}
        onChange={(v) => setValue(Number(v))}
        className={styles.group}
      >
        {Array.from({ length: count }, (_, i) => {
          const fill = shown >= i + 1 ? 'full' : shown >= i + 0.5 ? 'half' : 'zero'
          const steps = allowHalf ? [i + 0.5, i + 1] : [i + 1]
          const hits = (
            <>
              {steps.map((step, k) => (
                <Radio
                  key={step}
                  value={String(step)}
                  aria-label={nameOf(step)}
                  className={cx(styles.hit, allowHalf && (k === 0 ? styles.hitLeft : styles.hitRight))}
                  onHoverStart={() => {
                    if (!interactive) return
                    setHover(step)
                    setClearedAt(null)
                  }}
                  onHoverEnd={() => {
                    setHover(null)
                    setClearedAt(null)
                  }}
                  // A second click on the selected step clears. Space is left alone: the browser
                  // would re-check the radio right after the keyup.
                  onPress={(e) => {
                    if (e.pointerType !== 'keyboard' && step === value) clear(step)
                  }}
                  onKeyDown={(e) => {
                    if (allowClear && interactive && (e.key === 'Delete' || e.key === 'Backspace')) clear(null)
                    else e.continuePropagation()
                  }}
                />
              ))}
            </>
          )
          const tip = tooltips?.[i]
          return (
            <span key={i} className={cx(styles.star, styles[fill])}>
              <span className={styles.back} aria-hidden="true">
                <span className={styles.glyph}>{glyph(i)}</span>
              </span>
              <span className={styles.front} aria-hidden="true">
                <span className={styles.glyph}>{glyph(i)}</span>
              </span>
              {tip == null || tip === '' ? (
                hits
              ) : (
                <Tooltip
                  content={tip}
                  isOpen={hoverStar === i || focusTip === i}
                  onOpenChange={(open) => setFocusTip((cur) => (open ? i : cur === i ? null : cur))}
                >
                  {hits}
                </Tooltip>
              )}
            </span>
          )
        })}
      </RadioGroup>
      {showText && text !== '' && <Text className={styles.text}>{text}</Text>}
    </div>
  )
}

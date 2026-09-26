import { Fragment, useId, useRef, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../../space'
import type { InputSize, InputStatus, InputVariant } from './field'
import styles from './Input.module.css'

export interface OtpFieldProps {
  /** Figma OTP Length: 4, 6 or 8 cells. */
  length?: number
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Called once every cell is filled. */
  onComplete?: (value: string) => void
  /** Figma "separator": rendered between cells, e.g. "-". */
  separator?: ReactNode
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  size?: InputSize
  variant?: Exclude<InputVariant, 'underlined'>
  status?: Exclude<InputStatus, 'success'>
  isDisabled?: boolean
  /** Numeric keypad on phones by default. */
  inputMode?: 'numeric' | 'text'
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  className?: string
}

/**
 * One-time code: a group of single-character inputs. Typing advances,
 * Backspace on an empty cell goes back, arrows move, pasting fills from the
 * focused cell on. Each cell is named "Ký tự i / n" for screen readers.
 */
export function OtpField({
  length = 6, value, defaultValue = '', onChange, onComplete, separator, label, description, errorMessage,
  size = 'md', variant = 'outlined', status, isDisabled, inputMode = 'numeric', 'aria-label': ariaLabel, className,
}: OtpFieldProps) {
  const [inner, setInner] = useState(defaultValue)
  const code = (value ?? inner).slice(0, length)
  const cells = useRef<(HTMLInputElement | null)[]>([])
  const id = useId()
  const invalid = status === 'error'

  const commit = (next: string) => {
    const trimmed = next.slice(0, length)
    if (value == null) setInner(trimmed)
    onChange?.(trimmed)
    if (trimmed.length === length && !trimmed.includes(' ')) onComplete?.(trimmed)
  }
  const setAt = (i: number, chars: string, advance = true) => {
    const arr = Array.from({ length }, (_, k) => code[k] ?? ' ')
    for (let k = 0; k < chars.length && i + k < length; k++) arr[i + k] = chars[k]
    commit(arr.join('').trimEnd())
    if (advance) cells.current[Math.min(i + chars.length, length - 1)]?.focus()
  }
  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[i]?.trim() && i > 0) {
      e.preventDefault()
      const arr = Array.from({ length }, (_, k) => code[k] ?? ' ')
      arr[i - 1] = ' '
      commit(arr.join('').trimEnd())
      cells.current[i - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && i > 0) cells.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < length - 1) cells.current[i + 1]?.focus()
  }
  const onPaste = (i: number) => (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\s/g, '')
    if (text) setAt(i, text)
  }

  return (
    <div className={cx(styles.field, className)}>
      {label != null && <span id={`${id}-label`} className={styles.label}>{label}</span>}
      <div
        role="group"
        aria-labelledby={label != null ? `${id}-label` : undefined}
        aria-label={label == null ? ariaLabel : undefined}
        aria-describedby={[description != null && `${id}-desc`, invalid && errorMessage != null && `${id}-err`].filter(Boolean).join(' ') || undefined}
        className={styles.otp}
      >
        {Array.from({ length }, (_, i) => (
          <Fragment key={i}>
            {i > 0 && separator != null && <span className={styles.otpSeparator} aria-hidden="true">{separator}</span>}
            <input
              ref={(el) => { cells.current[i] = el }}
              className={cx(styles.otpCell, styles[`otp-${size}`], styles[`otp-${variant}`], status && styles[`otp-${status}`])}
              value={code[i]?.trim() ?? ''}
              onChange={(e) => {
                const v = e.target.value.replace(/\s/g, '')
                if (v) setAt(i, v.slice(-1))
                else setAt(i, ' ', false)
              }}
              onKeyDown={onKeyDown(i)}
              onPaste={onPaste(i)}
              onFocus={(e) => e.target.select()}
              inputMode={inputMode}
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={length}
              disabled={isDisabled}
              aria-invalid={invalid || undefined}
              aria-label={`Ký tự ${i + 1} / ${length}`}
            />
          </Fragment>
        ))}
      </div>
      {description != null && <span id={`${id}-desc`} className={styles.description}>{description}</span>}
      {invalid && errorMessage != null && <span id={`${id}-err`} className={styles.error}>{errorMessage}</span>}
    </div>
  )
}

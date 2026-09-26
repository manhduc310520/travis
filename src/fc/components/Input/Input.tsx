import { useState, type ReactNode } from 'react'
import {
  Button as AriaButton,
  Group,
  Input as AriaInput,
  TextArea as AriaTextArea,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components'
import { Eye, EyeOff } from '../../../icons'
import { cx } from '../../space'
import { controlClasses, fieldFrame, type FieldChromeProps, useFieldSize } from './field'
import styles from './Input.module.css'

export type { InputSize, InputVariant, InputStatus } from './field'

/** Tracks the value length for the counter without taking control of the field. */
function useCount(props: Pick<AriaTextFieldProps, 'value' | 'defaultValue' | 'onChange'>) {
  const [length, setLength] = useState((props.defaultValue ?? '').length)
  return {
    length: props.value != null ? props.value.length : length,
    onChange: (v: string) => {
      setLength(v.length)
      props.onChange?.(v)
    },
  }
}

function Counter({ length, max }: { length: number; max?: number }) {
  // Visual only: native maxLength already stops input; announcing every keystroke would be noise.
  return <span className={styles.count} aria-hidden="true">{max != null ? `${length} / ${max}` : length}</span>
}

export interface TextFieldProps extends Omit<AriaTextFieldProps, 'className' | 'style' | 'children'>, FieldChromeProps {
  prefix?: ReactNode
  suffix?: ReactNode
  /** Figma "Pre Tab": text or an icon joined to the start of the field. */
  addonBefore?: ReactNode
  /** Figma "Post Tab". */
  addonAfter?: ReactNode
  /** Password fields only: adds a button that shows / hides the value. */
  revealable?: boolean
}

export function TextField({
  label, tooltip, description, errorMessage, size: sizeProp, variant = 'outlined', status, placeholder, showCount = false,
  prefix, suffix, addonBefore, addonAfter, revealable = false, type = 'text', isInvalid, className, ...rest
}: TextFieldProps) {
  const [revealed, setRevealed] = useState(false)
  const count = useCount(rest)
  const size = useFieldSize(sizeProp)
  const frame = fieldFrame({ label, description, errorMessage, isRequired: rest.isRequired, tooltip })
  const inputType = revealable && type === 'password' && revealed ? 'text' : type
  const hasAddons = addonBefore != null || addonAfter != null

  const box = (
    <Group className={cx(controlClasses({ size, variant, status }), hasAddons && styles.joined)}>
      {prefix != null && <span className={styles.affix}>{prefix}</span>}
      <AriaInput className={styles.input} placeholder={placeholder} />
      {revealable && type === 'password' && (
        <AriaButton
          className={styles.iconButton}
          aria-label={revealed ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          onPress={() => setRevealed((r) => !r)}
        >
          {revealed ? <EyeOff /> : <Eye />}
        </AriaButton>
      )}
      {showCount && <Counter length={count.length} max={rest.maxLength} />}
      {suffix != null && <span className={styles.affix}>{suffix}</span>}
    </Group>
  )

  return (
    <AriaTextField
      {...rest}
      onChange={count.onChange}
      type={inputType}
      isInvalid={status === 'error' ? true : isInvalid}
      className={cx(styles.field, className)}
    >
      {frame.label}
      {hasAddons ? (
        <div className={cx(styles.addonRow, size !== 'md' && styles[`addon-${size}`])}>
          {addonBefore != null && <span className={cx(styles.addon, styles.addonBefore)}>{addonBefore}</span>}
          {box}
          {addonAfter != null && <span className={cx(styles.addon, styles.addonAfter)}>{addonAfter}</span>}
        </div>
      ) : box}
      {frame.after}
    </AriaTextField>
  )
}

export interface TextAreaProps extends Omit<AriaTextFieldProps, 'className' | 'style' | 'children' | 'type'>, FieldChromeProps {
  rows?: number
}

export function TextArea({
  label, tooltip, description, errorMessage, size: sizeProp, variant = 'outlined', status, placeholder, showCount = false, rows = 3, isInvalid, className, ...rest
}: TextAreaProps) {
  const count = useCount(rest)
  const size = useFieldSize(sizeProp)
  const frame = fieldFrame({ label, description, errorMessage, isRequired: rest.isRequired, tooltip })
  return (
    <AriaTextField {...rest} onChange={count.onChange} isInvalid={status === 'error' ? true : isInvalid} className={cx(styles.field, className)}>
      {frame.label}
      <Group className={cx(controlClasses({ size, variant, status }), styles.multiline)}>
        <AriaTextArea className={cx(styles.input, styles.textarea)} placeholder={placeholder} rows={rows} />
      </Group>
      {showCount && <div className={styles.countBelow}><Counter length={count.length} max={rest.maxLength} /></div>}
      {frame.after}
    </AriaTextField>
  )
}

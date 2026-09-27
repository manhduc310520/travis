import type { ReactNode } from 'react'
import {
  Button as AriaButton,
  Group,
  Input as AriaInput,
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
} from 'react-aria-components'
import { ChevronDown, ChevronUp, Minus, Plus } from '../../../icons'
import { cx } from '../../space'
import { controlClasses, fieldFrame, useFieldSize, type FieldChromeProps } from '../Input/field'
import input from '../Input/Input.module.css'
import styles from './InputNumber.module.css'

export interface InputNumberProps extends Omit<AriaNumberFieldProps, 'className' | 'style' | 'children'>, Omit<FieldChromeProps, 'showCount'> {
  /** Figma `Form Label` Tooltip=True: short help behind a (?) after the label. */
  tooltip?: ReactNode
  /** Figma `Prefix Suffix` Prefix: icon or short text inside the box, before the number. */
  prefix?: ReactNode
  /** Figma Suffix: a unit after the number, e.g. "bàn" (tables) or "%". For money prefer `formatOptions` currency. */
  suffix?: ReactNode
  /** Figma "Pre Tab": text, icon or a small control joined to the start of the box. */
  addonBefore?: ReactNode
  /** Figma "Post Tab". */
  addonAfter?: ReactNode
  /**
   * Figma `InputNumber / Spinner`: `spinner` puts − and + buttons on both
   * sides, always visible. `default` shows stacked ▲▼ at the end while the
   * box is hovered or focused (always on touch screens).
   */
  mode?: 'default' | 'spinner'
  /** Default mode: show the ▲▼ buttons. ↑ / ↓, Page Up / Down, Home / End always step. */
  controls?: boolean
  /**
   * Fill the container. Otherwise the box has the compact Figma width
   * (Component/InputNumber/Width), or fits its content when it has a prefix / suffix.
   */
  block?: boolean
}

/**
 * Figma "❖ InputNumber". A React Aria NumberField in the shared field box:
 * sizes, Outlined / Filled / Borderless / Underlined, status, prefix / suffix,
 * addons, label / caption / error, `<Form size>`.
 *
 * Numbers are formatted and parsed for the locale (vi-VN: "1.234,5"); pass
 * `formatOptions` for decimals, percent or currency
 * (`{ style: 'currency', currency: 'VND' }` → "12.000 ₫"). `minValue`,
 * `maxValue` and `step` clamp and snap on blur (`commitBehavior="validate"`
 * reports out-of-range values as errors instead). Scrolling does not change
 * the value unless `isWheelDisabled={false}`.
 */
export function InputNumber({
  label, tooltip, description, errorMessage, size, variant = 'outlined', status, placeholder,
  prefix, suffix, addonBefore, addonAfter, mode = 'default', controls = true, block = false,
  isInvalid, isWheelDisabled = true, className, ...rest
}: InputNumberProps) {
  const resolved = useFieldSize(size)
  const frame = fieldFrame({ label, tooltip, description, errorMessage, isRequired: rest.isRequired })
  const spinner = mode === 'spinner'
  const handles = !spinner && controls && !rest.isDisabled && !rest.isReadOnly
  const hasAddons = addonBefore != null || addonAfter != null

  const start = prefix != null && <span className={input.affix}>{prefix}</span>
  const end = suffix != null && <span className={input.affix}>{suffix}</span>
  const number = <AriaInput className={cx(input.input, styles.input)} placeholder={placeholder} />

  const box = (
    <Group
      className={cx(
        controlClasses({ size: resolved, variant, status }),
        styles.box,
        resolved === 'sm' && styles.small,
        variant === 'filled' && styles.filled,
        spinner && styles.spinner,
        handles && styles.withHandles,
        hasAddons && input.joined,
      )}
    >
      {spinner ? (
        <>
          <AriaButton slot="decrement" className={cx(styles.step, styles.stepStart)}><Minus /></AriaButton>
          <span className={styles.middle}>{start}{number}{end}</span>
          <AriaButton slot="increment" className={cx(styles.step, styles.stepEnd)}><Plus /></AriaButton>
        </>
      ) : (
        <>
          {start}
          {number}
          {end}
          {handles && (
            <span className={styles.handles}>
              <AriaButton slot="increment" className={styles.handle}><ChevronUp /></AriaButton>
              <AriaButton slot="decrement" className={styles.handle}><ChevronDown /></AriaButton>
            </span>
          )}
        </>
      )}
    </Group>
  )

  return (
    <AriaNumberField
      {...rest}
      isWheelDisabled={isWheelDisabled}
      isInvalid={status === 'error' ? true : isInvalid}
      className={cx(input.field, styles.root, (prefix != null || suffix != null) && styles.affixed, block && styles.block, className)}
    >
      {frame.label}
      {hasAddons ? (
        <div className={cx(input.addonRow, resolved !== 'md' && input[`addon-${resolved}`], styles.addonRow)}>
          {addonBefore != null && <span className={cx(input.addon, input.addonBefore)}>{addonBefore}</span>}
          {box}
          {addonAfter != null && <span className={cx(input.addon, input.addonAfter)}>{addonAfter}</span>}
        </div>
      ) : box}
      {frame.after}
    </AriaNumberField>
  )
}

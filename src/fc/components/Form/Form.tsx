import { useContext, useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import {
  CheckboxGroupContext,
  ComboBoxContext,
  DateFieldContext,
  DatePickerContext,
  DateRangePickerContext,
  Form as AriaForm,
  FormValidationContext,
  NumberFieldContext,
  Provider,
  RadioGroupContext,
  SearchFieldContext,
  SelectContext,
  SliderContext,
  SwitchContext,
  TextFieldContext,
  TimeFieldContext,
  type FormProps as AriaFormProps,
} from 'react-aria-components'
import { cx } from '../../space'
import type { InputSize } from '../Input/field'
import { FieldLabel } from './FieldLabel'
import { FormItemContext, FormLayoutContext, type FormLayout, type FormLayoutContextValue, type FormRequiredMark } from './context'
import styles from './Form.module.css'

export type { FormLayout, FormRequiredMark } from './context'

export interface FormProps extends Omit<AriaFormProps, 'className' | 'style' | 'render'> {
  /** Figma `Form / Basic` Layout: label above (`vertical`), in a column on the left (`horizontal`), or everything on one row (`inline`). */
  layout?: FormLayout
  /**
   * Figma `Form / Basic` Size: Small / Default / Large. Every field inside
   * that is left at the default `md` takes this size; `sm` / `lg` set on a
   * field win. Buttons keep their own `size`.
   */
  size?: InputSize
  /** Horizontal layout: width of the label column — px as a number, or any CSS length. */
  labelWidth?: number | string
  /** Horizontal layout: labels flush right against the fields (`end`, default) or left (`start`). */
  labelAlign?: 'start' | 'end'
  /** Figma `Form Label` Mark. `true` (default): * on required fields; `'optional'`: "(không bắt buộc)" on the rest; `false`: no mark. */
  requiredMark?: FormRequiredMark
  /** Colon after labels in horizontal and inline layouts (Figma shows it). */
  colon?: boolean
  /** Text of the Optional mark. */
  optionalText?: ReactNode
  className?: string
}

/**
 * Figma "❖ Form". A React Aria `<form>`: native validation on submit
 * (`validationBehavior="native"`, focus moves to the first invalid field),
 * server errors through `validationErrors` (`{ [name]: message }`), shown on
 * the matching field until the user edits it. Layout, size and label marks
 * reach every fc field inside through context — no prop drilling.
 */
export function Form({
  layout = 'vertical', size, labelWidth, labelAlign = 'end', requiredMark = true, colon = true,
  optionalText = '(không bắt buộc)', className, children, ...rest
}: FormProps) {
  const context = useMemo<FormLayoutContextValue>(
    () => ({ layout, size, requiredMark, colon, optionalText }),
    [layout, size, requiredMark, colon, optionalText],
  )
  const style = labelWidth != null
    ? ({ '--_label-width': typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth } as CSSProperties)
    : undefined

  return (
    <AriaForm
      {...rest}
      className={cx(styles.form, styles[layout], size != null && size !== 'md' && styles[size], labelAlign === 'start' && styles.labelStart, className)}
      style={style}
    >
      <FormLayoutContext.Provider value={context}>{children}</FormLayoutContext.Provider>
    </AriaForm>
  )
}

export interface FormItemProps {
  /** Figma `Form Label` Text. Without it the content lines up with the field column (horizontal layout). */
  label?: ReactNode
  /** Figma `Form Label` Tooltip=True: short help behind a (?) after the label. */
  tooltip?: ReactNode
  /** Accessible name of the (?) button. */
  tooltipLabel?: string
  /** Figma `Input Caption`: help text under the content. */
  description?: ReactNode
  /** Shown while `isInvalid`, or with the Form's server error for `name`. */
  errorMessage?: ReactNode
  isInvalid?: boolean
  /** Shows the required mark and marks React Aria fields inside as required. */
  isRequired?: boolean
  /** Picks this item's server error out of the Form's `validationErrors`. */
  name?: string
  /** Id of a native control inside, so the label becomes `<label for>`. */
  htmlFor?: string
  children?: ReactNode
  className?: string
}

/**
 * Figma `Form / Form Item`: label, content, caption and error for anything
 * that is not an fc field with its own `label` — switches, radio / checkbox
 * groups, sliders, uploads, several controls on one row, action buttons.
 *
 * React Aria fields inside (TextField, Select, NumberField, RadioGroup,
 * CheckboxGroup, Switch, Slider, date / time fields…) are labelled and
 * described by the item automatically. Custom controls spread `useFormItem()`;
 * native ones take `htmlFor`.
 */
export function FormItem({
  label, tooltip, tooltipLabel, description, errorMessage, isInvalid = false, isRequired = false, name, htmlFor, children, className,
}: FormItemProps) {
  const id = useId()
  const serverErrors = useContext(FormValidationContext)
  // Like React Aria fields: a server error shows until the user edits something in the item.
  const [editedFor, setEditedFor] = useState<object | null>(null)
  const serverError = name != null && editedFor !== serverErrors ? [serverErrors[name] ?? []].flat().join(' ') : ''
  const invalid = isInvalid || serverError !== ''
  const error = invalid ? errorMessage ?? (serverError || null) : null

  const labelId = label != null ? `${id}-label` : undefined
  const descriptionId = description != null ? `${id}-description` : undefined
  const errorId = error != null ? `${id}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  // Only set what is true: `isInvalid: false` would switch off a field's own validation.
  const field = {
    'aria-labelledby': htmlFor == null ? labelId : undefined,
    'aria-describedby': describedBy,
    ...(invalid && { isInvalid: true }),
    ...(isRequired && { isRequired: true }),
  }
  const labelling = { 'aria-labelledby': field['aria-labelledby'], 'aria-describedby': describedBy }

  return (
    <div className={cx(styles.item, className)}>
      {label != null && (
        <FieldLabel kind="item" id={labelId} htmlFor={htmlFor} isRequired={isRequired} tooltip={tooltip} tooltipLabel={tooltipLabel}>
          {label}
        </FieldLabel>
      )}
      <div className={styles.itemControl}>
        <div className={styles.itemContent} onChange={name != null ? () => setEditedFor(serverErrors) : undefined}>
          <FormItemContext.Provider value={{ labelId, descriptionId, errorId, isInvalid: invalid, isRequired }}>
            <Provider
              values={[
                [TextFieldContext, field],
                [SearchFieldContext, field],
                [NumberFieldContext, field],
                [SelectContext, field],
                [ComboBoxContext, field],
                [CheckboxGroupContext, field],
                [RadioGroupContext, field],
                [DatePickerContext, field],
                [DateRangePickerContext, field],
                [DateFieldContext, field],
                [TimeFieldContext, field],
                [SliderContext, labelling],
                [SwitchContext, labelling],
              ]}
            >
              {children}
            </Provider>
          </FormItemContext.Provider>
        </div>
      </div>
      {description != null && <div id={descriptionId} className={styles.description}>{description}</div>}
      {error != null && <div id={errorId} className={styles.error}>{error}</div>}
    </div>
  )
}

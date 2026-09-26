import { createContext, useContext, type ReactNode } from 'react'
import type { ValidationResult } from 'react-aria-components'
import type { InputSize } from '../Input/field'

/** Figma `Form / Basic` Layout: Vertical, Horizontal, Inline. */
export type FormLayout = 'vertical' | 'horizontal' | 'inline'

/**
 * Figma `Form Label` Mark: `true` = asterisk on required fields (Required),
 * `'optional'` = "(không bắt buộc)" on the others (Optional), `false` = none.
 */
export type FormRequiredMark = boolean | 'optional'

export interface FormLayoutContextValue {
  layout: FormLayout
  /** Unset = fields keep their own size. */
  size?: InputSize
  requiredMark: FormRequiredMark
  /** Colon after the label (horizontal and inline layouts only, like Figma). */
  colon: boolean
  /** Text of the Optional mark. */
  optionalText: ReactNode
}

/**
 * Set by `<Form>`. Every field built on `field.tsx` (TextField, Select,
 * InputNumber…) and every `<FormItem>` reads it for size, label marks and layout.
 */
export const FormLayoutContext = createContext<FormLayoutContextValue | null>(null)

/** The size a field renders at: its own `sm` / `lg` wins; `md` (the default) follows the Form. */
export function resolveFieldSize(size: InputSize | undefined, formSize: InputSize | undefined): InputSize {
  return size != null && size !== 'md' ? size : formSize ?? 'md'
}

/** What `<FormItem>` tells a custom (non React Aria) control inside it. */
export interface FormItemContextValue {
  labelId?: string
  descriptionId?: string
  errorId?: string
  isInvalid: boolean
  isRequired: boolean
}

export const FormItemContext = createContext<FormItemContextValue | null>(null)

/**
 * For custom controls inside `<FormItem>` that are not built on React Aria:
 * spread the result on the focusable element so the item's label,
 * description and error reach assistive tech. React Aria fields get these
 * automatically.
 */
export function useFormItem() {
  const item = useContext(FormItemContext)
  if (!item) return {}
  const describedBy = [item.descriptionId, item.errorId].filter(Boolean).join(' ')
  return {
    'aria-labelledby': item.labelId,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': item.isInvalid || undefined,
    'aria-required': item.isRequired || undefined,
  }
}

/**
 * Native constraint messages come from the browser, in the browser's language.
 * These replace them with Vietnamese; `validate` / server messages pass through.
 */
const MESSAGES: [keyof ValidationResult['validationDetails'], string][] = [
  ['valueMissing', 'Trường này là bắt buộc'],
  ['typeMismatch', 'Giá trị không đúng định dạng'],
  ['patternMismatch', 'Giá trị không đúng định dạng'],
  ['tooShort', 'Giá trị quá ngắn'],
  ['tooLong', 'Giá trị quá dài'],
  ['rangeUnderflow', 'Giá trị nhỏ hơn mức cho phép'],
  ['rangeOverflow', 'Giá trị lớn hơn mức cho phép'],
  ['stepMismatch', 'Giá trị không khớp bước nhảy'],
  ['badInput', 'Giá trị không hợp lệ'],
]

/** Default content of every field's error line (a `FieldError` render function). */
export function validationText({ validationDetails, validationErrors }: ValidationResult): string | undefined {
  if (validationDetails.customError && validationErrors.length > 0) return validationErrors.join(' ')
  for (const [key, text] of MESSAGES) if (validationDetails[key]) return text
  return validationErrors.length > 0 ? validationErrors.join(' ') : undefined
}

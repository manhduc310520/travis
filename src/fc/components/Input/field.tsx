import { use, useContext, type ReactNode } from 'react'
import { FieldError, Text } from 'react-aria-components'
import { cx } from '../../space'
import { FormLayoutContext, resolveFieldSize, validationText } from '../Form/context'
import { FieldLabel } from '../Form/FieldLabel'
import styles from './Input.module.css'

export type InputSize = 'sm' | 'md' | 'lg'
/** Figma Input Item: Outlined, Filled, Underlined, Borderless. */
export type InputVariant = 'outlined' | 'filled' | 'underlined' | 'borderless'
/** `error` marks the field invalid (announced to assistive tech); `warning` and `success` are visual only. */
export type InputStatus = 'error' | 'warning' | 'success'

export interface FieldChromeProps {
  label?: ReactNode
  /** Figma `Form Label` Tooltip=True: a (?) after the label with this help text. */
  tooltip?: ReactNode
  /** Help text under the field, linked to it via aria-describedby. */
  description?: ReactNode
  /**
   * Shown when the field is invalid (`status="error"`, `isInvalid` or a failed `validate`).
   * Default: the `validate` / server message, or a Vietnamese text for native checks (required, min, max…).
   */
  errorMessage?: ReactNode
  /** Inside a `<Form size>`, the default `md` follows the form; `sm` / `lg` stay. */
  size?: InputSize
  variant?: InputVariant
  status?: InputStatus
  placeholder?: string
  /** Figma "Show Count": characters typed, out of `maxLength` when set. */
  showCount?: boolean
  className?: string
}

/**
 * The size a field renders at inside (or outside) a `<Form>`. Use it in new
 * fields for every size-dependent class, so they all follow `<Form size>`.
 */
export function useFieldSize(size?: InputSize): InputSize {
  return resolveFieldSize(size, useContext(FormLayoutContext)?.size)
}

/** Classes for the bordered box — shared by every field (TextField, TextArea, SearchField, Select, InputNumber, pickers…). */
export function controlClasses({ size, variant = 'outlined', status }: { size?: InputSize; variant?: InputVariant; status?: InputStatus }) {
  // Called while a field renders, so `use` can read the Form's size here and every
  // existing caller follows `<Form size>` without changing its code.
  // oxlint-disable-next-line react-hooks/rules-of-hooks
  const resolved = resolveFieldSize(size, use(FormLayoutContext)?.size)
  return cx(styles.control, resolved !== 'md' && styles[resolved], styles[variant], status === 'warning' && styles.warning, status === 'success' && styles.success)
}

export function fieldFrame({ label, description, errorMessage, isRequired, tooltip }: Pick<FieldChromeProps, 'label' | 'description' | 'errorMessage'> & {
  isRequired?: boolean
  /** Figma `Form Label` Tooltip=True: (?) after the label. */
  tooltip?: ReactNode
}) {
  return {
    // Figma `Form Label`: text, then the * / optional mark, the (?) and — in horizontal forms — the colon.
    label: label != null && <FieldLabel isRequired={isRequired} tooltip={tooltip}>{label}</FieldLabel>,
    after: (
      <>
        {description != null && <Text slot="description" className={styles.description}>{description}</Text>}
        <FieldError className={styles.error}>{errorMessage ?? validationText}</FieldError>
      </>
    ),
  }
}

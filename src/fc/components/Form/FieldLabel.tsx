import { useContext, type ReactNode } from 'react'
import { Button as AriaButton, ButtonContext, Label } from 'react-aria-components'
import { HelpCircle } from '../../../icons'
import { Tooltip } from '../Tooltip/Tooltip'
import { FormLayoutContext } from './context'
import styles from './Form.module.css'

export interface FieldLabelProps {
  children: ReactNode
  isRequired?: boolean
  /** Figma `Form Label` Tooltip=True: a (?) after the label that shows this text. */
  tooltip?: ReactNode
  /** Accessible name of the (?) button. */
  tooltipLabel?: string
  /**
   * `field` (default): a React Aria `<Label>` — inside a React Aria field it
   * gets its id / `for` from the field. `item`: a plain element for
   * `<FormItem>` — `<label for={htmlFor}>` when `htmlFor` is set, else `<span id>`.
   */
  kind?: 'field' | 'item'
  id?: string
  htmlFor?: string
}

/**
 * Figma `Form Label Vertical` / `Form Label Horizontal`: label text, the
 * required *, the (?) tooltip icon, the "(không bắt buộc)" mark and — in
 * horizontal and inline forms — the colon. Shared by every field (via `fieldFrame`) and by
 * `<FormItem>`, so all labels in a form look the same.
 *
 * The (?) button sits outside the `<label>` element: inside it, its name would
 * leak into the field's accessible name and a click would focus the field.
 */
export function FieldLabel({ children, isRequired, tooltip, tooltipLabel = 'Thông tin thêm', kind = 'field', id, htmlFor }: FieldLabelProps) {
  const form = useContext(FormLayoutContext)
  const mark = form?.requiredMark ?? true
  const colon = form != null && form.colon && form.layout !== 'vertical'

  // The * is decorative (the field itself is announced as required); Figma puts it before the (?)…
  const content = (
    <>
      {children}
      {isRequired && mark === true && <span className={styles.mark} aria-hidden="true">*</span>}
    </>
  )

  let label: ReactNode
  if (kind === 'field') label = <Label className={styles.label}>{content}</Label>
  else if (htmlFor != null) label = <label id={id} htmlFor={htmlFor} className={styles.label}>{content}</label>
  else label = <span id={id} className={styles.label}>{content}</span>

  return (
    <div className={styles.labelRow} data-fc-field-label="">
      {label}
      {tooltip != null && (
        // Inside a field (Select, NumberField, SearchField…) ButtonContext belongs to the
        // field's own buttons; clear it so the (?) stays a plain tooltip trigger.
        <ButtonContext.Provider value={null}>
          <Tooltip content={tooltip}>
            <AriaButton className={styles.tooltipButton} aria-label={tooltipLabel}>
              <HelpCircle />
            </AriaButton>
          </Tooltip>
        </ButtonContext.Provider>
      )}
      {/* …and the optional text after it. */}
      {!isRequired && mark === 'optional' && <span className={styles.optional}>{form?.optionalText}</span>}
      {colon && <span className={styles.colon} aria-hidden="true">:</span>}
    </div>
  )
}

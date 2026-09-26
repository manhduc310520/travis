import { useState } from 'react'
import {
  Button as AriaButton,
  ButtonContext,
  Group,
  Input as AriaInput,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
} from 'react-aria-components'
import { SearchMd, XClose } from '../../../icons'
import { cx } from '../../space'
import { Button } from '../Button/Button'
import { controlClasses, fieldFrame, type FieldChromeProps, useFieldSize } from './field'
import styles from './Input.module.css'

export interface SearchFieldProps extends Omit<AriaSearchFieldProps, 'className' | 'style' | 'children'>, Omit<FieldChromeProps, 'showCount'> {
  /**
   * Figma "Input / Search" button: `none` = search icon inside the field
   * (Enter submits); `default` = attached icon button; `primary` = attached
   * primary button (icon, or `buttonText` when given).
   */
  button?: 'none' | 'default' | 'primary'
  /** Text on the search button instead of the icon. */
  buttonText?: string
}

export function SearchField({
  label, tooltip, description, errorMessage, size: sizeProp, variant = 'outlined', status, placeholder,
  button = 'none', buttonText, isInvalid, onSubmit, onChange, value, defaultValue, className, ...rest
}: SearchFieldProps) {
  const [current, setCurrent] = useState(defaultValue ?? '')
  const text = value ?? current
  const size = useFieldSize(sizeProp)
  const frame = fieldFrame({ label, description, errorMessage, isRequired: rest.isRequired, tooltip })
  const attached = button !== 'none'

  const box = (
    <Group className={cx(controlClasses({ size, variant, status }), attached && styles.joined, styles.search)}>
      {!attached && <span className={styles.affix}><SearchMd /></span>}
      <AriaInput className={styles.input} placeholder={placeholder} />
      {/* Inside a SearchField, React Aria wires any Button as the clear button. */}
      <AriaButton className={cx(styles.iconButton, styles.clear)}>
        <XClose />
      </AriaButton>
    </Group>
  )

  return (
    <AriaSearchField
      {...rest}
      value={text}
      onChange={(v) => { setCurrent(v); onChange?.(v) }}
      onSubmit={onSubmit}
      isInvalid={status === 'error' ? true : isInvalid}
      className={cx(styles.field, className)}
    >
      {frame.label}
      {attached ? (
        <div className={cx(styles.addonRow, size !== 'md' && styles[`addon-${size}`])}>
          {box}
          {/* Clear the SearchField's button context so this one submits instead of clearing. */}
          <ButtonContext.Provider value={null}>
            <Button
              className={styles.searchButton}
              variant={button === 'primary' ? 'primary' : 'default'}
              size={size}
              aria-label={buttonText ? undefined : 'Tìm kiếm'}
              iconStart={buttonText ? undefined : <SearchMd />}
              isDisabled={rest.isDisabled}
              onPress={() => onSubmit?.(text)}
            >
              {buttonText}
            </Button>
          </ButtonContext.Provider>
        </div>
      ) : box}
      {frame.after}
    </AriaSearchField>
  )
}

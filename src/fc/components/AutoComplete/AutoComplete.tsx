import { useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Button as AriaButton,
  ButtonContext,
  ComboBox,
  ComboBoxStateContext,
  Group,
  Header,
  Input,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover as AriaPopover,
  Text,
  type Key,
} from 'react-aria-components'
import { SearchMd, XCircle } from '../../../icons'
import { cx } from '../../space'
import list from '../../listItem.module.css'
import overlay from '../../overlay.module.css'
import { Button } from '../Button/Button'
import { Empty } from '../Empty/Empty'
import { controlClasses, fieldFrame, type FieldChromeProps } from '../Input/field'
import input from '../Input/Input.module.css'
import styles from './AutoComplete.module.css'

/** One suggestion (Figma "AutoComplete Menu Item" Type=Default). */
export interface AutoCompleteItem {
  type?: 'option'
  key: Key
  label: ReactNode
  /** Text put in the box when chosen, and used for filtering; required when `label` is not a string. */
  textValue?: string
  description?: ReactNode
  /** Figma "Icon left". */
  icon?: ReactNode
  /** Figma "Icon + Text" on the right: a count, a unit, a shortcut. */
  extra?: ReactNode
  isDisabled?: boolean
}

/** A titled group (Figma menu Type=With Groups, item Type=Header); `extra` sits at the header's end (Figma "more"). */
export interface AutoCompleteGroup {
  type: 'group'
  key: Key
  label: ReactNode
  extra?: ReactNode
  children: AutoCompleteItem[]
}

export type AutoCompleteOption = AutoCompleteItem | AutoCompleteGroup

/** Built-in texts (Vietnamese by default). */
export interface AutoCompleteLabels {
  /** Clear button (×). */
  clear: string
  /** Name of the icon-only search button. */
  search: string
}

const LABELS: AutoCompleteLabels = { clear: 'Xóa nội dung', search: 'Tìm kiếm' }

export interface AutoCompleteProps extends Omit<FieldChromeProps, 'showCount'> {
  options: AutoCompleteOption[]
  /** The text in the box. Any text is a valid value, not only a suggestion. */
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** A suggestion was chosen (the box now holds its `textValue`). */
  onSelect?: (key: Key) => void
  /** Enter in the box (when no suggestion is highlighted) or the search button. */
  onSubmit?: (value: string) => void
  /**
   * `true` (default): show the suggestions that contain the typed text, ignoring accents and case.
   * `false`: show `options` as given — filter them yourself (e.g. from the server). Or your own test.
   */
  filter?: boolean | ((textValue: string, inputValue: string) => boolean)
  /** When the menu opens: while typing (default), on focus, or only with ↓. */
  menuTrigger?: 'input' | 'focus' | 'manual'
  /** Figma "AutoComplete / With Button": Button Default (`default`) or Button Primary (`primary`). */
  button?: 'none' | 'default' | 'primary'
  /** Text on the button instead of the search icon. */
  buttonText?: string
  /** Custom content of a suggestion row (replaces icon / label / description / extra). */
  renderOption?: (item: AutoCompleteItem) => ReactNode
  /** Clear button (×) when there is text. */
  allowClear?: boolean
  prefix?: ReactNode
  /** Menu below (default) or above the box. */
  placement?: 'bottom' | 'top'
  /** Figma menu Type=Empty: shown when nothing matches. Without it the menu just closes (free text is fine). */
  emptyContent?: ReactNode
  labels?: Partial<AutoCompleteLabels>
  isDisabled?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  name?: string
  autoFocus?: boolean
  /** Show the menu on first render (all suggestions). */
  defaultOpen?: boolean
  'aria-label'?: string
}

/** Accent- and case-insensitive form: "Phở bò" → "pho bo", "Đá" → "da". */
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
const contains = (textValue: string, inputValue: string) => fold(textValue).includes(fold(inputValue.trim()))
const showAll = () => true

const textOf = (o: { label: ReactNode; textValue?: string }) =>
  o.textValue ?? (typeof o.label === 'string' || typeof o.label === 'number' ? String(o.label) : '')

function renderOptions(options: AutoCompleteOption[], renderOption: AutoCompleteProps['renderOption'], grouped = false): ReactNode[] {
  return options.map((o) =>
    o.type === 'group' ? (
      <ListBoxSection key={o.key} id={o.key}>
        <Header className={cx(list.header, styles.header)}>
          <span className={styles.headerLabel}>{o.label}</span>
          {o.extra != null && <span className={styles.headerExtra}>{o.extra}</span>}
        </Header>
        {renderOptions(o.children, renderOption, true)}
      </ListBoxSection>
    ) : (
      <ListBoxItem
        key={o.key}
        id={o.key}
        textValue={textOf(o)}
        isDisabled={o.isDisabled}
        className={cx(list.item, styles.option, grouped && styles.grouped)}
      >
        {renderOption ? renderOption(o) : (
          <>
            {o.icon != null && <span className={list.icon} aria-hidden="true">{o.icon}</span>}
            <span className={styles.optionText}>
              <Text slot="label" className={list.label}>{o.label}</Text>
              {o.description != null && <Text slot="description" className={list.description}>{o.description}</Text>}
            </span>
            {o.extra != null && <span className={cx(list.extra, styles.extra)}>{o.extra}</span>}
          </>
        )}
      </ListBoxItem>
    ),
  )
}

/** The box's input; Enter submits unless it is choosing a highlighted suggestion. */
function BoxInput({ placeholder, onSubmit }: { placeholder?: string; onSubmit?: (value: string) => void }) {
  const state = useContext(ComboBoxStateContext)
  return (
    <Input
      className={input.input}
      placeholder={placeholder}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' || !state) return
        // `state` is from the last render: an open menu with a focused row means Enter picks that row.
        if (state.isOpen && state.selectionManager.focusedKey != null) return
        onSubmit?.(state.inputValue)
      }}
    />
  )
}

/** `defaultOpen`: ComboBox has no such prop, so open it once from inside. */
function OpenOnMount() {
  const state = useContext(ComboBoxStateContext)
  const done = useRef(false)
  useEffect(() => {
    if (done.current || !state) return
    done.current = true
    state.open(null, 'manual')
  }, [state])
  return null
}

/**
 * Figma "❖ AutoComplete": a text box that suggests values while typing —
 * the typed text itself is the value (React Aria ComboBox with
 * `allowsCustomValue`). Box = shared field chrome (Default = outlined,
 * Borderless, plus Filled / Underlined), menu = shared overlay + list rows.
 */
export function AutoComplete(props: AutoCompleteProps) {
  const {
    options, filter = true, menuTrigger = 'input', button = 'none', buttonText, renderOption, allowClear = false,
    prefix, placement = 'bottom', emptyContent, label, description, errorMessage, size = 'md', variant = 'outlined',
    status, placeholder, isDisabled, isRequired, isInvalid, name, autoFocus, defaultOpen = false, className,
    'aria-label': ariaLabel, onSelect, onSubmit,
  } = props
  const labels = { ...LABELS, ...props.labels }
  const [inner, setInner] = useState(props.defaultValue ?? '')
  const text = props.value ?? inner
  const setText = (next: string) => {
    if (props.value === undefined) setInner(next)
    props.onChange?.(next)
  }
  const rowRef = useRef<HTMLDivElement>(null)
  const frame = fieldFrame({ label, description, errorMessage, isRequired })
  const attached = button !== 'none'
  const defaultFilter = filter === true ? contains : filter === false ? showAll : filter

  const box = (
    <Group className={cx(controlClasses({ size, variant, status }), styles.box, attached && input.joined)}>
      {prefix != null && <span className={input.affix}>{prefix}</span>}
      <BoxInput placeholder={placeholder} onSubmit={onSubmit} />
      {allowClear && text !== '' && !isDisabled && (
        <ButtonContext.Provider value={null}>
          <AriaButton className={cx(input.iconButton, styles.clear)} aria-label={labels.clear} onPress={() => setText('')}>
            <XCircle />
          </AriaButton>
        </ButtonContext.Provider>
      )}
    </Group>
  )

  return (
    <ComboBox
      allowsCustomValue
      inputValue={text}
      onInputChange={setText}
      onSelectionChange={(key) => { if (key != null) onSelect?.(key) }}
      defaultFilter={defaultFilter}
      menuTrigger={menuTrigger}
      allowsEmptyCollection={emptyContent != null}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={status === 'error' ? true : isInvalid}
      name={name}
      autoFocus={autoFocus}
      aria-label={ariaLabel}
      className={cx(input.field, className)}
    >
      {frame.label}
      {attached ? (
        <div ref={rowRef} className={cx(input.addonRow, size !== 'md' && input[`addon-${size}`])}>
          {box}
          {/* Clear the ComboBox's button context so this one submits instead of toggling the menu. */}
          <ButtonContext.Provider value={null}>
            <Button
              className={input.searchButton}
              variant={button === 'primary' ? 'primary' : 'default'}
              size={size}
              aria-label={buttonText ? undefined : labels.search}
              iconStart={buttonText ? undefined : <SearchMd />}
              isDisabled={isDisabled}
              onPress={() => onSubmit?.(text)}
            >
              {buttonText}
            </Button>
          </ButtonContext.Provider>
        </div>
      ) : box}
      {frame.after}
      {defaultOpen && <OpenOnMount />}
      <AriaPopover
        placement={`${placement} start`}
        offset={4}
        className={cx(overlay.surface, styles.popover)}
        {...(attached ? { triggerRef: rowRef } : {})}
      >
        <ListBox
          className={cx(list.list, styles.listbox)}
          renderEmptyState={() => <Empty size="sm" description={emptyContent} />}
        >
          {renderOptions(options, renderOption)}
        </ListBox>
      </AriaPopover>
    </ComboBox>
  )
}

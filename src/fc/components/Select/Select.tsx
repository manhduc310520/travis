import { useContext, useMemo, useState, type ReactNode } from 'react'
import {
  Button as AriaButton,
  ButtonContext,
  ComboBox,
  Group,
  Header,
  Input,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectStateContext,
  SelectValue,
  Tag as AriaTag,
  TagGroup,
  TagList,
  Text,
  type Key,
} from 'react-aria-components'
import { Check, ChevronDown, XCircle, XClose } from '../../../icons'
import { cx } from '../../space'
import list from '../../listItem.module.css'
import overlay from '../../overlay.module.css'
import { controlClasses, fieldFrame, type FieldChromeProps, useFieldSize } from '../Input/field'
import input from '../Input/Input.module.css'
import styles from './Select.module.css'

/** One option, or a titled group of options (Figma menu "Title"). */
export type SelectOption =
  | {
      type?: 'option'
      key: Key
      label: ReactNode
      /** Text for type-ahead, search and screen readers when `label` is not a string. */
      textValue?: string
      description?: ReactNode
      icon?: ReactNode
      isDisabled?: boolean
    }
  | { type: 'group'; key: Key; label: ReactNode; children: SelectOption[] }

type Value = Key | null | Key[]

export interface SelectProps extends Omit<FieldChromeProps, 'showCount'> {
  options: SelectOption[]
  /** Figma Type: Basic (`single`), Multiple (`multiple`). */
  selectionMode?: 'single' | 'multiple'
  /** Figma Type=Search: type in the box to filter. Single selection only. */
  showSearch?: boolean
  /** `Key | null` for single, `Key[]` for multiple. */
  value?: Value
  defaultValue?: Value
  onChange?: (value: Value) => void
  /** Multiple: at most this many can be selected (Figma "Max count"); the rest turn disabled. */
  maxCount?: number
  /** Multiple: show this many tags, then "+N". */
  maxTagCount?: number
  /** Clear button (×) when there is a value. */
  allowClear?: boolean
  /** Figma "Prefix": icon or short text inside the box, before the value. */
  prefix?: ReactNode
  /** Figma Placement: menu below (default) or above the box. */
  placement?: 'bottom' | 'top'
  /** Shown when there is nothing to choose (Figma menu "Empty"). */
  emptyContent?: ReactNode
  isDisabled?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  name?: string
  autoFocus?: boolean
  /** Open on first render (not with `showSearch`). */
  defaultOpen?: boolean
  'aria-label'?: string
}

const flatOptions = (options: SelectOption[]): Extract<SelectOption, { key: Key; label: ReactNode; type?: 'option' }>[] =>
  options.flatMap((o) => (o.type === 'group' ? flatOptions(o.children) : [o]))

const textOf = (o: { label: ReactNode; textValue?: string }) => o.textValue ?? (typeof o.label === 'string' ? o.label : String(o.label))

function renderOptions(options: SelectOption[], multiple: boolean): ReactNode[] {
  return options.map((o) =>
    o.type === 'group' ? (
      <ListBoxSection key={o.key} id={o.key}>
        <Header className={list.header}>{o.label}</Header>
        {renderOptions(o.children, multiple)}
      </ListBoxSection>
    ) : (
      <ListBoxItem key={o.key} id={o.key} textValue={textOf(o)} isDisabled={o.isDisabled} className={cx(list.item, styles.option)}>
        {({ isSelected }) => (
          <>
            {o.icon != null && <span className={list.icon} aria-hidden="true">{o.icon}</span>}
            <span className={styles.optionText}>
              <Text slot="label" className={list.label}>{o.label}</Text>
              {o.description != null && <Text slot="description" className={list.description}>{o.description}</Text>}
            </span>
            {multiple && isSelected && <span className={list.check} aria-hidden="true"><Check /></span>}
          </>
        )}
      </ListBoxItem>
    ),
  )
}

/**
 * Figma "❖ Select": choose one or several values from a list. Outlined /
 * Filled / Borderless / Underlined boxes shared with TextField; the menu uses
 * the shared overlay surface and list rows.
 */
export function Select(props: SelectProps) {
  return props.showSearch && props.selectionMode !== 'multiple' ? <SearchSelect {...props} /> : <PickSelect {...props} />
}

/** Shared by both branches: the menu under the box. */
function Menu({ options, multiple, placement, emptyContent, disabledKeys }: { options: SelectOption[]; multiple: boolean; placement: 'bottom' | 'top'; emptyContent: ReactNode; disabledKeys?: Key[] }) {
  return (
    <AriaPopover placement={`${placement} start`} offset={4} className={cx(overlay.surface, styles.popover)}>
      <ListBox
        className={cx(list.list, styles.listbox)}
        disabledKeys={disabledKeys}
        renderEmptyState={() => <div className={list.empty}>{emptyContent}</div>}
      >
        {renderOptions(options, multiple)}
      </ListBox>
    </AriaPopover>
  )
}

function useValue(props: SelectProps) {
  const multiple = props.selectionMode === 'multiple'
  const [inner, setInner] = useState<Value>(props.defaultValue ?? (multiple ? [] : null))
  const value = props.value !== undefined ? props.value : inner
  const setValue = (next: Value) => {
    if (props.value === undefined) setInner(next)
    props.onChange?.(next)
  }
  return [value, setValue] as const
}

function PickSelect(props: SelectProps) {
  const {
    options, selectionMode = 'single', maxCount, maxTagCount, allowClear, prefix, placement = 'bottom',
    emptyContent = 'Không có dữ liệu', label, tooltip, description, errorMessage, size: sizeProp, variant = 'outlined',
    status, placeholder = 'Chọn', isDisabled, isRequired, isInvalid, name, autoFocus, defaultOpen, className, 'aria-label': ariaLabel,
  } = props
  const multiple = selectionMode === 'multiple'
  const [value, setValue] = useValue(props)
  const selected = multiple ? ((value as Key[]) ?? []) : []
  const hasValue = multiple ? selected.length > 0 : value != null
  const disabledKeys = !multiple || maxCount == null || selected.length < maxCount
    ? undefined
    : flatOptions(options).map((o) => o.key).filter((k) => !selected.includes(k))
  const size = useFieldSize(sizeProp)
  const frame = fieldFrame({ label, description, errorMessage, isRequired, tooltip })

  return (
    <AriaSelect
      selectionMode={selectionMode}
      value={value as never}
      onChange={(next) => setValue(next as Value)}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={status === 'error' ? true : isInvalid}
      name={name}
      autoFocus={autoFocus}
      defaultOpen={defaultOpen}
      aria-label={ariaLabel}
      className={cx(input.field, styles.select, className)}
    >
      {frame.label}
      <Group
        isDisabled={isDisabled}
        className={cx(controlClasses({ size, variant, status }), styles.box, multiple && styles.multiple, styles[size])}
      >
        {multiple ? (
          <MultipleValue options={options} maxTagCount={maxTagCount} placeholder={placeholder} prefix={prefix} isDisabled={isDisabled} />
        ) : (
          <AriaButton className={styles.trigger}>
            {prefix != null && <span className={cx(input.affix, styles.prefix)}>{prefix}</span>}
            <SelectValue className={styles.value} />
            <span className={styles.chevron} aria-hidden="true"><ChevronDown /></span>
          </AriaButton>
        )}
        {allowClear && hasValue && !isDisabled && (
          <ButtonContext.Provider value={null}>
            <AriaButton className={cx(input.iconButton, styles.clear)} aria-label="Xóa lựa chọn" onPress={() => setValue(multiple ? [] : null)}>
              <XCircle />
            </AriaButton>
          </ButtonContext.Provider>
        )}
      </Group>
      {frame.after}
      <Menu options={options} multiple={multiple} placement={placement} emptyContent={emptyContent} disabledKeys={disabledKeys} />
    </AriaSelect>
  )
}

/**
 * Multiple: selected values as removable tags inside the box. The trigger
 * button covers the whole box underneath the tags, so a click anywhere but a
 * tag opens the menu without nesting buttons inside the trigger.
 */
function MultipleValue({ options, maxTagCount, placeholder, prefix, isDisabled }: Pick<SelectProps, 'options' | 'maxTagCount' | 'placeholder' | 'prefix' | 'isDisabled'>) {
  const state = useContext(SelectStateContext)
  const byKey = useMemo(() => new Map(flatOptions(options).map((o) => [o.key, o])), [options])
  const keys = ((state?.value as readonly Key[] | undefined) ?? []).filter((k) => byKey.has(k))
  const shown = maxTagCount != null ? keys.slice(0, maxTagCount) : keys
  const rest = keys.length - shown.length

  return (
    <>
      <AriaButton className={styles.cover}>
        <SelectValue className={styles.srOnly} />
        <span className={styles.chevron} aria-hidden="true"><ChevronDown /></span>
      </AriaButton>
      {prefix != null && <span className={cx(input.affix, styles.prefix, styles.above)}>{prefix}</span>}
      {keys.length === 0 ? (
        <span className={styles.placeholder} aria-hidden="true">{placeholder}</span>
      ) : (
        <TagGroup
          aria-label="Đã chọn"
          disabledKeys={isDisabled ? keys : undefined}
          className={cx(styles.tags, styles.above)}
          onRemove={isDisabled ? undefined : (removed) => state?.setValue(keys.filter((k) => !removed.has(k)))}
        >
          <TagList className={styles.tagList}>
            {shown.map((k) => {
              const o = byKey.get(k)!
              return (
                <AriaTag key={k} id={k} textValue={textOf(o)} className={styles.tag}>
                  <span className={styles.tagLabel}>{o.label}</span>
                  {!isDisabled && (
                    <AriaButton slot="remove" className={styles.tagRemove} aria-label={`Gỡ ${textOf(o)}`}>
                      <XClose />
                    </AriaButton>
                  )}
                </AriaTag>
              )
            })}
            {rest > 0 && (
              <AriaTag id="__more" textValue={`và ${rest} mục khác`} className={cx(styles.tag, styles.more)}>+{rest}</AriaTag>
            )}
          </TagList>
        </TagGroup>
      )}
    </>
  )
}

/** Figma Type=Search: a combobox — type to filter, the box holds the text. */
function SearchSelect(props: SelectProps) {
  const {
    options, allowClear, prefix, placement = 'bottom', emptyContent = 'Không tìm thấy', label, tooltip, description, errorMessage,
    size: sizeProp, variant = 'outlined', status, placeholder = 'Tìm và chọn', isDisabled, isRequired, isInvalid, name, autoFocus,
    className, 'aria-label': ariaLabel,
  } = props
  const [value, setValue] = useValue(props)
  const size = useFieldSize(sizeProp)
  const frame = fieldFrame({ label, description, errorMessage, isRequired, tooltip })

  return (
    <ComboBox
      value={value as never}
      onChange={(next) => setValue(next as Value)}
      menuTrigger="focus"
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={status === 'error' ? true : isInvalid}
      name={name}
      autoFocus={autoFocus}
      aria-label={ariaLabel}
      allowsEmptyCollection
      className={cx(input.field, styles.select, className)}
    >
      {frame.label}
      <Group className={cx(controlClasses({ size, variant, status }), styles.box, styles[size])}>
        {prefix != null && <span className={cx(input.affix, styles.prefix)}>{prefix}</span>}
        <Input className={input.input} placeholder={placeholder} />
        {allowClear && value != null && !isDisabled && (
          <ButtonContext.Provider value={null}>
            <AriaButton className={cx(input.iconButton, styles.clear)} aria-label="Xóa lựa chọn" onPress={() => setValue(null)}>
              <XCircle />
            </AriaButton>
          </ButtonContext.Provider>
        )}
        <AriaButton className={styles.comboButton}>
          <ChevronDown />
        </AriaButton>
      </Group>
      {frame.after}
      <Menu options={options} multiple={false} placement={placement} emptyContent={emptyContent} />
    </ComboBox>
  )
}

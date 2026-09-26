import { useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { useField } from 'react-aria'
import {
  Button as AriaButton,
  FieldErrorContext,
  Group,
  LabelContext,
  Popover as AriaPopover,
  Provider,
  Tag as AriaTag,
  TagGroup,
  TagList,
  TextContext,
  type Key,
} from 'react-aria-components'
import { ChevronDown, XCircle, XClose } from '../../../icons'
import { cx } from '../../space'
import overlay from '../../overlay.module.css'
import { Empty } from '../Empty/Empty'
import { controlClasses, fieldFrame, type FieldChromeProps } from '../Input/field'
import input from '../Input/Input.module.css'
import { SearchField } from '../Input/SearchField'
import select from '../Select/Select.module.css'
import { Tree } from '../Tree/Tree'
import {
  ancestorKeys,
  checkedToValue,
  conductChecked,
  getExpandableKeys,
  indexTree,
  textOf,
  toggleChecked,
  type TreeCheckedStrategy,
  type TreeNode,
} from '../Tree/treeData'
import styles from './TreeSelect.module.css'

type Value = Key | null | Key[]

export interface TreeSelectProps extends Omit<FieldChromeProps, 'showCount'> {
  /** The tree: same nodes as `Tree`. */
  items: TreeNode[]
  /** Figma TreeSelect Menu Type: Basic (`single`), Checkable (`multiple`, tri-state checkboxes, tags in the box). */
  selectionMode?: 'single' | 'multiple'
  /** `Key | null` for single, `Key[]` for multiple. */
  value?: Value
  defaultValue?: Value
  onChange?: (value: Value) => void
  /**
   * Multiple: which checked nodes form the value and the tags. `child`
   * (default): only nodes without children; `parent`: a fully checked parent
   * stands for its subtree; `all`: every checked node.
   */
  showCheckedStrategy?: TreeCheckedStrategy
  /** A search box at the top of the menu: filters the tree and highlights the match. */
  showSearch?: boolean
  searchPlaceholder?: string
  /** Clear button (×) when there is a value. */
  allowClear?: boolean
  /** Multiple: show this many tags, then "+N". */
  maxTagCount?: number
  /** Icon or short text inside the box, before the value. */
  prefix?: ReactNode
  /** Figma Placement: menu below (Bottom Left / Right) or above (Top Left / Right) the box. */
  placement?: 'bottom' | 'top'
  /** Shown when there is nothing to choose or the search finds nothing. Default fc `Empty` (size sm). */
  emptyContent?: ReactNode
  /** Tree guide lines in the menu (Figma Tree Line=True). */
  showLine?: boolean
  /** Opened nodes on first open. Default: the ancestors of the value. */
  defaultExpandedKeys?: Key[]
  defaultExpandAll?: boolean
  /** Screen-reader text of the multiple box: how many values are chosen. */
  formatSelectedCount?: (count: number) => string
  isDisabled?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  /** Form field name: one hidden input per selected key. */
  name?: string
  autoFocus?: boolean
  /** Open on first render. */
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  'aria-label'?: string
}

const NO_DETAILS = {} as ValidityState

function useValue(props: TreeSelectProps) {
  const multiple = props.selectionMode === 'multiple'
  const [inner, setInner] = useState<Value>(props.defaultValue ?? (multiple ? [] : null))
  const value = props.value !== undefined ? props.value : inner
  const setValue = (next: Value) => {
    if (props.value === undefined) setInner(next)
    props.onChange?.(next)
  }
  return [value, setValue] as const
}

const keysOf = (value: Value, multiple: boolean): Key[] =>
  multiple ? (Array.isArray(value) ? value : []) : value != null && !Array.isArray(value) ? [value] : []

/**
 * Figma "❖ TreeSelect": the Select box (same field chrome: 4 variants,
 * status, 3 sizes) opening a `Tree` in the shared overlay surface. Single
 * selection closes the menu; multiple checks with tri-state conduction and
 * shows removable tags in the box, like Select multiple.
 */
export function TreeSelect(props: TreeSelectProps) {
  const {
    items, selectionMode = 'single', showCheckedStrategy = 'child', showSearch, searchPlaceholder = 'Tìm kiếm',
    allowClear, maxTagCount, prefix, placement = 'bottom', emptyContent, showLine, defaultExpandedKeys, defaultExpandAll,
    formatSelectedCount = (n) => `${n} mục đã chọn`, label, description, errorMessage, size = 'md', variant = 'outlined',
    status, placeholder = 'Chọn', isDisabled, isRequired, isInvalid, name, autoFocus, defaultOpen = false, onOpenChange,
    className, 'aria-label': ariaLabel,
  } = props
  const multiple = selectionMode === 'multiple'
  const [value, setValue] = useValue(props)
  const keys = keysOf(value, multiple)
  const index = useMemo(() => indexTree(items), [items])
  const checkState = useMemo(() => (multiple ? conductChecked(items, keysOf(value, true)) : null), [multiple, items, value])

  const [isOpen, setOpenState] = useState(defaultOpen && !isDisabled)
  const [query, setQuery] = useState('')
  const setOpen = (open: boolean) => {
    if (open && isDisabled) return
    setOpenState(open)
    if (!open) setQuery('')
    onOpenChange?.(open)
  }
  const [expanded, setExpanded] = useState<Key[]>(() =>
    defaultExpandAll ? getExpandableKeys(items) : defaultExpandedKeys ?? ancestorKeys(items, keysOf(props.value ?? props.defaultValue ?? null, multiple)),
  )

  const invalid = status === 'error' || !!isInvalid
  const valueId = useId()
  const boxRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const treeRef = useRef<HTMLDivElement>(null)
  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = useField({
    label, description, errorMessage, isInvalid: invalid, labelElementType: 'span', 'aria-label': ariaLabel, 'aria-labelledby': valueId,
  })
  const frame = fieldFrame({ label, description, errorMessage, isRequired })
  const menuName = label != null ? { 'aria-labelledby': labelProps.id } : { 'aria-label': ariaLabel ?? placeholder }

  const nodeText = (key: Key) => {
    const node = index.get(key)?.node
    return node ? textOf(node) || String(key) : String(key)
  }
  const tags = checkState ? checkedToValue(items, checkState.checked, showCheckedStrategy) : []
  const hasValue = keys.length > 0

  const removeTags = (removed: Set<Key>) => {
    if (!checkState) return
    let checked: ReadonlySet<Key> = checkState.checked
    for (const key of removed) {
      const next = new Set(checked)
      next.delete(key)
      checked = toggleChecked(items, checked, next).checked
    }
    setValue(checkedToValue(items, checked, showCheckedStrategy))
  }

  const triggerProps = {
    ...fieldProps,
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': isOpen,
    autoFocus,
    onPress: () => setOpen(!isOpen),
    onKeyDown: (e: { key: string; preventDefault: () => void; continuePropagation: () => void }) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setOpen(true)
      } else {
        e.continuePropagation()
      }
    },
  }
  const chevron = <span className={select.chevron} aria-hidden="true"><ChevronDown /></span>
  const single = !multiple && hasValue ? index.get(keys[0])?.node : undefined
  const shownTags = maxTagCount != null ? tags.slice(0, maxTagCount) : tags
  const restTags = tags.length - shownTags.length

  return (
    <div
      className={cx(input.field, select.select, className)}
      data-open={isOpen || undefined}
      data-invalid={invalid || undefined}
      data-disabled={isDisabled || undefined}
    >
      <Provider
        values={[
          [LabelContext, { ...labelProps, elementType: 'span', onClick: () => triggerRef.current?.focus() }],
          [TextContext, { slots: { description: descriptionProps, errorMessage: errorMessageProps } }],
          [FieldErrorContext, { isInvalid: invalid, validationErrors: [], validationDetails: NO_DETAILS }],
        ]}
      >
        {frame.label}
        <Group
          ref={boxRef}
          isDisabled={isDisabled}
          isInvalid={invalid}
          className={cx(controlClasses({ size, variant, status }), select.box, multiple && select.multiple, select[size])}
        >
          {multiple ? (
            <>
              {/* The trigger covers the box under the tags (as Select multiple): no buttons nested in buttons. */}
              <AriaButton ref={triggerRef} {...triggerProps} isDisabled={isDisabled} className={select.cover}>
                <span id={valueId} className={select.srOnly}>{tags.length > 0 ? formatSelectedCount(tags.length) : placeholder}</span>
                {chevron}
              </AriaButton>
              {prefix != null && <span className={cx(input.affix, select.prefix, select.above)}>{prefix}</span>}
              {tags.length === 0 ? (
                <span className={select.placeholder} aria-hidden="true">{placeholder}</span>
              ) : (
                <TagGroup
                  aria-label="Đã chọn"
                  disabledKeys={isDisabled ? tags : undefined}
                  className={cx(select.tags, select.above)}
                  onRemove={isDisabled ? undefined : removeTags}
                >
                  <TagList className={select.tagList}>
                    {shownTags.map((key) => (
                      <AriaTag key={key} id={key} textValue={nodeText(key)} className={select.tag}>
                        <span className={select.tagLabel}>{index.get(key)?.node.title ?? String(key)}</span>
                        {!isDisabled && (
                          <AriaButton slot="remove" className={select.tagRemove} aria-label={`Gỡ ${nodeText(key)}`}>
                            <XClose />
                          </AriaButton>
                        )}
                      </AriaTag>
                    ))}
                    {restTags > 0 && (
                      <AriaTag id="__more" textValue={`và ${restTags} mục khác`} className={cx(select.tag, select.more)}>+{restTags}</AriaTag>
                    )}
                  </TagList>
                </TagGroup>
              )}
            </>
          ) : (
            <AriaButton ref={triggerRef} {...triggerProps} isDisabled={isDisabled} className={select.trigger}>
              {prefix != null && <span className={cx(input.affix, select.prefix)}>{prefix}</span>}
              <span id={valueId} className={select.value} data-placeholder={hasValue ? undefined : true}>
                {hasValue ? single?.title ?? String(keys[0]) : placeholder}
              </span>
              {chevron}
            </AriaButton>
          )}
          {allowClear && hasValue && !isDisabled && (
            <AriaButton className={cx(input.iconButton, select.clear)} aria-label="Xóa lựa chọn" onPress={() => setValue(multiple ? [] : null)}>
              <XCircle />
            </AriaButton>
          )}
        </Group>
        {frame.after}
      </Provider>
      {name != null && keys.map((key) => <input key={String(key)} type="hidden" name={name} value={String(key)} />)}
      <AriaPopover
        triggerRef={boxRef}
        isOpen={isOpen}
        onOpenChange={setOpen}
        placement={`${placement} start`}
        offset={4}
        {...menuName}
        className={cx(overlay.surface, styles.popover)}
      >
        {showSearch && (
          <SearchField
            size="sm"
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            value={query}
            onChange={setQuery}
            autoFocus
            // ArrowDown moves from the search box into the tree.
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                treeRef.current?.focus()
              }
            }}
            className={styles.search}
          />
        )}
        <Tree
          ref={treeRef}
          items={items}
          {...menuName}
          className={styles.menuTree}
          checkable={multiple}
          checkedKeys={checkState ? [...checkState.checked] : undefined}
          onCheckedChange={(checked) => setValue(checkedToValue(items, new Set(checked), showCheckedStrategy))}
          selectionMode={multiple ? undefined : 'single'}
          selectedKeys={multiple ? undefined : keys}
          onSelectionChange={(selected) => {
            // Picking the current value again empties a toggle selection: keep the value, just close.
            if (selected.length > 0) setValue(selected[0])
            setOpen(false)
          }}
          expandedKeys={expanded}
          onExpandedChange={setExpanded}
          showLine={showLine}
          searchValue={query}
          autoFocus={!showSearch}
          escapeKeyBehavior="none"
          emptyContent={emptyContent ?? <Empty size="sm" description={query ? 'Không tìm thấy' : 'Không có dữ liệu'} />}
        />
      </AriaPopover>
    </div>
  )
}

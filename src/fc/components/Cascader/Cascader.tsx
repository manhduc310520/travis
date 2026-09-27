import { Fragment, useEffect, useId, useMemo, useReducer, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useField, useLocale } from 'react-aria'
import {
  Autocomplete,
  Button as AriaButton,
  Dialog,
  FieldErrorContext,
  Group,
  Input,
  LabelContext,
  ListBox,
  ListBoxItem,
  Popover as AriaPopover,
  Provider,
  SearchField as AriaSearchField,
  Tag as AriaTag,
  TagGroup,
  TagList,
  TextContext,
  type Key,
  type Selection,
} from 'react-aria-components'
import { ChevronDown, ChevronRight, SearchMd, XCircle, XClose } from '../../../icons'
import { cx } from '../../space'
import list from '../../listItem.module.css'
import overlay from '../../overlay.module.css'
import checkbox from '../Checkbox/Checkbox.module.css'
import { Empty } from '../Empty/Empty'
import { controlClasses, fieldFrame, type FieldChromeProps } from '../Input/field'
import input from '../Input/Input.module.css'
import select from '../Select/Select.module.css'
import styles from './Cascader.module.css'
import {
  allPaths,
  checkedFromValue,
  checkStateOf,
  hasChildren,
  matchRange,
  nodesOf,
  pathId,
  removePath,
  textOf,
  toggleChecked,
  valueFromChecked,
  fold,
  type CascaderOption,
  type CascaderPath,
  type CheckState,
} from './tree'

export type { CascaderOption, CascaderPath } from './tree'

/** Single: the path to the chosen node (or null). Multiple: one path per chosen node. */
export type CascaderValue = CascaderPath | null | CascaderPath[]

/** Figma Placement: Bottom Left / Bottom Right / Top Left / Top Right. */
export type CascaderPlacement = 'bottom start' | 'bottom end' | 'top start' | 'top end'

/** Built-in texts (Vietnamese by default). */
export interface CascaderLabels {
  /** Clear button (×). */
  clear: string
  /** Name of the tag list in the box (multiple). */
  selected: string
  /** Tag remove button, given the path text. */
  removeTag: (path: string) => string
  /** The "+N" tag, read out. */
  more: (count: number) => string
  /** Search box placeholder and name. */
  search: string
  /** Shown when the search matches nothing. */
  notFound: string
}

const LABELS: CascaderLabels = {
  clear: 'Xóa lựa chọn',
  selected: 'Đã chọn',
  removeTag: (path) => `Gỡ ${path}`,
  more: (count) => `và ${count} mục khác`,
  search: 'Tìm kiếm',
  notFound: 'Không tìm thấy',
}

export interface CascaderProps extends Omit<FieldChromeProps, 'showCount'> {
  /** The tree: provinces → districts → wards, menu → category → dish… */
  options: CascaderOption[]
  /** `multiple` = Figma menu item Type=Checkbox: tick branches or leaves, shown as tags in the box. */
  selectionMode?: 'single' | 'multiple'
  /** Single: `Key[] | null`. Multiple: `Key[][]` — a fully ticked branch is one path. */
  value?: CascaderValue
  defaultValue?: CascaderValue
  onChange?: (value: CascaderValue) => void
  /** Open the next column on `click` (default) or on `hover`. */
  expandTrigger?: 'click' | 'hover'
  /** Single: choosing a branch (not only a leaf) sets the value. */
  changeOnSelect?: boolean
  /** A search box at the top of the menu: matches whole paths, ignoring accents ("hoan kiem" finds "Hoàn Kiếm"). */
  showSearch?: boolean
  /** Custom display of the chosen path in the box. Default: the labels joined by " / ", e.g. "Hà Nội / Hoàn Kiếm / Tràng Tiền". */
  displayRender?: (labels: ReactNode[], options: CascaderOption[]) => ReactNode
  /** Multiple: show this many tags, then "+N". */
  maxTagCount?: number
  /** Clear button (×) when there is a value. */
  allowClear?: boolean
  /** Icon or short text inside the box, before the value. */
  prefix?: ReactNode
  /** Figma Placement. The menu flips when there is no room. */
  placement?: CascaderPlacement
  /** Figma Cascader Menu Variant2 (Empty): shown when `options` is empty. Default "Chưa có dữ liệu" (No data yet). */
  emptyContent?: ReactNode
  /** Figma Cascader Menu "Footer": content under the columns (a note, an action). */
  footer?: ReactNode
  labels?: Partial<CascaderLabels>
  isDisabled?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  autoFocus?: boolean
  /** Open on first render. */
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  'aria-label'?: string
}

interface Column {
  parentPath: CascaderPath
  items: CascaderOption[]
  name: string
}

const VALID: ValidityState = {
  badInput: false, customError: false, patternMismatch: false, rangeOverflow: false, rangeUnderflow: false,
  stepMismatch: false, tooLong: false, tooShort: false, typeMismatch: false, valid: true, valueMissing: false,
}

/** Column 0 is the whole list; each active branch adds a column with its children. */
function buildColumns(options: CascaderOption[], activePath: CascaderPath, rootName: string): Column[] {
  const columns: Column[] = [{ parentPath: [], items: options, name: rootName }]
  let level = options
  for (let i = 0; i < activePath.length; i++) {
    const node = level.find((o) => o.key === activePath[i])
    if (!node || !hasChildren(node)) break
    level = node.children!
    columns.push({ parentPath: activePath.slice(0, i + 1), items: level, name: textOf(node) || rootName })
  }
  return columns
}

const keysOf = (selection: Selection, all: Key[]): Set<Key> => (selection === 'all' ? new Set(all) : new Set(selection))
const samePath = (a: readonly Key[], b: readonly Key[]) => pathId(a) === pathId(b)

function defaultDisplay(_labels: ReactNode[], nodes: CascaderOption[]) {
  return nodes.map((n, i) => (
    <Fragment key={String(n.key)}>
      {i > 0 && ' / '}
      {n.label}
    </Fragment>
  ))
}

/**
 * Figma "❖ Cascader": pick a node in a tree through side-by-side columns
 * (province → district → ward). The box is the shared field chrome (Outlined /
 * Filled / Borderless / Underlined, status, sizes); the menu is the shared
 * overlay surface with one ListBox per level.
 *
 * Keyboard: ↑ / ↓ inside a column, → opens the child column and moves into it,
 * ← goes back, Enter / Space chooses (ticks in multiple mode), Esc closes.
 */
export function Cascader(props: CascaderProps) {
  const {
    options, selectionMode = 'single', expandTrigger = 'click', changeOnSelect = false, showSearch = false,
    displayRender = defaultDisplay, maxTagCount, allowClear = false, prefix, placement = 'bottom start',
    emptyContent = 'Chưa có dữ liệu', footer, label, description, errorMessage, size = 'md', variant = 'outlined',
    status, placeholder = 'Chọn', isDisabled, isRequired, isInvalid, autoFocus, defaultOpen = false, className,
    'aria-label': ariaLabel,
  } = props
  const labels = { ...LABELS, ...props.labels }
  const multiple = selectionMode === 'multiple'
  const { direction } = useLocale()
  const invalid = status === 'error' || !!isInvalid

  // ---------- value ----------
  const [innerValue, setInnerValue] = useState<CascaderValue>(props.defaultValue ?? (multiple ? [] : null))
  const value = props.value !== undefined ? props.value : innerValue
  const setValue = (next: CascaderValue) => {
    if (props.value === undefined) setInnerValue(next)
    props.onChange?.(next)
  }
  const singlePath = multiple ? null : (value as CascaderPath | null)
  const paths = useMemo(() => (multiple ? ((value as CascaderPath[] | null) ?? []) : []), [multiple, value])
  const checked = useMemo(() => (multiple ? checkedFromValue(options, paths) : new Set<string>()), [multiple, options, paths])
  const singleNodes = singlePath ? nodesOf(options, singlePath) : []
  const hasValue = multiple ? paths.length > 0 : singleNodes.length > 0 && singleNodes.length === singlePath!.length

  // ---------- open state, active path, search ----------
  const entryPath = (): CascaderPath => {
    if (!multiple) return singlePath ? nodesOf(options, singlePath).map((n) => n.key) : []
    const first = paths[0]
    return first ? nodesOf(options, first.slice(0, -1)).map((n) => n.key) : []
  }
  const [openInner, setOpenInner] = useState(defaultOpen)
  const isOpen = props.isOpen ?? openInner
  const [activePath, setActivePathState] = useState<CascaderPath>(entryPath)
  const [query, setQuery] = useState('')
  const searching = showSearch && query.trim() !== ''
  const setActivePath = (next: CascaderPath) => {
    if (!samePath(next, activePath)) setActivePathState(next)
  }

  // Focus to move after the next render: a column (and optionally a key in it). The bump
  // forces that render when the columns did not change (→ on a branch that is already open).
  const pendingFocus = useRef<{ col: number; key?: Key } | null>(null)
  const [, bump] = useReducer((n: number) => n + 1, 0)
  const requestFocus = (col: number, key?: Key) => {
    pendingFocus.current = { col, key }
    bump()
  }
  const columnsRef = useRef<HTMLDivElement>(null)
  // Last input on the columns: tells a click on a branch's label (expand) from one on its checkbox (tick).
  const lastInput = useRef<{ type: 'pointer' | 'keyboard'; onCheck: boolean } | null>(null)

  const setOpen = (open: boolean) => {
    if (open === isOpen) return
    if (open) {
      const start = entryPath()
      setActivePathState(start)
      setQuery('')
      if (!showSearch) {
        requestFocus(multiple ? start.length : Math.max(0, start.length - 1), multiple ? undefined : start[start.length - 1])
      }
    }
    if (props.isOpen === undefined) setOpenInner(open)
    props.onOpenChange?.(open)
  }

  useEffect(() => {
    const request = pendingFocus.current
    pendingFocus.current = null
    const column = request && columnsRef.current?.querySelector<HTMLElement>(`[data-column="${request.col}"]`)
    if (!request || !column) return
    const byKey = request.key != null ? column.querySelector<HTMLElement>(`[data-key="${CSS.escape(String(request.key))}"]`) : null
    const target = byKey
      ?? column.querySelector<HTMLElement>('[role="option"][aria-selected="true"]')
      ?? column.querySelector<HTMLElement>('[role="option"]:not([aria-disabled="true"])')
    target?.focus()
  })

  // ---------- columns ----------
  const rootName = typeof label === 'string' ? label : (ariaLabel ?? placeholder)
  const columns = buildColumns(options, activePath, rootName)

  const commitChecked = (next: Set<string>) => setValue(valueFromChecked(options, next))

  /** Click / Enter on a node: open its column, or choose it. */
  const activate = (col: number, node: CascaderOption, via: 'pointer' | 'keyboard') => {
    if (node.isDisabled) return
    const path = [...columns[col].parentPath, node.key]
    if (hasChildren(node)) {
      setActivePath(path)
      if (!multiple && changeOnSelect) setValue(path)
      if (via === 'keyboard') requestFocus(col + 1)
    } else if (!multiple) {
      setActivePath(path)
      setValue(path)
      setOpen(false)
    }
  }

  const onColumnSelection = (col: number, selection: Selection) => {
    const column = columns[col]
    const via = lastInput.current?.type === 'pointer' ? 'pointer' : 'keyboard'
    const onCheck = !!lastInput.current?.onCheck
    lastInput.current = null
    const enabled = column.items.filter((o) => !o.isDisabled).map((o) => o.key)
    const next = keysOf(selection, enabled)
    if (!multiple) {
      // Pressing the active row again empties the selection: treat it as choosing that row.
      const key = [...next][0] ?? activePath[col]
      const node = column.items.find((o) => o.key === key)
      if (node) activate(col, node, via)
      return
    }
    const prev = new Set(selectedIn(column))
    const added = [...next].filter((k) => !prev.has(k))
    const removed = [...prev].filter((k) => !next.has(k))
    if (added.length + removed.length === 1 && via === 'pointer' && !onCheck) {
      // A click on a branch's text opens it; its checkbox ticks it.
      const node = column.items.find((o) => o.key === (added[0] ?? removed[0]))
      if (node && hasChildren(node)) {
        activate(col, node, via)
        return
      }
    }
    let result: Set<string> = checked
    for (const k of added) result = toggleChecked(options, result, [...column.parentPath, k], true)
    for (const k of removed) result = toggleChecked(options, result, [...column.parentPath, k], false)
    commitChecked(result)
  }

  /** Rows marked selected: the active path (single) or the fully ticked nodes (multiple). */
  function selectedIn(column: Column): Key[] {
    if (!multiple) {
      const key = activePath[column.parentPath.length]
      return key != null && samePath(activePath.slice(0, column.parentPath.length), column.parentPath) ? [key] : []
    }
    return column.items.filter((o) => checkStateOf(o, [...column.parentPath, o.key], checked) === 'checked').map((o) => o.key)
  }

  const onColumnsKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    lastInput.current = { type: 'keyboard', onCheck: false }
    const forward = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    const back = direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    if (e.key !== forward && e.key !== back) return
    const target = e.target as HTMLElement
    const columnEl = target.closest<HTMLElement>('[data-column]')
    if (!columnEl) return
    const col = Number(columnEl.dataset.column)
    const column = columns[col]
    if (!column) return
    e.preventDefault()
    e.stopPropagation()
    if (e.key === forward) {
      const key = target.closest<HTMLElement>('[role="option"]')?.dataset.key
      const node = column.items.find((o) => String(o.key) === key)
      if (node && hasChildren(node) && !node.isDisabled) {
        setActivePath([...column.parentPath, node.key])
        requestFocus(col + 1)
      }
    } else if (col > 0) {
      setActivePath(activePath.slice(0, col))
      requestFocus(col - 1, column.parentPath[col - 1])
    }
  }

  // ---------- search ----------
  const entries = useMemo(() => (showSearch ? allPaths(options, changeOnSelect && !multiple) : []), [showSearch, options, changeOnSelect, multiple])
  const folded = fold(query.trim())
  const results = searching ? entries.filter((e) => fold(e.text).includes(folded)) : []
  const resultSelected = multiple
    ? results.filter((r) => checkStateOf(r.nodes[r.nodes.length - 1], r.path, checked) === 'checked').map((r) => r.id)
    : singlePath ? [pathId(singlePath)] : []
  const onResultSelection = (selection: Selection) => {
    const next = keysOf(selection, results.filter((r) => !r.isDisabled).map((r) => r.id))
    if (!multiple) {
      const id = [...next][0] ?? resultSelected[0]
      const entry = results.find((r) => r.id === id)
      if (entry) {
        setValue(entry.path)
        setOpen(false)
      }
      return
    }
    const prev = new Set<Key>(resultSelected)
    let result: Set<string> = checked
    for (const r of results) {
      if (next.has(r.id) && !prev.has(r.id)) result = toggleChecked(options, result, r.path, true)
      if (!next.has(r.id) && prev.has(r.id)) result = toggleChecked(options, result, r.path, false)
    }
    commitChecked(result)
  }

  // ---------- field ----------
  const valueId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const field = useField({
    label, description, errorMessage, isInvalid: invalid, 'aria-label': ariaLabel,
    'aria-labelledby': valueId, labelElementType: 'span',
  })
  const frame = fieldFrame({ label, description, errorMessage, isRequired })
  const openKeys = (e: { key: string; preventDefault: () => void; continuePropagation: () => void }) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
    } else e.continuePropagation()
  }
  const trigger = {
    ...field.fieldProps,
    ref: triggerRef,
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': isOpen,
    isDisabled,
    autoFocus,
    onPress: () => setOpen(!isOpen),
    onKeyDown: openKeys,
  }

  const pathText = (path: CascaderPath) => nodesOf(options, path).map(textOf).join(' / ')

  return (
    <div className={cx(input.field, select.select, className)} data-open={isOpen || undefined} data-invalid={invalid || undefined}>
      <Provider
        values={[
          [LabelContext, { ...field.labelProps, elementType: 'span', onClick: () => triggerRef.current?.focus() }],
          [TextContext, { slots: { description: field.descriptionProps, errorMessage: field.errorMessageProps } }],
          [FieldErrorContext, { isInvalid: invalid, validationErrors: [], validationDetails: VALID }],
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
              <AriaButton {...trigger} className={select.cover}>
                <span id={valueId} className={select.srOnly}>{hasValue ? paths.map(pathText).join(', ') : placeholder}</span>
                <span className={select.chevron} aria-hidden="true"><ChevronDown /></span>
              </AriaButton>
              {prefix != null && <span className={cx(input.affix, select.prefix, select.above)}>{prefix}</span>}
              {hasValue ? (
                <Tags
                  options={options}
                  paths={paths}
                  maxTagCount={maxTagCount}
                  isDisabled={isDisabled}
                  labels={labels}
                  onRemove={(ids) => commitChecked(paths.filter((p) => ids.has(pathId(p))).reduce((acc, p) => removePath(options, acc, p), checked))}
                />
              ) : (
                <span className={select.placeholder} aria-hidden="true">{placeholder}</span>
              )}
            </>
          ) : (
            <AriaButton {...trigger} className={select.trigger}>
              {prefix != null && <span className={cx(input.affix, select.prefix)}>{prefix}</span>}
              <span id={valueId} className={select.value} data-placeholder={hasValue ? undefined : true}>
                {hasValue ? displayRender(singleNodes.map((n) => n.label), singleNodes) : placeholder}
              </span>
              <span className={select.chevron} aria-hidden="true"><ChevronDown /></span>
            </AriaButton>
          )}
          {allowClear && hasValue && !isDisabled && (
            <AriaButton className={cx(input.iconButton, select.clear)} aria-label={labels.clear} onPress={() => setValue(multiple ? [] : null)}>
              <XCircle />
            </AriaButton>
          )}
        </Group>
        {frame.after}
      </Provider>

      <AriaPopover
        triggerRef={boxRef}
        isOpen={isOpen}
        onOpenChange={setOpen}
        placement={placement}
        offset={4}
        className={cx(overlay.surface, styles.popover, (showSearch || options.length === 0) && styles.wide)}
      >
        <Dialog
          className={styles.dialog}
          aria-labelledby={field.labelProps.id}
          aria-label={field.labelProps.id ? undefined : rootName}
        >
          {showSearch && (
            <Autocomplete inputValue={query} onInputChange={setQuery}>
              <AriaSearchField aria-label={labels.search} autoFocus className={styles.searchBar}>
                <Group className={cx(controlClasses({}), input.search)}>
                  <span className={input.affix}><SearchMd /></span>
                  <Input className={input.input} placeholder={labels.search} />
                </Group>
              </AriaSearchField>
              {searching && (
                <ListBox
                  aria-label={labels.search}
                  className={cx(list.list, styles.results)}
                  selectionMode={multiple ? 'multiple' : 'single'}
                  selectedKeys={resultSelected}
                  escapeKeyBehavior="none"
                  onSelectionChange={onResultSelection}
                  renderEmptyState={() => <Empty size="sm" description={labels.notFound} />}
                >
                  {results.map((r) => (
                    <ListBoxItem key={r.id} id={r.id} textValue={r.text} isDisabled={r.isDisabled} className={cx(list.item, styles.option)}>
                      {({ isHovered, isDisabled: disabled }) => (
                        <>
                          {multiple && (
                            <CheckMark state={checkStateOf(r.nodes[r.nodes.length - 1], r.path, checked)} isHovered={isHovered} isDisabled={disabled} />
                          )}
                          <span className={list.label}><Highlight text={r.text} query={query} /></span>
                        </>
                      )}
                    </ListBoxItem>
                  ))}
                </ListBox>
              )}
            </Autocomplete>
          )}

          {!searching && (options.length === 0 ? (
            <div className={styles.empty}><Empty size="sm" description={emptyContent} /></div>
          ) : (
            <div
              ref={columnsRef}
              className={styles.columns}
              onPointerDownCapture={(e) => { lastInput.current = { type: 'pointer', onCheck: !!(e.target as Element).closest('[data-check]') } }}
              onKeyDownCapture={onColumnsKeyDown}
            >
              {columns.map((column, col) => (
                <ListBox
                  key={pathId(column.parentPath)}
                  data-column={col}
                  aria-label={column.name}
                  className={cx(list.list, styles.column)}
                  selectionMode={multiple ? 'multiple' : 'single'}
                  selectedKeys={selectedIn(column)}
                  escapeKeyBehavior="none"
                  onSelectionChange={(selection) => onColumnSelection(col, selection)}
                >
                  {column.items.map((o) => {
                    const path = [...column.parentPath, o.key]
                    const onPath = activePath[col] === o.key
                    return (
                      <ListBoxItem
                        key={String(o.key)}
                        id={o.key}
                        textValue={textOf(o)}
                        isDisabled={o.isDisabled}
                        className={cx(list.item, styles.option, onPath && styles.active)}
                        onHoverStart={expandTrigger === 'hover' && !o.isDisabled
                          ? () => setActivePath(hasChildren(o) ? path : column.parentPath)
                          : undefined}
                      >
                        {({ isHovered, isDisabled: disabled }) => (
                          <>
                            {multiple && <CheckMark state={checkStateOf(o, path, checked)} isHovered={isHovered} isDisabled={disabled} />}
                            <span className={list.label}>{o.label}</span>
                            {hasChildren(o) && <span className={styles.expand} aria-hidden="true"><ChevronRight /></span>}
                          </>
                        )}
                      </ListBoxItem>
                    )
                  })}
                </ListBox>
              ))}
            </div>
          ))}

          {footer != null && <div className={styles.footer}>{footer}</div>}
        </Dialog>
      </AriaPopover>
    </div>
  )
}

/** Figma Type=Checkbox: the tick is drawn with Checkbox's own styles; the row carries the state (aria-selected). */
function CheckMark({ state, isHovered, isDisabled }: { state: CheckState; isHovered: boolean; isDisabled: boolean }) {
  return (
    <span
      className={checkbox.checkbox}
      data-check=""
      data-selected={state === 'checked' || undefined}
      data-indeterminate={state === 'indeterminate' || undefined}
      data-hovered={isHovered || undefined}
      data-disabled={isDisabled || undefined}
      aria-hidden="true"
    >
      <span className={checkbox.box}>
        {state === 'indeterminate' ? (
          <span className={checkbox.dash} />
        ) : (
          state === 'checked' && (
            <svg className={checkbox.check} viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6.25 5 8.75 9.5 3.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        )}
      </span>
    </span>
  )
}

/** The matched part of a search result in the accent colour (never bold). */
function Highlight({ text, query }: { text: string; query: string }) {
  const range = matchRange(text, query)
  if (!range) return <>{text}</>
  return (
    <>
      {text.slice(0, range[0])}
      <mark className={styles.match}>{text.slice(range[0], range[1])}</mark>
      {text.slice(range[1])}
    </>
  )
}

/** Multiple: chosen nodes as removable tags (same look as Select multiple). */
function Tags({ options, paths, maxTagCount, isDisabled, labels, onRemove }: {
  options: CascaderOption[]
  paths: CascaderPath[]
  maxTagCount?: number
  isDisabled?: boolean
  labels: CascaderLabels
  onRemove: (ids: Set<Key>) => void
}) {
  const items = paths
    .map((path) => ({ id: pathId(path), nodes: nodesOf(options, path), path }))
    .filter((t) => t.nodes.length === t.path.length && t.nodes.length > 0)
  const shown = maxTagCount != null ? items.slice(0, maxTagCount) : items
  const rest = items.length - shown.length
  return (
    <TagGroup
      aria-label={labels.selected}
      disabledKeys={isDisabled ? items.map((t) => t.id) : undefined}
      className={cx(select.tags, select.above)}
      onRemove={isDisabled ? undefined : (removed) => onRemove(new Set(removed))}
    >
      <TagList className={select.tagList}>
        {shown.map((t) => {
          const node = t.nodes[t.nodes.length - 1]
          const text = t.nodes.map(textOf).join(' / ')
          const locked = isDisabled || t.nodes.some((n) => n.isDisabled)
          return (
            <AriaTag key={t.id} id={t.id} textValue={text} className={select.tag}>
              <span className={select.tagLabel}>{node.label}</span>
              {!locked && (
                <AriaButton slot="remove" className={select.tagRemove} aria-label={labels.removeTag(text)}>
                  <XClose />
                </AriaButton>
              )}
            </AriaTag>
          )
        })}
        {rest > 0 && (
          <AriaTag id="__more" textValue={labels.more(rest)} className={cx(select.tag, select.more)}>+{rest}</AriaTag>
        )}
      </TagList>
    </TagGroup>
  )
}

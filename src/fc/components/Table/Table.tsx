import { useId, useMemo, useRef, useState, type CSSProperties, type FocusEvent, type ReactNode } from 'react'
import {
  Button as AriaButton,
  Cell,
  CheckboxContext,
  Column,
  Row,
  Table as AriaTable,
  TableBody,
  TableHeader,
  useSlottedContext,
  type Key,
  type Selection,
  type SortDescriptor,
  type ToggleState,
} from 'react-aria-components'
import { mergeProps, useCheckbox, useFocusRing, useHover } from 'react-aria'
import { FilterFunnel01, Minus, Plus, SearchMd } from '../../../icons'
import { Empty } from '../Empty/Empty'
import { Spin } from '../Spin/Spin'
import { cx } from '../../space'
import { Button } from '../Button/Button'
import { Checkbox } from '../Checkbox/Checkbox'
import { Dropdown } from '../Dropdown/Dropdown'
import { SearchField } from '../Input/SearchField'
import { Pagination, type PaginationProps } from '../Pagination/Pagination'
import { Popover } from '../Popover/Popover'
import radioStyles from '../Radio/Radio.module.css'
import styles from './Table.module.css'

/** Figma Size: Default (= `lg`, the default) / Medium (`md`) / Small (`sm`). */
export type TableSize = 'sm' | 'md' | 'lg'
export type TableAlign = 'start' | 'center' | 'end'
/** `single` draws a radio per row (Figma Row Control Type=Radio), `multiple` a checkbox (Type=Checkbox). */
export type TableSelectionMode = 'none' | 'single' | 'multiple'

/** One choice in a column's filter menu (Figma "Table Dropdown" Type=Filter). */
export interface TableFilterOption {
  value: Key
  label: ReactNode
  /** Text for type-ahead and screen readers when `label` is not a string. */
  textValue?: string
}

/** Applied filter values per column key. */
export type TableFilterValues = Record<string, Key[]>
/** Applied search text per column key. */
export type TableSearchValues = Record<string, string>

export interface TableColumn<T> {
  /** Unique column id; also the key in `sortDescriptor.column`, `filterValues`, `searchValues`. */
  key: Key
  /** Header content (Figma Header Item "Text"). */
  title: ReactNode
  /** Plain-text name of the column when `title` is not a string (sort announcements, button names). */
  textValue?: string
  /** Field of the record shown in the cell, and passed to `render` as its first argument. */
  dataIndex?: keyof T & string
  /**
   * Custom cell content (Figma Table cell Type=Badge / Tag / Action /
   * Dropdown / Switch / Action Button…). `value` is loosely typed like a plain data grid's
   * so column configs migrate as they are; prefer reading `record`.
   */
  render?: (value: any, record: T, index: number) => ReactNode
  /** Column width (CSS length or px number). */
  width?: number | string
  minWidth?: number | string
  /** Text alignment of header and cells; `end` for money and counts. */
  align?: TableAlign
  /** One line, cut with "…" (the table switches to a fixed layout, so give the column a `width`). */
  ellipsis?: boolean
  /**
   * The column that names each row for screen readers. Defaults to the first
   * data column.
   */
  isRowHeader?: boolean
  /**
   * Figma Header Item Sort=Yes. `true` shows the sort control and reports
   * changes through `onSortChange` (sort on the server); a compare function
   * sorts `dataSource` locally.
   */
  sortable?: boolean | ((a: T, b: T) => number)
  /** Figma Header Item Filter=true: the options of the header filter menu. */
  filters?: TableFilterOption[]
  /** Pick one option instead of several. Defaults to `true` (several). */
  filterMultiple?: boolean
  /**
   * Local filtering: whether `record` matches one applied option. Without it
   * the table only reports `onFilterChange` (filter on the server).
   */
  onFilter?: (value: Key, record: T) => boolean
  /**
   * Figma Header Item Search=true: a search box in the header ("Table
   * Dropdown" Type=Search). `true` only reports `onSearchChange`; a match
   * function filters `dataSource` locally.
   */
  searchable?: boolean | ((query: string, record: T) => boolean)
  /** Placeholder of the header search box. */
  searchPlaceholder?: string
  /** Open the filter menu on mount (docs, visual tests). */
  defaultFilterOpen?: boolean
  /** Open the search box on mount (docs, visual tests). */
  defaultSearchOpen?: boolean
  className?: string
}

/** Every visible or announced string, overridable one by one. */
export interface TableLabels {
  /** Name of the selection column (single selection; multiple uses React Aria's "Chọn tất cả"). */
  selectColumn: string
  /** Name of the expand column. */
  expandColumn: string
  /** Hidden name of an expanded detail row. */
  detailRow: (row: string) => string
  /** Default empty-state content. */
  empty: ReactNode
  /** Announced while `isLoading`. */
  loading: string
  /** Name of a column's filter button. */
  filter: (column: string, activeCount: number) => string
  /** Name of the filter menu. */
  filterMenu: (column: string) => string
  filterReset: string
  filterConfirm: string
  /** Name of a column's search button. */
  search: (column: string, query: string) => string
  /** Name of the search box. */
  searchField: (column: string) => string
  searchPlaceholder: string
  searchSubmit: string
  searchReset: string
  /** Name of the pagination landmark; gets the table name so several tables on a page differ. */
  pagination: (table: string | undefined) => string
  /** Default pagination total ("Hiển thị 1 - 10 trên tổng số 85"). */
  total: (total: number, range: [number, number]) => ReactNode
}

const fmt = new Intl.NumberFormat('vi-VN')

const LABELS: TableLabels = {
  selectColumn: 'Chọn dòng',
  expandColumn: 'Mở rộng dòng',
  detailRow: (row) => `Chi tiết ${row}`,
  empty: 'Không có dữ liệu',
  loading: 'Đang tải dữ liệu',
  filter: (column, n) => (n > 0 ? `Lọc cột ${column}, đang lọc ${n} giá trị` : `Lọc cột ${column}`),
  filterMenu: (column) => `Bộ lọc cột ${column}`,
  filterReset: 'Đặt lại',
  filterConfirm: 'Áp dụng',
  search: (column, query) => (query ? `Tìm trong cột ${column}, đang tìm "${query}"` : `Tìm trong cột ${column}`),
  searchField: (column) => `Từ khóa tìm trong cột ${column}`,
  searchPlaceholder: 'Nhập từ khóa',
  searchSubmit: 'Tìm',
  searchReset: 'Đặt lại',
  pagination: (table) => (table ? `Phân trang: ${table}` : 'Phân trang'),
  total: (total, [from, to]) => `Hiển thị ${fmt.format(from)} - ${fmt.format(to)} trên tổng số ${fmt.format(total)}`,
}

/** Pagination under the table: the fc Pagination props, plus `total` for server-side paging. */
export interface TablePagination extends Partial<Omit<PaginationProps, 'total'>> {
  /**
   * Server-side paging: the full number of records. The table then shows
   * `dataSource` as the current page instead of slicing it.
   */
  total?: number
}

export interface TableProps<T extends object> {
  columns: TableColumn<T>[]
  dataSource: readonly T[]
  /** Field (or function) giving each record a unique key. Defaults to `key`, then `id`. */
  rowKey?: (keyof T & string) | ((record: T) => Key)
  /** Figma Size: Default = `lg` (default), Medium = `md`, Small = `sm`. */
  size?: TableSize
  /** Figma Bordered: lines between columns; title and pagination sit outside the frame. */
  bordered?: boolean
  /** Figma Title?: above the table. Also names the table when there is no `aria-label`. */
  title?: ReactNode | ((rows: readonly T[]) => ReactNode)
  /** Figma Footer?: the band under the rows (totals, notes). */
  footer?: ReactNode | ((rows: readonly T[]) => ReactNode)
  /** Figma Pagination?: `false` hides it; otherwise 10 per page, sliced locally unless `total` is given. */
  pagination?: false | TablePagination
  /** Row selection (Figma Row Control Checkbox / Radio). */
  selectionMode?: TableSelectionMode
  selectedKeys?: Iterable<Key>
  defaultSelectedKeys?: Iterable<Key>
  /** Every selected key, including rows on other pages. */
  onSelectionChange?: (keys: Set<Key>) => void
  /** Rows whose selection is off (checkbox disabled). They stay readable and focusable. */
  disabledKeys?: Iterable<Key>
  sortDescriptor?: SortDescriptor
  defaultSortDescriptor?: SortDescriptor
  onSortChange?: (descriptor: SortDescriptor) => void
  filterValues?: TableFilterValues
  defaultFilterValues?: TableFilterValues
  onFilterChange?: (values: TableFilterValues) => void
  searchValues?: TableSearchValues
  defaultSearchValues?: TableSearchValues
  onSearchChange?: (values: TableSearchValues) => void
  /**
   * Expandable rows (Figma Row Control Expand / Collapse): content of the
   * detail row under a record. Arrow Right / Left on a row opens / closes it.
   */
  expandedRowRender?: (record: T) => ReactNode
  /** Which records can expand. Defaults to all. */
  rowExpandable?: (record: T) => boolean
  expandedKeys?: Iterable<Key>
  defaultExpandedKeys?: Iterable<Key>
  onExpandedChange?: (keys: Set<Key>) => void
  /** Rows are dimmed under a spinner and the table is marked busy. */
  isLoading?: boolean
  /** Shown when there are no rows. Defaults to "Không có dữ liệu". */
  emptyContent?: ReactNode
  /** Max height of the rows area: the body scrolls under a sticky header. */
  scrollY?: number | string
  /** Min width of the table: narrower frames scroll sideways. */
  scrollX?: number | string
  /** Enter on a row, or a click when there is no selection. */
  onRowAction?: (key: Key, record: T) => void
  labels?: Partial<TableLabels>
  /** Name of the table. Without it, `title` names it. */
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
}

const EXPAND_KEY = '__fc-table-expand'
const SELECT_KEY = '__fc-table-select'
const DETAIL_PREFIX = '__fc-table-detail:'
const DEFAULT_PAGE_SIZE = 10

function keyOf<T extends object>(record: T, index: number, rowKey: TableProps<T>['rowKey']): Key {
  if (typeof rowKey === 'function') return rowKey(record)
  const fields = record as Record<string, unknown>
  for (const field of rowKey != null ? [rowKey] : ['key', 'id']) {
    const value = fields[field]
    if (typeof value === 'string' || typeof value === 'number') return value
  }
  return index
}

const columnText = <T,>(column: TableColumn<T>) =>
  column.textValue ?? (typeof column.title === 'string' ? column.title : String(column.key))

/** Controlled when `value` is defined, otherwise internal. */
function useControlled<V>(value: V | undefined, initial: () => V, onChange?: (next: V) => void): [V, (next: V) => void] {
  const [inner, setInner] = useState(initial)
  const current = value !== undefined ? value : inner
  const set = (next: V) => {
    if (value === undefined) setInner(next)
    onChange?.(next)
  }
  return [current, set]
}

/**
 * React Aria scrolls a keyboard-focused row into view against the table
 * element, not our scroll box, and when anything moved it re-centres the
 * whole table, which jumps. Bringing the focused row / cell into view first
 * (below the sticky header, then the page "nearest") leaves it nothing to do.
 */
function keepFocusInView(event: FocusEvent<HTMLDivElement>) {
  const box = event.currentTarget
  const target = event.target
  if (!(target instanceof HTMLElement) || !box.contains(target) || target.closest('thead') || !target.matches(':focus-visible')) return
  const view = box.getBoundingClientRect()
  const rect = target.getBoundingClientRect()
  const headerHeight = box.querySelector('thead')?.getBoundingClientRect().height ?? 0
  const top = view.top + box.clientTop + headerHeight
  const bottom = view.top + box.clientTop + box.clientHeight
  if (rect.top < top) box.scrollTop -= top - rect.top
  else if (rect.bottom > bottom) box.scrollTop += Math.min(rect.bottom - bottom, rect.top - top)
  const left = view.left + box.clientLeft
  const right = left + box.clientWidth
  if (rect.width <= box.clientWidth) {
    if (rect.left < left) box.scrollLeft -= left - rect.left
    else if (rect.right > right) box.scrollLeft += rect.right - right
  }
  target.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}

/** The id React Aria gives the cell of `rowKey` in `columnKey` (see react-aria table utils). */
const cellId = (grid: string, rowKey: Key, columnKey: Key | undefined) => {
  const part = (key: Key | undefined) => (typeof key === 'string' ? key.replace(/\s*/g, '') : String(key))
  return `${grid}-${part(rowKey)}-${part(columnKey)}`
}

const alignClass = (align: TableAlign | undefined) =>
  align === 'end' ? styles.alignEnd : align === 'center' ? styles.alignCenter : undefined

/**
 * Figma "❖ Table": a data grid on React Aria Table. Rows, cells and headers
 * are reached with the arrow keys (one Tab stop); sorting, selection and
 * expansion are announced. Columns and data are plain objects.
 */
export function Table<T extends object>({
  columns,
  dataSource,
  rowKey,
  size = 'lg',
  bordered = false,
  title,
  footer,
  pagination,
  selectionMode = 'none',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disabledKeys,
  sortDescriptor,
  defaultSortDescriptor,
  onSortChange,
  filterValues,
  defaultFilterValues,
  onFilterChange,
  searchValues,
  defaultSearchValues,
  onSearchChange,
  expandedRowRender,
  rowExpandable,
  expandedKeys,
  defaultExpandedKeys,
  onExpandedChange,
  isLoading = false,
  emptyContent,
  scrollY,
  scrollX,
  onRowAction,
  labels,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className,
}: TableProps<T>) {
  const t = { ...LABELS, ...labels }
  const titleId = useId()
  const gridId = useId()

  // ---------- state ----------
  const [selected, setSelected] = useControlled<Set<Key>>(
    selectedKeys === undefined ? undefined : new Set(selectedKeys),
    () => new Set(defaultSelectedKeys ?? []),
    onSelectionChange,
  )
  const [sort, setSort] = useControlled<SortDescriptor | undefined>(sortDescriptor, () => defaultSortDescriptor)
  const [filters, setFilters] = useControlled<TableFilterValues>(filterValues, () => defaultFilterValues ?? {}, onFilterChange)
  const [search, setSearch] = useControlled<TableSearchValues>(searchValues, () => defaultSearchValues ?? {}, onSearchChange)

  const pager = pagination === false ? null : pagination ?? {}
  const { total: remoteTotal, current: currentProp, defaultCurrent, onChange: onPageChange, pageSize: pageSizeProp, showTotal, ...pagerRest } = pager ?? {}
  const pageSize = pageSizeProp ?? DEFAULT_PAGE_SIZE
  const [innerPage, setInnerPage] = useState(defaultCurrent ?? 1)

  // ---------- data: filter → search → sort → page ----------
  const processed = useMemo(() => {
    let list = [...dataSource]
    for (const column of columns) {
      const values = filters[String(column.key)]
      const onFilter = column.onFilter
      if (onFilter && values?.length) list = list.filter((record) => values.some((value) => onFilter(value, record)))
      const query = search[String(column.key)]
      const match = column.searchable
      if (typeof match === 'function' && query) list = list.filter((record) => match(query, record))
    }
    const sortColumn = sort && columns.find((column) => column.key === sort.column)
    const compare = sortColumn?.sortable
    if (sort && typeof compare === 'function') {
      const sign = sort.direction === 'descending' ? -1 : 1
      list.sort((a, b) => sign * compare(a, b))
    }
    return list
  }, [dataSource, columns, filters, search, sort])

  const total = remoteTotal ?? processed.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, currentProp ?? innerPage), pageCount)
  const rows = pager && remoteTotal == null ? processed.slice((page - 1) * pageSize, page * pageSize) : processed

  const goToPage = (next: number, nextSize = pageSize) => {
    if (currentProp === undefined) setInnerPage(next)
    onPageChange?.(next, nextSize)
  }
  /** Sorting, filtering and searching start again from page 1. */
  const backToFirstPage = () => {
    if (pager && page !== 1) goToPage(1)
  }

  const keyed = rows.map((record, index) => ({ record, index, key: keyOf(record, index, rowKey) }))
  const recordByKey = new Map(keyed.map((row) => [row.key, row.record]))
  const pageKeys = new Set(keyed.map((row) => row.key))
  const disabled = new Set(disabledKeys ?? [])

  // React Aria sees the current page; `selected` also keeps keys from other pages.
  const handleSelection = (next: Selection) => {
    const onPage = next === 'all'
      ? keyed.map((row) => row.key).filter((key) => !disabled.has(key))
      : [...next].filter((key) => pageKeys.has(key))
    const merged = new Set<Key>(selectionMode === 'multiple' ? [...selected].filter((key) => !pageKeys.has(key)) : [])
    for (const key of onPage) merged.add(key)
    setSelected(merged)
  }

  // ---------- columns ----------
  const expandable = expandedRowRender != null
  const hasSelection = selectionMode !== 'none'
  const columnCount = columns.length + (expandable ? 1 : 0) + (hasSelection ? 1 : 0)
  const rowHeaderKey = columns.find((column) => column.isRowHeader)?.key ?? columns[0]?.key
  const fixedLayout = columns.some((column) => column.ellipsis)

  const setColumnFilter = (column: TableColumn<T>, values: Key[]) => {
    const next = { ...filters }
    if (values.length) next[String(column.key)] = values
    else delete next[String(column.key)]
    setFilters(next)
    backToFirstPage()
  }
  const setColumnSearch = (column: TableColumn<T>, query: string) => {
    const next = { ...search }
    if (query) next[String(column.key)] = query
    else delete next[String(column.key)]
    setSearch(next)
    backToFirstPage()
  }

  const titleNode = typeof title === 'function' ? title(rows) : title
  const footerNode = typeof footer === 'function' ? footer(rows) : footer
  const showPager = pager != null && total > 0

  const pagerNode = showPager && (
    <div className={cx(styles.pager, bordered ? styles.pagerOutside : styles.pagerInside)}>
      <Pagination
        aria-label={t.pagination(ariaLabel ?? (typeof titleNode === 'string' ? titleNode : undefined))}
        {...pagerRest}
        total={total}
        pageSize={pageSize}
        current={page}
        onChange={goToPage}
        showTotal={showTotal ?? t.total}
      />
    </div>
  )

  const tableStyle: CSSProperties | undefined = scrollX != null ? { minWidth: scrollX } : undefined

  return (
    <div className={cx(styles.root, size !== 'lg' && styles[size], bordered && styles.bordered, className)}>
      {titleNode != null && <div id={titleId} className={styles.title}>{titleNode}</div>}
      <div className={styles.frame}>
        <div className={styles.viewport} aria-busy={isLoading || undefined}>
          <div className={styles.scroll} style={scrollY != null ? { maxHeight: scrollY } : undefined} onFocusCapture={keepFocusInView}>
            <AriaTable
              // React Aria uses a given `id` as the grid id (useTable → useId(props.id)); its types omit it.
              {...({ id: gridId } as object)}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby ?? (ariaLabel == null && titleNode != null ? titleId : undefined)}
              className={cx(styles.table, fixedLayout && styles.fixed)}
              style={tableStyle}
              selectionMode={selectionMode}
              selectionBehavior="toggle"
              disallowEmptySelection={selectionMode === 'single'}
              selectedKeys={selected}
              onSelectionChange={handleSelection}
              disabledKeys={disabled}
              disabledBehavior="selection"
              sortDescriptor={sort}
              onSortChange={(next) => {
                setSort(next)
                onSortChange?.(next)
                backToFirstPage()
              }}
              treeColumn={expandable ? EXPAND_KEY : undefined}
              expandedKeys={expandedKeys}
              defaultExpandedKeys={defaultExpandedKeys}
              onExpandedChange={onExpandedChange}
              onRowAction={onRowAction ? (key) => {
                const record = recordByKey.get(key)
                if (record) onRowAction(key, record)
              } : undefined}
            >
              <TableHeader>
                {expandable && (
                  <Column id={EXPAND_KEY} textValue={t.expandColumn} className={cx(styles.column, styles.control)}>
                    <span className={styles.srOnly}>{t.expandColumn}</span>
                  </Column>
                )}
                {hasSelection && (
                  <Column id={SELECT_KEY} textValue={t.selectColumn} className={cx(styles.column, styles.control)}>
                    {selectionMode === 'multiple'
                      ? <Checkbox slot="selection" />
                      : <span className={styles.srOnly}>{t.selectColumn}</span>}
                  </Column>
                )}
                {columns.map((column) => {
                  const label = columnText(column)
                  const sortable = column.sortable != null && column.sortable !== false
                  const searchable = column.searchable != null && column.searchable !== false
                  const hasMenus = column.filters != null || searchable
                  return (
                    <Column
                      key={column.key}
                      id={column.key}
                      textValue={label}
                      isRowHeader={column.key === rowHeaderKey}
                      allowsSorting={sortable}
                      // Sortable + menus: focus lands on the header (Enter sorts), Arrow Right reaches the buttons.
                      focusMode={sortable && hasMenus ? 'cell' : undefined}
                      className={cx(styles.column, alignClass(column.align), column.className)}
                      style={{ width: column.width, minWidth: column.minWidth }}
                    >
                      {({ sortDirection }) => (
                        <span className={styles.headerInner}>
                          <span className={cx(styles.headerTitle, column.ellipsis && styles.ellipsis)}>{column.title}</span>
                          {sortable && <SortIcon direction={sortDirection} />}
                          {column.filters != null && (
                            <FilterMenu
                              label={label}
                              options={column.filters}
                              multiple={column.filterMultiple !== false}
                              applied={filters[String(column.key)] ?? []}
                              onApply={(values) => setColumnFilter(column, values)}
                              defaultOpen={column.defaultFilterOpen}
                              t={t}
                            />
                          )}
                          {searchable && (
                            <SearchMenu
                              label={label}
                              placeholder={column.searchPlaceholder ?? t.searchPlaceholder}
                              applied={search[String(column.key)] ?? ''}
                              onApply={(query) => setColumnSearch(column, query)}
                              defaultOpen={column.defaultSearchOpen}
                              t={t}
                            />
                          )}
                        </span>
                      )}
                    </Column>
                  )
                })}
              </TableHeader>
              <TableBody
                className={styles.body}
                renderEmptyState={() => (
                  <div className={styles.empty}>{isLoading ? null : emptyContent ?? <Empty size="sm" description={t.empty} />}</div>
                )}
              >
                {keyed.map(({ record, index, key }) => {
                  const canExpand = expandable && (rowExpandable?.(record) ?? true)
                  const cells = columns.map((column) => {
                    const value = column.dataIndex != null ? record[column.dataIndex] : undefined
                    const content = column.render ? column.render(value, record, index) : (value as ReactNode)
                    const text = typeof content === 'string' || typeof content === 'number'
                      ? String(content)
                      : typeof value === 'string' || typeof value === 'number' ? String(value) : undefined
                    return { column, content, text }
                  })
                  const detailKey = `${DETAIL_PREFIX}${String(key)}`
                  const rowName = cells.find((cell) => cell.column.key === rowHeaderKey)?.text ?? String(key)
                  return (
                    <Row key={key} id={key} className={styles.row}>
                      {expandable && (
                        <Cell className={cx(styles.cell, styles.control)}>
                          {({ hasChildItems, isExpanded }) => hasChildItems && (
                            <AriaButton slot="chevron" className={styles.expand}>
                              {isExpanded ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
                            </AriaButton>
                          )}
                        </Cell>
                      )}
                      {hasSelection && (
                        <Cell className={cx(styles.cell, styles.control)}>
                          {selectionMode === 'multiple' ? <Checkbox slot="selection" /> : <SelectionRadio />}
                        </Cell>
                      )}
                      {/* No `id` on cells: static cell ids are not scoped per row and would collide. */}
                      {cells.map(({ column, content, text }) => (
                        <Cell
                          key={column.key}
                          textValue={text}
                          className={cx(
                            styles.cell,
                            alignClass(column.align),
                            sort?.column === column.key && styles.sorted,
                            column.className,
                          )}
                        >
                          {column.ellipsis
                            ? <span className={styles.ellipsis} title={text}>{content}</span>
                            : content}
                        </Cell>
                      ))}
                      {canExpand && (
                        // The detail row is a child row (treegrid level 2): focusable, never selectable.
                        <Row id={detailKey} isDisabled className={cx(styles.row, styles.detailRow)}>
                          <Cell colSpan={columnCount} className={styles.cell}>
                            {/* React Aria labels a row by its row-header cell id; the detail row has no
                                such cell, so this hidden name takes that id ("Chi tiết Phở bò"). */}
                            <span id={cellId(gridId, detailKey, rowHeaderKey)} className={styles.srOnly}>{t.detailRow(rowName)}</span>
                            {expandedRowRender(record)}
                          </Cell>
                        </Row>
                      )}
                    </Row>
                  )
                })}
              </TableBody>
            </AriaTable>
          </div>
          {isLoading && (
            // The spinner is only visual: the status region below announces loading.
            <div className={styles.loading} aria-hidden="true">
              <Spin />
            </div>
          )}
        </div>
        {/* Always mounted (and outside the busy region) so "loading" is announced. */}
        <div role="status" className={styles.srOnly}>{isLoading ? t.loading : ''}</div>
        {footerNode != null && <div className={styles.footer}>{footerNode}</div>}
        {!bordered && pagerNode}
      </div>
      {bordered && pagerNode}
    </div>
  )
}

/** Up / down carets; the active direction is accent (Figma Header Item "Sort"). */
function SortIcon({ direction }: { direction: SortDescriptor['direction'] | undefined }) {
  return (
    <svg className={styles.sortIcon} viewBox="0 0 8 12" aria-hidden="true">
      <path className={cx(direction === 'ascending' && styles.sortActive)} d="M4 0 8 5H0Z" />
      <path className={cx(direction === 'descending' && styles.sortActive)} d="M0 7h8l-4 5Z" />
    </svg>
  )
}

/**
 * Figma Row Control Type=Radio. React Aria gives the row's selection props
 * through the checkbox "selection" slot; this draws them as a real radio so
 * screen readers hear "nút chọn" (one row at a time).
 */
function SelectionRadio() {
  const slot = useSlottedContext(CheckboxContext, 'selection')
  const { isSelected = false, isDisabled = false, onChange, id, 'aria-label': label, 'aria-labelledby': labelledBy } = slot ?? {}
  const inputRef = useRef<HTMLInputElement>(null)
  // A radio only ever turns on; choosing another row turns this one off.
  const turnOn = () => { if (!isSelected) onChange?.(true) }
  const state: ToggleState = {
    isSelected,
    defaultSelected: false,
    setSelected: (next) => { if (next) turnOn() },
    toggle: turnOn,
  }
  const { labelProps, inputProps } = useCheckbox({ id, 'aria-label': label, 'aria-labelledby': labelledBy, isDisabled }, state, inputRef)
  const { focusProps, isFocusVisible } = useFocusRing()
  const { hoverProps, isHovered } = useHover({ isDisabled })
  return (
    <label
      {...mergeProps(labelProps, hoverProps)}
      className={cx(radioStyles.radio, styles.radioControl)}
      data-selected={isSelected || undefined}
      data-hovered={isHovered || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-disabled={isDisabled || undefined}
    >
      <input {...mergeProps(inputProps, focusProps)} type="radio" ref={inputRef} className={styles.srOnly} />
      <span className={radioStyles.circle} aria-hidden="true" />
    </label>
  )
}

interface MenuProps {
  label: string
  t: TableLabels
  defaultOpen?: boolean
}

/** Figma "Table Dropdown" Type=Filter: fc Dropdown with checks, "Đặt lại" / "Áp dụng" footer. */
function FilterMenu({ label, options, multiple, applied, onApply, defaultOpen = false, t }: MenuProps & {
  options: TableFilterOption[]
  multiple: boolean
  applied: Key[]
  onApply: (values: Key[]) => void
}) {
  const [isOpen, setOpen] = useState(defaultOpen)
  const [staged, setStaged] = useState<Set<Key>>(() => new Set(applied))
  const openChange = (next: boolean) => {
    if (next) setStaged(new Set(applied))
    setOpen(next)
  }
  const apply = (values: Key[]) => {
    onApply(values)
    setOpen(false)
  }
  return (
    <Dropdown
      items={options.map((option) => ({ key: option.value, label: option.label, textValue: option.textValue }))}
      selectionMode={multiple ? 'multiple' : 'single'}
      selectedKeys={staged}
      onSelectionChange={(next) => setStaged(next === 'all' ? new Set(options.map((option) => option.value)) : new Set(next))}
      isOpen={isOpen}
      onOpenChange={openChange}
      placement="bottom end"
      aria-label={t.filterMenu(label)}
      footer={(
        <>
          <Button variant="link" size="sm" isDisabled={staged.size === 0 && applied.length === 0} onPress={() => apply([])}>
            {t.filterReset}
          </Button>
          <Button variant="primary" size="sm" onPress={() => apply([...staged])}>{t.filterConfirm}</Button>
        </>
      )}
    >
      <AriaButton className={cx(styles.trigger, applied.length > 0 && styles.triggerActive)} aria-label={t.filter(label, applied.length)}>
        <FilterFunnel01 aria-hidden="true" />
      </AriaButton>
    </Dropdown>
  )
}

/** Figma "Table Dropdown" Type=Search: a search box with "Tìm" / "Đặt lại". */
function SearchMenu({ label, placeholder, applied, onApply, defaultOpen = false, t }: MenuProps & {
  placeholder: string
  applied: string
  onApply: (query: string) => void
}) {
  const [isOpen, setOpen] = useState(defaultOpen)
  const [text, setText] = useState(applied)
  const openChange = (next: boolean) => {
    if (next) setText(applied)
    setOpen(next)
  }
  const apply = (query: string) => {
    onApply(query.trim())
    setOpen(false)
  }
  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={openChange}
      placement="bottom end"
      showArrow={false}
      aria-label={t.search(label, '')}
      content={(
        <div className={styles.searchPanel}>
          <SearchField
            aria-label={t.searchField(label)}
            placeholder={placeholder}
            value={text}
            onChange={setText}
            onSubmit={apply}
            autoFocus
          />
          <div className={styles.searchActions}>
            <Button variant="primary" size="sm" iconStart={<SearchMd />} onPress={() => apply(text)}>{t.searchSubmit}</Button>
            <Button size="sm" isDisabled={!text && !applied} onPress={() => { setText(''); apply('') }}>{t.searchReset}</Button>
          </div>
        </div>
      )}
    >
      <AriaButton className={cx(styles.trigger, applied !== '' && styles.triggerActive)} aria-label={t.search(label, applied)}>
        <SearchMd aria-hidden="true" />
      </AriaButton>
    </Popover>
  )
}

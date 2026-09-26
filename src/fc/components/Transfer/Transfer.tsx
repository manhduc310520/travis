import { useId, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { Button as AriaButton, GridList, GridListItem, type Key, type Selection } from 'react-aria-components'
import { ChevronDown, ChevronLeft, ChevronRight, Trash01 } from '../../../icons'
import { cx } from '../../space'
import { Button } from '../Button/Button'
import { Checkbox } from '../Checkbox/Checkbox'
import { Dropdown, type DropdownItem } from '../Dropdown/Dropdown'
import { Empty } from '../Empty/Empty'
import { SearchField } from '../Input/SearchField'
import styles from './Transfer.module.css'

/** `left` = the source list, `right` = the target list. */
export type TransferDirection = 'left' | 'right'
/** Figma panel Status: Warning / Error (both lists' frames). */
export type TransferStatus = 'warning' | 'error'

export interface TransferItem {
  key: Key
  /** Row text; also what the search matches (accent-insensitive). */
  title: string
  /** Second line under the title. */
  description?: string
  /** Figma list item State=Disabled: shown, but can't be checked or moved. */
  isDisabled?: boolean
}

/** Every visible or announced string, overridable one by one. */
export interface TransferLabels {
  /** Name of the source list when it has no `titles[0]`. */
  source: string
  /** Name of the target list when it has no `titles[1]`. */
  target: string
  /** Header count, nothing checked: "12 mục". */
  count: (total: number) => string
  /** Header count with checked items: "3/12 mục". */
  countSelected: (selected: number, total: number) => string
  moveToRight: string
  moveToLeft: string
  /** Announced politely after a move. */
  moved: (count: number, direction: TransferDirection) => string
  /** Name of the header checkbox; the list name follows. */
  selectAll: (listName: string) => string
  /** Name of the header chevron menu; the list name follows. */
  selectionMenu: (listName: string) => string
  /** Header menu: check every item (of the current search). */
  selectAllItems: string
  /** Header menu: flip every item (of the current search). */
  selectInvert: string
  /** Header menu: uncheck everything. */
  selectNone: string
  searchPlaceholder: string
  /** Name of a list's search field; the list name follows. */
  search: (listName: string) => string
  /** `oneWay`: name of a row's remove button; the item title follows. */
  remove: (title: string) => string
  /** `oneWay`: header menu item on the target list. */
  removeAll: string
  /** Empty list. */
  empty: string
  /** The search matched nothing. */
  noResults: string
}

const LABELS: TransferLabels = {
  source: 'Danh sách nguồn',
  target: 'Danh sách đích',
  count: (total) => `${total} mục`,
  countSelected: (selected, total) => `${selected}/${total} mục`,
  moveToRight: 'Chuyển sang phải',
  moveToLeft: 'Chuyển sang trái',
  moved: (count) => `Đã chuyển ${count} mục`,
  selectAll: (listName) => `Chọn tất cả: ${listName}`,
  selectionMenu: (listName) => `Tùy chọn chọn mục: ${listName}`,
  selectAllItems: 'Chọn tất cả',
  selectInvert: 'Đảo chọn',
  selectNone: 'Bỏ chọn tất cả',
  searchPlaceholder: 'Tìm kiếm',
  search: (listName) => `Tìm trong ${listName}`,
  remove: (title) => `Xóa ${title}`,
  removeAll: 'Xóa tất cả',
  empty: 'Không có dữ liệu',
  noResults: 'Không tìm thấy kết quả',
}

export interface TransferRenderState {
  direction: TransferDirection
  isSelected: boolean
  isDisabled: boolean
}

export interface TransferProps<T extends TransferItem = TransferItem> {
  /** Every item, on either side. */
  dataSource: T[]
  /** Keys on the right (controlled). The right list keeps this order. */
  targetKeys?: Key[]
  /** Keys on the right at first render (uncontrolled). */
  defaultTargetKeys?: Key[]
  /** After a move: the new right-side keys, the direction and the keys moved. */
  onChange?: (targetKeys: Key[], direction: TransferDirection, movedKeys: Key[]) => void
  /** Keys checked at first render, on either side (Figma State=Selected). */
  defaultSelectedKeys?: Iterable<Key>
  /** Header title of each list (Figma header right-hand text). Also names the list. */
  titles?: [ReactNode?, ReactNode?]
  /** Figma `Transfer` Search=Yes: a search field above each list. */
  showSearch?: boolean
  /** Custom match. Default: title contains the query, ignoring case and Vietnamese accents. */
  filterOption?: (query: string, item: T, direction: TransferDirection) => boolean
  /** Figma panel `Footer`: content under each list (start-aligned on the left, end-aligned on the right). */
  footer?: (direction: TransferDirection) => ReactNode
  /**
   * One-way: only "Chuyển sang phải". Right rows have no checkbox but a
   * remove button; the right header menu offers "Xóa tất cả".
   */
  oneWay?: boolean
  /** Custom row content. Keep it non-interactive: the whole row toggles the item. */
  renderItem?: (item: T, state: TransferRenderState) => ReactNode
  /** Header checkbox + chevron menu. Default true. */
  showSelectAll?: boolean
  /** Figma panel Status. Visual only; say what is wrong in text nearby. */
  status?: TransferStatus
  /** Figma panel Disabled=Yes: both lists, searches and move buttons. */
  isDisabled?: boolean
  /** Width of each list. Default Component/Transfer/List-Width. */
  listWidth?: number | string
  /** Height of each list (header, search and footer included). Default Component/Transfer/List-Height. */
  listHeight?: number | string
  labels?: Partial<TransferLabels>
  className?: string
  style?: CSSProperties
}

/** Lower case, accents and đ folded: "Cà phê sữa đá" matches "ca phe sua da". */
const fold = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase()

const px = (v: number | string | undefined) => (typeof v === 'number' ? `${v}px` : v)

/**
 * Figma "❖ Transfer": two lists (React Aria `GridList`, checkbox selection)
 * with move buttons between them. Each list has a header (select-all
 * checkbox with indeterminate state, a chevron menu, "3/12 mục", the title),
 * an optional search and footer. Moves are announced politely
 * ("Đã chuyển 3 mục") and focus returns to the list the items left.
 */
export function Transfer<T extends TransferItem = TransferItem>({
  dataSource,
  targetKeys,
  defaultTargetKeys = [],
  onChange,
  defaultSelectedKeys,
  titles = [],
  showSearch = false,
  filterOption,
  footer,
  oneWay = false,
  renderItem,
  showSelectAll = true,
  status,
  isDisabled = false,
  listWidth,
  listHeight,
  labels,
  className,
  style,
}: TransferProps<T>) {
  const t = { ...LABELS, ...labels }
  const [innerTarget, setInnerTarget] = useState<Key[]>(defaultTargetKeys)
  const target = targetKeys ?? innerTarget
  const [selected, setSelected] = useState<Set<Key>>(() => new Set(defaultSelectedKeys ?? []))
  const [announcement, setAnnouncement] = useState<{ id: number; text: string } | null>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  const byKey = useMemo(() => new Map(dataSource.map((item) => [item.key, item])), [dataSource])
  const targetSet = useMemo(() => new Set(target), [target])
  const leftItems = useMemo(() => dataSource.filter((item) => !targetSet.has(item.key)), [dataSource, targetSet])
  const rightItems = useMemo(
    () => target.map((key) => byKey.get(key)).filter((item): item is T => item != null),
    [target, byKey],
  )

  const movable = (items: T[]) => items.filter((item) => !item.isDisabled && selected.has(item.key)).map((item) => item.key)
  const leftMovable = movable(leftItems)
  const rightMovable = movable(rightItems)

  const commit = (next: Key[], direction: TransferDirection, moved: Key[]) => {
    if (targetKeys === undefined) setInnerTarget(next)
    onChange?.(next, direction, moved)
    setAnnouncement((prev) => ({ id: (prev?.id ?? 0) + 1, text: t.moved(moved.length, direction) }))
  }

  const move = (direction: TransferDirection) => {
    const moved = direction === 'right' ? leftMovable : rightMovable
    if (!moved.length) return
    const movedSet = new Set(moved)
    const next = direction === 'right' ? [...target, ...moved] : target.filter((key) => !movedSet.has(key))
    setSelected((prev) => new Set([...prev].filter((key) => !movedSet.has(key))))
    commit(next, direction, moved)
    // The pressed button turns disabled; keep focus in the list the items left.
    const source = direction === 'right' ? leftRef : rightRef
    source.current?.focus()
  }

  const removeFromTarget = (keys: Key[]) => {
    if (!keys.length) return
    const keySet = new Set(keys)
    commit(target.filter((key) => !keySet.has(key)), 'left', keys)
    rightRef.current?.focus()
  }

  const rootStyle = {
    ...(listWidth != null && { '--_list-width': px(listWidth) }),
    ...(listHeight != null && { '--_list-height': px(listHeight) }),
    ...style,
  } as CSSProperties

  const panel = (direction: TransferDirection) => (
    <TransferPanel<T>
      direction={direction}
      listRef={direction === 'left' ? leftRef : rightRef}
      items={direction === 'left' ? leftItems : rightItems}
      title={titles[direction === 'left' ? 0 : 1]}
      fallbackName={direction === 'left' ? t.source : t.target}
      selected={selected}
      onSelectedChange={setSelected}
      removable={oneWay && direction === 'right'}
      onRemove={removeFromTarget}
      showSearch={showSearch}
      filterOption={filterOption}
      footer={footer?.(direction)}
      renderItem={renderItem}
      showSelectAll={showSelectAll}
      status={status}
      isDisabled={isDisabled}
      labels={t}
    />
  )

  return (
    <div className={cx(styles.transfer, className)} style={rootStyle}>
      {panel('left')}
      <div className={styles.operations}>
        <Button
          size="sm"
          iconStart={<ChevronRight />}
          aria-label={t.moveToRight}
          isDisabled={isDisabled || leftMovable.length === 0}
          onPress={() => move('right')}
        />
        {!oneWay && (
          <Button
            size="sm"
            iconStart={<ChevronLeft />}
            aria-label={t.moveToLeft}
            isDisabled={isDisabled || rightMovable.length === 0}
            onPress={() => move('left')}
          />
        )}
      </div>
      {panel('right')}
      <div role="status" className={styles.srOnly}>
        {announcement && <span key={announcement.id}>{announcement.text}</span>}
      </div>
    </div>
  )
}

interface TransferPanelProps<T extends TransferItem> {
  direction: TransferDirection
  listRef: RefObject<HTMLDivElement | null>
  items: T[]
  title: ReactNode
  fallbackName: string
  selected: Set<Key>
  onSelectedChange: (next: Set<Key>) => void
  removable: boolean
  onRemove: (keys: Key[]) => void
  showSearch: boolean
  filterOption?: (query: string, item: T, direction: TransferDirection) => boolean
  footer: ReactNode
  renderItem?: (item: T, state: TransferRenderState) => ReactNode
  showSelectAll: boolean
  status?: TransferStatus
  isDisabled: boolean
  labels: TransferLabels
}

/** Figma "Transfer / Transfer Panel": header, optional search, the list, optional footer. */
function TransferPanel<T extends TransferItem>({
  direction,
  listRef,
  items,
  title,
  fallbackName,
  selected,
  onSelectedChange,
  removable,
  onRemove,
  showSearch,
  filterOption,
  footer,
  renderItem,
  showSelectAll,
  status,
  isDisabled,
  labels: t,
}: TransferPanelProps<T>) {
  const [query, setQuery] = useState('')
  const titleId = useId()
  const listName = typeof title === 'string' ? title : fallbackName

  const visible = useMemo(() => {
    const q = query.trim()
    if (!q) return items
    const folded = fold(q)
    return items.filter((item) => (filterOption ? filterOption(q, item, direction) : fold(item.title).includes(folded)))
  }, [items, query, filterOption, direction])

  const selectable = !removable
  const enabledVisible = visible.filter((item) => !item.isDisabled).map((item) => item.key)
  const checkedVisible = enabledVisible.filter((key) => selected.has(key)).length
  const checkedTotal = selectable ? items.filter((item) => selected.has(item.key)).length : 0
  const allChecked = enabledVisible.length > 0 && checkedVisible === enabledVisible.length
  const someChecked = checkedVisible > 0 && !allChecked

  const setVisible = (on: boolean) => {
    const next = new Set(selected)
    for (const key of enabledVisible) {
      if (on) next.add(key)
      else next.delete(key)
    }
    onSelectedChange(next)
  }
  const invertVisible = () => {
    const next = new Set(selected)
    for (const key of enabledVisible) {
      if (next.has(key)) next.delete(key)
      else next.add(key)
    }
    onSelectedChange(next)
  }

  // GridList gets this side's keys; the other side's stay untouched in `selected`.
  const ownKeys = new Set(items.map((item) => item.key))
  const onGridSelection = (keys: Selection) => {
    const next = new Set([...selected].filter((key) => !ownKeys.has(key)))
    const picked = keys === 'all' ? enabledVisible : [...keys]
    for (const key of picked) next.add(key)
    onSelectedChange(next)
  }

  const menuItems: DropdownItem[] = removable
    ? [{ key: 'remove-all', label: t.removeAll, danger: true, isDisabled: items.length === 0 }]
    : [
        { key: 'all', label: t.selectAllItems, isDisabled: enabledVisible.length === 0 },
        { key: 'invert', label: t.selectInvert, isDisabled: enabledVisible.length === 0 },
        { key: 'none', label: t.selectNone, isDisabled: checkedTotal === 0 },
      ]
  const onMenuAction = (key: Key) => {
    if (key === 'all') setVisible(true)
    else if (key === 'invert') invertVisible()
    else if (key === 'none') onSelectedChange(new Set([...selected].filter((k) => !ownKeys.has(k))))
    else if (key === 'remove-all') onRemove(items.filter((item) => !item.isDisabled).map((item) => item.key))
  }

  const disabledKeys = isDisabled ? items.map((item) => item.key) : items.filter((item) => item.isDisabled).map((item) => item.key)

  return (
    <div
      className={cx(styles.panel, status && styles[status])}
      data-disabled={isDisabled || undefined}
    >
      <div className={styles.header}>
        <span className={styles.headerStart}>
          {showSelectAll && selectable && (
            <Checkbox
              aria-label={t.selectAll(listName)}
              isSelected={allChecked}
              isIndeterminate={someChecked}
              isDisabled={isDisabled || enabledVisible.length === 0}
              onChange={setVisible}
            />
          )}
          {showSelectAll && (
            <Dropdown items={menuItems} onAction={onMenuAction} aria-label={t.selectionMenu(listName)}>
              <Button
                variant="text"
                size="sm"
                className={styles.menuButton}
                iconStart={<ChevronDown />}
                aria-label={t.selectionMenu(listName)}
                isDisabled={isDisabled || items.length === 0}
              />
            </Dropdown>
          )}
          <span className={styles.count}>
            {checkedTotal > 0 ? t.countSelected(checkedTotal, items.length) : t.count(items.length)}
          </span>
        </span>
        {title != null && <span id={titleId} className={styles.title}>{title}</span>}
      </div>

      {showSearch && (
        <div className={styles.search}>
          <SearchField
            aria-label={t.search(listName)}
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={setQuery}
            isDisabled={isDisabled}
          />
        </div>
      )}

      <GridList
        ref={listRef}
        items={visible}
        aria-label={title != null ? undefined : listName}
        aria-labelledby={title != null ? titleId : undefined}
        selectionMode={selectable ? 'multiple' : 'none'}
        selectionBehavior="toggle"
        selectedKeys={selectable ? selected : undefined}
        onSelectionChange={selectable ? onGridSelection : undefined}
        disabledKeys={disabledKeys}
        // Rows are cached per item; re-render them when these change too.
        dependencies={[removable, renderItem, t]}
        className={styles.list}
        renderEmptyState={() => (
          <Empty size="sm" className={styles.empty} description={query.trim() ? t.noResults : t.empty} />
        )}
      >
        {(item) => (
          <GridListItem id={item.key} textValue={item.title} className={styles.item}>
            {({ isSelected, isDisabled: rowDisabled, selectionMode }) => (
              <>
                {selectionMode !== 'none' && <Checkbox slot="selection" />}
                <span className={styles.itemContent}>
                  {renderItem ? (
                    renderItem(item, { direction, isSelected, isDisabled: rowDisabled })
                  ) : (
                    <>
                      <span className={styles.itemTitle}>{item.title}</span>
                      {item.description != null && <span className={styles.itemDescription}>{item.description}</span>}
                    </>
                  )}
                </span>
                {removable && (
                  <AriaButton
                    className={styles.remove}
                    aria-label={t.remove(item.title)}
                    isDisabled={rowDisabled}
                    onPress={() => onRemove([item.key])}
                  >
                    <Trash01 />
                  </AriaButton>
                )}
              </>
            )}
          </GridListItem>
        )}
      </GridList>

      {footer != null && (
        <div className={cx(styles.footer, direction === 'right' && styles.footerEnd)}>{footer}</div>
      )}
    </div>
  )
}

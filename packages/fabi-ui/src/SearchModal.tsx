// SearchModal: the app's feature search, opened from the header search (user 2026-10-13). New because no
// component has a search field, grouped results with keyboard navigation and the key hints together; built from
// Modal + Input + Result + Button + Typography and the FABi icons. States as designed: hint (no query, no
// history) · history ("Gần đây") · results grouped by where they live · no result · loading.
// Keyboard: ↑ / ↓ move, Enter chooses, Esc closes. Screen readers get a combobox + listbox.
// SearchModal.Panel is the same content without the Modal (docs, or an inline search page).
import { Button, Flex, Grid, Input, Modal, Result, Spin, Typography, theme as antdTheme } from 'antd'
import type { InputRef } from 'antd'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { ChevronDownLine, ChevronUpLine, ClockLine, CornerDownLeftLine, SearchSmLine, XCircleLine } from './fabi-icons-provider.js'
import { useFabiLang } from './useFabiLang.js'

export interface SearchModalItem {
  key: string
  /** Text of the result; the search matches it */
  label: string
  /** More words that should find this item, e.g. "dish, product" */
  keywords?: string
  /** Content at the end of the row, e.g. a count */
  extra?: ReactNode
}

export interface SearchModalGroup {
  key: string
  /** Where the items live, e.g. ['Restaurants', 'Restaurant list'] (shown above them, and searched) */
  path: string[]
  items: SearchModalItem[]
}

export interface SearchModalPanelProps {
  /** Everything that can be found, grouped by where it lives */
  groups: SearchModalGroup[]
  /** Recent choices, shown while the field is empty (under "Recent") */
  history?: SearchModalItem[]
  /** Shows a "Clear history" button next to the history */
  onClearHistory?: () => void
  /** A result was chosen (click or Enter); the Modal closes after it */
  onSelect?: (item: SearchModalItem, group?: SearchModalGroup) => void
  /** Search text (controlled) */
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Results are being fetched (server search): shows a spinner instead of the list */
  loading?: boolean
  /** Custom match; default: the label, keywords and path contain the text, ignoring case and Vietnamese accents */
  filter?: (item: SearchModalItem, group: SearchModalGroup, query: string) => boolean
  placeholder?: string
  /** Focus the field on mount (default true) */
  autoFocus?: boolean
  /** Height of the panel (default 450, as designed; never taller than the screen) */
  height?: number
  /** Shows a close button next to the field on phones (< sm), where the key hints are hidden; SearchModal passes its onClose */
  onCancel?: () => void
  className?: string
  style?: CSSProperties
}

export interface SearchModalProps extends SearchModalPanelProps {
  open: boolean
  /** Esc, the mask, or after a choice */
  onClose?: () => void
  /** Width of the dialog (default 650, as designed; never wider than the screen) */
  width?: number
}

// built-in texts: Vietnamese by default, English with an English antd locale (useFabiLang)
const TEXTS = {
  vi: {
    placeholder: 'Tìm kiếm',
    dialog: 'Tìm kiếm tính năng',
    hint: 'Nhập từ khoá để tìm tính năng',
    example: 'Ví dụ: “Sản phẩm”',
    recent: 'Gần đây',
    clearHistory: 'Xoá lịch sử',
    clear: 'Xoá nội dung',
    noResult: 'Không tìm thấy kết quả',
    noResultHint: 'Vui lòng nhập từ khoá khác để tìm kiếm',
    close: 'Đóng lại',
    move: 'Di chuyển lên xuống',
    choose: 'Chọn',
    keys: 'Mũi tên lên, xuống để di chuyển, Enter để chọn, Esc để đóng',
    cancel: 'Đóng',
    searchingStatus: 'Đang tìm kiếm',
    count: (n: number) => `${n} kết quả`,
  },
  en: {
    placeholder: 'Search',
    dialog: 'Search features',
    hint: 'Type a keyword to find a feature',
    example: 'For example: “Products”',
    recent: 'Recent',
    clearHistory: 'Clear history',
    clear: 'Clear',
    noResult: 'No results found',
    noResultHint: 'Try another keyword',
    close: 'Close',
    move: 'Move up and down',
    choose: 'Select',
    keys: 'Up and down arrows to move, Enter to select, Esc to close',
    cancel: 'Close',
    searchingStatus: 'Searching',
    count: (n: number) => `${n} ${n === 1 ? 'result' : 'results'}`,
  },
}

/** Lower case without Vietnamese accents: "Hoá đơn" → "hoa don" */
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()

const defaultFilter = (item: SearchModalItem, group: SearchModalGroup, query: string) =>
  fold(`${item.label} ${item.keywords ?? ''} ${group.path.join(' ')}`).includes(fold(query.trim()))

type Option = { item: SearchModalItem; group?: SearchModalGroup }

/** Key hint of the footer: the design's disabled small Button as a keycap (decorative, the field describes the keys) */
function KeyHint({ children, icon }: { children?: ReactNode; icon?: ReactNode }) {
  return <Button size="small" disabled icon={icon} tabIndex={-1}>{children}</Button>
}

function SearchPanel({
  groups,
  history = [],
  onClearHistory,
  onSelect,
  value,
  defaultValue = '',
  onChange,
  loading = false,
  filter = defaultFilter,
  placeholder,
  autoFocus = true,
  height = 450,
  onCancel,
  className,
  style,
}: SearchModalPanelProps) {
  const TEXT = TEXTS[useFabiLang()]
  const { token } = antdTheme.useToken()
  const screens = Grid.useBreakpoint()
  const id = useId()
  const inputRef = useRef<InputRef>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [inner, setInner] = useState(defaultValue)
  const query = value ?? inner
  const searching = query.trim() !== ''
  const [active, setActive] = useState(0)

  // what the list shows: matching results by group while searching, else the history
  const shown = useMemo(() => {
    if (!searching) return []
    return groups.map((group) => ({ group, items: group.items.filter((item) => filter(item, group, query)) })).filter((g) => g.items.length > 0)
  }, [groups, query, searching, filter])
  const options: Option[] = searching ? shown.flatMap(({ group, items }) => items.map((item) => ({ item, group }))) : history.map((item) => ({ item }))
  const optionId = (i: number) => `${id}-option-${i}`
  const listId = `${id}-list`
  const current = Math.min(active, options.length - 1)
  // the listbox is on screen (not while loading): the field points at it only then
  const listed = !loading && options.length > 0

  useEffect(() => {
    setActive(0)
    if (listRef.current) listRef.current.scrollTop = 0
  }, [query])
  // screen readers hear how many results there are (debounced: not on every keystroke)
  const status = loading ? TEXT.searchingStatus : searching ? (options.length ? TEXT.count(options.length) : TEXT.noResult) : ''
  const [announced, setAnnounced] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setAnnounced(status), 500)
    return () => clearTimeout(t)
  }, [status])
  /** Keep a keyboard-chosen option visible by scrolling the listbox only (scrollIntoView would scroll the page too) */
  const reveal = (i: number) => {
    const list = listRef.current
    const el = document.getElementById(optionId(i))
    if (!list || !el) return
    const l = list.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    if (r.top < l.top) list.scrollTop -= l.top - r.top
    else if (r.bottom > l.bottom) list.scrollTop += r.bottom - l.bottom
  }
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const change = (next: string) => {
    if (value === undefined) setInner(next)
    onChange?.(next)
  }
  const choose = (i: number) => {
    const option = options[i]
    if (option) onSelect?.(option.item, option.group)
  }
  const keyDown = (e: KeyboardEvent) => {
    // IME composition: Enter commits the word and arrows pick a candidate (Safari sends keyCode 229 for that Enter)
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (!listed) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const step = e.key === 'ArrowDown' ? 1 : -1
      const next = (current + step + options.length) % options.length
      setActive(next)
      reveal(next)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(current)
    }
  }

  // one result row: 32px (controlHeight), indented 24px under its group title, radius 4
  const row = (option: Option, i: number) => {
    const isActive = i === current
    return (
      <Flex
        key={`${option.group?.key ?? 'history'}-${option.item.key}`}
        id={optionId(i)}
        role="option"
        aria-selected={isActive}
        align="center"
        gap="small"
        onMouseMove={() => i !== current && setActive(i)}
        onClick={() => choose(i)}
        style={{
          minHeight: token.controlHeight,
          paddingInlineStart: token.paddingLG,
          paddingInlineEnd: token.paddingSM,
          borderRadius: token.borderRadiusSM,
          background: isActive ? token.controlItemBgHover : undefined,
          cursor: 'pointer',
        }}
      >
        {!option.group && <ClockLine aria-hidden style={{ fontSize: token.fontSize, color: isActive ? token.colorText : token.colorTextTertiary }} />}
        <Typography.Text ellipsis style={{ flex: 1, minWidth: 0 }}>{option.item.label}</Typography.Text>
        {option.item.extra}
      </Flex>
    )
  }

  // group title: the path like a Breadcrumb ("Nhà hàng / Danh sách nhà hàng"). Plain text, not a Breadcrumb:
  // its navigation landmark and list would break the listbox for screen readers.
  const groupTitle = (group: SearchModalGroup, titleId: string) => (
    <Flex id={titleId} align="center" style={{ minHeight: token.controlHeight, color: token.colorTextSecondary }}>
      {group.path.map((part, i) => (
        <span key={part}>
          {i > 0 && <span aria-hidden style={{ marginInline: token.marginXS }}>/</span>}
          {part}
        </span>
      ))}
    </Flex>
  )

  let index = -1
  const centred = { flex: 1, minHeight: 0, padding: token.padding }
  const body = loading ? (
    <Flex align="center" justify="center" style={centred}><Spin /></Flex>
  ) : searching && options.length === 0 ? (
    <Flex align="center" justify="center" style={centred}>
      <Result
        icon={<SearchSmLine style={{ fontSize: 40, color: token.colorText }} />}
        title={<span style={{ fontSize: token.fontSizeHeading5 }}>{TEXT.noResult}</span>}
        subTitle={TEXT.noResultHint}
        style={{ padding: `0 ${token.paddingXL}px` }}
      />
    </Flex>
  ) : !searching && options.length === 0 ? (
    <Flex vertical align="center" justify="center" gap="small" style={centred}>
      <Typography.Text>{TEXT.hint}</Typography.Text>
      <Typography.Text type="secondary">{TEXT.example}</Typography.Text>
    </Flex>
  ) : (
    <Flex vertical style={{ flex: 1, minHeight: 0, paddingInline: token.padding }}>
      {!searching && (
        <Flex justify="space-between" align="center" style={{ minHeight: token.controlHeight, paddingInline: token.paddingSM, flex: 'none' }}>
          <Typography.Text type="secondary" id={`${id}-recent`}>{TEXT.recent}</Typography.Text>
          {onClearHistory && (
            <Button
              type="link"
              size="small"
              onClick={() => {
                onClearHistory()
                inputRef.current?.focus()
              }}
              style={{ paddingInline: 0 }}
            >
              {TEXT.clearHistory}
            </Button>
          )}
        </Flex>
      )}
      <div
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={searching ? TEXT.dialog : TEXT.recent}
        style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: token.paddingXS }}
      >
        {searching
          ? shown.map(({ group, items }) => {
              const titleId = `${id}-group-${group.key}`
              return (
                <div key={group.key} role="group" aria-labelledby={titleId}>
                  {groupTitle(group, titleId)}
                  {items.map((item) => row({ item, group }, ++index))}
                </div>
              )
            })
          : options.map((option) => row(option, ++index))}
      </div>
    </Flex>
  )

  return (
    <Flex
      vertical
      className={className}
      style={{ height, maxHeight: `calc(100vh - ${token.padding * 2}px)`, background: token.colorBgElevated, ...style }}
    >
      <Flex align="center" gap="small" style={{ padding: token.padding, flex: 'none' }}>
        <Input
          ref={inputRef}
          size="large"
          value={query}
          onChange={(e) => change(e.target.value)}
          onKeyDown={keyDown}
          placeholder={placeholder ?? TEXT.placeholder}
          prefix={<SearchSmLine />}
          allowClear={{ clearIcon: <XCircleLine title={TEXT.clear} style={{ color: token.colorText }} /> }}
          role="combobox"
          aria-label={TEXT.dialog}
          aria-expanded={listed}
          aria-controls={listed ? listId : undefined}
          aria-activedescendant={listed ? optionId(current) : undefined}
          aria-autocomplete="list"
          aria-describedby={`${id}-keys`}
          style={{ flex: 1, minWidth: 0 }}
        />
        {onCancel && screens.sm === false && (
          <Button type="text" size="large" onClick={onCancel}>{TEXT.cancel}</Button>
        )}
        <span id={`${id}-keys`} className="fabi-sr-only">{TEXT.keys}</span>
        <span role="status" className="fabi-sr-only">{announced}</span>
      </Flex>
      {body}
      {/* key hints only where there is room (≥ sm 576): phones are touch, the hints would wrap */}
      {screens.sm !== false && (
      <Flex
        aria-hidden
        justify="space-between"
        align="center"
        gap="small"
        wrap
        style={{ flex: 'none', padding: token.padding, borderTop: `${token.lineWidth}px solid ${token.colorBorderSecondary}` }}
      >
        <Flex align="center" gap="small">
          <KeyHint>ESC</KeyHint>
          <Typography.Text type="secondary">{TEXT.close}</Typography.Text>
        </Flex>
        <Flex align="center" gap="small">
          <KeyHint icon={<ChevronUpLine />} />
          <KeyHint icon={<ChevronDownLine />} />
          <Typography.Text type="secondary">{TEXT.move}</Typography.Text>
        </Flex>
        <Flex align="center" gap="small">
          <KeyHint icon={<CornerDownLeftLine />} />
          <Typography.Text type="secondary">{TEXT.choose}</Typography.Text>
        </Flex>
      </Flex>
      )}
    </Flex>
  )
}

function SearchModalRoot({ open, onClose, width = 650, onSelect, ...panel }: SearchModalProps) {
  const TEXT = TEXTS[useFabiLang()]
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      destroyOnHidden
      width={width}
      // the dialog's name for screen readers; the design shows no title
      title={<span className="fabi-sr-only">{TEXT.dialog}</span>}
      styles={{ container: { padding: 0, overflow: 'hidden' }, header: { margin: 0, padding: 0 }, body: { padding: 0 } }}
    >
      <SearchPanel
        {...panel}
        onCancel={onClose}
        onSelect={(item, group) => {
          onSelect?.(item, group)
          onClose?.()
        }}
      />
    </Modal>
  )
}

export const SearchModal = Object.assign(SearchModalRoot, { Panel: SearchPanel })

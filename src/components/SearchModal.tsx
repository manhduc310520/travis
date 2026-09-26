import { Fragment, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import {
  Autocomplete,
  Dialog,
  Header,
  Menu,
  MenuItem,
  MenuSection,
  Modal as AriaModal,
  ModalOverlay,
  type Key,
} from 'react-aria-components'
import { VisuallyHidden } from 'react-aria'
import { Button, SearchField, Text } from '../fc'
import { cx } from '../fc/space'
import { useOpenState, usePortalReady, type OpenStateProps } from '../fc/components/Modal/useOpenState'
import overlay from '../fc/overlay.module.css'
import list from '../fc/listItem.module.css'
import modal from '../fc/components/Modal/Modal.module.css'
import { ChevronDown, ChevronUp, Clock, CornerDownLeft, SearchSm } from '../icons'
import styles from './SearchModal.module.css'

/** One feature the modal can open (a row of the Figma "AutoComplete Menu Item"). */
export interface SearchModalItem {
  /** Passed to `onAction`. Unique across every group. */
  key: Key
  label: string
  /** Makes the row a link (React Aria / RouterProvider navigation). */
  href?: string
}

/** Features that live under one path, e.g. "Nhà hàng / Danh sách nhà hàng". */
export interface SearchModalGroup {
  key: Key
  /** Figma "Breadcrumb Title" above the group's rows. Searched as well as the item labels. */
  path: string[]
  items: SearchModalItem[]
}

/** Every visible or announced string, overridable one by one. */
export interface SearchModalLabels {
  /** Names the dialog and the search field for assistive tech. */
  title: string
  placeholder: string
  /** State=Default / Focused: first line of the hint. */
  hint: string
  /** State=Default / Focused: second line of the hint. */
  hintExample: string
  /** State=Empty. */
  emptyTitle: string
  emptyDescription: string
  /** State=History: list title. */
  recent: string
  /** State=History: the link-styled button on the right. */
  clearHistory: string
  /** Accessible name of the result list. */
  results: string
  /** Announced (politely) while typing. */
  resultCount: (count: number) => string
  /** Footer: text after each key cap. */
  closeHint: string
  moveHint: string
  selectHint: string
  /** Footer key caps: the visible "ESC" and the spoken names of the icon keys. */
  escKey: string
  upKey: string
  downKey: string
  enterKey: string
}

const LABELS: SearchModalLabels = {
  title: 'Tìm kiếm tính năng',
  placeholder: 'Tìm kiếm',
  hint: 'Nhập từ khoá để tìm tính năng',
  hintExample: 'Ví dụ: “Sản phẩm”',
  emptyTitle: 'Không tìm thấy kết quả',
  emptyDescription: 'Vui lòng nhập từ khóa khác để tìm kiếm',
  recent: 'Gần đây',
  clearHistory: 'Xoá lịch sử',
  results: 'Kết quả tìm kiếm',
  resultCount: (count) => `${count} kết quả`,
  closeHint: 'Đóng lại',
  moveHint: 'Di chuyển lên xuống',
  selectHint: 'Chọn',
  escKey: 'ESC',
  upKey: 'Mũi tên lên',
  downKey: 'Mũi tên xuống',
  enterKey: 'Enter',
}

interface SearchPanelProps {
  /** Searchable features, shown grouped by `path` once something is typed. */
  groups: SearchModalGroup[]
  /**
   * Recently opened features (Figma State=History), shown while the field is
   * empty. Without any, the field-empty state is the Default hint.
   */
  history?: SearchModalItem[]
  /** Adds "Xoá lịch sử". Update `history` in response; focus returns to the field. */
  onClearHistory?: () => void
  /** A result or history row was chosen (Enter or click). The modal then closes. */
  onAction?: (key: Key) => void
  /** Search text (controlled). */
  inputValue?: string
  /** Search text each time the modal opens (uncontrolled). */
  defaultInputValue?: string
  onInputChange?: (value: string) => void
  labels?: Partial<SearchModalLabels>
}

export interface SearchModalProps extends OpenStateProps, SearchPanelProps {
  /** Close when the mask is clicked. Esc always closes. */
  isDismissable?: boolean
  className?: string
}

/**
 * Vietnamese-friendly folding: lower case, no tone marks or diacritics,
 * "đ" → "d". "nha hang" then matches "Nhà hàng".
 */
const fold = (text: string) => text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd')

interface IndexedGroup extends SearchModalGroup {
  folded: { item: SearchModalItem; text: string }[]
}

/** Every typed word must appear in the item's path + label. Groups with no match drop out. */
function filterGroups(index: IndexedGroup[], query: string): SearchModalGroup[] {
  const words = fold(query).split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  return index.flatMap(({ folded, ...group }) => {
    const items = folded.filter(({ text }) => words.every((word) => text.includes(word))).map(({ item }) => item)
    return items.length > 0 ? [{ ...group, items }] : []
  })
}

type View = 'hint' | 'history' | 'results' | 'empty'

/** Head (search field) + Content (hint, history, results or empty) + Footer (key legend). */
function SearchPanel({
  groups,
  history = [],
  onClearHistory,
  onAction,
  inputValue,
  defaultInputValue = '',
  onInputChange,
  t,
  onClose,
}: Omit<SearchPanelProps, 'labels'> & { t: SearchModalLabels; onClose: () => void }) {
  const [uncontrolled, setUncontrolled] = useState(defaultInputValue)
  const query = inputValue ?? uncontrolled
  const setQuery = (value: string) => {
    if (inputValue === undefined) setUncontrolled(value)
    onInputChange?.(value)
  }

  const index = useMemo<IndexedGroup[]>(
    () => groups.map((group) => {
      const path = fold(group.path.join(' '))
      return { ...group, folded: group.items.map((item) => ({ item, text: `${path} ${fold(item.label)}` })) }
    }),
    [groups],
  )
  const trimmed = query.trim()
  const results = useMemo(() => filterGroups(index, trimmed), [index, trimmed])
  const count = results.reduce((sum, group) => sum + group.items.length, 0)

  let view: View
  if (trimmed) view = count > 0 ? 'results' : 'empty'
  else view = history.length > 0 ? 'history' : 'hint'

  // Opened with text already in the field: highlight the first result, as
  // typing it would have (Figma State=Filled). Typing does this by itself.
  const [openedWithQuery] = useState(trimmed !== '')
  const headRef = useRef<HTMLDivElement>(null)
  const recentId = useId()

  const choose = (key: Key) => {
    onAction?.(key)
    onClose()
  }

  // The footer promises "ESC Đóng lại": close at once, even with text in the
  // field (a plain search field would clear it first). The × button clears.
  const closeOnEscape = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || e.nativeEvent.isComposing) return
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  const clearHistory = () => {
    onClearHistory?.()
    headRef.current?.querySelector('input')?.focus()
  }

  return (
    <Autocomplete inputValue={query} onInputChange={setQuery}>
      <div ref={headRef} className={styles.head} onKeyDownCapture={closeOnEscape}>
        <SearchField
          size="lg"
          value={query}
          aria-label={t.title}
          placeholder={t.placeholder}
          autoFocus
          className={styles.field}
        />
      </div>

      <div className={styles.content}>
        {view === 'history' && (
          <div className={styles.recent}>
            <Text id={recentId} tone="secondary">{t.recent}</Text>
            {onClearHistory && (
              <Button variant="link" size="sm" className={styles.clearHistory} onPress={clearHistory}>
                {t.clearHistory}
              </Button>
            )}
          </div>
        )}

        {/* One Menu for History and results, so it stays mounted while the view switches. */}
        {(view === 'history' || view === 'results') && (
          <Menu
            aria-label={view === 'results' ? t.results : undefined}
            aria-labelledby={view === 'history' ? recentId : undefined}
            autoFocus={openedWithQuery ? 'first' : undefined}
            onAction={choose}
            className={cx(list.list, styles.menu)}
          >
            {view === 'history'
              ? history.map((item) => (
                <MenuItem
                  key={`history:${String(item.key)}`}
                  id={item.key}
                  textValue={item.label}
                  href={item.href}
                  className={cx(list.item, styles.item)}
                >
                  <span className={cx(list.icon, styles.itemIcon)}><Clock /></span>
                  <span className={list.label}>{item.label}</span>
                </MenuItem>
              ))
              : results.map((group) => (
                <MenuSection key={`group:${String(group.key)}`} className={styles.group}>
                  <Header className={styles.path}>
                    {group.path.map((segment, i) => (
                      <Fragment key={i}>
                        {i > 0 && <span className={styles.separator}>/</span>}
                        <span>{segment}</span>
                      </Fragment>
                    ))}
                  </Header>
                  {group.items.map((item) => (
                    <MenuItem
                      key={String(item.key)}
                      id={item.key}
                      textValue={item.label}
                      href={item.href}
                      className={cx(list.item, styles.item)}
                    >
                      <span className={list.label}>{item.label}</span>
                    </MenuItem>
                  ))}
                </MenuSection>
              ))}
          </Menu>
        )}

        {view === 'hint' && (
          <div className={cx(styles.state, styles.hint)}>
            <Text strong>{t.hint}</Text>
            <Text tone="secondary">{t.hintExample}</Text>
          </div>
        )}

        {view === 'empty' && (
          <div className={cx(styles.state, styles.empty)}>
            <SearchSm className={styles.emptyIcon} />
            <div className={styles.emptyText}>
              <p className={styles.emptyTitle}>{t.emptyTitle}</p>
              <Text tone="secondary">{t.emptyDescription}</Text>
            </div>
          </div>
        )}
      </div>

      <VisuallyHidden role="status">
        {view === 'results' ? t.resultCount(count) : view === 'empty' ? t.emptyTitle : ''}
      </VisuallyHidden>

      <div className={styles.footer}>
        <Shortcut label={t.closeHint}>
          <kbd className={styles.keycap}>{t.escKey}</kbd>
        </Shortcut>
        <Shortcut label={t.moveHint}>
          <IconKey name={t.upKey} icon={<ChevronUp />} />
          <IconKey name={t.downKey} icon={<ChevronDown />} />
        </Shortcut>
        <Shortcut label={t.selectHint}>
          <IconKey name={t.enterKey} icon={<CornerDownLeft />} />
        </Shortcut>
      </div>
    </Autocomplete>
  )
}

/** Footer entry: key cap(s) + what the key does (Text / Type=Secondary). */
function Shortcut({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className={styles.shortcut}>
      {children}
      <Text tone="secondary">{label}</Text>
    </span>
  )
}

/** Square key cap with an icon; the key's name is read out instead of the icon. */
function IconKey({ name, icon }: { name: string; icon: ReactNode }) {
  return (
    <kbd className={cx(styles.keycap, styles.iconKey)}>
      {icon}
      <VisuallyHidden>{name}</VisuallyHidden>
    </kbd>
  )
}

/**
 * Figma "Search Modal" (component set 27702:145661): a command-palette dialog
 * for finding a feature. 650 × 450, Elevated surface, radius 8, Shadow/Base,
 * over the Modal mask. Head = Input Large with search icon and clear button;
 * Content = one of the Figma states; Footer = key legend
 * ("ESC Đóng lại · ↑ ↓ Di chuyển lên xuống · ↵ Chọn").
 *
 * States, chosen from the text and the data:
 * - empty field, no `history` → State=Default / Focused (hint);
 * - empty field with `history` → State=History ("Gần đây", "Xoá lịch sử");
 * - text with matches → State=Typing / Filled (rows grouped under their path);
 * - text without matches → State=Empty.
 *
 * Filtering matches item label and group path, ignoring case and Vietnamese
 * diacritics ("nha hang" finds "Nhà hàng"); every word must match.
 *
 * Built on React Aria `Autocomplete` + `SearchField` + `Menu` inside
 * `ModalOverlay` / `Modal` / `Dialog`: focus stays in the field while ↑ / ↓
 * move a virtual highlight across all groups (the first row is highlighted as
 * you type), Enter runs `onAction` and closes, Esc closes. Control it with
 * `isOpen` / `onOpenChange`, or place it in a `ModalTrigger` after its trigger.
 */
export function SearchModal({
  isOpen,
  defaultOpen,
  onOpenChange,
  isDismissable = true,
  className,
  labels,
  ...panel
}: SearchModalProps) {
  const [open, setOpen] = useOpenState({ isOpen, defaultOpen, onOpenChange })
  const portalReady = usePortalReady()
  if (!portalReady) return null
  const t = { ...LABELS, ...labels }

  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={setOpen}
      isDismissable={isDismissable}
      className={modal.mask}
    >
      <AriaModal className={cx(overlay.surface, modal.modal, styles.modal, className)}>
        <Dialog aria-label={t.title} className={cx(modal.dialog, styles.dialog)}>
          <SearchPanel {...panel} t={t} onClose={() => setOpen(false)} />
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  )
}

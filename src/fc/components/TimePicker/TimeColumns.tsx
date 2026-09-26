import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ListBox, ListBoxItem, type Key } from 'react-aria-components'
import { useDateFormatter, useLocale } from 'react-aria'
import { Time } from '@internationalized/date'
import { cx } from '../../space'
import list from '../../listItem.module.css'
import {
  TIME_COLUMN_LABELS,
  isHourDisabled,
  isMinuteDisabled,
  isSecondDisabled,
  pad2,
  snapToEnabled,
  stepRange,
  type TimeColumnLabels,
  type TimeConstraints,
} from './time'
import styles from './TimeColumns.module.css'

export interface TimeColumnsProps extends TimeConstraints {
  /** Picked time; `null` = nothing picked yet (no row highlighted). */
  value: Time | null
  /** Every pick: arrow keys, click, tap, type-ahead. */
  onChange: (value: Time) => void
  /** Enter on a row: pick it and confirm (the TimePicker commits and closes). */
  onConfirm?: (value: Time) => void
  /** Time the first pick builds on while `value` is null (React Aria `placeholderValue`). @default 00:00:00 */
  placeholderValue?: Time
  /** 12 adds an SA / CH column. By default the locale decides (vi-VN: 24). */
  hourCycle?: 12 | 24
  /** Focus the selected row of the first column on mount (inside a popover). */
  autoFocus?: boolean
  labels?: Partial<TimeColumnLabels>
  className?: string
}

interface Cell { key: Key; text: string; isDisabled: boolean }
interface ColumnDef { unit: string; label: string; selected: Key | null; cells: Cell[]; apply: (key: Key) => Time }

/**
 * Figma "TimePicker Menu" panel: one scrolling column per unit (hours /
 * minutes / seconds, + SA / CH on a 12-hour clock), divided by hairlines.
 * Each column is a React Aria ListBox — ↑ / ↓ move and pick (selection
 * follows focus), ← / → or Tab switch column, Enter confirms. The picked row
 * scrolls to the top of its column.
 *
 * Self-contained so DatePicker's date + time mode can put it next to its
 * calendar.
 */
export function TimeColumns({ value, onChange, onConfirm, placeholderValue, hourCycle, autoFocus, labels, className, ...constraints }: TimeColumnsProps) {
  const text = { ...TIME_COLUMN_LABELS, ...labels }
  const { direction } = useLocale()
  const probe = useDateFormatter({ hour: 'numeric', hourCycle: hourCycle === 12 ? 'h12' : hourCycle === 24 ? 'h23' : undefined })
  const periodFormat = useDateFormatter({ hour: 'numeric', hourCycle: 'h12' })
  const is12 = hourCycle != null ? hourCycle === 12 : Boolean(probe.resolvedOptions().hour12)
  const c = constraints
  const g = c.granularity ?? 'minute'
  const base = value ?? placeholderValue ?? new Time()
  const pm = base.hour >= 12
  const hours = stepRange(24, c.hourStep)

  const columns: ColumnDef[] = [
    {
      unit: 'hour',
      label: text.hour,
      selected: value?.hour ?? null,
      cells: hours.filter((h) => !is12 || h >= 12 === pm).map((h) => ({ key: h, text: pad2(is12 ? h % 12 || 12 : h), isDisabled: isHourDisabled(h, c) })),
      apply: (k) => base.set({ hour: Number(k) }),
    },
  ]
  if (g !== 'hour') {
    columns.push({
      unit: 'minute',
      label: text.minute,
      selected: value?.minute ?? null,
      cells: stepRange(60, c.minuteStep).map((m) => ({ key: m, text: pad2(m), isDisabled: isMinuteDisabled(base.hour, m, c) })),
      apply: (k) => base.set({ minute: Number(k) }),
    })
  }
  if (g === 'second') {
    columns.push({
      unit: 'second',
      label: text.second,
      selected: value?.second ?? null,
      cells: stepRange(60, c.secondStep).map((s) => ({ key: s, text: pad2(s), isDisabled: isSecondDisabled(base.hour, base.minute, s, c) })),
      apply: (k) => base.set({ second: Number(k) }),
    })
  }
  if (is12) {
    const periodName = (isPm: boolean) =>
      periodFormat.formatToParts(new Date(2000, 0, 1, isPm ? 13 : 1)).find((p) => p.type === 'dayPeriod')?.value ?? (isPm ? 'PM' : 'AM')
    const allDisabled = (isPm: boolean) => hours.filter((h) => h >= 12 === isPm).every((h) => isHourDisabled(h, c))
    columns.push({
      unit: 'dayPeriod',
      label: text.dayPeriod,
      selected: value ? (pm ? 'pm' : 'am') : null,
      cells: [
        { key: 'am', text: periodName(false), isDisabled: allDisabled(false) },
        { key: 'pm', text: periodName(true), isDisabled: allDisabled(true) },
      ],
      apply: (k) => ((k === 'pm') === pm ? base : base.set({ hour: (base.hour + 12) % 24 })),
    })
  }

  const pick = (column: ColumnDef, key: Key) => snapToEnabled(column.apply(key), c)

  const onKeyDownCapture = (e: KeyboardEvent<HTMLDivElement>) => {
    // Enter on a row: pick it and confirm. Caught before the row's own press handler.
    if (e.key !== 'Enter' || !onConfirm) return
    const target = e.target as HTMLElement
    const index = Array.from(e.currentTarget.querySelectorAll('[role="listbox"]')).findIndex((el) => el.contains(target))
    const cell = columns[index]?.cells.find((x) => String(x.key) === target.dataset.key)
    if (!cell || cell.isDisabled) return
    e.preventDefault()
    e.stopPropagation()
    onConfirm(pick(columns[index], cell.key))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // ← / → move between columns (a vertical ListBox leaves them unhandled).
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const boxes = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="listbox"]'))
    const index = boxes.findIndex((el) => el.contains(e.target as Node))
    const forward = (e.key === 'ArrowRight') === (direction === 'ltr')
    const next = boxes[index + (forward ? 1 : -1)]
    if (index < 0 || !next) return
    e.preventDefault()
    next.focus()
  }

  return (
    // Keyboard handlers only route keys that bubble out of the ListBoxes.
    <div className={cx(styles.panel, className)} onKeyDownCapture={onKeyDownCapture} onKeyDown={onKeyDown}>
      {columns.map((column, i) => (
        <Column key={column.unit} column={column} autoFocus={autoFocus && i === 0} onPick={(k) => onChange(pick(column, k))} />
      ))}
    </div>
  )
}

/**
 * Moves `key`'s row to the top of the column (the spacer after the last row
 * lets every row get there). Returns false while the row is not rendered yet.
 */
function scrollToKey(listEl: HTMLElement | null, key: Key | null, smooth: boolean) {
  if (!listEl) return false
  if (key == null) return true
  const row = listEl.querySelector<HTMLElement>(`[data-key="${String(key)}"]`)
  if (!row) return false
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  listEl.scrollTo({ top: row.offsetTop, behavior: smooth && !reduce ? 'smooth' : 'auto' })
  return true
}

function Column({ column, autoFocus, onPick }: { column: ColumnDef; autoFocus?: boolean; onPick: (key: Key) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [initial] = useState(column.selected)
  const placed = useRef(false)
  const mounted = useRef(false)

  // Opening: jump before paint. React Aria renders the rows in a second pass
  // of its own, so the jump happens when the picked row's element attaches.
  const placeRow = useCallback((row: HTMLDivElement | null) => {
    if (!(row instanceof HTMLElement) || placed.current) return
    placed.current = scrollToKey(row.closest<HTMLElement>('[role="listbox"]'), initial, false)
  }, [initial])
  // Later picks: glide, after React Aria has scrolled the focused row into
  // view (child effects run first).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    scrollToKey(ref.current, column.selected, true)
  }, [column.selected])

  return (
    <ListBox
      ref={ref}
      aria-label={column.label}
      selectionMode="single"
      selectionBehavior="replace"
      disallowEmptySelection
      escapeKeyBehavior="none"
      autoFocus={autoFocus}
      selectedKeys={column.selected != null ? [column.selected] : []}
      onSelectionChange={(keys) => {
        if (keys === 'all') return
        const [key] = Array.from(keys)
        if (key != null && key !== column.selected) onPick(key)
      }}
      className={styles.column}
    >
      {column.cells.map((cell) => (
        <ListBoxItem
          key={String(cell.key)}
          ref={cell.key === initial ? placeRow : undefined}
          id={cell.key}
          textValue={cell.text}
          isDisabled={cell.isDisabled}
          className={cx(list.item, styles.cell)}
        >
          {cell.text}
        </ListBoxItem>
      ))}
    </ListBox>
  )
}

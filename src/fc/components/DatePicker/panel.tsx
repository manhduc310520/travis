import { useContext, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import {
  Button as AriaButton,
  CalendarCell,
  CalendarGrid,
  CalendarStateContext,
  RangeCalendarStateContext,
  type CalendarCellRenderProps,
  type RangeValue,
} from 'react-aria-components'
import { useDateFormatter, useLocale } from 'react-aria'
import { CalendarDate, getLocalTimeZone, isSameMonth, isSameYear, startOfWeek, today, type DateDuration } from '@internationalized/date'
import { ChevronLeft, ChevronLeftDouble, ChevronRight, ChevronRightDouble } from '../../../icons'
import { cx } from '../../space'
import { decadeStart, FIRST_DAY_OF_WEEK, isoWeek, resolvePreset, type DatePreset, type PeriodUnit } from './dates'
import styles from './panel.module.css'

/*
 * Panel parts shared by DatePicker (the popover) and Calendar (card and full
 * page): Figma "DatePicker Menu" header, "DatePicker / DatePicker / Menu Item"
 * (the 24px day / month / year cell), "Cell Week", "Preset".
 */

function NavButton({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  // slot={null}: inside a React Aria Calendar only its own previous / next buttons may take the button context.
  return (
    <AriaButton slot={null} aria-label={label} onPress={onPress} className={styles.nav}>
      {children}
    </AriaButton>
  )
}

export interface PanelHeaderProps {
  title: ReactNode
  /** « / »: one year (day and month views) or one decade (year view). */
  superStep?: { prevLabel: string; nextLabel: string; onPrev: () => void; onNext: () => void }
  /** ‹ / ›: the React Aria calendar's own previous / next month buttons (day view only). */
  monthStep?: boolean
  /** Two panels side by side (range): the left header keeps the start controls, the right one the end controls. */
  side?: 'start' | 'end'
}

/** Figma DatePicker Menu "Header": « ‹ title › », 40px, hairline under it. */
export function PanelHeader({ title, superStep, monthStep = false, side }: PanelHeaderProps) {
  const start = side !== 'end'
  const end = side !== 'start'
  return (
    <div className={styles.header}>
      <span className={styles.navStart}>
        {start && superStep && <NavButton label={superStep.prevLabel} onPress={superStep.onPrev}><ChevronLeftDouble /></NavButton>}
        {start && monthStep && <AriaButton slot="previous" className={styles.nav}><ChevronLeft /></AriaButton>}
      </span>
      <span className={styles.title}>{title}</span>
      <span className={styles.navEnd}>
        {end && monthStep && <AriaButton slot="next" className={styles.nav}><ChevronRight /></AriaButton>}
        {end && superStep && <NavButton label={superStep.nextLabel} onPress={superStep.onNext}><ChevronRightDouble /></NavButton>}
      </span>
    </div>
  )
}

/** A header title that opens the month or year view ("Tháng 9", "2026"). */
export function TitleButton({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  return (
    <AriaButton slot={null} aria-label={label} onPress={onPress} className={styles.titleButton}>
      {children}
    </AriaButton>
  )
}

export interface DayGridProps {
  /** The second month of a two-month range panel: `{ months: 1 }`. */
  offset?: DateDuration
  /** Figma "Calendar / Show Week": ISO week numbers in a first column. */
  showWeek?: boolean
  className?: string
  /** Class of each day (the React Aria cell button). Replaces the 24px panel cell. */
  cellClassName?: string
  /** Class of the week-number cells. */
  weekClassName?: string
  /** Content of each day. Defaults to the day number in the 24px cell. */
  renderCell?: (date: CalendarDate, state: CalendarCellRenderProps) => ReactNode
}

/**
 * The days of one month inside a React Aria `Calendar` / `RangeCalendar`:
 * weekday row "T2"…"CN" (Monday first), always six weeks so the panel keeps
 * its height, optional week-number column.
 */
export function DayGrid({ offset, showWeek = false, className, cellClassName, weekClassName, renderCell }: DayGridProps) {
  const single = useContext(CalendarStateContext)
  const range = useContext(RangeCalendarStateContext)
  const state = single ?? range
  const { locale } = useLocale()
  const weekday = useDateFormatter({ weekday: 'narrow', timeZone: state?.timeZone })
  if (!state) return null

  const start = offset ? state.visibleRange.start.add(offset) : state.visibleRange.start
  const firstDay = startOfWeek(start, locale, FIRST_DAY_OF_WEEK)

  return (
    <CalendarGrid offset={offset} className={cx(styles.grid, range && styles.rangeGrid, range?.anchorDate != null && styles.previewing, className)}>
      {/* Hidden from assistive tech like React Aria's own header: every day's label already names its weekday. */}
      <thead aria-hidden="true">
        <tr>
          {showWeek && <th className={styles.weekHead} />}
          {Array.from({ length: 7 }, (_, i) => (
            <th key={i} className={styles.weekday}>{weekday.format(firstDay.add({ days: i }).toDate(state.timeZone))}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }, (_, week) => {
          const days = state.getDatesInWeek(week, start)
          const monday = days.find((d) => d != null)
          return (
            <tr key={week}>
              {showWeek && <td aria-hidden="true" className={weekClassName ?? styles.weekNumber}>{monday ? isoWeek(monday) : null}</td>}
              {days.map((date, i) =>
                date ? (
                  <CalendarCell key={i} date={date} className={cellClassName ?? styles.cell}>
                    {(cell) => (renderCell ? renderCell(date, cell) : <span className={styles.inner}>{cell.formattedDate}</span>)}
                  </CalendarCell>
                ) : (
                  <td key={i} />
                ),
              )}
            </tr>
          )
        })}
      </tbody>
    </CalendarGrid>
  )
}

export interface PeriodGridProps {
  unit: PeriodUnit
  /** Any day in the page shown: its year (month grid) or its decade (year grid). */
  page: CalendarDate
  onPageChange: (page: CalendarDate) => void
  /** Whether a period (given by its first day) is the selected value. */
  isSelected?: (first: CalendarDate) => boolean
  /** Range pickers: the band from `start` to `end` (first days). */
  range?: RangeValue<CalendarDate> | null
  /** The band is a preview (first click → hovered period), drawn lighter and not announced as selected. */
  isPreview?: boolean
  isDisabled?: (first: CalendarDate) => boolean
  onSelect: (first: CalendarDate) => void
  onHover?: (first: CalendarDate) => void
  /** Move focus into the grid on mount (popovers). */
  autoFocus?: boolean
  'aria-label': string
  className?: string
  /** Class of each cell button. Replaces the compact panel cell. */
  cellClassName?: string
  /** Content of each cell. Defaults to the month / year name in the compact cell. */
  renderCell?: (first: CalendarDate, label: string) => ReactNode
}

const COLUMNS = 3

function pageCells(unit: PeriodUnit, page: CalendarDate) {
  if (unit === 'month') return Array.from({ length: 12 }, (_, i) => ({ date: new CalendarDate(page.year, i + 1, 1), outside: false }))
  const first = decadeStart(page.year) - 1
  // A decade plus the year before and after it, dimmed (Figma Year menu: 2019 … 2030).
  return Array.from({ length: 12 }, (_, i) => ({ date: new CalendarDate(first + i, 1, 1), outside: i === 0 || i === 11 }))
}

const inPage = (date: CalendarDate, unit: PeriodUnit, page: CalendarDate) =>
  unit === 'month' ? date.year === page.year : decadeStart(date.year) === decadeStart(page.year)

/**
 * 3 × 4 grid of months (a year) or years (a decade). Arrow keys move one cell,
 * ↑ ↓ one row, Page Up / Page Down one page, Home / End to the page ends;
 * moving past the page turns it. Enter / Space picks.
 */
export function PeriodGrid({
  unit, page, onPageChange, isSelected, range, isPreview = false, isDisabled, onSelect, onHover, autoFocus = false,
  'aria-label': ariaLabel, className, cellClassName, renderCell,
}: PeriodGridProps) {
  const timeZone = getLocalTimeZone()
  const now = today(timeZone)
  const monthName = useDateFormatter({ month: 'long', timeZone })
  const cells = pageCells(unit, page)
  const [focused, setFocused] = useState<CalendarDate>(
    () => cells.find((c) => !c.outside && isSelected?.(c.date))?.date ?? cells.find((c) => !c.outside && (unit === 'month' ? isSameMonth(c.date, now) : isSameYear(c.date, now)))?.date ?? cells.find((c) => !c.outside)!.date,
  )
  // Keep the roving tab stop on the page shown (the header's « / » turn pages without moving focus).
  const current = cells.some((c) => c.date.compare(focused) === 0)
    ? focused
    : unit === 'month' ? focused.set({ year: page.year }) : new CalendarDate(decadeStart(page.year) + (((focused.year % 10) + 10) % 10), 1, 1)

  const focusRef = useRef<HTMLButtonElement>(null)
  const pendingFocus = useRef(autoFocus)
  useEffect(() => {
    if (!pendingFocus.current) return
    pendingFocus.current = false
    focusRef.current?.focus({ preventScroll: true })
  })

  const moveTo = (next: CalendarDate) => {
    setFocused(next)
    pendingFocus.current = true
    if (!inPage(next, unit, page)) onPageChange(next)
  }
  const step = (n: number) => moveTo(unit === 'month' ? current.add({ months: n }) : current.add({ years: n }))
  const onKeyDown = (e: KeyboardEvent) => {
    const core = cells.filter((c) => !c.outside)
    switch (e.key) {
      case 'ArrowLeft': step(-1); break
      case 'ArrowRight': step(1); break
      case 'ArrowUp': step(-COLUMNS); break
      case 'ArrowDown': step(COLUMNS); break
      case 'PageUp': step(unit === 'month' ? -12 : -10); break
      case 'PageDown': step(unit === 'month' ? 12 : 10); break
      case 'Home': moveTo(core[0].date); break
      case 'End': moveTo(core[core.length - 1].date); break
      default: return
    }
    e.preventDefault()
  }

  const rows = Array.from({ length: cells.length / COLUMNS }, (_, r) => cells.slice(r * COLUMNS, r * COLUMNS + COLUMNS))
  return (
    <table
      role="grid"
      aria-label={ariaLabel}
      className={cx(styles.periodGrid, range && styles.rangeGrid, isPreview && styles.previewing, className)}
      onKeyDown={onKeyDown}
    >
      <tbody>
        {rows.map((row, r) => (
          <tr key={r}>
            {row.map(({ date, outside }) => {
              const label = unit === 'month' ? monthName.format(date.toDate(timeZone)) : String(date.year)
              const disabled = isDisabled?.(date) ?? false
              const inRange = range != null && date.compare(range.start) >= 0 && date.compare(range.end) <= 0
              const selected = (isSelected?.(date) ?? false) || (inRange && !isPreview)
              const isCurrent = unit === 'month' ? isSameMonth(date, now) : isSameYear(date, now)
              const tabStop = date.compare(current) === 0
              return (
                <td key={date.toString()} role="gridcell" aria-selected={selected} aria-disabled={disabled || undefined} className={styles.periodTd}>
                  <button
                    type="button"
                    ref={tabStop ? focusRef : undefined}
                    tabIndex={tabStop ? 0 : -1}
                    className={cellClassName ?? styles.periodCell}
                    aria-disabled={disabled || undefined}
                    data-selected={(isSelected?.(date) ?? false) || undefined}
                    data-in-range={inRange || undefined}
                    data-range-start={(inRange && date.compare(range!.start) === 0) || undefined}
                    data-range-end={(inRange && date.compare(range!.end) === 0) || undefined}
                    data-outside={outside || undefined}
                    data-current={isCurrent || undefined}
                    data-disabled={disabled || undefined}
                    onFocus={() => setFocused(date)}
                    onClick={() => { if (!disabled) onSelect(date) }}
                    onPointerEnter={() => { if (!disabled) onHover?.(date) }}
                  >
                    {renderCell ? renderCell(date, label) : <span className={styles.inner}>{label}</span>}
                  </button>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export interface PeriodViewProps extends Omit<PeriodGridProps, 'aria-label'> {
  /** Month grid: the year in the header opens the year grid. */
  onTitlePress?: () => void
  side?: 'start' | 'end'
}

/** Figma DatePicker Menu Type=Month / Type=Year: header « 2026 » or « 2020 – 2029 » over the grid. */
export function PeriodView({ onTitlePress, side, ...grid }: PeriodViewProps) {
  const { unit, page, onPageChange } = grid
  const years = unit === 'month' ? 1 : 10
  const title = unit === 'month' ? String(page.year) : `${decadeStart(page.year)} – ${decadeStart(page.year) + 9}`
  return (
    <div className={styles.view}>
      <PanelHeader
        side={side}
        title={onTitlePress ? <TitleButton label={`Năm ${title}, chọn năm khác`} onPress={onTitlePress}>{title}</TitleButton> : title}
        superStep={{
          prevLabel: unit === 'month' ? 'Năm trước' : 'Mười năm trước',
          nextLabel: unit === 'month' ? 'Năm sau' : 'Mười năm sau',
          onPrev: () => onPageChange(page.subtract({ years })),
          onNext: () => onPageChange(page.add({ years })),
        }}
      />
      <div className={styles.periodBody}>
        <PeriodGrid {...grid} aria-label={unit === 'month' ? `Các tháng năm ${page.year}` : `Các năm ${title}`} />
      </div>
    </div>
  )
}

export interface PresetListProps<T> {
  presets: DatePreset<T>[]
  onSelect: (value: T) => void
  /** Names the group for screen readers. */
  label?: string
}

/** Figma DatePicker Menu "Preset": shortcuts in a 120px column beside the panel. */
export function PresetList<T>({ presets, onSelect, label = 'Chọn nhanh' }: PresetListProps<T>) {
  return (
    <div role="group" aria-label={label} className={styles.presets}>
      {presets.map((p) => (
        <AriaButton key={p.label} slot={null} className={styles.preset} onPress={() => onSelect(resolvePreset(p.value))}>
          {p.label}
        </AriaButton>
      ))}
    </div>
  )
}

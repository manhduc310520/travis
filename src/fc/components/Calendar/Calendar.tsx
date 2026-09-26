import { useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ButtonContext,
  Calendar as AriaCalendar,
  CalendarMonthPicker,
  CalendarStateContext,
  CalendarYearPicker,
  type DateValue,
} from 'react-aria-components'
import { isSameMonth, type CalendarDate } from '@internationalized/date'
import { cx } from '../../space'
import { FIRST_DAY_OF_WEEK, isPeriodDisabled } from '../DatePicker/dates'
import { DayGrid, PeriodGrid } from '../DatePicker/panel'
import { Radio, RadioGroup } from '../Radio/Radio'
import { Select } from '../Select/Select'
import styles from './Calendar.module.css'

/** Figma Year=False (`month`: the days of a month) / Year=True (`year`: the months of a year). */
export type CalendarMode = 'month' | 'year'
/** Figma "Calendar / Basic" (`full`: page-wide cells with notes) / "Calendar / Card" (`card`: compact bordered panel). */
export type CalendarVariant = 'full' | 'card'

/** What a custom header (`headerRender`) can read and change. */
export interface CalendarHeaderApi {
  /** A day in the month / year on screen. */
  date: CalendarDate
  mode: CalendarMode
  setMode: (mode: CalendarMode) => void
  /** Show the month / year holding `date`. */
  setDate: (date: CalendarDate) => void
}

export interface CalendarProps {
  /** Figma set: "Calendar / Basic" = `full` (default), "Calendar / Card" = `card`. */
  variant?: CalendarVariant
  /** Figma Year: `month` (days) or `year` (months). Controlled; see `defaultMode`. */
  mode?: CalendarMode
  defaultMode?: CalendarMode
  onModeChange?: (mode: CalendarMode) => void
  value?: DateValue | null
  defaultValue?: DateValue | null
  onChange?: (value: DateValue) => void
  /** The month shown first when there is no value. */
  defaultFocusedValue?: DateValue
  /** Called when the month / year on screen or the mode changes. */
  onPanelChange?: (date: CalendarDate, mode: CalendarMode) => void
  /** Figma "Calendar / Show Week" (Mini | Full): ISO week numbers in a first column. */
  showWeek?: boolean
  /** Figma Custom Header=True: a title above the header controls. */
  title?: ReactNode
  /** Replaces the header controls (year, month, Tháng / Năm) with your own. */
  headerRender?: (api: CalendarHeaderApi) => ReactNode
  /**
   * Figma "Calendar Item / Notice": extra content under a day (mode `month`)
   * or a month (mode `year`) — bookings, events. `full` variant only; the
   * card's 24px cells have no room.
   */
  cellRender?: (date: CalendarDate, mode: CalendarMode) => ReactNode
  minValue?: DateValue | null
  maxValue?: DateValue | null
  isDateUnavailable?: (date: DateValue) => boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  /** Names the calendar for screen readers. Default "Lịch". */
  'aria-label'?: string
  className?: string
}

/** Fires `onPanelChange` when the month / year on screen or the mode changes (not on mount). */
function PanelChange({ mode, onPanelChange }: { mode: CalendarMode; onPanelChange?: (date: CalendarDate, mode: CalendarMode) => void }) {
  const state = useContext(CalendarStateContext)
  const date = state?.focusedDate
  const key = date ? `${date.year}-${mode === 'month' ? date.month : ''}-${mode}` : ''
  const previous = useRef(key)
  useEffect(() => {
    if (previous.current === key) return
    previous.current = key
    if (date) onPanelChange?.(date, mode)
  })
  return null
}

function Header({ variant, mode, setMode, title, headerRender }: {
  variant: CalendarVariant; mode: CalendarMode; setMode: (mode: CalendarMode) => void; title?: ReactNode; headerRender?: CalendarProps['headerRender']
}) {
  const state = useContext(CalendarStateContext)
  if (!state) return null
  const size = variant === 'card' ? 'sm' : 'md'
  const controls = headerRender ? (
    // Clear the calendar's previous / next button slots so any button in a custom header works.
    <ButtonContext.Provider value={null}>
      {headerRender({ date: state.focusedDate, mode, setMode, setDate: (d) => state.setFocusedDate(d) })}
    </ButtonContext.Provider>
  ) : (
    <>
      <CalendarYearPicker>
        {(year) => (
          <Select
            size={size}
            aria-label="Năm"
            options={year.items.map((i) => ({ key: i.id, label: i.formatted }))}
            value={year.value}
            onChange={(k) => { if (k != null && !Array.isArray(k)) year.onChange(k) }}
            className={styles.yearSelect}
          />
        )}
      </CalendarYearPicker>
      {mode === 'month' && (
        <CalendarMonthPicker format="long">
          {(month) => (
            <Select
              size={size}
              aria-label="Tháng"
              options={month.items.map((i) => ({ key: i.id, label: i.formatted }))}
              value={month.value}
              onChange={(k) => { if (k != null && !Array.isArray(k)) month.onChange(k) }}
              className={styles.monthSelect}
            />
          )}
        </CalendarMonthPicker>
      )}
      {/* Figma: Radio Group Style=Outlined (Segmented is its own component). */}
      <RadioGroup appearance="button" size={size} aria-label="Chế độ xem" value={mode} onChange={(v) => setMode(v as CalendarMode)}>
        <Radio value="month">Tháng</Radio>
        <Radio value="year">Năm</Radio>
      </RadioGroup>
    </>
  )
  return (
    <div className={cx(styles.header, title != null && styles.withTitle)}>
      {title != null && <div className={styles.title}>{title}</div>}
      <div className={styles.controls}>{controls}</div>
    </div>
  )
}

function Days({ variant, showWeek, cellRender }: Pick<CalendarProps, 'showWeek' | 'cellRender'> & { variant: CalendarVariant }) {
  if (variant === 'card') return <DayGrid showWeek={showWeek} className={styles.miniGrid} />
  return (
    <DayGrid
      showWeek={showWeek}
      className={styles.fullGrid}
      cellClassName={styles.fullCell}
      weekClassName={styles.fullWeek}
      renderCell={(date, cell) => (
        <>
          <span className={styles.fullValue}>{cell.formattedDate.padStart(2, '0')}</span>
          {cellRender && !cell.isOutsideMonth && <div className={styles.fullContent}>{cellRender(date, 'month')}</div>}
        </>
      )}
    />
  )
}

function Months({ variant, cellRender }: Pick<CalendarProps, 'cellRender'> & { variant: CalendarVariant }) {
  const state = useContext(CalendarStateContext)
  if (!state) return null
  const value = Array.isArray(state.value) ? null : (state.value as CalendarDate | null)
  const focused = state.focusedDate
  const full = variant === 'full'
  return (
    <PeriodGrid
      unit="month"
      page={focused}
      onPageChange={(d) => state.setFocusedDate(focused.set({ year: d.year }))}
      isSelected={(d) => value != null && isSameMonth(d, value)}
      isDisabled={(d) => state.isDisabled || isPeriodDisabled(d, 'month', { minValue: state.minValue, maxValue: state.maxValue })}
      onSelect={(d) => {
        const next = focused.set({ month: d.month })
        state.setFocusedDate(next)
        state.selectDate(next)
      }}
      aria-label={`Các tháng năm ${focused.year}`}
      className={full ? styles.fullGrid : undefined}
      cellClassName={full ? styles.fullCell : undefined}
      renderCell={
        full
          ? (d, label) => (
              <>
                <span className={styles.fullValue}>{label}</span>
                {cellRender && <div className={styles.fullContent}>{cellRender(d, 'year')}</div>}
              </>
            )
          : undefined
      }
    />
  )
}

/**
 * Figma "❖ Calendar": a month (or year) shown in place — full page with notes
 * in each day (bookings, events), or a compact card. The header picks the
 * year, the month and the Tháng / Năm mode; weeks start on Monday.
 */
export function Calendar({
  variant = 'full', mode: modeProp, defaultMode = 'month', onModeChange, onPanelChange, showWeek = false, title, headerRender,
  cellRender, className, 'aria-label': ariaLabel = 'Lịch', ...rest
}: CalendarProps) {
  const [innerMode, setInnerMode] = useState<CalendarMode>(defaultMode)
  const mode = modeProp ?? innerMode
  const setMode = (next: CalendarMode) => {
    if (modeProp === undefined) setInnerMode(next)
    onModeChange?.(next)
  }
  return (
    <AriaCalendar {...rest} aria-label={ariaLabel} firstDayOfWeek={FIRST_DAY_OF_WEEK} className={cx(styles.calendar, styles[variant], className)}>
      <PanelChange mode={mode} onPanelChange={onPanelChange} />
      <Header variant={variant} mode={mode} setMode={setMode} title={title} headerRender={headerRender} />
      <div className={styles.content}>
        {mode === 'month' ? <Days variant={variant} showWeek={showWeek} cellRender={cellRender} /> : <Months variant={variant} cellRender={cellRender} />}
      </div>
    </AriaCalendar>
  )
}

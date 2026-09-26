import {
  CalendarDate,
  endOfMonth,
  endOfYear,
  getDayOfWeek,
  getLocalTimeZone,
  startOfMonth,
  startOfYear,
  toCalendarDate,
  today,
  type DateValue,
} from '@internationalized/date'
import type { RangeValue } from 'react-aria-components'

/** Weeks start on Monday (vi-VN), in every picker and calendar. */
export const FIRST_DAY_OF_WEEK = 'mon' as const

/** The unit of a month grid (`month`) or a decade grid (`year`). */
export type PeriodUnit = 'month' | 'year'

export const decadeStart = (year: number) => Math.floor(year / 10) * 10

/** First day of the month / year that holds `date`. Month and year pickers store this date. */
export function startOfPeriod(date: DateValue, unit: PeriodUnit): CalendarDate {
  const d = toCalendarDate(date)
  return unit === 'month' ? startOfMonth(d) : startOfYear(d)
}

export const isSamePeriod = (a: DateValue, b: DateValue, unit: PeriodUnit) => startOfPeriod(a, unit).compare(startOfPeriod(b, unit)) === 0

export interface DateLimits {
  minValue?: DateValue | null
  maxValue?: DateValue | null
  /** Month / year pickers pass the first day of each period. */
  isDateUnavailable?: (date: DateValue) => boolean
}

/** A month or year is disabled when none of its days is inside `minValue`–`maxValue`, or its first day is unavailable. */
export function isPeriodDisabled(first: CalendarDate, unit: PeriodUnit, { minValue, maxValue, isDateUnavailable }: DateLimits): boolean {
  const last = unit === 'month' ? endOfMonth(first) : endOfYear(first)
  if (minValue && last.compare(toCalendarDate(minValue)) < 0) return true
  if (maxValue && first.compare(toCalendarDate(maxValue)) > 0) return true
  return isDateUnavailable?.(first) ?? false
}

/** Whether one day can be picked (used by the "Hôm nay" / "Bây giờ" shortcuts). */
export function isDayDisabled(date: DateValue, { minValue, maxValue, isDateUnavailable }: DateLimits): boolean {
  const d = toCalendarDate(date)
  if (minValue && d.compare(toCalendarDate(minValue)) < 0) return true
  if (maxValue && d.compare(toCalendarDate(maxValue)) > 0) return true
  return isDateUnavailable?.(date) ?? false
}

/** ISO-8601 week number: weeks start on Monday, week 1 holds the year's first Thursday. */
export function isoWeek(date: CalendarDate): number {
  const thursday = date.add({ days: 3 - getDayOfWeek(date, 'vi-VN', FIRST_DAY_OF_WEEK) })
  return Math.floor(thursday.compare(new CalendarDate(thursday.year, 1, 1)) / 7) + 1
}

export const orderRange = (a: CalendarDate, b: CalendarDate): RangeValue<CalendarDate> => (a.compare(b) <= 0 ? { start: a, end: b } : { start: b, end: a })

/** A preset value, or a function so relative presets ("7 ngày qua") are computed when clicked. */
export type PresetValue<T> = T | (() => T)

/** Figma "DatePicker / DatePicker / Preset": one shortcut in the list beside the panel. */
export interface DatePreset<T> {
  label: string
  value: PresetValue<T>
}

export const resolvePreset = <T>(value: PresetValue<T>): T => (typeof value === 'function' ? (value as () => T)() : value)

const now = () => today(getLocalTimeZone())

/**
 * Shortcuts for report filters (FABi CMS): pass as `presets` to a day
 * `DateRangePicker`. Values are computed when clicked, so they stay relative
 * to the real today.
 */
export const RANGE_PRESETS: DatePreset<RangeValue<CalendarDate>>[] = [
  { label: 'Hôm nay', value: () => ({ start: now(), end: now() }) },
  { label: 'Hôm qua', value: () => ({ start: now().subtract({ days: 1 }), end: now().subtract({ days: 1 }) }) },
  { label: '7 ngày qua', value: () => ({ start: now().subtract({ days: 6 }), end: now() }) },
  { label: '30 ngày qua', value: () => ({ start: now().subtract({ days: 29 }), end: now() }) },
  { label: 'Tháng này', value: () => ({ start: startOfMonth(now()), end: now() }) },
  {
    label: 'Tháng trước',
    value: () => {
      const start = startOfMonth(now()).subtract({ months: 1 })
      return { start, end: endOfMonth(start) }
    },
  },
]

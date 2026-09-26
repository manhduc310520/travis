import { Time, getLocalTimeZone, now, toTime } from '@internationalized/date'

/** Smallest unit shown and picked (React Aria `granularity`). */
export type TimeGranularity = 'hour' | 'minute' | 'second'

/**
 * Times that cannot be picked, per unit, e.g. outside
 * opening hours. Minutes and seconds depend on the hour / minute above them.
 */
export interface DisabledTime {
  hours?: number[]
  minutes?: (hour: number) => number[]
  seconds?: (hour: number, minute: number) => number[]
}

/** What limits the choice: shared by the columns, the field validation and "Bây giờ". */
export interface TimeConstraints {
  /** @default 'minute' */
  granularity?: TimeGranularity
  /** Hour column shows every Nth hour. @default 1 */
  hourStep?: number
  /** Minute column shows every Nth minute, e.g. 15 → 00 / 15 / 30 / 45. @default 1 */
  minuteStep?: number
  /** @default 1 */
  secondStep?: number
  /** Earliest time that can be picked or typed. */
  minValue?: Time | null
  /** Latest time that can be picked or typed. */
  maxValue?: Time | null
  disabledTime?: DisabledTime
}

/** Accessible names of the columns (Vietnamese by default). */
export interface TimeColumnLabels {
  hour: string
  minute: string
  second: string
  /** 12-hour clock only: the SA / CH column. */
  dayPeriod: string
}

export const TIME_COLUMN_LABELS: TimeColumnLabels = { hour: 'Giờ', minute: 'Phút', second: 'Giây', dayPeriod: 'Buổi' }

/** 0, step, 2·step… below `end`. */
export const stepRange = (end: number, step = 1) => Array.from({ length: Math.ceil(end / Math.max(1, step)) }, (_, i) => i * Math.max(1, step))

export const pad2 = (n: number) => String(n).padStart(2, '0')

export function isHourDisabled(hour: number, c: TimeConstraints) {
  if (c.disabledTime?.hours?.includes(hour)) return true
  if (c.minValue && hour < c.minValue.hour) return true
  if (c.maxValue && hour > c.maxValue.hour) return true
  return false
}

export function isMinuteDisabled(hour: number, minute: number, c: TimeConstraints) {
  if (isHourDisabled(hour, c)) return true
  if (c.disabledTime?.minutes?.(hour).includes(minute)) return true
  if (c.minValue && hour === c.minValue.hour && minute < c.minValue.minute) return true
  if (c.maxValue && hour === c.maxValue.hour && minute > c.maxValue.minute) return true
  return false
}

export function isSecondDisabled(hour: number, minute: number, second: number, c: TimeConstraints) {
  if (isMinuteDisabled(hour, minute, c)) return true
  if (c.disabledTime?.seconds?.(hour, minute).includes(second)) return true
  if (c.minValue && hour === c.minValue.hour && minute === c.minValue.minute && second < c.minValue.second) return true
  if (c.maxValue && hour === c.maxValue.hour && minute === c.maxValue.minute && second > c.maxValue.second) return true
  return false
}

/** True when `t` cannot be picked at the given granularity. */
export function isTimeDisabled(t: Time, c: TimeConstraints) {
  const g = c.granularity ?? 'minute'
  if (g === 'hour') return isHourDisabled(t.hour, c)
  if (g === 'minute') return isMinuteDisabled(t.hour, t.minute, c)
  return isSecondDisabled(t.hour, t.minute, t.second, c)
}

/** Drops the units below the granularity (14:09:37 → 14:09:00 for minutes). */
export function truncateTime(t: Time, granularity: TimeGranularity = 'minute') {
  if (granularity === 'hour') return t.set({ minute: 0, second: 0, millisecond: 0 })
  if (granularity === 'minute') return t.set({ second: 0, millisecond: 0 })
  return t.set({ millisecond: 0 })
}

/**
 * After the hour (or minute) changed, moves a lower unit that became
 * unavailable to the first available one, so a pick never lands on a
 * disabled time when an allowed one exists in that hour.
 */
export function snapToEnabled(t: Time, c: TimeConstraints) {
  const g = c.granularity ?? 'minute'
  let next = t
  if (g !== 'hour' && !isHourDisabled(next.hour, c) && isMinuteDisabled(next.hour, next.minute, c)) {
    const minute = stepRange(60, c.minuteStep).find((m) => !isMinuteDisabled(next.hour, m, c))
    if (minute != null) next = next.set({ minute })
  }
  if (g === 'second' && !isMinuteDisabled(next.hour, next.minute, c) && isSecondDisabled(next.hour, next.minute, next.second, c)) {
    const second = stepRange(60, c.secondStep).find((s) => !isSecondDisabled(next.hour, next.minute, s, c))
    if (second != null) next = next.set({ second })
  }
  return next
}

/** The current local time at the given granularity ("Bây giờ"). */
export const currentTime = (granularity?: TimeGranularity) => truncateTime(toTime(now(getLocalTimeZone())), granularity)

export { Time }

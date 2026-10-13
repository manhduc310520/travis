// Number, money and date formats of the FABi CMS (vi-VN): 9.615.933 ₫ · 12,5% · 02/11/2026 · 02/11/2026 14:05.
// One place for the convention, so screens never hand-roll Intl calls.

type DateInput = Date | string | number | { toDate(): Date } | null | undefined

const toDate = (d: DateInput): Date | null => {
  if (d === null || d === undefined || d === '') return null
  const date = typeof d === 'object' && 'toDate' in d ? d.toDate() : new Date(d as Date | string | number)
  return Number.isNaN(date.getTime()) ? null : date
}
const pad = (n: number) => String(n).padStart(2, '0')

/** 9615933 → "9.615.933" (vi-VN grouping; `digits` decimals, default 0) */
export function formatNumber(value: number | null | undefined, digits = 0): string {
  if (value === null || value === undefined || Number.isNaN(value)) return ''
  return new Intl.NumberFormat('vi-VN', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)
}

/** 9615933 → "9.615.933 ₫" */
export function formatMoney(value: number | null | undefined): string {
  const n = formatNumber(value)
  return n && `${n} ₫`
}

/** 12.5 → "12,5%" (the value is already a percent; at most `digits` decimals, default 1) */
export function formatPercent(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return ''
  return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: digits }).format(value)}%`
}

/** → "02/11/2026" (Date, ISO string, timestamp or a dayjs value) */
export function formatDate(value: DateInput): string {
  const d = toDate(value)
  return d ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}` : ''
}

/** → "02/11/2026 14:05" */
export function formatDateTime(value: DateInput): string {
  const d = toDate(value)
  return d ? `${formatDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}` : ''
}

/** The date format string for DatePicker / RangePicker `format` */
export const DATE_FORMAT = 'DD/MM/YYYY'
/** The date-time format string for DatePicker `format` with `showTime` */
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm'

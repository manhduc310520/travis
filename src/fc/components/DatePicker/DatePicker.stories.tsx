import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { getDayOfWeek, parseDate, parseDateTime, type CalendarDate, type DateValue } from '@internationalized/date'
import type { RangeValue } from 'react-aria-components'
import { Building02, Clock } from '../../../icons'
import { DatePicker, DateRangePicker, MultiDatePicker } from './DatePicker'
import { RANGE_PRESETS, type DatePreset } from './dates'

// Fixed dates, not today: an open panel on "today" would change the snapshot every day.
const DAY = parseDate('2026-03-12')
const DAY_TIME = parseDateTime('2026-03-12T13:30')
const RANGE = { start: parseDate('2026-03-09'), end: parseDate('2026-03-18') }
const MONTH_RANGE = { start: parseDate('2026-01-01'), end: parseDate('2026-06-01') }

/** Relative shortcuts, computed when clicked. */
const DAY_PRESETS: DatePreset<DateValue>[] = [
  { label: 'Hôm qua', value: () => DAY.subtract({ days: 1 }) },
  { label: 'Tuần trước', value: () => DAY.subtract({ weeks: 1 }) },
  { label: 'Tháng trước', value: () => DAY.subtract({ months: 1 }) },
]

const VARIANTS = ['outlined', 'filled', 'borderless', 'underlined'] as const
const SIZES = ['sm', 'md', 'lg'] as const
const column = { display: 'grid', gap: 'var(--fc-space-margin-base)', width: 320 } as const
const wideColumn = { display: 'grid', gap: 'var(--fc-space-margin-base)', width: 400 } as const

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  args: { label: 'Ngày giao hàng', size: 'md', variant: 'outlined', picker: 'date', granularity: 'day' },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    variant: { control: 'inline-radio', options: VARIANTS },
    status: { control: 'inline-radio', options: [undefined, 'error', 'warning'] },
    picker: { control: 'inline-radio', options: ['date', 'month', 'year'] },
    granularity: { control: 'inline-radio', options: ['day', 'hour', 'minute', 'second'] },
    placement: { control: 'inline-radio', options: ['bottom', 'top'] },
    value: { control: false },
    defaultValue: { control: false },
    presets: { control: false },
    minValue: { control: false },
    maxValue: { control: false },
    placeholderValue: { control: false },
  },
  // React Aria fits the popover into the space left in <body>; the height keeps open panels whole in the story frame.
  decorators: [(Story) => <div style={{ minHeight: 440 }}><Story /></div>],
} satisfies Meta<typeof DatePicker>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Figma DatePicker Active=Yes + menu Type=Day: open on a fixed month, today outlined, "Hôm nay" in the footer. */
export const Open: Story = { args: { defaultValue: DAY, defaultOpen: true } }

/** Figma menu Type=Date and Time: TimePicker's hour / minute columns beside the calendar, "Bây giờ" and "OK". */
export const DateAndTime: Story = {
  args: { label: 'Giờ nhận bàn', granularity: 'minute', defaultValue: DAY_TIME, defaultOpen: true },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
}

/** Figma menu Type=Month: the month grid; the year in the header opens the year grid. Value = first day of the month. */
export const MonthPicker: Story = { args: { label: 'Kỳ báo cáo', picker: 'month', defaultValue: DAY, defaultOpen: true } }

/** Figma menu Type=Year: a decade, with the years either side dimmed. */
export const YearPicker: Story = { args: { label: 'Năm tài chính', picker: 'year', defaultValue: DAY, defaultOpen: true } }

/** Figma menu Preset=True (single): shortcuts in a 120px column beside the panel. */
export const Presets: Story = { args: { label: 'Ngày chốt sổ', presets: DAY_PRESETS, defaultValue: DAY, defaultOpen: true } }

/** Figma input sets: Outlined / Filled / Borderless / Underlined, empty and filled. */
export const Variants: Story = {
  render: (args) => (
    <div style={column}>
      {VARIANTS.map((v) => (
        <DatePicker key={v} {...args} variant={v} label={v} defaultValue={v === 'outlined' || v === 'filled' ? DAY : undefined} />
      ))}
    </div>
  ),
}

/** Figma Status: Warning / Error on each input set (error is announced as invalid). */
export const Status: Story = {
  render: (args) => (
    <div style={column}>
      {VARIANTS.map((v) => (
        <div key={v} style={{ display: 'grid', gap: 'var(--fc-space-margin-xs)' }}>
          <DatePicker {...args} variant={v} label={`${v} – lỗi`} status="error" errorMessage="Chọn ngày giao hàng" />
          <DatePicker {...args} variant={v} label={`${v} – cảnh báo`} status="warning" defaultValue={DAY} description="Ngày lễ: bếp đóng sớm" />
        </div>
      ))}
    </div>
  ),
}

/** Figma Size: Small / Default / Large. */
export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      {SIZES.map((s) => <DatePicker key={s} {...args} size={s} label={`Cỡ ${s}`} defaultValue={DAY} />)}
    </div>
  ),
}

/** Figma State: Default / Filled / Disabled (Hover, Focused and Typing are live states). */
export const States: Story = {
  render: (args) => (
    <div style={column}>
      <DatePicker {...args} label="Trống" />
      <DatePicker {...args} label="Đã chọn" defaultValue={DAY} />
      <DatePicker {...args} label="Chỉ xem" defaultValue={DAY} isReadOnly />
      <DatePicker {...args} label="Vô hiệu" isDisabled />
      <DatePicker {...args} label="Vô hiệu, có ngày" defaultValue={DAY} isDisabled />
      <DatePicker {...args} label="Bắt buộc" isRequired description="Ngày khách nhận hàng" />
    </div>
  ),
}

/** Figma "Prefix": icon or short text inside the box, before the date. */
export const WithPrefix: Story = {
  render: (args) => (
    <div style={column}>
      <DatePicker {...args} label="Ngày khai trương" prefix={<Building02 />} defaultValue={DAY} />
      <DatePicker {...args} label="Giờ mở cửa" prefix={<Clock />} granularity="minute" />
      <DatePicker {...args} label="Kỳ" prefix="Từ:" picker="month" defaultValue={DAY} />
    </div>
  ),
}

/** Every picker Type, closed: Day, Date and Time, Month, Year. */
export const Types: Story = {
  render: (args) => (
    <div style={column}>
      <DatePicker {...args} label="Ngày (Day)" defaultValue={DAY} />
      <DatePicker {...args} label="Ngày giờ (Date and Time)" granularity="minute" defaultValue={DAY_TIME} />
      <DatePicker {...args} label="Ngày giờ, có giây" granularity="second" />
      <DatePicker {...args} label="Tháng (Month)" picker="month" defaultValue={DAY} />
      <DatePicker {...args} label="Năm (Year)" picker="year" defaultValue={DAY} />
    </div>
  ),
}

/** Disabled dates: the restaurant closes on Mondays (`isDateUnavailable`); bookings only 5–25/3 (`minValue` / `maxValue`). */
export const DisabledDates: Story = {
  args: {
    label: 'Ngày đặt bàn',
    defaultValue: DAY,
    defaultOpen: true,
    minValue: parseDate('2026-03-05'),
    maxValue: parseDate('2026-03-25'),
    isDateUnavailable: (d: DateValue) => getDayOfWeek(d, 'vi-VN', 'mon') === 0,
    description: 'Nhà hàng nghỉ thứ Hai',
  },
}

/** Placement=Top: the popover above the box. */
export const OpenTop: Story = {
  args: { label: 'Ngày giao hàng', defaultValue: DAY, defaultOpen: true, placement: 'top' },
  decorators: [(Story) => <div style={{ paddingTop: 400 }}><Story /></div>],
}

/* ---------------------------------------------------------------- range */

/** Figma Range=True + menu Type=Day: two months side by side, the active bar under the half being picked. */
export const Range: Story = {
  render: () => <div style={wideColumn}><DateRangePicker label="Kỳ báo cáo doanh thu" defaultValue={RANGE} defaultOpen /></div>,
}

/** Figma menu Preset=True (range): the report shortcuts (`RANGE_PRESETS`: "Hôm nay", "7 ngày qua", "Tháng này"…). */
export const RangePresets: Story = {
  render: () => <div style={wideColumn}><DateRangePicker label="Kỳ báo cáo" presets={RANGE_PRESETS} defaultValue={RANGE} defaultOpen /></div>,
  decorators: [(Story) => <div style={{ minHeight: 440 }}><Story /></div>],
}

/** Range with time (Type=Date and Time, Range): one set of time columns, switched between the start and the end. */
export const RangeWithTime: Story = {
  render: () => (
    <div style={wideColumn}>
      <DateRangePicker
        label="Ca làm việc"
        granularity="minute"
        defaultValue={{ start: parseDateTime('2026-03-12T08:00'), end: parseDateTime('2026-03-12T16:30') }}
        defaultOpen
      />
    </div>
  ),
}

function RangeMonthYearDemo() {
  const [months, setMonths] = useState<RangeValue<DateValue> | null>(MONTH_RANGE)
  return (
    <div style={wideColumn}>
      <DateRangePicker label="Từ tháng – đến tháng" picker="month" value={months} onChange={setMonths} defaultOpen />
      <DateRangePicker label="Từ năm – đến năm" picker="year" defaultValue={{ start: parseDate('2022-01-01'), end: parseDate('2026-01-01') }} />
    </div>
  )
}

/** Figma Range=True + menu Type=Month / Type=Year: two years (or two decades) side by side. Values are first days. */
export const RangeMonthYear: Story = { render: () => <RangeMonthYearDemo /> }

/** Range in the four input sets, the three sizes and both statuses. */
export const RangeVariants: Story = {
  render: () => (
    <div style={wideColumn}>
      {VARIANTS.map((v) => <DateRangePicker key={v} label={v} variant={v} defaultValue={v === 'outlined' ? RANGE : undefined} />)}
      {SIZES.map((s) => <DateRangePicker key={s} label={`Cỡ ${s}`} size={s} defaultValue={RANGE} />)}
      <DateRangePicker label="Lỗi" status="error" errorMessage="Ngày kết thúc phải sau ngày bắt đầu" />
      <DateRangePicker label="Cảnh báo" status="warning" defaultValue={RANGE} />
      <DateRangePicker label="Vô hiệu" isDisabled defaultValue={RANGE} />
      <DateRangePicker label="Chi nhánh" prefix={<Building02 />} />
    </div>
  ),
}

/* ---------------------------------------------------------------- multiple */

const HOLIDAYS: CalendarDate[] = [parseDate('2026-03-02'), DAY, parseDate('2026-03-18')]

function MultipleDemo() {
  const [days, setDays] = useState<CalendarDate[]>(HOLIDAYS)
  return (
    <div style={column}>
      <MultiDatePicker label="Ngày nghỉ của chi nhánh" value={days} onChange={setDays} description={`${days.length} ngày đã chọn`} />
      <MultiDatePicker label="Hiện 2 thẻ, còn lại +N" defaultValue={HOLIDAYS} maxTagCount={2} size="sm" />
      <MultiDatePicker label="Cỡ lớn" defaultValue={HOLIDAYS.slice(0, 2)} size="lg" status="warning" />
      <MultiDatePicker label="Trống" />
    </div>
  )
}

/** Figma input State=Multiple: several separate dates (days off) as removable tags; the panel stays open while toggling. */
export const Multiple: Story = { render: () => <MultipleDemo /> }

/** Multiple, open: selected days are solid; click again to remove. */
export const MultipleOpen: Story = {
  render: () => <div style={column}><MultiDatePicker label="Ngày nghỉ lễ" defaultValue={HOLIDAYS} defaultOpen /></div>,
}

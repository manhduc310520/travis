import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Time } from '@internationalized/date'
import { Bell01, Building02 } from '../../../icons'
import { TimeColumns } from './TimeColumns'
import { TimePicker, TimeRangePicker, type TimeRange } from './TimePicker'
import overlay from '../../overlay.module.css'

const OPEN_AT = new Time(14, 9)
const SHIFT: TimeRange = { start: new Time(8, 0), end: new Time(14, 30) }
const VARIANTS = ['outlined', 'filled', 'borderless', 'underlined'] as const
const SIZES = ['sm', 'md', 'lg'] as const

const meta = {
  title: 'Components/Data Entry/TimePicker',
  component: TimePicker,
  args: { label: 'Giờ mở cửa', size: 'md', variant: 'outlined' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: VARIANTS },
    status: { control: 'inline-radio', options: [undefined, 'error', 'warning'] },
    granularity: { control: 'inline-radio', options: ['hour', 'minute', 'second'] },
    hourCycle: { control: 'inline-radio', options: [undefined, 12, 24] },
    placement: { control: 'inline-radio', options: ['bottom', 'top'] },
    value: { control: false },
    defaultValue: { control: false },
    minValue: { control: false },
    maxValue: { control: false },
    placeholderValue: { control: false },
    disabledTime: { control: false },
    prefix: { control: false },
  },
  // React Aria keeps the panel inside <body>; the extra height keeps open panels whole.
  decorators: [(Story) => <div style={{ minHeight: 340 }}><Story /></div>],
} satisfies Meta<typeof TimePicker>
export default meta
type Story = StoryObj<typeof meta>

const single = { width: 200 } as const
const range = { width: 320 } as const
const grid = { display: 'grid', gap: 'var(--fc-space-margin-base)', gridTemplateColumns: '200px 320px', alignItems: 'end' } as const

export const Playground: Story = { render: (args) => <div style={single}><TimePicker {...args} /></div> }

/** Figma `TimePicker` Active=Yes: panel open under the box, the picked hour / minute / second at the top of their columns, "Bây giờ" (Now) + "OK" footer. */
export const Open: Story = {
  render: (args) => <div style={single}><TimePicker {...args} granularity="second" defaultValue={OPEN_AT.set({ second: 30 })} defaultOpen /></div>,
}

/** Figma TimePicker Input `Range=True`, Active=Yes: the panel sits under the half being edited, marked by the 2 px active bar. */
export const OpenRange: Story = {
  render: () => <div style={range}><TimeRangePicker label="Ca sáng" defaultValue={SHIFT} defaultOpen /></div>,
}

/** Figma input sets: Outlined / Filled / Borderless / Underlined, single and `Range=True`. */
export const Variants: Story = {
  render: () => (
    <div style={grid}>
      {VARIANTS.map((v) => (
        <div key={v} style={{ display: 'contents' }}>
          <TimePicker label={v} variant={v} defaultValue={OPEN_AT} />
          <TimeRangePicker label={`${v} (khoảng)`} variant={v} defaultValue={SHIFT} />
        </div>
      ))}
    </div>
  ),
}

/** Figma `Status`: Error / Warning on every input set (error is announced as invalid). */
export const Status: Story = {
  render: () => (
    <div style={grid}>
      {VARIANTS.map((v) => (
        <div key={v} style={{ display: 'contents' }}>
          <TimePicker label={`Giờ nhận món (${v})`} variant={v} status="error" errorMessage="Vui lòng chọn giờ" />
          <TimeRangePicker label={`Ca làm (${v})`} variant={v} status="warning" defaultValue={SHIFT} description="Ca dài hơn 6 giờ" />
        </div>
      ))}
    </div>
  ),
}

/** Figma `Size`: Small / Default / Large (24 / 32 / 40), single and range. */
export const Sizes: Story = {
  render: () => (
    <div style={grid}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'contents' }}>
          <TimePicker label={`Cỡ ${s}`} size={s} defaultValue={OPEN_AT} />
          <TimeRangePicker label={`Cỡ ${s} (khoảng)`} size={s} defaultValue={SHIFT} />
        </div>
      ))}
    </div>
  ),
}

/** Figma `State=Disabled`, plus read-only (no panel, no clear). */
export const DisabledAndReadOnly: Story = {
  render: () => (
    <div style={grid}>
      <TimePicker label="Vô hiệu" isDisabled defaultValue={OPEN_AT} />
      <TimeRangePicker label="Vô hiệu (khoảng)" isDisabled />
      <TimePicker label="Chỉ xem" isReadOnly defaultValue={OPEN_AT} />
      <TimeRangePicker label="Chỉ xem (khoảng)" isReadOnly defaultValue={SHIFT} />
    </div>
  ),
}

/** Figma "Prefix" slot: icon or short text before the value. */
export const WithPrefix: Story = {
  render: () => (
    <div style={grid}>
      <TimePicker label="Giờ nhắc" prefix={<Bell01 />} placeholder="Giờ nhắc nhập kho" />
      <TimeRangePicker label="Giờ mở cửa" prefix={<Building02 />} defaultValue={{ start: new Time(9, 0), end: new Time(22, 0) }} />
    </div>
  ),
}

/** Range for a shift that crosses midnight (22:00 → 02:00): the end may be earlier than the start. */
export const OvernightShift: Story = {
  render: () => <div style={range}><TimeRangePicker label="Ca đêm" defaultValue={{ start: new Time(22, 0), end: new Time(2, 0) }} /></div>,
}

/** `minuteStep`: delivery slots every 15 minutes. */
export const Steps: Story = {
  render: () => <div style={single}><TimePicker label="Giờ giao hàng" minuteStep={15} defaultValue={new Time(11, 45)} /></div>,
}

/**
 * Opening hours 10:00 – 21:30 (`minValue` / `maxValue`) and a kitchen break
 * 14:00 – 14:59 (`disabledTime`): those rows are disabled and a typed time
 * there is flagged invalid.
 */
export const DisabledTimes: Story = {
  render: () => (
    <div style={single}>
      <TimePicker
        label="Giờ đặt bàn"
        minValue={new Time(10, 0)}
        maxValue={new Time(21, 30)}
        disabledTime={{ hours: [14] }}
        minuteStep={5}
        description="Nhà hàng nghỉ 14:00 – 15:00"
      />
    </div>
  ),
}

/** Seconds column (`granularity="second"`), as in the Figma menu. */
export const Seconds: Story = {
  render: () => <div style={single}><TimePicker label="Thời gian nấu" granularity="second" defaultValue={new Time(0, 12, 30)} /></div>,
}

/** `hourCycle={12}`: "SA" / "CH" (AM / PM) segment and column. vi-VN defaults to 24-hour. */
export const TwelveHour: Story = {
  render: () => <div style={single}><TimePicker label="Giờ khai trương" hourCycle={12} defaultValue={new Time(18, 30)} /></div>,
}

/** Controlled value: the text below updates on every commit ("OK", Enter, "Bây giờ" (Now), typing, clear). */
export const Controlled: Story = {
  render: function Render() {
    const [time, setTime] = useState<Time | null>(new Time(7, 30))
    const [shift, setShift] = useState<TimeRange | null>(SHIFT)
    return (
      <div style={{ display: 'grid', gap: 'var(--fc-space-margin-base)', width: 320 }}>
        <TimePicker label="Giờ chốt ca" value={time} onChange={setTime} />
        <span>Giá trị: {time ? time.toString() : 'trống'}</span>
        <TimeRangePicker label="Ca chiều" value={shift} onChange={setShift} />
        <span>Khoảng: {shift ? `${shift.start.toString()} → ${shift.end.toString()}` : 'trống'}</span>
      </div>
    )
  },
}

/**
 * Figma "TimePicker Menu" + "TimePicker Menu Cell" (Default / Hover /
 * Selected) on their own: `TimeColumns` is exported for DatePicker's
 * date + time panel.
 */
export const Columns: Story = {
  render: function Render() {
    const [time, setTime] = useState<Time | null>(new Time(2, 4, 6))
    return (
      <div className={overlay.surface} style={{ display: 'inline-block' }}>
        <TimeColumns value={time} onChange={setTime} granularity="second" />
      </div>
    )
  },
}

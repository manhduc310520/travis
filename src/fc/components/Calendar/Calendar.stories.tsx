import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { getDayOfWeek, parseDate, type CalendarDate, type DateValue } from '@internationalized/date'
import { StatusBadge, type BadgeStatus } from '../Badge/Badge'
import { Button } from '../Button/Button'
import { Calendar, type CalendarMode } from './Calendar'

// A fixed month, not today: the stories must look the same every day.
const DAY = parseDate('2026-03-12')

interface Booking { status: BadgeStatus; text: string }

/** Bookings of a restaurant in March 2026, keyed by day of month. */
const BOOKINGS: Record<number, Booking[]> = {
  3: [{ status: 'success', text: 'Sinh nhật · 12 khách' }],
  8: [
    { status: 'success', text: 'Bàn VIP 2 · 6 khách' },
    { status: 'warning', text: 'Hội nghị · chờ cọc' },
  ],
  12: [
    { status: 'success', text: 'Tiệc cưới · 120 khách' },
    { status: 'processing', text: 'Họp lớp · 20 khách' },
    { status: 'error', text: 'Hủy: bàn 7' },
  ],
  20: [{ status: 'warning', text: 'Liên hoan · chờ xác nhận' }],
  27: [
    { status: 'success', text: 'Tất niên · 45 khách' },
    { status: 'default', text: 'Ghi chú: nhập hàng' },
  ],
}

/** Orders per month in 2026 (year mode). */
const ORDERS: Record<number, string> = { 1: '1.284', 2: '1.102', 3: '1.394' }

const list = { display: 'grid', margin: 0, padding: 0, listStyle: 'none' } as const
const item = { overflow: 'hidden', whiteSpace: 'nowrap' } as const

/** Figma "Calendar Item / Notice": status badges under a day, a total under a month. */
function renderNotes(date: CalendarDate, mode: CalendarMode) {
  if (date.year !== 2026) return null
  if (mode === 'year') {
    const orders = ORDERS[date.month]
    return orders ? <span style={{ color: 'var(--fc-color-content-description)' }}>{orders} đơn</span> : null
  }
  const bookings = date.month === 3 ? BOOKINGS[date.day] : undefined
  if (!bookings) return null
  return (
    <ul style={list}>
      {bookings.map((b) => (
        <li key={b.text} style={item}>
          <StatusBadge status={b.status}>{b.text}</StatusBadge>
        </li>
      ))}
    </ul>
  )
}

const closedOnMonday = (d: DateValue) => getDayOfWeek(d, 'vi-VN', 'mon') === 0

const meta = {
  title: 'Components/Data Display/Calendar',
  component: Calendar,
  args: { variant: 'full', defaultValue: DAY, showWeek: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['full', 'card'] },
    mode: { control: 'inline-radio', options: [undefined, 'month', 'year'] },
    defaultMode: { control: 'inline-radio', options: ['month', 'year'] },
    showWeek: { control: 'boolean' },
    title: { control: 'text' },
    value: { control: false },
    defaultValue: { control: false },
    cellRender: { control: false },
    headerRender: { control: false },
    minValue: { control: false },
    maxValue: { control: false },
  },
} satisfies Meta<typeof Calendar>
export default meta
type Story = StoryObj<typeof meta>

// Figma card width.
const card: Story['decorators'] = [(Story) => <div style={{ width: 300 }}><Story /></div>]

export const Playground: Story = {}

/** Figma "Calendar / Basic", Year=False: the month on a full page, bookings as status badges in each day. */
export const Basic: Story = { args: { cellRender: renderNotes, 'aria-label': 'Lịch đặt bàn' } }

/** Figma "Calendar / Basic", Year=True: one cell per month, with the month's order count. */
export const BasicYear: Story = { args: { defaultMode: 'year', cellRender: renderNotes } }

/** Figma "Calendar / Card", Year=False: the compact month in a bordered card (same cells as the DatePicker panel). */
export const Card: Story = { args: { variant: 'card' }, decorators: card }

/** Figma "Calendar / Card", Year=True. */
export const CardYear: Story = { args: { variant: 'card', defaultMode: 'year' }, decorators: card }

/** Figma "Calendar / Card", Custom Header=True: a title above the controls. */
export const CardCustomHeader: Story = { args: { variant: 'card', title: 'Lịch đặt bàn' }, decorators: card }

/** Figma "Calendar / Card", Year=True + Custom Header=True. */
export const CardYearCustomHeader: Story = { args: { variant: 'card', title: 'Doanh thu theo tháng', defaultMode: 'year' }, decorators: card }

/** Figma "Calendar / Show Week", Type=Mini: ISO week numbers in the card. */
export const ShowWeekMini: Story = { args: { variant: 'card', showWeek: true }, decorators: card }

/** Figma "Calendar / Show Week", Type=Full. */
export const ShowWeekFull: Story = { args: { showWeek: true, cellRender: renderNotes } }

/** Disabled days: closed on Mondays (`isDateUnavailable`), bookable 5–25/3 only (`minValue` / `maxValue`). */
export const DisabledDates: Story = {
  args: { variant: 'card', minValue: parseDate('2026-03-05'), maxValue: parseDate('2026-03-25'), isDateUnavailable: closedOnMonday },
  decorators: card,
}

function CustomHeaderDemo() {
  const [picked, setPicked] = useState<DateValue>(DAY)
  const [panel, setPanel] = useState('Tháng 3/2026')
  return (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-sm)' }}>
      <Calendar
        value={picked}
        onChange={setPicked}
        onPanelChange={(d, mode) => setPanel(mode === 'month' ? `Tháng ${d.month}/${d.year}` : `Năm ${d.year}`)}
        cellRender={renderNotes}
        headerRender={({ date, setDate, mode, setMode }) => (
          <>
            <Button size="sm" onPress={() => setDate(date.subtract(mode === 'month' ? { months: 1 } : { years: 1 }))}>Trước</Button>
            <Button size="sm" onPress={() => setDate(date.add(mode === 'month' ? { months: 1 } : { years: 1 }))}>Sau</Button>
            <Button size="sm" variant="text" onPress={() => setMode(mode === 'month' ? 'year' : 'month')}>
              {mode === 'month' ? 'Xem cả năm' : 'Xem theo tháng'}
            </Button>
          </>
        )}
      />
      <span style={{ color: 'var(--fc-color-content-description)' }}>
        Đang xem: {panel} · Đã chọn: {picked.toString()}
      </span>
    </div>
  )
}

/** `headerRender` replaces the year / month / mode controls; `onPanelChange` reports the month on screen. */
export const CustomHeaderRender: Story = { render: () => <CustomHeaderDemo /> }

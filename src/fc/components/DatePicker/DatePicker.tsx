import { useContext, useEffect, useState, type ReactNode } from 'react'
import {
  Button as AriaButton,
  Calendar as AriaCalendar,
  CalendarStateContext,
  DateInput,
  DatePicker as AriaDatePicker,
  DatePickerStateContext,
  DateRangePicker as AriaDateRangePicker,
  DateRangePickerStateContext,
  DateSegment,
  Dialog,
  Group,
  Popover as AriaPopover,
  RangeCalendar,
  RangeCalendarStateContext,
  Tag as AriaTag,
  TagGroup,
  TagList,
  type DateValue,
  type RangeValue,
  type TimeValue,
} from 'react-aria-components'
import { useDateFormatter } from 'react-aria'
import { getLocalTimeZone, now, toCalendarDate, toCalendarDateTime, toTime, today, type CalendarDate, type Time } from '@internationalized/date'
import { ArrowRight, Calendar as CalendarIcon, XCircle, XClose } from '../../../icons'
import { cx } from '../../space'
import overlay from '../../overlay.module.css'
import { Button } from '../Button/Button'
import { controlClasses, fieldFrame, useFieldSize, type FieldChromeProps, type InputSize, type InputStatus, type InputVariant } from '../Input/field'
import input from '../Input/Input.module.css'
import { Radio, RadioGroup } from '../Radio/Radio'
import { TimeColumns } from '../TimePicker/TimeColumns'
import {
  FIRST_DAY_OF_WEEK, isDayDisabled, isPeriodDisabled, isSamePeriod, orderRange, startOfPeriod,
  type DateLimits, type DatePreset, type PeriodUnit,
} from './dates'
import { DayGrid, PanelHeader, PeriodView, PresetList, TitleButton } from './panel'
import panel from './panel.module.css'
import styles from './DatePicker.module.css'

/** Figma DatePicker Menu Type: Day (`date`), Month, Year. "Date and Time" is `date` with a time `granularity`. */
export type DatePickerType = 'date' | 'month' | 'year'
/** `day` = date only; `hour` / `minute` / `second` add the time (Figma Type=Date and Time). */
export type DateGranularity = 'day' | 'hour' | 'minute' | 'second'

interface PickerBaseProps extends Omit<FieldChromeProps, 'showCount' | 'placeholder'>, DateLimits {
  /** Figma Type. Month and year pickers store the first day of the chosen month / year. */
  picker?: DatePickerType
  /** Date pickers only: add hours / minutes / seconds, picked in TimePicker's columns beside the calendar. */
  granularity?: DateGranularity
  /** With a time: 12 adds an "SA" / "CH" (AM / PM) column. By default the locale decides (vi-VN: 24). */
  hourCycle?: 12 | 24
  /** Figma "Prefix": icon or short text inside the box, before the value. */
  prefix?: ReactNode
  /** Clear button (×) over the calendar icon while the box is hovered or focused. Default `true`. */
  allowClear?: boolean
  /** Popover below (default) or above the box. */
  placement?: 'bottom' | 'top'
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  /** Submits the value as ISO text (`2026-09-26`) in a hidden input. */
  name?: string
  autoFocus?: boolean
  /** Figma "Active": popover open on first render. */
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /** Needed when there is no visible `label`. */
  'aria-label'?: string
}

export interface DatePickerProps extends PickerBaseProps {
  value?: DateValue | null
  defaultValue?: DateValue | null
  onChange?: (value: DateValue | null) => void
  /** Shown while empty. Default "Chọn ngày" / "Chọn ngày giờ" / "Chọn tháng" / "Chọn năm". */
  placeholder?: string
  /** Figma Preset=True: shortcuts in a column beside the panel. */
  presets?: DatePreset<DateValue>[]
  /** Day pickers without time: "Hôm nay" link in the footer. Default `true`. */
  showToday?: boolean
  /** The date (and time) the panel opens on when there is no value. */
  placeholderValue?: DateValue
}

export interface DateRangePickerProps extends PickerBaseProps {
  value?: RangeValue<DateValue> | null
  defaultValue?: RangeValue<DateValue> | null
  onChange?: (value: RangeValue<DateValue> | null) => void
  /** Default "Ngày bắt đầu" (or "Tháng bắt đầu" / "Năm bắt đầu"). */
  startPlaceholder?: string
  /** Default "Ngày kết thúc" (or "Tháng kết thúc" / "Năm kết thúc"). */
  endPlaceholder?: string
  /** Figma Preset=True. See `RANGE_PRESETS` for the report shortcuts ("Hôm nay", "7 ngày qua", "Tháng này"…). */
  presets?: DatePreset<RangeValue<DateValue>>[]
}

export interface MultiDatePickerProps extends Omit<PickerBaseProps, 'picker' | 'granularity' | 'hourCycle' | 'isReadOnly'> {
  value?: CalendarDate[]
  defaultValue?: CalendarDate[]
  /** Always sorted, earliest first. */
  onChange?: (value: CalendarDate[]) => void
  placeholder?: string
  /** Show this many tags, then "+N". */
  maxTagCount?: number
}

const tz = () => getLocalTimeZone()

/* ------------------------------------------------------------------ shared pieces */

function PickerPopover({ placement = 'bottom', children }: { placement?: 'bottom' | 'top'; children: ReactNode }) {
  return (
    <AriaPopover placement={`${placement} start`} offset={4} className={cx(overlay.surface, panel.popover)}>
      <Dialog className={panel.dialog}>{children}</Dialog>
    </AriaPopover>
  )
}

/** The bordered box: TextField's chrome, kept "focused" while the popover is open. */
function PickerBox({ size: sizeProp, variant = 'outlined', status, isDisabled, className, children }: {
  size?: InputSize; variant?: InputVariant; status?: InputStatus; isDisabled?: boolean; className?: string; children: ReactNode
}) {
  // Inside a <Form size>, the default size follows the form.
  const size = useFieldSize(sizeProp)
  const single = useContext(DatePickerStateContext)
  const range = useContext(DateRangePickerStateContext)
  const isOpen = (single ?? range)?.isOpen ?? false
  return (
    <Group
      isDisabled={isDisabled}
      className={cx(
        controlClasses({ size, variant, status }),
        styles.box,
        size === 'sm' && styles.small,
        size === 'lg' && styles.large,
        status === 'warning' && styles.warning,
        isOpen && styles.open,
        isOpen && styles[`open-${variant}`],
        className,
      )}
    >
      {children}
    </Group>
  )
}

/** Typed date (React Aria segments) with the placeholder text over it while empty. */
function DateText({ slot, placeholder, isActive, range = false }: { slot?: 'start' | 'end'; placeholder: string; isActive?: boolean; range?: boolean }) {
  return (
    <span className={cx(styles.inputWrap, range && styles.rangePart)} data-active={isActive || undefined}>
      {placeholder !== '' && <span className={styles.placeholder} aria-hidden="true">{placeholder}</span>}
      <DateInput slot={slot} className={styles.dateInput}>
        {(segment) => <DateSegment segment={segment} className={styles.segment} />}
      </DateInput>
    </span>
  )
}

/** The picker's own button: opens the popover (React Aria wires it through the picker's button context). */
function CalendarButton() {
  return (
    <AriaButton className={styles.suffix}>
      <CalendarIcon />
    </AriaButton>
  )
}

function ClearValue({ range = false }: { range?: boolean }) {
  const single = useContext(DatePickerStateContext)
  const rangeState = useContext(DateRangePickerStateContext)
  const hasValue = range ? rangeState?.value?.start != null || rangeState?.value?.end != null : single?.value != null
  if (!hasValue) return null
  return (
    <AriaButton
      slot={null}
      className={cx(input.iconButton, styles.clear)}
      aria-label={range ? 'Xóa khoảng ngày' : 'Xóa ngày'}
      onPress={() => (range ? rangeState?.setValue(null) : single?.setValue(null))}
    >
      <XCircle />
    </AriaButton>
  )
}

function FieldBody({ label, tooltip, description, errorMessage, isRequired, children }: Pick<FieldChromeProps, 'label' | 'tooltip' | 'description' | 'errorMessage'> & { isRequired?: boolean; children: ReactNode }) {
  const frame = fieldFrame({ label, description, errorMessage, isRequired, tooltip })
  return (
    <>
      {frame.label}
      {children}
      {frame.after}
    </>
  )
}

/* ------------------------------------------------------------------ day panel (single) */

/** Header + day grid, with the title opening the month and year grids (drill-down). */
function DayView({ limits }: { limits: DateLimits }) {
  const state = useContext(CalendarStateContext)
  const [view, setView] = useState<'day' | PeriodUnit>('day')
  const monthName = useDateFormatter({ month: 'long', timeZone: state?.timeZone })
  if (!state) return null
  const focused = state.focusedDate
  // One date (single) or a list (multiple selection).
  const selected = (Array.isArray(state.value) ? state.value : state.value == null ? [] : [state.value]) as CalendarDate[]

  if (view === 'day') {
    const month = monthName.format(focused.toDate(state.timeZone))
    return (
      <>
        <PanelHeader
          monthStep
          superStep={{
            prevLabel: 'Năm trước',
            nextLabel: 'Năm sau',
            onPrev: () => state.setFocusedDate(focused.subtract({ years: 1 })),
            onNext: () => state.setFocusedDate(focused.add({ years: 1 })),
          }}
          title={
            <>
              <TitleButton label={`${month}, chọn tháng khác`} onPress={() => setView('month')}>{month}</TitleButton>
              <TitleButton label={`Năm ${focused.year}, chọn năm khác`} onPress={() => setView('year')}>{focused.year}</TitleButton>
            </>
          }
        />
        <div className={panel.body}>
          <DayGrid />
        </div>
      </>
    )
  }

  return (
    <PeriodView
      key={view}
      unit={view}
      page={focused}
      autoFocus
      onPageChange={(d) => state.setFocusedDate(focused.set({ year: d.year }))}
      isSelected={(d) => selected.some((s) => isSamePeriod(d, s, view))}
      isDisabled={(d) => isPeriodDisabled(d, view, limits)}
      onTitlePress={view === 'month' ? () => setView('year') : undefined}
      onSelect={(d) => {
        if (view === 'year') {
          state.setFocusedDate(focused.set({ year: d.year }))
          setView('month')
        } else {
          state.setFocusedDate(focused.set({ year: d.year, month: d.month }))
          state.setFocused(true)
          setView('day')
        }
      }}
    />
  )
}

function SinglePresets({ presets }: { presets: DatePreset<DateValue>[] }) {
  const state = useContext(DatePickerStateContext)
  return (
    <PresetList
      presets={presets}
      onSelect={(v) => {
        state?.setValue(v)
        state?.setOpen(false)
      }}
    />
  )
}

function TodayFooter({ limits }: { limits: DateLimits }) {
  const state = useContext(DatePickerStateContext)
  const day = today(tz())
  return (
    <div className={panel.footer}>
      <Button slot={null} variant="link" size="sm" isDisabled={isDayDisabled(day, limits)} onPress={() => state?.setDateValue(day)}>
        Hôm nay
      </Button>
    </div>
  )
}

const TRUNCATE = {
  hour: { minute: 0, second: 0, millisecond: 0 },
  minute: { second: 0, millisecond: 0 },
  second: { millisecond: 0 },
} as const

/** The time part of a picker value, as TimeColumns wants it. */
const asTime = (t: TimeValue | null | undefined): Time | null => (t == null ? null : 'day' in t ? toTime(t) : t)

type TimeGranularity = Exclude<DateGranularity, 'day'>

/**
 * Figma Type=Date and Time, right of the calendar: TimePicker's hour / minute
 * (/ second) columns under a blank strip that lines up with the calendar header.
 */
function SingleTimePanel({ granularity, hourCycle, placeholderValue }: { granularity: TimeGranularity; hourCycle?: 12 | 24; placeholderValue?: DateValue }) {
  const state = useContext(DatePickerStateContext)
  if (!state) return null
  return (
    <div className={panel.timePanel}>
      <div className={panel.timeHeader} />
      <TimeColumns
        value={asTime(state.timeValue)}
        onChange={state.setTimeValue}
        onConfirm={(t) => {
          state.setTimeValue(t)
          state.setOpen(false)
        }}
        placeholderValue={placeholderValue && 'hour' in placeholderValue ? toTime(placeholderValue) : undefined}
        granularity={granularity}
        hourCycle={hourCycle}
        className={panel.timeColumns}
      />
    </div>
  )
}

/** Footer of Type=Date and Time: "Bây giờ" (link) and "OK" (the one primary action). */
function TimeFooter({ granularity, limits }: { granularity: TimeGranularity; limits: DateLimits }) {
  const state = useContext(DatePickerStateContext)
  if (!state) return null
  const zone = tz()
  const setNow = () => {
    const current = now(zone)
    const fields = TRUNCATE[granularity]
    state.setValue(state.value && 'timeZone' in state.value ? current.set(fields) : toCalendarDateTime(current).set(fields))
    state.setOpen(false)
  }
  return (
    <div className={cx(panel.footer, panel.footerSplit)}>
      <Button slot={null} variant="link" size="sm" isDisabled={isDayDisabled(today(zone), limits)} onPress={setNow}>Bây giờ</Button>
      <Button slot={null} variant="primary" size="sm" isDisabled={state.dateValue == null} onPress={() => state.setOpen(false)}>OK</Button>
    </div>
  )
}

/* ------------------------------------------------------------------ DatePicker */

/**
 * Figma "❖ DatePicker": choose one date (Type=Day), a date and time
 * (Type=Date and Time, via `granularity`), a month or a year (`picker`).
 * The box is TextField's (Outlined / Filled / Borderless / Underlined ×
 * Default / Warning / Error × 3 sizes); the date is typed in dd/MM/yyyy
 * segments or picked in the popover panel (weeks start on Monday).
 */
export function DatePicker(props: DatePickerProps) {
  const { picker = 'date' } = props
  return picker === 'date' ? <DayPicker {...props} /> : <PeriodPicker {...props} unit={picker} />
}

function DayPicker({
  label, tooltip, description, errorMessage, size, variant = 'outlined', status, className, placeholder, prefix, allowClear = true,
  placement = 'bottom', presets, showToday = true, granularity = 'day', hourCycle, isInvalid, minValue, maxValue, isDateUnavailable,
  picker: _picker, ...rest
}: DatePickerProps) {
  const hasTime = granularity !== 'day'
  const limits = { minValue, maxValue, isDateUnavailable }
  return (
    <AriaDatePicker
      {...rest}
      {...limits}
      granularity={granularity}
      hourCycle={hourCycle}
      firstDayOfWeek={FIRST_DAY_OF_WEEK}
      shouldForceLeadingZeros
      hideTimeZone
      shouldCloseOnSelect={!hasTime}
      isInvalid={status === 'error' ? true : isInvalid}
      className={cx(input.field, styles.picker, className)}
    >
      <FieldBody label={label} tooltip={tooltip} description={description} errorMessage={errorMessage} isRequired={rest.isRequired}>
        <PickerBox size={size} variant={variant} status={status} isDisabled={rest.isDisabled}>
          {prefix != null && <span className={cx(input.affix, styles.prefix)}>{prefix}</span>}
          <DateText placeholder={placeholder ?? (hasTime ? 'Chọn ngày giờ' : 'Chọn ngày')} />
          {allowClear && !rest.isDisabled && !rest.isReadOnly && <ClearValue />}
          <CalendarButton />
        </PickerBox>
      </FieldBody>
      <PickerPopover placement={placement}>
        <div className={panel.layout}>
          {presets && presets.length > 0 && <SinglePresets presets={presets} />}
          <div className={panel.main}>
            <div className={panel.withTime}>
              <AriaCalendar firstDayOfWeek={FIRST_DAY_OF_WEEK}>
                <DayView limits={limits} />
              </AriaCalendar>
              {granularity !== 'day' && <SingleTimePanel granularity={granularity} hourCycle={hourCycle} placeholderValue={rest.placeholderValue} />}
            </div>
            {granularity !== 'day' ? <TimeFooter granularity={granularity} limits={limits} /> : showToday && <TodayFooter limits={limits} />}
          </div>
        </div>
      </PickerPopover>
    </AriaDatePicker>
  )
}

/* ------------------------------------------------------------------ month / year picker */

function PeriodTrigger({ unit, prefix, placeholder }: { unit: PeriodUnit; prefix?: ReactNode; placeholder: string }) {
  const state = useContext(DatePickerStateContext)
  const format = useDateFormatter(unit === 'month' ? { month: '2-digit', year: 'numeric' } : { year: 'numeric' })
  const text = state?.value ? format.format(toCalendarDate(state.value).toDate(tz())) : null
  return (
    <AriaButton className={styles.trigger} aria-label={text ?? placeholder}>
      {prefix != null && <span className={cx(input.affix, styles.prefix)}>{prefix}</span>}
      <span className={cx(styles.triggerValue, text == null && styles.triggerPlaceholder)}>{text ?? placeholder}</span>
      <span className={styles.suffix} aria-hidden="true"><CalendarIcon /></span>
    </AriaButton>
  )
}

function PeriodContent({ unit, limits }: { unit: PeriodUnit; limits: DateLimits }) {
  const state = useContext(DatePickerStateContext)
  const value = state?.value ? toCalendarDate(state.value) : null
  const [page, setPage] = useState<CalendarDate>(() => value ?? today(tz()))
  const [view, setView] = useState<PeriodUnit>(unit)
  return (
    <PeriodView
      key={view}
      unit={view}
      page={page}
      onPageChange={setPage}
      autoFocus
      isSelected={(d) => value != null && isSamePeriod(d, value, view)}
      isDisabled={(d) => isPeriodDisabled(d, view, limits)}
      onTitlePress={view === 'month' ? () => setView('year') : undefined}
      onSelect={(d) => {
        if (view === unit) state?.setDateValue(d)
        else {
          setPage(page.set({ year: d.year }))
          setView('month')
        }
      }}
    />
  )
}

function PeriodPicker({
  unit, label, tooltip, description, errorMessage, size, variant = 'outlined', status, className, placeholder, prefix, allowClear = true,
  placement = 'bottom', presets, isInvalid, minValue, maxValue, isDateUnavailable,
  picker: _picker, granularity: _granularity, hourCycle: _hourCycle, showToday: _showToday, placeholderValue: _placeholderValue, ...rest
}: DatePickerProps & { unit: PeriodUnit }) {
  const limits = { minValue, maxValue, isDateUnavailable }
  return (
    <AriaDatePicker
      {...rest}
      granularity="day"
      minValue={minValue ? startOfPeriod(minValue, unit) : minValue}
      maxValue={maxValue}
      isDateUnavailable={isDateUnavailable}
      isInvalid={status === 'error' ? true : isInvalid}
      className={cx(input.field, styles.picker, className)}
    >
      <FieldBody label={label} tooltip={tooltip} description={description} errorMessage={errorMessage} isRequired={rest.isRequired}>
        <PickerBox size={size} variant={variant} status={status} isDisabled={rest.isDisabled} className={styles.triggerBox}>
          <PeriodTrigger unit={unit} prefix={prefix} placeholder={placeholder ?? (unit === 'month' ? 'Chọn tháng' : 'Chọn năm')} />
          {allowClear && !rest.isDisabled && !rest.isReadOnly && <ClearValue />}
        </PickerBox>
      </FieldBody>
      <PickerPopover placement={placement}>
        <div className={panel.layout}>
          {presets && presets.length > 0 && <SinglePresets presets={presets} />}
          <div className={panel.main}>
            <PeriodContent unit={unit} limits={limits} />
          </div>
        </div>
      </PickerPopover>
    </AriaDatePicker>
  )
}

/* ------------------------------------------------------------------ DateRangePicker */

/**
 * Figma DatePicker Range=True: a start and an end, picked in two panels side
 * by side (two months, two years or two decades). The active bar marks the
 * half being edited.
 */
export function DateRangePicker(props: DateRangePickerProps) {
  const { picker = 'date' } = props
  return picker === 'date' ? <DayRangePicker {...props} /> : <PeriodRangePicker {...props} unit={picker} />
}

function RangePresets({ presets }: { presets: DatePreset<RangeValue<DateValue>>[] }) {
  const state = useContext(DateRangePickerStateContext)
  return (
    <PresetList
      presets={presets}
      onSelect={(v) => {
        state?.setValue(v)
        state?.setOpen(false)
      }}
    />
  )
}

/** Reports whether the user has picked the start and is now choosing the end. */
function AnchorReporter({ onChange }: { onChange: (pickingEnd: boolean) => void }) {
  const state = useContext(RangeCalendarStateContext)
  const pickingEnd = state?.anchorDate != null
  useEffect(() => onChange(pickingEnd), [pickingEnd, onChange])
  return null
}

function MonthTitle({ date, timeZone }: { date: CalendarDate; timeZone: string }) {
  const monthName = useDateFormatter({ month: 'long', timeZone })
  return (
    <>
      <span>{monthName.format(date.toDate(timeZone))}</span>
      <span>{date.year}</span>
    </>
  )
}

function RangeDays() {
  const state = useContext(RangeCalendarStateContext)
  if (!state) return null
  const first = state.visibleRange.start
  const superStep = {
    prevLabel: 'Năm trước',
    nextLabel: 'Năm sau',
    onPrev: () => state.setFocusedDate(state.focusedDate.subtract({ years: 1 })),
    onNext: () => state.setFocusedDate(state.focusedDate.add({ years: 1 })),
  }
  return (
    <div className={panel.panels}>
      <div className={panel.view}>
        <PanelHeader side="start" monthStep superStep={superStep} title={<MonthTitle date={first} timeZone={state.timeZone} />} />
        <div className={panel.body}><DayGrid /></div>
      </div>
      <div className={panel.view}>
        <PanelHeader side="end" monthStep superStep={superStep} title={<MonthTitle date={first.add({ months: 1 })} timeZone={state.timeZone} />} />
        <div className={panel.body}><DayGrid offset={{ months: 1 }} /></div>
      </div>
    </div>
  )
}

/** Range + time: one set of TimePicker columns, switched between the start and the end time. */
function RangeTimePanel({ granularity, hourCycle }: { granularity: TimeGranularity; hourCycle?: 12 | 24 }) {
  const state = useContext(DateRangePickerStateContext)
  const [part, setPart] = useState<'start' | 'end'>('start')
  if (!state) return null
  return (
    <div className={panel.timePanel}>
      <div className={panel.timeHeader}>
        <RadioGroup appearance="button" size="sm" aria-label="Chỉnh giờ" value={part} onChange={(v) => setPart(v === 'end' ? 'end' : 'start')}>
          <Radio value="start">Bắt đầu</Radio>
          <Radio value="end">Kết thúc</Radio>
        </RadioGroup>
      </div>
      <TimeColumns
        key={part}
        value={asTime(state.timeRange?.[part])}
        onChange={(t) => state.setTime(part, t)}
        granularity={granularity}
        hourCycle={hourCycle}
        className={panel.timeColumns}
      />
    </div>
  )
}

function RangeTimeFooter() {
  const state = useContext(DateRangePickerStateContext)
  if (!state) return null
  return (
    <div className={cx(panel.footer, panel.footerEnd)}>
      <Button slot={null} variant="primary" size="sm" isDisabled={state.dateRange?.start == null || state.dateRange?.end == null} onPress={() => state.setOpen(false)}>
        OK
      </Button>
    </div>
  )
}

function DayRangePicker({
  label, tooltip, description, errorMessage, size, variant = 'outlined', status, className, prefix, allowClear = true,
  placement = 'bottom', presets, granularity = 'day', hourCycle, isInvalid, startPlaceholder, endPlaceholder, minValue, maxValue, isDateUnavailable,
  picker: _picker, ...rest
}: DateRangePickerProps) {
  const hasTime = granularity !== 'day'
  const [pickingEnd, setPickingEnd] = useState(false)
  return (
    <AriaDateRangePicker
      {...rest}
      minValue={minValue}
      maxValue={maxValue}
      isDateUnavailable={isDateUnavailable}
      granularity={granularity}
      hourCycle={hourCycle}
      firstDayOfWeek={FIRST_DAY_OF_WEEK}
      shouldForceLeadingZeros
      hideTimeZone
      shouldCloseOnSelect={!hasTime}
      isInvalid={status === 'error' ? true : isInvalid}
      className={cx(input.field, styles.picker, className)}
    >
      {({ isOpen }) => (
        <>
          <FieldBody label={label} tooltip={tooltip} description={description} errorMessage={errorMessage} isRequired={rest.isRequired}>
            <PickerBox size={size} variant={variant} status={status} isDisabled={rest.isDisabled}>
              {prefix != null && <span className={cx(input.affix, styles.prefix)}>{prefix}</span>}
              <DateText range slot="start" placeholder={startPlaceholder ?? 'Ngày bắt đầu'} isActive={isOpen && !pickingEnd} />
              <span className={styles.separator} aria-hidden="true"><ArrowRight /></span>
              <DateText range slot="end" placeholder={endPlaceholder ?? 'Ngày kết thúc'} isActive={isOpen && pickingEnd} />
              {allowClear && !rest.isDisabled && !rest.isReadOnly && <ClearValue range />}
              <CalendarButton />
            </PickerBox>
          </FieldBody>
          <PickerPopover placement={placement}>
            <div className={panel.layout}>
              {presets && presets.length > 0 && <RangePresets presets={presets} />}
              <div className={panel.main}>
                <div className={panel.withTime}>
                  <RangeCalendar firstDayOfWeek={FIRST_DAY_OF_WEEK} visibleDuration={{ months: 2 }} pageBehavior="single">
                    <AnchorReporter onChange={setPickingEnd} />
                    <RangeDays />
                  </RangeCalendar>
                  {granularity !== 'day' && <RangeTimePanel granularity={granularity} hourCycle={hourCycle} />}
                </div>
                {granularity !== 'day' && <RangeTimeFooter />}
              </div>
            </div>
          </PickerPopover>
        </>
      )}
    </AriaDateRangePicker>
  )
}

function PeriodRangeTrigger({ unit, prefix, startPlaceholder, endPlaceholder, pickingEnd }: {
  unit: PeriodUnit; prefix?: ReactNode; startPlaceholder: string; endPlaceholder: string; pickingEnd: boolean
}) {
  const state = useContext(DateRangePickerStateContext)
  const format = useDateFormatter(unit === 'month' ? { month: '2-digit', year: 'numeric' } : { year: 'numeric' })
  const text = (d: DateValue | null | undefined) => (d ? format.format(toCalendarDate(d).toDate(tz())) : null)
  const start = text(state?.value?.start)
  const end = text(state?.value?.end)
  const isOpen = state?.isOpen ?? false
  return (
    <AriaButton className={styles.trigger} aria-label={start && end ? `${start} – ${end}` : `${startPlaceholder} – ${endPlaceholder}`}>
      {prefix != null && <span className={cx(input.affix, styles.prefix)}>{prefix}</span>}
      <span className={styles.rangePart} data-active={(isOpen && !pickingEnd) || undefined}>
        <span className={cx(styles.triggerValue, start == null && styles.triggerPlaceholder)}>{start ?? startPlaceholder}</span>
      </span>
      <span className={styles.separator} aria-hidden="true"><ArrowRight /></span>
      <span className={styles.rangePart} data-active={(isOpen && pickingEnd) || undefined}>
        <span className={cx(styles.triggerValue, end == null && styles.triggerPlaceholder)}>{end ?? endPlaceholder}</span>
      </span>
      <span className={styles.suffix} aria-hidden="true"><CalendarIcon /></span>
    </AriaButton>
  )
}

function PeriodRangeContent({ unit, limits, anchor, setAnchor }: {
  unit: PeriodUnit; limits: DateLimits; anchor: CalendarDate | null; setAnchor: (d: CalendarDate | null) => void
}) {
  const state = useContext(DateRangePickerStateContext)
  const start = state?.value?.start ? startOfPeriod(state.value.start, unit) : null
  const end = state?.value?.end ? startOfPeriod(state.value.end, unit) : null
  const [page, setPage] = useState<CalendarDate>(() => start ?? today(tz()))
  const [hovered, setHovered] = useState<CalendarDate | null>(null)
  const years = unit === 'month' ? 1 : 10
  const range = anchor ? orderRange(anchor, hovered ?? anchor) : start && end ? { start, end } : null
  const grid = {
    unit,
    range,
    isPreview: anchor != null,
    isDisabled: (d: CalendarDate) => isPeriodDisabled(d, unit, limits),
    onHover: (d: CalendarDate) => { if (anchor) setHovered(d) },
    onSelect: (d: CalendarDate) => {
      if (!anchor) {
        setAnchor(d)
        setHovered(d)
        return
      }
      setAnchor(null)
      state?.setValue(orderRange(anchor, d))
      state?.commitValidation()
      state?.setOpen(false)
    },
  }
  return (
    <div className={panel.panels}>
      <PeriodView {...grid} side="start" page={page} onPageChange={setPage} autoFocus />
      <PeriodView {...grid} side="end" page={page.add({ years })} onPageChange={(d) => setPage(d.subtract({ years }))} />
    </div>
  )
}

function PeriodRangePicker({
  unit, label, tooltip, description, errorMessage, size, variant = 'outlined', status, className, prefix, allowClear = true,
  placement = 'bottom', presets, isInvalid, startPlaceholder, endPlaceholder, minValue, maxValue, isDateUnavailable, onOpenChange,
  picker: _picker, granularity: _granularity, hourCycle: _hourCycle, ...rest
}: DateRangePickerProps & { unit: PeriodUnit }) {
  const [anchor, setAnchor] = useState<CalendarDate | null>(null)
  const limits = { minValue, maxValue, isDateUnavailable }
  const noun = unit === 'month' ? 'Tháng' : 'Năm'
  return (
    <AriaDateRangePicker
      {...rest}
      granularity="day"
      minValue={minValue ? startOfPeriod(minValue, unit) : minValue}
      maxValue={maxValue}
      isDateUnavailable={isDateUnavailable}
      isInvalid={status === 'error' ? true : isInvalid}
      onOpenChange={(open) => {
        if (!open) setAnchor(null)
        onOpenChange?.(open)
      }}
      className={cx(input.field, styles.picker, className)}
    >
      <FieldBody label={label} tooltip={tooltip} description={description} errorMessage={errorMessage} isRequired={rest.isRequired}>
        <PickerBox size={size} variant={variant} status={status} isDisabled={rest.isDisabled} className={styles.triggerBox}>
          <PeriodRangeTrigger
            unit={unit}
            prefix={prefix}
            startPlaceholder={startPlaceholder ?? `${noun} bắt đầu`}
            endPlaceholder={endPlaceholder ?? `${noun} kết thúc`}
            pickingEnd={anchor != null}
          />
          {allowClear && !rest.isDisabled && !rest.isReadOnly && <ClearValue range />}
        </PickerBox>
      </FieldBody>
      <PickerPopover placement={placement}>
        <div className={panel.layout}>
          {presets && presets.length > 0 && <RangePresets presets={presets} />}
          <div className={panel.main}>
            <PeriodRangeContent unit={unit} limits={limits} anchor={anchor} setAnchor={setAnchor} />
          </div>
        </div>
      </PickerPopover>
    </AriaDateRangePicker>
  )
}

/* ------------------------------------------------------------------ MultiDatePicker */

/**
 * Figma DatePicker Input State=Multiple: several separate dates (days off,
 * holiday closures), shown as removable tags. The popover stays open while
 * dates are toggled.
 */
export function MultiDatePicker({
  label, tooltip, description, errorMessage, size, variant = 'outlined', status, className, placeholder = 'Chọn ngày', prefix,
  allowClear = true, placement = 'bottom', maxTagCount, value, defaultValue, onChange, minValue, maxValue, isDateUnavailable,
  isDisabled, isRequired, isInvalid, name, autoFocus, defaultOpen, isOpen, onOpenChange, 'aria-label': ariaLabel,
}: MultiDatePickerProps) {
  const [inner, setInner] = useState<CalendarDate[]>(defaultValue ?? [])
  const dates = value ?? inner
  const setDates = (next: readonly CalendarDate[]) => {
    const sorted = [...next].sort((a, b) => a.compare(b))
    if (value === undefined) setInner(sorted)
    onChange?.(sorted)
  }
  const format = useDateFormatter({ day: '2-digit', month: '2-digit', year: 'numeric' })
  const text = (d: CalendarDate) => format.format(d.toDate(tz()))
  const shown = maxTagCount != null ? dates.slice(0, maxTagCount) : dates
  const more = dates.length - shown.length

  return (
    <AriaDatePicker
      // A shell for the label, description, error, popover and dialog wiring; the dates live here, not in its value.
      value={null}
      isDisabled={isDisabled}
      autoFocus={autoFocus}
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      aria-label={ariaLabel}
      validationBehavior="aria"
      isInvalid={status === 'error' ? true : isInvalid}
      className={cx(input.field, styles.picker, className)}
    >
      <FieldBody label={label} tooltip={tooltip} description={description} errorMessage={errorMessage} isRequired={isRequired}>
        <PickerBox size={size} variant={variant} status={status} isDisabled={isDisabled} className={styles.multiBox}>
          <AriaButton className={styles.cover} aria-label={dates.length ? `Đã chọn ${dates.length} ngày` : placeholder}>
            <span className={styles.suffix} aria-hidden="true"><CalendarIcon /></span>
          </AriaButton>
          {prefix != null && <span className={cx(input.affix, styles.prefix, styles.above)}>{prefix}</span>}
          {dates.length === 0 ? (
            <span className={styles.multiPlaceholder} aria-hidden="true">{placeholder}</span>
          ) : (
            <TagGroup
              aria-label="Ngày đã chọn"
              disabledKeys={isDisabled ? dates.map(String) : undefined}
              className={cx(styles.tags, styles.above)}
              onRemove={isDisabled ? undefined : (keys) => setDates(dates.filter((d) => !keys.has(d.toString())))}
            >
              <TagList className={styles.tagList}>
                {shown.map((d) => (
                  <AriaTag key={d.toString()} id={d.toString()} textValue={text(d)} className={styles.tag}>
                    <span className={styles.tagLabel}>{text(d)}</span>
                    {!isDisabled && (
                      <AriaButton slot="remove" className={styles.tagRemove} aria-label={`Gỡ ${text(d)}`}>
                        <XClose />
                      </AriaButton>
                    )}
                  </AriaTag>
                ))}
                {more > 0 && (
                  <AriaTag id="__more" textValue={`và ${more} ngày khác`} className={cx(styles.tag, styles.more)}>+{more}</AriaTag>
                )}
              </TagList>
            </TagGroup>
          )}
          {allowClear && dates.length > 0 && !isDisabled && (
            <AriaButton slot={null} className={cx(input.iconButton, styles.clear)} aria-label="Xóa tất cả ngày" onPress={() => setDates([])}>
              <XCircle />
            </AriaButton>
          )}
        </PickerBox>
      </FieldBody>
      {name != null && <input type="hidden" name={name} value={dates.map(String).join(',')} />}
      <PickerPopover placement={placement}>
        <AriaCalendar
          slot={null}
          selectionMode="multiple"
          value={dates}
          onChange={(next) => setDates(next.map((d) => toCalendarDate(d)))}
          firstDayOfWeek={FIRST_DAY_OF_WEEK}
          minValue={minValue}
          maxValue={maxValue}
          isDateUnavailable={isDateUnavailable}
          autoFocus
        >
          <DayView limits={{ minValue, maxValue, isDateUnavailable }} />
        </AriaCalendar>
      </PickerPopover>
    </AriaDatePicker>
  )
}

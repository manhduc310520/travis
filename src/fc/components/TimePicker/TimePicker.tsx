import { Fragment, useContext, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import {
  Button as AriaButton,
  DateInput,
  DateSegment,
  FieldErrorContext,
  LabelContext,
  Popover as AriaPopover,
  Provider,
  TextContext,
  TimeField,
  TimeFieldStateContext,
} from 'react-aria-components'
import { mergeProps, useFocusWithin, useHover, useId } from 'react-aria'
import type { Time } from '@internationalized/date'
import { ArrowRight, Clock, XCircle } from '../../../icons'
import { cx } from '../../space'
import overlay from '../../overlay.module.css'
import { Button } from '../Button/Button'
import { controlClasses, fieldFrame, type FieldChromeProps, type InputSize, type InputStatus, type InputVariant } from '../Input/field'
import input from '../Input/Input.module.css'
import { TimeColumns } from './TimeColumns'
import { TIME_COLUMN_LABELS, currentTime, isTimeDisabled, type TimeColumnLabels, type TimeConstraints } from './time'
import styles from './TimePicker.module.css'

/** Every visible or announced text; Vietnamese by default, override any of them. */
export interface TimePickerLabels extends TimeColumnLabels {
  /** Footer link that picks the current time. */
  now: string
  /** Footer primary button. */
  ok: string
  /** Clock button and the panel's accessible name. */
  open: string
  /** Clear button (×). */
  clear: string
  /** Error shown when a typed time is in `disabledTime`. */
  unavailable: string
  /** Range: names of the two halves. */
  start: string
  end: string
}

const LABELS: TimePickerLabels = {
  ...TIME_COLUMN_LABELS,
  now: 'Bây giờ',
  ok: 'OK',
  open: 'Chọn giờ',
  clear: 'Xóa giờ',
  unavailable: 'Không chọn được giờ này',
  start: 'Giờ bắt đầu',
  end: 'Giờ kết thúc',
}

interface PickerBaseProps extends Omit<FieldChromeProps, 'showCount' | 'placeholder'>, TimeConstraints {
  /** 12 shows "SA" / "CH" (AM / PM) in the segment and a column. Default: the locale's clock (vi-VN: 24-hour). */
  hourCycle?: 12 | 24
  /** Two-digit hours (`09:05`, `HH:mm`). @default true */
  shouldForceLeadingZeros?: boolean
  /** Figma "Prefix": icon or short text inside the box, before the value. */
  prefix?: ReactNode
  /** Clear button (×) over the clock while hovered or focused, when there is a value. @default true */
  allowClear?: boolean
  /** Footer "Bây giờ" (Now) link. @default true */
  showNow?: boolean
  /** Panel below (default) or above the box. */
  placement?: 'bottom' | 'top'
  isOpen?: boolean
  /** Open on first render (Figma `Active=Yes`). */
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  autoFocus?: boolean
  labels?: Partial<TimePickerLabels>
  'aria-label'?: string
}

export interface TimePickerProps extends PickerBaseProps {
  value?: Time | null
  defaultValue?: Time | null
  onChange?: (value: Time | null) => void
  /** Shown while empty and not focused. @default 'Chọn giờ' */
  placeholder?: string
  /** Time the first pick builds on (React Aria `placeholderValue`). @default 00:00 */
  placeholderValue?: Time
  /** Extra check on a typed time: return an error message, or nothing when valid. */
  validate?: (value: Time) => string | string[] | true | null | undefined
  /** Form field name; submits `HH:mm[:ss]`. */
  name?: string
}

export interface TimeRange {
  start: Time
  end: Time
}

export interface TimeRangePickerProps extends PickerBaseProps {
  /** Both ends, or `null`. An end before the start is allowed (overnight shift). */
  value?: TimeRange | null
  defaultValue?: TimeRange | null
  onChange?: (value: TimeRange | null) => void
  /** @default ['Giờ bắt đầu', 'Giờ kết thúc'] */
  placeholder?: [string, string]
  startName?: string
  endName?: string
}

type Part = 'start' | 'end'
type Parts = Record<Part, Time | null>

function useControlled<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue)
  const current = value !== undefined ? value : inner
  const set = (next: T) => {
    if (value === undefined) setInner(next)
    onChange?.(next)
  }
  return [current, set] as const
}

const sameTime = (a: Time | null | undefined, b: Time | null | undefined) => (a == null || b == null ? a == b : a.compare(b) === 0)
const toParts = (v: TimeRange | null | undefined): Parts => ({ start: v?.start ?? null, end: v?.end ?? null })

/** Only `disabledTime` needs a custom message; React Aria validates min / max itself. */
function unavailableCheck(constraints: TimeConstraints, message: string, validate?: TimePickerProps['validate']) {
  return (t: Time) => {
    if (constraints.disabledTime && isTimeDisabled(t, { ...constraints, minValue: null, maxValue: null })) return message
    return validate?.(t)
  }
}

const VALID: ValidityState = {
  badInput: false, customError: false, patternMismatch: false, rangeOverflow: false, rangeUnderflow: false,
  stepMismatch: false, tooLong: false, tooShort: false, typeMismatch: false, valid: true, valueMissing: false,
}

/* ------------------------------------------------------------------ */

interface BoxProps {
  boxRef: RefObject<HTMLDivElement | null>
  size: InputSize
  variant: InputVariant
  status?: InputStatus
  isInvalid?: boolean
  isDisabled?: boolean
  isOpen: boolean
  /** Alt + ↓ inside the box. */
  onOpenKey: (target: HTMLElement) => void
  children: ReactNode
}

/**
 * The bordered box: TextField's control classes (variants, sizes, status,
 * hover / focus ring). A plain div, because TimeField hands its group props to
 * DateInput; hover and focus-within are tracked here and written as the same
 * data attributes a React Aria Group sets. While the panel is open the box
 * keeps `data-focus-within` so it stays drawn active (focus is in the panel).
 */
function Box({ boxRef, size, variant, status, isInvalid, isDisabled, isOpen, onOpenKey, children }: BoxProps) {
  const { hoverProps, isHovered } = useHover({ isDisabled })
  const [isFocusWithin, setFocusWithin] = useState(false)
  const { focusWithinProps } = useFocusWithin({ onFocusWithinChange: setFocusWithin })
  const onKeyDownCapture = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.altKey || e.key !== 'ArrowDown') return
    e.preventDefault()
    e.stopPropagation()
    onOpenKey(e.target as HTMLElement)
  }
  return (
    <div
      ref={boxRef}
      {...mergeProps(hoverProps, focusWithinProps)}
      onKeyDownCapture={onKeyDownCapture}
      className={cx(controlClasses({ size, variant, status }), styles.box)}
      data-size={size}
      data-status={status}
      data-hovered={isHovered || undefined}
      data-focus-within={isFocusWithin || isOpen || undefined}
      data-open={isOpen || undefined}
      data-disabled={isDisabled || undefined}
      data-invalid={isInvalid || undefined}
    >
      {children}
    </div>
  )
}

/**
 * One editable time inside the box: React Aria segments over a hit area that
 * opens the panel. While empty and unfocused the segments are hidden behind
 * the placeholder text and the whole area opens the panel;
 * Tab still reaches the segments for typing.
 */
function Segments({ placeholder, onPress, bar, isActive }: { placeholder: string; onPress: () => void; bar?: 'focus' | 'active' | false; isActive?: boolean }) {
  const state = useContext(TimeFieldStateContext)
  const [isFocused, setFocused] = useState(false)
  const { focusWithinProps } = useFocusWithin({ onFocusWithinChange: setFocused })
  const isEmpty = !state || state.segments.every((s) => !s.isEditable || s.isPlaceholder)
  const showPlaceholder = isEmpty && !isFocused
  const showBar = bar === 'active' ? isActive : bar === 'focus' ? isFocused : false

  return (
    <div {...focusWithinProps} className={cx(styles.part, showPlaceholder && styles.empty)} data-active={showBar || undefined}>
      {/* Pointer-only hit area; keyboard users open with the clock button or Alt + ↓. */}
      <span className={styles.cover} aria-hidden="true" onClick={state?.isDisabled || state?.isReadOnly ? undefined : onPress} />
      <DateInput className={styles.input}>{(segment) => <DateSegment segment={segment} className={styles.segment} />}</DateInput>
      {showPlaceholder && <span className={styles.placeholder} aria-hidden="true">{placeholder}</span>}
    </div>
  )
}

function ClockButton({ buttonRef, label, isOpen, isDisabled, onPress }: { buttonRef: RefObject<HTMLButtonElement | null>; label: string; isOpen: boolean; isDisabled?: boolean; onPress: () => void }) {
  return (
    <AriaButton
      ref={buttonRef}
      className={cx(input.iconButton, styles.suffix)}
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      isDisabled={isDisabled}
      onPress={onPress}
    >
      <Clock />
    </AriaButton>
  )
}

function ClearButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <AriaButton className={cx(input.iconButton, styles.clear)} aria-label={label} onPress={onPress}>
      <XCircle />
    </AriaButton>
  )
}

const focusFirstSegment = (root: HTMLElement | null) => root?.querySelector<HTMLElement>('[role="spinbutton"]')?.focus()

interface PanelProps extends TimeConstraints {
  isOpen: boolean
  onDismiss: () => void
  triggerRef: RefObject<Element | null>
  placement: 'bottom' | 'top'
  title: string
  /** Remounts the columns (range: start → end) so they refocus and rescroll. */
  columnsKey?: string
  value: Time | null
  onChange: (value: Time) => void
  onConfirm: (value: Time) => void
  showNow: boolean
  hourCycle?: 12 | 24
  placeholderValue?: Time
  labels: TimePickerLabels
}

/**
 * Figma "TimePicker Menu": columns + footer ("Bây giờ" (Now) link, "OK" primary)
 * on the shared overlay surface. The popover itself is the dialog, so React
 * Aria keeps focus inside it and returns it to the box on close.
 */
function Panel({ isOpen, onDismiss, triggerRef, placement, title, columnsKey, value, onChange, onConfirm, showNow, hourCycle, placeholderValue, labels, ...constraints }: PanelProps) {
  const granularity = constraints.granularity ?? 'minute'
  const confirm = (t: Time | null) => {
    if (t && !isTimeDisabled(t, constraints)) onConfirm(t)
  }
  return (
    <AriaPopover
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) onDismiss() }}
      triggerRef={triggerRef}
      placement={`${placement} start`}
      offset={4}
      aria-label={title}
      className={overlay.surface}
    >
      <TimeColumns
        key={columnsKey}
        autoFocus
        value={value}
        onChange={onChange}
        onConfirm={confirm}
        placeholderValue={placeholderValue}
        hourCycle={hourCycle}
        labels={labels}
        {...constraints}
      />
      <div className={styles.footer}>
        {showNow && (
          <Button variant="link" size="sm" isDisabled={isOpen && isTimeDisabled(currentTime(granularity), constraints)} onPress={() => confirm(currentTime(granularity))}>
            {labels.now}
          </Button>
        )}
        <Button variant="primary" size="sm" className={styles.ok} isDisabled={value == null || isTimeDisabled(value, constraints)} onPress={() => confirm(value)}>
          {labels.ok}
        </Button>
      </div>
    </AriaPopover>
  )
}

/** Reads the TimeField state (validation included) for the box. */
function SingleBox(props: Omit<BoxProps, 'isInvalid'>) {
  const state = useContext(TimeFieldStateContext)
  return <Box {...props} isInvalid={state?.isInvalid} />
}

/* ------------------------------------------------------------------ */

/**
 * Figma "❖ TimePicker": type a time in React Aria segments (24-hour for
 * vi-VN) or pick it from scrolling hour / minute / second columns. The panel
 * holds a draft shown in the box; "OK" or Enter commits it, "Bây giờ" picks
 * the current time, Esc or a click outside discards it. Field chrome (label,
 * description, error, 4 variants × status × 3 sizes) is TextField's.
 */
export function TimePicker(props: TimePickerProps) {
  const {
    label, description, errorMessage, size = 'md', variant = 'outlined', status, placeholder = 'Chọn giờ', prefix,
    allowClear = true, showNow = true, placement = 'bottom', isDisabled, isReadOnly, isRequired, isInvalid, autoFocus,
    name, validate, placeholderValue, hourCycle, shouldForceLeadingZeros = true, labels, className, 'aria-label': ariaLabel,
    granularity, hourStep, minuteStep, secondStep, minValue, maxValue, disabledTime,
  } = props
  const constraints: TimeConstraints = { granularity, hourStep, minuteStep, secondStep, minValue, maxValue, disabledTime }
  const text = { ...LABELS, ...labels }
  const [value, setValue] = useControlled(props.value, props.defaultValue ?? null, props.onChange)
  const [openState, setOpen] = useControlled(props.isOpen, props.defaultOpen ?? false, props.onOpenChange)
  const isOpen = openState && !isDisabled && !isReadOnly
  const [draft, setDraft] = useState<Time | null>(value)
  const [wasOpen, setWasOpen] = useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) setDraft(value)
  }
  const boxRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const frame = fieldFrame({ label, description, errorMessage, isRequired })
  const canOpen = !isDisabled && !isReadOnly

  const open = () => { if (canOpen) setOpen(true) }
  const pressOpen = () => {
    triggerRef.current?.focus()
    open()
  }

  return (
    <TimeField
      value={isOpen ? draft : value}
      onChange={(t) => setValue(t)}
      granularity={granularity}
      hourCycle={hourCycle}
      shouldForceLeadingZeros={shouldForceLeadingZeros}
      minValue={minValue}
      maxValue={maxValue}
      placeholderValue={placeholderValue}
      validate={unavailableCheck(constraints, text.unavailable, validate)}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      isInvalid={status === 'error' ? true : isInvalid}
      name={name}
      autoFocus={autoFocus}
      aria-label={ariaLabel}
      className={cx(input.field, className)}
    >
      {frame.label}
      <SingleBox boxRef={boxRef} size={size} variant={variant} status={status} isDisabled={isDisabled} isOpen={isOpen} onOpenKey={open}>
        {prefix != null && <span className={cx(input.affix, styles.prefix)}>{prefix}</span>}
        <Segments placeholder={placeholder} onPress={pressOpen} />
        <ClockButton buttonRef={triggerRef} label={text.open} isOpen={isOpen} isDisabled={!canOpen} onPress={open} />
        {allowClear && value != null && canOpen && (
          <ClearButton
            label={text.clear}
            onPress={() => {
              setValue(null)
              focusFirstSegment(boxRef.current)
            }}
          />
        )}
      </SingleBox>
      {frame.after}
      <Panel
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        triggerRef={boxRef}
        placement={placement}
        title={text.open}
        value={draft}
        onChange={setDraft}
        onConfirm={(t) => {
          setValue(t)
          setOpen(false)
        }}
        showNow={showNow}
        hourCycle={hourCycle}
        placeholderValue={placeholderValue}
        labels={text}
        {...constraints}
      />
    </TimeField>
  )
}

/**
 * Figma TimePicker `Range=True`: start → end in one box. The panel edits one
 * half at a time, anchored under it with the active bar: "OK" on the start
 * moves on to the end, "OK" on the end commits both.
 */
export function TimeRangePicker(props: TimeRangePickerProps) {
  const {
    label, description, errorMessage, size = 'md', variant = 'outlined', status, placeholder, prefix,
    allowClear = true, showNow = true, placement = 'bottom', isDisabled, isReadOnly, isRequired, isInvalid, autoFocus,
    startName, endName, hourCycle, shouldForceLeadingZeros = true, labels, className, 'aria-label': ariaLabel,
    granularity, hourStep, minuteStep, secondStep, minValue, maxValue, disabledTime,
  } = props
  const constraints: TimeConstraints = { granularity, hourStep, minuteStep, secondStep, minValue, maxValue, disabledTime }
  const text = { ...LABELS, ...labels }
  const placeholders = placeholder ?? [text.start, text.end]
  const [value, setValue] = useControlled(props.value, props.defaultValue ?? null, props.onChange)
  const [openState, setOpen] = useControlled(props.isOpen, props.defaultOpen ?? false, props.onOpenChange)
  const isOpen = openState && !isDisabled && !isReadOnly
  const canOpen = !isDisabled && !isReadOnly

  // Halves typed so far. The value only changes once both are set (or both cleared).
  const [parts, setParts] = useState<Parts>(() => toParts(value))
  const [seen, setSeen] = useState(value)
  if (!sameTime(value?.start, seen?.start) || !sameTime(value?.end, seen?.end)) {
    setSeen(value)
    setParts(toParts(value))
  }
  const emit = (next: TimeRange | null) => {
    setSeen(next)
    setValue(next)
  }
  const updatePart = (part: Part, t: Time | null) => {
    const next = { ...parts, [part]: t }
    setParts(next)
    if (next.start && next.end) emit({ start: next.start, end: next.end })
    else if (value != null) emit(null)
  }

  const [active, setActive] = useState<Part>('start')
  const [draft, setDraft] = useState<Parts>(parts)
  const [wasOpen, setWasOpen] = useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) setDraft(parts)
  }

  const boxRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const startRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const labelId = useId()
  const descriptionId = useId()
  const errorId = useId()
  const invalid = status === 'error' || Boolean(isInvalid)
  const describedBy = [description != null && descriptionId, invalid && errorMessage != null && errorId].filter(Boolean).join(' ') || undefined
  const frame = fieldFrame({ label, description, errorMessage, isRequired })

  const openAt = (part: Part) => {
    if (!canOpen) return
    setActive(part)
    setOpen(true)
  }
  const partOf = (target: HTMLElement): Part => (endRef.current?.contains(target) ? 'end' : 'start')

  const confirm = (t: Time) => {
    const next = { ...draft, [active]: t }
    setDraft(next)
    if (active === 'start') return setActive('end')
    if (!next.start) return setActive('start')
    setParts(next)
    emit({ start: next.start, end: t })
    setOpen(false)
  }

  const shown = isOpen ? draft : parts
  const field = (part: Part, index: number) => (
    <TimeField
      ref={part === 'start' ? startRef : endRef}
      value={shown[part]}
      onChange={(t) => updatePart(part, t)}
      granularity={granularity}
      hourCycle={hourCycle}
      shouldForceLeadingZeros={shouldForceLeadingZeros}
      minValue={minValue}
      maxValue={maxValue}
      validate={unavailableCheck(constraints, text.unavailable)}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      isInvalid={invalid || undefined}
      name={part === 'start' ? startName : endName}
      autoFocus={autoFocus && part === 'start'}
      aria-label={text[part]}
      aria-labelledby={label != null ? labelId : undefined}
      aria-describedby={describedBy}
      className={styles.rangeField}
    >
      <Segments
        placeholder={placeholders[index]}
        bar={isOpen ? 'active' : 'focus'}
        isActive={active === part}
        onPress={() => {
          triggerRef.current?.focus()
          openAt(part)
        }}
      />
    </TimeField>
  )

  return (
    <div
      role="group"
      aria-labelledby={label != null ? labelId : undefined}
      aria-label={ariaLabel}
      className={cx(input.field, className)}
      data-disabled={isDisabled || undefined}
      data-invalid={invalid || undefined}
    >
      <Provider
        values={[
          [LabelContext, { id: labelId, elementType: 'span' }],
          [TextContext, { slots: { description: { id: descriptionId }, errorMessage: { id: errorId } } }],
          [FieldErrorContext, { isInvalid: invalid, validationErrors: [], validationDetails: VALID }],
        ]}
      >
        {frame.label}
        <Box
          boxRef={boxRef}
          size={size}
          variant={variant}
          status={status}
          isInvalid={invalid}
          isDisabled={isDisabled}
          isOpen={isOpen}
          onOpenKey={(target) => openAt(partOf(target))}
        >
          {prefix != null && <span className={cx(input.affix, styles.prefix)}>{prefix}</span>}
          <div className={styles.rangeContent}>
            {(['start', 'end'] as const).map((part, i) => (
              <Fragment key={part}>
                {i === 1 && <span className={styles.separator} aria-hidden="true"><ArrowRight /></span>}
                {field(part, i)}
              </Fragment>
            ))}
          </div>
          <ClockButton
            buttonRef={triggerRef}
            label={text.open}
            isOpen={isOpen}
            isDisabled={!canOpen}
            onPress={() => openAt(parts.start && !parts.end ? 'end' : 'start')}
          />
          {allowClear && (parts.start != null || parts.end != null) && canOpen && (
            <ClearButton
              label={text.clear}
              onPress={() => {
                setParts({ start: null, end: null })
                emit(null)
                focusFirstSegment(boxRef.current)
              }}
            />
          )}
        </Box>
        {frame.after}
      </Provider>
      <Panel
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        triggerRef={active === 'start' ? startRef : endRef}
        placement={placement}
        title={text[active]}
        columnsKey={active}
        value={draft[active]}
        onChange={(t) => setDraft({ ...draft, [active]: t })}
        onConfirm={confirm}
        showNow={showNow}
        hourCycle={hourCycle}
        labels={text}
        {...constraints}
      />
    </div>
  )
}

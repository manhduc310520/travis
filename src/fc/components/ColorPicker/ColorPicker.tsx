import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { mergeProps, useFocusRing } from 'react-aria'
import {
  Button as AriaButton,
  ColorArea,
  ColorPicker as AriaColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorThumb,
  Dialog,
  DialogTrigger,
  Disclosure,
  DisclosurePanel,
  OverlayArrow,
  Popover as AriaPopover,
  SliderTrack,
  type Color,
  type Key,
} from 'react-aria-components'
import { Check, ChevronDown } from '../../../icons'
import { cx } from '../../space'
import overlay from '../../overlay.module.css'
import { Divider } from '../Divider/Divider'
import { TextField } from '../Input/Input'
import { InputNumber } from '../InputNumber/InputNumber'
import { Segmented } from '../Segmented/Segmented'
import { Select } from '../Select/Select'
import {
  colorAt,
  defaultStops,
  gradientToCss,
  isBright,
  sortStops,
  toHsb,
  toStops,
  type ColorPickerStop,
} from './gradient'
import styles from './ColorPicker.module.css'

export type { ColorPickerStop } from './gradient'

/** Figma trigger Size: Small 24 / Medium 32 / Large 40. */
export type ColorPickerSize = 'sm' | 'md' | 'lg'
/** Figma popup Gradient=False (`single`) / Gradient=True (`gradient`). */
export type ColorPickerMode = 'single' | 'gradient'
/** Figma "Color Select HEX / RGB / HSB" (popup property Format). */
export type ColorPickerFormat = 'hex' | 'rgb' | 'hsb'
/** A colour string or `Color`, a gradient (stop list), or `null` for "no colour". */
export type ColorPickerValue = string | Color | ColorPickerStop[] | null

export interface ColorPickerPreset {
  /** Group heading, the collapse trigger (Figma "Presets Collapse", e.g. "Đề xuất", "Gần đây"). */
  label: ReactNode
  /** Colours as hex / rgb strings. An empty list shows the empty line (Figma "Empty"). */
  colors: string[]
  /** Expanded at first. Default true, as in Figma. */
  defaultOpen?: boolean
}

/** Built-in texts (Vietnamese by default). */
export interface ColorPickerLabels {
  /** Trigger text and name when the value is cleared. */
  empty: string
  /** Figma "Color Clear" button. */
  clear: string
  /** Name of the Single / Gradient switch. */
  mode: string
  single: string
  gradient: string
  /** Name of the HEX / RGB / HSB select. */
  format: string
  hex: string
  hue: string
  saturation: string
  brightness: string
  red: string
  green: string
  blue: string
  alpha: string
  /** Name of the gradient bar. */
  gradientBar: string
  /** Name of one gradient handle, 1-based. */
  stop: (n: number) => string
  /** Shown in a preset group with no colours (Figma "Empty"). */
  presetsEmpty: string
}

const LABELS: ColorPickerLabels = {
  empty: 'Chưa chọn màu',
  clear: 'Xóa màu',
  mode: 'Kiểu tô màu',
  single: 'Đơn sắc',
  gradient: 'Chuyển màu',
  format: 'Định dạng màu',
  hex: 'Mã màu HEX',
  hue: 'Sắc độ',
  saturation: 'Độ bão hòa',
  brightness: 'Độ chói',
  red: 'Đỏ',
  green: 'Xanh lá',
  blue: 'Xanh dương',
  alpha: 'Độ trong suốt',
  gradientBar: 'Dải chuyển màu',
  stop: (n) => `Điểm màu ${n}`,
  presetsEmpty: 'Chưa có màu',
}

export interface ColorPickerProps {
  /** Controlled value: a colour (hex / rgb / hsl string or `Color`), a stop list (gradient) or `null` (cleared). */
  value?: ColorPickerValue
  /** Uncontrolled initial value. */
  defaultValue?: ColorPickerValue
  /** Called with the new colour, the new stop list (gradient), or `null` after "Allow Clear". */
  onChange?: (value: Color | ColorPickerStop<Color>[] | null) => void
  /**
   * Figma popup Gradient. `'single'` (default) or `'gradient'`; pass both
   * (`['single', 'gradient']`) to show the Single / Gradient switch (Figma "Segmented").
   */
  mode?: ColorPickerMode | ColorPickerMode[]
  /** Figma popup Format: HEX / RGB / HSB inputs (controlled). */
  format?: ColorPickerFormat
  /** Uncontrolled initial format. Default `'hex'`, as in Figma. */
  defaultFormat?: ColorPickerFormat
  onFormatChange?: (format: ColorPickerFormat) => void
  /** Figma trigger Size — Small 24 / Medium 32 / Large 40. */
  size?: ColorPickerSize
  /** Figma trigger "Show Text?": the value in the current format next to the swatch. */
  showText?: boolean
  /** Figma trigger "Show Icon?": trailing chevron (points up while open, Figma State=Active). */
  showIcon?: boolean
  /** Figma trigger State=Disabled. */
  isDisabled?: boolean
  /** Figma popup "Allow Clear": the "no colour" button in the panel header. */
  allowClear?: boolean
  /** Figma popup "Presets": collapsible swatch groups (under the picker, or on its left when horizontal). */
  presets?: ColorPickerPreset[]
  /** Alpha slider and alpha input. Default true, as in Figma. */
  showAlpha?: boolean
  /** Figma popup Arrow. Default true. */
  showArrow?: boolean
  /** Figma popup Direction: `vertical` = presets under the picker, `horizontal` = presets on the left. */
  direction?: 'vertical' | 'horizontal'
  /** Placement of the panel relative to the trigger. */
  placement?: 'bottom start' | 'bottom' | 'top start' | 'top' | 'right' | 'left'
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /** Override the built-in Vietnamese texts. */
  labels?: Partial<ColorPickerLabels>
  /** Accessible name of the trigger and the panel. Default "Chọn màu". */
  'aria-label'?: string
  className?: string
}

type Stop = ColorPickerStop<Color>
type Current = Color | Stop[] | null

const FALLBACK = toHsb('#1677FF')

/** Props value → what the picker edits, honouring which modes are allowed. */
function normalize(v: ColorPickerValue | undefined, modes: ColorPickerMode[]): Current {
  if (v == null) return null
  if (Array.isArray(v)) {
    const stops = toStops(v)
    if (stops.length === 0) return null
    if (!modes.includes('gradient')) return stops[0].color
    return stops.length === 1 ? defaultStops(stops[0].color) : stops
  }
  const color = toHsb(v)
  return modes.includes('single') ? color : defaultStops(color)
}

const hexOf = (c: Color) => c.toString('hex').toUpperCase()
const percent = (c: Color) => Math.round(c.getChannelValue('alpha') * 100)

/** Trigger text: the colour in the chosen format, plus alpha when it is not 100%. */
function formatColor(c: Color, format: ColorPickerFormat): string {
  const a = percent(c)
  let text = hexOf(c)
  if (format === 'rgb') {
    const rgb = c.toFormat('rgb')
    text = `rgb(${(['red', 'green', 'blue'] as const).map((ch) => Math.round(rgb.getChannelValue(ch))).join(', ')})`
  } else if (format === 'hsb') {
    const [h, s, b] = (['hue', 'saturation', 'brightness'] as const).map((ch) => Math.round(c.getChannelValue(ch)))
    text = `hsb(${h}, ${s}%, ${b}%)`
  }
  return a < 100 ? `${text} · ${a}%` : text
}

const FORMATS = [
  { key: 'hex', label: 'HEX' },
  { key: 'rgb', label: 'RGB' },
  { key: 'hsb', label: 'HSB' },
] satisfies { key: ColorPickerFormat; label: string }[]

const CHANNELS = {
  rgb: [['red', 255], ['green', 255], ['blue', 255]],
  hsb: [['hue', 360], ['saturation', 100], ['brightness', 100]],
} as const

/**
 * ColorPicker — Figma "❖ ColorPicker": a swatch trigger (set Trigger) that
 * opens a floating panel (set Popup, Direction × Gradient) with a saturation /
 * brightness area, hue and alpha sliders, HEX / RGB / HSB inputs, optional
 * "no colour" button, Single / Gradient switch with a multi-stop gradient bar,
 * and collapsible preset groups.
 *
 * Built on React Aria ColorPicker, ColorArea, ColorSlider, ColorSwatchPicker
 * and Disclosure; the switch, format select and inputs are fc Segmented,
 * Select, TextField and InputNumber. The gradient bar is a row of sliders
 * (one per stop): click the bar to add a stop, drag or use the arrow keys to
 * move one, Delete to remove it (at least two stay).
 */
export function ColorPicker({
  value,
  defaultValue = '#1677FF',
  onChange,
  mode = 'single',
  format: formatProp,
  defaultFormat = 'hex',
  onFormatChange,
  size = 'md',
  showText = false,
  showIcon = false,
  isDisabled,
  allowClear = false,
  presets,
  showAlpha = true,
  showArrow = true,
  placement = 'bottom start',
  direction = 'vertical',
  defaultOpen,
  isOpen,
  onOpenChange,
  labels: labelsProp,
  'aria-label': ariaLabel = 'Chọn màu',
  className,
}: ColorPickerProps) {
  const labels = { ...LABELS, ...labelsProp }
  const modes: ColorPickerMode[] = Array.isArray(mode) ? mode : [mode]
  const isControlled = value !== undefined
  const [inner, setInner] = useState<Current>(() => normalize(defaultValue, modes))
  const current = isControlled ? normalize(value, modes) : inner

  // The mode follows the value; while it is cleared, the last chosen mode is kept.
  const [modeState, setModeState] = useState<ColorPickerMode>(() => (Array.isArray(current) ? 'gradient' : modes[0]))
  const activeMode: ColorPickerMode = current == null ? modeState : Array.isArray(current) ? 'gradient' : 'single'
  const [activeStop, setActiveStop] = useState(0)
  const [formatState, setFormatState] = useState<ColorPickerFormat>(defaultFormat)
  const format = formatProp ?? formatState

  const update = (next: Current) => {
    if (!isControlled) setInner(next)
    onChange?.(next)
  }
  const setFormat = (next: ColorPickerFormat) => {
    if (formatProp === undefined) setFormatState(next)
    onFormatChange?.(next)
  }

  const stops = Array.isArray(current) ? current : defaultStops(current ?? FALLBACK)
  const stopIndex = Math.min(activeStop, stops.length - 1)
  // The colour the area, sliders, inputs and presets edit: the value, or the active gradient stop.
  const editing = activeMode === 'gradient' ? stops[stopIndex].color : ((current as Color | null) ?? FALLBACK)
  const setEditing = (c: Color) =>
    activeMode === 'gradient' ? update(stops.map((s, i) => (i === stopIndex ? { ...s, color: c } : s))) : update(c)

  const switchMode = (key: Key) => {
    const next = key as ColorPickerMode
    setModeState(next)
    setActiveStop(0)
    if (current == null || next === activeMode) return
    update(next === 'gradient' ? defaultStops(editing) : editing)
  }

  const text =
    current == null
      ? labels.empty
      : Array.isArray(current)
        ? sortStops(current).map((s) => hexOf(s.color)).join(' → ')
        : formatColor(current, format)
  const showSegmented = modes.includes('single') && modes.includes('gradient')
  const hasPresets = presets != null && presets.length > 0
  // Direction only changes the layout when there are presets to put beside the picker.
  const horizontal = direction === 'horizontal' && hasPresets

  const presetCol = hasPresets && (
    <div className={styles.presetCol}>
      {presets.map((group, i) => (
        <PresetGroup key={i} group={group} emptyText={labels.presetsEmpty} />
      ))}
    </div>
  )
  const rule = hasPresets && <Divider orientation={horizontal ? 'vertical' : 'horizontal'} className={styles.rule} />

  return (
    <DialogTrigger defaultOpen={defaultOpen} isOpen={isOpen} onOpenChange={onOpenChange}>
      <AriaButton
        className={cx(styles.trigger, styles[size], className)}
        isDisabled={isDisabled}
        aria-label={`${ariaLabel}: ${Array.isArray(current) ? `${labels.gradient} ${text}` : text}`}
      >
        <span className={styles.swatchBox}>
          {current == null ? (
            <span className={cx(styles.swatch, styles.cleared)} aria-hidden="true" />
          ) : Array.isArray(current) ? (
            <span
              className={cx(styles.swatch, styles.checker)}
              style={{ '--_fill': gradientToCss(current) } as CSSProperties}
              aria-hidden="true"
            />
          ) : (
            <ColorSwatch color={current} className={styles.swatch} />
          )}
        </span>
        {showText && <span className={styles.text}>{text}</span>}
        {showIcon && <ChevronDown className={styles.chevron} aria-hidden="true" />}
      </AriaButton>
      <AriaPopover placement={placement} offset={showArrow ? 16 : 4} className={cx(overlay.surface, styles.panel)}>
        {showArrow && (
          <OverlayArrow className={overlay.arrow}>
            <svg viewBox="0 0 16 8" aria-hidden="true"><path d="M0 0 8 8 16 0Z" /></svg>
          </OverlayArrow>
        )}
        <Dialog className={cx(styles.dialog, horizontal && styles.horizontal)} aria-label={ariaLabel}>
          <AriaColorPicker value={editing} onChange={(c) => setEditing(toHsb(c))}>
            {horizontal && presetCol}
            {horizontal && rule}
            <div className={cx(styles.pickerCol, !showAlpha && styles.noAlpha)}>
              <div className={styles.top}>
                {(showSegmented || allowClear) && (
                  <div className={styles.header}>
                    {showSegmented && (
                      <Segmented
                        size="sm"
                        aria-label={labels.mode}
                        options={[
                          { key: 'single', label: labels.single },
                          { key: 'gradient', label: labels.gradient },
                        ]}
                        selectedKey={activeMode}
                        onSelectionChange={switchMode}
                      />
                    )}
                    {allowClear && (
                      <AriaButton
                        className={cx(styles.clear, showSegmented && styles.clearTall)}
                        aria-label={labels.clear}
                        onPress={() => update(null)}
                      >
                        <span className={cx(styles.swatch, styles.cleared)} aria-hidden="true" />
                      </AriaButton>
                    )}
                  </div>
                )}
                {activeMode === 'gradient' && (
                  <GradientBar
                    stops={stops}
                    active={stopIndex}
                    onActiveChange={setActiveStop}
                    onChange={update}
                    labels={labels}
                  />
                )}
                <ColorArea className={styles.area} colorSpace="hsb" xChannel="saturation" yChannel="brightness">
                  <ColorThumb className={styles.thumb} />
                </ColorArea>
              </div>
              <div className={styles.sliders}>
                <div className={styles.sliderStack}>
                  <ColorSlider colorSpace="hsb" channel="hue" className={styles.slider} aria-label={labels.hue}>
                    <SliderTrack className={styles.track}>
                      <ColorThumb className={cx(styles.thumb, styles.sliderThumb)} />
                    </SliderTrack>
                  </ColorSlider>
                  {showAlpha && (
                    <ColorSlider channel="alpha" className={styles.slider} aria-label={labels.alpha}>
                      <SliderTrack className={cx(styles.track, styles.alphaTrack)}>
                        <ColorThumb className={cx(styles.thumb, styles.sliderThumb)} />
                      </SliderTrack>
                    </ColorSlider>
                  )}
                </div>
                <ColorSwatch className={cx(styles.swatch, styles.preview)} />
              </div>
              <div className={styles.fields}>
                <Select
                  className={styles.format}
                  variant="borderless"
                  size="sm"
                  aria-label={labels.format}
                  options={FORMATS}
                  value={format}
                  onChange={(k) => {
                    if (typeof k === 'string') setFormat(k as ColorPickerFormat)
                  }}
                />
                {format === 'hex' ? (
                  <HexField color={editing} onCommit={setEditing} label={labels.hex} />
                ) : (
                  CHANNELS[format].map(([channel, max]) => {
                    const base = format === 'rgb' ? editing.toFormat('rgb') : editing
                    return (
                      <InputNumber
                        key={channel}
                        className={styles.channel}
                        size="sm"
                        block
                        controls={false}
                        aria-label={labels[channel]}
                        minValue={0}
                        maxValue={max}
                        value={Math.round(base.getChannelValue(channel))}
                        onChange={(v) => {
                          if (!Number.isNaN(v)) setEditing(toHsb(base.withChannelValue(channel, v)))
                        }}
                      />
                    )
                  })
                )}
                {showAlpha && (
                  <InputNumber
                    className={cx(styles.channel, format === 'hex' && styles.alphaField)}
                    size="sm"
                    block
                    controls={false}
                    suffix="%"
                    aria-label={labels.alpha}
                    minValue={0}
                    maxValue={100}
                    value={percent(editing)}
                    onChange={(v) => {
                      if (!Number.isNaN(v)) setEditing(editing.withChannelValue('alpha', v / 100))
                    }}
                  />
                )}
              </div>
            </div>
            {!horizontal && rule}
            {!horizontal && presetCol}
          </AriaColorPicker>
        </Dialog>
      </AriaPopover>
    </DialogTrigger>
  )
}

/** Figma "Color Select HEX": "#" + six hex digits; applied on Enter or blur, alpha kept. */
function HexField({ color, onCommit, label }: { color: Color; onCommit: (c: Color) => void; label: string }) {
  const [draft, setDraft] = useState<string | null>(null)
  const commit = () => {
    if (draft == null) return
    if (/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(draft)) {
      onCommit(toHsb(`#${draft}`).withChannelValue('alpha', color.getChannelValue('alpha')))
    }
    setDraft(null)
  }
  return (
    <TextField
      className={styles.channel}
      size="sm"
      prefix="#"
      aria-label={label}
      value={draft ?? hexOf(color).slice(1)}
      onChange={(v) => setDraft(v.replace(/[^0-9a-f]/gi, '').slice(0, 6).toUpperCase())}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit()
      }}
    />
  )
}

/** Figma "ColorPicker / Presets Collapse": chevron + label, then the swatches or "Empty". */
function PresetGroup({ group, emptyText }: { group: ColorPickerPreset; emptyText: string }) {
  const labelId = useId()
  return (
    <Disclosure className={styles.presets} defaultExpanded={group.defaultOpen ?? true}>
      <AriaButton slot="trigger" className={styles.presetTrigger}>
        <ChevronDown className={styles.presetChevron} aria-hidden="true" />
        <span id={labelId}>{group.label}</span>
      </AriaButton>
      <DisclosurePanel>
        {group.colors.length === 0 ? (
          <div className={styles.presetEmpty}>{emptyText}</div>
        ) : (
          <ColorSwatchPicker aria-labelledby={labelId} className={styles.swatchGrid}>
            {group.colors.map((c) => (
              <ColorSwatchPickerItem key={c} color={c} className={styles.swatchItem}>
                {({ isSelected, color }) => (
                  <>
                    <ColorSwatch className={styles.swatch} />
                    {isSelected && <Check className={cx(styles.check, checkTone(color))} aria-hidden="true" />}
                  </>
                )}
              </ColorSwatchPickerItem>
            ))}
          </ColorSwatchPicker>
        )}
      </DisclosurePanel>
    </Disclosure>
  )
}

/** Figma draws a white tick; on bright or see-through swatches it flips so it stays readable. */
const checkTone = (c: Color) =>
  c.getChannelValue('alpha') < 0.5 ? styles.checkNeutral : isBright(c) ? styles.checkDark : styles.checkLight

interface GradientBarProps {
  stops: Stop[]
  active: number
  onActiveChange: (index: number) => void
  onChange: (stops: Stop[]) => void
  labels: ColorPickerLabels
}

/** Figma "Gradient Slider": the gradient over a checkerboard, one handle per stop. */
function GradientBar({ stops, active, onActiveChange, onChange, labels }: GradientBarProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const handles = useRef<(HTMLDivElement | null)[]>([])
  const dragging = useRef<number | null>(null)

  const offsetAt = (clientX: number) => {
    const r = trackRef.current?.getBoundingClientRect()
    if (!r || r.width === 0) return 0
    return Math.round(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }
  const focusStop = (i: number) => requestAnimationFrame(() => handles.current[i]?.focus())
  const move = (i: number, offset: number) => onChange(stops.map((s, j) => (j === i ? { ...s, offset } : s)))
  const remove = (i: number) => {
    if (stops.length <= 2) return
    const next = Math.max(0, i - 1)
    onChange(stops.filter((_, j) => j !== i))
    onActiveChange(next)
    focusStop(next)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const handle = (e.target as HTMLElement).closest<HTMLElement>('[data-stop]')
    let index = Number(handle?.dataset.stop)
    if (!handle) {
      const offset = offsetAt(e.clientX)
      index = stops.length
      onChange([...stops, { color: colorAt(stops, offset), offset }])
    }
    onActiveChange(index)
    dragging.current = index
    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
    focusStop(index)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current != null) move(dragging.current, offsetAt(e.clientX))
  }
  const endDrag = () => {
    dragging.current = null
  }

  return (
    <div
      ref={trackRef}
      role="group"
      aria-label={labels.gradientBar}
      className={cx(styles.gradient, styles.checker)}
      style={{ '--_fill': gradientToCss(stops) } as CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {stops.map((stop, i) => (
        <StopHandle
          key={i}
          index={i}
          stop={stop}
          isActive={i === active}
          label={labels.stop(i + 1)}
          handleRef={(el) => {
            handles.current[i] = el
          }}
          onFocus={() => onActiveChange(i)}
          onMove={(offset) => move(i, offset)}
          onRemove={stops.length > 2 ? () => remove(i) : undefined}
        />
      ))}
    </div>
  )
}

interface StopHandleProps {
  index: number
  stop: Stop
  isActive: boolean
  label: string
  handleRef: (el: HTMLDivElement | null) => void
  onFocus: () => void
  onMove: (offset: number) => void
  onRemove?: () => void
}

/** Figma "Slider Handle" (Active=True for the stop being edited). Keyboard: arrows ±1 (Shift ±10), Page ±10, Home / End, Delete. */
function StopHandle({ index, stop, isActive, label, handleRef, onFocus, onMove, onRemove }: StopHandleProps) {
  const { focusProps, isFocusVisible } = useFocusRing()
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 1
    let next: number
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        next = stop.offset - step
        break
      case 'ArrowRight':
      case 'ArrowUp':
        next = stop.offset + step
        break
      case 'PageDown':
        next = stop.offset - 10
        break
      case 'PageUp':
        next = stop.offset + 10
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = 100
        break
      case 'Delete':
      case 'Backspace':
        if (onRemove) {
          e.preventDefault()
          onRemove()
        }
        return
      default:
        return
    }
    e.preventDefault()
    onMove(Math.min(100, Math.max(0, next)))
  }

  return (
    <div
      {...mergeProps(focusProps, { onFocus, onKeyDown })}
      ref={handleRef}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={stop.offset}
      aria-valuetext={`${stop.offset}%, ${hexOf(stop.color)}`}
      data-stop={index}
      data-active={isActive || undefined}
      data-focus-visible={isFocusVisible || undefined}
      className={styles.stop}
      style={{ left: `${stop.offset}%`, backgroundColor: stop.color.toString('css') }}
    />
  )
}

/** Re-exported so callers can type `onChange` without importing React Aria. */
export type { Color }

import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Group, Popover as AriaPopover, TextArea as AriaTextArea, TextField, type Key } from 'react-aria-components'
import { cx } from '../../space'
import list from '../../listItem.module.css'
import overlay from '../../overlay.module.css'
import { controlClasses, fieldFrame, useFieldSize, type FieldChromeProps } from '../Input/field'
import input from '../Input/Input.module.css'
import styles from './Mentions.module.css'

/** One person / item that can be mentioned (Figma "Dropdown Menu Item" inside the Mentions menu). */
export interface MentionOption {
  type?: 'option'
  /** Text inserted after the prefix, e.g. "thu_ngan_01". */
  value: string
  /** Shown in the list; defaults to `value`. */
  label?: ReactNode
  /** Second line under the label (role, branch…). */
  description?: ReactNode
  /** Leading icon or avatar. */
  icon?: ReactNode
  /** Figma "Extra Item" (Type=Text): a short text or count at the end of the row, e.g. a staff code or "12 người". */
  extra?: ReactNode
  isDisabled?: boolean
}

/**
 * A titled group (Figma "Dropdown Group Title" row). Neighbouring groups and
 * ungrouped options are split by a divider (Figma "Dropdown Divider").
 */
export interface MentionGroup {
  type: 'group'
  key: Key
  label: ReactNode
  children: MentionOption[]
}

export type MentionItem = MentionOption | MentionGroup

/** Built-in texts (Vietnamese by default). */
export interface MentionsLabels {
  /** Shown when nothing matches the typed text. */
  empty: string
  /** Accessible name of the list when the box has no string `label` / `aria-label`. */
  list: string
}

const LABELS: MentionsLabels = { empty: 'Không có kết quả', list: 'Danh sách gợi ý' }

export interface MentionsProps extends Omit<FieldChromeProps, 'showCount'> {
  /** Options, or titled groups of options (Figma "Group title" rows). */
  options: MentionItem[]
  /** Character(s) that open the list. Default `@`. */
  prefix?: string | string[]
  /** Put after an inserted mention. Default a space. */
  split?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** A mention was inserted. */
  onSelect?: (option: MentionOption, prefix: string) => void
  /** Typed text after the prefix changed (e.g. to load options from the server). */
  onSearch?: (text: string, prefix: string) => void
  /** Your own match test; default: accent- and case-insensitive "contains" on `value` and string `label`. */
  filterOption?: false | ((input: string, option: MentionOption) => boolean)
  /** Figma "Placement": list below (Bottom, default) or above (Top) the box. */
  placement?: 'bottom' | 'top'
  /** Visible lines. Default 1 (a single-line box: 32 high at Figma Size=Default, 24 Small, 40 Large). */
  rows?: number
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  name?: string
  autoFocus?: boolean
  /**
   * Show the list on first render (for docs / the Figma State=Focused examples).
   * If `defaultValue` ends with a prefix ("@") the list filters on it as if typed.
   */
  defaultOpen?: boolean
  labels?: Partial<MentionsLabels>
  'aria-label'?: string
}

/** Accent- and case-insensitive form: "Phở bò" → "pho bo", "Đá" → "da". */
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
const labelText = (o: MentionOption) => (typeof o.label === 'string' ? o.label : '')
const defaultFilter = (text: string, o: MentionOption) =>
  fold(o.value).includes(fold(text)) || fold(labelText(o)).includes(fold(text))

interface Trigger { prefix: string; start: number; text: string }

/** Finds "@abc" right before the caret: the prefix starts the text or follows whitespace, and no whitespace after it. */
function findTrigger(value: string, caret: number, prefixes: string[]): Trigger | null {
  const before = value.slice(0, caret)
  let best: Trigger | null = null
  for (const p of prefixes) {
    const at = before.lastIndexOf(p)
    if (at < 0) continue
    if (at > 0 && !/\s/.test(before[at - 1])) continue
    const text = before.slice(at + p.length)
    if (/\s/.test(text)) continue
    if (!best || at > best.start) best = { prefix: p, start: at, text }
  }
  return best
}

interface Section { key: Key; label?: ReactNode; rows: { option: MentionOption; index: number }[] }

/** Groups the matching options into sections (a titled group, or a run of ungrouped options) plus a flat list for the keyboard. */
function buildSections(items: MentionItem[], keep: (o: MentionOption) => boolean) {
  const sections: Section[] = []
  const flat: MentionOption[] = []
  let loose: Section | null = null
  const add = (s: Section, o: MentionOption) => {
    if (!keep(o)) return
    s.rows.push({ option: o, index: flat.length })
    flat.push(o)
  }
  items.forEach((item, i) => {
    if (item.type === 'group') {
      loose = null
      const s: Section = { key: item.key, label: item.label, rows: [] }
      for (const o of item.children) add(s, o)
      sections.push(s)
      return
    }
    if (!loose) {
      loose = { key: `options-${i}`, rows: [] }
      sections.push(loose)
    }
    add(loose, item)
  })
  return { sections: sections.filter((s) => s.rows.length > 0), flat }
}

const MIRRORED = [
  'box-sizing', 'width', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-top-width',
  'border-right-width', 'border-bottom-width', 'border-left-width', 'border-style', 'font-family', 'font-size',
  'font-style', 'font-weight', 'font-stretch', 'font-variant', 'line-height', 'letter-spacing', 'word-spacing',
  'text-transform', 'text-indent', 'tab-size',
]

/** X of character `index` from the textarea's left edge: a hidden copy of the text up to it, then a marker. */
function caretX(area: HTMLTextAreaElement, index: number): number {
  const cs = getComputedStyle(area)
  const mirror = document.createElement('div')
  for (const p of MIRRORED) mirror.style.setProperty(p, cs.getPropertyValue(p))
  Object.assign(mirror.style, { position: 'fixed', inset: '0 auto auto 0', visibility: 'hidden', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' })
  mirror.textContent = area.value.slice(0, index)
  const mark = document.createElement('span')
  mark.textContent = '​'
  mirror.append(mark)
  document.body.append(mirror)
  const x = area.clientLeft + mark.offsetLeft - area.scrollLeft
  mirror.remove()
  return x
}

/**
 * Figma "❖ Mentions": a text box that suggests people / items after a prefix
 * (`@` by default) and inserts the chosen one. Box = shared field chrome
 * (Input.module.css; Figma Size Default / Large / Small, State Default /
 * Focused). List = Figma "Dropdown Menu" (Component/Dropdown/*): shared overlay
 * surface + list rows, with optional group titles, dividers and a right-hand
 * extra. It opens under (Placement Bottom) or above (Top) the box, starting at
 * the typed prefix, and is as wide as its content. Focus stays in the box;
 * ↑ ↓ move, Enter / Tab insert, Esc closes.
 */
export function Mentions(props: MentionsProps) {
  const {
    options, prefix = '@', split = ' ', filterOption, placement = 'bottom', rows = 1, label, tooltip, description, errorMessage,
    size: sizeProp, variant = 'outlined', status, placeholder, isDisabled, isReadOnly, isRequired, isInvalid, name,
    autoFocus, defaultOpen = false, className, 'aria-label': ariaLabel, onSelect, onSearch,
  } = props
  const labels = { ...LABELS, ...props.labels }
  const prefixes = Array.isArray(prefix) ? prefix : [prefix]
  const size = useFieldSize(sizeProp)
  const [inner, setInner] = useState(props.defaultValue ?? '')
  const text = props.value ?? inner
  const [trigger, setTrigger] = useState<Trigger | null>(() => {
    if (!defaultOpen) return null
    const initial = props.value ?? props.defaultValue ?? ''
    return findTrigger(initial, initial.length, prefixes) ?? { prefix: prefixes[0], start: -1, text: '' }
  })
  const [active, setActive] = useState(0)
  const [crossOffset, setCrossOffset] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)
  const areaRef = useRef<HTMLTextAreaElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const frame = fieldFrame({ label, description, errorMessage, isRequired, tooltip })

  const keep = (o: MentionOption) =>
    trigger != null && (filterOption === false || (filterOption ?? defaultFilter)(trigger.text, o))
  const { sections, flat } = buildSections(trigger ? options : [], keep)
  const isOpen = trigger != null && !isDisabled && !isReadOnly
  // Never leave the active row on a disabled option (e.g. the first match is disabled).
  const cur = flat[active] && !flat[active].isDisabled ? active : flat.findIndex((o) => !o.isDisabled)
  const activeId = isOpen && cur >= 0 ? `${listId}-${cur}` : undefined
  const triggerStart = trigger?.start

  // Figma: the list starts under the typed prefix, not at the box's edge.
  useLayoutEffect(() => {
    const area = areaRef.current
    const box = boxRef.current
    if (!isOpen || triggerStart == null || !area || !box) return
    const index = triggerStart < 0 ? area.selectionStart ?? 0 : triggerStart
    setCrossOffset(area.getBoundingClientRect().left - box.getBoundingClientRect().left + caretX(area, index))
  }, [isOpen, triggerStart])

  // Keep the keyboard-active row in view (focus stays in the box, so the browser does not scroll it).
  useEffect(() => {
    const row = activeId ? document.getElementById(activeId) : null
    const box = listRef.current
    if (!row || !box) return
    if (row.offsetTop < box.scrollTop) box.scrollTop = row.offsetTop
    else if (row.offsetTop + row.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = row.offsetTop + row.offsetHeight - box.clientHeight
  }, [activeId])

  const setText = (next: string) => {
    if (props.value === undefined) setInner(next)
    props.onChange?.(next)
  }

  const update = (value: string, caret: number) => {
    const next = findTrigger(value, caret, prefixes)
    if (next && (next.text !== trigger?.text || next.prefix !== trigger?.prefix)) {
      setActive(0)
      onSearch?.(next.text, next.prefix)
    }
    setTrigger(next)
  }

  const insert = (o: MentionOption) => {
    if (!trigger || o.isDisabled) return
    const el = areaRef.current
    const caret = el?.selectionStart ?? text.length
    const start = trigger.start < 0 ? caret : trigger.start
    const end = trigger.start < 0 ? caret : start + trigger.prefix.length + trigger.text.length
    const piece = `${trigger.prefix}${o.value}${split}`
    const next = text.slice(0, start) + piece + text.slice(end)
    setText(next)
    setTrigger(null)
    onSelect?.(o, trigger.prefix)
    const pos = start + piece.length
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(pos, pos)
    })
  }

  const move = (step: number) => {
    if (cur < 0) return
    let i = cur
    for (let n = 0; n < flat.length; n++) {
      i = (i + step + flat.length) % flat.length
      if (!flat[i].isDisabled) break
    }
    setActive(i)
  }

  const renderRow = ({ option: o, index: i }: Section['rows'][number]) => (
    <div
      key={o.value}
      id={`${listId}-${i}`}
      role="option"
      aria-selected={i === cur}
      aria-disabled={o.isDisabled || undefined}
      data-focused={i === cur || undefined}
      data-disabled={o.isDisabled || undefined}
      className={cx(list.item, styles.option)}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => { if (!o.isDisabled) setActive(i) }}
      onClick={() => insert(o)}
    >
      {o.icon != null && <span className={list.icon} aria-hidden="true">{o.icon}</span>}
      <span className={styles.optionText}>
        <span className={list.label}>{o.label ?? o.value}</span>
        {o.description != null && <span className={list.description}>{o.description}</span>}
      </span>
      {o.extra != null && <span className={cx(list.extra, styles.extra)}>{o.extra}</span>}
    </div>
  )

  return (
    <TextField
      className={cx(input.field, className)}
      value={text}
      onChange={(v) => {
        setText(v)
        update(v, areaRef.current?.selectionStart ?? v.length)
      }}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      isInvalid={isInvalid || status === 'error'}
      name={name}
      autoFocus={autoFocus}
      aria-label={ariaLabel}
    >
      {frame.label}
      <Group
        ref={boxRef}
        className={cx(controlClasses({ size, variant, status }), input.multiline, styles.box, size !== 'md' && styles[size])}
      >
        <AriaTextArea
          ref={areaRef}
          rows={rows}
          placeholder={placeholder}
          className={cx(input.input, input.textarea, styles.textarea)}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          onKeyDown={(e) => {
            if (!isOpen) return
            if (e.key === 'ArrowDown') { e.preventDefault(); move(1) }
            else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1) }
            else if ((e.key === 'Enter' || e.key === 'Tab') && cur >= 0) { e.preventDefault(); insert(flat[cur]) }
            else if (e.key === 'Escape') { e.preventDefault(); setTrigger(null) }
          }}
          onKeyUp={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
              update(e.currentTarget.value, e.currentTarget.selectionStart)
            }
          }}
          onClick={(e) => update(e.currentTarget.value, e.currentTarget.selectionStart)}
          onBlur={() => { if (!defaultOpen) setTrigger(null) }}
        />
      </Group>
      {frame.after}
      <AriaPopover
        triggerRef={boxRef}
        isOpen={isOpen}
        onOpenChange={(open) => { if (!open) setTrigger(null) }}
        isNonModal
        placement={placement === 'top' ? 'top start' : 'bottom start'}
        offset={4}
        crossOffset={crossOffset}
        className={cx(overlay.surface, styles.popover)}
      >
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel ?? (typeof label === 'string' ? label : labels.list)}
          className={cx(list.list, styles.list)}
        >
          {flat.length === 0 && <div className={list.empty}>{labels.empty}</div>}
          {sections.map((s, si) => (
            <Fragment key={s.key}>
              {si > 0 && <div className={cx(list.separator, styles.separator)} aria-hidden="true" />}
              {s.label != null ? (
                <div role="group" aria-labelledby={`${listId}-g${si}`}>
                  <div id={`${listId}-g${si}`} className={cx(list.header, styles.header)}>{s.label}</div>
                  {s.rows.map(renderRow)}
                </div>
              ) : s.rows.map(renderRow)}
            </Fragment>
          ))}
        </div>
      </AriaPopover>
    </TextField>
  )
}

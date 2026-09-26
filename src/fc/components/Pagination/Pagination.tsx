import { useState, type ReactNode } from 'react'
import { Button as AriaButton, Group, Input, Label, NumberField, Text } from 'react-aria-components'
import { ChevronLeft, ChevronLeftDouble, ChevronRight, ChevronRightDouble, DotsHorizontal } from '../../../icons'
import { cx } from '../../space'
import { controlClasses } from '../Input/field'
import inputStyles from '../Input/Input.module.css'
import styles from './Pagination.module.css'

/** Figma item Size: Small (= Variant Mini) / Default / Large. */
export type PaginationSize = 'sm' | 'md' | 'lg'
/** `default` = page items (Figma Basic / More / Jumper / Mini / Prev and next); `simple` = Figma Simple. */
export type PaginationVariant = 'default' | 'simple'

/** Every visible or announced string, overridable one by one. */
export interface PaginationLabels {
  /** Name of the `nav` landmark. */
  nav: string
  previous: string
  next: string
  /** The "•••" item before the current page. */
  jumpPrevious: string
  /** The "•••" item after it. */
  jumpNext: string
  /** Name of a page button; the visible number is part of it. */
  page: (page: number) => string
  /** Visible label of the jumper field. */
  jumper: string
  /** Name of the page field in the `simple` variant. */
  simpleInput: string
  /** Screen-reader text after the `simple` field (visible: "/ 10"). */
  of: (pageCount: number) => string
  /** `showTotal` text. */
  total: (total: number, range: [number, number]) => ReactNode
}

const fmt = new Intl.NumberFormat('vi-VN')

const LABELS: PaginationLabels = {
  nav: 'Phân trang',
  previous: 'Trang trước',
  next: 'Trang sau',
  jumpPrevious: '5 trang trước',
  jumpNext: '5 trang sau',
  page: (page) => `Trang ${page}`,
  jumper: 'Đến trang',
  simpleInput: 'Trang hiện tại',
  of: (pageCount) => `trên tổng ${pageCount} trang`,
  total: (total) => `Tổng ${fmt.format(total)} mục`,
}

export interface PaginationProps {
  /** Number of items being paged. */
  total: number
  /** Items per page. Defaults to 10. */
  pageSize?: number
  /** Current page (controlled), 1-based. */
  current?: number
  /** First page shown (uncontrolled). Defaults to 1. */
  defaultCurrent?: number
  onChange?: (page: number, pageSize: number) => void
  variant?: PaginationVariant
  /** `sm` is Figma Variant Mini. */
  size?: PaginationSize
  /** Figma Variant Jumper / Mini Jumper: "Đến trang [ ]" after the items. Enter or leaving the field jumps. */
  showJumper?: boolean
  /** `text` = Figma Variant "Prev and next": "Trang trước" / "Trang sau" instead of arrows. */
  prevNext?: 'icon' | 'text'
  /** "Tổng 85 mục" before the items; pass a function for your own text. */
  showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode)
  /**
   * Slot for the page-size changer (fc Select), placed after the "next"
   * button. Wire its value to `pageSize`.
   */
  pageSizeChanger?: ReactNode
  isDisabled?: boolean
  labels?: Partial<PaginationLabels>
  /** Name of the landmark; overrides `labels.nav`. */
  'aria-label'?: string
  className?: string
}

type Entry = number | 'jump-prev' | 'jump-next'
const JUMP = 5
const BUFFER = 2

/** Page numbers around the current one; the rest fold into "•••" (Figma Variant More). */
function pageEntries(current: number, pageCount: number): Entry[] {
  if (pageCount <= 3 + BUFFER * 2) return Array.from({ length: pageCount }, (_, i) => i + 1)
  let left = Math.max(1, current - BUFFER)
  let right = Math.min(current + BUFFER, pageCount)
  if (current - 1 <= BUFFER) right = 1 + BUFFER * 2
  if (pageCount - current <= BUFFER) left = pageCount - BUFFER * 2
  const entries: Entry[] = []
  for (let p = left; p <= right; p++) entries.push(p)
  if (current - 1 >= BUFFER * 2 && current !== 1 + 2) entries.unshift('jump-prev')
  if (pageCount - current >= BUFFER * 2 && current !== pageCount - 2) entries.push('jump-next')
  if (left !== 1) entries.unshift(1)
  if (right !== pageCount) entries.push(pageCount)
  return entries
}

const NUMBER_FORMAT = { useGrouping: false, maximumFractionDigits: 0 }

/**
 * Figma "❖ Pagination". A `nav` landmark with a list of page buttons; the
 * current one has `aria-current="page"` and is marked by colour and border
 * (never weight). Many pages fold into "•••" items that jump 5 pages.
 */
export function Pagination({
  total,
  pageSize = 10,
  current,
  defaultCurrent = 1,
  onChange,
  variant = 'default',
  size = 'md',
  showJumper = false,
  prevNext = 'icon',
  showTotal = false,
  pageSizeChanger,
  isDisabled = false,
  labels,
  'aria-label': ariaLabel,
  className,
}: PaginationProps) {
  const t = { ...LABELS, ...labels }
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const [inner, setInner] = useState(defaultCurrent)
  const page = Math.min(Math.max(1, current ?? inner), pageCount)

  const go = (target: number) => {
    if (Number.isNaN(target)) return
    const next = Math.min(Math.max(1, Math.round(target)), pageCount)
    if (next === page) return
    if (current === undefined) setInner(next)
    onChange?.(next, pageSize)
  }

  const range: [number, number] = [Math.min(total, (page - 1) * pageSize + 1), Math.min(total, page * pageSize)]
  const totalText = showTotal === false ? null : typeof showTotal === 'function' ? showTotal(total, range) : t.total(total, range)
  const textArrows = prevNext === 'text'

  const arrow = (dir: 'prev' | 'next') => {
    const isPrev = dir === 'prev'
    const label = isPrev ? t.previous : t.next
    return (
      <li>
        <AriaButton
          className={cx(styles.item, textArrows && styles.textArrow)}
          aria-label={textArrows ? undefined : label}
          isDisabled={isDisabled || (isPrev ? page <= 1 : page >= pageCount)}
          onPress={() => go(isPrev ? page - 1 : page + 1)}
        >
          {textArrows ? label : isPrev ? <ChevronLeft /> : <ChevronRight />}
        </AriaButton>
      </li>
    )
  }

  const field = (el: ReactNode) => (
    <Group className={cx(controlClasses({ size }), styles.box)}>{el}</Group>
  )

  return (
    <nav
      aria-label={ariaLabel ?? t.nav}
      className={cx(styles.pagination, size !== 'md' && styles[size], className)}
    >
      <ul className={styles.list}>
        {totalText != null && <li className={styles.total}>{totalText}</li>}
        {arrow('prev')}
        {variant === 'simple' ? (
          <li>
            <NumberField
              aria-label={t.simpleInput}
              value={page}
              minValue={1}
              maxValue={pageCount}
              formatOptions={NUMBER_FORMAT}
              onChange={go}
              isDisabled={isDisabled}
              className={styles.simple}
            >
              {field(<Input className={cx(inputStyles.input, styles.input)} />)}
              <Text slot="description" className={styles.of}>
                <span aria-hidden="true">/ {pageCount}</span>
                <span className={styles.srOnly}>{t.of(pageCount)}</span>
              </Text>
            </NumberField>
          </li>
        ) : (
          pageEntries(page, pageCount).map((entry) => {
            if (typeof entry === 'number') {
              const isCurrent = entry === page
              return (
                <li key={entry}>
                  <AriaButton
                    className={styles.item}
                    aria-current={isCurrent ? 'page' : undefined}
                    aria-label={t.page(entry)}
                    isDisabled={isDisabled}
                    onPress={() => go(entry)}
                  >
                    {entry}
                  </AriaButton>
                </li>
              )
            }
            const isPrev = entry === 'jump-prev'
            return (
              <li key={entry}>
                <AriaButton
                  className={cx(styles.item, styles.jump)}
                  aria-label={isPrev ? t.jumpPrevious : t.jumpNext}
                  isDisabled={isDisabled}
                  onPress={() => go(isPrev ? page - JUMP : page + JUMP)}
                >
                  <DotsHorizontal className={styles.dots} aria-hidden="true" />
                  {isPrev
                    ? <ChevronLeftDouble className={styles.jumpIcon} aria-hidden="true" />
                    : <ChevronRightDouble className={styles.jumpIcon} aria-hidden="true" />}
                </AriaButton>
              </li>
            )
          })
        )}
        {arrow('next')}
        {pageSizeChanger != null && <li className={styles.slot}>{pageSizeChanger}</li>}
        {showJumper && variant !== 'simple' && (
          <li>
            <NumberField
              // Always empty: a committed number jumps, then the field clears.
              value={Number.NaN}
              minValue={1}
              maxValue={pageCount}
              formatOptions={NUMBER_FORMAT}
              onChange={go}
              isDisabled={isDisabled}
              className={styles.jumper}
            >
              <Label className={styles.jumperLabel}>{t.jumper}</Label>
              {field(<Input className={cx(inputStyles.input, styles.input)} />)}
            </NumberField>
          </li>
        )}
      </ul>
    </nav>
  )
}

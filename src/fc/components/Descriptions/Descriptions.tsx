import type { CSSProperties, HTMLAttributes, Key, ReactNode } from 'react'
import { cx } from '../../space'
import styles from './Descriptions.module.css'

/** Figma `Descriptions` Size: Small / Medium / Large (cell padding 8×16 / 12×24 / 16×24). */
export type DescriptionsSize = 'sm' | 'md' | 'lg'
/** `horizontal`: label beside its value. `vertical`: label above its value. */
export type DescriptionsLayout = 'horizontal' | 'vertical'

export interface DescriptionsItem {
  /** Defaults to the item's index. */
  key?: Key
  /** The term (`dt`). */
  label: ReactNode
  /** The value (`dd`): text, an fc `StatusBadge` (Figma Variant=Status), a `Tag`, a link… */
  content: ReactNode
  /**
   * Columns the item takes (default 1). `'filled'` takes the rest of the row.
   * The last item of every row stretches to close the row.
   */
  span?: number | 'filled'
}

type HeadingLevel = 2 | 3 | 4 | 5 | 6

export interface DescriptionsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  items: DescriptionsItem[]
  /** Figma `Descriptions / Basic` title (16px semibold), e.g. "Thông tin nhà hàng". */
  title?: ReactNode
  /** Heading level of the title. Defaults to 3. */
  titleLevel?: HeadingLevel
  /** Content at the end of the title row, e.g. an "Sửa" button. */
  extra?: ReactNode
  /** Figma `Descriptions` (bordered table) instead of `Descriptions / Basic`. */
  bordered?: boolean
  layout?: DescriptionsLayout
  /** Items per row. */
  column?: number
  /** Figma Size. Default `lg` — the Figma default. */
  size?: DescriptionsSize
  /** Colon after each label (horizontal, not bordered). */
  colon?: boolean
}

/** Spans that close every row: an item that does not fit pushes to the next row and its predecessor stretches. */
function rowSpans(items: DescriptionsItem[], column: number) {
  const spans: number[] = []
  let used = 0
  items.forEach((item) => {
    const wanted = item.span === 'filled' ? column : Math.min(Math.max(1, Math.floor(item.span ?? 1)), column)
    if (used > 0 && (item.span !== 'filled' && used + wanted > column)) {
      spans[spans.length - 1] += column - used
      used = 0
    }
    const span = item.span === 'filled' ? column - used : wanted
    spans.push(span)
    used += span
    if (used >= column) used = 0
  })
  if (used > 0) spans[spans.length - 1] += column - used
  return spans
}

/**
 * Figma "❖ Descriptions": read-only label / value pairs (an order, a
 * restaurant profile) as a `dl`. Each pair is a `div` with its `dt` and `dd`.
 * `bordered` draws the Figma table: tinted label cells, 1px lines.
 */
export function Descriptions({
  items,
  title,
  titleLevel = 3,
  extra,
  bordered = false,
  layout = 'horizontal',
  column = 3,
  size = 'lg',
  colon = true,
  className,
  ...rest
}: DescriptionsProps) {
  const Heading = `h${titleLevel}` as const
  const cols = Math.max(1, Math.floor(column))
  const vertical = layout === 'vertical'
  const spans = rowSpans(items, cols)
  // Bordered horizontal: every item is two grid columns (label cell + value cell).
  const trackSpan = bordered && !vertical ? 2 : 1
  const showColon = colon && !bordered && !vertical

  const itemClass = bordered
    ? vertical ? styles.itemBorderedV : styles.itemBorderedH
    : vertical ? styles.itemV : styles.itemH

  return (
    <div {...rest} className={cx(styles.descriptions, size !== 'lg' && styles[size], className)}>
      {(title != null || extra != null) && (
        <div className={styles.header}>
          {title != null && <Heading className={styles.title}>{title}</Heading>}
          {extra != null && <div className={styles.extra}>{extra}</div>}
        </div>
      )}
      <dl
        className={cx(styles.list, bordered && (vertical ? styles.listBorderedV : styles.listBorderedH))}
        style={{ '--_cols': cols } as CSSProperties}
      >
        {items.map((item, i) => (
          <div key={item.key ?? i} className={itemClass} style={{ '--_span': spans[i] * trackSpan } as CSSProperties}>
            <dt className={cx(styles.label, bordered && styles.cellLabel, showColon && styles.colon)}>{item.label}</dt>
            <dd className={cx(styles.content, bordered && styles.cellContent)}>{item.content}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

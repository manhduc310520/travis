import type { Key, ReactNode } from 'react'
import { Loading02 } from '../../../icons'
import { cx } from '../../space'
import type { PaletteHue } from '../../palette'
import palette from '../../palette.module.css'
import styles from './Timeline.module.css'

/**
 * Dot colour. Figma item Color Blue = `accent`, Green = `success`, Red =
 * `danger`, Gray = `neutral`; `warning` and the palette hues (for
 * categorising, e.g. per branch) are extras.
 */
export type TimelineColor = 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | PaletteHue
/**
 * Figma Text Placement: where the content sits against the line. Vertical:
 * `start` = Left, `end` = Right, `alternate` = sides alternate. Horizontal
 * (Figma "Timeline / Horizontal"): `start` = Top, `end` = Bottom,
 * `alternate` = Center.
 */
export type TimelineTextPlacement = 'start' | 'end' | 'alternate'

export interface TimelineItem {
  key?: Key
  /** The event. */
  content: ReactNode
  /** Figma Alternate's date column: shown on the other side of the line. */
  label?: ReactNode
  color?: TimelineColor
  /** Figma "Timeline Item / Custom": an icon instead of the dot. Coloured by `color` when given. */
  dot?: ReactNode
}

export interface TimelineProps {
  items: TimelineItem[]
  orientation?: 'vertical' | 'horizontal'
  textPlacement?: TimelineTextPlacement
  /**
   * A last item for what is still happening, with a spinning marker.
   * `true` shows the default text, "Đang cập nhật…" (Updating…).
   */
  pending?: ReactNode
  /** Marker of the pending item; defaults to a spinner. */
  pendingDot?: ReactNode
  /** Newest first: the list (and the pending item) is shown in reverse. */
  reverse?: boolean
  labels?: Partial<{ pending: string }>
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
}

const SEMANTIC: Record<string, string | undefined> = {
  accent: styles.accent,
  neutral: styles.neutral,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
}
const colorClass = (c: TimelineColor) => SEMANTIC[c] ?? cx(styles.hue, palette[c])

interface Entry extends TimelineItem {
  isPending?: boolean
}

/**
 * Figma "❖ Timeline". An ordered list of events along a line (vertical, or
 * horizontal). The marker is decorative: put anything that matters in the
 * content — colour alone never carries the meaning.
 */
export function Timeline({
  items,
  orientation = 'vertical',
  textPlacement = 'end',
  pending,
  pendingDot,
  reverse = false,
  labels,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className,
}: TimelineProps) {
  const pendingText = labels?.pending ?? 'Đang cập nhật…'
  let entries: Entry[] = [...items]
  if (pending != null && pending !== false) {
    entries.push({
      key: '__pending',
      content: pending === true ? pendingText : pending,
      dot: pendingDot ?? <Loading02 className={styles.spin} />,
      isPending: true,
    })
  }
  if (reverse) entries = entries.reverse()
  const hasLabel = entries.some((e) => e.label != null)
  const horizontal = orientation === 'horizontal'

  return (
    <ol
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={cx(
        styles.timeline,
        horizontal ? styles.horizontal : styles.vertical,
        styles[textPlacement],
        hasLabel && styles.withLabel,
        className,
      )}
    >
      {entries.map((entry, i) => {
        // Which side the content takes: alternate flips every item (the first goes to the end).
        const contentAtStart = textPlacement === 'start' || (textPlacement === 'alternate' && i % 2 === 1)
        const custom = entry.dot != null
        return (
          <li
            key={entry.key ?? i}
            aria-busy={entry.isPending || undefined}
            className={cx(
              styles.item,
              contentAtStart ? styles.contentStart : styles.contentEnd,
              i === 0 && styles.first,
              i === entries.length - 1 && styles.last,
              // The line to and from the pending item is dashed.
              (entry.isPending || entries[i - 1]?.isPending) && styles.dashBefore,
              (entry.isPending || entries[i + 1]?.isPending) && styles.dashAfter,
              colorClass(entry.color ?? 'accent'),
              custom && styles.hasCustom,
              custom && (entry.color != null || entry.isPending) && styles.tinted,
            )}
          >
            <span className={styles.rail} aria-hidden="true">
              {custom ? <span className={styles.custom}>{entry.dot}</span> : <span className={styles.dot} />}
            </span>
            <div className={styles.content}>{entry.content}</div>
            {hasLabel && <div className={styles.label}>{entry.label}</div>}
          </li>
        )
      })}
    </ol>
  )
}

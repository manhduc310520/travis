import type { Key, ReactNode } from 'react'
import { Button } from 'react-aria-components'
import { Check, ChevronRight, X } from '../../../icons'
import { cx } from '../../space'
import styles from './Steps.module.css'

/** Figma item Status Wait / Process (In Progress) / Finish / Error. */
export type StepStatus = 'wait' | 'process' | 'finish' | 'error'
/** Figma "Steps" Type: Basic (`default`) / Dot / Navigation / Inline, and "Panel Steps" (`panel`). Custom Icon = `default` with item icons. */
export type StepsType = 'default' | 'dot' | 'navigation' | 'inline' | 'panel'
/** Figma Size Medium / Small. */
export type StepsSize = 'sm' | 'md'

export interface StepItem {
  key?: Key
  title: ReactNode
  /** Figma Description. */
  description?: ReactNode
  /** Figma Time: short text after the title (a duration, a time stamp). */
  subTitle?: ReactNode
  /** Figma Type=Custom Icon: replaces the numbered circle. */
  icon?: ReactNode
  /** Overrides the status that `current` gives this step. */
  status?: StepStatus
  /** With `onChange`: this step can't be chosen. */
  isDisabled?: boolean
}

/** Screen-reader words, overridable. */
export interface StepsLabels {
  /** Read after each title. */
  status: Record<StepStatus, string>
}

const LABELS: StepsLabels = {
  status: { finish: 'đã xong', process: 'đang thực hiện', wait: 'chưa thực hiện', error: 'bị lỗi' },
}

export interface StepsProps {
  items: StepItem[]
  /** Index (0-based) of the current step. Earlier steps are `finish`, later ones `wait`. */
  current?: number
  /** Status of the current step, e.g. `error` when it failed. */
  status?: StepStatus
  type?: StepsType
  /** Figma Direction Horizontal / Vertical. Navigation, Inline and Panel are always horizontal. */
  orientation?: 'horizontal' | 'vertical'
  size?: StepsSize
  /** Figma Center=Yes (`vertical`): icon on the line, title and description centred under it. Dot steps always do this when horizontal. */
  labelPlacement?: 'horizontal' | 'vertical'
  /** Figma Progress Icon State=Progress: 0–100 ring around the current step's number. */
  percent?: number
  /** Panel only — Figma "Panel Steps" Type 1 (`filled`) / Type 2 (`outlined`). */
  variant?: 'filled' | 'outlined'
  /** Makes each step a button (Figma State=Hover); receives the chosen index. */
  onChange?: (current: number) => void
  /** Override any of the status words, e.g. `{ status: { error: 'thanh toán thất bại' } }` ("payment failed"). */
  labels?: { status?: Partial<StepsLabels['status']> }
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
}

function RingIcon({ percent }: { percent: number }) {
  const p = Math.min(100, Math.max(0, percent))
  return (
    <svg className={styles.ring} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
      <circle className={styles.ringTrack} cx={18} cy={18} r={17} strokeWidth={2} pathLength={100} />
      {p > 0 && (
        <circle className={styles.ringArc} cx={18} cy={18} r={17} strokeWidth={2} pathLength={100} strokeDasharray={`${p} 100`} transform="rotate(-90 18 18)" />
      )}
    </svg>
  )
}

/**
 * Figma "❖ Steps". An ordered list: the current step carries
 * `aria-current="step"`, and every step's status is read after its title
 * ("đã xong" (done), "bị lỗi" (failed)…) — colour and icon are never the only signal. With
 * `onChange` each step is a React Aria button.
 */
export function Steps({
  items,
  current = 0,
  status: currentStatus = 'process',
  type = 'default',
  orientation = 'horizontal',
  size = 'md',
  labelPlacement = 'horizontal',
  percent,
  variant = 'filled',
  onChange,
  labels,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className,
}: StepsProps) {
  const t = { status: { ...LABELS.status, ...labels?.status } }
  const vertical = orientation === 'vertical' && (type === 'default' || type === 'dot')
  const centered = !vertical && (type === 'dot' || (type === 'default' && labelPlacement === 'vertical'))
  const statusOf = (item: StepItem, i: number): StepStatus =>
    item.status ?? (i < current ? 'finish' : i === current ? currentStatus : 'wait')

  return (
    <ol
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={cx(
        styles.steps,
        styles[type],
        vertical ? styles.vertical : styles.horizontal,
        centered && styles.centered,
        size === 'sm' && styles.sm,
        type === 'panel' && variant === 'outlined' && styles.outlined,
        onChange && styles.clickable,
        className,
      )}
    >
      {items.map((item, i) => {
        const st = statusOf(item, i)
        const isCurrent = i === current
        const first = i === 0
        const last = i === items.length - 1
        const prevFinished = i > 0 && statusOf(items[i - 1], i - 1) === 'finish'
        const custom = item.icon != null && (type === 'default' || type === 'navigation')

        let icon: ReactNode = null
        if (type === 'dot' || type === 'inline') {
          icon = <span className={styles.iconBox}><span className={styles.dotMark} /></span>
        } else if (custom) {
          icon = <span className={cx(styles.iconBox, styles.customIcon)}>{item.icon}</span>
        } else if (type !== 'panel') {
          icon = (
            <span className={cx(styles.iconBox, styles.icon)}>
              {st === 'finish' ? <Check /> : st === 'error' ? <X /> : i + 1}
              {percent != null && isCurrent && st === 'process' && type === 'default' && <RingIcon percent={percent} />}
            </span>
          )
        }

        const inline = type === 'inline'
        const body = (
          <>
            {icon && <span aria-hidden="true" className={styles.iconSlot}>{icon}</span>}
            <span className={styles.text}>
              <span className={styles.titleRow}>
                <span className={styles.title}>
                  {item.title}
                  <span className={styles.srOnly}> ({t.status[st]})</span>
                </span>
                {item.subTitle != null && !inline && <span className={styles.subTitle}>{item.subTitle}</span>}
              </span>
              {item.description != null && (
                <span className={inline ? styles.srOnly : styles.description}>{item.description}</span>
              )}
            </span>
          </>
        )

        return (
          <li
            key={item.key ?? i}
            aria-current={!onChange && isCurrent ? 'step' : undefined}
            className={cx(
              styles.item,
              styles[st],
              isCurrent && styles.current,
              first && styles.first,
              last && styles.last,
              prevFinished && styles.prevFinish,
              custom && styles.hasCustomIcon,
            )}
          >
            {centered && !first && <span className={cx(styles.tail, styles.tailBefore)} aria-hidden="true" />}
            {onChange ? (
              <Button
                className={styles.button}
                onPress={() => onChange(i)}
                isDisabled={item.isDisabled}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {body}
              </Button>
            ) : (
              <span className={styles.button}>{body}</span>
            )}
            {!last && (type === 'default' || type === 'dot') && (
              <span className={cx(styles.tail, centered && styles.tailAfter)} aria-hidden="true" />
            )}
            {!last && type === 'navigation' && (
              <span className={styles.navArrow} aria-hidden="true"><ChevronRight /></span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

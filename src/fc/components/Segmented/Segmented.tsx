import type { ReactNode } from 'react'
import {
  SelectionIndicator,
  ToggleButton,
  ToggleButtonGroup,
  type Key,
  type ToggleButtonGroupProps,
} from 'react-aria-components'
import { cx } from '../../space'
import styles from './Segmented.module.css'

/** Figma `Segmented` Size: Small / Default / Large. */
export type SegmentedSize = 'sm' | 'md' | 'lg'
/** Figma `Segmented` Shape: Default / Round (fully rounded track and thumb). */
export type SegmentedShape = 'default' | 'round'

/** Figma `Segmented / Segmented Item`: `Icon?` + `Label?`, `Disabled`. */
export interface SegmentedOption {
  key: Key
  /** Omit for an icon-only segment — then `aria-label` is required. */
  label?: ReactNode
  /** Shown before the label. */
  icon?: ReactNode
  isDisabled?: boolean
  /** Accessible name when the segment shows only an icon. */
  'aria-label'?: string
}

export interface SegmentedProps
  extends Omit<
    ToggleButtonGroupProps,
    'children' | 'className' | 'style' | 'selectionMode' | 'disallowEmptySelection' | 'selectedKeys' | 'defaultSelectedKeys' | 'onSelectionChange'
  > {
  options: SegmentedOption[]
  /** The selected segment (controlled). */
  selectedKey?: Key
  /** The segment selected at first (uncontrolled). Defaults to the first enabled option. */
  defaultSelectedKey?: Key
  onSelectionChange?: (key: Key) => void
  size?: SegmentedSize
  /** Figma `Block`: fill the parent's width, segments share it equally. */
  block?: boolean
  shape?: SegmentedShape
  /** Names the group, e.g. "Kỳ báo cáo". Required when there is no visible label nearby (`aria-labelledby`). */
  'aria-label'?: string
  className?: string
}

/**
 * Figma "❖ Segmented". Built on React Aria `ToggleButtonGroup` in single
 * selection with no empty selection: a radio group (arrow keys move focus,
 * Space / Enter selects). The white thumb is a `SelectionIndicator` that slides
 * to the selected segment (no motion with `prefers-reduced-motion`).
 *
 * The thumb gets a 1px Color/Border/Control ring so the selection reads at 3:1
 * (WCAG 1.4.11); white on the grey track alone is 1.1:1.
 */
export function Segmented({
  options,
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  size = 'md',
  block = false,
  shape = 'default',
  orientation = 'horizontal',
  className,
  ...rest
}: SegmentedProps) {
  const vertical = orientation === 'vertical'
  const fallback = defaultSelectedKey ?? options.find((o) => !o.isDisabled)?.key

  return (
    <ToggleButtonGroup
      {...rest}
      orientation={orientation}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={selectedKey != null ? [selectedKey] : undefined}
      defaultSelectedKeys={fallback != null ? [fallback] : undefined}
      onSelectionChange={(keys) => {
        const [key] = keys
        if (key != null) onSelectionChange?.(key)
      }}
      className={cx(
        styles.segmented,
        size !== 'md' && styles[size],
        shape === 'round' && styles.round,
        block && styles.block,
        vertical && styles.vertical,
        className,
      )}
    >
      {options.map((o) => (
        <ToggleButton
          key={String(o.key)}
          id={o.key}
          isDisabled={o.isDisabled}
          aria-label={o['aria-label']}
          className={cx(styles.item, block && !vertical && styles.itemBlock)}
        >
          <SelectionIndicator className={styles.indicator} />
          {o.icon != null && <span className={styles.icon} aria-hidden="true">{o.icon}</span>}
          {o.label != null && <span className={styles.label}>{o.label}</span>}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

import type { CSSProperties, HTMLAttributes } from 'react'
import { cx, gapVar, type SpaceScale } from '../../space'
import styles from './Grid.module.css'

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  /** One step for both axes, or `[column, row]`. */
  gap?: SpaceScale | [SpaceScale, SpaceScale]
  align?: 'start' | 'center' | 'end' | 'stretch'
}

/** 24-column grid container. */
export function Row({ gap, align, className, style, ...rest }: RowProps) {
  const [col, row] = Array.isArray(gap) ? gap : [gap, gap]
  const layout: CSSProperties = { columnGap: col && gapVar(col), rowGap: row && gapVar(row), alignItems: align, ...style }
  return <div {...rest} className={cx(styles.row, className)} style={layout} />
}

type Columns = number

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns out of 24 below `sm` (and everywhere, if no breakpoint prop is set). 0 hides the column. */
  span?: Columns
  /** Empty columns before this one. */
  offset?: Columns
  /** Columns from each breakpoint up (sm ≥ 576, md ≥ 768, lg ≥ 992, xl ≥ 1200, xxl ≥ 1600). */
  sm?: Columns
  md?: Columns
  lg?: Columns
  xl?: Columns
  xxl?: Columns
}

export function Col({ span = 24, offset, sm, md, lg, xl, xxl, className, style, ...rest }: ColProps) {
  const vars = {
    '--_span': span,
    '--_start': offset ? offset + 1 : undefined,
    '--_sm': sm, '--_md': md, '--_lg': lg, '--_xl': xl, '--_xxl': xxl,
    ...style,
  } as CSSProperties
  return (
    <div
      {...rest}
      className={cx(styles.col, className)}
      style={vars}
      data-span={span}
      data-sm={sm}
      data-md={md}
      data-lg={lg}
      data-xl={xl}
      data-xxl={xxl}
    />
  )
}

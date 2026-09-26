import type { CSSProperties, ElementType, HTMLAttributes } from 'react'
import { cx, gapVar, type SpaceScale } from '../../space'
import styles from './Flex.module.css'

export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

export interface FlexProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Default `div`. */
  as?: ElementType
  direction?: 'row' | 'column'
  /** Step of the spacing scale — no raw px, so gaps stay on the 4px grid. */
  gap?: SpaceScale
  align?: FlexAlign
  justify?: FlexJustify
  wrap?: boolean
  /** `inline-flex` instead of `flex`. */
  inline?: boolean
}

const ALIGN: Record<FlexAlign, string> = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' }
const JUSTIFY: Record<FlexJustify, string> = {
  start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between', around: 'space-around', evenly: 'space-evenly',
}

export function Flex({ as: Tag = 'div', direction = 'row', gap, align, justify, wrap = false, inline = false, className, style, ...rest }: FlexProps) {
  const layout: CSSProperties = {
    flexDirection: direction,
    gap: gap && gapVar(gap),
    alignItems: align && ALIGN[align],
    justifyContent: justify && JUSTIFY[justify],
    flexWrap: wrap ? 'wrap' : undefined,
    ...style,
  }
  return <Tag {...rest} className={cx(inline ? styles.inline : styles.flex, className)} style={layout} />
}

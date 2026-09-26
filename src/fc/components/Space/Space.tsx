import { Children, Fragment, type ReactNode } from 'react'
import type { SpaceScale } from '../../space'
import { Flex, type FlexAlign, type FlexProps } from '../Flex/Flex'

export type SpaceSize = 'none' | 'sm' | 'md' | 'lg'

export interface SpaceProps extends Omit<FlexProps, 'gap' | 'inline' | 'justify'> {
  /** Figma Space: None = 0, Small (sm) = 8, Middle (md) = 16, Large (lg) = 24 at default density. */
  size?: SpaceSize
  /** Rendered between items, e.g. a vertical `<Divider />`. */
  split?: ReactNode
  align?: FlexAlign
}

const GAP: Record<SpaceSize, SpaceScale | undefined> = { none: undefined, sm: 'xs', md: 'base', lg: 'lg' }

/** Inline row (or column) of items with an even gap — Flex with sensible defaults. */
export function Space({ size = 'sm', direction = 'row', align, split, children, ...rest }: SpaceProps) {
  const items = Children.toArray(children)
  return (
    <Flex {...rest} inline direction={direction} gap={GAP[size]} align={align ?? (direction === 'row' ? 'center' : undefined)}>
      {split == null
        ? items
        : items.map((item, i) => (
            <Fragment key={i}>
              {i > 0 && split}
              {item}
            </Fragment>
          ))}
    </Flex>
  )
}

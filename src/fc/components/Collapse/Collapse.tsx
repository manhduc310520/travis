import type { ReactNode } from 'react'
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
  type DisclosureGroupProps,
  type Key,
} from 'react-aria-components'
import { ChevronRight } from '../../../icons'
import { cx } from '../../space'
import styles from './Collapse.module.css'

/** Figma `Collapse` Type: Basic (`outlined`), Borderless, Ghost. */
export type CollapseVariant = 'outlined' | 'borderless' | 'ghost'
/** Figma `Collapse` Size: Small / Default / Large. */
export type CollapseSize = 'sm' | 'md' | 'lg'
/** Figma item `Expand Icon Placement`: Left (`start`) / Right (`end`). */
export type CollapseIconPosition = 'start' | 'end'
type HeadingLevel = 2 | 3 | 4 | 5 | 6

export interface CollapseItem {
  /** Unique key, used in `expandedKeys`. */
  key: Key
  /** The header text (Figma "Header"). It names the toggle button. */
  label: ReactNode
  /** The panel (Figma "Text"). */
  content?: ReactNode
  /**
   * Figma `Extra Node`: actions at the end of the header. They sit outside the
   * toggle button, so pressing them never opens or closes the panel.
   */
  extra?: ReactNode
  /** Figma item `Disabled`: the header can't be toggled. */
  isDisabled?: boolean
}

export interface CollapseProps extends Omit<DisclosureGroupProps, 'children' | 'className' | 'style'> {
  items: CollapseItem[]
  variant?: CollapseVariant
  size?: CollapseSize
  /** `false` = accordion: opening a panel closes the others. Default `true`. */
  allowsMultipleExpanded?: boolean
  expandIconPosition?: CollapseIconPosition
  /** Custom expand icon. Replaces the chevron (which rotates by itself); draw both states. */
  expandIcon?: (state: { isExpanded: boolean }) => ReactNode
  /** Heading level wrapping each header button. Default 3. */
  headingLevel?: HeadingLevel
  className?: string
}

/**
 * Figma "❖ Collapse". Built on React Aria `DisclosureGroup` + `Disclosure`:
 * each header is a heading holding a button (Enter / Space toggles,
 * aria-expanded / aria-controls set). The whole header row is the button's
 * pointer target; `extra` sits above it and stays separately clickable.
 * Panels animate their height (none with `prefers-reduced-motion`) and stay in
 * the page as `hidden="until-found"`, so find-in-page opens them.
 */
export function Collapse({
  items,
  variant = 'outlined',
  size = 'md',
  allowsMultipleExpanded = true,
  expandIconPosition = 'start',
  expandIcon,
  headingLevel = 3,
  className,
  ...rest
}: CollapseProps) {
  const iconAtEnd = expandIconPosition === 'end'

  return (
    <DisclosureGroup
      {...rest}
      allowsMultipleExpanded={allowsMultipleExpanded}
      className={cx(styles.collapse, styles[variant], size !== 'md' && styles[size], className)}
    >
      {items.map((item) => (
        <Disclosure key={String(item.key)} id={item.key} isDisabled={item.isDisabled} className={styles.item}>
          {({ isExpanded }) => {
            const icon = (
              <span className={cx(styles.arrow, !expandIcon && styles.chevron)} aria-hidden="true">
                {expandIcon ? expandIcon({ isExpanded }) : <ChevronRight />}
              </span>
            )
            return (
              <>
                <div className={styles.header}>
                  {!iconAtEnd && icon}
                  <Heading level={headingLevel} className={styles.title}>
                    <AriaButton slot="trigger" className={styles.trigger}>
                      {item.label}
                    </AriaButton>
                  </Heading>
                  {item.extra != null && <div className={styles.extra}>{item.extra}</div>}
                  {iconAtEnd && icon}
                </div>
                <DisclosurePanel className={styles.panel}>
                  <div className={styles.content}>{item.content}</div>
                </DisclosurePanel>
              </>
            )
          }}
        </Disclosure>
      ))}
    </DisclosureGroup>
  )
}

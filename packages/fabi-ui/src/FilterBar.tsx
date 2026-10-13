// FilterBar: the filter row above a list (search, selects, date range) with "Xoá bộ lọc" and the list actions
// (user 2026-10-13). A layout, not a form engine: pass your own antd fields as children. Phones (< md): each
// field takes the full width; from md the fields sit in one wrapping row and the actions go to the end.
import { Button, Flex, Grid, theme as antdTheme } from 'antd'
import { Children, cloneElement, isValidElement } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { FilterLinesLine } from './fabi-icons.js'
import { useFabiLang } from './useFabiLang.js'

export interface FilterBarProps {
  /** The filter fields (Input.Search, Select, DatePicker.RangePicker…) */
  children: ReactNode
  /** Shows a "Clear filters" button when some filter is set */
  onReset?: () => void
  /** Whether any filter differs from its default (shows the reset button) */
  active?: boolean
  /** Small controls right after the fields, e.g. the column settings button */
  tools?: ReactNode
  /** At the end of the row, e.g. an export button or a view switch */
  extra?: ReactNode
  /** Minimum width of each field from md up (default 240); wider fields such as a RangePicker keep their size */
  fieldWidth?: number
  className?: string
  style?: CSSProperties
}

export function FilterBar({ children, onReset, active = false, tools, extra, fieldWidth = 240, className, style }: FilterBarProps) {
  const { token } = antdTheme.useToken()
  const screens = Grid.useBreakpoint()
  const phone = screens.md === false
  const en = useFabiLang() === 'en'
  return (
    <Flex
      role="search"
      aria-label={en ? 'Filters' : 'Bộ lọc'}
      gap="small"
      wrap
      align="center"
      className={className}
      style={{ padding: `${token.paddingSM}px ${token.padding}px`, background: token.colorBgContainer, ...style }}
    >
      {Children.toArray(children).map((child, i) => (
        <div key={i} style={phone ? { flex: '1 1 100%' } : { minWidth: fieldWidth }}>
          {/* the field fills its slot */}
          {isValidElement<{ style?: CSSProperties }>(child) ? cloneElement(child, { style: { width: '100%', ...child.props.style } }) : child}
        </div>
      ))}
      {tools}
      {onReset && active && (
        <Button type="link" icon={<FilterLinesLine />} onClick={onReset} style={{ paddingInline: 0 }}>
          {en ? 'Clear filters' : 'Xoá bộ lọc'}
        </Button>
      )}
      {extra && (
        <Flex gap="small" wrap style={{ marginInlineStart: phone ? undefined : 'auto' }}>
          {extra}
        </Flex>
      )}
    </Flex>
  )
}

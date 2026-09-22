import type { ConfigProviderProps } from 'antd'
import { Calendar, Check, ChevronDown, ChevronRight, Clock, SearchMd, XClose } from '../icons'

/**
 * Ant Design draws its own chrome — the select arrow, the date picker's
 * calendar, the tick beside a chosen option, the clear button. Those come from
 * `@ant-design/icons` and swapping our own imports does not touch them.
 *
 * ConfigProvider takes per-component defaults, so this is where the Untitled UI
 * set reaches the parts of the UI we never render by hand.
 */
export const antdIconDefaults = {
  select: {
    suffixIcon: <ChevronDown />,
    menuItemSelectedIcon: <Check />,
    removeIcon: <XClose />,
    clearIcon: <XClose />,
  },
  cascader: {
    suffixIcon: <ChevronDown />,
    expandIcon: <ChevronRight />,
    removeIcon: <XClose />,
  },
  datePicker: {
    suffixIcon: <Calendar />,
    clearIcon: <XClose />,
  },
  timePicker: {
    suffixIcon: <Clock />,
    clearIcon: <XClose />,
  },
  collapse: {
    expandIcon: () => <ChevronRight />,
  },
  transfer: {
    selectionsIcon: <ChevronDown />,
  },
} satisfies Partial<ConfigProviderProps>

export { SearchMd }

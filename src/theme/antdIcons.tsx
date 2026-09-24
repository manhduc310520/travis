import type { ConfigProviderProps } from 'antd'
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  DotsHorizontal,
  Eye,
  EyeOff,
  Plus,
  SearchMd,
  X,
  XClose,
} from '../icons'

/**
 * Ant Design draws its own chrome — the select arrow, the date picker's
 * calendar, the tick beside a chosen option, every close button, the
 * password-field eye toggle. Those come from `@ant-design/icons` internally
 * and swapping our own imports in app code never touches them.
 *
 * ConfigProvider takes per-component defaults, so this is where the Untitled
 * UI set reaches every part of the UI we never render by hand. This list is
 * exhaustive against `antd/es/config-provider/context.d.ts` — every
 * component config that picks an `*Icon` prop is set here, not just the ones
 * a story happened to exercise first.
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
  // The submenu arrow next to "Restaurants" — previously Ant Design's own caret.
  menu: {
    expandIcon: <ChevronRight />,
  },
  modal: {
    closeIcon: <X size={16} />,
  },
  drawer: {
    closeIcon: <X size={16} />,
  },
  notification: {
    closeIcon: <X size={14} />,
  },
  // Tag is deliberately absent. Ant Design treats a `closeIcon` set here as
  // "every Tag is closable" (`computeClosable` in antd's useClosable hook), so
  // it put an × on status tags that never asked for one. A closable Tag passes
  // `closeIcon={<XClose size={10} />}` itself instead.
  tour: {
    closeIcon: <X size={14} />,
  },
  floatButtonGroup: {
    closeIcon: <X size={14} />,
  },
  breadcrumb: {
    dropdownIcon: <ChevronDown />,
  },
  tabs: {
    moreIcon: <DotsHorizontal />,
    addIcon: <Plus size={12} />,
    removeIcon: <XClose size={10} />,
  },
  inputSearch: {
    searchIcon: <SearchMd />,
  },
  inputPassword: {
    iconRender: (visible: boolean) => (visible ? <Eye /> : <EyeOff />),
  },
} satisfies Partial<ConfigProviderProps>

export { SearchMd }

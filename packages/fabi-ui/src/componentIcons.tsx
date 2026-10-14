// FABi icons inside antd components (user 2026-10-14, "thay icons"). FabiProvider passes these as ConfigProvider
// component defaults, so Select arrows, picker icons, close buttons, Alert / Modal status icons… use the FABi set.
// Only what antd's public ConfigProvider API reaches; the README lists what stays antd's and why.
//
// Sizes: FABi icons sit on a 24 × 24 grid with padding (a chevron is 12 of 24 wide), antd glyphs fill most of
// the em. The em sizes below keep each glyph at about antd's size in its slot (a 12px Select arrow slot → a 16px
// chevron) and follow the slot when antd sizes it differently (small / large, Alert with description).
import { useContext } from 'react'
import type { ConfigProviderProps } from 'antd'
import { FormItemInputContext } from 'antd/es/form/context.js'
import type { FabiIcon, FabiIconProps } from './fabiIcon.js'
import { useFabiLang } from './useFabiLang.js'
import {
  AlertCircleSolid,
  AlignTop01Line,
  ArrowRightLine,
  CalendarLine,
  CheckCircleSolid,
  ChevronDownLine,
  ChevronLeftLine,
  ChevronRightLine,
  ClockLine,
  EyeLine,
  EyeOffLine,
  HelpCircleLine,
  InfoCircleSolid,
  Loading02Line,
  PlusLine,
  SearchMdLine,
  XCircleSolid,
  XCloseLine,
} from './fabi-icons-provider.js'

/** Size props for an icon `em` tall. antd's 1em icons sit at vertical-align -0.125em (centre 0.375em above the
 *  baseline); a taller icon goes lower by half the extra height so it stays centred on the text. */
const sized = (em: number) => ({ size: `${em}em`, style: { verticalAlign: `${+(0.375 - em / 2).toFixed(3)}em` } })
/** chevrons, plus: the stroke spans half the grid */
const LG = sized(1.334)
/** close ×, arrow: about 0.4 of the grid */
const CLOSE = sized(1.25)
/** calendar, clock, search, align-top, loading: about 0.75 of the grid */
const MD = sized(1.143)

/** antd's own icons carry a name ("close", "search", "loading", "vertical-align-top") that names the icon-only
 *  button around them (Alert close, Input.Search button, a loading icon-only Button, FloatButton.BackTop). FABi icons are decorative unless named,
 *  so these take a name in the app's language; a name antd passes (aria-label "Close" from its locale) wins. */
const NAMES = {
  close: { vi: 'Đóng', en: 'Close' },
  search: { vi: 'Tìm kiếm', en: 'Search' },
  backTop: { vi: 'Lên đầu trang', en: 'Back to top' },
  loading: { vi: 'Đang tải', en: 'Loading' },
}
function NamedIcon({ icon: Icon, name, ...props }: FabiIconProps & { icon: FabiIcon; name: keyof typeof NAMES }) {
  const lang = useFabiLang()
  return <Icon {...props} aria-label={props['aria-label'] ?? NAMES[name][lang]} />
}

/** Date / time picker suffix. A custom suffix replaces antd's whole suffix, so this one keeps Form.Item's
 *  validation icon (hasFeedback) after it, like antd's default. */
function PickerSuffix({ time }: { time?: boolean }) {
  const { hasFeedback, feedbackIcon } = useContext(FormItemInputContext)
  return (
    <>
      {time ? <ClockLine {...MD} /> : <CalendarLine {...MD} />}
      {hasFeedback && feedbackIcon}
    </>
  )
}

type ComponentIconConfig = Pick<
  ConfigProviderProps,
  | 'alert'
  | 'breadcrumb'
  | 'button'
  | 'cascader'
  | 'collapse'
  | 'datePicker'
  | 'drawer'
  | 'floatButton'
  | 'floatButtonGroup'
  | 'form'
  | 'image'
  | 'inputPassword'
  | 'inputSearch'
  | 'menu'
  | 'modal'
  | 'notification'
  | 'rangePicker'
  | 'select'
  | 'tabs'
  | 'timePicker'
  | 'tour'
  | 'transfer'
>

/**
 * The ConfigProvider component props that put FABi icons inside antd components. `prefixCls` names the Menu
 * arrow class; in RTL the Collapse and Cascader arrows turn the other way, like antd's.
 */
export function fabiComponentIcons(prefixCls: string, direction?: 'ltr' | 'rtl'): ComponentIconConfig {
  const rtl = direction === 'rtl'
  const close = <NamedIcon icon={XCloseLine} name="close" {...CLOSE} />
  const loading = <NamedIcon icon={Loading02Line} name="loading" spin {...MD} />
  const clear = <XCircleSolid />
  return {
    select: { suffixIcon: <ChevronDownLine {...LG} />, clearIcon: clear, removeIcon: close, loadingIcon: loading },
    cascader: {
      suffixIcon: <ChevronDownLine {...LG} />,
      clearIcon: clear,
      removeIcon: close,
      loadingIcon: loading,
      searchIcon: <SearchMdLine {...MD} />,
      expandIcon: rtl ? <ChevronLeftLine {...LG} /> : <ChevronRightLine {...LG} />,
    },
    datePicker: { suffixIcon: <PickerSuffix />, clearIcon: clear },
    timePicker: { suffixIcon: <PickerSuffix time />, clearIcon: clear },
    rangePicker: { separator: <ArrowRightLine {...MD} /> },
    inputPassword: { iconRender: (visible) => (visible ? <EyeLine /> : <EyeOffLine />) },
    inputSearch: { searchIcon: <NamedIcon icon={SearchMdLine} name="search" /> },
    button: { loadingIcon: loading },
    form: { tooltip: { icon: <HelpCircleLine /> } },
    alert: {
      closeIcon: close,
      successIcon: <CheckCircleSolid />,
      infoIcon: <InfoCircleSolid />,
      warningIcon: <AlertCircleSolid />,
      errorIcon: <XCircleSolid />,
    },
    modal: {
      closeIcon: close,
      successIcon: <CheckCircleSolid />,
      infoIcon: <InfoCircleSolid />,
      warningIcon: <AlertCircleSolid />,
      errorIcon: <XCircleSolid />,
    },
    drawer: { closeIcon: close },
    notification: { closeIcon: close },
    tour: { closeIcon: close },
    image: { preview: { closeIcon: close } },
    floatButton: { backTopIcon: <NamedIcon icon={AlignTop01Line} name="backTop" {...MD} /> },
    floatButtonGroup: { closeIcon: close },
    tabs: { removeIcon: close, addIcon: <PlusLine {...LG} /> },
    breadcrumb: { dropdownIcon: <ChevronDownLine {...LG} /> },
    transfer: { selectionsIcon: <ChevronDownLine {...LG} /> },
    collapse: {
      // antd's arrow turns 90° when the panel opens and carries its state when the icon is the toggle
      expandIcon: ({ isActive, collapsible }) => (
        <ChevronRightLine
          size={LG.size}
          style={{ ...LG.style, ...(isActive && { transform: `rotate(${rtl ? -90 : 90}deg)` }) }}
          {...(collapsible === 'header' || collapsible === 'icon' ? { 'aria-label': isActive ? 'expanded' : 'collapsed' } : {})}
        />
      ),
    },
    menu: {
      // a function keeps antd from cloning it, so it carries antd's class itself; '@fabi/ui/styles.css' turns it
      // per mode (down in inline menus, up when open; right in pop-up submenus)
      expandIcon: () => <ChevronDownLine className={`${prefixCls}-menu-submenu-expand-icon`} {...MD} />,
    },
  }
}

const NESTED: Partial<Record<keyof ComponentIconConfig, string>> = { form: 'tooltip', image: 'preview' }

/** App props win: each component config is merged over the FABi icons (one level, two for form.tooltip and
 *  image.preview), so `select={{ variant: 'filled' }}` keeps the FABi arrow and `select={{ suffixIcon }}` replaces it. */
export function mergeComponentIcons<T extends Partial<ComponentIconConfig>>(icons: ComponentIconConfig, props: T): ComponentIconConfig {
  const out: Record<string, unknown> = { ...icons }
  for (const key of Object.keys(icons) as (keyof ComponentIconConfig)[]) {
    const own = props[key] as Record<string, unknown> | undefined
    if (own === undefined) continue
    const base = icons[key] as Record<string, unknown>
    const merged: Record<string, unknown> = { ...base, ...own }
    const sub = NESTED[key]
    if (sub && own[sub] && typeof own[sub] === 'object') merged[sub] = { ...(base[sub] as object), ...(own[sub] as object) }
    out[key] = merged
  }
  return out as ComponentIconConfig
}

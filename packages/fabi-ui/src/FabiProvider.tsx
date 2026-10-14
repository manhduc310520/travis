import { ConfigProvider } from 'antd'
import type { ConfigProviderProps } from 'antd'
import { createContext, useContext, useEffect, useLayoutEffect, useMemo } from 'react'
import { installA11yFixes } from './a11yFixes.js'
import { fabiComponentIcons, mergeComponentIcons } from './componentIcons.js'
import { DEFAULT_BRAND, DEFAULT_MODE, FABI_ICON_PREFIX, FABI_PREFIX, fabiTheme, mergeTheme } from './theme.js'
import type { BrandKey, FabiMode } from './theme.js'

/**
 * Attribute the outermost FabiProvider sets on <html> to its mode. '@fabi/ui/styles.css' keeps its
 * Light-only contrast rules out of `[data-fabi-mode="dark"]` and everything inside it; put the attribute
 * on an element yourself to mark a dark area inside a light page.
 */
export const FABI_MODE_ATTR = 'data-fabi-mode'

export interface FabiProviderProps extends ConfigProviderProps {
  /** Brand colour (default 'geekblue'). */
  brand?: BrandKey
  /** Colour mode (default 'light'). 'dark' uses antd's dark algorithm with the brand colour. */
  mode?: FabiMode
  /** Install the runtime accessibility DOM patches on mount (default true). */
  a11yFixes?: boolean
  /** FABi icons inside antd components (Select / picker icons, close buttons, Alert and Modal status icons…),
   *  default true. Component props you pass (e.g. `select={{ suffixIcon }}`) still win; false keeps antd's icons. */
  componentIcons?: boolean
}

const NestedContext = createContext(false)
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const rootModes: { mode: FabiMode }[] = []
function syncModeAttr() {
  const top = rootModes[rootModes.length - 1]
  if (top) document.documentElement.setAttribute(FABI_MODE_ATTR, top.mode)
  else document.documentElement.removeAttribute(FABI_MODE_ATTR)
}

/**
 * Wrap the app once. Renders antd's ConfigProvider with the FABi theme for `brand` and `mode`, class
 * prefix `fabi` / `fabi-icon` and CSS variables `--fabi-*`; every other ConfigProvider prop passes
 * through. A `theme` prop is deep-merged over the FABi theme (token and per-component tokens).
 */
export function FabiProvider({
  brand = DEFAULT_BRAND,
  mode = DEFAULT_MODE,
  a11yFixes = true,
  componentIcons = true,
  theme,
  prefixCls = FABI_PREFIX,
  iconPrefixCls = FABI_ICON_PREFIX,
  children,
  ...rest
}: FabiProviderProps) {
  const nested = useContext(NestedContext)
  const mergedTheme = useMemo(() => {
    const t = mergeTheme(fabiTheme(brand, mode), theme)
    // antd 6 already defaults the CSS variable prefix to prefixCls; set it explicitly so a nested
    // ConfigProvider with another prefixCls cannot change it. A nested provider (e.g. a dark area in a
    // light app) starts from its own FABi theme: inherited component tokens of the other mode (Calendar,
    // Switch, Menu…) would otherwise stay. A theme prop with `inherit: true` turns this off.
    return { ...(nested && { inherit: false }), ...t, cssVar: { prefix: prefixCls, ...t.cssVar } }
  }, [nested, brand, mode, theme, prefixCls])

  // ConfigProvider component props with the FABi icons, merged under the app's own (see componentIcons.tsx)
  const icons = useMemo(() => (componentIcons ? fabiComponentIcons(prefixCls, rest.direction) : undefined), [componentIcons, prefixCls, rest.direction])
  const iconProps = icons ? mergeComponentIcons(icons, rest) : {}

  // Static APIs (message.success(), notification, Modal.confirm) render outside this tree and read
  // antd's global config. Set it during render, not in an effect: child effects run before the
  // parent's, so a child calling message.success() on mount would otherwise still get `ant-` classes.
  // Only the outermost provider sets it (like the mode attribute): a nested dark or light area must not
  // restyle the whole app's popups.
  useMemo(() => {
    if (nested) return
    ConfigProvider.config({
      prefixCls,
      iconPrefixCls,
      theme: mergedTheme,
      holderRender: (node) => (
        <ConfigProvider {...icons} prefixCls={prefixCls} iconPrefixCls={iconPrefixCls} theme={mergedTheme} locale={rest.locale} direction={rest.direction}>
          {node}
        </ConfigProvider>
      ),
    })
  }, [nested, prefixCls, iconPrefixCls, mergedTheme, rest.locale, rest.direction, icons])

  // Popups render into <body>, outside any wrapper, so the mode goes on <html>. Only outermost
  // providers write it (a nested one, e.g. a dark area, must not flip the whole page); with several
  // React roots the most recently mounted one wins, and unmounting hands back to the previous one.
  useIsomorphicLayoutEffect(() => {
    if (nested) return
    const entry = { mode }
    rootModes.push(entry)
    syncModeAttr()
    return () => {
      rootModes.splice(rootModes.indexOf(entry), 1)
      syncModeAttr()
    }
  }, [nested, mode])

  useEffect(() => {
    if (a11yFixes) installA11yFixes({ prefixCls, iconPrefixCls })
  }, [a11yFixes, prefixCls, iconPrefixCls])

  return (
    <NestedContext.Provider value>
      <ConfigProvider {...rest} {...iconProps} prefixCls={prefixCls} iconPrefixCls={iconPrefixCls} theme={mergedTheme}>
        {children}
      </ConfigProvider>
    </NestedContext.Provider>
  )
}

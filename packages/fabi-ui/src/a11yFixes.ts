import { FABI_ICON_PREFIX, FABI_PREFIX } from './theme.js'

/**
 * Runtime accessibility fixes for markup that antd 6.6.5 renders itself, found by axe (2026-09-30).
 * They patch the DOM after antd renders. Ported from the Storybook's former .storybook/a11yFixes.ts with
 * selectors built from the class prefixes; behaviour is identical. Each patch is listed in README.md
 * and should be removed once antd fixes it upstream.
 *
 *  - Transfer: list checkboxes and the search box get names (label rule)
 *  - Calendar header year / month selects get names (label rule)
 *  - Select / AutoComplete hidden listbox gets the name of its combobox (aria-input-field-name)
 *  - Skeleton placeholders are hidden from assistive tech while loading (empty-heading)
 *  - empty header cells of expand / drag columns get a hidden name (empty-table-header)
 *  - Tabs: role="tablist" moves from the nav bar to the list that only holds tabs (aria-required-children)
 *  - ColorPicker trigger drops Form.Item's aria-required, not allowed on a plain div (aria-allowed-attr)
 *  - progress bars antd renders inside other components (Upload list) get a name
 *  - scroll containers with no focusable content become focusable (scrollable-region-focusable)
 *  - custom icons with role="img" and no name are named after their class, else hidden (role-img-alt)
 *  - last resort: inputs with no accessible name are named from placeholder / name / role (label)
 */
export interface A11yFixesOptions {
  /** Component class prefix, default 'fabi' (must match FabiProvider / ConfigProvider prefixCls). */
  prefixCls?: string
  /** Icon class prefix, default 'fabi-icon' (must match iconPrefixCls). */
  iconPrefixCls?: string
}

const setIfMissing = (el: Element, attr: string, value: string) => {
  if (!el.hasAttribute(attr)) el.setAttribute(attr, value)
}

function fix(root: ParentNode, p: string, icon: string) {
  // visually hidden text (styled by '@fabi/ui/styles.css' as .<prefix>-sr-only)
  const srOnly = `${p}-sr-only`
  const srText = (cell: Element, text: string) => {
    if (cell.textContent?.trim() || cell.querySelector(`.${srOnly}`)) return
    const s = document.createElement('span')
    s.className = srOnly
    s.textContent = text
    cell.appendChild(s)
  }
  // Transfer (antd 6: each side is .<p>-transfer-section)
  root.querySelectorAll(`.${p}-transfer-section, .${p}-transfer-list`).forEach((list, i) => {
    const title = list.querySelector('[class*="header-title"]')?.textContent?.trim() || (i % 2 ? 'Target' : 'Source')
    list.querySelectorAll('[class*="list-header"] input[type=checkbox]').forEach((c) => setIfMissing(c, 'aria-label', `Select all: ${title}`))
    list.querySelectorAll('input:not([type=checkbox])').forEach((c) => setIfMissing(c, 'aria-label', `Search ${title}`))
    list.querySelectorAll('input[type=checkbox]').forEach((c) => {
      const item = c.closest('li, [class*="content-item"]')
      const text = item?.querySelector('[class*="item-text"]')?.textContent?.trim() || item?.textContent?.trim() || 'Item'
      setIfMissing(c, 'aria-label', text)
    })
  })
  // unnamed progress bars that antd renders itself (e.g. the Upload list)
  root.querySelectorAll(`.${p}-progress[role=progressbar]:not([aria-label]):not([aria-labelledby])`).forEach((el) => el.setAttribute('aria-label', 'Progress'))
  // Calendar header selects
  root.querySelectorAll(`.${p}-picker-calendar-header`).forEach((h) => {
    h.querySelectorAll(`.${p}-select input`).forEach((inp, i) => setIfMissing(inp, 'aria-label', i === 0 ? 'Year' : 'Month'))
  })
  // unnamed listbox of a Select / AutoComplete → name of its combobox
  root.querySelectorAll('[role=listbox][id$="_list"]').forEach((lb) => {
    if (lb.hasAttribute('aria-label') || lb.hasAttribute('aria-labelledby')) return
    const combo = document.querySelector(`[aria-controls="${lb.id}"], [aria-owns="${lb.id}"]`)
    lb.setAttribute('aria-label', combo?.getAttribute('aria-label') || 'Options')
  })
  // Skeleton
  root.querySelectorAll(`.${p}-skeleton`).forEach((s) => setIfMissing(s, 'aria-hidden', 'true'))
  // empty table header cells
  root.querySelectorAll(`.${p}-table-thead th.${p}-table-row-expand-icon-cell`).forEach((th) => srText(th, 'Expand row'))
  root.querySelectorAll(`.${p}-table-thead th`).forEach((th) => { if (!th.textContent?.trim() && !th.querySelector('input,button')) srText(th, 'Actions') })
  // the hidden measure row of a scrolling Table copies the header cells (select-all checkbox, sorters): keep
  // those copies out of the tab order
  root.querySelectorAll(`.${p}-table-measure-row input, .${p}-table-measure-row button, .${p}-table-measure-row [tabindex]`).forEach((el) => el.setAttribute('tabindex', '-1'))
  // QRCode draws on a <canvas role="img"> with no name: take the QRCode's aria-label, else "QR code"
  root.querySelectorAll(`.${p}-qrcode canvas[role=img]:not([aria-label])`).forEach((c) => {
    c.setAttribute('aria-label', c.closest(`.${p}-qrcode`)?.getAttribute('aria-label') || 'QR code')
  })
  // Tabs: tablist must only contain tabs
  root.querySelectorAll(`.${p}-tabs-nav[role=tablist]`).forEach((nav) => {
    const list = nav.querySelector(`.${p}-tabs-nav-list`)
    if (!list) return
    list.setAttribute('role', 'tablist')
    const orientation = nav.getAttribute('aria-orientation')
    if (orientation) list.setAttribute('aria-orientation', orientation)
    nav.removeAttribute('role')
    nav.removeAttribute('aria-orientation')
  })
  // ColorPicker trigger is a plain div: Form.Item's aria-required is not allowed on it
  root.querySelectorAll(`.${p}-color-picker-trigger:not([role])[aria-required]`).forEach((t) => t.removeAttribute('aria-required'))
  // scroll containers (overflow auto/scroll) with nothing keyboard-focusable inside. Checked by style,
  // not by size: tables finish measuring after this runs, without a DOM mutation.
  root.querySelectorAll(`.${p}-listy, .${p}-transfer-list-content, .${p}-picker-calendar-date-content, .${p}-table-body, .${p}-table-content`).forEach((el) => {
    const h = el as HTMLElement
    const cs = getComputedStyle(h)
    const scrollable = /auto|scroll/.test(cs.overflowX + ' ' + cs.overflowY)
    if (scrollable && !h.querySelector('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])')) setIfMissing(h, 'tabindex', '0')
  })
  // custom icons (Icon component={…}) have role="img" but no name: name them after their class, else hide them
  root.querySelectorAll(`.${icon}[role=img]:not([aria-label]):not([aria-labelledby]):not([aria-hidden])`).forEach((i) => {
    const name = [...i.classList].find((c) => c.startsWith(`${icon}-`))?.slice(icon.length + 1)
    if (name) i.setAttribute('aria-label', name)
    else i.setAttribute('aria-hidden', 'true')
  })
  // last resort for inputs that still have no accessible name: placeholder, then name, then role
  root.querySelectorAll('input:not([type=hidden]), textarea').forEach((inp) => {
    if (inp.hasAttribute('aria-label') || inp.hasAttribute('aria-labelledby') || (inp.id && document.querySelector(`label[for="${CSS.escape(inp.id)}"]`)) || inp.closest('label')) return
    const name = inp.getAttribute('placeholder') || inp.getAttribute('name') || (inp.getAttribute('role') === 'spinbutton' ? 'Number' : inp.getAttribute('role') === 'combobox' ? 'Select' : 'Input')
    inp.setAttribute('aria-label', name)
  })
}

type FixWindow = typeof window & { __fabiA11yFixes?: () => void }

/**
 * Installs the DOM patches once per page (later calls return the same uninstall function).
 * FabiProvider calls it on mount unless `a11yFixes={false}`. No-op outside the browser (SSR).
 */
export function installA11yFixes(options: A11yFixesOptions = {}): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {}
  const w = window as FixWindow
  if (w.__fabiA11yFixes) return w.__fabiA11yFixes
  const p = options.prefixCls ?? FABI_PREFIX
  const icon = options.iconPrefixCls ?? FABI_ICON_PREFIX
  const run = () => fix(document, p, icon)
  let queued = false
  const observer = new MutationObserver(() => {
    if (queued) return
    queued = true
    queueMicrotask(() => { queued = false; run() })
  })
  observer.observe(document.documentElement, { childList: true, subtree: true })
  run()
  const uninstall = () => {
    observer.disconnect()
    delete w.__fabiA11yFixes
  }
  w.__fabiA11yFixes = uninstall
  return uninstall
}

import { useState, type HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { I18nProvider, UNSAFE_PortalProvider } from 'react-aria'
import type { FcBrand, FcMode, FcDensity } from './axes'
import { installViVN } from './i18n/vi-VN'
import './tokens.css'
import './base.css'

// Before anything renders: React Aria reads its string dictionary once.
installViVN()

export interface FcThemeProps extends HTMLAttributes<HTMLDivElement> {
  brand?: FcBrand
  mode?: FcMode
  density?: FcDensity
  /**
   * Formats dates, times and numbers (`dd/MM/yyyy`, `1.234,5`). React Aria's
   * built-in texts are Vietnamese whatever this is (see `i18n/vi-VN.ts`).
   */
  locale?: string
}

/**
 * Themes everything inside it. The three data attributes must stay on this
 * one element: `tokens.css` resolves its aliases as var() chains here.
 *
 * Overlays (Tooltip, Popover, Modal) render in a portal outside this element,
 * where no `--fc-*` value would resolve. So FcTheme also renders a themed
 * container on `document.body` with the same attributes and hands it to React
 * Aria through `UNSAFE_PortalProvider`. The container arrives through a
 * callback ref into state, so overlays that are open on first render (for
 * example `defaultOpen`) render again once it exists — React Aria skips an
 * overlay while its container is null.
 */
export function FcTheme({ brand = 'blue', mode = 'light', density = 'default', locale = 'vi-VN', className, children, ...rest }: FcThemeProps) {
  const [portal, setPortal] = useState<HTMLDivElement | null>(null)
  const theme = { 'data-brand': brand, 'data-mode': mode, 'data-density': density }

  return (
    <div {...rest} {...theme} lang={locale} className={className ? `fc-root ${className}` : 'fc-root'}>
      <I18nProvider locale={locale}>
        <UNSAFE_PortalProvider getContainer={() => portal}>{children}</UNSAFE_PortalProvider>
      </I18nProvider>
      {typeof document !== 'undefined' && createPortal(<div ref={setPortal} {...theme} lang={locale} className="fc-root fc-portal" />, document.body)}
    </div>
  )
}

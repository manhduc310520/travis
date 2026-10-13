// Docs language (Language toolbar: VN / EN). The preview decorator and BrandDocsContainer wrap stories and
// docs pages in LocaleProvider; generated pages, the site widgets (src/_dumi) and the hand-written MDX
// pages read it with useDocsLocale() or the <Vi> / <En> / <Lang> helpers. Only the active language is
// rendered. Text drawn by the components themselves (OK / Cancel, month names) follows the antd locale,
// not this one.
import { createContext, useContext, useEffect, type ReactNode } from 'react'

export type DocsLocale = 'vi' | 'en'

/** Toolbar items, in toolbar order. `lang` is written to <html lang>. */
export const LOCALES: Record<DocsLocale, { title: string; lang: string }> = {
  en: { title: 'EN', lang: 'en' },
  vi: { title: 'VN', lang: 'vi' },
}
// English by default; Vietnamese on request (user, 2026-10-13)
export const DEFAULT_LOCALE: DocsLocale = 'en'
export const isLocale = (v: unknown): v is DocsLocale => typeof v === 'string' && v in LOCALES

const LocaleContext = createContext<DocsLocale>(DEFAULT_LOCALE)

/**
 * `documentLang`: also write <html lang> (screen readers and hyphenation read it). On a docs page only the docs
 * container does: each story there has its own provider, and one that finishes rendering late would write the
 * language of the moment it started.
 */
export function LocaleProvider({ locale, documentLang = true, children }: { locale?: string; documentLang?: boolean; children: ReactNode }) {
  const value = isLocale(locale) ? locale : DEFAULT_LOCALE
  useEffect(() => { if (documentLang) document.documentElement.lang = LOCALES[value].lang }, [value, documentLang])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export const useDocsLocale = () => useContext(LocaleContext)

/** `<Lang vi="…" en="…" />`: the text of the active language. */
export function Lang({ vi, en }: { vi: ReactNode; en: ReactNode }) {
  return <>{useDocsLocale() === 'vi' ? vi : en}</>
}

/** MDX blocks: `<Vi>` markdown `</Vi>` and `<En>` markdown `</En>` (blank lines around the markdown). */
export function Vi({ children }: { children?: ReactNode }) {
  return useDocsLocale() === 'vi' ? <>{children}</> : null
}

export function En({ children }: { children?: ReactNode }) {
  return useDocsLocale() === 'en' ? <>{children}</> : null
}

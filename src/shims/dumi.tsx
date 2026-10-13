// Stand-in for the `dumi` package. The antd demos and the site helpers copied into
// src/_dumi only need the current locale and a few translated strings. The dumi locale is
// always en-US (messages from the site's own English locale file); the docs language of the
// Language toolbar (.storybook/locale.tsx) then shows them in Vietnamese where i18n/vi/ui.json
// has a translation (keyed by the English text; scripts/i18n-ui.mjs extracts them).
import type { ReactNode } from 'react'
import messages from '../_dumi/theme/locales/en-US.json'
import viUi from '../../i18n/vi/ui.json'
import { useDocsLocale } from '../../.storybook/locale'
import { debrandEn } from '../_dumi/fabiText'

export const useLocale = () => ({ id: 'en-US' })

type Values = Record<string, ReactNode>

const message = (vi: boolean, id: string, defaultMessage?: string, values?: Values) => {
  const en = (messages as Record<string, string>)[id] ?? defaultMessage ?? id
  const text = vi ? (viUi as Record<string, string>)[en] || en : debrandEn(en)
  return values ? text.replace(/\{(\w+)\}/g, (all, k) => (k in values ? String(values[k]) : all)) : text
}

export function FormattedMessage({ id, defaultMessage, values }: { id: string; defaultMessage?: string; values?: Values }) {
  return <>{message(useDocsLocale() === 'vi', id, defaultMessage, values)}</>
}

export const useIntl = () => {
  const vi = useDocsLocale() === 'vi'
  return {
    locale: 'en-US',
    formatMessage: ({ id, defaultMessage }: { id: string; defaultMessage?: string }, values?: Values) => message(vi, id, defaultMessage, values),
  }
}

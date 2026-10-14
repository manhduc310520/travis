import { useCallback } from 'react';
import { useLocale as useDumiLocale } from 'dumi';
import viUi from '../../../i18n/vi/ui.json';
import { useDocsLocale } from '../../../.storybook/locale';
import { debrandEn, fabiPrefix } from '../fabiText';

export interface LocaleMap<
  K extends PropertyKey = PropertyKey,
  V extends string | ((...params: any[]) => string) = string,
> {
  /** antd-storybook: the Chinese tables are removed (no Chinese in the design system) */
  cn?: Record<K, V>;
  en: Record<K, V>;
}

const useLocale = <
  K extends PropertyKey = PropertyKey,
  V extends string | ((...params: any[]) => string) = string,
>(
  localeMap?: LocaleMap<K, V>,
): [Record<K, V>, 'cn' | 'en'] => {
  const { id } = useDumiLocale();
  // antd-storybook: the docs language (Language toolbar, .storybook/locale.tsx). VN overlays Vietnamese on the
  // English UI strings of the site widgets and Semantic DOM demos (i18n/vi/ui.json, keyed by the English text;
  // see scripts/i18n-ui.mjs); EN keeps the English strings, debranded. Both use the fabi- prefix (B5).
  const docsLocale = useDocsLocale();
  const localeType = id === 'zh-CN' ? 'cn' : 'en';
  const strings = localeMap?.[localeType] ?? ({} as Record<K, V>);
  if (localeType === 'en') {
    const out = {} as Record<K, V>;
    for (const [k, v] of Object.entries(strings) as [K, V][]) {
      out[k] = typeof v === 'string'
        ? (fabiPrefix(docsLocale === 'vi' ? (viUi as Record<string, string>)[v] || v : debrandEn(v)) as V)
        : v;
    }
    return [out, localeType] as const;
  }
  return [strings, localeType] as const;
};

/**
 * antd-storybook: one English UI string of a widget outside a locale map (SVG titles, token names in
 * TokenCompare, tooltips, copy messages) in the docs language, with the same overlay as useLocale. `{name}`
 * placeholders take `params` (values such as a colour, not translated): t('Copied: {value}', { value }).
 * scripts/i18n-ui.mjs collects the strings from `t('…')` calls in files that use this hook.
 */
export const useUiText = () => {
  const vi = useDocsLocale() === 'vi';
  return useCallback(
    (s: string, params?: Record<string, string | number>) => {
      const text = fabiPrefix(vi ? (viUi as Record<string, string>)[s] || s : debrandEn(s));
      return params ? text.replace(/\{(\w+)\}/g, (m, k: string) => (k in params ? String(params[k]) : m)) : text;
    },
    [vi],
  );
};

export default useLocale;

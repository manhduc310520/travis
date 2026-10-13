import rawTokenMeta from 'antd/es/version/token-meta.json';
import rawTokenData from 'antd/es/version/token.json';
import viTokens from '../../../../i18n/vi/tokens.json';
import { useDocsLocale } from '../../../../.storybook/locale';
import { debrandEn, fabiPrefix } from '../../fabiText';

export type GlobalTokenSource = 'seed' | 'map' | 'alias';

export interface GlobalTokenMeta {
  name: string;
  nameEn: string;
  desc: string;
  descEn: string;
  type: string;
  source: GlobalTokenSource;
}

export interface ComponentTokenMeta {
  source: string;
  token: string;
  type: string;
  desc: string;
  descEn: string;
  name: string;
  nameEn: string;
}

export interface VersionTokenMeta {
  global: Record<string, GlobalTokenMeta>;
  components: Record<string, ComponentTokenMeta[]>;
}

export type VersionTokenValue = string | number | boolean;

export interface ComponentTokenStatistic {
  global?: string[];
  component: Record<string, VersionTokenValue>;
}

export type VersionTokenStatistic = Record<string, ComponentTokenStatistic>;

// antd-storybook: token descriptions (descEn) in the docs language (Language toolbar): VN = Vietnamese
// (i18n/vi/tokens.json, keyed by the English description; see scripts/i18n-ui.mjs) where a translation
// exists, EN = the English description, debranded. Both with the fabi- prefix.
const translateMeta = (meta: VersionTokenMeta, desc: (en: string) => string): VersionTokenMeta => {
  const tr = <T extends { descEn: string }>(m: T): T => ({ ...m, descEn: fabiPrefix(desc(m.descEn)) });
  return {
    global: Object.fromEntries(Object.entries(meta.global).map(([k, m]) => [k, tr(m)])),
    components: Object.fromEntries(Object.entries(meta.components).map(([k, list]) => [k, list.map(tr)])),
  };
};

const vi = viTokens as Record<string, string>;
const tokenMetaByLocale = {
  vi: translateMeta(rawTokenMeta as VersionTokenMeta, (en) => vi[en] || en),
  en: translateMeta(rawTokenMeta as VersionTokenMeta, debrandEn),
};

/** Token meta in the docs language. */
export const useTokenMeta = () => tokenMetaByLocale[useDocsLocale()];

/** Token names, types and sources (the same in both languages); descriptions in English. */
export const tokenMeta = tokenMetaByLocale.en;

export const tokenData = rawTokenData as VersionTokenStatistic;

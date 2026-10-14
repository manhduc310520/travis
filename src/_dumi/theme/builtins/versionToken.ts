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
// FABi docs describe one version only: no "In v5, we added…" / "Từ v5, có thêm…" in token descriptions
const noVersion = (s: string) =>
  s
    .replace(/In v5, we added a layer of (\w+) color derivation algorithm to produce/g, 'A $1 color derivation algorithm produces')
    .replace(/Từ v5, có thêm một lớp thuật toán/g, 'Một lớp thuật toán');
const tokenMetaByLocale = {
  vi: translateMeta(rawTokenMeta as VersionTokenMeta, (en) => noVersion(vi[en] || en)),
  en: translateMeta(rawTokenMeta as VersionTokenMeta, (en) => noVersion(debrandEn(en))),
};

/** Token meta in the docs language. */
export const useTokenMeta = () => tokenMetaByLocale[useDocsLocale()];

/** Token names, types and sources (the same in both languages); descriptions in English. */
export const tokenMeta = tokenMetaByLocale.en;

export const tokenData = rawTokenData as VersionTokenStatistic;

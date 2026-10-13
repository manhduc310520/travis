// antd-storybook: text of the antd site widgets (labels, Semantic DOM notes) and the token descriptions, as
// the docs show it. Used at runtime by hooks/useLocale.ts and theme/builtins/versionToken.ts, and by
// scripts/check-brand.mjs (Node runs this file as TypeScript), so the check sees what the pages render.

/** Class names and CSS variables use the fabi- prefix (B5). */
export const fabiPrefix = (s: string) =>
  s
    .replace(/--ant-(?=[a-z])/g, '--fabi-')
    .replace(/(?<![\w$@/-])anticon\b/g, 'fabi-icon')
    .replace(/(?<![\w$@/-])ant-(?!design\b)(?=[a-z])/g, 'fabi-')

/**
 * English strings (EN in the Language toolbar): the brand decisions of the docs text (scripts/brand-edits.mjs,
 * scripts/debrand-i18n.mjs for the Vietnamese ones): "in / of / for / with Ant Design" → "… the system",
 * other "Ant Design" → "FABi CMS Design System", Ant company names → "FABi CMS", antd in prose → "the library",
 * the Kitchen (Ant design tool) hint is dropped. Code in backticks is left alone.
 */
export const debrandEn = (s: string) =>
  s
    .split(/(`[^`]*`)/)
    .map((part) => (part.startsWith('`') ? part : part
      .replace(/ ?You can paste using the Kitchen plugin\./g, '')
      .replace(/\b(in|of|for|with) Ant Design\b/g, '$1 the system')
      .replace(/\bAnt Design\b/g, 'FABi CMS Design System')
      .replace(/\bAnt Financial\b|\bAnt Group\b|\bAntFin\b/g, 'FABi CMS')
      .replace(/(^|[.!?]\s+)antd\b(?![/.-])/g, '$1The library')
      .replace(/\bantd\b(?![/.-])/g, 'the library')))
    .join('')

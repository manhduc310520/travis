/**
 * Generates real CSS custom properties from the theme's own token modules —
 * `src/theme/tokens.css` is a derived artifact, not a second source of
 * truth. Ant Design itself never reads this file (it consumes the same
 * tokens as JS via ConfigProvider); this exists so the tokens are usable
 * outside Ant Design too, and so the Storybook docs pages can show a real
 * `var(--...)` the way Narmi's design tokens page does.
 *
 * Scoped with the same `data-brand` / `data-mode` / `data-density`
 * attributes `.storybook/preview.tsx` already sets on its frame, so this
 * stylesheet updates live when the toolbar switches theme.
 *
 * Run: node scripts/generate-css-vars.mjs
 */
import fs from 'node:fs'
import { semanticFixed, semanticBrand } from '../src/theme/semanticTokens.ts'
import { dimensionTokens, screenTokens, DENSITIES } from '../src/theme/dimensionTokens.ts'
import { kebab } from '../src/theme/cssVarName.ts'

// Derived from the data itself (not re-imported from index.ts, whose
// extensionless imports Node's plain ESM loader can't resolve) so this
// never drifts out of sync with what semanticBrand actually contains.
const brandModePairs = Object.keys(semanticBrand)
const BRANDS = [...new Set(brandModePairs.map((k) => k.split('.')[0]))]
const MODES = [...new Set(brandModePairs.map((k) => k.split('.')[1]))]

const declBlock = (tokens, unit = '') =>
  Object.entries(tokens)
    .map(([key, value]) => `  --${kebab(key)}: ${value}${typeof value === 'number' ? unit : ''};`)
    .join('\n')

const parts = []

parts.push(
  '/* GENERATED FILE — do not edit by hand. */',
  '/* Source: src/theme/semanticTokens.ts, dimensionTokens.ts. Regenerate with `npm run generate:css-vars`. */',
  '',
  ':root {',
  declBlock(screenTokens, 'px'),
  '}',
)

for (const mode of MODES) {
  parts.push('', `[data-mode="${mode}"] {`, declBlock(semanticFixed[mode]), '}')
}

for (const brand of BRANDS) {
  for (const mode of MODES) {
    parts.push('', `[data-brand="${brand}"][data-mode="${mode}"] {`, declBlock(semanticBrand[`${brand}.${mode}`]), '}')
  }
}

for (const density of DENSITIES) {
  parts.push('', `[data-density="${density}"] {`, declBlock(dimensionTokens[density], 'px'), '}')
}

const css = parts.join('\n') + '\n'
fs.writeFileSync(new URL('../src/theme/tokens.css', import.meta.url), css)
console.log(`wrote src/theme/tokens.css (${css.length} bytes)`)

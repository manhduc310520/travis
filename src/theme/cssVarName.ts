/**
 * camelCase -> kebab-case, acronym-aware: `controlHeightXS` becomes
 * `control-height-xs`, not `control-height-x-s`. The one rule both
 * `scripts/generate-css-vars.mjs` and the Storybook token-table docs use, so
 * a token's displayed `var(--...)` name always matches what's actually in
 * `tokens.css`.
 */
export function kebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

export function cssVarName(tokenKey: string): string {
  return `--${kebab(tokenKey)}`
}

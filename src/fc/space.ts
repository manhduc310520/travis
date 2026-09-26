/** Steps of the fc spacing scale (4px grid). Layout props take these, never raw px. */
export type SpaceScale = 'xxs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | 'xxl'

/** Gap between elements → `space/margin/*`. */
export const gapVar = (step: SpaceScale) => `var(--fc-space-margin-${step})`

export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(' ')

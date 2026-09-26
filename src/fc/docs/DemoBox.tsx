import type { HTMLAttributes } from 'react'

/** Placeholder block for layout stories — styled only with fc tokens. */
export function DemoBox({ style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      style={{
        padding: 'var(--fc-space-padding-xs) var(--fc-space-padding-sm)',
        background: 'var(--fc-color-background-accent-faded)',
        border: 'var(--fc-stroke-width-base) solid var(--fc-color-border-accent-light)',
        borderRadius: 'var(--fc-radius-sm)',
        color: 'var(--fc-color-content-neutral-strong)',
        textAlign: 'center',
        ...style,
      }}
    />
  )
}

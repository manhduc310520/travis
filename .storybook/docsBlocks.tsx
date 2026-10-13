import { useContext, useMemo, type ComponentProps } from 'react'
import { Controls, DocsContext } from '@storybook/addon-docs/blocks'
import { useDocsLocale } from './locale'

/** Cells of one prop row in the Vietnamese API table, where they differ from the English one. */
export type ArgDocs = { description?: string; type?: string; defaultValue?: string }

type ArgType = { description?: string; table?: { type?: { summary?: string }; defaultValue?: { summary?: string } } }
type Resolved = { type: string; story?: { argTypes: Record<string, ArgType> } }

const localize = (at: ArgType, vi: ArgDocs): ArgType => ({
  ...at,
  ...(vi.description !== undefined && { description: vi.description }),
  table: {
    ...at.table,
    ...(vi.type !== undefined && { type: { ...at.table?.type, summary: vi.type } }),
    ...(vi.defaultValue !== undefined && { defaultValue: { ...at.table?.defaultValue, summary: vi.defaultValue } }),
  },
})

/**
 * Controls table of a generated docs page that follows the Language toolbar. The story's argTypes come from
 * the English API table (the story source shown under the Playground is code, which stays English; the
 * Controls addon panel shows them too); `vi` holds the cells of the Vietnamese API table. In VN the block reads
 * the story through a docs context that swaps those cells; the story itself (args, updates) is untouched.
 */
export function LocalizedControls({ vi, ...props }: ComponentProps<typeof Controls> & { vi: Record<string, ArgDocs> }) {
  const context = useContext(DocsContext)
  const locale = useDocsLocale()
  const localized = useMemo(() => {
    if (locale !== 'vi') return context
    // one localized copy per story object, so hooks keyed on the story see a stable value
    const cache = new WeakMap<object, unknown>()
    const resolveOf = (...args: unknown[]) => {
      const resolved = (context.resolveOf as (...a: unknown[]) => Resolved)(...args)
      const story = resolved.story
      if (resolved.type !== 'story' || !story) return resolved
      if (!cache.has(story)) {
        const argTypes = Object.fromEntries(Object.entries(story.argTypes).map(([k, at]) => [k, vi[k] ? localize(at, vi[k]) : at]))
        cache.set(story, { ...resolved, story: { ...story, argTypes } })
      }
      return cache.get(story)
    }
    // inherits every other member (and the prototype methods) of the docs context
    return Object.create(context, { resolveOf: { value: resolveOf } }) as typeof context
  }, [context, vi, locale])
  return (
    <DocsContext.Provider value={localized}>
      <Controls {...props} />
    </DocsContext.Provider>
  )
}

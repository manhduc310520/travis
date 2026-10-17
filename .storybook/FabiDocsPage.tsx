import { useContext } from 'react'
import { Controls, Description, DocsContext, Markdown, Primary, Story, Title } from '@storybook/addon-docs/blocks'
import { CodeBox } from './DemoBox'
import { useDocsLocale } from './locale'

const TEXT = {
  vi: { examples: 'Ví dụ' },
  en: { examples: 'Examples' },
}

type DocsStory = {
  id: string
  name: string
  tags?: string[]
  moduleExport: unknown
  parameters?: { docs?: { source?: { code?: string; originalSource?: string }; description?: { story?: string } } }
}

/**
 * Docs page of FABi's own components (src/fabi, autodocs), laid out like the generated component pages
 * (user 2026-10-17): title and description, the first story as the Playground with its Controls, then every
 * other story in the library site's code box (.storybook/DemoBox.tsx) with its description and code.
 */
export default function FabiDocsPage() {
  const context = useContext(DocsContext) as unknown as { componentStories: () => DocsStory[] }
  const t = TEXT[useDocsLocale() === 'vi' ? 'vi' : 'en']
  const [, ...examples] = context.componentStories().filter((s) => !s.tags?.includes('!autodocs'))
  return (
    <>
      <Title />
      <Description />
      <h2 lang="en">Playground</h2>
      <Primary />
      <Controls />
      {examples.length > 0 && <h2>{t.examples}</h2>}
      {examples.map((s) => {
        const docs = s.parameters?.docs
        const code = docs?.source?.code ?? docs?.source?.originalSource
        const description = docs?.description?.story
        return (
          <CodeBox key={s.id} id={`anchor--${s.id}`} title={s.name} code={code} demo={<Story of={s.moduleExport as never} />}>
            {description ? <Markdown>{description}</Markdown> : null}
          </CodeBox>
        )
      })}
    </>
  )
}

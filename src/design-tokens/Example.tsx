import type { ReactNode } from 'react'
import { Markdown } from '@storybook/addon-docs/blocks'
import { useDocsLocale } from '../../.storybook/locale'
import { CodeBox } from '../../.storybook/DemoBox'

// UI words of the example box, by docs language (Language toolbar)
const TEXT = {
  vi: { deps: 'Cần cài thêm:' },
  en: { deps: 'Also install:' },
}

/**
 * A live @fabi/ui example on a Design Tokens page, in the same box as the component pages' examples
 * (.storybook/DemoBox.tsx, like ant.design's code box): the rendered demo, then the title on the border, the
 * example's own description and the icon actions for its code. Inline `| demo` blocks on the antd site show
 * no code, so neither does this.
 */
export default function Example({ code, inline, title, description, deps, children }: { code: string; inline?: boolean; title?: string; description?: string; deps?: string[]; children: ReactNode }) {
  const text = TEXT[useDocsLocale()]
  const notes = description || deps?.length ? (
    <>
      {description && <Markdown>{description}</Markdown>}
      {/* packages the example imports besides @fabi/ui and React (scripts/fabi-names.mjs) */}
      {deps?.length ? <p className="fabi-sb-deps">{text.deps} {deps.map((d, i) => <span key={d}>{i ? ', ' : ''}<code>{d}</code></span>)}</p> : null}
    </>
  ) : null
  return (
    <CodeBox title={title} code={inline ? undefined : code} demo={children}>
      {notes}
    </CodeBox>
  )
}

import { useState, type ReactNode } from 'react'
import { Markdown, Source } from '@storybook/addon-docs/blocks'
import { useDocsLocale } from '../../.storybook/locale'

// UI words of the example box, by docs language (Language toolbar)
const TEXT = {
  vi: { deps: 'Cần cài thêm:', show: 'Xem code', hide: 'Ẩn code' },
  en: { deps: 'Also install:', show: 'Show code', hide: 'Hide code' },
}

/**
 * A live @fabi/ui example on a Design Tokens page, laid out like ant.design's code box: the
 * rendered demo, then (inside the same box) the example's own description, then a toggle for
 * its source code. Inline `| demo` blocks on the antd site show no code, so neither does this.
 */
export default function Example({ code, inline, description, deps, children }: { code: string; inline?: boolean; description?: string; deps?: string[]; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const text = TEXT[useDocsLocale()]
  return (
    <div className="fabi-sb-example">
      <div className="fabi-sb-example-preview fabi-sb-block">{children}</div>
      {description && <div className="fabi-sb-example-description"><Markdown>{description}</Markdown></div>}
      {/* packages the example imports besides @fabi/ui and React (scripts/fabi-names.mjs) */}
      {deps?.length ? <p className="fabi-sb-deps">{text.deps} {deps.map((d, i) => <span key={d}>{i ? ', ' : ''}<code>{d}</code></span>)}</p> : null}
      {!inline && (
        <>
          <button type="button" className="fabi-sb-example-toggle" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? text.hide : text.show}
          </button>
          {open && <Source code={code} language="tsx" dark />}
        </>
      )}
    </div>
  )
}

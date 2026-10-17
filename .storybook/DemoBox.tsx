import { useEffect, useState, type ReactNode } from 'react'
import { Source, Story } from '@storybook/addon-docs/blocks'
import { CheckLine, Code02Line, Copy01Line } from '@fabi/ui/fabi-icons'
import { useDocsLocale } from './locale'

// UI words of the box, by docs language (Language toolbar)
const TEXT = {
  vi: { copy: 'Sao chép code', copied: 'Đã sao chép', show: 'Xem code', hide: 'Ẩn code' },
  en: { copy: 'Copy code', copied: 'Copied', show: 'Show code', hide: 'Hide code' },
}

/**
 * The example box of every docs page, laid out like the code box of the underlying library's site (user
 * 2026-10-17): the live demo on top, then the meta part with the title sitting on its top border, the
 * description, and a row of icon actions (copy, show code); the code opens under them. Without `code` (inline
 * examples) there are no actions. Styles: docs.css (.fabi-sb-codebox).
 */
export function CodeBox({ id, title, demo, code, children }: { id?: string; title?: string; demo: ReactNode; code?: string; children?: ReactNode }) {
  const text = TEXT[useDocsLocale()]
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])
  const copy = () => code && navigator.clipboard?.writeText(code).then(() => setCopied(true), () => {})
  const hasMeta = !!(title || children || code)
  return (
    <section className="fabi-sb-codebox" aria-labelledby={title ? id : undefined}>
      <div className={`fabi-sb-codebox-demo fabi-sb-block sb-unstyled${hasMeta ? '' : ' fabi-sb-codebox-demo-only'}`}>{demo}</div>
      {hasMeta && (
        <div className="fabi-sb-codebox-meta">
          {title && <h3 id={id} className="fabi-sb-codebox-title" lang="en">{title}</h3>}
          {children && <div className="fabi-sb-codebox-description">{children}</div>}
          {code && (
            <div className="fabi-sb-codebox-actions">
              <button type="button" className="fabi-sb-codebox-action" aria-label={copied ? text.copied : text.copy} title={copied ? text.copied : text.copy} onClick={copy}>
                {copied ? <CheckLine aria-hidden /> : <Copy01Line aria-hidden />}
              </button>
              <button type="button" className="fabi-sb-codebox-action" aria-label={open ? text.hide : text.show} title={open ? text.hide : text.show} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
                <Code02Line aria-hidden />
              </button>
            </div>
          )}
        </div>
      )}
      {code && open && (
        <div className="fabi-sb-codebox-source">
          <Source code={code} language="tsx" />
        </div>
      )}
    </section>
  )
}

/**
 * One example of a generated component page (scripts/convert.mjs): the story rendered live in a CodeBox. The
 * title keeps the anchor id the docs text and the table of contents link to.
 */
export default function DemoBox({ id, title, of, code, children }: { id: string; title: string; of: unknown; code: string; children?: ReactNode }) {
  return (
    <CodeBox id={id} title={title} code={code} demo={<Story of={of as never} />}>
      {children}
    </CodeBox>
  )
}

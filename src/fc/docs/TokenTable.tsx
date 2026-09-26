import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Button as AriaButton } from 'react-aria-components'
import { FC_TOKENS, fcVar, type FcTokenName, type FcTokenType } from '../tokens.meta'
import styles from './TokenTable.module.css'

export type TokenPreview = 'color' | 'radius' | 'spacing' | 'font-size' | 'font-weight' | 'font-family' | 'border-width' | 'none'

const typeOf = (name: FcTokenName): FcTokenType => FC_TOKENS.find((t) => t.name === name)!.type

/** rgb()/rgba()/color(srgb …) → #RRGGBB[AA] */
function toHex(css: string): string {
  let m = css.match(/^rgba?\(([^)]+)\)$/)
  let rgba: number[] | null = null
  if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); rgba = [p[0], p[1], p[2], p[3] ?? 1] }
  m = css.match(/^color\(srgb ([^)]+)\)$/)
  if (m) { const p = m[1].split(/[\s/]+/).filter(Boolean).map(Number); rgba = [p[0] * 255, p[1] * 255, p[2] * 255, p[3] ?? 1] }
  if (!rgba) return css
  const h = (v: number) => Math.round(v).toString(16).padStart(2, '0').toUpperCase()
  return '#' + h(rgba[0]) + h(rgba[1]) + h(rgba[2]) + (rgba[3] < 1 ? h(rgba[3] * 255) : '')
}

/**
 * Reads the value the browser actually resolved, and reads it again whenever
 * the themed ancestor's data-brand / data-mode / data-density changes — so the
 * table follows the Storybook toolbar.
 */
function useResolved(name: FcTokenName) {
  const probe = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState('')
  useLayoutEffect(() => {
    const el = probe.current
    if (!el) return
    const read = () =>
      setValue(typeOf(name) === 'color'
        ? toHex(getComputedStyle(el).color)
        : getComputedStyle(el).getPropertyValue(fcVar(name)).trim())
    read()
    const themed = el.closest('[data-brand]')
    if (!themed) return
    const observer = new MutationObserver(read)
    observer.observe(themed, { attributes: true, attributeFilter: ['data-brand', 'data-mode', 'data-density'] })
    return () => observer.disconnect()
  }, [name])
  const probeStyle: CSSProperties = typeOf(name) === 'color' ? { color: `var(${fcVar(name)})` } : {}
  return { value, probe: <span ref={probe} className={styles.probe} style={probeStyle} aria-hidden="true" /> }
}

function Preview({ kind, name }: { kind: TokenPreview; name: FcTokenName }) {
  const v = `var(${fcVar(name)})`
  switch (kind) {
    case 'color': return <div className={styles.swatch} style={{ background: v }} />
    case 'radius': return <div className={styles.box} style={{ borderRadius: v }} />
    // Same footprint as a colour swatch; the bar inside is the token's length.
    case 'spacing': return <div className={styles.track}><div className={styles.bar} style={{ width: v }} /></div>
    case 'border-width': return <div className={styles.stroke} style={{ borderWidth: v }} />
    case 'font-size': return <span className={styles.sample} style={{ fontSize: v }}>Aa</span>
    case 'font-weight': return <span className={styles.sample} style={{ fontWeight: v }}>Aa</span>
    case 'font-family': return <span className={styles.sample} style={{ fontFamily: v }}>Aa</span>
    case 'none': return null
  }
}

function Row({ name, preview }: { name: FcTokenName; preview: TokenPreview }) {
  const { value, probe } = useResolved(name)
  const [copied, setCopied] = useState(false)
  const cssText = `var(${fcVar(name)})`
  return (
    <tr>
      {preview !== 'none' && <td><Preview kind={preview} name={name} /></td>}
      <td className={styles.code}>
        <AriaButton
          className={styles.copy}
          aria-label={`Copy ${cssText}`}
          onPress={() => {
            navigator.clipboard?.writeText(cssText)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1200)
          }}
        >
          {cssText}
        </AriaButton>
        {copied && <span className={styles.copied} role="status">Copied</span>}
      </td>
      <td className={`${styles.code} ${styles.value}`}>
        {probe}
        {value}
      </td>
    </tr>
  )
}

export function TokenTable({ tokens, preview = 'none' }: { tokens: FcTokenName[]; preview?: TokenPreview }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {preview !== 'none' && <th className={styles.previewCol}>Preview</th>}
            <th>CSS</th>
            <th className={styles.valueCol}>Value</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((name) => <Row key={name} name={name} preview={preview} />)}
        </tbody>
      </table>
    </div>
  )
}

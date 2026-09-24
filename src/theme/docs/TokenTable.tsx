import { theme, Typography } from 'antd'
import { cssVarName } from '../cssVarName'

const { Text } = Typography

export type TokenRow = {
  /** The token's own key, e.g. `colorPrimary`. Matches `tokens.css` 1:1 via `cssVarName`. */
  token: string
  /** Resolved value for this row's example (Blue brand, Light mode, Default density). */
  value: string
}

/**
 * Preview/CSS/Value table — the layout Narmi's Design Tokens docs use for
 * every token category. One reusable block instead of one bespoke table per
 * page, so Color/Border/Layout stay visually identical.
 */
export type TokenPreviewKind = 'color' | 'radius' | 'spacing' | 'font-size' | 'border-width'

export function TokenTable({ rows, kind }: { rows: TokenRow[]; kind: TokenPreviewKind }) {
  const { token } = theme.useToken()
  // `fontFamilyCode` is the project's own seed token (see theme/index.ts),
  // set project-wide to match what was measured live off Narmi's token
  // tables. Ant Design's own `Text code` was dropped here because it renders
  // a pink pill background; Narmi's code cells are plain colored monospace
  // text with no background.
  const codeFont = { fontFamily: token.fontFamilyCode, fontSize: 14 }

  return (
    // No card wrapper here — `@storybook/addon-docs`'s own `.sbdocs-preview`
    // block already draws a bordered, shadowed, rounded box around every
    // `<Canvas>` on a Docs page (verified live on both this project and
    // Narmi's: same border color/width/shadow, only the radius differs by a
    // few px). Adding another one here nested a second box inside the first.
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${token.colorBorder}` }}>
            <th style={{ ...codeFont, textAlign: 'left', padding: '8px 4px', width: 120, color: token.colorText }}>Preview</th>
            <th style={{ ...codeFont, textAlign: 'left', padding: '8px 4px', color: token.colorText }}>CSS</th>
            <th style={{ ...codeFont, textAlign: 'left', padding: '8px 4px', width: 140, color: token.colorText }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ token: key, value }) => (
            <tr key={key} style={{ borderBottom: `1px solid ${token.colorBorder}` }}>
              <td style={{ padding: '8px 4px' }}>
                <Preview kind={kind} value={value} />
              </td>
              <td style={{ padding: '8px 4px', whiteSpace: 'nowrap' }}>
                <Text copyable style={{ ...codeFont, color: token.colorLink }}>
                  var({cssVarName(key)})
                </Text>
              </td>
              <td style={{ padding: '8px 4px', whiteSpace: 'nowrap' }}>
                <Text type="secondary" style={{ ...codeFont, fontVariantNumeric: 'tabular-nums' }}>
                  {value}
                </Text>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Preview({ kind, value }: { kind: TokenPreviewKind; value: string }) {
  const { token } = theme.useToken()
  const box = { border: `1px solid ${token.colorBorderSecondary}`, background: token.colorBgContainer }

  switch (kind) {
    case 'color':
      // Flat fill, no border/radius — matches Narmi's own color swatch
      // exactly (verified live: `width: 100%; height: 28px; background`,
      // nothing else). The color itself provides all the contrast needed
      // against the white cell background.
      return <div style={{ width: '100%', height: 28, background: value }} />
    case 'radius':
      return <div style={{ ...box, width: 48, height: 32, borderRadius: value }} />
    case 'spacing':
      return <div style={{ width: 64, height: 32, display: 'flex', alignItems: 'center' }}><div style={{ width: value, height: 8, background: token.colorPrimary, borderRadius: 2 }} /></div>
    case 'font-size':
      return <span style={{ fontSize: value }}>Aa</span>
    case 'border-width':
      return <div style={{ width: 48, height: 32, borderRadius: 4, background: token.colorBgContainer, borderStyle: 'solid', borderWidth: value, borderColor: token.colorPrimary }} />
  }
}

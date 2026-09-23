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

  return (
    // Narrow viewports (mobile toolbar, a docked panel) would otherwise wrap
    // `var(--token-name)` one character per line — scroll the table
    // horizontally instead of letting that happen.
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
            <th style={{ textAlign: 'left', padding: '8px 12px', width: 120 }}>Preview</th>
            <th style={{ textAlign: 'left', padding: '8px 12px' }}>CSS</th>
            <th style={{ textAlign: 'left', padding: '8px 12px', width: 140 }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ token: key, value }) => (
            <tr key={key} style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
              <td style={{ padding: '8px 12px' }}>
                <Preview kind={kind} value={value} />
              </td>
              <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                <Text code copyable>
                  var({cssVarName(key)})
                </Text>
              </td>
              <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                <Text type="secondary" style={{ fontVariantNumeric: 'tabular-nums' }}>
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
      return <div style={{ ...box, width: 64, height: 32, borderRadius: 4, background: value }} />
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

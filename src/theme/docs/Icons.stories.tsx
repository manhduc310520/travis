import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { useMemo, useState } from 'react'
import { Typography, theme, Input } from 'antd'
import * as ProIcons from '@untitledui-pro/icons/line'
import type { FC, SVGProps } from 'react'
import { SearchMd } from '../../icons'

const { Title, Text } = Typography

type IconProps = SVGProps<SVGSVGElement> & { size?: number; color?: string }

/**
 * The full purchased catalog — `@untitledui-pro/icons/line`, 1,174 icons —
 * not just the ~51 this project currently imports through `src/icons.tsx`.
 * Sorted once at module scope so search never re-sorts on every keystroke.
 */
const allIcons: [string, FC<IconProps>][] = Object.entries(ProIcons)
  .filter((entry): entry is [string, FC<IconProps>] => typeof entry[1] === 'function')
  .sort(([a], [b]) => a.localeCompare(b))

function IconGallery() {
  const { token } = theme.useToken()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allIcons
    return allIcons.filter(([name]) => name.toLowerCase().includes(q))
  }, [query])

  return (
    <div style={{ maxWidth: 900 }}>
      <Title level={2} style={{ marginTop: 0 }}>
        Icons
      </Title>
      <Text type="secondary">
        The full <code>@untitledui-pro/icons/line</code> catalog — {allIcons.length} icons, PascalCase
        names matching the <code>🍑 Icon</code> page in Figma (kebab-case there, e.g. <code>home-03</code>{' '}
        ↔ <code>Home03</code> here). Only a subset is actually wired up in <code>src/icons.tsx</code> for
        use in components — this page is for browsing the full set when adding a new one.
      </Text>

      <Input
        prefix={<SearchMd style={{ color: token.colorTextPlaceholder }} />}
        placeholder="Search icons by name…"
        allowClear
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ maxWidth: 320, margin: '20px 0' }}
      />

      <Text type="secondary" style={{ fontSize: 12 }}>
        {filtered.length} of {allIcons.length} icons
      </Text>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
        {filtered.map(([name, Icon]) => (
          <div key={name} style={{ width: 84, textAlign: 'center' }}>
            <div
              style={{
                width: '100%',
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: token.colorFillTertiary,
                borderRadius: token.borderRadius,
                border: `1px solid ${token.colorBorderSecondary}`,
                color: token.colorText,
              }}
            >
              <Icon size={32} />
            </div>
            <Text style={{ fontSize: 11, display: 'block', marginTop: 4, wordBreak: 'break-word' }}>{name}</Text>
          </div>
        ))}
      </div>
    </div>
  )
}

const meta: Meta<typeof IconGallery> = {
  title: 'Design Tokens/Icons',
  component: IconGallery,
  tags: ['ai-generated', 'needs-work'],
}
export default meta
type Story = StoryObj<typeof IconGallery>

export const AllIcons: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Home01')).toBeVisible()
    const input = canvas.getByPlaceholderText('Search icons by name…')
    await expect(input).toBeVisible()

    // Typing filters the grid down to matching names only.
    await userEvent.type(input, 'clock')
    await expect(canvas.getByText('AlarmClock')).toBeVisible()
    await expect(canvas.queryByText('Home01')).not.toBeInTheDocument()
  },
}

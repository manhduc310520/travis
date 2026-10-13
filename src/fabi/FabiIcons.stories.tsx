// Gallery of @fabi/ui/fabi-icons: every icon of the design's set, line and solid (user 2026-10-13).
// Generated components (packages/fabi-ui/scripts/gen-fabi-icons.mjs); the catalog lists each icon name
// with its category, keywords and its line / solid components.
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useMemo, useState } from 'react'
import { App, Empty, Flex, Input, Segmented, Typography, theme } from '@fabi/ui'
import * as FabiIcons from '@fabi/ui/fabi-icons'
import type { FabiIcon } from '@fabi/ui/fabi-icons'
import catalog from '../../packages/fabi-ui/icons/catalog.json'
import { useDocsLocale } from '../../.storybook/locale'

type Row = { name: string; category: string; keywords: string; line: string | null; solid: string | null }
type Style = 'line' | 'solid'
const ROWS = catalog as Row[]
const ICONS = FabiIcons as unknown as Record<string, FabiIcon>

const TEXT = {
  en: {
    intro: 'The design\'s icon set: a line and a solid version of each icon on a 24 × 24 grid. Icons are sized 1em and take the text colour, so they fit every antd `icon` prop. Use the line icon by default and the solid one for the selected state (e.g. the selected Menu item). Click an icon to copy its import.',
    search: 'Search icons (name or keyword)',
    count: (n: number) => `${n} icons`,
    copied: (name: string) => `Copied: import { ${name} } from '@fabi/ui/fabi-icons'`,
    none: 'No icon matches',
    copyFailed: 'Could not copy. Select the name and copy it by hand.',
  },
  vi: {
    intro: 'Bộ icon của thiết kế: mỗi icon có bản line và bản solid, lưới 24 × 24. Icon cỡ 1em và theo màu chữ, nên dùng được trong mọi prop `icon` của antd. Mặc định dùng bản line; bản solid cho trạng thái đang chọn (ví dụ mục Menu đang chọn). Bấm vào icon để sao chép lệnh import.',
    search: 'Tìm icon (tên hoặc từ khoá)',
    count: (n: number) => `${n} icon`,
    copied: (name: string) => `Đã sao chép: import { ${name} } from '@fabi/ui/fabi-icons'`,
    none: 'Không có icon phù hợp',
    copyFailed: 'Không sao chép được. Hãy chọn tên icon và sao chép thủ công.',
  },
}

function IconGallery() {
  const locale = useDocsLocale()
  const t = TEXT[locale] ?? TEXT.en
  const { token } = theme.useToken()
  const { message } = App.useApp()
  const [style, setStyle] = useState<Style>('line')
  const [query, setQuery] = useState('')
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = ROWS.filter((r) => r[style] && (!q || r.name.includes(q) || r.keywords.toLowerCase().includes(q) || r[style]!.toLowerCase().includes(q)))
    const byCategory = new Map<string, Row[]>()
    for (const r of rows) byCategory.set(r.category, [...(byCategory.get(r.category) ?? []), r])
    return { total: rows.length, list: [...byCategory] }
  }, [style, query])

  const copy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(`import { ${name} } from '@fabi/ui/fabi-icons'`)
      void message.success(t.copied(name))
    } catch {
      void message.error(t.copyFailed)
    }
  }

  return (
    <Flex vertical gap="large">
      <Typography.Paragraph style={{ marginBottom: 0, maxWidth: 760 }}>{t.intro}</Typography.Paragraph>
      <Flex gap="middle" wrap align="center">
        <Segmented<Style>
          options={[{ label: 'Line', value: 'line' }, { label: 'Solid', value: 'solid' }]}
          value={style}
          onChange={setStyle}
        />
        <Input.Search allowClear placeholder={t.search} aria-label={t.search} style={{ maxWidth: 360 }} onChange={(e) => setQuery(e.target.value)} />
        <Typography.Text type="secondary" role="status">{groups.total === 0 ? t.none : t.count(groups.total)}</Typography.Text>
      </Flex>
      {groups.total === 0 && <Empty description={t.none} />}
      {groups.list.map(([category, rows]) => (
        <section key={category} aria-label={category}>
          <Typography.Title level={5}>{category}</Typography.Title>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(136px, 1fr))', gap: token.marginXS }}>
            {rows.map((r) => {
              const name = r[style]!
              const Icon = ICONS[name]
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => void copy(name)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: token.marginXS,
                    padding: `${token.padding}px ${token.paddingXS}px`,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: token.borderRadiusLG,
                    background: token.colorBgContainer,
                    color: token.colorText,
                    cursor: 'pointer',
                    font: 'inherit',
                  }}
                >
                  {Icon && <Icon style={{ fontSize: 24 }} />}
                  <Typography.Text style={{ fontSize: token.fontSizeSM, wordBreak: 'break-all', textAlign: 'center' }}>{name}</Typography.Text>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </Flex>
  )
}

const meta: Meta = {
  title: 'Components/General/FABi Icons',
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
}
export default meta

export const Gallery: StoryObj = {
  render: () => (
    <App>
      <IconGallery />
    </App>
  ),
}

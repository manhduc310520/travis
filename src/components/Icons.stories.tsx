import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Typography, theme, Divider } from 'antd'
import * as Icons from '../icons'
import type { IconProps } from '../icons'
import type { FC } from 'react'

const { Title, Text } = Typography

/**
 * Every icon this system actually imports from `../icons`, grouped exactly
 * as `icons.tsx` groups its own exports — so this story can never drift
 * from the real set without the grouping itself looking wrong.
 */
const groups: [string, FC<IconProps>[]][] = [
  ['Điều hướng', [Icons.Home01, Icons.Building02, Icons.BookOpen01, Icons.Tag01, Icons.Printer, Icons.Users01, Icons.PieChart01, Icons.Settings01]],
  ['Thanh công cụ (Chrome)', [Icons.SearchMd, Icons.Bell01, Icons.User01, Icons.LayoutLeft, Icons.Menu02, Icons.Columns03]],
  ['Chevron & mũi tên', [Icons.ChevronDown, Icons.ChevronRight, Icons.ArrowUp]],
  ['Hành động', [Icons.Plus, Icons.Edit01, Icons.Trash01, Icons.Eye, Icons.Upload01, Icons.UploadCloud01, Icons.HelpCircle]],
  ['App Shell — điều hướng chính', [Icons.Home03, Icons.LayoutAlt03, Icons.Tag03, Icons.PieChart04, Icons.Grid01, Icons.ShoppingCart01, Icons.FileSearch02, Icons.Monitor03, Icons.Mail01, Icons.File06, Icons.CheckCircleBroken]],
  ['Ghi đè icon nội bộ Ant Design', [Icons.Check, Icons.XClose, Icons.Calendar, Icons.Clock, Icons.Loading02, Icons.AlertCircle, Icons.InfoCircle, Icons.AlertTriangle, Icons.XCircle, Icons.CheckCircle, Icons.Star01, Icons.EyeOff, Icons.DotsHorizontal, Icons.X]],
]

const nameOf = (Cmp: FC<IconProps>) =>
  Object.entries(Icons).find(([, v]) => v === Cmp)?.[0] ?? '?'

function IconGallery() {
  const { token } = theme.useToken()

  return (
    <div style={{ maxWidth: 900 }}>
      <Title level={2} style={{ marginTop: 0 }}>
        Icons
      </Title>
      <Text type="secondary">
        Bộ icon thật đang được import trong <code>src/icons.tsx</code> — bọc từ{' '}
        <code>@untitledui/icons</code>, cùng tên với trang <code>🍑 Icon</code> trong Figma
        (kebab-case, ví dụ <code>home-03</code> ↔ <code>Home03</code>). Không phải icon nào của
        Figma cũng có ở đây — chỉ những icon hệ thống thực sự dùng.
      </Text>

      {groups.map(([label, icons]) => (
        <div key={label}>
          <Divider />
          <Title level={4}>
            {label} <Text type="secondary" style={{ fontWeight: 400, fontSize: 13 }}>({icons.length})</Text>
          </Title>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 12 }}>
            {icons.map((Icon) => {
              const name = nameOf(Icon)
              return (
                <div key={name} style={{ width: 84, textAlign: 'center' }}>
                  <div
                    style={{
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: token.colorFillTertiary,
                      borderRadius: token.borderRadius,
                      border: `1px solid ${token.colorBorderSecondary}`,
                      color: token.colorText,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <Text style={{ fontSize: 11, display: 'block', marginTop: 4 }}>{name}</Text>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

const meta: Meta<typeof IconGallery> = {
  title: 'Style/Icons',
  component: IconGallery,
  tags: ['ai-generated', 'needs-work'],
}
export default meta
type Story = StoryObj<typeof IconGallery>

export const AllIcons: Story = {
  play: async ({ canvas }) => {
    // Not "Home03" or "Check" — both also appear in the intro paragraph's
    // naming example, so `getByText` finds two matches and throws.
    await expect(canvas.getByText('Bell01')).toBeVisible()
    await expect(canvas.getByText('EyeOff')).toBeVisible()
  },
}

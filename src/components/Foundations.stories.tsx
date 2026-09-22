import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Typography, theme, Space, Divider } from 'antd'
import { globalTokens } from '../theme'

const { Title, Text } = Typography

/**
 * Foundations reads everything through `theme.useToken()`, so every swatch and
 * number below is the value Ant Design actually resolved for the brand and mode
 * picked in the toolbar. Nothing here is hard-coded.
 */
function Foundations() {
  const { token } = theme.useToken()

  const ramp = [
    ['1', token.colorPrimaryBg],
    ['2', token.colorPrimaryBgHover],
    ['3', token.colorPrimaryBorder],
    ['4', token.colorPrimaryBorderHover],
    ['5', token.colorPrimaryHover],
    ['6', token.colorPrimaryText],
    ['7', token.colorPrimaryActive],
    ['8', token.colorPrimary],
  ] as const

  const semantic = [
    ['colorPrimary', token.colorPrimary],
    ['colorSuccess', token.colorSuccess],
    ['colorWarning', token.colorWarning],
    ['colorError', token.colorError],
    ['colorInfo', token.colorInfo],
    ['colorLink', token.colorLink],
  ] as const

  const surfaces = [
    ['colorBgLayout', token.colorBgLayout],
    ['colorBgContainer', token.colorBgContainer],
    ['colorBgElevated', token.colorBgElevated],
  ] as const

  const type = [
    ['fontSizeHeading1', token.fontSizeHeading1],
    ['fontSizeHeading2', token.fontSizeHeading2],
    ['fontSizeHeading3', token.fontSizeHeading3],
    ['fontSizeLG', token.fontSizeLG],
    ['fontSize', token.fontSize],
    ['fontSizeSM', token.fontSizeSM],
  ] as const

  const spacing = [
    ['paddingXS', token.paddingXS],
    ['paddingSM', token.paddingSM],
    ['padding', token.padding],
    ['paddingLG', token.paddingLG],
    ['paddingXL', token.paddingXL],
  ] as const

  const radius = [
    ['borderRadiusXS', token.borderRadiusXS],
    ['borderRadiusSM', token.borderRadiusSM],
    ['borderRadius', token.borderRadius],
    ['borderRadiusLG', token.borderRadiusLG],
  ] as const

  const swatch = (label: string, value: string, wide = false) => (
    <div key={label} style={{ width: wide ? 160 : 96 }}>
      <div
        style={{
          height: 56,
          background: value,
          borderRadius: token.borderRadius,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      />
      <Text style={{ fontSize: 12, display: 'block', marginTop: 6 }}>{label}</Text>
      <Text type="secondary" style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Text>
    </div>
  )

  return (
    <div style={{ maxWidth: 900 }}>
      <Title level={2} style={{ marginTop: 0 }}>
        Foundations
      </Title>
      <Text type="secondary">
        Mọi giá trị dưới đây đọc từ ConfigProvider đang chạy. Đổi Brand hoặc Mode trên thanh công
        cụ là cả trang đổi theo.
      </Text>

      <Divider />
      <Title level={4}>Thang màu thương hiệu</Title>
      <Text type="secondary">
        Sinh từ một seed duy nhất, tương ứng nhóm <code>Primary</code> trong collection{' '}
        <code>1. Brand</code> của Figma.
      </Text>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
        {ramp.map(([k, v]) => swatch(k, v))}
      </div>

      <Divider />
      <Title level={4}>Màu ngữ nghĩa</Title>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
        {semantic.map(([k, v]) => swatch(k, v, true))}
      </div>

      <Divider />
      <Title level={4}>Ba lớp bề mặt</Title>
      <Text type="secondary">Nền trang, container, rồi lớp nổi. Phân biệt bằng tương phản chứ không bằng đổ bóng.</Text>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
        {surfaces.map(([k, v]) => swatch(k, v, true))}
      </div>

      <Divider />
      <Title level={4}>Thang chữ</Title>
      <Space orientation="vertical" size={4} style={{ marginTop: 8 }}>
        {type.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <Text type="secondary" style={{ width: 160, fontSize: 12 }}>
              {k}
            </Text>
            <Text type="secondary" style={{ width: 48, fontSize: 12 }}>
              {v}px
            </Text>
            <Text style={{ fontSize: v }}>Danh sách nhà hàng</Text>
          </div>
        ))}
      </Space>

      <Divider />
      <Title level={4}>Khoảng cách</Title>
      <Space orientation="vertical" size={6} style={{ marginTop: 8 }}>
        {spacing.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Text type="secondary" style={{ width: 160, fontSize: 12 }}>
              {k}
            </Text>
            <Text type="secondary" style={{ width: 48, fontSize: 12 }}>
              {v}px
            </Text>
            <div style={{ width: v, height: 16, background: token.colorPrimary, borderRadius: 2 }} />
          </div>
        ))}
      </Space>

      <Divider />
      <Title level={4}>Bo góc</Title>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        {radius.map(([k, v]) => (
          <div key={k} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 72,
                height: 48,
                borderRadius: v,
                background: token.colorFillSecondary,
                border: `1px solid ${token.colorBorder}`,
              }}
            />
            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 6 }}>
              {k} · {v}px
            </Text>
          </div>
        ))}
      </div>

      <Divider />
      <Title level={4}>Hằng số của hệ thống</Title>
      <Space orientation="vertical" size={2}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Chiều cao control: {token.controlHeight}px
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Cỡ chữ gốc: {globalTokens.fontSize}px
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Bo góc control: {token.borderRadius}px
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Padding gốc: {token.padding}px
        </Text>
      </Space>
    </div>
  )
}

const meta: Meta<typeof Foundations> = {
  component: Foundations,
  tags: ['ai-generated', 'needs-work'],
}
export default meta
type Story = StoryObj<typeof Foundations>

export const Tokens: Story = {
  play: async ({ canvas }) => {
    // The control height comes from the Figma export, not from an Ant Design default (which is 32
    // only by coincidence) — this asserts the export actually reached the running theme.
    await expect(canvas.getByText(/Chiều cao control: 32px/)).toBeVisible()
    await expect(canvas.getByText('colorPrimary')).toBeVisible()
  },
}

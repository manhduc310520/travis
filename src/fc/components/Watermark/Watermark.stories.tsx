import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '../Card/Card'
import { Paragraph, Text } from '../Typography/Typography'
import { Watermark } from './Watermark'

const meta = {
  title: 'Components/Feedback/Watermark',
  component: Watermark,
  args: { content: 'iPOS.com', rotate: -22 },
  argTypes: {
    content: { control: 'text' },
    rotate: { control: { type: 'number', step: 1 } },
    tileSize: { control: 'object' },
    image: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Watermark>
export default meta
type Story = StoryObj<typeof meta>

const frame = { maxWidth: 'calc(var(--fc-size-control-base) * 20)' } as const

/**
 * Figma Example frame ("Light Mode" / "Dark Mode"): Color/Background/Container,
 * 1px Color/Border/Neutral, Radius/LG, holding a `Watermark` instance 900 tall
 * (4 rows of 225). 28 × Size/Control/Base = 896 keeps the same 4 rows.
 */
function ExamplePanel({ mode, children }: { mode?: 'dark'; children: ReactNode }) {
  return (
    <div
      data-mode={mode}
      style={{
        colorScheme: mode,
        padding: 'var(--fc-space-padding-xl)',
        background: 'var(--fc-color-background-container)',
        border: 'var(--fc-stroke-width-base) solid var(--fc-color-border-neutral)',
        borderRadius: 'var(--fc-radius-lg)',
      }}
    >
      {children}
    </div>
  )
}

const area = { minHeight: 'calc(var(--fc-size-control-base) * 28)' } as const

function ReportCard() {
  return (
    <Card title="Báo cáo doanh thu ngày 28/09/2026">
      <Paragraph>Chi nhánh: FABi Nguyễn Trãi — Ca sáng</Paragraph>
      <Paragraph>
        Tổng doanh thu: <Text strong>12.450.000 ₫</Text>
      </Paragraph>
      <Paragraph>Số hoá đơn: 186 · Giá trị trung bình: 66.935 ₫</Paragraph>
      <Paragraph>Món bán chạy: Cà phê sữa đá (142), Bánh mì chảo (96), Trà đào cam sả (88)</Paragraph>
      <Paragraph>Tài liệu nội bộ, không chia sẻ ra ngoài hệ thống.</Paragraph>
    </Card>
  )
}

/**
 * Figma "❖ Watermark" Example, Light Mode frame: the `Watermark / Watermark Item`
 * mark ("iPOS.com", Text LG/Regular, Color/Fill/Neutral-Strong, rotated 22°)
 * repeated 4 rows deep over a report preview. Follows the toolbar theme.
 */
export const Default: Story = {
  render: (args) => (
    <ExamplePanel>
      <Watermark {...args} style={area}>
        <ReportCard />
      </Watermark>
    </ExamplePanel>
  ),
}

/** Figma Example, Dark Mode frame (`2. Colors` = Dark): the same panel pinned to `data-mode="dark"`. */
export const DarkMode: Story = {
  render: (args) => (
    <ExamplePanel mode="dark">
      <Watermark {...args} style={area}>
        <ReportCard />
      </Watermark>
    </ExamplePanel>
  ),
}

/** `content` also takes an array: each entry becomes its own line inside every mark. */
export const MultiLine: Story = {
  args: { content: ['iPOS.com', 'Nội bộ'] },
  render: (args) => (
    <ExamplePanel>
      <Watermark {...args} style={area}>
        <ReportCard />
      </Watermark>
    </ExamplePanel>
  ),
}

/**
 * `image` replaces the text. Pass an inline SVG (no network); `currentColor`
 * resolves to the layer's Color/Fill/Neutral-Strong, so it follows Light / Dark.
 */
export const ImageWatermark: Story = {
  render: (args) => (
    <ExamplePanel>
      <Watermark
        {...args}
        style={area}
        image={
          <svg width="120" height="32" viewBox="0 0 120 32" fill="currentColor" aria-hidden="true" focusable="false">
            <circle cx="16" cy="16" r="12" />
            <rect x="36" y="8" width="76" height="6" rx="3" />
            <rect x="36" y="20" width="52" height="6" rx="3" />
          </svg>
        }
      >
        <ReportCard />
      </Watermark>
    </ExamplePanel>
  ),
}

/** Denser pitch and a steeper angle via `tileSize` and `rotate`, for small blocks such as a receipt preview. */
export const CustomSpacing: Story = {
  args: { tileSize: [160, 96], rotate: -30, content: 'FABi' },
  render: (args) => (
    <div style={frame}>
      <Watermark {...args}>
        <ReportCard />
      </Watermark>
    </div>
  ),
}

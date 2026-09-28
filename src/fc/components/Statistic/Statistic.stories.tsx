import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'
import { Receipt, Users01 } from '../../../icons'
import { Button } from '../Button/Button'
import { Card } from '../Card/Card'
import { Col, Row } from '../Grid/Grid'
import { Countdown, Statistic } from './Statistic'

const meta = {
  title: 'Components/Data Display/Statistic',
  component: Statistic,
  args: { title: 'Doanh thu hôm nay', value: 12450000, suffix: '₫' },
  argTypes: {
    trend: { control: 'inline-radio', options: [undefined, 'up', 'down'] },
    precision: { control: { type: 'number', min: 0, max: 4 } },
    value: { control: 'number' },
    icon: { control: false },
    prefix: { control: false },
    formatter: { control: false },
    formatOptions: { control: false },
  },
} satisfies Meta<typeof Statistic>
export default meta
type Story = StoryObj<typeof meta>

const caption = {
  marginBottom: 'var(--fc-space-margin-xxs)',
  color: 'var(--fc-color-content-description)',
  fontSize: 'var(--fc-typography-size-sm)',
  lineHeight: 'var(--fc-typography-line-height-sm)',
} as const

function Captioned({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={caption}>{label}</div>
      {children}
    </div>
  )
}

const row = { display: 'flex', flexWrap: 'wrap', gap: 'var(--fc-space-margin-xl)', alignItems: 'flex-start' } as const

/** Figma `Statistic` Type=Basic, Show Icon=False: vi-VN grouping (12.450.000). */
export const Playground: Story = {}

/** Figma `Statistic` Type=Basic, Show Icon True / False. */
export const Basic: Story = {
  render: () => (
    <div style={row}>
      <Captioned label="Show Icon=True">
        <Statistic title="Khách hôm nay" value={1128} icon={<Users01 />} />
      </Captioned>
      <Captioned label="Show Icon=False">
        <Statistic title="Số đơn trong tháng" value={112893} />
      </Captioned>
    </div>
  ),
}

/**
 * Figma `Statistic` Type Up / Down × Show Icon. Success / danger text colour,
 * an arrow, and a hidden "Tăng" / "Giảm" (up / down) — the colour is never the only cue.
 */
export const Trend: Story = {
  render: () => (
    <div style={row}>
      <Captioned label="Type=Up">
        <Statistic title="So với hôm qua" value={11.28} precision={2} suffix="%" trend="up" />
      </Captioned>
      <Captioned label="Type=Down">
        <Statistic title="Tỷ lệ huỷ đơn" value={9.3} precision={2} suffix="%" trend="down" />
      </Captioned>
      <Captioned label="Type=Up, Show Icon=False (screen readers still hear “Tăng”)">
        <Statistic title="So với hôm qua" value={11.28} precision={2} suffix="%" trend="up" icon={null} />
      </Captioned>
    </div>
  ),
}

/** Figma `Statistic / Card` Type Up / Down: the statistic inside an fc `Card`. */
export const InCard: Story = {
  render: () => (
    <Row gap="base">
      <Col span={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Đơn đang phục vụ" value={42} trend="up" suffix="đơn" />
        </Card>
      </Col>
      <Col span={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Bàn trống" value={9.3} precision={1} suffix="%" trend="down" />
        </Card>
      </Col>
    </Row>
  ),
}

/** Number formatting: precision, `formatOptions` (currency, compact), a custom `formatter`, text that is not a number. */
export const Formatting: Story = {
  render: () => (
    <div style={row}>
      <Statistic title="Giá trị trung bình / đơn" value={186500.5} precision={2} />
      <Statistic title="Doanh thu tuần" value={81300000} formatOptions={{ style: 'currency', currency: 'VND' }} />
      <Statistic title="Lượt quét QR" value={1250000} formatOptions={{ notation: 'compact' }} icon={<Receipt />} />
      <Statistic title="Tỷ lệ lấp đầy" value={0.87} formatter={(v) => `${Math.round(Number(v) * 100)} / 100`} />
      <Statistic title="Doanh thu chi nhánh mới" value="Chưa có dữ liệu" />
    </div>
  ),
}

function CountdownDemo() {
  // Fixed once per mount so re-renders don't push the deadline back.
  const [deadline] = useState(() => Date.now() + 2 * 60 * 60 * 1000 + 30 * 1000)
  return (
    <div style={row}>
      <Captioned label="Type=1 (HH:mm:ss)">
        <Countdown title="Kết thúc khuyến mãi sau" value={deadline} />
      </Captioned>
      <Captioned label="Type=2 (HH:mm:ss:SSS)">
        <Countdown title="Kết thúc khuyến mãi sau" value={deadline} format="HH:mm:ss:SSS" />
      </Captioned>
      <Captioned label="By day">
        <Countdown title="Hết hạn gói dịch vụ" value={deadline + 3 * 24 * 60 * 60 * 1000} format="D [ngày] HH [giờ] mm [phút]" />
      </Captioned>
    </div>
  )
}

/** Figma `Statistic / Countdown` Type 1 / 2 (+ a day-level format with literal words). */
export const CountdownTypes: Story = { render: () => <CountdownDemo /> }

function FinishDemo() {
  const [deadline, setDeadline] = useState(() => Date.now() + 10 * 1000)
  const [done, setDone] = useState(false)
  return (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-base)', justifyItems: 'start' }}>
      <Countdown title="Giữ bàn cho khách đặt trước" value={deadline} format="mm:ss" onFinish={() => setDone(true)} />
      <div style={{ color: 'var(--fc-color-content-description)' }}>{done ? 'onFinish đã chạy: bàn được trả lại.' : 'Đang giữ bàn…'}</div>
      <Button
        onPress={() => {
          setDone(false)
          setDeadline(Date.now() + 10 * 1000)
        }}
      >
        Giữ thêm 10 giây
      </Button>
    </div>
  )
}

/** Reaching zero: `onFinish` runs once and screen readers hear "Đã hết thời gian" (Time is up) through a polite status. */
export const CountdownFinish: Story = { render: () => <FinishDemo /> }

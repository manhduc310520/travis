import type { Meta, StoryObj } from '@storybook/react-vite'
import { PALETTE_HUES } from '../../palette'
import { Progress, type ProgressColor } from './Progress'

const COLORS: ProgressColor[] = ['default', 'success', 'warning', 'danger', ...PALETTE_HUES]

const meta = {
  title: 'Components/Feedback/Progress',
  component: Progress,
  args: {
    percent: 40,
    type: 'line',
    size: 'md',
    strokeLinecap: 'round',
    showInfo: true,
    valuePosition: 'end',
    isMeter: false,
    'aria-label': 'Đồng bộ thực đơn',
  },
  argTypes: {
    percent: { control: { type: 'range', min: 0, max: 100 } },
    type: { control: 'inline-radio', options: ['line', 'circle', 'dashboard'] },
    status: { control: 'select', options: [undefined, 'normal', 'active', 'success', 'exception'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    strokeLinecap: { control: 'inline-radio', options: ['round', 'square'] },
    strokeColor: { control: 'select', options: [undefined, ...COLORS] },
    valuePosition: { control: 'select', options: ['end', 'start', 'bottom', 'inside-start', 'inside-center', 'inside-end'] },
    steps: { control: 'number' },
    format: { control: false },
    labels: { control: false },
    label: { control: 'text' },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof Progress>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-md)' } as const
const row = { display: 'flex', flexWrap: 'wrap', gap: 'var(--fc-space-margin-lg)', alignItems: 'center' } as const

export const Playground: Story = {}

/** Figma "Progress / Standard": Size Medium / Small / Custom × Status Normal / Exception / Success, plus the running (active) state. */
export const Standard: Story = {
  render: () => (
    <div style={stack}>
      <Progress percent={40} label="Đồng bộ thực đơn" />
      <Progress percent={60} status="active" label="Đang nhập kho (active)" />
      <Progress percent={70} status="exception" label="Tải ảnh món thất bại" />
      <Progress percent={100} label="Sao lưu dữ liệu" />
      <Progress percent={40} size="sm" aria-label="Đồng bộ, cỡ nhỏ" />
      <Progress percent={40} size={20} aria-label="Đồng bộ, cỡ tùy chỉnh 20px" />
      <Progress percent={50} showInfo={false} aria-label="Đồng bộ, không hiện số" />
    </div>
  ),
}

/** Figma strokeLinecap Round / Square, on line, circle and dashboard. */
export const Linecap: Story = {
  render: () => (
    <div style={stack}>
      <Progress percent={75} aria-label="Đầu tròn" />
      <Progress percent={75} strokeLinecap="square" aria-label="Đầu vuông" />
      <div style={row}>
        <Progress type="circle" percent={75} aria-label="Vòng, đầu tròn" />
        <Progress type="circle" percent={75} strokeLinecap="square" aria-label="Vòng, đầu vuông" />
        <Progress type="dashboard" percent={75} strokeLinecap="square" aria-label="Đồng hồ, đầu vuông" />
      </div>
    </div>
  ),
}

/** Figma "Progress / Circle": Size Medium / Small / Custom × Status Normal / Success / Exception. */
export const Circle: Story = {
  render: () => (
    <div style={stack}>
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} style={row}>
          <Progress type="circle" size={size} percent={10} aria-label={`Chuẩn bị món (${size})`} />
          <Progress type="circle" size={size} percent={100} aria-label={`Đơn đã hoàn tất (${size})`} />
          <Progress type="circle" size={size} percent={50} status="exception" aria-label={`In hóa đơn lỗi (${size})`} />
        </div>
      ))}
      <div style={row}>
        <Progress type="circle" size={24} percent={10} aria-label="Chuẩn bị món (24px)" />
        <Progress type="circle" size={24} percent={100} aria-label="Đơn đã hoàn tất (24px)" />
        <Progress type="circle" size={24} percent={50} status="exception" aria-label="In hóa đơn lỗi (24px)" />
      </div>
    </div>
  ),
}

/** Figma "Progress / Dashboard": a ring open at the bottom, Size × Status. */
export const Dashboard: Story = {
  render: () => (
    <div style={stack}>
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} style={row}>
          <Progress type="dashboard" size={size} percent={50} aria-label={`Mục tiêu doanh thu (${size})`} />
          <Progress type="dashboard" size={size} percent={100} aria-label={`Mục tiêu đạt (${size})`} />
          <Progress type="dashboard" size={size} percent={50} status="exception" aria-label={`Đồng bộ lỗi (${size})`} />
        </div>
      ))}
    </div>
  ),
}

/** Figma "Progress / Steps": Size Medium / Small × Status Normal / Exceptional / Success. */
export const Steps: Story = {
  render: () => (
    <div style={stack}>
      <Progress steps={4} percent={50} aria-label="Bước thanh toán" />
      <Progress steps={4} percent={50} status="exception" aria-label="Bước thanh toán lỗi" />
      <Progress steps={4} percent={100} aria-label="Bước thanh toán xong" />
      <Progress steps={4} size="sm" percent={50} aria-label="Bước thanh toán, cỡ nhỏ" />
    </div>
  ),
}

/**
 * Figma "Progress / Gradient (Standard / Circle / Dashboard)". Figma's raw
 * #108ee9 → #87d068 maps to named colours: palette blue → palette green.
 */
export const Gradient: Story = {
  render: () => (
    <div style={stack}>
      <Progress percent={40} strokeColor={{ from: 'blue', to: 'green' }} aria-label="Doanh thu tuần" />
      <Progress percent={40} size="sm" strokeColor={{ from: 'blue', to: 'green' }} aria-label="Doanh thu tuần, cỡ nhỏ" />
      <Progress percent={40} size={20} strokeColor={{ from: 'default', to: 'success' }} aria-label="Doanh thu tuần, màu thương hiệu" />
      <div style={row}>
        <Progress type="circle" percent={90} strokeColor={{ from: 'blue', to: 'green' }} aria-label="Công suất bếp" />
        <Progress type="circle" percent={100} strokeColor={{ from: 'blue', to: 'green' }} aria-label="Công suất bếp, đạt" />
        <Progress type="dashboard" percent={50} strokeColor={{ from: 'blue', to: 'green' }} aria-label="Mục tiêu tháng" />
        <Progress type="dashboard" percent={100} strokeColor={{ from: 'blue', to: 'green' }} aria-label="Mục tiêu tháng, đạt" />
      </div>
    </div>
  ),
}

/**
 * Figma "Progress / Circular progress bar" (a thick segmented dashboard) and
 * "Circular progress bar / Custom" Count 1–10 (a segmented ring).
 */
export const CircularSegments: Story = {
  render: () => (
    <div style={stack}>
      <div style={row}>
        <Progress type="dashboard" steps={10} strokeWidth={16} percent={50} aria-label="Bàn đang phục vụ" />
        <Progress type="dashboard" steps={10} strokeWidth={16} percent={100} aria-label="Bàn đang phục vụ, đầy" />
        <Progress type="dashboard" steps={10} strokeWidth={16} percent={50} status="exception" aria-label="Bàn đang phục vụ, lỗi" />
      </div>
      <div style={row}>
        {[1, 2, 3, 4, 5, 6, 8, 10].map((count) => (
          <Progress key={count} type="circle" size={80} steps={count} strokeWidth={20} percent={50} aria-label={`Vòng ${count} đoạn`} />
        ))}
      </div>
    </div>
  ),
}

/**
 * Figma "Progress / Responsive circular progress bar": under 60px the ring
 * has no room for the number, so it moves into a tooltip. Hover or Tab onto
 * the ring to see it.
 */
export const ResponsiveCircle: Story = {
  render: () => (
    <div style={stack}>
      <Progress type="circle" size={16} percent={75} label="Đồng bộ thực đơn" />
      <Progress type="circle" size={16} percent={100} label="Đồng bộ khuyến mãi" />
      <Progress type="circle" size={16} percent={40} status="exception" label="Đồng bộ tồn kho" />
    </div>
  ),
}

/** Figma "Progress / Value Position": Outside Start / End / Bottom and Inside Start / Center / End. */
export const ValuePosition: Story = {
  render: () => (
    <div style={stack}>
      <Progress percent={40} valuePosition="start" aria-label="Giá trị trước thanh" />
      <Progress percent={40} valuePosition="end" aria-label="Giá trị sau thanh" />
      <Progress percent={40} valuePosition="bottom" aria-label="Giá trị dưới thanh" />
      <Progress percent={100} valuePosition="start" aria-label="Xong, giá trị trước thanh" />
      <Progress percent={100} valuePosition="bottom" aria-label="Xong, giá trị dưới thanh" />
      <Progress percent={40} valuePosition="inside-start" aria-label="Giá trị trong thanh, đầu" />
      <Progress percent={40} valuePosition="inside-end" aria-label="Giá trị trong thanh, cuối" />
      <Progress percent={100} valuePosition="inside-center" aria-label="Giá trị trong thanh, giữa" />
    </div>
  ),
}

/** Custom text: `format` returns what shows (and, being a string, what screen readers hear). */
export const CustomFormat: Story = {
  render: () => (
    <div style={stack}>
      <Progress percent={80} format={(p) => `${Math.round((p / 100) * 25)}/25 đơn`} label="Đơn đã giao hôm nay" />
      <Progress type="circle" percent={62} format={(p) => `${p} bàn`} aria-label="Số bàn có khách" />
    </div>
  ),
}

/** `strokeColor`: a status colour or a palette hue instead of the default fill (for categorising, e.g. per branch). */
export const Colors: Story = {
  render: () => (
    <div style={stack}>
      {COLORS.map((c) => (
        <Progress key={c} percent={60} strokeColor={c} aria-label={`Màu ${c}`} format={() => c} />
      ))}
    </div>
  ),
}

/**
 * A measurement rather than task progress (tables in use, storage): `isMeter`
 * renders React Aria `Meter` (role `meter`).
 */
export const AsMeter: Story = {
  render: () => (
    <div style={row}>
      <Progress isMeter type="dashboard" percent={68} format={() => '17/25'} label="Bàn đang có khách" />
      <Progress isMeter percent={82} strokeColor="warning" status="normal" label="Dung lượng ảnh món đã dùng" style={{ width: 240 }} />
    </div>
  ),
}

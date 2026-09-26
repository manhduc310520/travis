import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'
import type { Key } from 'react-aria-components'
import { BarChart01, LayoutGrid01, List, Receipt, ShoppingCart01, Truck01 } from '../../../icons'
import { Segmented, type SegmentedOption, type SegmentedSize } from './Segmented'

const PERIODS: SegmentedOption[] = [
  { key: 'day', label: 'Ngày' },
  { key: 'week', label: 'Tuần' },
  { key: 'month', label: 'Tháng' },
  { key: 'quarter', label: 'Quý' },
  { key: 'year', label: 'Năm' },
]

/** As in the Figma examples: icon + label, the fourth segment disabled. */
const CHANNELS: SegmentedOption[] = [
  { key: 'all', label: 'Tất cả đơn', icon: <Receipt /> },
  { key: 'dine-in', label: 'Tại bàn', icon: <List /> },
  { key: 'takeaway', label: 'Mang đi', icon: <ShoppingCart01 /> },
  { key: 'delivery', label: 'Giao hàng', icon: <Truck01 />, isDisabled: true },
  { key: 'online', label: 'Đặt online', icon: <LayoutGrid01 /> },
]

const meta = {
  title: 'Components/Segmented',
  component: Segmented,
  args: { options: PERIODS, defaultSelectedKey: 'week', 'aria-label': 'Kỳ báo cáo', size: 'md', shape: 'default', block: false, orientation: 'horizontal', isDisabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['default', 'round'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    options: { control: false },
  },
} satisfies Meta<typeof Segmented>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-lg)', justifyItems: 'start' } as const
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

const SIZES: [SegmentedSize, string][] = [['sm', 'Small'], ['md', 'Default'], ['lg', 'Large']]

export const Playground: Story = {}

/** Figma `Segmented` Size=Default, Block=False, Vertical=False, Shape=Default; items Icon? + Label?, one Disabled. */
export const Default: Story = { args: { options: CHANNELS, defaultSelectedKey: 'all', 'aria-label': 'Kênh bán' } }

/** Figma `Segmented` Size: Small, Default, Large. */
export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      {SIZES.map(([size, label]) => (
        <Captioned key={size} label={`Size=${label}`}>
          <Segmented {...args} options={CHANNELS} defaultSelectedKey="all" size={size} aria-label={`Kênh bán (${label})`} />
        </Captioned>
      ))}
    </div>
  ),
}

/** Figma `Segmented` Block=True: full width, segments share it equally. */
export const Block: Story = {
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Segmented {...args} options={CHANNELS} defaultSelectedKey="all" block aria-label="Kênh bán" />
    </div>
  ),
}

/** Figma `Segmented` Shape=Round, in the three sizes. */
export const Round: Story = {
  render: (args) => (
    <div style={stack}>
      {SIZES.map(([size, label]) => (
        <Captioned key={size} label={`Shape=Round, Size=${label}`}>
          <Segmented {...args} options={CHANNELS} defaultSelectedKey="all" shape="round" size={size} aria-label={`Kênh bán (${label})`} />
        </Captioned>
      ))}
    </div>
  ),
}

/** Figma `Segmented` Vertical=True (the Figma examples are also Block=True). Up / Down move between segments. */
export const Vertical: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--fc-space-margin-xxl)', alignItems: 'flex-start' }}>
      <Captioned label="Vertical">
        <Segmented {...args} options={CHANNELS} defaultSelectedKey="all" orientation="vertical" aria-label="Kênh bán" />
      </Captioned>
      <Captioned label="Vertical, Block (khung rộng 200)">
        <div style={{ width: 200 }}>
          <Segmented {...args} options={CHANNELS} defaultSelectedKey="all" orientation="vertical" block aria-label="Kênh bán (block)" />
        </div>
      </Captioned>
    </div>
  ),
}

/**
 * Figma item `Icon?` / `Label?`: icon + label, and icon only. An icon-only
 * segment has no visible text, so each option carries an `aria-label`.
 */
export const WithIcons: Story = {
  render: (args) => (
    <div style={stack}>
      <Captioned label="Icon + label">
        <Segmented
          {...args}
          aria-label="Kiểu hiển thị thực đơn"
          defaultSelectedKey="list"
          options={[
            { key: 'list', label: 'Danh sách', icon: <List /> },
            { key: 'grid', label: 'Lưới', icon: <LayoutGrid01 /> },
            { key: 'chart', label: 'Biểu đồ', icon: <BarChart01 /> },
          ]}
        />
      </Captioned>
      <Captioned label="Icon only">
        <Segmented
          {...args}
          aria-label="Kiểu hiển thị thực đơn"
          defaultSelectedKey="list"
          options={[
            { key: 'list', icon: <List />, 'aria-label': 'Danh sách' },
            { key: 'grid', icon: <LayoutGrid01 />, 'aria-label': 'Lưới' },
            { key: 'chart', icon: <BarChart01 />, 'aria-label': 'Biểu đồ' },
          ]}
        />
      </Captioned>
    </div>
  ),
}

/** Figma item `Disabled`: one segment (also while selected), and the whole control. */
export const Disabled: Story = {
  render: (args) => (
    <div style={stack}>
      <Captioned label="Một mục bị khoá">
        <Segmented {...args} options={PERIODS.map((o) => (o.key === 'quarter' ? { ...o, isDisabled: true } : o))} />
      </Captioned>
      <Captioned label="Mục đang chọn bị khoá">
        <Segmented {...args} defaultSelectedKey="quarter" options={PERIODS.map((o) => (o.key === 'quarter' ? { ...o, isDisabled: true } : o))} />
      </Captioned>
      <Captioned label="isDisabled">
        <Segmented {...args} isDisabled />
      </Captioned>
    </div>
  ),
}

/** Controlled: the report below follows the selected period. */
function ControlledDemo() {
  const [period, setPeriod] = useState<Key>('month')
  const label = PERIODS.find((o) => o.key === period)?.label
  return (
    <div style={stack}>
      <Segmented options={PERIODS} selectedKey={period} onSelectionChange={setPeriod} aria-label="Kỳ báo cáo doanh thu" />
      <div>Doanh thu theo {String(label).toLowerCase()}</div>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: { docs: { source: { code: '() => <ControlledDemo />' } } },
}

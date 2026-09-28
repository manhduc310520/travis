import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'
import { FaceFrown, FaceSmile } from '../../../icons'
import { TextField } from '../Input/Input'
import { Slider } from './Slider'

const meta = {
  title: 'Components/Data Entry/Slider',
  component: Slider,
  args: { label: 'Âm lượng chuông báo đơn mới', defaultValue: 30, isDisabled: false, isReversed: false, tooltip: 'auto' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    tooltip: { control: 'inline-radio', options: ['auto', 'always', 'never'] },
    marks: { control: false },
    iconStart: { control: false },
    iconEnd: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 400, paddingBlock: 'var(--fc-space-padding-xl)' }}><Story /></div>],
} satisfies Meta<typeof Slider>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-xl)' } as const
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

const VND = { style: 'currency', currency: 'VND', maximumFractionDigits: 0 } as const
const WAIT_MARKS = { 0: '0', 15: '15', 30: '30', 45: '45', 60: '60 phút' }

export const Playground: Story = {}

/**
 * Figma `Slider / Basic` Vertical=False, Reverse=False. Hover, focus (Tab) or
 * drag a thumb to see the value bubble (Figma handle State=Hover / Pressed).
 */
export const Basic: Story = {
  render: () => (
    <div style={stack}>
      <Slider label="Giảm giá cho đơn (%)" defaultValue={10} formatTooltip={(v) => `${v}%`} />
      <Slider label="Thời gian giữ bàn (phút)" defaultValue={20} step={5} minValue={0} maxValue={60} />
    </div>
  ),
}

/** Figma `Slider Track` Range=True: two thumbs; the track fills the span between them. */
export const Range: Story = {
  render: () => (
    <Slider
      label="Khoảng giá món"
      defaultValue={[50_000, 200_000]}
      minValue={0}
      maxValue={500_000}
      step={10_000}
      formatOptions={VND}
      thumbLabels={['Giá từ', 'Giá đến']}
    />
  ),
}

/**
 * Figma `Slider / Basic` Vertical=True: minimum at the bottom. A vertical slider
 * takes its parent's height; mark labels sit to the right, so leave room.
 */
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--fc-space-margin-xxl)', height: 240 }}>
      <Slider orientation="vertical" aria-label="Nhiệt độ tủ mát" defaultValue={30} />
      <Slider orientation="vertical" aria-label="Khung giờ cao điểm" defaultValue={[20, 50]} />
      <Slider orientation="vertical" aria-label="Thời gian chờ món" marks={WAIT_MARKS} minValue={0} maxValue={60} defaultValue={[15, 45]} />
    </div>
  ),
}

/**
 * Figma `Slider / Basic` Reverse=True (horizontal): the maximum is on the left.
 * Arrow keys follow the thumb on screen; screen readers still hear the real value.
 */
export const Reverse: Story = {
  render: () => (
    <div style={stack}>
      <Slider isReversed label="Mức ưu tiên in bếp" defaultValue={30} />
      <Slider isReversed label="Khung giờ khuyến mãi" defaultValue={[20, 50]} marks={{ 0: '0h', 50: '12h', 100: '24h' }} />
    </div>
  ),
}

/**
 * Figma `Slider Rail` Marks=True + `Slider Mark` Label / Active. `included` fills
 * the chosen span and highlights its marks; `included={false}` draws no track and
 * highlights only the mark at the value; `step={null}` allows only the marks;
 * `dots` puts a dot on every step.
 */
export const Marks: Story = {
  render: () => (
    <div style={stack}>
      <Captioned label="included (default)">
        <Slider label="Thời gian chờ món" marks={WAIT_MARKS} minValue={0} maxValue={60} defaultValue={30} />
      </Captioned>
      <Captioned label="included={false}">
        <Slider label="Thời gian chờ món" marks={WAIT_MARKS} minValue={0} maxValue={60} defaultValue={30} included={false} />
      </Captioned>
      <Captioned label="step={null}: only the marks can be chosen">
        <Slider
          label="Mức cay"
          marks={{ 0: 'Không cay', 1: 'Ít', 2: 'Vừa', 3: 'Cay', 4: 'Rất cay' }}
          minValue={0}
          maxValue={4}
          step={null}
          defaultValue={2}
          tooltip="never"
        />
      </Captioned>
      <Captioned label="dots, step={10}">
        <Slider label="Phần trăm đặt cọc" step={10} dots defaultValue={[20, 50]} />
      </Captioned>
    </div>
  ),
}

/** Figma handle / track State=Disabled. */
export const Disabled: Story = {
  render: () => (
    <div style={stack}>
      <Slider isDisabled label="Âm lượng (máy in đang tắt)" defaultValue={40} />
      <Slider isDisabled label="Khoảng giá" defaultValue={[20, 60]} marks={{ 0: '0', 50: '50', 100: '100' }} />
    </div>
  ),
}

/** Figma `Slider / Icon`: an icon at each end (iconStart at the minimum end). */
export const WithIcons: Story = {
  render: () => (
    <Slider
      label="Mức hài lòng của khách"
      defaultValue={70}
      iconStart={<FaceFrown size={16} aria-hidden="true" />}
      iconEnd={<FaceSmile />}
    />
  ),
}

/**
 * Figma `Slider / InputNumber`: the slider and a number field share one value.
 * (fc InputNumber is on its way; a numeric fc TextField stands in here.)
 */
function WithInputDemo() {
  const [value, setValue] = useState(5)
  const [text, setText] = useState('5')
  const commit = (raw: string) => {
    const n = Number(raw.replace(',', '.'))
    const next = Number.isFinite(n) ? Math.min(20, Math.max(0, Math.round(n))) : value
    setValue(next)
    setText(String(next))
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fc-space-margin-lg)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Slider
          aria-label="Phí phục vụ (%)"
          minValue={0}
          maxValue={20}
          value={value}
          onChange={(v) => {
            setValue(v)
            setText(String(v))
          }}
          formatTooltip={(v) => `${v}%`}
        />
      </div>
      <div style={{ flex: 'none', width: 'calc(var(--fc-size-control-lg) * 2)' }}>
        <TextField aria-label="Phí phục vụ (%)" inputMode="numeric" value={text} onChange={setText} onBlur={() => commit(text)} onKeyDown={(e) => e.key === 'Enter' && commit(text)} />
      </div>
    </div>
  )
}

export const WithInput: Story = {
  render: () => <WithInputDemo />,
  parameters: { docs: { source: { code: '() => <WithInputDemo />' } } },
}

/** Value bubble: `always` (e.g. for screenshots), `never`, and custom text. */
export const Tooltip: Story = {
  render: () => (
    <div style={{ ...stack, paddingBlockStart: 'var(--fc-space-padding-lg)' }}>
      <Slider aria-label="Luôn hiện giá trị" tooltip="always" defaultValue={[25, 75]} />
      <Slider aria-label="Không hiện giá trị" tooltip="never" defaultValue={40} />
      <Slider aria-label="Ngưỡng tồn kho" tooltip="always" defaultValue={12} maxValue={50} formatTooltip={(v) => `${v} phần`} />
    </div>
  ),
}

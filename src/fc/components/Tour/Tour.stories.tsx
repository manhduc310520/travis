import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button/Button'
import { Tour, type TourPlacement, type TourProps, type TourStep } from './Tour'

/** Inline cover illustration (no network): a simple menu-card drawing, 21:9 like the Figma sample. */
function Cover() {
  return (
    <svg width="100%" viewBox="0 0 280 120" role="img" aria-label="Minh hoạ thực đơn">
      <rect width="280" height="120" fill="var(--fc-color-background-neutral)" />
      <rect x="24" y="24" width="72" height="72" rx="8" fill="var(--fc-color-palette-blue-2)" />
      <circle cx="140" cy="60" r="28" fill="var(--fc-color-palette-red-2)" />
      <rect x="184" y="24" width="72" height="72" rx="8" fill="var(--fc-color-palette-green-2)" />
    </svg>
  )
}

type DemoProps = Partial<TourProps> & {
  withCover?: boolean
  openLabel?: string
  /** Adds a first step without a target (centred panel). */
  intro?: boolean
  /** Centres the toolbar so every placement has room around it. */
  centred?: boolean
}

/** Three toolbar buttons of a menu screen, used as tour targets. */
function Demo(props: DemoProps) {
  const { withCover = true, openLabel = 'Bắt đầu hướng dẫn', intro = false, centred = false, ...tour } = props
  // fc Button does not forward a ref, so each target is a wrapping span.
  const upload = useRef<HTMLSpanElement>(null)
  const save = useRef<HTMLSpanElement>(null)
  const more = useRef<HTMLSpanElement>(null)
  const [isOpen, setOpen] = useState(tour.defaultOpen ?? true)
  const steps: TourStep[] = [
    ...(intro
      ? [{ title: 'Chào mừng đến FABi CMS', description: 'Ba bước ngắn để cập nhật thực đơn của nhà hàng.', cover: withCover ? <Cover /> : undefined }]
      : []),
    { target: upload, title: 'Tải ảnh món', description: 'Thêm ảnh cho món Phở bò tái (65.000 ₫) để hiển thị trên thực đơn.', cover: withCover && !intro ? <Cover /> : undefined },
    { target: save, title: 'Lưu thay đổi', description: 'Lưu thực đơn trước khi đồng bộ xuống máy POS.' },
    { target: more, title: 'Thao tác khác', description: 'Nhân bản, ẩn món hoặc xem lịch sử cập nhật (28/09/2026).' },
  ]
  const align = centred ? 'center' : 'flex-start'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align,
        gap: 'var(--fc-space-margin-base)',
        padding: centred ? 'var(--fc-space-margin-xxl)' : 'var(--fc-space-padding-lg)',
      }}
    >
      <Button variant="primary" onPress={() => setOpen(true)}>{openLabel}</Button>
      <div style={{ display: 'flex', gap: 'var(--fc-space-margin-xs)' }}>
        <span ref={upload} style={{ display: 'inline-flex' }}><Button>Tải ảnh</Button></span>
        <span ref={save} style={{ display: 'inline-flex' }}><Button>Lưu</Button></span>
        <span ref={more} style={{ display: 'inline-flex' }}><Button>Thêm</Button></span>
      </div>
      <Tour {...tour} steps={tour.steps ?? steps} isOpen={isOpen} onOpenChange={setOpen} />
    </div>
  )
}

const meta = {
  title: 'Components/Data Display/Tour',
  component: Tour,
  args: { steps: [], type: 'default', mask: true, placement: 'bottom', indicator: 'slider', width: 520 },
  argTypes: {
    type: { control: 'inline-radio', options: ['default', 'primary'] },
    indicator: { control: 'inline-radio', options: ['slider', 'number'] },
    placement: { control: 'select' },
  },
  parameters: {
    layout: 'fullscreen',
    // Each story in its own frame on the Docs page: masks and open panels stay inside it.
    docs: { story: { inline: false, iframeHeight: 560 } },
  },
} satisfies Meta<typeof Tour>

export default meta
type Story = StoryObj<typeof meta>

/** Figma Tour, Type=Basic with Image: masked tour, open by default. */
export const Basic: Story = {
  render: ({ steps: _s, ...args }) => <Demo {...args} />,
}

/** Figma Tour, Type=Basic without Image (docs example "without image"). */
export const WithoutImage: Story = {
  render: ({ steps: _s, ...args }) => <Demo {...args} withCover={false} />,
}

/**
 * Step without a target: the first step is centred over the mask, without an
 * arrow (React Aria ModalOverlay); the next steps point at the toolbar.
 */
export const Centered: Story = {
  render: ({ steps: _s, ...args }) => <Demo {...args} intro />,
}

/** Figma Tour, Type=Non-modal: accent panel, no mask, page stays usable. */
export const NonModal: Story = {
  args: { type: 'primary', mask: false },
  render: ({ steps: _s, ...args }) => <Demo {...args} />,
}

/** Figma non-modal docs examples: bottom right, left bottom and top. Pick one in the control. */
export const NonModalPlacements: Story = {
  args: { type: 'primary', mask: false, placement: 'bottom right' },
  argTypes: {
    placement: { control: 'select', options: ['bottom right', 'left bottom', 'top'] satisfies TourPlacement[] },
  },
  render: ({ steps: _s, ...args }) => <Demo {...args} centred />,
}

/**
 * Figma Placement — 12 positions (Basic type). Pick one in the control. A
 * narrower panel leaves room for the side placements; without room React Aria
 * flips the panel.
 */
export const Placements: Story = {
  args: { placement: 'right', mask: false, width: 320 },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'top left', 'top right', 'bottom', 'bottom left', 'bottom right', 'left', 'left top', 'left bottom', 'right', 'right top', 'right bottom'] satisfies TourPlacement[],
    },
  },
  render: ({ steps: _s, ...args }) => <Demo {...args} withCover={false} centred />,
}

/** Figma `Tour / Tour Item / Indicator`: Number ("1/3") vs Slider (dots). */
export const Indicators: Story = {
  args: { indicator: 'number', mask: false },
  render: ({ steps: _s, ...args }) => <Demo {...args} withCover={false} />,
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Edit01, HelpCircle, Trash01 } from '../../../icons'
import { Button } from '../Button/Button'
import { PALETTE_HUES } from '../../palette'
import { Tooltip } from './Tooltip'

const meta = {
  title: 'Components/Data Display/Tooltip',
  component: Tooltip,
  args: { content: 'Sửa thông tin nhà hàng', placement: 'top', delay: 500, isDisabled: false, children: <span /> },
  argTypes: {
    placement: { control: 'select', options: ['top', 'top start', 'top end', 'bottom', 'bottom start', 'bottom end', 'left', 'left top', 'left bottom', 'right', 'right top', 'right bottom'] },
    color: { control: 'select', options: ['default', 'blue', 'cyan', 'indigo', 'purple', 'magenta', 'red', 'vermilion', 'orange', 'amber', 'yellow', 'lime', 'green'] },
    children: { control: false },
  },
  render: (args) => (
    <div style={{ padding: 'var(--fc-space-padding-xl)' }}>
      <Tooltip {...args}>
        <Button aria-label="Sửa" iconStart={<Edit01 />} />
      </Tooltip>
    </div>
  ),
} satisfies Meta<typeof Tooltip>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--fc-space-margin-lg)', padding: 'var(--fc-space-padding-xl)' }}>
      {(['top', 'bottom', 'start', 'end'] as const).map((p) => (
        <Tooltip key={p} content={`Hiện ở phía ${p}`} placement={p}>
          <Button>{p}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}

export const IconButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--fc-space-margin-xs)', padding: 'var(--fc-space-padding-xl)' }}>
      <Tooltip content="Sửa"><Button aria-label="Sửa" iconStart={<Edit01 />} /></Tooltip>
      <Tooltip content="Xóa món khỏi thực đơn"><Button aria-label="Xóa" danger iconStart={<Trash01 />} /></Tooltip>
    </div>
  ),
}

export const LongText: Story = {
  render: () => (
    <div style={{ padding: 'var(--fc-space-padding-xl)' }}>
      <Tooltip content="Giá đã gồm VAT 8%. Phí dịch vụ 5% được tính riêng khi thanh toán tại quán.">
        <Button variant="text" aria-label="Giải thích giá" iconStart={<HelpCircle />} />
      </Tooltip>
    </div>
  ),
}

/** Opened on load so the surface can be checked without hovering (screenshots, contrast audits). */
export const Open: Story = {
  render: () => (
    <div style={{ padding: 'var(--fc-space-padding-xl)' }}>
      <Tooltip content="Lưu thay đổi và gửi cho bếp" defaultOpen>
        <Button>Nút có gợi ý</Button>
      </Tooltip>
    </div>
  ),
}

const PLACEMENTS = [
  ['top start', 'top', 'top end'],
  ['left top', null, 'right top'],
  ['left', null, 'right'],
  ['left bottom', null, 'right bottom'],
  ['bottom start', 'bottom', 'bottom end'],
] as const

/** Figma Placement: all 12, held open (Top Left = "top start", Left Top = "left top", …). */
export const AllPlacements: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 120px)', gap: 'var(--fc-space-margin-xxl)', padding: 'calc(var(--fc-space-padding-xl) * 3)' }}>
      {PLACEMENTS.flat().map((p, i) =>
        p == null ? <span key={i} /> : (
          <Tooltip key={p} content={p} placement={p} defaultOpen>
            <Button block>{p}</Button>
          </Tooltip>
        ),
      )}
    </div>
  ),
}

/** Figma Arrow=false. */
export const WithoutArrow: Story = {
  render: () => (
    <div style={{ padding: 'var(--fc-space-padding-xl)' }}>
      <Tooltip content="Không có mũi tên" showArrow={false} defaultOpen>
        <Button>Nút có gợi ý</Button>
      </Tooltip>
    </div>
  ),
}

/** Figma "Tooltip / Color Preset": every palette hue (Figma Custom colours are not allowed — only palette colours). */
export const ColorPresets: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, max-content)', gap: 'calc(var(--fc-space-margin-xl) * 1.5) var(--fc-space-margin-xl)', paddingTop: 'var(--fc-space-padding-xl)' }}>
      <Tooltip content="default" defaultOpen><Button>default</Button></Tooltip>
      {PALETTE_HUES.map((h) => (
        <Tooltip key={h} content={h} color={h} defaultOpen><Button>{h}</Button></Tooltip>
      ))}
    </div>
  ),
}

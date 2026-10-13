import { useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heart } from '../../../icons'
import { Rate } from './Rate'

const meta = {
  title: 'Components/Data Entry/Rate',
  component: Rate,
  args: { defaultValue: 5, size: 'md', allowHalf: false, allowClear: true, isDisabled: false, isReadOnly: false, showText: false, 'aria-label': 'Đánh giá món ăn' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    count: { control: 'number' },
    character: { control: false },
    labels: { control: false },
    tooltips: { control: false },
  },
} satisfies Meta<typeof Rate>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-sm)' } as const
const row = { display: 'flex', alignItems: 'center', gap: 'var(--fc-space-margin-md)' } as const
const caption = { width: 'var(--fc-size-scale-xxl)', color: 'var(--fc-color-content-neutral)' } as const

/** Caption beside each example, like the labels column in the Figma docs frame. */
function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={row}>
      <span style={caption}>{label}</span>
      {children}
    </div>
  )
}

/** Figma `Rate` default variant (`Rate=5`, first in the set). Click or use the arrow keys to change the score. */
export const Default: Story = {}

/** Figma `Rate=3.5`: half steps. Each star has a left and a right hit area. */
export const HalfStar: Story = { args: { allowHalf: true, defaultValue: 3.5 } }

const HALF_STEPS = Array.from({ length: 11 }, (_, i) => i / 2)

/**
 * Figma `Rate` → `Rate` property: one variant per half step, 0 → 5 (the docs frame shows all of them).
 * Read-only so each caption keeps matching its stars.
 */
export const AllValues: Story = {
  render: () => <ValueList />,
}

function ValueList() {
  return (
    <div style={stack}>
      {HALF_STEPS.map((v) => (
        <Labeled key={v} label={v.toLocaleString('vi-VN')}>
          <Rate isReadOnly allowHalf value={v} aria-label={`Đánh giá ${v.toLocaleString('vi-VN')} sao`} />
        </Labeled>
      ))}
    </div>
  )
}

const darkFrame = {
  padding: 'var(--fc-space-padding-lg)',
  borderRadius: 'var(--fc-radius-lg)',
  background: 'var(--fc-color-background-container)',
} as const

/** Figma Example, Dark frame: the same values inside a fixed dark region (`data-mode="dark"`). */
export const DarkMode: Story = {
  render: () => (
    <div data-mode="dark" style={darkFrame}>
      <ValueList />
    </div>
  ),
}

const LABELS = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời']

function WithTextDemo() {
  const [value, setValue] = useState(3)
  return <Rate value={value} onChange={setValue} labels={LABELS} showText aria-label="Đánh giá phục vụ" />
}

/**
 * Figma `Rate` → `Text?`: a word describing the score sits after the stars. Hovering a star previews
 * its word; the words also name each star for screen readers ("4 sao, Tốt").
 */
export const WithText: Story = {
  render: () => <WithTextDemo />,
  parameters: { docs: { source: { code: '() => <WithTextDemo />' } } },
}

/** Figma `Rate / Rate Star` → `Size`: Small / Default / Large. */
export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      <Labeled label="Nhỏ">
        <Rate size="sm" defaultValue={3} aria-label="Đánh giá, cỡ nhỏ" />
      </Labeled>
      <Labeled label="Vừa">
        <Rate size="md" defaultValue={3} aria-label="Đánh giá, cỡ vừa" />
      </Labeled>
      <Labeled label="Lớn">
        <Rate size="lg" defaultValue={3} aria-label="Đánh giá, cỡ lớn" />
      </Labeled>
    </div>
  ),
}

/** Disabled: the score is shown but cannot change. Read-only keeps the normal colours without the not-allowed cursor. */
export const DisabledAndReadOnly: Story = {
  render: () => (
    <div style={stack}>
      <Labeled label="Tắt">
        <Rate isDisabled defaultValue={4} aria-label="Đánh giá (không khả dụng)" />
      </Labeled>
      <Labeled label="Chỉ xem">
        <Rate isReadOnly allowHalf value={4.5} aria-label="Điểm trung bình chi nhánh" />
      </Labeled>
    </div>
  ),
}

/**
 * Figma `Rate / Rate Star` → `Icon` (instance swap): `character` replaces the star with another
 * icon, a letter or a function of the index.
 */
export const CustomCharacter: Story = {
  render: () => (
    <div style={stack}>
      <Labeled label="Icon">
        <Rate character={<Heart size={20} />} allowHalf defaultValue={2.5} aria-label="Mức yêu thích món" />
      </Labeled>
      <Labeled label="Chữ">
        <Rate character="A" allowHalf defaultValue={2.5} aria-label="Xếp hạng vệ sinh" />
      </Labeled>
      <Labeled label="Số">
        <Rate character={(i) => i + 1} defaultValue={3} aria-label="Mức độ cay" />
      </Labeled>
    </div>
  ),
}

function AllowClearDemo() {
  const [value, setValue] = useState(4)
  return (
    <div style={stack}>
      <Labeled label="Cho phép xoá">
        <Rate value={value} onChange={setValue} showText aria-label="Đánh giá món, bấm lại để xoá" />
      </Labeled>
      <Labeled label="Không xoá">
        <Rate defaultValue={4} allowClear={false} showText aria-label="Đánh giá món, không xoá được" />
      </Labeled>
    </div>
  )
}

/**
 * `allowClear` (default on): clicking the selected star again resets the score to 0; Delete or
 * Backspace does the same from the keyboard. Turn it off when a score is required.
 * Not a Figma variant; kept from the old use cases.
 */
export const AllowClear: Story = {
  render: () => <AllowClearDemo />,
  parameters: { docs: { source: { code: '() => <AllowClearDemo />' } } },
}

/**
 * `tooltips`: one fc Tooltip per star, shown on hover and on keyboard focus. Not a Figma variant;
 * kept from the old use cases.
 */
export const Tooltips: Story = {
  args: { defaultValue: 3, tooltips: LABELS, 'aria-label': 'Đánh giá phục vụ' },
}

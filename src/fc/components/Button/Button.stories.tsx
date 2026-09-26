import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronDown, Edit01, Plus, SearchMd, Trash01, Upload01 } from '../../../icons'
import { Button, ButtonGroup, type ButtonColor, type ButtonVariant } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Lưu thay đổi', variant: 'default', size: 'md', shape: 'default', danger: false, ghost: false, isDisabled: false, isPending: false },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'default', 'dashed', 'text', 'link', 'solid', 'outlined', 'filled'] },
    color: { control: 'select', options: [undefined, 'default', 'primary', 'danger', 'magenta', 'purple', 'cyan', 'blue', 'green', 'orange'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['default', 'round', 'circle'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 'var(--fc-space-padding-sm)', alignItems: 'center', flexWrap: 'wrap' } as const
const stack = { display: 'grid', gap: 'var(--fc-space-padding-base)' } as const
const TYPES = ['primary', 'default', 'dashed', 'text', 'link'] as const
const LABEL: Record<(typeof TYPES)[number], string> = { primary: 'Primary', default: 'Default', dashed: 'Dashed', text: 'Text', link: 'Link' }

export const Playground: Story = {}

/** Figma `Button / Basic` — Type. One primary per screen. */
export const Types: Story = {
  render: () => (
    <div style={row}>
      {TYPES.map((t) => <Button key={t} variant={t}>{LABEL[t]}</Button>)}
    </div>
  ),
}

/** Figma `Shape=Round` for every Type. */
export const Round: Story = {
  render: () => (
    <div style={row}>
      {TYPES.map((t) => <Button key={t} variant={t} shape="round">{LABEL[t]}</Button>)}
    </div>
  ),
}

/** Figma `Danger=True` for every Type. */
export const Danger: Story = {
  render: () => (
    <div style={row}>
      {TYPES.map((t) => <Button key={t} variant={t} danger>{LABEL[t]}</Button>)}
    </div>
  ),
}

/**
 * Figma `Ghost=True`: transparent, for buttons placed on a dark surface. The
 * surface pins Dark mode (`data-mode="dark"`) so primary and danger text use
 * their dark-tuned steps, which reach 4.5:1 there for every brand. On the
 * spotlight grey they fell to 2.5–3.4:1.
 */
export const Ghost: Story = {
  render: () => (
    <div data-mode="dark" style={{ ...row, colorScheme: 'dark', padding: 'var(--fc-space-padding-lg)', borderRadius: 'var(--fc-radius-lg)', background: 'var(--fc-color-background-container)' }}>
      <Button ghost>Default</Button>
      <Button ghost variant="dashed">Dashed</Button>
      <Button ghost variant="primary">Primary</Button>
      <Button ghost danger>Danger</Button>
    </div>
  ),
}

/** Figma `Content=Icon Only` for every Type, plus the circle shape and sizes. */
export const IconOnly: Story = {
  render: () => (
    <div style={stack}>
      <div style={row}>
        {TYPES.map((t) => <Button key={t} variant={t} aria-label="Tìm kiếm" iconStart={<SearchMd />} />)}
      </div>
      <div style={row}>
        {TYPES.map((t) => <Button key={t} variant={t} shape="circle" aria-label="Tìm kiếm" iconStart={<SearchMd />} />)}
      </div>
      <div style={row}>
        <Button size="sm" aria-label="Thêm" iconStart={<Plus />} />
        <Button aria-label="Thêm" iconStart={<Plus />} />
        <Button size="lg" aria-label="Thêm" iconStart={<Plus />} />
        <Button size="sm" shape="circle" variant="primary" aria-label="Thêm" iconStart={<Plus />} />
        <Button shape="circle" variant="primary" aria-label="Thêm" iconStart={<Plus />} />
        <Button size="lg" shape="circle" variant="primary" aria-label="Thêm" iconStart={<Plus />} />
      </div>
    </div>
  ),
}

const FILLS: ButtonVariant[] = ['solid', 'outlined', 'dashed', 'filled', 'text', 'link']
const COLORS: { color: ButtonColor; label: string }[] = [
  { color: 'default', label: 'Default' },
  { color: 'primary', label: 'Primary' },
  { color: 'danger', label: 'Danger' },
  { color: 'magenta', label: 'Magenta' },
  { color: 'purple', label: 'Purple' },
  { color: 'cyan', label: 'Cyan' },
]

/**
 * Figma `Button / Color (optional)`: every fill × colour. Palette colours
 * (Magenta = Figma "Pink", Purple, Cyan) use the hue's accessible step with
 * text that flips white/black with the mode, so each pair reads at 4.5:1.
 */
export const ColorVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(6, max-content)', gap: 'var(--fc-space-padding-sm)', alignItems: 'center' }}>
      <span />
      {FILLS.map((f) => <strong key={f} style={{ fontWeight: 600 }}>{f}</strong>)}
      {COLORS.map(({ color, label }) => (
        <div key={color} style={{ display: 'contents' }}>
          <strong style={{ fontWeight: 600 }}>{label}</strong>
          {FILLS.map((f) => <Button key={f} variant={f} color={color} iconStart={<Plus />}>Nút</Button>)}
        </div>
      ))}
    </div>
  ),
}

/** Figma example row: solid buttons in each colour with a start icon. */
export const SolidColors: Story = {
  render: () => (
    <div style={row}>
      {(['default', 'primary', 'cyan', 'purple', 'magenta', 'danger'] as const).map((c) => (
        <Button key={c} variant="solid" color={c} iconStart={<Plus />}>Thêm mới</Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s} style={row}>
          {TYPES.map((t) => <Button key={t} variant={t} size={s}>{LABEL[t]}</Button>)}
        </div>
      ))}
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div style={row}>
      <Button variant="primary" iconStart={<Plus />}>Thêm mới</Button>
      <Button iconStart={<Upload01 />}>Tải lên</Button>
      <Button iconEnd={<ChevronDown />}>Tiện ích</Button>
      <Button variant="dashed" iconStart={<Plus />}>Thêm dòng</Button>
      <Button variant="text" iconStart={<Edit01 />}>Sửa</Button>
      <Button variant="link" iconEnd={<ChevronDown />}>Xem thêm</Button>
      <Button aria-label="Xóa" danger iconStart={<Trash01 />} />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={stack}>
      <div style={row}>
        {TYPES.map((t) => <Button key={t} variant={t} isDisabled>{LABEL[t]}</Button>)}
        <Button variant="filled" color="primary" isDisabled>Filled</Button>
        <Button variant="primary" ghost isDisabled>Ghost</Button>
      </div>
      <div style={row}>
        <Button variant="primary" isPending>Đang lưu</Button>
        <Button isPending>Đang tải</Button>
        <Button variant="primary" isPending aria-label="Đang tải" iconStart={<Plus />} />
      </div>
    </div>
  ),
}

export const Block: Story = {
  render: () => (
    <div style={{ ...stack, maxWidth: 360 }}>
      <Button variant="primary" block>Thanh toán</Button>
      <Button block>Lưu nháp</Button>
      <Button variant="dashed" block iconStart={<Plus />}>Thêm món</Button>
    </div>
  ),
}

/** Figma `Button Group Compact`: joined buttons, horizontal and vertical, primary and default. */
export const Group: Story = {
  render: () => (
    <div style={stack}>
      <div style={row}>
        <ButtonGroup aria-label="Chế độ xem">
          <Button variant="primary">Ngày</Button>
          <Button variant="primary">Tuần</Button>
          <Button variant="primary">Tháng</Button>
          <Button variant="primary">Năm</Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Chế độ xem">
          <Button>Ngày</Button>
          <Button>Tuần</Button>
          <Button>Tháng</Button>
          <Button>Năm</Button>
        </ButtonGroup>
      </div>
      <div style={{ ...row, alignItems: 'flex-start' }}>
        <ButtonGroup orientation="vertical" aria-label="Sắp xếp">
          <Button variant="primary">Mới nhất</Button>
          <Button variant="primary">Cũ nhất</Button>
          <Button variant="primary">Giá tăng</Button>
          <Button variant="primary">Giá giảm</Button>
        </ButtonGroup>
        <ButtonGroup orientation="vertical" aria-label="Sắp xếp">
          <Button>Mới nhất</Button>
          <Button>Cũ nhất</Button>
          <Button>Giá tăng</Button>
          <Button>Giá giảm</Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Thao tác">
          <Button size="sm">Sửa</Button>
          <Button size="sm">Nhân bản</Button>
          <Button size="sm" danger>Xóa</Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Thao tác">
          <Button size="lg" iconStart={<Edit01 />}>Sửa</Button>
          <Button size="lg" aria-label="Thêm lựa chọn" iconStart={<ChevronDown />} />
        </ButtonGroup>
      </div>
    </div>
  ),
}

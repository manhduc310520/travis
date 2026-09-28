import type { Meta, StoryObj } from '@storybook/react-vite'
import { Check, X } from '../../../icons'
import { Switch } from './Switch'

const meta = {
  title: 'Components/Data Entry/Switch',
  component: Switch,
  args: { children: 'Nhận đơn trực tuyến', size: 'md', isDisabled: false, defaultSelected: true },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof Switch>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-sm)' } as const

export const Playground: Story = {}

export const States: Story = {
  render: () => (
    <div style={stack}>
      <Switch>Tắt</Switch>
      <Switch defaultSelected>Bật</Switch>
      <Switch isDisabled>Không khả dụng, tắt</Switch>
      <Switch isDisabled defaultSelected>Không khả dụng, bật</Switch>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      <Switch size="sm" defaultSelected>Nhỏ</Switch>
      <Switch defaultSelected>Chuẩn</Switch>
    </div>
  ),
}

export const WithoutLabel: Story = {
  render: () => <Switch aria-label="Mở bán món này" defaultSelected />,
}

/** Figma State=Loading, on and off, both sizes. */
export const Loading: Story = {
  render: () => (
    <div style={stack}>
      <Switch isLoading defaultSelected>Đang đồng bộ, bật</Switch>
      <Switch isLoading>Đang đồng bộ, tắt</Switch>
      <Switch size="sm" isLoading defaultSelected>Nhỏ, bật</Switch>
      <Switch size="sm" isLoading>Nhỏ, tắt</Switch>
    </div>
  ),
}

/** Figma "Switch / Number and Icon": text, number and icon inside the track, on and off, with loading. */
export const WithContent: Story = {
  render: () => (
    <div style={stack}>
      <Switch checkedContent="Bật" uncheckedContent="Tắt" defaultSelected>Nhận đơn</Switch>
      <Switch checkedContent="Bật" uncheckedContent="Tắt">Nhận đơn</Switch>
      <Switch checkedContent="1" uncheckedContent="0" defaultSelected>Chế độ số</Switch>
      <Switch checkedContent="1" uncheckedContent="0">Chế độ số</Switch>
      <Switch checkedContent={<Check />} uncheckedContent={<X />} defaultSelected>Có icon</Switch>
      <Switch checkedContent={<Check />} uncheckedContent={<X />}>Có icon</Switch>
      <Switch checkedContent="Bật" uncheckedContent="Tắt" isLoading defaultSelected>Đang lưu</Switch>
      <Switch size="sm" checkedContent="1" uncheckedContent="0" defaultSelected>Nhỏ</Switch>
    </div>
  ),
}

import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { User01, Users01 } from '../../../icons'
import { Mentions, type MentionItem, type MentionOption, type MentionsProps } from './Mentions'

/** Same shape as the Figma menu: a group title, three rows with a short extra, a divider, one more row. */
const SHIFT: MentionItem[] = [
  {
    type: 'group',
    key: 'on-shift',
    label: 'Đang trong ca',
    children: [
      { value: 'thu_ngan_an', label: 'Nguyễn Văn An', extra: 'NV01' },
      { value: 'bep_truong_binh', label: 'Trần Thị Bình', extra: 'NV02' },
      { value: 'phuc_vu_cuong', label: 'Lê Minh Cường', extra: 'NV03' },
    ],
  },
  { value: 'ca_sang', label: 'Cả ca sáng', extra: '12 người' },
]

const TEAMS: MentionItem[] = [
  {
    type: 'group',
    key: 'cashier',
    label: 'Thu ngân',
    children: [
      { value: 'thu_ngan_an', label: 'Nguyễn Văn An', extra: '2 hóa đơn' },
      { value: 'thu_ngan_hoa', label: 'Võ Thị Hoa', extra: '5 hóa đơn' },
    ],
  },
  {
    type: 'group',
    key: 'waiter',
    label: 'Phục vụ',
    children: [
      { value: 'phuc_vu_cuong', label: 'Lê Minh Cường', extra: '3 bàn' },
      { value: 'phuc_vu_duy', label: 'Hoàng Đức Duy', extra: '4 bàn' },
      { value: 'phuc_vu_lan', label: 'Bùi Ngọc Lan', extra: 'Nghỉ', isDisabled: true },
    ],
  },
]

const STAFF: MentionOption[] = [
  { value: 'thu_ngan_an', label: 'Nguyễn Văn An', description: 'Thu ngân · Chi nhánh Quận 1', icon: <User01 /> },
  { value: 'bep_truong_binh', label: 'Trần Thị Bình', description: 'Bếp trưởng', icon: <User01 /> },
  { value: 'phuc_vu_cuong', label: 'Lê Minh Cường', description: 'Phục vụ', icon: <User01 /> },
  { value: 'quan_ly_dung', label: 'Phạm Thu Dung', description: 'Quản lý ca', icon: <User01 /> },
  { value: 'kho_hai', label: 'Đỗ Thanh Hải', description: 'Nghỉ phép đến 30/09/2026', icon: <User01 />, isDisabled: true },
]

const BRANCHES: MentionOption[] = [
  { value: 'quan_1', label: 'Chi nhánh Quận 1', icon: <Users01 /> },
  { value: 'thu_duc', label: 'Chi nhánh Thủ Đức', icon: <Users01 /> },
  { value: 'ha_dong', label: 'Chi nhánh Hà Đông', icon: <Users01 /> },
]

const PLACEHOLDER = 'Nhập @ để nhắc tên nhân viên'

const meta = {
  title: 'Components/Data Entry/Mentions',
  component: Mentions,
  args: { options: SHIFT, placeholder: PLACEHOLDER, 'aria-label': 'Ghi chú ca làm việc' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined', 'borderless'] },
    status: { control: 'select', options: [undefined, 'error', 'warning', 'success'] },
    placement: { control: 'inline-radio', options: ['bottom', 'top'] },
  },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof Mentions>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Figma "Mentions" Size=Default, State=Default, Placement=Default. Type "@" to
 * open the list. Light / Dark (both in the Figma docs): use the Mode toolbar.
 */
export const Default: Story = {}

/** Figma Size = Small (24) / Default (32) / Large (40), State=Default. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-md)' }}>
      <Mentions {...args} size="sm" aria-label="Ghi chú (nhỏ)" />
      <Mentions {...args} size="md" aria-label="Ghi chú (mặc định)" />
      <Mentions {...args} size="lg" aria-label="Ghi chú (lớn)" />
    </div>
  ),
}

/** Figma Size=Default, State=Focused, Placement=Bottom (docs example "open bottom"): list under the box, from the "@". */
export const OpenBottom: Story = {
  args: { defaultOpen: true, defaultValue: '@', placement: 'bottom' },
  decorators: [(Story) => <div style={{ paddingBottom: 200 }}><Story /></div>],
}

/** Figma Size=Default, State=Focused, Placement=Top (docs example "open top"): list above the box. */
export const OpenTop: Story = {
  args: { defaultOpen: true, defaultValue: '@', placement: 'top' },
  decorators: [(Story) => <div style={{ paddingTop: 200 }}><Story /></div>],
}

/** Figma Size=Large, State=Focused, Placement=Top (docs example "large open"). The list keeps 14px rows. */
export const OpenLarge: Story = {
  args: { defaultOpen: true, defaultValue: '@', size: 'lg', placement: 'top' },
  decorators: [(Story) => <div style={{ paddingTop: 200 }}><Story /></div>],
}

/** Figma Size=Small, State=Focused, Placement=Top (docs example "small open"). */
export const OpenSmall: Story = {
  args: { defaultOpen: true, defaultValue: '@', size: 'sm', placement: 'top' },
  decorators: [(Story) => <div style={{ paddingTop: 200 }}><Story /></div>],
}

/** Figma Size=Large, State=Focused, Placement=Bottom. */
export const OpenLargeBottom: Story = {
  args: { defaultOpen: true, defaultValue: '@', size: 'lg', placement: 'bottom' },
  decorators: [(Story) => <div style={{ paddingBottom: 200 }}><Story /></div>],
}

/** Figma Size=Small, State=Focused, Placement=Bottom. */
export const OpenSmallBottom: Story = {
  args: { defaultOpen: true, defaultValue: '@', size: 'sm', placement: 'bottom' },
  decorators: [(Story) => <div style={{ paddingBottom: 200 }}><Story /></div>],
}

/**
 * Figma "Dropdown Group Title" rows and the right-hand "Extra Item": options in
 * titled groups, a divider between groups, a count at the end of each row.
 * A disabled row is skipped by ↑ ↓.
 */
export const GroupsAndExtra: Story = {
  args: { options: TEAMS, defaultOpen: true, defaultValue: '@', placeholder: 'Nhập @ để giao việc' },
  decorators: [(Story) => <div style={{ paddingBottom: 280 }}><Story /></div>],
}

/** Rows with an icon, a second line and a disabled person (not in the Figma menu; for richer lists). */
export const RichOptions: Story = {
  args: { options: STAFF, defaultOpen: true, defaultValue: '@' },
  decorators: [(Story) => <div style={{ paddingBottom: 280 }}><Story /></div>],
}

/** Several lines with a field label and help text, as in a shift-handover note. */
export const WithLabel: Story = {
  args: {
    'aria-label': undefined,
    label: 'Ghi chú bàn giao ca',
    description: 'Nhắc tên người nhận để họ được thông báo.',
    rows: 3,
    defaultValue: 'Bàn 12 còn nợ 250.000 ₫, nhờ @thu_ngan_an thu giúp. ',
  },
}

/** Two prefixes: "@" for staff, "#" for branches. */
export const MultiplePrefixes: Story = {
  render: (args) => <MultiplePrefixesDemo {...args} />,
}

function MultiplePrefixesDemo(args: MentionsProps) {
  const [prefix, setPrefix] = useState('@')
  return (
    <Mentions
      {...args}
      prefix={['@', '#']}
      placeholder="Nhập @ để nhắc nhân viên, # để chọn chi nhánh"
      options={prefix === '#' ? BRANCHES : STAFF}
      onSearch={(_, p) => setPrefix(p)}
    />
  )
}

/** Controlled value, shown below the box. */
export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
}

function ControlledDemo(args: MentionsProps) {
  const [value, setValue] = useState('')
  return (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-xs)' }}>
      <Mentions {...args} value={value} onChange={setValue} />
      <span style={{ color: 'var(--fc-color-content-description)' }}>Nội dung: {value || '—'}</span>
    </div>
  )
}

/** Field statuses and variants from the shared field chrome. */
export const StatusAndVariants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-md)' }}>
      <Mentions {...args} status="error" aria-label="Lỗi" />
      <Mentions {...args} status="warning" aria-label="Cảnh báo" />
      <Mentions {...args} variant="filled" aria-label="Filled" />
      <Mentions {...args} variant="borderless" aria-label="Borderless" />
    </div>
  ),
}

/** Disabled and read-only. */
export const DisabledAndReadOnly: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-md)' }}>
      <Mentions {...args} isDisabled defaultValue="@quan_ly_dung duyệt phiếu nhập kho" aria-label="Đã khóa" />
      <Mentions {...args} isReadOnly defaultValue="@bep_truong_binh kiểm kê cuối ngày" aria-label="Chỉ đọc" />
    </div>
  ),
}

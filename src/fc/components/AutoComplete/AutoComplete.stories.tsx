import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Mail01, SearchMd, User01 } from '../../../icons'
import { Link } from '../Typography/Typography'
import { AutoComplete, type AutoCompleteOption } from './AutoComplete'

const DISHES: AutoCompleteOption[] = [
  { key: 'pho-bo', label: 'Phở bò tái' },
  { key: 'pho-ga', label: 'Phở gà' },
  { key: 'bun-bo', label: 'Bún bò Huế' },
  { key: 'bun-cha', label: 'Bún chả Hà Nội' },
  { key: 'com-tam', label: 'Cơm tấm sườn bì' },
  { key: 'ca-phe', label: 'Cà phê sữa đá' },
  { key: 'tra-dao', label: 'Trà đào cam sả', isDisabled: true },
]

/** Figma "Icon + Text" on the right: here the number of orders. */
const count = (n: number) => <><User01 aria-hidden="true" />{n}</>

const CUSTOMERS: AutoCompleteOption[] = [
  { key: 'an', label: 'Nguyễn Văn An', extra: count(10) },
  { key: 'binh', label: 'Trần Thị Bình', extra: count(11) },
  { key: 'cuong', label: 'Lê Minh Cường', extra: count(12) },
  { key: 'dung', label: 'Phạm Thu Dung', extra: count(13) },
  { key: 'hai', label: 'Đỗ Thanh Hải', extra: count(14) },
]

const PHONES: Record<string, string> = { an: '0901 234 567', binh: '0912 345 678', cuong: '0983 456 789', dung: '0934 567 890', hai: '0978 678 901' }

/** Figma menu Type=With Groups: a title row per group, with an action at its end (Figma "more"). */
const GROUPED: AutoCompleteOption[] = [
  {
    type: 'group', key: 'noodle', label: 'Món nước', extra: <Link href="#mon-nuoc">Xem thêm</Link>, children: [
      { key: 'pho-bo', label: 'Phở bò tái', extra: count(1) },
      { key: 'bun-bo', label: 'Bún bò Huế', extra: count(2) },
      { key: 'hu-tieu', label: 'Hủ tiếu Nam Vang', extra: count(3) },
    ],
  },
  {
    type: 'group', key: 'rice', label: 'Cơm', extra: <Link href="#com">Xem thêm</Link>, children: [
      { key: 'com-tam', label: 'Cơm tấm sườn bì', extra: count(4) },
      { key: 'com-ga', label: 'Cơm gà Hội An', extra: count(5) },
    ],
  },
  {
    type: 'group', key: 'drink', label: 'Đồ uống', extra: <Link href="#do-uong">Xem thêm</Link>, children: [
      { key: 'ca-phe', label: 'Cà phê sữa đá', extra: count(6) },
      { key: 'tra-dao', label: 'Trà đào cam sả', extra: count(7) },
    ],
  },
]

const meta = {
  title: 'Components/AutoComplete',
  component: AutoComplete,
  args: { label: 'Tên món', options: DISHES, placeholder: 'Nhập tên món', size: 'md', variant: 'outlined' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outlined', 'filled', 'borderless', 'underlined'] },
    status: { control: 'inline-radio', options: [undefined, 'error', 'warning'] },
    button: { control: 'inline-radio', options: ['none', 'default', 'primary'] },
    menuTrigger: { control: 'inline-radio', options: ['input', 'focus', 'manual'] },
    placement: { control: 'inline-radio', options: ['bottom', 'top'] },
    options: { control: false },
  },
  // Room for the open menu under the field in the story frame.
  decorators: [(Story) => <div style={{ width: 360, minHeight: 320 }}><Story /></div>],
} satisfies Meta<typeof AutoComplete>
export default meta
type Story = StoryObj<typeof meta>

const column = { display: 'grid', gap: 'var(--fc-space-margin-base)', width: 360 } as const

/** Type to see suggestions ("pho" finds "Phở…": accents are ignored). Any text is kept. */
export const Playground: Story = {}

/** Figma AutoComplete Active=Yes, Type=Default: menu open under the box. */
export const Open: Story = { args: { defaultOpen: true } }

/** Figma Type=Borderless (closed and open). */
export const Borderless: Story = {
  render: (args) => (
    <div style={{ ...column, gap: 'var(--fc-space-margin-xxl)' }}>
      <AutoComplete {...args} variant="borderless" label="Borderless" />
      <AutoComplete {...args} variant="borderless" label="Borderless, mở sẵn" defaultOpen />
    </div>
  ),
}

/** Field chrome shared with TextField: Outlined (Figma Default), Filled, Borderless, Underlined. */
export const Variants: Story = {
  render: (args) => (
    <div style={column}>
      {(['outlined', 'filled', 'borderless', 'underlined'] as const).map((v) => (
        <AutoComplete key={v} {...args} variant={v} label={v} defaultValue="Phở bò tái" />
      ))}
    </div>
  ),
}

/** Figma Size: Small / Default / Large. */
export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      {(['sm', 'md', 'lg'] as const).map((s) => <AutoComplete key={s} {...args} size={s} label={`Cỡ ${s}`} />)}
    </div>
  ),
}

/** Status: Error (announced as invalid) / Warning. */
export const Status: Story = {
  render: (args) => (
    <div style={column}>
      <AutoComplete {...args} status="error" isRequired errorMessage="Vui lòng nhập tên món" />
      <AutoComplete {...args} status="warning" defaultValue="Phở gà" description="Món này đã hết trong ngày" />
    </div>
  ),
}

/** Figma menu Type=With Groups: group titles with a "Xem thêm" (See more) link at the end, rows indented under them, a count on the right. */
export const WithGroups: Story = {
  args: { label: 'Tìm món', options: GROUPED, defaultOpen: true, placeholder: 'Nhập tên món' },
  decorators: [(Story) => <div style={{ minHeight: 440 }}><Story /></div>],
}

/** Figma menu Type=Empty: `emptyContent` keeps the menu open with the Empty illustration when nothing matches. */
export const EmptyMenu: Story = {
  args: { label: 'Khách hàng', options: [], emptyContent: 'Chưa có dữ liệu', defaultOpen: true, placeholder: 'Nhập tên khách' },
}

/** Figma "AutoComplete / With Button": Button Default / Button Primary, in the three sizes. Enter or the button submits. */
export const WithButton: Story = {
  render: (args) => (
    <div style={{ ...column, width: 464 }}>
      {(['sm', 'md', 'lg'] as const).flatMap((s) =>
        (['default', 'primary'] as const).map((b) => (
          <AutoComplete key={`${s}-${b}`} {...args} size={s} button={b} label={`${b} · ${s}`} placeholder="Tìm khách hàng" options={CUSTOMERS} />
        )),
      )}
    </div>
  ),
}

/** Figma With Button, Active=Yes: the menu spans box and button. */
export const WithButtonOpen: Story = {
  args: { label: 'Khách hàng', options: CUSTOMERS, button: 'primary', defaultOpen: true, placeholder: 'Tìm khách hàng' },
  decorators: [(Story) => <div style={{ width: 464 }}><Story /></div>],
}

/** Button with text instead of the icon, and a submitted value shown under the field. */
export const Submit: Story = {
  render: function Render(args) {
    const [submitted, setSubmitted] = useState('')
    return (
      <div style={column}>
        <AutoComplete {...args} label="Khách hàng" options={CUSTOMERS} button="primary" buttonText="Tìm" allowClear onSubmit={setSubmitted} />
        <span>Đã tìm: {submitted || '—'}</span>
      </div>
    )
  },
}

/** `renderOption`: custom rows — here a name with the phone number under it. */
export const CustomOption: Story = {
  args: {
    label: 'Khách hàng',
    options: CUSTOMERS,
    menuTrigger: 'focus',
    prefix: <SearchMd />,
    placeholder: 'Tên hoặc số điện thoại',
    renderOption: (item) => (
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span>{item.label}</span>
        <span style={{ color: 'var(--fc-color-content-description)', fontSize: 'var(--fc-typography-size-sm)' }}>
          {PHONES[String(item.key)]}
        </span>
      </span>
    ),
  },
}

/**
 * `filter={false}`: suggestions are computed from the text (as a server would) —
 * type a name, get e-mail suggestions. Free text stays valid.
 */
export const ComputedOptions: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('')
    const user = value.split('@')[0]
    const options: AutoCompleteOption[] = user
      ? ['fabi.vn', 'gmail.com', 'outlook.com'].map((d) => ({ key: d, label: `${user}@${d}` }))
      : []
    return (
      <div style={column}>
        <AutoComplete {...args} label="E-mail nhận hóa đơn" prefix={<Mail01 />} placeholder="ten@congty.vn" options={options} filter={false} value={value} onChange={setValue} />
        <span>Giá trị: {value || '—'}</span>
      </div>
    )
  },
}

/** Disabled field and a disabled suggestion ("Trà đào cam sả"). */
export const Disabled: Story = {
  render: (args) => (
    <div style={column}>
      <AutoComplete {...args} label="Vô hiệu" isDisabled defaultValue="Phở bò tái" />
      <AutoComplete {...args} label="Có gợi ý vô hiệu" menuTrigger="focus" />
    </div>
  ),
}

import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertCircle, CheckCircle, Clock, Loading02, XCircle } from '../../../icons'
import { PALETTE_HUES } from '../../palette'
import { CheckableTag, Tag, TagAddButton, type TagVariant } from './Tag'

const meta = {
  title: 'Components/Tag',
  component: Tag,
  args: { children: 'Món chay', color: 'default', variant: 'outlined' },
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'success', 'info', 'warning', 'danger', 'blue', 'cyan', 'indigo', 'purple', 'magenta', 'red', 'vermilion', 'orange', 'amber', 'yellow', 'lime', 'green'],
    },
    variant: { control: 'inline-radio', options: ['outlined', 'filled', 'solid'] },
  },
} satisfies Meta<typeof Tag>
export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 'var(--fc-space-margin-xs)', flexWrap: 'wrap', alignItems: 'center' } as const

export const Playground: Story = {}

export const Status: Story = {
  render: () => (
    <div style={row}>
      <Tag>Nháp</Tag>
      <Tag color="info">Đang xử lý</Tag>
      <Tag color="success" icon={<CheckCircle />}>Đã giao</Tag>
      <Tag color="warning" icon={<Clock />}>Chờ xác nhận</Tag>
      <Tag color="danger">Đã hủy</Tag>
    </div>
  ),
}

const VARIANTS: TagVariant[] = ['outlined', 'filled', 'solid']

/** Figma "Tag / Colorful": every preset × Outlined / Filled / Solid. */
export const Presets: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-sm)' }}>
      {VARIANTS.map((v) => (
        <div key={v} style={row}>{PALETTE_HUES.map((h) => <Tag key={h} color={h} variant={v}>{h}</Tag>)}</div>
      ))}
    </div>
  ),
}

/** Figma "Tag / Status": Default, Processing (info), Success, Warning, Error × Outlined / Filled / Solid, with icons. */
export const StatusVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-sm)' }}>
      {VARIANTS.map((v) => (
        <div key={v} style={row}>
          <Tag variant={v} icon={<Clock />}>Chờ xử lý</Tag>
          <Tag variant={v} color="info" icon={<Loading02 />}>Đang xử lý</Tag>
          <Tag variant={v} color="success" icon={<CheckCircle />}>Đã giao</Tag>
          <Tag variant={v} color="warning" icon={<AlertCircle />}>Giao trễ</Tag>
          <Tag variant={v} color="danger" icon={<XCircle />}>Đã hủy</Tag>
        </div>
      ))}
    </div>
  ),
}

function CheckableDemo() {
  const [picked, setPicked] = useState<string[]>(['Món chay'])
  const all = ['Món chay', 'Không cay', 'Món mới', 'Bán chạy', 'Khuyến mãi']
  return (
    <div style={row}>
      {all.map((t) => (
        <CheckableTag
          key={t}
          isSelected={picked.includes(t)}
          onChange={(on) => setPicked((p) => (on ? [...p, t] : p.filter((x) => x !== t)))}
        >
          {t}
        </CheckableTag>
      ))}
    </div>
  )
}

/** Figma "Tag / Checkable": toggles for filters. */
export const Checkable: Story = { render: () => <CheckableDemo /> }

function AddNewDemo() {
  const [tags, setTags] = useState(['Cay', 'Không hành'])
  return (
    <div style={row}>
      {tags.map((t) => (
        <Tag key={t} onClose={() => setTags((all) => all.filter((x) => x !== t))} closeLabel={`Gỡ ${t}`}>{t}</Tag>
      ))}
      <TagAddButton onPress={() => setTags((all) => [...all, `Ghi chú ${all.length + 1}`])}>Thêm ghi chú</TagAddButton>
    </div>
  )
}

/** Figma "Tag / Basic": Default, Closeable, Add New. */
export const AddNew: Story = { render: () => <AddNewDemo /> }

export const Borderless: Story = {
  render: () => (
    <div style={row}>
      <Tag bordered={false}>Nháp</Tag>
      <Tag bordered={false} color="success">Đã giao</Tag>
      <Tag bordered={false} color="purple">Khuyến mãi</Tag>
    </div>
  ),
}

function ClosableDemo() {
  const [tags, setTags] = useState(['Cay', 'Không hành', 'Ít đá', 'Mang về'])
  return (
    <div style={row}>
      {tags.map((t) => (
        <Tag key={t} onClose={() => setTags((all) => all.filter((x) => x !== t))} closeLabel={`Gỡ ${t}`}>{t}</Tag>
      ))}
    </div>
  )
}

export const Closable: Story = { render: () => <ClosableDemo /> }

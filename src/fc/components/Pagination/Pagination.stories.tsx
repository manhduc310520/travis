import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Select } from '../Select/Select'
import { Pagination } from './Pagination'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: { total: 50, pageSize: 10, defaultCurrent: 1, variant: 'default', size: 'md', showJumper: false, prevNext: 'icon', showTotal: false, isDisabled: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'simple'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    prevNext: { control: 'inline-radio', options: ['icon', 'text'] },
    showTotal: { control: 'boolean' },
    pageSizeChanger: { control: false },
    labels: { control: false },
  },
} satisfies Meta<typeof Pagination>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-lg)', justifyItems: 'start' } as const

export const Playground: Story = {}

/** Figma Variant=Basic: few enough pages that every number shows. */
export const Basic: Story = {}

/** Figma Variant=More: many pages fold into "•••" items on both sides; hover or focus one to see the jump arrow. */
export const More: Story = { args: { total: 500, defaultCurrent: 6 } }

/** Figma Variant=Jumper: "Đến trang" (Go to page) field after the items — type a number, Enter (or leave the field) jumps. */
export const Jumper: Story = { args: { total: 500, defaultCurrent: 2, showJumper: true } }

/** Figma Variant=Mini: the small size. */
export const Mini: Story = { args: { size: 'sm' } }

/** Figma Variant=Mini Jumper: small size with the jumper. */
export const MiniJumper: Story = { args: { total: 500, defaultCurrent: 2, size: 'sm', showJumper: true } }

/** Figma Variant=Simple: previous · editable page field "2 / 5" · next. */
export const Simple: Story = { args: { variant: 'simple', defaultCurrent: 2 } }

/** Figma Variant="Prev and next": words replace the arrow buttons. */
export const PrevAndNext: Story = { args: { total: 500, prevNext: 'text' } }

/** Figma item Size: Small / Default / Large, for the page items and the Simple field. */
export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Pagination key={size} {...args} size={size} total={500} defaultCurrent={6} aria-label={`Phân trang (${size})`} />
      ))}
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Pagination key={`simple-${size}`} {...args} variant="simple" size={size} defaultCurrent={2} aria-label={`Phân trang gọn (${size})`} />
      ))}
    </div>
  ),
}

/** `showTotal`: "Tổng 85 mục" (85 items in total) before the items, or your own text from a function. */
export const WithTotal: Story = {
  render: (args) => (
    <div style={stack}>
      <Pagination {...args} total={85} showTotal aria-label="Phân trang đơn hàng" />
      <Pagination
        {...args}
        total={85}
        defaultCurrent={2}
        showTotal={(total, [from, to]) => `${from}–${to} trong ${total} đơn hàng`}
        aria-label="Phân trang đơn hàng (tùy chỉnh)"
      />
    </div>
  ),
}

/** Figma item disabled: every item and field inert. */
export const Disabled: Story = {
  render: (args) => (
    <div style={stack}>
      <Pagination {...args} total={500} defaultCurrent={6} showJumper isDisabled aria-label="Phân trang (vô hiệu)" />
      <Pagination {...args} variant="simple" defaultCurrent={2} isDisabled aria-label="Phân trang gọn (vô hiệu)" />
    </div>
  ),
}

function ControlledDemo() {
  const [page, setPage] = useState(3)
  return (
    <div style={stack}>
      <Pagination total={240} current={page} onChange={setPage} showTotal showJumper aria-label="Phân trang món ăn" />
      <span>Đang xem trang {page}</span>
    </div>
  )
}

/** Controlled: `current` + `onChange` (a table would refetch here). The page-size Select goes in `pageSizeChanger`. */
export const Controlled: Story = { render: () => <ControlledDemo /> }

function PageSizeDemo() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  return (
    <Pagination
      total={85}
      current={page}
      pageSize={pageSize}
      onChange={(p) => setPage(p)}
      showTotal
      pageSizeChanger={
        <div style={{ width: 128 }}>
          <Select
            aria-label="Số mục mỗi trang"
            options={[10, 20, 50].map((n) => ({ key: n, label: `${n} / trang` }))}
            value={pageSize}
            onChange={(v) => {
              setPageSize(Number(v))
              setPage(1)
            }}
          />
        </div>
      }
    />
  )
}

/** Page-size changer: the fc Select in the `pageSizeChanger` slot; changing it goes back to page 1. */
export const PageSizeChanger: Story = { render: () => <PageSizeDemo /> }

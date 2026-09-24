import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Table, Tag } from 'antd'

type Row = { key: string; posId: string; name: string; city: string; status: 'active' | 'paused' }

/**
 * Ant Design doesn't stop a header title from wrapping just because the
 * column has a `width` — the two are unrelated. `onHeaderCell` sets a real
 * CSS `minWidth` + `nowrap` on that one cell; `onCell` gives the body the
 * same floor without forcing nowrap, so long content can still wrap.
 */
function withMinWidth<T>(column: T & { minWidth: number }) {
  const { minWidth, ...rest } = column
  return {
    ...rest,
    onHeaderCell: () => ({ style: { minWidth, whiteSpace: 'nowrap' as const } }),
    onCell: () => ({ style: { minWidth } }),
  }
}

const columns = [
  withMinWidth({ title: 'Pos ID', dataIndex: 'posId', key: 'posId', minWidth: 100 }),
  withMinWidth({ title: 'Name', dataIndex: 'name', key: 'name', minWidth: 160 }),
  withMinWidth({ title: 'City', dataIndex: 'city', key: 'city', minWidth: 140 }),
  withMinWidth({
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    minWidth: 140,
    render: (s: Row['status']) => (
      <Tag color={s === 'active' ? 'success' : 'default'}>{s === 'active' ? 'Active' : 'Paused'}</Tag>
    ),
  }),
]

const data: Row[] = [
  { key: '1', posId: 'POS-1042', name: 'John Brown', city: 'New York', status: 'active' },
  { key: '2', posId: 'POS-1043', name: 'Jim Green', city: 'London', status: 'active' },
  { key: '3', posId: 'POS-1044', name: 'Joe Black', city: 'Sydney', status: 'paused' },
]

const meta = {
  component: Table<Row>,
  title: 'Components/Table',
  tags: ['ai-generated', 'needs-work'],
  // Without `scroll.x`, a table whose columns' combined minWidth exceeds its
  // container doesn't scroll internally — it overflows the page itself
  // (verified: .ant-table-content defaults to overflow-x: visible). This is
  // the same fix RestaurantListPage.tsx already applies below `md`.
  args: { columns, dataSource: data, pagination: false, scroll: { x: 'max-content' } },
  // No JSDoc on these in antd's InternalTable.d.ts — written from the API.
  argTypes: {
    pagination: { description: 'Pagination config, or false to disable it entirely.', control: false },
    loading: { description: 'Shows a loading spinner over the table body.', control: 'boolean' },
    size: { description: 'Row height / cell padding density.', control: 'select', options: ['large', 'middle', 'small'] },
    bordered: { description: 'Adds vertical borders between columns (off by default, per the Figma spec).', control: 'boolean' },
  },
} satisfies Meta<typeof Table<Row>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('John Brown')).toBeVisible()
    await expect(canvas.getAllByRole('row')).toHaveLength(4)
  },
}

export const Empty: Story = { args: { dataSource: [] } }

export const Loading: Story = { args: { loading: true } }

export const Compact: Story = { args: { size: 'small' } }

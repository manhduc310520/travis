import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Table, Tag } from 'antd'

type Row = { key: string; posId: string; name: string; city: string; status: 'active' | 'paused' }

const columns = [
  { title: 'Pos ID', dataIndex: 'posId', key: 'posId' },
  { title: 'Tên nhà hàng', dataIndex: 'name', key: 'name' },
  { title: 'Địa điểm', dataIndex: 'city', key: 'city' },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (s: Row['status']) => (
      <Tag color={s === 'active' ? 'success' : 'default'}>{s === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}</Tag>
    ),
  },
]

const data: Row[] = [
  { key: '1', posId: 'POS-1042', name: 'Trà sữa 344', city: 'Hà Nội', status: 'active' },
  { key: '2', posId: 'POS-1043', name: 'Gà rán 365', city: 'Đà Nẵng', status: 'active' },
  { key: '3', posId: 'POS-1044', name: 'Cơm tấm Bảy', city: 'TP. Hồ Chí Minh', status: 'paused' },
]

const meta = {
  component: Table<Row>,
  tags: ['ai-generated', 'needs-work'],
  args: { columns, dataSource: data, pagination: false },
} satisfies Meta<typeof Table<Row>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Trà sữa 344')).toBeVisible()
    await expect(canvas.getAllByRole('row')).toHaveLength(4)
  },
}

export const Empty: Story = { args: { dataSource: [] } }

export const Loading: Story = { args: { loading: true } }

export const Compact: Story = { args: { size: 'small' } }

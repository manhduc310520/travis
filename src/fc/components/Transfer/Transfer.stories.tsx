import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { Key } from 'react-aria-components'
import { Button } from '../Button/Button'
import { Tag } from '../Tag/Tag'
import { Transfer, type TransferItem } from './Transfer'

interface Dish extends TransferItem {
  price: number
  category: 'Món chính' | 'Đồ uống' | 'Món phụ'
}

const DISHES: Dish[] = [
  { key: 'pho-bo', title: 'Phở bò tái', price: 65000, category: 'Món chính' },
  { key: 'bun-cha', title: 'Bún chả Hà Nội', price: 55000, category: 'Món chính' },
  { key: 'com-tam', title: 'Cơm tấm sườn bì', price: 60000, category: 'Món chính' },
  { key: 'bo-luc-lac', title: 'Bò lúc lắc', price: 120000, category: 'Món chính', isDisabled: true },
  { key: 'canh-chua', title: 'Canh chua cá lóc', price: 90000, category: 'Món chính' },
  { key: 'goi-cuon', title: 'Gỏi cuốn tôm thịt', price: 45000, category: 'Món phụ' },
  { key: 'cha-gio', title: 'Chả giò rế', price: 50000, category: 'Món phụ' },
  { key: 'banh-mi', title: 'Bánh mì thịt nướng', price: 30000, category: 'Món phụ' },
  { key: 'ca-phe', title: 'Cà phê sữa đá', price: 29000, category: 'Đồ uống' },
  { key: 'tra-dao', title: 'Trà đào cam sả', price: 39000, category: 'Đồ uống' },
  { key: 'sinh-to-bo', title: 'Sinh tố bơ', price: 45000, category: 'Đồ uống' },
  { key: 'nuoc-cam', title: 'Nước cam ép', price: 35000, category: 'Đồ uống' },
]

const TITLES: [string, string] = ['Thực đơn hệ thống', 'Bán tại chi nhánh']
const vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

const meta = {
  title: 'Components/Transfer',
  component: Transfer,
  args: {
    dataSource: DISHES,
    defaultTargetKeys: ['ca-phe', 'tra-dao'],
    defaultSelectedKeys: ['pho-bo', 'ca-phe'],
    titles: TITLES,
    showSearch: false,
    oneWay: false,
    showSelectAll: true,
    isDisabled: false,
  },
  argTypes: {
    status: { control: 'select', options: [undefined, 'warning', 'error'] },
    dataSource: { control: false },
    targetKeys: { control: false },
    defaultTargetKeys: { control: false },
    defaultSelectedKeys: { control: false },
    footer: { control: false },
    renderItem: { control: false },
    filterOption: { control: false },
    labels: { control: false },
  },
} satisfies Meta<typeof Transfer>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-lg)', justifyItems: 'start' } as const

export const Playground: Story = {}

/**
 * Figma `Transfer` Search=No. Rows show the list item states: checked
 * (State=Selected, tinted), hover (State=Hover) and "Bò lúc lắc"
 * (State=Disabled). Check rows, then move them with › / ‹; the move is
 * announced ("Đã chuyển 2 mục") and focus returns to the source list.
 */
export const Basic: Story = {}

/** Figma `Transfer` Search=Yes: a search field above each list. Matching ignores accents — "ca phe" finds "Cà phê sữa đá". */
export const WithSearch: Story = { args: { showSearch: true } }

/** Figma panel `Footer?` (Type=Left Button / Right Button): content under each list, start-aligned left and end-aligned right. */
export const WithFooter: Story = {
  args: {
    footer: (direction) => (
      <Button size="sm">{direction === 'left' ? 'Tải lại thực đơn' : 'Sắp xếp lại'}</Button>
    ),
  },
}

/** Figma panel Status=Warning / Error: the frame of both lists. Say what is wrong in text next to it. */
export const Status: Story = {
  render: (args) => (
    <div style={stack}>
      <Transfer {...args} status="warning" />
      <Transfer {...args} status="error" />
    </div>
  ),
}

/** Figma panel Disabled=Yes: lists greyed, header, search and move buttons inert. */
export const Disabled: Story = { args: { isDisabled: true, showSearch: true } }

/**
 * `oneWay`: only "Chuyển sang phải". Target rows have no checkbox but a
 * remove button, and the target header menu offers "Xóa tất cả".
 */
export const OneWay: Story = { args: { oneWay: true, defaultSelectedKeys: [] } }

/** `renderItem`: custom row content (price and category). The whole row still toggles the item. */
export const CustomRender: Story = {
  args: { listWidth: 280 },
  render: (args) => (
    <Transfer<Dish>
      {...args}
      dataSource={DISHES}
      renderItem={(item) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--fc-space-margin-xs)', minWidth: 0 }}>
          <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
          <span style={{ color: 'var(--fc-color-content-description)' }}>{vnd.format(item.price)}</span>
          <Tag color={item.category === 'Đồ uống' ? 'cyan' : item.category === 'Món phụ' ? 'orange' : 'blue'}>{item.category}</Tag>
        </span>
      )}
    />
  ),
}

/** Rows with a second line (`description`). */
export const WithDescription: Story = {
  args: {
    listWidth: 240,
    listHeight: 280,
    dataSource: DISHES.map((d) => ({ ...d, description: `${d.category} · ${vnd.format(d.price)}` })),
  },
}

/** Empty lists use fc `Empty` size `sm`; a search with no match says "Không tìm thấy kết quả". */
export const EmptyLists: Story = {
  render: (args) => (
    <div style={stack}>
      <Transfer {...args} dataSource={[]} defaultTargetKeys={[]} />
      <Transfer {...args} showSearch defaultTargetKeys={DISHES.map((d) => d.key)} defaultSelectedKeys={[]} />
    </div>
  ),
}

const MANY: TransferItem[] = Array.from({ length: 120 }, (_, i) => ({
  key: `ban-${i + 1}`,
  title: `Bàn ${String(i + 1).padStart(3, '0')} · ${['Tầng 1', 'Tầng 2', 'Sân vườn'][i % 3]}`,
  isDisabled: i % 17 === 5,
}))

/**
 * A long list (120 tables): each list scrolls inside its panel. The header
 * checkbox and menu act on the rows matching the search. Figma has no
 * pagination for Transfer, so there is none.
 */
export const LongList: Story = {
  args: { listWidth: 260, listHeight: 360, showSearch: true, titles: ['Bàn trống', 'Gộp vào hóa đơn'] },
  render: (args) => <Transfer {...args} dataSource={MANY} defaultTargetKeys={[]} defaultSelectedKeys={[]} />,
}

/** Controlled `targetKeys` + `onChange`: the parent keeps the list of dishes sold at the branch. */
export const Controlled: Story = {
  render: function Render(args) {
    const [target, setTarget] = useState<Key[]>(['pho-bo'])
    return (
      <div style={stack}>
        <Transfer {...args} targetKeys={target} onChange={(keys) => setTarget(keys)} />
        <span style={{ color: 'var(--fc-color-content-description)' }}>
          Chi nhánh bán {target.length} món: {target.map((k) => DISHES.find((d) => d.key === k)?.title).join(', ') || '—'}
        </span>
      </div>
    )
  },
}

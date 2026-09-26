import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import type { Key, SortDescriptor } from 'react-aria-components'
import { ChevronDown, DotsHorizontal, Edit01, File02, Plus, Trash01 } from '../../../icons'
import type { PaletteHue } from '../../palette'
import { Avatar } from '../Avatar/Avatar'
import { StatusBadge, type BadgeStatus } from '../Badge/Badge'
import { Button } from '../Button/Button'
import { Dropdown } from '../Dropdown/Dropdown'
import { Select } from '../Select/Select'
import { Switch } from '../Switch/Switch'
import { Tag } from '../Tag/Tag'
import { Table, type TableColumn, type TableFilterValues, type TableProps } from './Table'

// ---------- sample data: a FABi CMS menu ----------
type Category = 'Món chính' | 'Khai vị' | 'Đồ uống' | 'Tráng miệng'
type DishStatus = 'selling' | 'paused' | 'out'

interface Dish {
  key: string
  name: string
  sku: string
  category: Category
  price: number
  sold: number
  status: DishStatus
  isActive: boolean
  branch: string
  description: string
}

const dish = (key: string, name: string, sku: string, category: Category, price: number, sold: number, status: DishStatus, description: string): Dish => ({
  key, name, sku, category, price, sold, status, isActive: status !== 'paused', branch: Number(key) % 2 ? 'Chi nhánh Quận 1' : 'Chi nhánh Thủ Đức', description,
})

const DISHES: Dish[] = [
  dish('1', 'Phở bò tái lăn', 'MC-001', 'Món chính', 65000, 1240, 'selling', 'Bánh phở tươi, bò tái lăn gừng, nước dùng hầm xương 12 giờ.'),
  dish('2', 'Bún chả Hà Nội', 'MC-002', 'Món chính', 55000, 980, 'selling', 'Chả viên và chả miếng nướng than hoa, bún lá, nước chấm chua ngọt.'),
  dish('3', 'Cơm tấm sườn bì chả', 'MC-003', 'Món chính', 60000, 1105, 'selling', 'Sườn cốt lết nướng mật ong, bì, chả trứng, mỡ hành.'),
  dish('4', 'Gỏi cuốn tôm thịt', 'KV-001', 'Khai vị', 45000, 640, 'paused', 'Tôm sú, thịt ba chỉ, rau thơm, chấm tương đậu phộng.'),
  dish('5', 'Chả giò rế', 'KV-002', 'Khai vị', 50000, 512, 'selling', 'Vỏ bánh rế giòn, nhân thịt heo, nấm mèo, khoai môn.'),
  dish('6', 'Trà đào cam sả', 'DU-001', 'Đồ uống', 39000, 2210, 'selling', 'Trà đen ủ lạnh, đào ngâm, cam vàng, sả cây.'),
  dish('7', 'Cà phê sữa đá', 'DU-002', 'Đồ uống', 29000, 3150, 'out', 'Cà phê phin Robusta, sữa đặc. Tạm hết hạt rang.'),
  dish('8', 'Chè khúc bạch', 'TM-001', 'Tráng miệng', 35000, 420, 'selling', 'Khúc bạch phô mai, nhãn, hạnh nhân lát.'),
  dish('9', 'Bánh flan caramel', 'TM-002', 'Tráng miệng', 25000, 380, 'paused', 'Flan trứng gà ta, caramel đắng nhẹ, cà phê.'),
  dish('10', 'Bò lúc lắc khoai tây', 'MC-004', 'Món chính', 125000, 610, 'selling', 'Thăn bò Úc xào lửa lớn, khoai tây chiên, salad.'),
  dish('11', 'Lẩu thái hải sản', 'MC-005', 'Món chính', 299000, 205, 'selling', 'Nước lẩu chua cay, tôm, mực, nghêu, cá basa. Cho 2–3 người.'),
  dish('12', 'Nước ép dưa hấu', 'DU-003', 'Đồ uống', 35000, 890, 'selling', 'Dưa hấu tươi ép lạnh, không đường.'),
]

const CATEGORIES: Category[] = ['Món chính', 'Khai vị', 'Đồ uống', 'Tráng miệng']
const CATEGORY_HUE: Record<Category, PaletteHue> = { 'Món chính': 'orange', 'Khai vị': 'green', 'Đồ uống': 'blue', 'Tráng miệng': 'magenta' }
const STATUS: Record<DishStatus, { status: BadgeStatus; label: string }> = {
  selling: { status: 'success', label: 'Đang bán' },
  paused: { status: 'warning', label: 'Tạm ngưng' },
  out: { status: 'error', label: 'Hết món' },
}

const vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
const count = new Intl.NumberFormat('vi-VN')
const initials = (name: string) => name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
/** Case- and accent-insensitive match for the header search ("pho" finds "Phở"). */
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase()

const row = { display: 'flex', alignItems: 'center', gap: 'var(--fc-space-margin-base)' } as const
const stack = { display: 'grid', gap: 'var(--fc-space-margin-lg)' } as const
const muted = { color: 'var(--fc-color-content-description)' } as const

// ---------- columns ----------
/** Figma Table cell Type=Text with Avatar and "Text 2". */
const nameColumn: TableColumn<Dish> = {
  key: 'name',
  title: 'Tên món',
  dataIndex: 'name',
  render: (_, d) => (
    <span style={row}>
      <Avatar alt="" shape="square" size="lg" color={CATEGORY_HUE[d.category]}>{initials(d.name)}</Avatar>
      <span style={{ display: 'grid' }}>
        <span>{d.name}</span>
        <span style={muted}>{d.sku}</span>
      </span>
    </span>
  ),
}
/** Figma Table cell Type=Tag. */
const categoryColumn: TableColumn<Dish> = {
  key: 'category',
  title: 'Danh mục',
  dataIndex: 'category',
  render: (c: Category) => <Tag color={CATEGORY_HUE[c]}>{c}</Tag>,
}
const priceColumn: TableColumn<Dish> = { key: 'price', title: 'Giá bán', dataIndex: 'price', align: 'end', render: (p: number) => vnd.format(p) }
const soldColumn: TableColumn<Dish> = { key: 'sold', title: 'Đã bán', dataIndex: 'sold', align: 'end', render: (n: number) => count.format(n) }
/** Figma Table cell Type=Badge (status in words, never colour alone). */
const statusColumn: TableColumn<Dish> = {
  key: 'status',
  title: 'Trạng thái',
  dataIndex: 'status',
  render: (s: DishStatus) => <StatusBadge status={STATUS[s].status}>{STATUS[s].label}</StatusBadge>,
}
/** Figma Table cell Type=Action: link buttons. The name carries the dish so each button is unique. */
const actionColumn: TableColumn<Dish> = {
  key: 'actions',
  title: 'Thao tác',
  render: (_, d) => (
    <span style={row}>
      <Button variant="link" size="sm" aria-label={`Sửa ${d.name}`}>Sửa</Button>
      <Button variant="link" size="sm" aria-label={`Ẩn ${d.name}`}>Ẩn</Button>
    </span>
  ),
}

const COLUMNS: TableColumn<Dish>[] = [nameColumn, categoryColumn, priceColumn, soldColumn, statusColumn, actionColumn]

const DishTable = Table<Dish>

const meta = {
  title: 'Components/Table',
  component: DishTable,
  args: {
    columns: COLUMNS,
    dataSource: DISHES,
    size: 'lg',
    bordered: false,
    selectionMode: 'none',
    isLoading: false,
    pagination: { pageSize: 5 },
    'aria-label': 'Danh sách món',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['lg', 'md', 'sm'] },
    selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'] },
    columns: { control: false },
    dataSource: { control: false },
    pagination: { control: false },
    title: { control: false },
    footer: { control: false },
    expandedRowRender: { control: false },
    emptyContent: { control: false },
    labels: { control: false },
  },
} satisfies Meta<typeof DishTable>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

function PageSizeSelect({ value, onChange }: { value: number; onChange: (size: number) => void }) {
  return (
    <div style={{ width: 128 }}>
      <Select
        aria-label="Số món mỗi trang"
        options={[5, 10, 20].map((n) => ({ key: n, label: `${n} / trang` }))}
        value={value}
        onChange={(v) => onChange(Number(v))}
      />
    </div>
  )
}

function CardDemo(args: TableProps<Dish>) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const revenue = DISHES.reduce((sum, d) => sum + d.price * d.sold, 0)
  return (
    <DishTable
      {...args}
      footer={<div style={{ textAlign: 'end' }}>Tổng doanh thu: {vnd.format(revenue)}</div>}
      pagination={{
        current: page,
        pageSize,
        onChange: setPage,
        pageSizeChanger: <PageSizeSelect value={pageSize} onChange={(size) => { setPageSize(size); setPage(1) }} />,
      }}
    />
  )
}

/**
 * Figma Table Size=Default, Bordered=False (Footer? + Pagination?): the
 * FABi list page. The footer band carries the total; pagination with
 * "Hiển thị 1 - 5 trên tổng số 12" and the page-size Select sits inside the
 * frame.
 */
export const Default: Story = { render: (args) => <CardDemo {...args} /> }

/**
 * Figma Bordered=True with Title?, Footer?, Pagination?: lines between
 * columns; the title sits above the frame and pagination under it.
 */
export const Bordered: Story = {
  args: {
    bordered: true,
    title: 'Thực đơn — Chi nhánh Quận 1',
    footer: 'Giá đã gồm VAT 8%.',
    'aria-label': undefined,
  },
}

/** Figma example "Table without title, footer and pagination". */
export const Plain: Story = { args: { pagination: false, dataSource: DISHES.slice(0, 6) } }

/**
 * Figma Size: Default (`lg`, cells 16 · 16), Medium (`md`, 12 · 8), Small
 * (`sm`, 8 · 8) — without and with Bordered.
 */
export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      {(['lg', 'md', 'sm'] as const).map((size) => [false, true].map((bordered) => (
        <DishTable
          key={`${size}-${bordered}`}
          {...args}
          size={size}
          bordered={bordered}
          columns={[nameColumn, categoryColumn, priceColumn, statusColumn]}
          dataSource={DISHES.slice(0, 3)}
          pagination={false}
          aria-label={`Danh sách món, cỡ ${size}${bordered ? ', có viền' : ''}`}
        />
      )))}
    </div>
  ),
}

/**
 * Figma Header Item Sort=Yes / Table cell Sort=Yes: a compare function
 * sorts locally. Click a header or focus it and press Enter; the sorted
 * header and its cells are tinted, the active caret is accent, and the
 * header carries `aria-sort`.
 */
export const Sorting: Story = {
  args: {
    pagination: false,
    defaultSortDescriptor: { column: 'price', direction: 'descending' },
    columns: [
      { ...nameColumn, sortable: (a, b) => a.name.localeCompare(b.name, 'vi') },
      categoryColumn,
      { ...priceColumn, sortable: (a, b) => a.price - b.price },
      { ...soldColumn, sortable: (a, b) => a.sold - b.sold },
      statusColumn,
    ],
  },
}

/**
 * Figma Header Item Filter=true and "Table Dropdown" Type=Filter (opened on
 * the Danh mục column): tick options, then "Áp dụng"; "Đặt lại" clears.
 * The funnel turns accent while a filter is applied. "Danh mục" is also
 * sortable: focus lands on the header (Enter sorts), Arrow Right reaches
 * the funnel.
 */
export const Filtering: Story = {
  args: {
    columns: [
      nameColumn,
      {
        ...categoryColumn,
        sortable: (a, b) => a.category.localeCompare(b.category, 'vi'),
        filters: CATEGORIES.map((c) => ({ value: c, label: c })),
        onFilter: (value, d) => d.category === value,
        defaultFilterOpen: true,
      },
      priceColumn,
      {
        ...statusColumn,
        filters: (Object.keys(STATUS) as DishStatus[]).map((s) => ({ value: s, label: STATUS[s].label })),
        onFilter: (value, d) => d.status === value,
      },
    ],
  },
}

/**
 * Figma Header Item Search=true and "Table Dropdown" Type=Search (opened):
 * type, then Enter or "Tìm". Matching ignores case and accents ("pho"
 * finds "Phở").
 */
export const ColumnSearch: Story = {
  args: {
    columns: [
      {
        ...nameColumn,
        searchable: (query, d) => fold(`${d.name} ${d.sku}`).includes(fold(query)),
        searchPlaceholder: 'Tên món hoặc mã SKU',
        defaultSearchOpen: true,
      },
      categoryColumn,
      priceColumn,
      statusColumn,
    ],
  },
}

function CheckboxSelectionDemo(args: TableProps<Dish>) {
  const [selected, setSelected] = useState<Set<Key>>(new Set(['2', '5']))
  return (
    <div style={stack}>
      <div style={row}>
        <span>{selected.size ? `Đã chọn ${selected.size} món` : 'Chưa chọn món nào'}</span>
        <Button isDisabled={selected.size === 0} onPress={() => setSelected(new Set())}>Ngừng bán</Button>
      </div>
      <DishTable {...args} selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected} />
    </div>
  )
}

/**
 * Figma Row Control Type=Checkbox + Header Control Type=Checkbox: select
 * rows with the checkboxes, a click on the row, or Space; the header box
 * selects the page. Selected rows use Background/Item-Selected. "Cà phê
 * sữa đá" (hết món) cannot be selected but stays readable. The selection
 * survives paging.
 */
export const CheckboxSelection: Story = {
  args: { disabledKeys: ['7'], pagination: { pageSize: 5 } },
  render: (args) => <CheckboxSelectionDemo {...args} />,
}

/**
 * Figma Row Control Type=Radio: pick one row (real radio buttons). Choosing
 * another row moves the selection; it cannot be emptied.
 */
export const RadioSelection: Story = {
  args: {
    selectionMode: 'single',
    defaultSelectedKeys: ['3'],
    title: 'Chọn món khuyến mãi trong tuần',
    'aria-label': undefined,
    columns: [nameColumn, categoryColumn, priceColumn],
  },
}

/**
 * Figma Row Control Type=Expand / Collapse ("Table Item / Collapse"): the
 * + / − button, or Arrow Right / Arrow Left on a focused row, opens the
 * detail row (Fill/Alternate) under it. Rows that are "hết món" have no
 * detail. The table becomes a treegrid: rows announce expanded / collapsed.
 */
export const ExpandableRows: Story = {
  args: {
    selectionMode: 'multiple',
    defaultExpandedKeys: ['1'],
    rowExpandable: (d) => d.status !== 'out',
    expandedRowRender: (d) => (
      <div style={{ display: 'grid', gap: 'var(--fc-space-margin-xxs)' }}>
        <span>{d.description}</span>
        <span style={muted}>{d.branch} · Mã {d.sku} · Đã bán {count.format(d.sold)} phần</span>
      </div>
    ),
  },
}

/**
 * Figma Table cell Type = Text (with Avatar) / Badge / Tag / Switch / Action
 * / Dropdown / Action Button. Every control in a cell is reached with the
 * arrow keys. Rate and Progress cells wait for their fc components.
 */
export const CellTypes: Story = {
  args: {
    pagination: false,
    dataSource: DISHES.slice(0, 5),
    scrollX: 1100,
    columns: [
      nameColumn,
      statusColumn,
      categoryColumn,
      {
        key: 'isActive',
        title: 'Mở bán',
        dataIndex: 'isActive',
        render: (on: boolean, d) => <Switch defaultSelected={on} aria-label={`Mở bán ${d.name}`} />,
      },
      actionColumn,
      {
        key: 'more',
        title: 'Khác',
        render: (_, d) => (
          <Dropdown
            aria-label={`Thao tác khác với ${d.name}`}
            items={[
              { key: 'copy', label: 'Nhân bản món' },
              { key: 'branch', label: 'Áp dụng cho chi nhánh khác' },
              { type: 'divider', key: 'd' },
              { key: 'delete', label: 'Xóa món', danger: true },
            ]}
          >
            <Button variant="link" size="sm" iconEnd={<ChevronDown />} aria-label={`Thêm thao tác với ${d.name}`}>Thêm</Button>
          </Dropdown>
        ),
      },
      {
        key: 'quick',
        title: 'Nhanh',
        align: 'end',
        render: (_, d) => (
          <span style={{ ...row, gap: 'var(--fc-space-margin-xxs)', justifyContent: 'flex-end' }}>
            <Button variant="text" size="sm" iconStart={<Edit01 />} aria-label={`Sửa ${d.name}`} />
            <Button variant="text" size="sm" iconStart={<Trash01 />} aria-label={`Xóa ${d.name}`} />
            <Dropdown
              aria-label={`Thao tác khác với ${d.name}`}
              items={[{ key: 'print', label: 'In tem món' }, { key: 'history', label: 'Lịch sử giá' }]}
            >
              <Button variant="text" size="sm" iconStart={<DotsHorizontal />} aria-label={`Thêm thao tác với ${d.name}`} />
            </Dropdown>
          </span>
        ),
      },
    ],
  },
}

/**
 * No rows: the default "Không có dữ liệu", or your own content in
 * `emptyContent` (e.g. after a search, with a way forward).
 */
export const EmptyState: Story = {
  render: (args) => (
    <div style={stack}>
      <DishTable {...args} dataSource={[]} aria-label="Danh sách món (trống)" />
      <DishTable
        {...args}
        dataSource={[]}
        aria-label="Kết quả tìm món"
        emptyContent={(
          <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--fc-space-margin-sm)' }}>
            <File02 size={32} aria-hidden="true" />
            <span>Không tìm thấy món nào khớp "bánh xèo".</span>
            <Button size="sm" iconStart={<Plus />}>Thêm món mới</Button>
          </div>
        )}
      />
    </div>
  ),
}

/**
 * `isLoading`: rows fade under a spinner, the table is marked busy and
 * "Đang tải dữ liệu" is announced. With no rows yet the body keeps its
 * height.
 */
export const Loading: Story = {
  render: (args) => (
    <div style={stack}>
      <DishTable {...args} isLoading aria-label="Danh sách món (đang tải)" />
      <DishTable {...args} isLoading dataSource={[]} aria-label="Danh sách món (lần tải đầu)" />
    </div>
  ),
}

/**
 * `scrollY` + `scrollX`: the body scrolls under a sticky header (and
 * sideways when narrower than 1000px). Arrow keys keep the focused row
 * clear of the header.
 */
export const StickyHeader: Story = {
  args: { pagination: false, scrollY: 320, scrollX: 1000, bordered: true },
}

// ---------- server-side data ----------
function RemoteDemo(args: TableProps<Dish>) {
  const pageSize = 5
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortDescriptor>({ column: 'sold', direction: 'descending' })
  const [filters, setFilters] = useState<TableFilterValues>({})
  const query = JSON.stringify({ page, sort, filters })
  const [result, setResult] = useState<{ query: string; rows: Dish[]; total: number }>({ query: '', rows: [], total: 0 })

  // A pretend API: filter, sort and slice after a short delay (no network).
  useEffect(() => {
    const timer = setTimeout(() => {
      const wanted = filters.status ?? []
      const list = DISHES.filter((d) => wanted.length === 0 || wanted.includes(d.status))
      const field = sort.column === 'price' ? 'price' : 'sold'
      list.sort((a, b) => (sort.direction === 'descending' ? b[field] - a[field] : a[field] - b[field]))
      setResult({ query, rows: list.slice((page - 1) * pageSize, page * pageSize), total: list.length })
    }, 600)
    return () => clearTimeout(timer)
  }, [query, page, sort, filters])

  return (
    <DishTable
      {...args}
      dataSource={result.rows}
      isLoading={result.query !== query}
      sortDescriptor={sort}
      onSortChange={setSort}
      filterValues={filters}
      onFilterChange={setFilters}
      pagination={{ total: result.total, current: page, pageSize, onChange: setPage }}
      columns={[
        nameColumn,
        categoryColumn,
        { ...priceColumn, sortable: true },
        { ...soldColumn, sortable: true },
        {
          ...statusColumn,
          filters: (Object.keys(STATUS) as DishStatus[]).map((s) => ({ value: s, label: STATUS[s].label })),
        },
      ]}
    />
  )
}

/**
 * Server-side sorting, filtering and paging: `sortable: true`, `filters`
 * without `onFilter`, and `pagination.total` make the table report changes
 * only; the page fetches and passes the rows back (here a fake 600 ms API).
 * Changing sort or filter returns to page 1.
 */
export const RemoteData: Story = { render: (args) => <RemoteDemo {...args} /> }

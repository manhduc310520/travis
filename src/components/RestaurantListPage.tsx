import { useMemo, useState } from 'react'
import type { Key } from 'react-aria-components'
import {
  Breadcrumb,
  Button,
  Dropdown,
  Empty,
  SearchField,
  Select,
  StatusBadge,
  Table,
  type DropdownItem,
  type TableColumn,
} from '../fc'
import { ChevronDown, Columns03, Download01, Plus, Printer, SearchMd, Upload01 } from '../icons'
import { fold } from './appShellNav'
import type { RestaurantRow } from './restaurantSamples'
import styles from './RestaurantListPage.module.css'

export type { RestaurantRow } from './restaurantSamples'

const CITIES = [
  { key: 'all', label: 'Tất cả thành phố' },
  { key: 'Hà Nội', label: 'Hà Nội' },
  { key: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { key: 'Đà Nẵng', label: 'Đà Nẵng' },
]

const COLUMNS: TableColumn<RestaurantRow>[] = [
  { key: 'index', title: '#', dataIndex: 'index', width: 48, align: 'end' },
  { key: 'posId', title: 'Mã POS', dataIndex: 'posId', sortable: (a, b) => a.posId.localeCompare(b.posId) },
  { key: 'name', title: 'Tên nhà hàng', dataIndex: 'name', isRowHeader: true, sortable: (a, b) => a.name.localeCompare(b.name, 'vi') },
  { key: 'city', title: 'Thành phố', dataIndex: 'city' },
  { key: 'address', title: 'Địa chỉ', dataIndex: 'address', ellipsis: true, minWidth: 180 },
  { key: 'phone', title: 'Số điện thoại', dataIndex: 'phone' },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  { key: 'licence', title: 'Hạn giấy phép', dataIndex: 'licence', sortable: (a, b) => a.licenceIso.localeCompare(b.licenceIso) },
  {
    key: 'status',
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (status: RestaurantRow['status']) =>
      status === 'active' ? <StatusBadge status="success">Đang hoạt động</StatusBadge> : <StatusBadge status="warning">Tạm dừng</StatusBadge>,
  },
]

/** Columns the user may hide; the row header (name) always stays. */
const HIDEABLE = COLUMNS.filter((c) => !c.isRowHeader && c.key !== 'index')

const UTILITIES: DropdownItem[] = [
  { key: 'import', label: 'Nhập từ Excel', icon: <Upload01 /> },
  { key: 'export', label: 'Xuất Excel', icon: <Download01 /> },
  { key: 'print', label: 'In danh sách', icon: <Printer /> },
]

export type RestaurantListPageProps = {
  /** Rows to render. Leave empty to show the empty state. */
  rows?: RestaurantRow[]
  /** Dim the rows under a spinner while data loads. */
  loading?: boolean
}

/**
 * The restaurant list screen: the reference list page of FABi CMS, built
 * only from fc components. Breadcrumb and page actions on one row, a filter
 * row, then one container holding the table. Every other list screen reuses
 * this shape.
 *
 * One primary action per screen, "Tạo nhà hàng" (Create restaurant); everything else is default.
 * Search (accent-insensitive) and the city filter work on the sample rows.
 *
 * Responsive: the header and filter rows wrap; the table keeps every column
 * and scrolls sideways when the page is narrower than its content.
 */
export function RestaurantListPage({ rows = [], loading = false }: RestaurantListPageProps) {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState<Key>('all')
  const [visible, setVisible] = useState<Set<Key>>(() => new Set(HIDEABLE.map((c) => c.key)))

  const filtered = useMemo(() => {
    const q = fold(query.trim())
    return rows.filter(
      (r) => (city === 'all' || r.city === city) && (!q || fold(`${r.name} ${r.address} ${r.posId}`).includes(q)),
    )
  }, [rows, query, city])

  const columns = COLUMNS.filter((c) => c.isRowHeader || c.key === 'index' || visible.has(c.key))
  const hasFilters = query.trim() !== '' || city !== 'all'
  const clearFilters = () => {
    setQuery('')
    setCity('all')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Breadcrumb
          items={[
            { key: 'home', label: 'Trang chủ', href: '#' },
            { key: 'restaurants', label: 'Nhà hàng', href: '#' },
            { key: 'list', label: 'Danh sách nhà hàng' },
          ]}
        />
        <div className={styles.actions}>
          <Dropdown items={UTILITIES} placement="bottom end">
            <Button iconEnd={<ChevronDown />}>Tiện ích</Button>
          </Dropdown>
          <Button variant="primary" iconStart={<Plus />}>
            Tạo nhà hàng
          </Button>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.search}>
          <SearchField aria-label="Tìm nhà hàng" placeholder="Tìm theo tên, địa chỉ, mã POS" value={query} onChange={setQuery} />
        </div>
        <div className={styles.city}>
          <Select
            aria-label="Lọc theo thành phố"
            options={CITIES}
            value={city}
            onChange={(v) => setCity((v as Key | null) ?? 'all')}
          />
        </div>
        <Dropdown
          aria-label="Cột hiển thị"
          placement="bottom end"
          items={[
            {
              type: 'group',
              key: 'columns',
              label: 'Cột hiển thị',
              selectionMode: 'multiple',
              selectedKeys: visible,
              onSelectionChange: (keys) => setVisible(keys === 'all' ? new Set(HIDEABLE.map((c) => c.key)) : new Set(keys)),
              children: HIDEABLE.map((c) => ({ key: c.key, label: c.title })),
            },
          ]}
        >
          <Button iconStart={<Columns03 />} aria-label="Tuỳ chỉnh cột" />
        </Dropdown>
      </div>

      <Table<RestaurantRow>
        aria-label="Danh sách nhà hàng"
        className={styles.table}
        columns={columns}
        dataSource={filtered}
        isLoading={loading}
        pagination={filtered.length > 10 ? { pageSize: 10 } : false}
        emptyContent={
          <Empty
            image={<SearchMd className={styles.emptyIcon} />}
            description={
              <span className={styles.emptyText}>
                <span className={styles.emptyTitle}>Không tìm thấy dữ liệu</span>
                <span>{hasFilters ? 'Thử đổi từ khoá hoặc bộ lọc' : 'Chưa có nhà hàng nào trong danh sách'}</span>
              </span>
            }
          >
            {hasFilters && <Button onPress={clearFilters}>Xoá tìm kiếm và bộ lọc</Button>}
          </Empty>
        }
      />
    </div>
  )
}

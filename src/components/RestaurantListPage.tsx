import { Breadcrumb, Button, Grid, Input, Select, Space, Table, Empty, Typography, theme } from 'antd'
import { ChevronDown, Columns03, Plus, SearchMd } from '../icons'

type Row = {
  key: string
  index: number
  posId: string
  name: string
  location: string
  address: string
  phone: string
  email: string
  licence: string
  status: string
}

const columns = [
  { title: '#', dataIndex: 'index', key: 'index', width: 48 },
  { title: 'Pos ID', dataIndex: 'posId', key: 'posId' },
  { title: 'Tên Nhà hàng', dataIndex: 'name', key: 'name' },
  { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
  { title: 'Địa điểm', dataIndex: 'address', key: 'address' },
  { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Thời hạn bản quyền', dataIndex: 'licence', key: 'licence' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
]

export type RestaurantListPageProps = {
  /** Rows to render. Leave empty to show the empty state. */
  rows?: Row[]
  /** Show the table skeleton instead of rows. */
  loading?: boolean
}

/**
 * The restaurant list screen, rebuilt from the Figma frame `Empty Search`.
 *
 * It is the reference page for the system: breadcrumb and page actions on one
 * row, a filter row, then a single container holding the table. Every other
 * list screen in FABi CMS reuses this shape.
 *
 * Responsive: Figma only shows this at desktop width, so the breakpoints below
 * follow the three-tier split used for the rest of the system — token for
 * density, auto layout (flex-wrap here) for reflow, and a real structural
 * change only for the one piece that can't just reflow.
 *
 *   - Breadcrumb + actions, and the filter controls: `flex-wrap` — they wrap
 *     onto a second line instead of overflowing. No new component needed.
 *   - The table itself is the structural case. A 9-column table cannot become
 *     narrow; Ant Design's own `scroll.x` turns it into a horizontally
 *     scrollable region below `md`, which keeps every column and this exact
 *     look rather than inventing a separate mobile card layout the design
 *     doesn't define.
 */
export function RestaurantListPage({ rows = [], loading = false }: RestaurantListPageProps) {
  const { token } = theme.useToken()
  const screens = Grid.useBreakpoint()
  const isDesktop = screens.md ?? true

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: token.padding, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: token.paddingSM }}>
        <Breadcrumb
          items={[{ title: 'Trang chủ' }, { title: 'Nhà hàng' }, { title: 'Danh sách nhà hàng' }]}
        />
        <Space wrap>
          <Button>
            <Space size={4}>
              Tiện ích
              <ChevronDown size={12} />
            </Space>
          </Button>
          <Button type="primary" icon={<Plus />}>
            Tạo nhà hàng
          </Button>
        </Space>
      </div>

      <Space wrap>
        <Input
          prefix={<SearchMd style={{ color: token.colorTextPlaceholder }} />}
          placeholder="Tìm kiếm nhà hàng"
          style={{ width: isDesktop ? 196 : '100%', minWidth: 196 }}
          aria-label="Tìm kiếm nhà hàng"
        />
        <Select
          defaultValue="all"
          style={{ width: 180 }}
          options={[
            { value: 'all', label: 'Tất cả thành phố' },
            { value: 'hn', label: 'Hà Nội' },
            { value: 'dn', label: 'Đà Nẵng' },
            { value: 'hcm', label: 'TP. Hồ Chí Minh' },
          ]}
        />
        <Button icon={<Columns03 />} aria-label="Tuỳ chỉnh cột" />
      </Space>

      <div
        style={{
          flex: 1,
          background: token.colorBgContainer,
          border: `1px solid ${token.colorSplit}`,
          borderRadius: token.borderRadiusLG,
          overflow: 'hidden',
        }}
      >
        <Table<Row>
          columns={columns}
          dataSource={rows}
          loading={loading}
          pagination={false}
          scroll={isDesktop ? undefined : { x: 'max-content' }}
          locale={{
            emptyText: (
              <div style={{ paddingBlock: 96 }}>
                <Empty
                  image={<SearchMd size={48} style={{ color: token.colorText }} />}
                  description={
                    <Space orientation="vertical" size={4}>
                      <Typography.Text strong style={{ fontSize: 16 }}>
                        Không tìm thấy dữ liệu
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        Hãy thay đổi bộ lọc hoặc điều kiện tìm kiếm
                      </Typography.Text>
                    </Space>
                  }
                >
                  <Button type="primary">Xoá tìm kiếm và bộ lọc</Button>
                </Empty>
              </div>
            ),
          }}
        />
      </div>
    </div>
  )
}

export const sampleRows: Row[] = [
  {
    key: '1', index: 1, posId: 'POS-1042', name: 'Trà sữa 344', location: 'Hà Nội',
    address: 'Cầu Giấy', phone: '0900 000 001', email: 'ts344@ipos.vn',
    licence: '31/12/2026', status: 'Đang hoạt động',
  },
  {
    key: '2', index: 2, posId: 'POS-1043', name: 'Gà rán 365', location: 'Đà Nẵng',
    address: 'Hải Châu', phone: '0900 000 002', email: 'gr365@ipos.vn',
    licence: '30/06/2026', status: 'Đang hoạt động',
  },
  {
    key: '3', index: 3, posId: 'POS-1044', name: 'Cơm tấm Bảy', location: 'TP. Hồ Chí Minh',
    address: 'Quận 1', phone: '0900 000 003', email: 'ct7@ipos.vn',
    licence: '15/03/2026', status: 'Tạm dừng',
  },
]

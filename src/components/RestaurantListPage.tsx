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
  { title: 'Restaurant Name', dataIndex: 'name', key: 'name' },
  { title: 'City', dataIndex: 'location', key: 'location' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Phone Number', dataIndex: 'phone', key: 'phone' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'License Expiry', dataIndex: 'licence', key: 'licence' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
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
 *     narrow; the table's own `scroll.x` turns it into a horizontally
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
          items={[{ title: 'Home' }, { title: 'Restaurants' }, { title: 'Restaurant List' }]}
        />
        <Space wrap>
          <Button>
            <Space size={4}>
              Utilities
              <ChevronDown size={12} />
            </Space>
          </Button>
          <Button type="primary" icon={<Plus />}>
            Create Restaurant
          </Button>
        </Space>
      </div>

      <Space wrap>
        <Input
          prefix={<SearchMd style={{ color: token.colorTextPlaceholder }} />}
          placeholder="Search restaurants"
          style={{ width: isDesktop ? 196 : '100%', minWidth: 196 }}
          aria-label="Search restaurants"
        />
        <Select
          defaultValue="all"
          style={{ width: 180 }}
          options={[
            { value: 'all', label: 'All cities' },
            { value: 'new-york', label: 'New York' },
            { value: 'london', label: 'London' },
            { value: 'sydney', label: 'Sydney' },
          ]}
        />
        <Button icon={<Columns03 />} aria-label="Customize columns" />
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
                        No data found
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        Try changing your filters or search terms
                      </Typography.Text>
                    </Space>
                  }
                >
                  <Button type="primary">Clear search and filters</Button>
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
    key: '1', index: 1, posId: 'POS-1042', name: 'Restaurant A', location: 'New York',
    address: '123 Main St', phone: '555-0101', email: 'restaurant-a@example.com',
    licence: '2026-12-31', status: 'Active',
  },
  {
    key: '2', index: 2, posId: 'POS-1043', name: 'Restaurant B', location: 'London',
    address: '456 Oak Ave', phone: '555-0102', email: 'restaurant-b@example.com',
    licence: '2026-06-30', status: 'Active',
  },
  {
    key: '3', index: 3, posId: 'POS-1044', name: 'Restaurant C', location: 'Sydney',
    address: '789 Pine Rd', phone: '555-0103', email: 'restaurant-c@example.com',
    licence: '2026-03-15', status: 'Paused',
  },
]

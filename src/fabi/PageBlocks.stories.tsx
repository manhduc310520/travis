// FABi's own components (not converted from antd): packages/fabi-ui/src/PageHeader.tsx and FilterBar.tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Badge, Button, DatePicker, FilterBar, Input, PageHeader, Select, Tabs } from '@fabi/ui'
import type { PageHeaderProps } from '@fabi/ui'
import { Download01Line, PlusLine } from '@fabi/ui/fabi-icons'
import { fn } from 'storybook/test'

// Sample texts in the docs language (Language toolbar). The args hold no text, so the Controls table reads the
// same in both languages; text typed in the Controls replaces the sample.
const TEXT = {
  vi: {
    menu: 'Thực đơn', products: 'Sản phẩm', export: 'Xuất Excel', add: 'Thêm sản phẩm', product: 'Trà sữa Matcha (M)',
    onSale: 'Đang bán', code: 'Mã SP0001 · Nhóm Trà sữa', edit: 'Sửa', staff: 'Nhân viên', all: 'Tất cả', working: 'Đang làm',
    left: 'Đã nghỉ', search: 'Tìm tên hoặc mã', searchLabel: 'Tìm sản phẩm', group: 'Nhóm', range: 'Khoảng ngày',
    groups: ['Trà sữa', 'Cà phê', 'Bánh ngọt'],
  },
  en: {
    menu: 'Menu', products: 'Products', export: 'Export to Excel', add: 'Add product', product: 'Matcha milk tea (M)',
    onSale: 'On sale', code: 'Code SP0001 · Milk tea group', edit: 'Edit', staff: 'Staff', all: 'All', working: 'Working',
    left: 'Left', search: 'Search by name or code', searchLabel: 'Search products', group: 'Group', range: 'Date range',
    groups: ['Milk tea', 'Coffee', 'Pastries'],
  },
}
type Texts = (typeof TEXT)['vi']
const lang = (locale: unknown) => (locale === 'vi' ? 'vi' : 'en')

/** What a story shows (parameters.sample) */
const SAMPLES: Record<string, (t: Texts) => PageHeaderProps> = {
  list: (t) => ({
    title: t.products,
    breadcrumb: [{ title: t.menu }, { title: t.products }],
    extra: (
      <>
        <Button icon={<Download01Line />}>{t.export}</Button>
        <Button type="primary" icon={<PlusLine />}>{t.add}</Button>
      </>
    ),
  }),
  detail: (t) => ({
    title: t.product,
    breadcrumb: [{ title: t.menu }, { title: t.products }, { title: t.product }],
    tags: <Badge status="success" text={t.onSale} />,
    description: t.code,
    extra: <Button type="primary">{t.edit}</Button>,
  }),
  tabs: (t) => ({
    title: t.staff,
    footer: <Tabs items={[{ key: 'all', label: t.all }, { key: 'active', label: t.working }, { key: 'off', label: t.left }]} />,
  }),
}

const meta: Meta<typeof PageHeader> = {
  title: 'Components/Layout/Page Header',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: { extra: { control: false }, tags: { control: false }, footer: { control: false }, breadcrumb: { control: false } },
  render: (args, { globals, parameters }) => {
    const t = TEXT[lang(globals.locale)]
    return <PageHeader {...SAMPLES[(parameters.sample as string) ?? 'list'](t)} {...args} />
  },
}
export default meta
type Story = StoryObj<typeof PageHeader>

/** List page: one primary action at the end, the others default */
export const Default: Story = {}

/** Detail page: back, status and a description */
export const Detail: Story = { args: { onBack: fn() }, parameters: { sample: 'detail' } }

/** With Tabs under the header row */
export const WithTabs: Story = { parameters: { sample: 'tabs' } }

/** FilterBar under a PageHeader: the clear-filters button appears once a filter is set; fields take the full width on phones */
export const WithFilterBar: Story = {
  render: (args, { globals }) => {
    const t = TEXT[lang(globals.locale)]
    const [q, setQ] = useState('')
    const [group, setGroup] = useState<string>()
    return (
      <>
        <PageHeader title={t.products} breadcrumb={[{ title: t.menu }, { title: t.products }]} {...args} extra={<Button type="primary" icon={<PlusLine />}>{t.add}</Button>} />
        <FilterBar
          active={!!(q || group)}
          onReset={() => {
            setQ('')
            setGroup(undefined)
          }}
          extra={<Button icon={<Download01Line />}>{t.export}</Button>}
        >
          <Input.Search allowClear placeholder={t.search} aria-label={t.searchLabel} value={q} onChange={(e) => setQ(e.target.value)} />
          <Select allowClear placeholder={t.group} aria-label={t.group} value={group} onChange={setGroup} options={t.groups.map((g) => ({ value: g, label: g }))} />
          <DatePicker.RangePicker aria-label={t.range} format="DD/MM/YYYY" />
        </FilterBar>
      </>
    )
  },
}

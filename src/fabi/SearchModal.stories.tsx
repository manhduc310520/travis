// FABi's own component (not converted from antd): packages/fabi-ui/src/SearchModal.tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button, SearchModal, theme } from '@fabi/ui'
import type { SearchModalGroup, SearchModalItem } from '@fabi/ui'
import { SearchSmLine } from '@fabi/ui/fabi-icons'
import { expect, fn, userEvent, within } from 'storybook/test'

// Sample features in the docs language (Language toolbar); same keys in both, so the stories behave the same.
const GROUPS_VI: SearchModalGroup[] = [
  { key: 'restaurants', path: ['Nhà hàng', 'Danh sách nhà hàng'], items: [
    { key: 'restaurant-add', label: 'Thêm nhà hàng' },
    { key: 'restaurant-info', label: 'Thông tin nhà hàng' },
    { key: 'restaurant-tables', label: 'Khu vực và bàn', keywords: 'sơ đồ bàn' },
  ] },
  { key: 'products', path: ['Thực đơn', 'Sản phẩm'], items: [
    { key: 'product-list', label: 'Danh sách sản phẩm', keywords: 'món ăn, đồ uống' },
    { key: 'product-add', label: 'Thêm sản phẩm' },
    { key: 'product-groups', label: 'Nhóm sản phẩm', extra: '125 kết quả' },
  ] },
  { key: 'account', path: ['Tài khoản'], items: [
    { key: 'account-settings', label: 'Tài khoản và cài đặt' },
    { key: 'account-profile', label: 'Thông tin cá nhân' },
    { key: 'account-payment', label: 'Phương thức thanh toán' },
    { key: 'account-security', label: 'Bảo mật tài khoản' },
  ] },
]
const GROUPS_EN: SearchModalGroup[] = [
  { key: 'restaurants', path: ['Restaurants', 'Restaurant list'], items: [
    { key: 'restaurant-add', label: 'Add a restaurant' },
    { key: 'restaurant-info', label: 'Restaurant details' },
    { key: 'restaurant-tables', label: 'Areas and tables', keywords: 'floor plan' },
  ] },
  { key: 'products', path: ['Menu', 'Products'], items: [
    { key: 'product-list', label: 'Product list', keywords: 'dishes, drinks' },
    { key: 'product-add', label: 'Add a product' },
    { key: 'product-groups', label: 'Product groups', extra: '125 results' },
  ] },
  { key: 'account', path: ['Account'], items: [
    { key: 'account-settings', label: 'Account and settings' },
    { key: 'account-profile', label: 'Personal details' },
    { key: 'account-payment', label: 'Payment methods' },
    { key: 'account-security', label: 'Account security' },
  ] },
]
const HISTORY_KEYS = ['account-settings', 'account-profile', 'account-payment', 'product-list']
const history = (groups: SearchModalGroup[]): SearchModalItem[] =>
  HISTORY_KEYS.flatMap((key) => groups.flatMap((g) => g.items).filter((i) => i.key === key))
/** Search text of a story (parameters.query) in each language */
const QUERIES = { account: { vi: 'tai khoan', en: 'account' }, product: { vi: 'sản phẩm', en: 'product' }, none: { vi: '23332d', en: '23332d' } }
const lang = (locale: unknown) => (locale === 'vi' ? 'vi' : 'en')
/** The sample data for a story in the docs language */
const sample = (locale: unknown, parameters: { query?: keyof typeof QUERIES; history?: boolean }) => {
  const l = lang(locale)
  const groups = l === 'vi' ? GROUPS_VI : GROUPS_EN
  return {
    groups,
    ...(parameters.history && { history: history(groups) }),
    ...(parameters.query && { defaultValue: QUERIES[parameters.query][l] }),
  }
}

/** The panel as it sits in the dialog: surface radius 8 and the floating shadow, 650 wide */
const Surface = ({ children }: { children: ReactNode }) => {
  const { token } = theme.useToken()
  return <div style={{ maxWidth: 650, borderRadius: token.borderRadiusLG, boxShadow: token.boxShadow, overflow: 'hidden' }}>{children}</div>
}

const meta: Meta<typeof SearchModal.Panel> = {
  title: 'Components/Navigation/SearchModal',
  component: SearchModal.Panel,
  tags: ['autodocs'],
  args: { autoFocus: false, onSelect: fn() },
  argTypes: { groups: { control: false }, history: { control: false }, filter: { control: false } },
  render: (args, { globals, parameters }) => <Surface><SearchModal.Panel {...sample(globals.locale, parameters)} {...args} /></Surface>,
}
export default meta
type Story = StoryObj<typeof SearchModal.Panel>

/** Empty field, no history: the hint */
export const Default: Story = {}

/** Empty field with recent choices and a clear-history button */
export const History: Story = { args: { onClearHistory: fn() }, parameters: { history: true } }

/** Results grouped by where they live; matching ignores case and Vietnamese accents */
export const Results: Story = {
  parameters: { query: 'account' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('combobox')
    await userEvent.click(field)
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect(args.onSelect).toHaveBeenCalledWith(expect.objectContaining({ key: 'account-profile' }), expect.objectContaining({ key: 'account' }))
  },
}

/** Nothing matches */
export const NoResult: Story = { parameters: { query: 'none' } }

/** Server search in progress */
export const Loading: Story = { args: { loading: true }, parameters: { query: 'product' } }

/** In the app: the header search opens the dialog (⌘ K / Ctrl K in the Dashboard template) */
export const InModal: Story = {
  render: (args, { globals }) => {
    const data = sample(globals.locale, { history: true })
    const [open, setOpen] = useState(false)
    const [recent, setRecent] = useState(data.history ?? [])
    return (
      <>
        <Button icon={<SearchSmLine />} onClick={() => setOpen(true)}>{lang(globals.locale) === 'vi' ? 'Tìm kiếm' : 'Search'}</Button>
        <SearchModal
          groups={data.groups}
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          history={recent}
          onClearHistory={() => setRecent([])}
          onSelect={(item, group) => {
            args.onSelect?.(item, group)
            setRecent((h) => [item, ...h.filter((x) => x.key !== item.key)])
          }}
        />
      </>
    )
  },
}

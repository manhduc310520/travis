// FABi's own component (not converted from antd): packages/fabi-ui/src/SearchModal.tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button, SearchModal, theme } from '@fabi/ui'
import type { SearchModalGroup, SearchModalItem } from '@fabi/ui'
import { SearchSmLine } from '@fabi/ui/fabi-icons'
import { expect, fn, userEvent, within } from 'storybook/test'

const GROUPS: SearchModalGroup[] = [
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
const ITEMS = GROUPS.flatMap((g) => g.items)
const HISTORY: SearchModalItem[] = ['account-settings', 'account-profile', 'account-payment', 'product-list'].flatMap((key) => ITEMS.filter((i) => i.key === key))

/** The panel as it sits in the dialog: surface radius 8 and the floating shadow, 650 wide */
const Surface = ({ children }: { children: ReactNode }) => {
  const { token } = theme.useToken()
  return <div style={{ maxWidth: 650, borderRadius: token.borderRadiusLG, boxShadow: token.boxShadow, overflow: 'hidden' }}>{children}</div>
}

const meta: Meta<typeof SearchModal.Panel> = {
  title: 'Components/Navigation/Search Modal',
  component: SearchModal.Panel,
  tags: ['autodocs'],
  args: { groups: GROUPS, autoFocus: false, onSelect: fn() },
  argTypes: { groups: { control: false }, history: { control: false }, filter: { control: false } },
  render: (args) => <Surface><SearchModal.Panel {...args} /></Surface>,
}
export default meta
type Story = StoryObj<typeof SearchModal.Panel>

/** Empty field, no history: the hint */
export const Default: Story = {}

/** Empty field with recent choices ("Gần đây") and "Xoá lịch sử" */
export const History: Story = { args: { history: HISTORY, onClearHistory: fn() } }

/** Results grouped by where they live; matching ignores accents ("tai khoan" finds "Tài khoản") */
export const Results: Story = {
  args: { defaultValue: 'tai khoan' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('combobox')
    await userEvent.click(field)
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect(args.onSelect).toHaveBeenCalledWith(expect.objectContaining({ key: 'account-profile' }), expect.objectContaining({ key: 'account' }))
  },
}

/** Nothing matches */
export const NoResult: Story = { args: { defaultValue: '23332d' } }

/** Server search in progress */
export const Loading: Story = { args: { defaultValue: 'sản phẩm', loading: true } }

/** In the app: the header search opens the dialog (⌘ K / Ctrl K in the Dashboard template) */
export const InModal: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    const [history, setHistory] = useState(HISTORY)
    return (
      <>
        <Button icon={<SearchSmLine />} onClick={() => setOpen(true)}>Tìm kiếm</Button>
        <SearchModal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          history={history}
          onClearHistory={() => setHistory([])}
          onSelect={(item, group) => {
            args.onSelect?.(item, group)
            setHistory((h) => [item, ...h.filter((x) => x.key !== item.key)])
          }}
        />
      </>
    )
  },
}

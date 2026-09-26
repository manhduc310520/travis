import type { Meta, StoryObj } from '@storybook/react-vite'
import { Building02, Tag01 } from '../../../icons'
import type { TreeNode } from '../Tree/Tree'
import { TreeSelect } from './TreeSelect'

/** FABi menu categories → groups → dishes. */
const MENU: TreeNode[] = [
  {
    key: 'mon-chinh',
    title: 'Món chính',
    children: [
      { key: 'mon-nuoc', title: 'Món nước', children: [{ key: 'pho-bo', title: 'Phở bò tái' }, { key: 'bun-bo', title: 'Bún bò Huế' }, { key: 'hu-tieu', title: 'Hủ tiếu Nam Vang' }] },
      { key: 'com', title: 'Cơm', children: [{ key: 'com-tam', title: 'Cơm tấm sườn bì' }, { key: 'com-ga', title: 'Cơm gà Hội An' }] },
    ],
  },
  {
    key: 'do-uong',
    title: 'Đồ uống',
    children: [
      { key: 'cf-sua-da', title: 'Cà phê sữa đá' },
      { key: 'tra-dao', title: 'Trà đào cam sả' },
      { key: 'tra-sen', title: 'Trà sen vàng', isDisabled: true },
    ],
  },
  { key: 'trang-mieng', title: 'Tráng miệng', children: [{ key: 'che', title: 'Chè khúc bạch' }, { key: 'banh-flan', title: 'Bánh flan' }] },
]

/** Branches by city — used for the multiple (checkable) examples. */
const BRANCHES: TreeNode[] = [
  { key: 'hn', title: 'Hà Nội', children: [{ key: 'hn-hk', title: 'Hoàn Kiếm' }, { key: 'hn-cg', title: 'Cầu Giấy' }, { key: 'hn-th', title: 'Tây Hồ' }] },
  { key: 'hcm', title: 'TP. Hồ Chí Minh', children: [{ key: 'hcm-q1', title: 'Quận 1' }, { key: 'hcm-q3', title: 'Quận 3' }, { key: 'hcm-td', title: 'Thủ Đức' }] },
  { key: 'dn', title: 'Đà Nẵng', children: [{ key: 'dn-hc', title: 'Hải Châu' }] },
]

const meta = {
  title: 'Components/TreeSelect',
  component: TreeSelect,
  args: { label: 'Danh mục món', items: MENU, placeholder: 'Chọn danh mục', size: 'md', variant: 'outlined' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outlined', 'filled', 'borderless', 'underlined'] },
    status: { control: 'inline-radio', options: [undefined, 'error', 'warning'] },
    selectionMode: { control: 'inline-radio', options: ['single', 'multiple'] },
    showCheckedStrategy: { control: 'inline-radio', options: ['child', 'parent', 'all'] },
    placement: { control: 'inline-radio', options: ['bottom', 'top'] },
    items: { control: false },
  },
  // React Aria caps the menu at the space left inside <body>; the extra height
  // keeps open menus from being cut short in the story frame.
  decorators: [(Story) => <div style={{ width: 320, minHeight: 360 }}><Story /></div>],
} satisfies Meta<typeof TreeSelect>
export default meta
type Story = StoryObj<typeof meta>

const column = { display: 'grid', gap: 'var(--fc-space-margin-base)', width: 320 } as const

/** Figma TreeSelect Active=No: the closed box. */
export const Playground: Story = {}

/** Figma TreeSelect Active=Yes, Placement=Bottom Left + TreeSelect Menu Type=Basic: the selected row is tinted, its branch opened. */
export const Open: Story = { args: { defaultValue: 'bun-bo', defaultOpen: true } }

/** Figma Placement=Top Left / Top Right. */
export const OpenTop: Story = {
  args: { defaultValue: 'com-tam', defaultOpen: true, placement: 'top' },
  decorators: [(Story) => <div style={{ paddingTop: 300 }}><Story /></div>],
}

/**
 * Figma TreeSelect Menu Type=Checkable: tri-state checkboxes; the value (and
 * the tags) are the checked leaves (`showCheckedStrategy="child"`). The menu
 * stays open while checking.
 */
export const Multiple: Story = {
  args: {
    label: 'Chi nhánh áp dụng',
    items: BRANCHES,
    selectionMode: 'multiple',
    defaultValue: ['hn-hk', 'hn-cg', 'hcm-q1'],
    placeholder: 'Chọn chi nhánh',
    allowClear: true,
    defaultOpen: true,
  },
}

/** `showCheckedStrategy`: `parent` shows a fully checked city as one tag; `all` lists every checked node. `maxTagCount` collapses the rest into "+N". */
export const CheckedStrategy: Story = {
  render: (args) => (
    <div style={column}>
      <TreeSelect {...args} label="Gộp theo thành phố (parent)" items={BRANCHES} selectionMode="multiple" showCheckedStrategy="parent" defaultValue={['hn', 'hcm-q3']} />
      <TreeSelect {...args} label="Tất cả nút đã chọn (all)" items={BRANCHES} selectionMode="multiple" showCheckedStrategy="all" defaultValue={['dn']} />
      <TreeSelect {...args} label="Hiện 2 thẻ, còn lại +N" items={BRANCHES} selectionMode="multiple" maxTagCount={2} defaultValue={['hn-hk', 'hn-cg', 'hn-th', 'hcm-q1']} />
    </div>
  ),
}

/** Multiple in the three sizes (tag height 16 / 24 / 32, as Select). */
export const MultipleSizes: Story = {
  render: (args) => (
    <div style={column}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <TreeSelect key={s} {...args} size={s} label={`Cỡ ${s}`} items={BRANCHES} selectionMode="multiple" defaultValue={['hn-hk', 'hcm-q1']} />
      ))}
    </div>
  ),
}

/** Search box at the top of the menu: filters the tree (accent-insensitive) and highlights the match; ↓ moves into the tree. */
export const Search: Story = { args: { showSearch: true, allowClear: true, defaultOpen: true, searchPlaceholder: 'Tìm món' } }

/** Figma Select Input: Outlined / Filled / Borderless / Underlined. */
export const Variants: Story = {
  render: (args) => (
    <div style={column}>
      {(['outlined', 'filled', 'borderless', 'underlined'] as const).map((v) => (
        <TreeSelect key={v} {...args} variant={v} label={v} defaultValue="pho-bo" />
      ))}
    </div>
  ),
}

/** Figma Status: Error / Warning (error is announced as invalid). */
export const Status: Story = {
  render: (args) => (
    <div style={column}>
      <TreeSelect {...args} status="error" errorMessage="Vui lòng chọn danh mục" isRequired />
      <TreeSelect {...args} status="warning" defaultValue="tra-dao" description="Món này sắp hết nguyên liệu" />
      <TreeSelect {...args} variant="filled" status="error" label="Filled lỗi" />
    </div>
  ),
}

/** Figma Size: Small / Default / Large (Active=No). */
export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      {(['sm', 'md', 'lg'] as const).map((s) => <TreeSelect key={s} {...args} size={s} label={`Cỡ ${s}`} defaultValue="cf-sua-da" />)}
    </div>
  ),
}

/** Prefix inside the box; guide lines in the menu (Tree Line=True). */
export const WithPrefixAndLines: Story = {
  render: (args) => (
    <div style={column}>
      <TreeSelect {...args} label="Chi nhánh" items={BRANCHES} prefix={<Building02 />} defaultValue="hn-cg" showLine />
      <TreeSelect {...args} label="Nhóm món" prefix={<Tag01 />} selectionMode="multiple" defaultValue={['che']} />
    </div>
  ),
}

/** Clear button (×) while hovered or focused; disabled box; a disabled node ("Trà sen vàng"). */
export const ClearAndDisabled: Story = {
  render: (args) => (
    <div style={column}>
      <TreeSelect {...args} label="Có nút xóa" allowClear defaultValue="banh-flan" />
      <TreeSelect {...args} label="Vô hiệu" isDisabled defaultValue="pho-bo" />
      <TreeSelect {...args} label="Vô hiệu (nhiều)" isDisabled items={BRANCHES} selectionMode="multiple" defaultValue={['hn']} />
    </div>
  ),
}

/** Figma menu "Empty": fc Empty (size sm). */
export const EmptyMenu: Story = { args: { label: 'Danh mục', items: [], defaultOpen: true, placeholder: 'Chưa có danh mục' } }

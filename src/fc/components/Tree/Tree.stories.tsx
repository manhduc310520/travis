import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Key } from 'react-aria-components'
import { BookOpen01, Building02, Coins01, File06, Folder, Package, Receipt, Settings01 } from '../../../icons'
import { Button } from '../Button/Button'
import { SearchField } from '../Input/SearchField'
import { Tree, type TreeNode } from './Tree'
import { getExpandableKeys } from './treeData'

/** FABi CMS menu: categories → groups → dishes. */
const MENU: TreeNode[] = [
  {
    key: 'mon-chinh',
    title: 'Món chính',
    children: [
      { key: 'mon-nuoc', title: 'Món nước', children: [{ key: 'pho-bo', title: 'Phở bò tái' }, { key: 'bun-bo', title: 'Bún bò Huế' }, { key: 'hu-tieu', title: 'Hủ tiếu Nam Vang' }] },
      { key: 'com', title: 'Cơm', children: [{ key: 'com-tam', title: 'Cơm tấm sườn bì' }, { key: 'com-ga', title: 'Cơm gà Hội An' }] },
      { key: 'bun-cha', title: 'Bún chả Hà Nội' },
    ],
  },
  {
    key: 'do-uong',
    title: 'Đồ uống',
    children: [
      { key: 'ca-phe', title: 'Cà phê', children: [{ key: 'cf-sua-da', title: 'Cà phê sữa đá' }, { key: 'bac-xiu', title: 'Bạc xỉu' }] },
      { key: 'tra', title: 'Trà', children: [{ key: 'tra-dao', title: 'Trà đào cam sả' }, { key: 'tra-sen', title: 'Trà sen vàng', isDisabled: true }] },
    ],
  },
  { key: 'trang-mieng', title: 'Tráng miệng', children: [{ key: 'che', title: 'Chè khúc bạch' }, { key: 'banh-flan', title: 'Bánh flan' }] },
]

/** Staff permissions — the checkable use case. */
const PERMISSIONS: TreeNode[] = [
  {
    key: 'ban-hang',
    title: 'Bán hàng',
    children: [
      { key: 'tao-don', title: 'Tạo đơn' },
      { key: 'huy-don', title: 'Hủy đơn' },
      { key: 'giam-gia', title: 'Áp dụng giảm giá' },
      { key: 'hoan-tien', title: 'Hoàn tiền', isDisabled: true },
    ],
  },
  {
    key: 'bao-cao',
    title: 'Báo cáo',
    children: [
      { key: 'doanh-thu', title: 'Doanh thu', children: [{ key: 'dt-ngay', title: 'Theo ngày' }, { key: 'dt-mon', title: 'Theo món' }] },
      { key: 'ton-kho', title: 'Tồn kho' },
    ],
  },
  { key: 'cai-dat', title: 'Cài đặt cửa hàng' },
]

const withIcons = (nodes: TreeNode[]): TreeNode[] =>
  nodes.map((n) => (n.children ? { ...n, icon: <Folder size={16} />, children: withIcons(n.children) } : { ...n, icon: <File06 /> }))

const OPEN = ['mon-chinh', 'mon-nuoc', 'do-uong']

const meta = {
  title: 'Components/Data Display/Tree',
  component: Tree,
  args: { items: MENU, 'aria-label': 'Thực đơn', defaultExpandedKeys: OPEN },
  argTypes: {
    selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'] },
    items: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Tree>
export default meta
type Story = StoryObj<typeof meta>

const note = { marginTop: 'var(--fc-space-margin-xs)', color: 'var(--fc-color-content-description)', fontSize: 'var(--fc-typography-size-sm)' } as const
const toolbar = { display: 'flex', gap: 'var(--fc-space-margin-xs)', marginBottom: 'var(--fc-space-margin-xs)' } as const

export const Playground: Story = {}

/** Figma Tree Type=Basic, Line=False: chevron switchers; one row selectable (Tree Item State=Selected). */
export const Basic: Story = { args: { selectionMode: 'single', defaultSelectedKeys: ['pho-bo'] } }

/** Tree Item State: Default / Hover / Selected / Disabled — several rows selected, one disabled ("Trà sen vàng"). */
export const MultipleSelection: Story = {
  args: { selectionMode: 'multiple', defaultSelectedKeys: ['pho-bo', 'cf-sua-da'], defaultExpandedKeys: [...OPEN, 'ca-phe', 'tra'] },
}

/**
 * Figma Tree Type=Checkbox: tri-state checkboxes. Checking "Bán hàng" (Sales)
 * checks every enabled child; a partly checked parent shows the dash.
 * "Hoàn tiền" (Refund) is disabled and keeps its state.
 */
export const Checkbox: Story = {
  render: function Render() {
    const [checked, setChecked] = useState<Key[]>(['tao-don', 'dt-ngay'])
    const [half, setHalf] = useState<Key[]>([])
    return (
      <div>
        <Tree
          aria-label="Quyền của nhân viên"
          items={PERMISSIONS}
          checkable
          checkedKeys={checked}
          onCheckedChange={(keys, info) => { setChecked(keys); setHalf(info.halfCheckedKeys) }}
          defaultExpandAll
        />
        <div style={note}>Đã chọn: {checked.join(', ') || '—'} · Chọn một phần: {half.join(', ') || '—'}</div>
      </div>
    )
  },
}

/** Figma Tree Type=Icon: a 16px icon before each title (folder for groups, file for dishes). */
export const Icon: Story = { args: { items: withIcons(MENU), selectionMode: 'single' } }

/** Figma Line=True: guide lines from each parent to its children, ± square switchers. */
export const ShowLine: Story = { args: { showLine: true, defaultExpandedKeys: [...OPEN, 'com', 'ca-phe'] } }

/** Figma Tree Type=Leaf ("Show Leaf"): with lines, each leaf gets a tick linking it to its parent's line. */
export const Leaf: Story = { args: { showLine: true, showLeafLine: true, defaultExpandedKeys: [...OPEN, 'com', 'ca-phe'] } }

/**
 * Figma Tree Type=Draggable: drag a row by its holder (or the row) and drop it
 * between rows (accent line + ring at the level it lands on) or onto a group
 * (tinted, framed title). Keyboard: focus the holder with ←/→, Enter to pick
 * up, arrows to choose, Enter to drop.
 */
export const Draggable: Story = {
  render: function Render() {
    const [items, setItems] = useState(MENU)
    return <Tree aria-label="Sắp xếp thực đơn" items={items} draggable onMove={setItems} defaultExpandedKeys={OPEN} selectionMode="single" />
  },
}

/**
 * Directory tree: the whole row reacts; the selected row is Solid/Accent
 * with On-Solid text (4.5:1 in Light and Dark). Click selects, double-click
 * or Enter opens a folder.
 */
export const Directory: Story = { args: { items: MENU, directory: true, defaultSelectedKeys: ['com-tam'], defaultExpandedKeys: [...OPEN, 'com'] } }

/** Expand / collapse everything through controlled `expandedKeys` (`getExpandableKeys`). */
export const ExpandCollapseAll: Story = {
  render: function Render() {
    const [expanded, setExpanded] = useState<Key[]>(['mon-chinh'])
    return (
      <div>
        <div style={toolbar}>
          <Button size="sm" onPress={() => setExpanded(getExpandableKeys(MENU))}>Mở rộng tất cả</Button>
          <Button size="sm" onPress={() => setExpanded([])}>Thu gọn tất cả</Button>
        </div>
        <Tree aria-label="Thực đơn" items={MENU} expandedKeys={expanded} onExpandedChange={setExpanded} />
      </div>
    )
  },
}

const BRANCHES: TreeNode[] = [
  { key: 'hn', title: 'Hà Nội', icon: <Building02 />, isLeaf: false },
  { key: 'hcm', title: 'TP. Hồ Chí Minh', icon: <Building02 />, isLeaf: false },
  { key: 'dn', title: 'Đà Nẵng', icon: <Building02 />, isLeaf: true },
]
const STORES: Record<string, string[]> = {
  hn: ['Hoàn Kiếm', 'Cầu Giấy', 'Tây Hồ'],
  hcm: ['Quận 1', 'Quận 3', 'Thủ Đức'],
}
const addChildren = (nodes: TreeNode[], key: Key, children: TreeNode[]): TreeNode[] =>
  nodes.map((n) => (n.key === key ? { ...n, children } : n.children ? { ...n, children: addChildren(n.children, key, children) } : n))

/**
 * Async load (`loadData`): branches load their stores the first time they
 * open; a Spin row shows meanwhile (simulated 1.2 s delay, no network).
 */
export const AsyncLoad: Story = {
  render: function Render() {
    const [items, setItems] = useState(BRANCHES)
    const loadData = (node: TreeNode) =>
      new Promise<void>((resolve) => {
        window.setTimeout(() => {
          const names = STORES[String(node.key)] ?? []
          setItems((prev) => addChildren(prev, node.key, names.map((name, i) => ({ key: `${node.key}-${i}`, title: `Chi nhánh ${name}`, icon: <Receipt />, isLeaf: true }))))
          resolve()
        }, 1200)
      })
    return <Tree aria-label="Chi nhánh" items={items} loadData={loadData} selectionMode="single" />
  },
}

/** Search: only matching rows (with their subtree) and their ancestors stay, opened; the match is highlighted (accent + underline). Accent-insensitive: "tra" finds "Trà". */
export const Search: Story = {
  render: function Render() {
    const [query, setQuery] = useState('tra')
    return (
      <div style={{ display: 'grid', gap: 'var(--fc-space-margin-xs)' }}>
        <SearchField aria-label="Tìm món" placeholder="Tìm món" value={query} onChange={setQuery} />
        <Tree aria-label="Thực đơn" items={MENU} searchValue={query} selectionMode="single" />
      </div>
    )
  },
}

/** Icons for a settings-style tree (Figma Icon swap) with checkboxes — Checkbox + Icon combined. */
export const CheckboxWithIcons: Story = {
  args: {
    'aria-label': 'Phân hệ',
    checkable: true,
    defaultExpandAll: true,
    defaultCheckedKeys: ['menu'],
    items: [
      { key: 'kinh-doanh', title: 'Kinh doanh', icon: <Coins01 />, children: [{ key: 'menu', title: 'Thực đơn', icon: <BookOpen01 /> }, { key: 'kho', title: 'Kho hàng', icon: <Package /> }] },
      { key: 'he-thong', title: 'Hệ thống', icon: <Settings01 />, children: [{ key: 'hoa-don', title: 'Mẫu hóa đơn', icon: <Receipt /> }] },
    ],
  },
}

/** Nothing to show: fc Empty (size sm). */
export const EmptyTree: Story = { args: { items: [] } }

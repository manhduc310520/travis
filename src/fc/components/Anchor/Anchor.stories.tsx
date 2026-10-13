import type { Meta, StoryObj } from '@storybook/react-vite'
import { useScrollableFocus } from '../../useScrollableFocus'
import scrollArea from '../../scrollArea.module.css'
import { Anchor, type AnchorItem } from './Anchor'

const levelItems: AnchorItem[] = [
  { key: 'thong-tin', href: '#thong-tin', title: 'Thông tin chung' },
  {
    key: 'thuc-don',
    href: '#thuc-don',
    title: 'Thực đơn',
    children: [
      { key: 'mon-chinh', href: '#mon-chinh', title: 'Món chính' },
      { key: 'do-uong', href: '#do-uong', title: 'Đồ uống' },
    ],
  },
  { key: 'khu-vuc', href: '#khu-vuc', title: 'Khu vực bàn' },
  { key: 'thanh-toan', href: '#thanh-toan', title: 'Thanh toán' },
]

const flatItems: AnchorItem[] = [
  { key: 'thong-tin', href: '#thong-tin', title: 'Thông tin chung' },
  { key: 'thuc-don', href: '#thuc-don', title: 'Thực đơn' },
  { key: 'khu-vuc', href: '#khu-vuc', title: 'Khu vực bàn' },
  { key: 'nhan-vien', href: '#nhan-vien', title: 'Nhân viên' },
  { key: 'thanh-toan', href: '#thanh-toan', title: 'Thanh toán' },
  { key: 'bao-cao', href: '#bao-cao', title: 'Báo cáo' },
]

const meta: Meta<typeof Anchor> = {
  title: 'Components/Navigation/Anchor',
  component: Anchor,
  args: {
    items: levelItems,
    direction: 'vertical',
    defaultActiveKey: 'thong-tin',
    scrollSpy: false,
  },
  argTypes: {
    items: { control: false },
    direction: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    activeKey: { control: 'text' },
    getContainer: { control: false },
    onChange: { action: 'change' },
  },
}
export default meta
type Story = StoryObj<typeof Anchor>

/**
 * Figma `Anchor` Direction=Vertical with both item levels: `Level=1` links and
 * indented `Level=2` links from nesting `children`. The first item is shown
 * in `State=Active` (scroll spy off: the targets are not on the page).
 */
export const Default: Story = {}

/** Figma `Anchor` Direction=Vertical, single level (the first example on the Figma page). */
export const VerticalSingleLevel: Story = {
  args: { items: flatItems },
}

/**
 * Figma `Anchor` Direction=Horizontal. Horizontal anchors are single-level;
 * the active item has an accent underline.
 */
export const Horizontal: Story = {
  args: { items: flatItems, direction: 'horizontal' },
}

/**
 * Figma `Anchor / Anchor Item` State=Default | Active × Level=1 | 2 side by
 * side: "Món chính" is an active Level=2 item. Hover and keyboard focus come
 * from React Aria (`data-hovered`, `data-focus-visible`).
 */
export const ItemStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--fc-space-margin-xl)', alignItems: 'flex-start' }}>
      <Anchor {...args} items={levelItems} activeKey="thong-tin" aria-label="Mục lục cấp 1" />
      <Anchor {...args} items={levelItems} activeKey="mon-chinh" aria-label="Mục lục cấp 2" />
      <Anchor {...args} items={flatItems.slice(0, 3)} direction="horizontal" activeKey="thuc-don" aria-label="Mục lục ngang" />
    </div>
  ),
}

/**
 * The Figma "Dark Mode" copy of the examples: vertical single level, vertical
 * with `Level=2`, and horizontal inside a `data-mode="dark"` region. Every
 * colour is a semantic token, so the rail, bar and text follow the mode.
 */
export const DarkMode: Story = {
  render: (args) => (
    <div
      data-mode="dark"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--fc-space-margin-xl)',
        padding: 'var(--fc-space-padding-lg)',
        borderRadius: 'var(--fc-radius-lg)',
        background: 'var(--fc-color-background-container)',
      }}
    >
      <Anchor {...args} items={flatItems} aria-label="Mục lục một cấp" />
      <Anchor {...args} items={levelItems} defaultActiveKey="do-uong" aria-label="Mục lục hai cấp" />
      <Anchor {...args} items={flatItems} direction="horizontal" aria-label="Mục lục ngang" />
    </div>
  ),
}

const sections: { id: string; title: string; body: string }[] = [
  { id: 'spy-thong-tin', title: 'Thông tin chung', body: 'Nhà hàng Bếp Việt, chi nhánh Quận 1. Mở cửa 07:00 – 22:00, ngày khai trương 15/03/2024.' },
  { id: 'spy-thuc-don', title: 'Thực đơn', body: '42 món đang bán. Món bán chạy: Phở bò tái 65.000 ₫, Bún chả 55.000 ₫.' },
  { id: 'spy-khu-vuc', title: 'Khu vực bàn', body: 'Tầng 1: 12 bàn. Tầng 2: 8 bàn. Sân vườn: 6 bàn.' },
  { id: 'spy-thanh-toan', title: 'Thanh toán', body: 'Tiền mặt, thẻ, chuyển khoản, ví điện tử. Doanh thu hôm nay 12.450.000 ₫.' },
]

/**
 * Scroll spy (not a Figma variant, kept from the old antd stories): the
 * active item follows the scroll position of the region on the right, and
 * pressing a link scrolls to its section (scroll spy waits until that scroll
 * ends, so the pressed item stays active). The scrolling region is labelled
 * and, while it overflows, focusable with the fc focus ring, so it can be
 * scrolled with the keyboard (`useScrollableFocus` + `scrollArea.module.css`,
 * as Modal and Drawer bodies).
 */
export const ScrollSpy: Story = {
  render: function Render(args) {
    const ref = useScrollableFocus<HTMLDivElement>()
    return (
      <div style={{ display: 'flex', gap: 'var(--fc-space-margin-lg)' }}>
        <Anchor
          {...args}
          scrollSpy
          defaultActiveKey={undefined}
          getContainer={() => ref.current}
          items={sections.map((s) => ({ key: s.id, href: `#${s.id}`, title: s.title }))}
        />
        <div
          ref={ref}
          className={scrollArea.area}
          role="region"
          aria-label="Nội dung chi nhánh"
          style={{
            flex: 1,
            height: 'calc(var(--fc-size-scale-md) * 16)',
            overflowY: 'auto',
            border: 'var(--fc-stroke-width-base) solid var(--fc-color-border-neutral)',
            borderRadius: 'var(--fc-radius-lg)',
            padding: 'var(--fc-space-padding-md)',
          }}
        >
          {sections.map((s) => (
            <section key={s.id} id={s.id} style={{ minHeight: 'calc(var(--fc-size-scale-md) * 14)' }}>
              <h3 style={{ margin: 0, fontWeight: 600 }}>{s.title}</h3>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    )
  },
}

import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus } from '../../../icons'
import { Button } from '../Button/Button'
import { Text } from '../Typography/Typography'
import { Affix, type AffixProps } from './Affix'
import demo from './AffixDemo.module.css'

const ORDERS = Array.from({ length: 20 }, (_, i) => ({
  id: `HD${String(1001 + i).padStart(5, '0')}`,
  total: `${((i % 7) + 1) * 45}.000 ₫`,
}))

function Rows() {
  return (
    <>
      {ORDERS.map((o) => (
        <div key={o.id} className={demo.row}>
          <span>Đơn {o.id}</span>
          <span>{o.total}</span>
        </div>
      ))}
    </>
  )
}

/** Header bar pinned above an order list that scrolls underneath it. */
function HeaderDemo(args: AffixProps) {
  const [affixed, setAffixed] = useState(false)
  return (
    <div className={demo.frame}>
      <div className={demo.intro}>
        <Text tone="secondary">Cuộn danh sách: thanh tiêu đề sẽ được ghim ở đầu khung.</Text>
      </div>
      <Affix
        {...args}
        onChange={(value) => {
          setAffixed(value)
          args.onChange?.(value)
        }}
      >
        <div className={demo.bar}>
          <span className={demo.title}>Đơn hàng hôm nay{affixed ? ' (đã ghim)' : ''}</span>
          <Button iconStart={<Plus />}>Tạo đơn</Button>
        </div>
      </Affix>
      <Rows />
    </div>
  )
}

const MENU = [
  { name: 'Món chính', items: ['Cơm tấm sườn', 'Bún bò Huế', 'Phở bò tái', 'Mì xào hải sản', 'Cơm gà xối mỡ'] },
  { name: 'Đồ uống', items: ['Trà đá', 'Cà phê sữa đá', 'Nước cam', 'Sinh tố bơ', 'Trà đào'] },
  { name: 'Tráng miệng', items: ['Chè thái', 'Bánh flan', 'Sữa chua nếp cẩm', 'Kem dừa', 'Rau câu'] },
]

/** One menu category whose heading is pinned only while its own section is in view. */
function MenuSection({ name, items, index, offsetTop }: { name: string; items: string[]; index: number; offsetTop?: number }) {
  const [affixed, setAffixed] = useState(false)
  return (
    <section className={demo.section}>
      <Affix offsetTop={offsetTop} onChange={setAffixed}>
        <div className={demo.bar}>
          <span className={demo.title}>
            {name}
            {affixed ? ' (đã ghim)' : ''}
          </span>
          <Text tone="secondary">{items.length} món</Text>
        </div>
      </Affix>
      {items.map((item, i) => (
        <div key={item} className={demo.row}>
          <span>{item}</span>
          <span>{((index * 5 + i) % 6) * 10 + 35}.000 ₫</span>
        </div>
      ))}
    </section>
  )
}

const meta = {
  title: 'Components/Data Entry/Affix',
  component: Affix,
  args: { offsetTop: 0 },
  argTypes: {
    offsetTop: { control: 'number' },
    offsetBottom: { control: false },
    onChange: { action: 'onChange' },
  },
  render: (args) => <HeaderDemo {...args} />,
} satisfies Meta<typeof Affix>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Figma ❖ Affix example: content pinned above a scrolling list. The bar
 * brings its own container surface so rows do not show through, and a
 * divider appears only while pinned (`data-affixed`), so the state is visible.
 */
export const Default: Story = {}

/**
 * Figma ❖ Affix example frame: the pinned "Affix" slot sits 16px from the
 * top-right corner. `offsetTop={16}` keeps a gap between the container edge
 * and the pinned action.
 */
export const OffsetTop: Story = {
  args: { offsetTop: 16 },
  render: (args) => (
    <div className={demo.frame}>
      <div className={demo.intro}>
        <Text tone="secondary">Nút thao tác được ghim cách mép trên 16px khi cuộn.</Text>
      </div>
      <Affix {...args}>
        <div className={demo.floating}>
          <Button variant="primary" iconStart={<Plus />}>
            Thêm món
          </Button>
        </div>
      </Affix>
      <Rows />
    </div>
  ),
}

/**
 * `offsetBottom`: an action bar pinned to the bottom of the container until
 * its place in the flow scrolls into view (e.g. saving a long menu form).
 */
export const OffsetBottom: Story = {
  args: { offsetTop: undefined, offsetBottom: 0 },
  render: (args) => (
    <div className={demo.frame}>
      <div className={demo.intro}>
        <Text tone="secondary">Thanh lưu được ghim ở đáy khung cho tới khi cuộn tới cuối danh sách.</Text>
      </div>
      <Rows />
      <Affix {...args}>
        <div className={demo.footer}>
          <Button>Hủy</Button>
          <Button variant="primary">Lưu thay đổi</Button>
        </div>
      </Affix>
    </div>
  ),
}

/**
 * Affix inside a parent element that is not the scroll container: each menu
 * category heading is pinned while its own section is in view, then scrolls
 * away with the section and the next heading takes over. `data-affixed` and
 * `onChange` turn back to not pinned as soon as the section pushes the
 * heading off the offset line.
 */
export const WithinSection: Story = {
  render: (args) => (
    // Scrollable region with no focusable content: make it focusable so keyboard users can scroll it.
    <div className={demo.frame} tabIndex={0} role="region" aria-label="Thực đơn">
      {MENU.map((group, index) => (
        <MenuSection key={group.name} {...group} index={index} offsetTop={args.offsetTop} />
      ))}
    </div>
  ),
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { DemoBox } from '../../docs/DemoBox'
import { Card } from '../Card/Card'
import { Masonry } from './Masonry'

/** Dish cards of different heights — the Figma page mixes tall (124) and short (54) slots. */
const dishes = [
  { name: 'Phở bò tái', price: '65.000 ₫', note: 'Nước dùng hầm xương 12 tiếng, bánh phở tươi, bò tái lát mỏng.', tall: true },
  { name: 'Trà đá', price: '5.000 ₫', tall: false },
  { name: 'Bún chả Hà Nội', price: '55.000 ₫', note: 'Chả nướng than hoa, kèm rau sống và nước chấm chua ngọt.', tall: true },
  { name: 'Nem rán (4 chiếc)', price: '40.000 ₫', tall: false },
  { name: 'Cơm rang dưa bò', price: '60.000 ₫', note: 'Món bán chạy ca trưa. Có thể đổi sang cơm trắng theo yêu cầu.', tall: true },
  { name: 'Cà phê sữa đá', price: '29.000 ₫', tall: false },
  { name: 'Lẩu thái hải sản', price: '320.000 ₫', note: 'Phần 2–3 người. Tôm, mực, nghêu, nấm kim châm, rau nhúng.', tall: true },
  { name: 'Sữa chua nếp cẩm', price: '25.000 ₫', tall: false },
  { name: 'Gỏi cuốn tôm thịt', price: '45.000 ₫', note: 'Cuốn tại quầy khi có đơn, chấm tương đậu phộng.', tall: true },
  { name: 'Nước cam ép', price: '35.000 ₫', tall: false },
  { name: 'Bò lúc lắc', price: '120.000 ₫', note: 'Thăn bò Úc, ớt chuông, hành tây. Phục vụ kèm bánh mì hoặc cơm.', tall: true },
  { name: 'Khoai tây chiên', price: '30.000 ₫', tall: false },
]

/** Row spans of each `Slot / Basic`, in Figma reading order (row by row), per `Type` at `Columns=3`. */
const slotMixes: Record<string, number[]> = {
  'Type=1': [2, 1, 1, 2, 3, 2, 2, 1, 2, 2, 1, 2, 1, 1, 1],
  'Type=2': [2, 3, 1, 1, 2, 2, 2, 3, 1, 1, 3, 2, 1],
  'Type=3': [3, 2, 3, 3, 3, 2, 3, 2, 2, 1],
}

const renderDishes = (count: number) =>
  dishes.slice(0, count).map((dish) => (
    <Card key={dish.name} size="sm" title={dish.name} extra={dish.price}>
      {dish.note && <p style={{ margin: 0, color: 'var(--fc-color-content-neutral)' }}>{dish.note}</p>}
    </Card>
  ))

const meta = {
  title: 'Components/Layout/Masonry',
  component: Masonry,
  args: { columns: 3, gap: 'base', placement: 'balanced' },
  argTypes: {
    columns: { control: 'inline-radio', options: [2, 3, 4], description: 'Figma property `Columns`.' },
    gap: { control: 'select', options: ['xxs', 'xs', 'sm', 'base', 'md', 'lg', 'xl', 'xxl'] },
    placement: { control: 'inline-radio', options: ['balanced', 'sequential'] },
    children: { control: false },
  },
  render: (args) => (
    <Masonry {...args} style={{ maxWidth: 720 }}>
      {renderDishes(12)}
    </Masonry>
  ),
} satisfies Meta<typeof Masonry>
export default meta
type Story = StoryObj<typeof meta>

/** Figma `Masonry` → `Columns=3` (the middle example on the page). Gap 16px both ways (`space/margin/base`). */
export const Default: Story = {}

/** Figma `Masonry` → `Columns=2` (330px wide in Figma: two 157px columns + 16px gap). */
export const TwoColumns: Story = {
  args: { columns: 2 },
  render: (args) => (
    <Masonry {...args} style={{ maxWidth: 480 }}>
      {renderDishes(10)}
    </Masonry>
  ),
}

/** Figma `Masonry` → `Columns=3` (503px wide in Figma). 12 dish cards; the Figma example shows 15 empty slots. */
export const ThreeColumns: Story = {
  args: { columns: 3 },
  render: (args) => (
    <Masonry {...args} style={{ maxWidth: 720 }}>
      {renderDishes(12)}
    </Masonry>
  ),
}

/** Figma `Masonry` → `Columns=4` (676px wide in Figma). */
export const FourColumns: Story = {
  args: { columns: 4 },
  render: (args) => (
    <Masonry {...args} style={{ maxWidth: 960 }}>
      {renderDishes(12)}
    </Masonry>
  ),
}

/**
 * Not a Figma property: `sequential` deals items round-robin instead of filling the
 * shortest column. Compare the column ends with `Default` (`balanced`).
 */
export const Sequential: Story = {
  args: { columns: 3, placement: 'sequential' },
}

/**
 * Code-only: `columns` as a breakpoint map — 1 column on phones, 2 from `sm`,
 * 3 from `md`, 4 from `lg` (the `breakpoint/*` tokens). Resize the canvas to see it step.
 */
export const Responsive: Story = {
  args: { columns: { xs: 1, sm: 2, md: 3, lg: 4 } },
  render: (args) => <Masonry {...args}>{renderDishes(12)}</Masonry>,
}

/**
 * Slot height mixes of the Figma `Masonry` set, read row by row from the `Columns=3` variants.
 * In Figma each variant is an 8-row grid; a `Slot / Basic` spans 1, 2 or 3 rows (54 / 124 / 194px).
 * - `Type=1`: 15 slots, mostly 1- and 2-row.
 * - `Type=2`: 13 slots, 1-, 2- and 3-row mixed.
 * - `Type=3`: 10 slots, mostly 2- and 3-row.
 *
 * The meaning of `Type` is still pending with the designer, so it is not a prop: this story only
 * mirrors the placeholder arrangements. Boxes use the `size/scale/xxl` row unit plus the gap.
 */
export const SlotMixes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--fc-space-margin-xl)', alignItems: 'flex-start' }}>
      {Object.entries(slotMixes).map(([type, spans]) => (
        <div key={type} style={{ flex: '1 1 240px', maxWidth: 360 }}>
          <p style={{ margin: '0 0 var(--fc-space-margin-sm)', color: 'var(--fc-color-content-neutral)' }}>{type}</p>
          <Masonry {...args}>
            {spans.map((span, i) => (
              <DemoBox
                key={i}
                style={{
                  minBlockSize: `calc(${span} * var(--fc-size-scale-xxl) + ${span - 1} * var(--fc-space-margin-base))`,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {i + 1}
              </DemoBox>
            ))}
          </Masonry>
        </div>
      ))}
    </div>
  ),
}

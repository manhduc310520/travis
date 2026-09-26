import type { Meta, StoryObj } from '@storybook/react-vite'
import { Trash01 } from '../../../icons'
import { Button } from '../Button/Button'
import type { PopoverPlacement } from '../Popover/Popover'
import { Popconfirm } from './Popconfirm'

const meta = {
  title: 'Components/Popconfirm',
  component: Popconfirm,
  args: {
    title: 'Xóa món ăn?',
    description: 'Món "Phở bò" sẽ bị xóa khỏi thực đơn.',
    placement: 'top',
    danger: true,
    okText: 'Xóa',
    children: <Button danger iconStart={<Trash01 />}>Xóa</Button>,
  },
  argTypes: {
    placement: { control: 'select', options: ['top', 'top start', 'top end', 'bottom', 'bottom start', 'bottom end', 'left', 'left top', 'left bottom', 'right', 'right top', 'right bottom'] },
    children: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popconfirm>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Open on first render, for visual review. */
export const Open: Story = { args: { defaultOpen: true } }

/** Non-destructive confirmation (primary OK), no description. */
export const Simple: Story = {
  args: { title: 'Gửi đơn cho bếp?', description: undefined, danger: false, okText: 'Gửi', defaultOpen: true, children: <Button variant="primary">Gửi bếp</Button> },
}

/** `onConfirm` returns a promise: the OK button spins until it settles, then the popover closes. */
export const AsyncConfirm: Story = {
  args: { onConfirm: () => new Promise((r) => setTimeout(r, 1500)) },
}

const PLACEMENTS: (PopoverPlacement | null)[][] = [
  [null, 'top start', 'top', 'top end', null],
  ['left top', null, null, null, 'right top'],
  ['left', null, null, null, 'right'],
  ['left bottom', null, null, null, 'right bottom'],
  [null, 'bottom start', 'bottom', 'bottom end', null],
]

/**
 * Figma Placement: all 12. A popconfirm is modal (it takes focus), so only
 * one can be open at a time — open each from its button.
 */
export const Placements: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 128px)', gap: 'var(--fc-space-margin-base)', justifyContent: 'center', padding: 'calc(var(--fc-space-padding-xl) * 3) 0' }}>
      {PLACEMENTS.flat().map((p, i) =>
        p == null ? <span key={i} /> : (
          <Popconfirm key={p} placement={p} title="Xác nhận thao tác?" description={p}>
            <Button block>{p}</Button>
          </Popconfirm>
        ),
      )}
    </div>
  ),
}

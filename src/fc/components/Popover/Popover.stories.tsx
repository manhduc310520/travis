import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button/Button'
import { Popover, type PopoverPlacement } from './Popover'

const meta = {
  title: 'Components/Popover',
  component: Popover,
  args: {
    title: 'Món chay',
    content: 'Không dùng thịt, cá và nước mắm. Phù hợp khách ăn chay trường.',
    placement: 'top',
    showArrow: true,
    trigger: 'click',
    children: <Button>Xem ghi chú</Button>,
  },
  argTypes: {
    placement: { control: 'select', options: ['top', 'top start', 'top end', 'bottom', 'bottom start', 'bottom end', 'left', 'left top', 'left bottom', 'right', 'right top', 'right bottom'] },
    trigger: { control: 'inline-radio', options: ['click', 'hover'] },
    children: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popover>
export default meta
type Story = StoryObj<typeof meta>

const note = 'Không dùng thịt, cá và nước mắm.'

export const Playground: Story = {}

/** Open on first render, for visual review. */
export const Open: Story = { args: { defaultOpen: true } }

/** `click` (default) moves focus into the panel; `hover` also opens on keyboard focus and never traps focus. */
export const TriggerTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--fc-space-margin-base)' }}>
      <Popover title="Bấm để mở" content={note}><Button>Click</Button></Popover>
      <Popover trigger="hover" title="Rê chuột hoặc Tab tới" content={note}><Button>Hover / focus</Button></Popover>
    </div>
  ),
}

/** Figma Arrow=false. */
export const WithoutArrow: Story = { args: { showArrow: false, defaultOpen: true } }

/** Content only — the dialog is named by `aria-label`. */
export const ContentOnly: Story = { args: { title: undefined, 'aria-label': 'Ghi chú món', defaultOpen: true } }

const PLACEMENTS: (PopoverPlacement | null)[][] = [
  [null, 'top start', 'top', 'top end', null],
  ['left top', null, null, null, 'right top'],
  ['left', null, null, null, 'right'],
  ['left bottom', null, null, null, 'right bottom'],
  [null, 'bottom start', 'bottom', 'bottom end', null],
]

/**
 * Figma Placement: all 12, held open. Uses the hover (non-modal) trigger so
 * the twelve panels can be open together — a modal popover hides everything
 * else from assistive tech.
 */
export const Placements: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 128px)', gap: 'calc(var(--fc-space-margin-xxl) * 1.5) var(--fc-space-margin-lg)', justifyContent: 'center', padding: 'calc(var(--fc-space-padding-xl) * 4) 0' }}>
      {PLACEMENTS.flat().map((p, i) =>
        p == null ? <span key={i} /> : (
          <Popover key={p} trigger="hover" defaultOpen placement={p} title={p} content="Nội dung">
            <Button block>{p}</Button>
          </Popover>
        ),
      )}
    </div>
  ),
}

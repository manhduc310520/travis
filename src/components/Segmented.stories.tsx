import type { Meta, StoryObj } from '@storybook/react-vite'
import { Segmented } from 'antd'

const meta: Meta<typeof Segmented> = {
  component: Segmented,
  title: 'Components/Segmented',
  tags: ['ai-generated', 'needs-work'],
  // `block`'s description is antd's own JSDoc from segmented/index.d.ts,
  // copied as-is. `options`/`disabled` have no JSDoc there.
  argTypes: {
    options: { description: 'The list of segments.', control: false },
    block: { description: "Option to fit width to its parent's width.", control: 'boolean' },
    disabled: { description: 'Disables the whole control.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Segmented>

const options = ['Ngày', 'Tuần', 'Tháng']

export const Default: Story = { args: { options, defaultValue: 'Tuần' } }
export const Block: Story = { args: { options, block: true, style: { maxWidth: 360 } } }
export const Disabled: Story = { args: { options, disabled: true } }

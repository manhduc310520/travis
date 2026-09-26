import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenTable } from './TokenTable'
import { tokensWithPrefix } from './tokenList'

const meta = {
  title: 'Design Tokens/Layout',
  component: TokenTable,
  args: { tokens: [] },
} satisfies Meta<typeof TokenTable>
export default meta
type Story = StoryObj<typeof meta>

export const Margin: Story = { args: { tokens: tokensWithPrefix('space/margin/'), preview: 'spacing' } }
export const Padding: Story = {
  args: { tokens: tokensWithPrefix('space/padding/', 'space/padding-inline/', 'space/padding-block/'), preview: 'spacing' },
}
export const SizeScale: Story = { args: { tokens: tokensWithPrefix('size/scale/'), preview: 'spacing' } }
export const ControlHeight: Story = { args: { tokens: tokensWithPrefix('size/control/'), preview: 'spacing' } }
export const Breakpoint: Story = { args: { tokens: tokensWithPrefix('breakpoint/') } }
export const Other: Story = { args: { tokens: tokensWithPrefix('size/seed/', 'size/popup-arrow/') } }

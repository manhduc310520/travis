import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenTable } from './TokenTable'
import { tokensWithPrefix } from './tokenList'

const meta = {
  title: 'Design Tokens/Border',
  component: TokenTable,
  args: { tokens: [] },
} satisfies Meta<typeof TokenTable>
export default meta
type Story = StoryObj<typeof meta>

export const StrokeWidth: Story = { args: { tokens: tokensWithPrefix('stroke/width/'), preview: 'border-width' } }
export const Radius: Story = { args: { tokens: tokensWithPrefix('radius/'), preview: 'radius' } }

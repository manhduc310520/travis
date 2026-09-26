import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenTable } from './TokenTable'
import { tokensWithPrefix } from './tokenList'

const meta = {
  title: 'Design Tokens/Font',
  component: TokenTable,
  args: { tokens: [] },
} satisfies Meta<typeof TokenTable>
export default meta
type Story = StoryObj<typeof meta>

export const Family: Story = { args: { tokens: tokensWithPrefix('typography/family/'), preview: 'font-family' } }
export const Size: Story = { args: { tokens: tokensWithPrefix('typography/size/'), preview: 'font-size' } }
export const LineHeight: Story = { args: { tokens: tokensWithPrefix('typography/line-height/') } }
export const Weight: Story = { args: { tokens: tokensWithPrefix('typography/weight/'), preview: 'font-weight' } }

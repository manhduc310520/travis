import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenTable } from './TokenTable'
import { tokensWithPrefix } from './tokenList'

const meta = {
  title: 'Design Tokens/Color',
  component: TokenTable,
  args: { tokens: [], preview: 'color' },
} satisfies Meta<typeof TokenTable>
export default meta
type Story = StoryObj<typeof meta>

export const Content: Story = { args: { tokens: tokensWithPrefix('color/content/') } }
export const Background: Story = { args: { tokens: tokensWithPrefix('color/background/') } }
export const Solid: Story = { args: { tokens: tokensWithPrefix('color/solid/') } }
export const Border: Story = { args: { tokens: tokensWithPrefix('color/border/') } }
export const Fill: Story = { args: { tokens: tokensWithPrefix('color/fill/') } }
export const Outline: Story = { args: { tokens: tokensWithPrefix('color/outline/') } }
export const Seed: Story = { args: { tokens: tokensWithPrefix('color/seed/') } }
export const Brand: Story = { args: { tokens: tokensWithPrefix('brand/') } }
export const Palette: Story = { args: { tokens: tokensWithPrefix('color/palette/') } }
export const Global: Story = { args: { tokens: tokensWithPrefix('global/') } }

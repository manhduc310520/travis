import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenTable } from './TokenTable'
import { dimensionTokens } from '../dimensionTokens'

const dims = dimensionTokens.default
const row = (key: string) => ({ token: key, value: `${dims[key]}px` })

const meta: Meta<typeof TokenTable> = {
  title: 'Design Tokens/Layout',
  component: TokenTable,
  tags: ['ai-generated', 'needs-work'],
}
export default meta
type Story = StoryObj<typeof TokenTable>

export const Spacing: Story = {
  args: {
    kind: 'spacing',
    rows: ['paddingXXS', 'paddingXS', 'paddingSM', 'padding', 'paddingMD', 'paddingLG', 'paddingXL'].map(row),
  },
}

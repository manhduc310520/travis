import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenTable } from './TokenTable'
import { semanticFixed } from '../semanticTokens'
import { dimensionTokens } from '../dimensionTokens'

const fixedLight = semanticFixed.light
const dims = dimensionTokens.default
const row = (tokens: Record<string, string | number>, unit = '') => (key: string) => ({
  token: key,
  value: `${tokens[key]}${unit}`,
})

const meta: Meta<typeof TokenTable> = {
  title: 'Design Tokens/Border',
  component: TokenTable,
  tags: ['ai-generated', 'needs-work'],
}
export default meta
type Story = StoryObj<typeof TokenTable>

export const BorderColor: Story = {
  args: { kind: 'color', rows: ['colorBorder', 'colorBorderSecondary'].map(row(fixedLight)) },
}

export const BorderSize: Story = {
  args: {
    kind: 'border-width',
    rows: ['lineWidth', 'lineWidthBold', 'lineWidthFocus'].map(row(dims, 'px')),
  },
}

export const BorderRadius: Story = {
  args: {
    kind: 'radius',
    rows: ['borderRadiusXS', 'borderRadiusSM', 'borderRadius', 'borderRadiusLG'].map(row(dims, 'px')),
  },
}

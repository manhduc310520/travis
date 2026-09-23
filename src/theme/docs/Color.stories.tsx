import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenTable } from './TokenTable'
import { semanticFixed, semanticBrand } from '../semanticTokens'

/**
 * All rows read Blue/Light — the reference brand+mode. The other 4 brands
 * follow the exact same token names with their own values; see the Brand
 * switcher in the toolbar to preview them live on any component.
 */
const blueLight = semanticBrand['blue.light']
const fixedLight = semanticFixed.light

const row = (tokens: Record<string, string>) => (key: string) => ({ token: key, value: tokens[key] })

const meta: Meta<typeof TokenTable> = {
  title: 'Design Tokens/Color',
  component: TokenTable,
  tags: ['ai-generated', 'needs-work'],
}
export default meta
type Story = StoryObj<typeof TokenTable>

export const ThemeColors: Story = {
  args: {
    kind: 'color',
    rows: ['colorPrimary', 'colorInfo', 'colorLink'].map(row(blueLight)),
  },
}

export const BackgroundColors: Story = {
  args: {
    kind: 'color',
    rows: ['colorBgLayout', 'colorBgContainer', 'colorBgElevated', 'colorBgMask', 'colorBgSpotlight'].map(
      row(fixedLight),
    ),
  },
}

export const SystemColors: Story = {
  args: {
    kind: 'color',
    rows: ['colorSuccess', 'colorWarning', 'colorError'].map(row(fixedLight)),
  },
}

export const TransparencyColors: Story = {
  args: {
    kind: 'color',
    rows: ['colorFill', 'colorFillSecondary', 'colorFillTertiary', 'colorFillQuaternary'].map(row(fixedLight)),
  },
}

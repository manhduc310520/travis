import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenTable } from './TokenTable'
import { semanticFixed } from '../semanticTokens'
import { typographyTokens, fontWeightTokens } from '../typographyTokens'
import { globalTokens } from '../index'

const fixedLight = semanticFixed.light
const sizes = typographyTokens.default
// Ant Design's lineHeight* tokens are unitless ratios (see typographyTokens.ts)
// — full float division precision (1.2105263157894737) isn't a useful display
// value, so this table rounds to 2 decimals the same way a human reading the
// Figma variable would.
const lineHeights = Object.fromEntries(
  Object.entries(sizes)
    .filter(([key]) => key.startsWith('lineHeight'))
    .map(([key, value]) => [key, Math.round(value * 100) / 100]),
)

const row = (tokens: Record<string, string | number>, unit = '') => (key: string) => ({
  token: key,
  value: `${tokens[key]}${unit}`,
})

const meta: Meta<typeof TokenTable> = {
  title: 'Design Tokens/Font',
  component: TokenTable,
  tags: ['ai-generated', 'needs-work'],
}
export default meta
type Story = StoryObj<typeof TokenTable>

export const Color: Story = {
  args: {
    kind: 'color',
    rows: [
      'colorText', 'colorTextSecondary', 'colorTextTertiary', 'colorTextQuaternary',
      'colorTextHeading', 'colorTextLabel', 'colorTextDescription', 'colorTextDisabled',
      'colorTextPlaceholder', 'colorTextLightSolid',
    ].map(row(fixedLight)),
  },
}

export const Size: Story = {
  args: {
    kind: 'font-size',
    rows: [
      'fontSize', 'fontSizeLG', 'fontSizeSM', 'fontSizeXL',
      'fontSizeHeading1', 'fontSizeHeading2', 'fontSizeHeading3', 'fontSizeHeading4', 'fontSizeHeading5',
      'fontSizeIcon',
    ].map(row(sizes, 'px')),
  },
}

export const Family: Story = {
  args: {
    kind: 'text',
    showPreview: false,
    rows: ['fontFamily', 'fontFamilyCode'].map(row(globalTokens)),
  },
}

export const Weight: Story = {
  args: {
    kind: 'text',
    showPreview: false,
    rows: ['fontWeightNormal', 'fontWeightMedium', 'fontWeightStrong'].map(row(fontWeightTokens)),
  },
}

export const LineHeight: Story = {
  args: {
    kind: 'text',
    showPreview: false,
    rows: [
      'lineHeight', 'lineHeightLG', 'lineHeightSM',
      'lineHeightHeading1', 'lineHeightHeading2', 'lineHeightHeading3', 'lineHeightHeading4', 'lineHeightHeading5',
    ].map(row(lineHeights)),
  },
}

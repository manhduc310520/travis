import type { Meta, StoryObj } from '@storybook/react-vite'
import { theme } from 'antd'
import { TokenTable } from './TokenTable'

/** Reads the live resolved sizes so this never drifts from what components actually render with. */
function FontSizes() {
  const { token } = theme.useToken()
  const rows = [
    { token: 'fontSizeHeading1', value: `${token.fontSizeHeading1}px` },
    { token: 'fontSizeHeading2', value: `${token.fontSizeHeading2}px` },
    { token: 'fontSizeHeading3', value: `${token.fontSizeHeading3}px` },
    { token: 'fontSizeLG', value: `${token.fontSizeLG}px` },
    { token: 'fontSize', value: `${token.fontSize}px` },
    { token: 'fontSizeSM', value: `${token.fontSizeSM}px` },
  ]
  return <TokenTable kind="font-size" rows={rows} />
}
// See the identical fix (and full explanation) in Icons.stories.tsx —
// production minification renames this function, breaking "Show code".
FontSizes.displayName = 'FontSizes'

const meta: Meta<typeof FontSizes> = {
  title: 'Design Tokens/Font',
  component: FontSizes,
  tags: ['ai-generated', 'needs-work'],
}
export default meta
type Story = StoryObj<typeof FontSizes>

export const Sizes: Story = {
  render: () => <FontSizes />,
  // See Icons.stories.tsx's AllIcons for the full explanation of both the
  // `render` (avoids the minification-breaks-source-inference bug) and this
  // pin (keeps "Show code" showing just the render line, not this comment).
  parameters: { docs: { source: { code: '() => <FontSizes />' } } },
}

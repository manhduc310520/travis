import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Masonry } from 'antd'

/**
 * From the Figma component's own Code Connect example. `MasonryItemType` is
 * internal to antd (not exported from the package root) — items are typed
 * structurally here instead of importing it.
 */
const heights = [150, 50, 90, 70, 110, 150, 130, 80].map((height, index) => ({
  key: `item-${index}`,
  data: height,
}))

const meta: Meta<typeof Masonry> = {
  component: Masonry,
  title: 'Components/Masonry',
  tags: ['ai-generated', 'needs-work'],
  // `columns`/`gutter` descriptions are antd's own JSDoc from
  // masonry/Masonry.d.ts, copied as-is.
  argTypes: {
    columns: { description: 'Number of columns in the masonry grid layout.', control: 'number' },
    gutter: { description: 'Spacing between items.', control: 'number' },
    items: { description: 'The list of items to lay out.', control: false },
  },
}
export default meta
type Story = StoryObj<typeof Masonry>

export const Default: Story = {
  args: {
    columns: 4,
    gutter: 16,
    items: heights,
    itemRender: ({ data, index }) => (
      <Card size="small" style={{ height: data as number }}>
        {index + 1}
      </Card>
    ),
  },
}

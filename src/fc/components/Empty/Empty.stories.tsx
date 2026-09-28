import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus, SearchMd } from '../../../icons'
import { Button } from '../Button/Button'
import { Empty } from './Empty'

const meta = {
  title: 'Components/Data Display/Empty',
  component: Empty,
  args: { size: 'md', description: 'Không có dữ liệu' },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    image: { control: 'select', options: [undefined, 'default', 'simple'] },
    description: { control: 'text' },
    children: { control: false },
  },
} satisfies Meta<typeof Empty>
export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--fc-space-margin-xl)' } as const
const caption = { color: 'var(--fc-color-content-description)', fontSize: 'var(--fc-typography-size-sm)' } as const

/** Figma "❖ Empty"; pick Size and Image in the controls. */
export const Playground: Story = {}

/** Figma `Empty / Image`: Image=1 (`simple`) and Image=2 (`default`), drawn at MD width. */
export const Images: Story = {
  render: () => (
    <div style={row}>
      <div>
        <div style={caption}>Image=1 · image="simple"</div>
        <Empty image="simple" description={null} />
      </div>
      <div>
        <div style={caption}>Image=2 · image="default"</div>
        <Empty image="default" description={null} />
      </div>
    </div>
  ),
}

/**
 * Figma `Empty` Size=MD (Image=2, 184 wide) and Size=SM (Image=1, 120 wide —
 * what Select and other dropdowns show when nothing matches).
 */
export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <div>
        <div style={caption}>Size=MD</div>
        <Empty size="md" description="Chưa có đơn hàng nào" />
      </div>
      <div>
        <div style={caption}>Size=SM</div>
        <Empty size="sm" description="Không tìm thấy món" />
      </div>
    </div>
  ),
}

/** Figma Size=MD with its Button slot: one primary action. */
export const WithAction: Story = {
  args: {
    description: 'Thực đơn chưa có món nào',
    children: (
      <Button variant="primary" size="lg" iconStart={<Plus />}>
        Thêm món
      </Button>
    ),
  },
}

/** No results for a search: a default action to clear the filter (the page keeps its own primary). */
export const NoResults: Story = {
  args: {
    image: 'simple',
    description: 'Không tìm thấy hóa đơn khớp với "Bàn 12"',
    children: <Button iconStart={<SearchMd />}>Xóa bộ lọc</Button>,
  },
}

/** Size=SM inside an elevated panel, the way a Select menu shows it. */
export const InDropdown: Story = {
  render: () => (
    <div
      style={{
        width: 280,
        padding: 'var(--fc-component-select-menu-padding)',
        borderRadius: 'var(--fc-component-select-menu-radius)',
        background: 'var(--fc-color-background-elevated)',
        boxShadow: 'var(--fc-shadow-base)',
      }}
    >
      <Empty size="sm" description="Không có chi nhánh phù hợp" />
    </div>
  ),
}

/** Both images inside a fixed Dark region: every grey is an fc token, so the artwork dims with the mode. */
export const DarkMode: Story = {
  render: () => (
    <div data-mode="dark" style={{ ...row, padding: 'var(--fc-space-padding-lg)', borderRadius: 'var(--fc-radius-lg)', background: 'var(--fc-color-background-container)' }}>
      <Empty description="Chưa có đơn hàng nào" />
      <Empty size="sm" description="Không tìm thấy món" />
    </div>
  ),
}

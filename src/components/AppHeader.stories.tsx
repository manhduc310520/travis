import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { AppHeader } from './AppHeader'

const meta = {
  component: AppHeader,
  tags: ['ai-generated', 'needs-work'],
  // Full-bleed: AppHeader is a layout header (AppShell renders this exact
  // component, not a re-implementation — see AppShell.tsx). The default
  // padded layout wraps it in a boxed card, making it look like an isolated
  // widget instead of the edge-to-edge bar it actually is everywhere it's used.
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { brandName: 'iPOS.vn', userName: 'Chanh dev' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Chanh dev')).toBeVisible()
    await expect(canvas.getByLabelText('Tìm kiếm')).toBeVisible()
  },
}

export const CustomTagline: Story = {
  args: { tagline: 'FABi CMS' },
}

export const LongProductName: Story = {
  args: { brandName: 'iPOS.vn Enterprise', userName: 'Nguyễn Thị Hồng Ánh' },
}

/**
 * The only `CssCheck` in this project.
 *
 * `toBeVisible` would pass on a completely unstyled header. Reading the
 * resolved `background-image` is the one assertion that proves the Ant Design
 * ConfigProvider and the Figma-derived CSS variables both reached the story.
 *
 * `#003EB3` and `#0958D9` are the Blue brand's `colorHeaderBgStart` and
 * `colorHeaderBgEnd` in light mode, straight out of the Figma export.
 */
export const CssCheck: Story = {
  args: { brandName: 'iPOS.vn' },
  globals: { brand: 'blue', mode: 'light' },
  play: async ({ canvas }) => {
    const header = canvas.getByRole('banner')
    const bg = getComputedStyle(header).backgroundImage
    await expect(bg).toContain('linear-gradient')
    await expect(bg).toContain('rgb(0, 62, 179)')
    await expect(bg).toContain('rgb(9, 88, 217)')
  },
}

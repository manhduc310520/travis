import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { AppShell } from './AppShell'
import { RestaurantListPage } from './RestaurantListPage'
import { sampleRows } from './restaurantSamples'

const meta: Meta<typeof AppShell> = {
  title: 'Templates/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  args: { height: '100vh' },
  argTypes: {
    layout: { control: 'inline-radio', options: ['auto', 'desktop', 'mobile'] },
  },
}
export default meta
type Story = StoryObj<typeof AppShell>

/** The shell around the restaurant list with no rows (empty state). */
export const EmptySearch: Story = {
  render: (args) => (
    <AppShell {...args}>
      <RestaurantListPage />
    </AppShell>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Không tìm thấy dữ liệu')).toBeVisible()
    await expect(canvas.getByRole('link', { name: 'Nhà hàng' })).toHaveAttribute('aria-current', 'page')
  },
}

export const WithRows: Story = {
  render: (args) => (
    <AppShell {...args}>
      <RestaurantListPage rows={sampleRows} />
    </AppShell>
  ),
}

export const LoadingRows: Story = {
  render: (args) => (
    <AppShell {...args}>
      <RestaurantListPage loading />
    </AppShell>
  ),
}

/** Figma "App Shells Items / Menu", Size=SM: the 80-wide icon rail, labels in tooltips. "Thu gọn" toggles it. */
export const Collapsed: Story = {
  args: { defaultCollapsed: true, layout: 'desktop' },
  render: (args) => (
    <AppShell {...args}>
      <RestaurantListPage rows={sampleRows} />
    </AppShell>
  ),
}

/** Figma "App Shells Menu Bottom / Open=Yes": "Mở rộng" lists the connected apps to the side. */
export const ExtensionsOpen: Story = {
  args: { layout: 'desktop' },
  render: (args) => (
    <AppShell {...args}>
      <RestaurantListPage rows={sampleRows} />
    </AppShell>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Mở rộng' }))
    const app = await within(document.body).findByText('VNPAY-QR')
    await expect(app).toBeInTheDocument()
  },
}

/** The header's search box (or ⌘K / Ctrl+K) opens the Search Modal template. */
export const SearchOpen: Story = {
  args: { layout: 'desktop' },
  render: (args) => (
    <AppShell {...args}>
      <RestaurantListPage rows={sampleRows} />
    </AppShell>
  ),
  play: async () => {
    await userEvent.keyboard('{Control>}k{/Control}')
    await expect(await within(document.body).findByRole('dialog', { name: 'Tìm kiếm tính năng' })).toBeInTheDocument()
  },
}

/** Below `md`: the header switches to Figma "Breakpoint=SM" and the menu button opens the navigation in a Drawer. */
export const Mobile: Story = {
  args: { layout: 'mobile' },
  globals: { viewport: { value: 'mobile1' } },
  render: (args) => (
    <AppShell {...args}>
      <RestaurantListPage rows={sampleRows} />
    </AppShell>
  ),
}

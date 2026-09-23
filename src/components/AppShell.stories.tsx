import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { AppShell } from './AppShell'
import { RestaurantListPage, sampleRows } from './RestaurantListPage'

const meta: Meta<typeof AppShell> = {
  title: 'Templates/AppShell',
  component: AppShell,
  tags: ['ai-generated', 'needs-work'],
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof AppShell>

/** Rebuilt from the Figma frame `Empty Search`. */
export const EmptySearch: Story = {
  render: () => (
    <AppShell>
      <RestaurantListPage />
    </AppShell>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Không tìm thấy dữ liệu')).toBeVisible()
    await expect(canvas.getByRole('button', { name: /tạo nhà hàng/i })).toBeVisible()
  },
}

export const WithRows: Story = {
  render: () => (
    <AppShell>
      <RestaurantListPage rows={sampleRows} />
    </AppShell>
  ),
}

export const LoadingRows: Story = {
  render: () => (
    <AppShell>
      <RestaurantListPage loading />
    </AppShell>
  ),
}

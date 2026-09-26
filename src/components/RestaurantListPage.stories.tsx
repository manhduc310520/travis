import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { RestaurantListPage } from './RestaurantListPage'
import { manyRows, sampleRows } from './restaurantSamples'

const meta: Meta<typeof RestaurantListPage> = {
  title: 'Templates/RestaurantListPage',
  component: RestaurantListPage,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ padding: 'var(--fc-space-padding-base)', background: 'var(--fc-color-background-layout)', minHeight: '100vh' }}><Story /></div>],
}
export default meta
type Story = StoryObj<typeof RestaurantListPage>

/** No restaurants yet: the table's empty state. */
export const Empty: Story = { args: {} }

/** Rows with search (accent-insensitive) and the city filter working. */
export const WithRows: Story = {
  args: { rows: sampleRows },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Tìm nhà hàng' }), 'pho bo')
    await expect(canvas.getByText('Phở bò Hàng Trống')).toBeInTheDocument()
    await expect(canvas.queryByText('Gà rán 365 Lê Lợi')).not.toBeInTheDocument()
  },
}

/** More than one page of rows: pagination under the table. */
export const Paged: Story = { args: { rows: manyRows } }

/** A search with no match: empty state with "Xoá tìm kiếm và bộ lọc". */
export const NoMatch: Story = {
  args: { rows: sampleRows },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Tìm nhà hàng' }), 'zzz')
    await expect(canvas.getByText('Không tìm thấy dữ liệu')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Xoá tìm kiếm và bộ lọc' }))
    await expect(canvas.getByText('Phở bò Hàng Trống')).toBeInTheDocument()
  },
}

/** Loading: rows dimmed under a spinner, table marked busy. */
export const Loading: Story = { args: { rows: sampleRows, loading: true } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { RestaurantListPage, sampleRows } from './RestaurantListPage'

const meta: Meta<typeof RestaurantListPage> = {
  title: 'Templates/RestaurantListPage',
  component: RestaurantListPage,
  tags: ['ai-generated', 'needs-work'],
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof RestaurantListPage>

export const Empty: Story = { args: {} }
export const WithRows: Story = { args: { rows: sampleRows } }
export const Loading: Story = { args: { loading: true } }

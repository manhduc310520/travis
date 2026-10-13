import type { Meta, StoryObj } from '@storybook/react-vite'
import Dashboard from './Dashboard'

const meta: Meta<typeof Dashboard> = {
  title: 'Template/Dashboard',
  component: Dashboard,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

export const Default: StoryObj<typeof Dashboard> = {}

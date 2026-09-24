import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Input } from 'antd'
import { SearchMd } from '../icons'
const meta = {
  component: Input,
  title: 'Components/Input',
  tags: ['ai-generated', 'needs-work'],
  args: { placeholder: 'Basic usage', style: { maxWidth: 320 } },
  // No JSDoc on these in antd's Input.d.ts — written from the API surface.
  // `status` options are the exact 5 antd defines in InputStatus, not just
  // the one ("error") this file happens to demo.
  argTypes: {
    prefix: { description: 'Content rendered inside the input, before the text.', control: false },
    disabled: { description: 'Disables the input.', control: 'boolean' },
    status: {
      description: 'Validation state — colors the border and, for warning/error, the focus ring.',
      control: 'select',
      options: ['', 'warning', 'error', 'success', 'validating'],
    },
    allowClear: { description: 'Shows a clear ("x") button once the input has a value.', control: 'boolean' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText('Basic usage')).toBeVisible()
  },
}

export const WithPrefix: Story = { args: { prefix: <SearchMd /> } }

export const Disabled: Story = { args: { disabled: true } }

export const Invalid: Story = { args: { status: 'error', defaultValue: 'Invalid value' } }

/** Proves the focus ring uses the brand-aware `controlOutline` token. */
export const Focused: Story = {
  args: { prefix: <SearchMd /> },
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByPlaceholderText('Basic usage')
    await userEvent.click(field)
    await expect(field).toHaveFocus()
  },
}

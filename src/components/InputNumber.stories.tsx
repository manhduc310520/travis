import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputNumber, Space } from 'antd'

const meta: Meta<typeof InputNumber> = {
  component: InputNumber,
  title: 'Components/InputNumber',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's input-number types — written from the API.
  argTypes: {
    min: { description: 'Lowest value the input will accept.', control: 'number' },
    step: { description: 'Amount added/removed per arrow-key press or spinner click.', control: 'number' },
    disabled: { description: 'Disables the input.', control: 'boolean' },
    status: { description: 'Validation state — colors the border and focus ring.', control: 'select', options: ['', 'warning', 'error'] },
  },
}
export default meta
type Story = StoryObj<typeof InputNumber>

export const Default: Story = { args: { defaultValue: 45000, min: 0, step: 1000 } }
export const WithSuffix: Story = {
  // `addonAfter` is deprecated in AntD v6 — its own type comment says to wrap
  // the addon in `Space.Compact` instead.
  render: () => (
    <Space.Compact>
      <InputNumber defaultValue={45000} min={0} />
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0 11px',
          border: '1px solid #d9d9d9',
          borderInlineStart: 0,
          borderRadius: '0 6px 6px 0',
          background: '#fafafa',
        }}
      >
        $
      </span>
    </Space.Compact>
  ),
}
export const Disabled: Story = { args: { defaultValue: 45000, disabled: true } }
export const Invalid: Story = { args: { defaultValue: -1, status: 'error' } }

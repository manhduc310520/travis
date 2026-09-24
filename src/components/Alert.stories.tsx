import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, Button, Space } from 'antd'
import { AlertCircle, CheckCircle, InfoCircle, XCircle } from '../icons'

/**
 * Figma's Alert instances use `x-circle-line`, `info-circle-line`,
 * `check-circle-line`, `alert-circle-line` — circular icons, not the
 * triangle/shield glyphs Ant Design defaults to. `showIcon` alone renders the
 * wrong shape; the icon must be passed explicitly per type.
 */
const ICONS = {
  error: <XCircle />,
  info: <InfoCircle />,
  success: <CheckCircle />,
  warning: <AlertCircle />,
} as const

const meta: Meta<typeof Alert> = {
  component: Alert,
  title: 'Components/Alert',
  tags: ['ai-generated', 'needs-work'],
  // Every story below uses a custom `render`, none set `args` — but the
  // Docs page's argTypes table only renders once at least one arg exists
  // (verified: it was silently empty without this). This default is never
  // seen since no story reads args directly; it exists purely so the
  // Controls table has something to display.
  args: { type: 'info', title: 'Info Text', showIcon: true },
  // `type`/`closable`/`title`/`description`/`showIcon` descriptions are
  // antd's own JSDoc from Alert.d.ts, copied as-is. `banner`/`icon` have no
  // JSDoc in antd — written from the API itself, not guessed.
  argTypes: {
    type: {
      description: 'Type of Alert styles.',
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
    },
    title: { description: 'Content of Alert.', control: 'text' },
    description: { description: 'Additional content of Alert.', control: 'text' },
    closable: { description: 'Whether Alert can be closed.', control: 'boolean' },
    showIcon: { description: 'Whether to show icon.', control: 'boolean' },
    banner: { description: 'Renders as a square-cornered banner meant to sit flush at the top of a page.', control: 'boolean' },
    icon: { description: 'Custom icon, only effective when showIcon is true.', control: false },
    variant: { description: 'Visual style: pastel background with a matching border, or a solid fill.', control: 'select', options: ['outlined', 'filled'] },
  },
}
export default meta
type Story = StoryObj<typeof Alert>

export const Types: Story = {
  render: () => (
    <Space orientation="vertical" style={{ maxWidth: 480 }}>
      <Alert type="success" title="Success Text" showIcon icon={ICONS.success} />
      <Alert type="info" title="Info Text" showIcon icon={ICONS.info} />
      <Alert type="warning" title="Warning Text" showIcon icon={ICONS.warning} />
      <Alert type="error" title="Error Text" showIcon icon={ICONS.error} />
    </Space>
  ),
}

/** `variant="filled"` swaps the pastel background for the semantic color's solid text shade. */
export const Filled: Story = {
  render: () => (
    <Space orientation="vertical" style={{ maxWidth: 480 }}>
      <Alert type="success" title="Success Text" showIcon icon={ICONS.success} variant="filled" />
      <Alert type="info" title="Info Text" showIcon icon={ICONS.info} variant="filled" />
      <Alert type="warning" title="Warning Text" showIcon icon={ICONS.warning} variant="filled" />
      <Alert type="error" title="Error Text" showIcon icon={ICONS.error} variant="filled" />
    </Space>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <Space orientation="vertical" style={{ maxWidth: 480 }}>
      <Alert
        type="success"
        title="Success Text"
        description="Detailed description and advice about successful copywriting."
        showIcon
        icon={ICONS.success}
      />
      <Alert
        type="info"
        title="Info Text"
        description="Additional description and information about copywriting."
        showIcon
        icon={ICONS.info}
      />
      <Alert
        type="warning"
        title="Warning Text"
        description="This is a warning notice about copywriting."
        showIcon
        icon={ICONS.warning}
      />
      <Alert
        type="error"
        title="Error Text"
        description="This is an error message about copywriting."
        showIcon
        icon={ICONS.error}
      />
    </Space>
  ),
}

export const Closable: Story = {
  args: { type: 'info', title: 'Closable Alert', showIcon: true, icon: ICONS.info, closable: true, style: { maxWidth: 480 } },
}

/** Figma's `Custom Actions` slot: a text action plus one or two buttons. */
export const WithActions: Story = {
  args: {
    type: 'error',
    showIcon: true,
    icon: ICONS.error,
    title: 'Error Text',
    closable: true,
    style: { maxWidth: 640 },
    action: (
      <Space size={8}>
        <Button size="small" type="primary">Accept</Button>
        <Button size="small" danger>Decline</Button>
      </Space>
    ),
  },
}

/**
 * `Banner: True` in Figma is the same Alert with square corners, meant to sit
 * flush at the top of a page. Shown next to `Banner: False` — the default,
 * rounded card — because that pairing is exactly how the Figma component page
 * presents the variant.
 */
export const Banner: Story = {
  render: () => (
    <Space orientation="vertical" size={16} style={{ maxWidth: 480 }}>
      <div>
        <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>Banner: False</div>
        <Alert type="warning" title="Warning Text" showIcon icon={ICONS.warning} />
      </div>
      <div>
        <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>Banner: True</div>
        <Alert type="warning" title="Warning Text" showIcon icon={ICONS.warning} banner />
      </div>
    </Space>
  ),
}

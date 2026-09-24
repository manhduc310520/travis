import type { Meta, StoryObj } from '@storybook/react-vite'
import { theme, Typography as AntTypography, Space } from 'antd'
import { TokenTable } from './TokenTable'

const { Title, Text, Paragraph, Link } = AntTypography

/** Reads the live resolved sizes so this never drifts from what components actually render with. */
function FontSizes() {
  const { token } = theme.useToken()
  const rows = [
    { token: 'fontSizeHeading1', value: `${token.fontSizeHeading1}px` },
    { token: 'fontSizeHeading2', value: `${token.fontSizeHeading2}px` },
    { token: 'fontSizeHeading3', value: `${token.fontSizeHeading3}px` },
    { token: 'fontSizeLG', value: `${token.fontSizeLG}px` },
    { token: 'fontSize', value: `${token.fontSize}px` },
    { token: 'fontSizeSM', value: `${token.fontSizeSM}px` },
  ]
  return <TokenTable kind="font-size" rows={rows} />
}
// See the identical fix (and full explanation) in Icons.stories.tsx —
// production minification renames this function, breaking "Show code".
FontSizes.displayName = 'FontSizes'

function Headings() {
  return (
    <div>
      <Title level={1} style={{ marginTop: 0 }}>h1. Heading</Title>
      <Title level={2}>h2. Heading</Title>
      <Title level={3}>h3. Heading</Title>
      <Title level={4}>h4. Heading</Title>
      <Title level={5}>h5. Heading</Title>
    </div>
  )
}
Headings.displayName = 'Headings'

function TextVariants() {
  return (
    <Space orientation="vertical">
      <Text>Default text</Text>
      <Text type="secondary">Secondary text</Text>
      <Text type="success">Success text</Text>
      <Text type="warning">Warning text</Text>
      <Text type="danger">Danger text</Text>
      <Text disabled>Disabled text</Text>
      <Text strong>Strong text (600)</Text>
      <Text code>colorPrimary</Text>
      <Link href="#">Link</Link>
    </Space>
  )
}
TextVariants.displayName = 'TextVariants'

function BodyCopy() {
  return (
    <Paragraph style={{ maxWidth: 560 }}>
      FABi CMS is the main admin web app in the iPOS ecosystem. Restaurant owners and their teams use
      it to view revenue reports, edit menus, and handle e-invoices.
    </Paragraph>
  )
}
BodyCopy.displayName = 'BodyCopy'

const meta: Meta<typeof FontSizes> = {
  title: 'Design Tokens/Font',
  component: FontSizes,
  tags: ['ai-generated', 'needs-work'],
}
export default meta
type Story = StoryObj<typeof FontSizes>

export const Sizes: Story = {
  render: () => <FontSizes />,
  // See Icons.stories.tsx's AllIcons for the full explanation of both the
  // `render` (avoids the minification-breaks-source-inference bug) and this
  // pin (keeps "Show code" showing just the render line, not this comment).
  parameters: { docs: { source: { code: '() => <FontSizes />' } } },
}

export const HeadingsStory: Story = {
  name: 'Headings',
  render: () => <Headings />,
  parameters: { docs: { source: { code: '() => <Headings />' } } },
}

export const TextVariantsStory: Story = {
  name: 'Text Variants',
  render: () => <TextVariants />,
  parameters: { docs: { source: { code: '() => <TextVariants />' } } },
}

export const BodyCopyStory: Story = {
  name: 'Body Copy',
  render: () => <BodyCopy />,
  parameters: { docs: { source: { code: '() => <BodyCopy />' } } },
}

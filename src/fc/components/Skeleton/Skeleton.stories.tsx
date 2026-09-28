import { useState, type CSSProperties, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RefreshCw01 } from '../../../icons'
import { Avatar } from '../Avatar/Avatar'
import { Button } from '../Button/Button'
import { Switch } from '../Switch/Switch'
import { Tag } from '../Tag/Tag'
import { Paragraph, Text, Title } from '../Typography/Typography'
import { Skeleton, SkeletonAvatar, SkeletonButton, SkeletonImage, SkeletonInput } from './Skeleton'

const meta = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  args: {
    isLoading: true,
    isActive: false,
    avatar: false,
    title: true,
    paragraph: true,
    input: false,
    images: false,
    button: false,
    round: false,
    label: 'Đang tải…',
  },
  argTypes: {
    avatar: { control: 'boolean' },
    title: { control: 'boolean' },
    paragraph: { control: 'boolean' },
    fallback: { control: false },
    children: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
} satisfies Meta<typeof Skeleton>
export default meta
type Story = StoryObj<typeof meta>

const column: CSSProperties = { display: 'grid', gap: 'var(--fc-space-margin-lg)' }
const row: CSSProperties = { display: 'flex', gap: 'var(--fc-space-margin-base)', alignItems: 'center', flexWrap: 'wrap' }

/** Small caption naming the Figma variant an example shows. */
const Caption = ({ children }: { children: ReactNode }) => <Text tone="secondary" size="sm">{children}</Text>

export const Playground: Story = {}

/** Figma `Skeleton` Type=Basic: title + 3 paragraph rows. */
export const Basic: Story = {}

/** Figma `Skeleton` Type=Complex: Large circle avatar beside the title + 4 rows. */
export const Complex: Story = { args: { avatar: true } }

/** `isActive`: the shimmer sweep (off under prefers-reduced-motion). */
export const Active: Story = { args: { avatar: true, isActive: true } }

/** Row count and widths: `paragraph={{ rows, width }}` (last row, or one per row) and `title={{ width }}`; `round` gives pill ends. */
export const RowsAndWidths: Story = {
  render: () => (
    <div style={column}>
      <Skeleton title={{ width: 200 }} paragraph={{ rows: 2, width: '60%' }} />
      <Skeleton title={false} paragraph={{ rows: 4, width: ['100%', '90%', '75%', '40%'] }} />
      <Skeleton round paragraph={{ rows: 3, width: '50%' }} />
    </div>
  ),
}

/**
 * Figma's seven "Example" layouts: Type Basic / Complex combined with the
 * `Input?`, `Images?` and `Button?` toggles.
 */
export const FigmaExamples: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-xl)' }}>
      {[
        { label: 'Basic', props: {} },
        { label: 'Basic + Input? + Images?', props: { input: true, images: true } },
        { label: 'Complex + Input?', props: { avatar: true, input: true } },
        { label: 'Complex + Input? + Images?', props: { avatar: true, input: true, images: true } },
        { label: 'Complex', props: { avatar: true } },
        { label: 'Basic + Images? + Button?', props: { images: true, button: true } },
        { label: 'Complex + Input? + Button?', props: { avatar: true, input: true, button: true } },
      ].map(({ label, props }) => (
        <div key={label} style={{ display: 'grid', gap: 'var(--fc-space-margin-xs)' }}>
          <Caption>{label}</Caption>
          <Skeleton {...props} label={`Đang tải ví dụ ${label}`} />
        </div>
      ))}
    </div>
  ),
}

/** Figma "Skeleton Button Item": Shape Default / Round / Circle × Size Small / Default / Large (fc Button sizes and radii). */
export const ButtonItem: Story = {
  render: () => (
    <div style={column}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={row}>
          <SkeletonButton size={size} />
          <SkeletonButton size={size} shape="round" />
          <SkeletonButton size={size} shape="circle" />
        </div>
      ))}
      <SkeletonButton block />
    </div>
  ),
}

/** Figma "Skeleton Input Item": Size Small / Default / Large (fc TextField heights and radii). Fills its container unless given a width. */
export const InputItem: Story = {
  render: () => (
    <div style={column}>
      <SkeletonInput size="sm" width={268} />
      <SkeletonInput width={268} />
      <SkeletonInput size="lg" width={268} />
      <SkeletonInput />
    </div>
  ),
}

/** Figma "Skeleton Avatar Item": Shape Circle / Square × Size Small / Default / Large (fc Avatar sizes), plus a px size. */
export const AvatarItem: Story = {
  render: () => (
    <div style={column}>
      {(['circle', 'square'] as const).map((shape) => (
        <div key={shape} style={row}>
          <SkeletonAvatar shape={shape} size="sm" />
          <SkeletonAvatar shape={shape} />
          <SkeletonAvatar shape={shape} size="lg" />
          <SkeletonAvatar shape={shape} size={56} />
        </div>
      ))}
    </div>
  ),
}

/** Figma "Skeleton Image Item": Type Image / Dot Chart (`chart`), 96 × 96 by default. */
export const ImageItem: Story = {
  render: () => (
    <div style={row}>
      <SkeletonImage />
      <SkeletonImage type="chart" />
      <SkeletonImage width={160} height={96} />
    </div>
  ),
}

/** Every element with `isActive`: each block shimmers on its own. */
export const ActiveElements: Story = {
  render: () => (
    <div style={column}>
      <div style={row}>
        <SkeletonAvatar isActive />
        <SkeletonButton isActive />
        <SkeletonButton isActive shape="circle" />
        <SkeletonInput isActive width={200} />
      </div>
      <div style={row}>
        <SkeletonImage isActive />
        <SkeletonImage isActive type="chart" />
      </div>
    </div>
  ),
}

/**
 * `fallback`: a custom placeholder composed from the elements (a dish card
 * in the POS menu). The whole group is announced once as "Đang tải món ăn…" (Loading dishes…).
 */
export const CustomFallback: Story = {
  render: () => (
    <Skeleton
      isActive
      label="Đang tải món ăn…"
      fallback={
        <div style={{ display: 'flex', gap: 'var(--fc-space-margin-base)', alignItems: 'flex-end' }}>
          <SkeletonImage />
          <div style={{ display: 'grid', flex: 1, gap: 'var(--fc-space-margin-sm)' }}>
            <SkeletonInput size="sm" width="60%" />
            <SkeletonInput size="sm" width="30%" />
          </div>
          <SkeletonButton />
        </div>
      }
    />
  ),
}

function StaffCard() {
  return (
    <div style={{ display: 'flex', gap: 'var(--fc-space-margin-base)' }}>
      <Avatar alt="Nguyễn Minh Anh" size="lg" color="blue">MA</Avatar>
      <div style={{ minWidth: 0 }}>
        <Title level={5} style={{ margin: 0 }}>Nguyễn Minh Anh</Title>
        <Paragraph tone="secondary" style={{ margin: 0 }}>
          Thu ngân ca sáng · Chi nhánh Quận 1. Phụ trách mở két, đối soát tiền mặt cuối ca và in báo cáo doanh thu trong ngày.
        </Paragraph>
        <div style={{ marginTop: 'var(--fc-space-margin-xs)' }}><Tag color="green">Đang làm việc</Tag></div>
      </div>
    </div>
  )
}

/**
 * Loading wrapper: `isLoading` shows the placeholder, then the real content.
 * Switch it off to see the staff card; the status element stays mounted, so
 * switching it back on is announced again.
 */
export const LoadingWrapper: Story = {
  render: function Render() {
    const [loading, setLoading] = useState(true)
    return (
      <div style={column}>
        <Switch isSelected={loading} onChange={setLoading}>Đang tải</Switch>
        <Skeleton isLoading={loading} isActive avatar paragraph={{ rows: 2 }}>
          <StaffCard />
        </Skeleton>
      </div>
    )
  },
}

/** A realistic reload: the button fetches again and the skeleton stands in for 1.5 s. */
export const Reload: Story = {
  render: function Render() {
    const [loading, setLoading] = useState(false)
    const reload = () => {
      setLoading(true)
      window.setTimeout(() => setLoading(false), 1500)
    }
    return (
      <div style={column}>
        <div><Button iconStart={<RefreshCw01 />} onPress={reload} isDisabled={loading}>Tải lại</Button></div>
        <Skeleton isLoading={loading} isActive avatar paragraph={{ rows: 2 }}>
          <StaffCard />
        </Skeleton>
      </div>
    )
  },
}

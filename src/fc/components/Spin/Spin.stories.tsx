import { useState, type CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Loading02, RefreshCw01 } from '../../../icons'
import { Button } from '../Button/Button'
import { Switch } from '../Switch/Switch'
import { Tag } from '../Tag/Tag'
import { Text, Title } from '../Typography/Typography'
import { Spin } from './Spin'

const meta = {
  title: 'Components/Spin',
  component: Spin,
  args: { isSpinning: true, size: 'md', tip: '', label: 'Đang tải…', delay: 0, fullscreen: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tip: { control: 'text' },
    indicator: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Spin>
export default meta
type Story = StoryObj<typeof meta>

const row: CSSProperties = { display: 'flex', gap: 'var(--fc-space-margin-xl)', alignItems: 'flex-start', flexWrap: 'wrap' }
const column: CSSProperties = { display: 'grid', gap: 'var(--fc-space-margin-base)', maxWidth: 480 }

export const Playground: Story = {
  render: ({ tip, ...args }) => <Spin {...args} tip={tip || undefined} />,
}

/** Figma `Spin` Size = Small / Medium / Large, `Tip?` = false. */
export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Spin size="sm" />
      <Spin />
      <Spin size="lg" />
    </div>
  ),
}

/** Figma `Tip?` = true at each size ("Loading" → "Đang tải"). */
export const WithTip: Story = {
  render: () => (
    <div style={row}>
      <Spin size="sm" tip="Đang tải" />
      <Spin tip="Đang tải" />
      <Spin size="lg" tip="Đang tải" />
    </div>
  ),
}

/**
 * Figma "Spin / Inside the container": the spinner centred in a tinted
 * block standing in for a region whose content hasn't arrived. Figma's
 * unbound #000 5% maps to Color/Fill/Area, radius Radius/SM, and its
 * 30 × 50 padding snaps to Space/Padding/XL (32).
 */
export const InsideContainer: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        maxWidth: 320,
        padding: 'var(--fc-space-padding-xl)',
        borderRadius: 'var(--fc-radius-sm)',
        background: 'var(--fc-color-fill-area)',
      }}
    >
      <Spin size="sm" tip="Đang tải" />
    </div>
  ),
}

/** Figma `Icon` instance swap (Figma "Spin / SpinningIndicator"): any icon, sized and rotated like the dots. */
export const CustomIndicator: Story = {
  render: () => (
    <div style={row}>
      <Spin size="sm" indicator={<Loading02 />} />
      <Spin indicator={<Loading02 />} />
      <Spin size="lg" indicator={<Loading02 />} tip="Đang tải" />
    </div>
  ),
}

const card: CSSProperties = {
  padding: 'var(--fc-space-padding-lg)',
  border: 'var(--fc-stroke-width-base) solid var(--fc-color-border-neutral)',
  borderRadius: 'var(--fc-radius-lg)',
  background: 'var(--fc-color-background-container)',
}

function OrderCard({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--fc-space-margin-base)' }}>
        <Title level={5} style={{ margin: 0 }}>Đơn #HD-10245 · Bàn 12</Title>
        <Tag color="blue">Đang phục vụ</Tag>
      </div>
      <div style={{ display: 'grid', gap: 'var(--fc-space-margin-xxs)', marginBlock: 'var(--fc-space-margin-base)' }}>
        <Text>2 × Phở bò tái — 130.000 ₫</Text>
        <Text>1 × Trà đá — 5.000 ₫</Text>
        <Text tone="secondary">Ghi chú: ít hành</Text>
      </div>
      <Button iconStart={<RefreshCw01 />} onPress={onRefresh}>Làm mới</Button>
    </div>
  )
}

/**
 * Wrapping content: while `isSpinning`, the card keeps its layout, is dimmed,
 * `aria-busy` and `inert` (no clicks, no Tab stops); the status overlay says
 * the tip. Toggle to see it settle.
 */
export const Nested: Story = {
  render: function Render() {
    const [loading, setLoading] = useState(true)
    return (
      <div style={column}>
        <Switch isSelected={loading} onChange={setLoading}>Đang tải</Switch>
        <Spin isSpinning={loading} tip="Đang cập nhật đơn…">
          <OrderCard />
        </Spin>
      </div>
    )
  },
}

/**
 * Real use: "Làm mới" (Refresh) reloads for 1.5 s. Focus is parked on the status
 * overlay while the card is inert, then returns to the button.
 */
export const NestedReload: Story = {
  render: function Render() {
    const [loading, setLoading] = useState(false)
    const refresh = () => {
      setLoading(true)
      window.setTimeout(() => setLoading(false), 1500)
    }
    return (
      <div style={column}>
        <Spin isSpinning={loading} tip="Đang cập nhật đơn…">
          <OrderCard onRefresh={refresh} />
        </Spin>
      </div>
    )
  },
}

/**
 * `delay={500}`: nothing shows unless loading lasts longer than 0.5 s, so a
 * fast response doesn't flash a spinner. Try both buttons.
 */
export const Delay: Story = {
  render: function Render() {
    const [loading, setLoading] = useState(false)
    const load = (ms: number) => {
      setLoading(true)
      window.setTimeout(() => setLoading(false), ms)
    }
    return (
      <div style={column}>
        <div style={{ display: 'flex', gap: 'var(--fc-space-margin-xs)' }}>
          <Button onPress={() => load(300)}>Tải nhanh (0,3 giây)</Button>
          <Button onPress={() => load(2000)}>Tải chậm (2 giây)</Button>
        </div>
        <Spin isSpinning={loading} delay={500} tip="Đang tải…">
          <OrderCard />
        </Spin>
      </div>
    )
  },
}

/** Fullscreen, open: the mask and elevated panel as they show while blocking the page. */
export const Fullscreen: Story = {
  args: { fullscreen: true, size: 'lg', tip: 'Đang đồng bộ thực đơn…' },
  parameters: {
    // Own iframe on the Docs page, so the mask stays inside its preview.
    docs: { story: { inline: false, iframeHeight: 360 } },
  },
}

/** Fullscreen in use: "Đồng bộ thực đơn" (Sync menu) blocks the whole page for 2 s; focus returns to the button after. */
export const FullscreenInteractive: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 360 } } },
  render: function Render() {
    const [syncing, setSyncing] = useState(false)
    const sync = () => {
      setSyncing(true)
      window.setTimeout(() => setSyncing(false), 2000)
    }
    return (
      <>
        <Button variant="primary" onPress={sync}>Đồng bộ thực đơn</Button>
        <Spin fullscreen isSpinning={syncing} size="lg" tip="Đang đồng bộ thực đơn…" />
      </>
    )
  },
}

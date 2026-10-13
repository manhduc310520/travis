import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '../../../icons'
import { cx } from '../../space'
import { Splitter, SplitterPanel } from './Splitter'
import styles from './Splitter.module.css'

const meta: Meta<typeof Splitter> = {
  title: 'Components/Layout/Splitter',
  component: Splitter,
  args: { orientation: 'vertical' },
  argTypes: {
    orientation: {
      description: 'Figma `Orientation`: direction of the bars. `vertical` puts panels side by side, `horizontal` stacks them.',
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
  },
}
export default meta
type Story = StoryObj<typeof Splitter>

/** Demo frame the size of the Figma examples (700 × 300 on Background/Container). */
const frame: CSSProperties = {
  height: 300,
  maxWidth: 700,
  border: 'var(--fc-stroke-width-base) solid var(--fc-color-border-neutral-faded)',
  background: 'var(--fc-color-background-container)',
}

/** Centred label filling a panel, as in the Figma examples (Heading/5, Content/Description). */
const Desc = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 'var(--fc-space-padding-md)',
      color: 'var(--fc-color-content-description)',
      fontSize: 'var(--fc-typography-size-heading-5)',
      lineHeight: 'var(--fc-typography-line-height-heading-5)',
      fontWeight: 'var(--fc-typography-weight-semibold)',
      textAlign: 'center',
    }}
  >
    {children}
  </div>
)

/**
 * Figma example "Vertical" (`Orientation=Vertical`, `Collapsible` on): an
 * upright bar between two panels side by side. Drag it, or focus it and use
 * the arrow keys; the ‹ › buttons fold a panel away and bring it back.
 */
export const Vertical: Story = {
  render: (args) => (
    <Splitter {...args} style={frame}>
      <SplitterPanel defaultSize="40%" min="20%" max="70%" collapsible><Desc>Danh mục món</Desc></SplitterPanel>
      <SplitterPanel collapsible><Desc>Chi tiết món: Phở bò tái — 55.000 ₫</Desc></SplitterPanel>
    </Splitter>
  ),
}

/** Figma example "Horizontal" (`Orientation=Horizontal`, `Collapsible` on): a flat bar between stacked panels, with ˄ ˅ buttons. */
export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <Splitter {...args} style={frame}>
      <SplitterPanel collapsible><Desc>Đơn đang phục vụ</Desc></SplitterPanel>
      <SplitterPanel collapsible><Desc>Đơn đã thanh toán</Desc></SplitterPanel>
    </Splitter>
  ),
}

/** Figma example "Multiple Panels": three collapsible panels with two bars. */
export const MultiplePanels: Story = {
  render: (args) => (
    <Splitter {...args} style={frame}>
      <SplitterPanel collapsible><Desc>Khu vực</Desc></SplitterPanel>
      <SplitterPanel collapsible><Desc>Bàn</Desc></SplitterPanel>
      <SplitterPanel collapsible><Desc>Món đã gọi</Desc></SplitterPanel>
    </Splitter>
  ),
}

/** Figma example "Complex": an upright bar whose right panel is split again by a flat bar. */
export const Complex: Story = {
  render: (args) => (
    <Splitter {...args} style={frame}>
      <SplitterPanel collapsible><Desc>Thực đơn</Desc></SplitterPanel>
      <SplitterPanel collapsible>
        <Splitter orientation="horizontal">
          <SplitterPanel collapsible><Desc>Món mới</Desc></SplitterPanel>
          <SplitterPanel collapsible><Desc>Món bán chạy</Desc></SplitterPanel>
        </Splitter>
      </SplitterPanel>
    </Splitter>
  ),
}

/** Figma `Collapsible` off: the bar only resizes, without collapse buttons. */
export const NotCollapsible: Story = {
  render: (args) => (
    <Splitter {...args} style={frame}>
      <SplitterPanel defaultSize="30%" min="20%"><Desc>Bộ lọc: Chi nhánh Quận 1, 28/09/2026</Desc></SplitterPanel>
      <SplitterPanel><Desc>Doanh thu hôm nay: 12.450.000 ₫</Desc></SplitterPanel>
    </Splitter>
  ),
}

/**
 * Figma bar dragger `State=Disabled` (`resizable={false}`): the trigger is
 * hidden and the bar cannot move. Collapse buttons still work and join the
 * Tab order, since the bar itself cannot take focus.
 */
export const Disabled: Story = {
  render: (args) => (
    <Splitter {...args} style={frame}>
      <SplitterPanel defaultSize="40%" resizable={false}><Desc>Hóa đơn #HD-00125</Desc></SplitterPanel>
      <SplitterPanel collapsible><Desc>Tổng cộng: 245.000 ₫</Desc></SplitterPanel>
    </Splitter>
  ),
}

type BarState = 'Default' | 'Hover' | 'Active' | 'Disabled'

/** Static copy of a bar in one Figma state, drawn with the component's own classes. */
function BarPreview({ orientation, state, buttons }: { orientation: 'vertical' | 'horizontal'; state: BarState; buttons?: Exclude<BarState, 'Disabled'> }) {
  const vertical = orientation === 'vertical'
  const button = buttons && {
    'data-hovered': buttons !== 'Default' || undefined,
    'data-pressed': buttons === 'Active' || undefined,
  }
  const StartIcon = vertical ? ChevronLeft : ChevronUp
  const EndIcon = vertical ? ChevronRight : ChevronDown
  return (
    <div style={{ display: 'grid', placeItems: 'center', width: 136, height: 136 }}>
      <div className={styles.bar} data-orientation={orientation} style={vertical ? { height: 120 } : { width: 120 }}>
        <div
          className={styles.handle}
          style={{ cursor: 'default' }}
          data-hovered={state === 'Hover' || state === 'Active' || undefined}
          data-dragging={state === 'Active' || undefined}
          data-disabled={state === 'Disabled' || undefined}
        >
          <span className={styles.trigger} />
        </div>
        {button && (
          <>
            <span className={cx(styles.collapse, styles.start)} {...button}><StartIcon aria-hidden="true" /></span>
            <span className={cx(styles.collapse, styles.end)} {...button}><EndIcon aria-hidden="true" /></span>
          </>
        )}
      </div>
    </div>
  )
}

const caption: CSSProperties = { margin: 0, color: 'var(--fc-color-content-description)', fontSize: 'var(--fc-typography-size-sm)', textAlign: 'center' }

function StateGrid() {
  const bars: BarState[] = ['Default', 'Hover', 'Active', 'Disabled']
  const buttons: Exclude<BarState, 'Disabled'>[] = ['Default', 'Hover', 'Active']
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--fc-space-margin-lg)' }}>
      {(['light', 'dark'] as const).map((mode) => (
        <div
          key={mode}
          data-mode={mode}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, auto)',
            gap: 'var(--fc-space-margin-xs)',
            padding: 'var(--fc-space-padding-lg)',
            borderRadius: 'var(--fc-radius-lg)',
            background: 'var(--fc-color-background-container)',
          }}
        >
          {bars.map((s) => <p key={s} style={caption}>Bar Dragger: {s}</p>)}
          {bars.map((s) => <BarPreview key={s} orientation="vertical" state={s} />)}
          {bars.map((s) => <BarPreview key={s} orientation="horizontal" state={s} />)}
          {buttons.map((s) => <p key={s} style={caption}>Collapse Button: {s}</p>)}
          <span />
          {buttons.map((s) => <BarPreview key={s} orientation="vertical" state="Default" buttons={s} />)}
          <span />
          {buttons.map((s) => <BarPreview key={s} orientation="horizontal" state="Default" buttons={s} />)}
          <span />
        </div>
      ))}
    </div>
  )
}

/**
 * Figma state grids, Light and Dark, drawn statically so they show without
 * interaction. Top: `Splitter / Bar Dragger` Orientation=Vertical | Horizontal
 * × State=Default | Hover | Active | Disabled. Bottom: `Splitter / Collapse
 * Button` Direction=Left / Right and Up / Down × State=Default | Hover | Active.
 */
export const States: Story = {
  render: () => <StateGrid />,
}

/** Figma "Dark Mode" copy of the examples: the Complex layout inside a `data-mode="dark"` region. */
export const Dark: Story = {
  render: (args) => (
    <div data-mode="dark" style={{ padding: 'var(--fc-space-padding-lg)', background: 'var(--fc-color-background-layout)' }}>
      <Splitter {...args} style={frame}>
        <SplitterPanel collapsible><Desc>Thực đơn</Desc></SplitterPanel>
        <SplitterPanel collapsible>
          <Splitter orientation="horizontal">
            <SplitterPanel collapsible><Desc>Món mới</Desc></SplitterPanel>
            <SplitterPanel collapsible><Desc>Món bán chạy</Desc></SplitterPanel>
          </Splitter>
        </SplitterPanel>
      </Splitter>
    </div>
  ),
}

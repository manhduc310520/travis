import { useState, type CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FcTheme } from '../../FcTheme'
import type { FcBrand, FcDensity } from '../../axes'
import { ColorPicker, type ColorPickerPreset, type ColorPickerStop, type ColorPickerValue } from './ColorPicker'
import { gradientToCss } from './gradient'

/** Figma "Recommended": neutrals, the bright palette, then the same palette at 30% alpha. */
const suggested: ColorPickerPreset = {
  label: 'Đề xuất',
  colors: [
    '#000000', '#000000E0', '#000000A6', '#00000073', '#00000040', '#00000026', '#0000001A', '#00000012', '#0000000A', '#00000005',
    '#F5222D', '#FA8C16', '#FADB14', '#8BBB11', '#52C41A', '#13A8A8', '#1677FF', '#2F54EB', '#722ED1', '#EB2F96',
    '#F5222D4D', '#FA8C164D', '#FADB144D', '#8BBB114D', '#52C41A4D', '#13A8A84D', '#1677FF4D', '#2F54EB4D', '#722ED14D', '#EB2F964D',
  ],
}
/** Figma "Recent", empty: shows the empty line. */
const recent: ColorPickerPreset = { label: 'Gần đây', colors: [] }
const figmaPresets = [suggested, recent]

/** Figma Gradient=True sample: the two handles of the gradient slider. */
const bannerGradient: ColorPickerStop[] = [
  { color: '#108EE9', offset: 0 },
  { color: '#87D068', offset: 100 },
]

const row: CSSProperties = { display: 'flex', gap: 'var(--fc-space-padding-sm)', alignItems: 'center' }
/** Room for a panel that is open on first render. */
const stage: CSSProperties = { minHeight: 'calc(var(--fc-size-control-lg) * 14)' }

const meta = {
  title: 'Components/Data Entry/ColorPicker',
  component: ColorPicker,
  args: { defaultValue: '#1677FF', size: 'md', showText: false, showIcon: false, allowClear: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    mode: {
      control: 'inline-radio',
      options: ['single', 'gradient', 'both'],
      mapping: { both: ['single', 'gradient'] },
    },
    defaultFormat: { control: 'inline-radio', options: ['hex', 'rgb', 'hsb'] },
    direction: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    placement: {
      control: 'select',
      options: ['bottom start', 'bottom', 'top start', 'top', 'right', 'left'],
    },
  },
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

/** Figma docs example 1 — trigger State=Default, Size=Medium: the swatch alone. */
export const Default: Story = {}

/** Figma docs example 2 — trigger "Show Text?": the value next to the swatch. */
export const ShowText: Story = { args: { showText: true } }

/** Figma docs example 3 — trigger "Show Icon?": a chevron after the swatch (points up while open). */
export const ShowIcon: Story = { args: { showIcon: true } }

/** Figma trigger Size = Small / Medium / Large × "Show Text?" / "Show Icon?", and State=Disabled per size. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-padding-sm)' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={row}>
          <ColorPicker {...args} size={size} />
          <ColorPicker {...args} size={size} showText />
          <ColorPicker {...args} size={size} showIcon />
          <ColorPicker {...args} size={size} showText showIcon />
          <ColorPicker {...args} size={size} showText isDisabled />
        </div>
      ))}
    </div>
  ),
}

/** Figma trigger State=Disabled. */
export const Disabled: Story = { args: { isDisabled: true, showText: true, showIcon: true } }

/**
 * Figma docs example 4 — ColorPicker Active=Yes: the trigger turns accent and
 * the popup opens (Direction=Vertical, Gradient=False) with Allow Clear,
 * Arrow and the two preset groups ("Gần đây" is empty).
 */
export const Open: Story = {
  args: { allowClear: true, presets: figmaPresets, defaultOpen: true },
  render: (args) => <div style={stage}><ColorPicker {...args} /></div>,
}

/** Figma docs example 5 — popup Direction=Horizontal: presets on the left, picker on the right. */
export const Horizontal: Story = {
  args: { allowClear: true, presets: figmaPresets, direction: 'horizontal', defaultOpen: true },
  render: (args) => <div style={stage}><ColorPicker {...args} /></div>,
}

/**
 * Figma popup Gradient=True (Direction=Vertical) — "Segmented?" on: the
 * Single / Gradient switch, then the gradient bar. Click the bar to add a
 * stop, drag a handle or use the arrow keys to move it, Delete to remove it;
 * the area, sliders and inputs edit the selected stop.
 */
export const Gradient: Story = {
  args: {
    mode: ['single', 'gradient'],
    defaultValue: bannerGradient,
    allowClear: true,
    presets: figmaPresets,
    showText: true,
    defaultOpen: true,
  },
  render: (args) => <div style={stage}><ColorPicker {...args} /></div>,
}

/** Figma docs example 6 — popup Direction=Horizontal, Gradient=True. */
export const HorizontalGradient: Story = {
  args: {
    mode: ['single', 'gradient'],
    defaultValue: bannerGradient,
    allowClear: true,
    presets: figmaPresets,
    direction: 'horizontal',
    defaultOpen: true,
  },
  render: (args) => <div style={stage}><ColorPicker {...args} /></div>,
}

/**
 * Figma popup Format = Color Select RGB (also HEX / HSB): pick the format in
 * the select; each channel and the alpha % are editable. The trigger text
 * follows the format.
 */
export const Formats: Story = {
  args: { defaultFormat: 'rgb', showText: true, defaultOpen: true },
  render: (args) => <div style={stage}><ColorPicker {...args} /></div>,
}

/** Figma popup "Allow Clear?": the value is cleared ("no colour" swatch, "Chưa chọn màu"). */
export const AllowClear: Story = {
  args: { allowClear: true, showText: true, defaultValue: null },
}

/** Presets folded at first (`defaultOpen: false` on a group): the chevron points at the label. */
export const PresetsCollapsed: Story = {
  args: {
    presets: [{ ...suggested, defaultOpen: false }, { label: 'Màu thương hiệu', colors: ['#E4002B', '#FFC72C', '#00704A', '#1677FF'] }],
    defaultValue: '#00704A',
    defaultOpen: true,
  },
  render: (args) => <div style={stage}><ColorPicker {...args} /></div>,
}

/** Solid colours only (no alpha slider or alpha input), e.g. a menu category colour. */
export const NoAlpha: Story = {
  args: { showAlpha: false, defaultOpen: true },
  render: (args) => <div style={stage}><ColorPicker {...args} /></div>,
}

/** Figma popup Arrow=False: the panel sits 4px from the trigger. */
export const NoArrow: Story = {
  args: { showArrow: false, defaultOpen: true },
  render: (args) => <div style={stage}><ColorPicker {...args} /></div>,
}

function ControlledDemo(args: Story['args']) {
  const [color, setColor] = useState<ColorPickerValue>('#13C2C2')
  const fill = color == null ? undefined : Array.isArray(color) ? gradientToCss(color) : typeof color === 'string' ? color : color.toString('css')
  return (
    <div style={{ display: 'grid', gap: 'var(--fc-space-padding-sm)' }}>
      <div style={row}>
        <span>Màu nhóm món “Đồ uống”:</span>
        <ColorPicker
          {...args}
          value={color}
          onChange={setColor}
          mode={['single', 'gradient']}
          showText
          allowClear
          presets={figmaPresets}
        />
      </div>
      <div
        style={{
          width: 'calc(var(--fc-size-control-lg) * 6)',
          padding: 'var(--fc-space-padding-sm)',
          borderRadius: 'var(--fc-radius-lg)',
          border: 'var(--fc-stroke-width-base) solid var(--fc-color-border-neutral-faded)',
          background: fill ?? 'var(--fc-color-background-container)',
        }}
      >
        <span style={{ padding: 'var(--fc-space-padding-xxs) var(--fc-space-padding-xs)', borderRadius: 'var(--fc-radius-sm)', background: 'var(--fc-color-background-container)' }}>
          Đồ uống · 12 món
        </span>
      </div>
    </div>
  )
}

/** Controlled use: the colour (or gradient) of a menu category tile on the POS menu screen. */
export const Controlled: Story = { render: (args) => <ControlledDemo {...args} /> }

/**
 * Figma "Dark Mode" copy of the examples: the open picker inside a Dark
 * theme. A nested FcTheme is used (not only `data-mode`) because the panel
 * renders in a portal, which FcTheme themes too.
 */
export const Dark: Story = {
  args: { allowClear: true, presets: figmaPresets, showText: true, defaultOpen: true },
  render: (args, { globals }) => (
    <FcTheme
      mode="dark"
      brand={(globals.brand ?? 'blue') as FcBrand}
      density={(globals.density ?? 'default') as FcDensity}
      style={{ ...stage, padding: 'var(--fc-space-padding-lg)', borderRadius: 'var(--fc-radius-lg)', background: 'var(--fc-color-background-layout)' }}
    >
      <ColorPicker {...args} />
    </FcTheme>
  ),
}

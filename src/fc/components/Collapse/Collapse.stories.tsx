import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'
import type { Key } from 'react-aria-components'
import { Minus, Plus, Settings01 } from '../../../icons'
import { Button } from '../Button/Button'
import { Switch } from '../Switch/Switch'
import { Collapse, type CollapseItem, type CollapseSize } from './Collapse'

const text = (t: string) => <p style={{ margin: 0 }}>{t}</p>

const items: CollapseItem[] = [
  { key: 'info', label: 'Thông tin nhà hàng', content: text('Tên, địa chỉ, số điện thoại và mã số thuế in trên hoá đơn.') },
  { key: 'hours', label: 'Giờ mở cửa', content: text('Thứ 2 – Chủ nhật, 10:00 – 22:00. Ngày lễ mở cửa đến 23:00.') },
  { key: 'payment', label: 'Phương thức thanh toán', content: text('Tiền mặt, thẻ ngân hàng, ví MoMo và chuyển khoản QR.') },
  { key: 'printer', label: 'Máy in bếp', content: text('Máy in nhiệt 80 mm tại quầy bếp nóng, in phiếu chế biến theo món.') },
]

const meta = {
  title: 'Components/Data Display/Collapse',
  component: Collapse,
  args: { items, defaultExpandedKeys: ['info'], variant: 'outlined', size: 'md', expandIconPosition: 'start', allowsMultipleExpanded: true, isDisabled: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outlined', 'borderless', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    expandIconPosition: { control: 'inline-radio', options: ['start', 'end'] },
    items: { control: false },
    expandIcon: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
} satisfies Meta<typeof Collapse>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-xl)' } as const
const caption = {
  marginBottom: 'var(--fc-space-margin-xxs)',
  color: 'var(--fc-color-content-description)',
  fontSize: 'var(--fc-typography-size-sm)',
  lineHeight: 'var(--fc-typography-line-height-sm)',
} as const

function Captioned({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={caption}>{label}</div>
      {children}
    </div>
  )
}

const SIZES: [CollapseSize, string][] = [['sm', 'Small'], ['md', 'Default'], ['lg', 'Large']]

export const Playground: Story = {}

/** Figma `Collapse` Type=Basic, Size=Default. */
export const Outlined: Story = {}

/** Figma `Collapse` Type=Borderless: no outer border, a tinted block; panels keep their dividers. */
export const Borderless: Story = { args: { variant: 'borderless' } }

/** Figma `Collapse` Type=Ghost: no border, no fill — the panels sit on the parent surface. */
export const Ghost: Story = { args: { variant: 'ghost' } }

/** Figma `Collapse` Size: Small, Default, Large, for each Type. */
export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      {(['outlined', 'borderless', 'ghost'] as const).map((variant) =>
        SIZES.map(([size, label]) => (
          <Captioned key={`${variant}-${size}`} label={`Type=${variant}, Size=${label}`}>
            <Collapse {...args} variant={variant} size={size} items={items.slice(0, 3)} />
          </Captioned>
        )),
      )}
    </div>
  ),
}

/** Accordion (`allowsMultipleExpanded={false}`): opening one panel closes the others. */
export const Accordion: Story = { args: { allowsMultipleExpanded: false } }

/** Figma item `Expand Icon Placement`=Right (`end`). */
export const IconAtEnd: Story = { args: { expandIconPosition: 'end' } }

/** A custom expand icon (plus / minus). It replaces the rotating chevron, so it draws both states. */
export const CustomIcon: Story = {
  args: { expandIcon: ({ isExpanded }) => (isExpanded ? <Minus /> : <Plus />) },
}

/** Figma item `Disabled`: the header greys out and can't be toggled. */
export const DisabledItem: Story = {
  args: {
    items: items.map((item) => (item.key === 'payment' ? { ...item, label: 'Phương thức thanh toán (gói Pro)', isDisabled: true } : item)),
  },
}

/**
 * Figma item `Extra Node`: actions at the end of the header. They sit outside
 * the toggle button, so pressing them (pointer or keyboard) never toggles the panel.
 */
function ExtraDemo() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ printer: true, kds: false })
  const extra = (key: string, name: string) => (
    <>
      <Switch size="sm" aria-label={`Bật ${name}`} isSelected={enabled[key]} onChange={(v) => setEnabled((s) => ({ ...s, [key]: v }))} />
      <Button variant="text" size="sm" iconStart={<Settings01 />} aria-label={`Cài đặt ${name}`} />
    </>
  )
  return (
    <Collapse
      defaultExpandedKeys={['printer']}
      items={[
        { key: 'printer', label: 'Máy in bếp', extra: extra('printer', 'máy in bếp'), content: text('In phiếu chế biến theo món, khổ 80 mm.') },
        { key: 'kds', label: 'Màn hình bếp (KDS)', extra: extra('kds', 'màn hình bếp'), content: text('Hiển thị đơn mới và thời gian chờ của từng món.') },
      ]}
    />
  )
}

export const Extra: Story = {
  render: () => <ExtraDemo />,
  parameters: { docs: { source: { code: '() => <ExtraDemo />' } } },
}

/** A Collapse inside a panel keeps its own type and size. */
export const Nested: Story = {
  args: {
    defaultExpandedKeys: ['menu'],
    items: [
      {
        key: 'menu',
        label: 'Thực đơn',
        content: (
          <Collapse
            variant="borderless"
            size="sm"
            defaultExpandedKeys={['pho']}
            items={[
              { key: 'pho', label: 'Món nước', content: text('Phở bò, bún bò Huế, hủ tiếu Nam Vang.') },
              { key: 'rice', label: 'Cơm', content: text('Cơm tấm sườn, cơm gà Hội An.') },
            ]}
          />
        ),
      },
      { key: 'drinks', label: 'Đồ uống', content: text('Trà đá, cà phê sữa đá, nước mía.') },
    ],
  },
}

/** Controlled: `expandedKeys` + `onExpandedChange`, with buttons outside that open or close everything. */
function ControlledDemo() {
  const [expanded, setExpanded] = useState<Set<Key>>(new Set(['hours']))
  return (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-base)' }}>
      <div style={{ display: 'flex', gap: 'var(--fc-space-margin-xs)' }}>
        <Button size="sm" onPress={() => setExpanded(new Set(items.map((i) => i.key)))}>Mở tất cả</Button>
        <Button size="sm" onPress={() => setExpanded(new Set())}>Đóng tất cả</Button>
      </div>
      <Collapse items={items} expandedKeys={expanded} onExpandedChange={setExpanded} />
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: { docs: { source: { code: '() => <ControlledDemo />' } } },
}

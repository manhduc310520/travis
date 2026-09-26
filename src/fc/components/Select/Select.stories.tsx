import type { Meta, StoryObj } from '@storybook/react-vite'
import { Building02, Tag01 } from '../../../icons'
import { Select, type SelectOption } from './Select'

const CITIES: SelectOption[] = [
  { key: 'hn', label: 'Hà Nội' },
  { key: 'hcm', label: 'TP. Hồ Chí Minh' },
  { key: 'dn', label: 'Đà Nẵng' },
  { key: 'hp', label: 'Hải Phòng' },
  { key: 'ct', label: 'Cần Thơ', isDisabled: true },
]

const DISHES: SelectOption[] = [
  { type: 'group', key: 'noodle', label: 'Món nước', children: [{ key: 'pho', label: 'Phở bò' }, { key: 'bun', label: 'Bún bò Huế' }, { key: 'hu-tieu', label: 'Hủ tiếu Nam Vang' }] },
  { type: 'group', key: 'rice', label: 'Cơm', children: [{ key: 'com-tam', label: 'Cơm tấm sườn' }, { key: 'com-ga', label: 'Cơm gà Hội An' }] },
  { type: 'group', key: 'drink', label: 'Đồ uống', children: [{ key: 'tra-da', label: 'Trà đá' }, { key: 'ca-phe', label: 'Cà phê sữa đá' }] },
]

const meta = {
  title: 'Components/Select',
  component: Select,
  args: { label: 'Thành phố', options: CITIES, placeholder: 'Chọn thành phố', size: 'md', variant: 'outlined' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outlined', 'filled', 'borderless', 'underlined'] },
    status: { control: 'inline-radio', options: [undefined, 'error', 'warning'] },
    selectionMode: { control: 'inline-radio', options: ['single', 'multiple'] },
    placement: { control: 'inline-radio', options: ['bottom', 'top'] },
    options: { control: false },
  },
  // React Aria caps the menu at the space left inside <body>; the extra height
  // keeps open menus from being cut short in the story frame.
  decorators: [(Story) => <div style={{ width: 320, minHeight: 360 }}><Story /></div>],
} satisfies Meta<typeof Select>
export default meta
type Story = StoryObj<typeof meta>

const column = { display: 'grid', gap: 'var(--fc-space-margin-base)', width: 320 } as const

export const Playground: Story = {}

/** Figma Select Active=Yes, Placement=Bottom: menu open with group titles and the selected row tinted. */
export const Open: Story = { args: { label: 'Món', options: DISHES, defaultValue: 'pho', defaultOpen: true, placeholder: 'Chọn món' } }

/** Figma Placement=Top. */
export const OpenTop: Story = {
  args: { label: 'Món', options: DISHES, defaultValue: 'pho', defaultOpen: true, placement: 'top', placeholder: 'Chọn món' },
  decorators: [(Story) => <div style={{ paddingTop: 280 }}><Story /></div>],
}

/** Figma Select Input: Outlined / Filled / Borderless / Underlined. */
export const Variants: Story = {
  render: (args) => (
    <div style={column}>
      {(['outlined', 'filled', 'borderless', 'underlined'] as const).map((v) => (
        <Select key={v} {...args} variant={v} label={v} defaultValue="hn" />
      ))}
    </div>
  ),
}

/** Figma Status: Error / Warning (error is announced as invalid). */
export const Status: Story = {
  render: (args) => (
    <div style={column}>
      <Select {...args} status="error" errorMessage="Vui lòng chọn thành phố" />
      <Select {...args} status="warning" defaultValue="dn" description="Chi nhánh Đà Nẵng đang tạm đóng" />
    </div>
  ),
}

/** Figma Size: Small / Default / Large. */
export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      {(['sm', 'md', 'lg'] as const).map((s) => <Select key={s} {...args} size={s} label={`Cỡ ${s}`} defaultValue="hcm" />)}
    </div>
  ),
}

/** Figma Type=Multiple: removable tags; the menu stays open and shows a check on selected rows. */
export const Multiple: Story = {
  args: { label: 'Món trong combo', selectionMode: 'multiple', options: DISHES, defaultValue: ['pho', 'tra-da'], placeholder: 'Chọn món', allowClear: true },
}

/** Multiple in the three sizes (tag height 16 / 24 / 32). */
export const MultipleSizes: Story = {
  render: (args) => (
    <div style={column}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Select key={s} {...args} size={s} label={`Cỡ ${s}`} selectionMode="multiple" options={DISHES} defaultValue={['pho', 'com-tam']} />
      ))}
    </div>
  ),
}

/** Figma "Max count": at most 2 can be chosen — the rest turn disabled. `maxTagCount` collapses extra tags into "+N". */
export const MaxCount: Story = {
  render: (args) => (
    <div style={column}>
      <Select {...args} label="Tối đa 2 món" selectionMode="multiple" options={DISHES} maxCount={2} defaultValue={['pho']} />
      <Select {...args} label="Hiện 2 thẻ, còn lại +N" selectionMode="multiple" options={DISHES} maxTagCount={2} defaultValue={['pho', 'bun', 'com-ga', 'tra-da']} />
    </div>
  ),
}

/** Figma Type=Search: type in the box to filter. */
export const Search: Story = {
  args: { label: 'Món', options: DISHES, showSearch: true, placeholder: 'Gõ tên món', allowClear: true },
}

/** Figma "Prefix": icon or short text inside the box. */
export const WithPrefix: Story = {
  render: (args) => (
    <div style={column}>
      <Select {...args} label="Chi nhánh" prefix={<Building02 />} defaultValue="hn" />
      <Select {...args} label="Loại" prefix="Loại:" options={[{ key: 'a', label: 'Món chính' }, { key: 'b', label: 'Tráng miệng' }]} defaultValue="a" />
      <Select {...args} label="Nhãn" prefix={<Tag01 />} selectionMode="multiple" options={DISHES} defaultValue={['pho']} />
    </div>
  ),
}

/** Clear button (×) while hovered or focused; disabled box and disabled option. */
export const ClearAndDisabled: Story = {
  render: (args) => (
    <div style={column}>
      <Select {...args} label="Có nút xóa" allowClear defaultValue="hp" />
      <Select {...args} label="Vô hiệu" isDisabled defaultValue="hn" />
      <Select {...args} label="Vô hiệu (nhiều)" isDisabled selectionMode="multiple" options={DISHES} defaultValue={['pho', 'bun']} />
    </div>
  ),
}

/** Figma menu "Empty". */
export const EmptyMenu: Story = { args: { label: 'Bàn trống', options: [], defaultOpen: true, placeholder: 'Không có bàn' } }

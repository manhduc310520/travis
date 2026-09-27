import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import { BookOpen01, Building02, ChevronRight, Home01 } from '../../../icons'
import { Dropdown } from '../Dropdown/Dropdown'
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb'

const basic: BreadcrumbItem[] = [
  { label: 'Trang chủ', href: '#' },
  { label: 'Chuỗi nhà hàng', href: '#' },
  { label: 'Chi nhánh Quận 1', href: '#' },
  { label: 'Thực đơn' },
]

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  args: { items: basic, separator: '/', isDisabled: false },
  argTypes: {
    items: { control: false },
    separator: { control: 'text' },
    renderItem: { control: false },
  },
} satisfies Meta<typeof Breadcrumb>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/**
 * Figma Type=Basic. Link State=Default on the earlier items, State=Current on
 * the last one (the page you are on: text with `aria-current="page"`, not a link).
 */
export const Basic: Story = {}

/** Figma link State=Hover: the "Chuỗi nhà hàng" (Restaurant chain) link is hovered on load — background + Content-Current colour. */
export const Hover: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole('link', { name: 'Chuỗi nhà hàng' }))
  },
}

/**
 * Figma Type=Icon, both link `Icon?` / `Label?` combinations: an icon-only
 * home link (named "Trang chủ", Home, for assistive tech), then icon + label items.
 */
export const WithIcon: Story = {
  args: {
    items: [
      { icon: <Home01 />, 'aria-label': 'Trang chủ', href: '#' },
      { icon: <Building02 />, label: 'Chi nhánh Quận 1', href: '#' },
      { icon: <BookOpen01 />, label: 'Thực đơn' },
    ],
  },
}

/** Custom `separator` — any node; always hidden from screen readers. */
export const CustomSeparator: Story = {
  args: { separator: <ChevronRight /> },
}

/** `isDisabled`: every link is inert (e.g. while a form has unsaved changes). */
export const Disabled: Story = {
  args: { isDisabled: true },
}

/** Figma Type=Dropdown: an item that opens a menu of sibling pages (fc Dropdown in `menu`). */
export const WithDropdown: Story = {
  args: {
    items: [
      { key: 'home', label: 'Trang chủ', href: '#' },
      {
        key: 'branch',
        label: 'Chi nhánh Hà Nội',
        menu: (trigger) => (
          <Dropdown
            aria-label="Chuyển chi nhánh"
            selectionMode="single"
            defaultSelectedKeys={['hn']}
            items={[
              { key: 'hn', label: 'Chi nhánh Hà Nội' },
              { key: 'hcm', label: 'Chi nhánh TP. Hồ Chí Minh' },
              { key: 'dn', label: 'Chi nhánh Đà Nẵng' },
            ]}
          >
            {trigger}
          </Dropdown>
        ),
      },
      { key: 'menu', label: 'Thực đơn' },
    ],
  },
}

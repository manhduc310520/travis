import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { AppHeader } from './AppHeader'

const meta = {
  title: 'Templates/AppHeader',
  component: AppHeader,
  // Full-bleed: the header is an edge-to-edge bar wherever it is used
  // (AppShell renders this exact component).
  parameters: { layout: 'fullscreen' },
  args: {
    onMenuClick: fn(),
    onSearchOpen: fn(),
    onAiClick: fn(),
    onLanguageChange: fn(),
    onAccountChange: fn(),
    onAccountSettings: fn(),
    onLogout: fn(),
    onManageInbox: fn(),
  },
  argTypes: {
    layout: { control: 'inline-radio', options: ['auto', 'desktop', 'mobile'] },
  },
} satisfies Meta<typeof AppHeader>

export default meta
type Story = StoryObj<typeof meta>

/** Figma "*Navbar / Breakpoint=LG, Type = Logo": wordmark, search (⌘K), AI, language, inbox, account. */
export const Default: Story = {
  args: { layout: 'desktop' },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText('Chanh dev')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Tìm kiếm' }))
    await expect(args.onSearchOpen).toHaveBeenCalledTimes(1)
    await userEvent.keyboard('{Control>}k{/Control}')
    await expect(args.onSearchOpen).toHaveBeenCalledTimes(2)
  },
}

/** Figma "Breakpoint=LG, Type = Title": back arrow and page title in place of the logo. */
export const PageTitle: Story = {
  args: { layout: 'desktop', title: 'Hóa đơn điện tử', onBack: fn() },
}

/** Figma "Breakpoint=SM, Type=Logo": menu button, search filling the width, icons, avatar only. */
export const Mobile: Story = {
  args: { layout: 'mobile' },
  globals: { viewport: { value: 'mobile1' } },
}

/** Figma "Notification / Open=Open1": the inbox, tabs with counts, rows by date. */
export const InboxOpen: Story = {
  args: { layout: 'desktop' },
  parameters: { docs: { story: { height: '640px' } } },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Hòm thư' }))
    const popover = within(document.body)
    const tab = await popover.findByRole('tab', { name: /Thông báo/ })
    await expect(tab).toBeInTheDocument()
  },
}

/** Figma "App Header Items / Avatar / Open=Yes": switch store, account settings, log out. */
export const AccountMenu: Story = {
  args: { layout: 'desktop' },
  parameters: { docs: { story: { height: '420px' } } },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Tài khoản/ }))
    const menu = within(document.body)
    const logout = await menu.findByRole('menuitem', { name: 'Đăng xuất' })
    await expect(logout).toBeInTheDocument()
  },
}

/** Figma "Language Item / Open=Open1": "Việt Nam" / "English" / "China". */
export const LanguageMenu: Story = {
  args: { layout: 'desktop' },
  parameters: { docs: { story: { height: '260px' } } },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Ngôn ngữ/ }))
    const menu = within(document.body)
    const english = await menu.findByRole('menuitemradio', { name: 'English' })
    await expect(english).toBeInTheDocument()
  },
}

/**
 * The only `CssCheck` in this project: `toBeVisible` would pass on an
 * unstyled header. Reading the resolved gradient proves FcTheme and the
 * Figma-derived tokens reached the story. `#003EB3` → `#0958D9` are Blue
 * Light Color/Background/Header-Start → Header-End.
 */
export const CssCheck: Story = {
  args: { layout: 'desktop' },
  globals: { brand: 'blue', mode: 'light' },
  play: async ({ canvas }) => {
    const bg = getComputedStyle(canvas.getByRole('banner')).backgroundImage
    await expect(bg).toContain('linear-gradient')
    await expect(bg).toContain('rgb(0, 62, 179)')
    await expect(bg).toContain('rgb(9, 88, 217)')
  },
}

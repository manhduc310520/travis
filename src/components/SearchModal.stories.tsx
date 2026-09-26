import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Key } from 'react-aria-components'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Button, Flex, ModalTrigger, Text } from '../fc'
import { SearchSm } from '../icons'
import { SearchModal, type SearchModalProps } from './SearchModal'
import { FEATURES, HISTORY } from './searchModalSamples'

const LABEL_BY_KEY = new Map<Key, string>(FEATURES.flatMap((group) => group.items.map((item) => [item.key, item.label])))

/**
 * Trigger button + the modal (inside `ModalTrigger`), with a working
 * "Xoá lịch sử" and the last chosen feature shown under the button.
 */
function Demo({ defaultOpen, history: initialHistory = [], onAction, onClearHistory, ...args }: SearchModalProps) {
  const [history, setHistory] = useState(initialHistory)
  const [chosen, setChosen] = useState<Key | null>(null)
  return (
    <Flex direction="column" gap="sm" align="start">
      <ModalTrigger defaultOpen={defaultOpen}>
        <Button iconStart={<SearchSm />}>Tìm tính năng</Button>
        <SearchModal
          {...args}
          history={history}
          onClearHistory={() => {
            onClearHistory?.()
            setHistory([])
          }}
          onAction={(key) => {
            onAction?.(key)
            setChosen(key)
          }}
        />
      </ModalTrigger>
      {chosen != null && <Text tone="secondary">Đã chọn: {LABEL_BY_KEY.get(chosen) ?? String(chosen)}</Text>}
    </Flex>
  )
}

const meta = {
  title: 'Templates/SearchModal',
  component: SearchModal,
  args: {
    groups: FEATURES,
    history: [],
    isDismissable: true,
    onAction: fn(),
    onClearHistory: fn(),
    onOpenChange: fn(),
    onInputChange: fn(),
  },
  argTypes: {
    groups: { control: false },
    history: { control: false },
    labels: { control: false },
    isOpen: { control: false },
    defaultOpen: { control: false },
    inputValue: { control: false },
    defaultInputValue: { control: 'text' },
  },
  parameters: {
    // Each story in its own iframe on the Docs page, so the open modal and its
    // mask stay inside their own preview.
    docs: { story: { inline: false, iframeHeight: 560 } },
  },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof SearchModal>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Figma Search Modal State=Default and State=Focused — open on load, nothing
 * typed, no history: the field has focus and the hint
 * "Nhập từ khoá để tìm tính năng" / "Ví dụ: “Sản phẩm”" fills the content.
 */
export const Default: Story = {
  args: { defaultOpen: true },
}

/**
 * Figma State=History — nothing typed, recent features listed under "Gần đây"
 * with a clock icon. ↓ enters the list; "Xoá lịch sử" empties it (back to the
 * Default hint, focus returns to the field).
 */
export const History: Story = {
  args: { defaultOpen: true, history: HISTORY },
  play: async () => {
    const body = within(document.body)
    // Inside the modal: presence, not visibility (the mask fades in).
    await expect(await body.findByText('Gần đây')).toBeInTheDocument()
    await expect(body.getAllByRole('menuitem')).toHaveLength(HISTORY.length)
  },
}

/**
 * Figma State=Typing / State=Filled — the field holds "nha hang" (no
 * diacritics) and every feature under "Nhà hàng" is listed, grouped by path.
 * Typing highlights the first row; ↑ / ↓ move across groups, Enter chooses.
 */
export const Results: Story = {
  args: { defaultOpen: true, defaultInputValue: 'nha hang', history: HISTORY },
}

/**
 * Figma State=Empty — "23332d" matches nothing: search icon,
 * "Không tìm thấy kết quả", "Vui lòng nhập từ khóa khác để tìm kiếm".
 */
export const Empty: Story = {
  args: { defaultOpen: true, defaultInputValue: '23332d' },
  play: async () => {
    const body = within(document.body)
    // The live region repeats the text for screen readers; check the visible title.
    await expect(await body.findByText('Không tìm thấy kết quả', { selector: 'p' })).toBeInTheDocument()
    await expect(body.queryByRole('menu')).not.toBeInTheDocument()
  },
}

/**
 * Interactive, controlled the way the app header opens it: `isOpen` +
 * `onOpenChange`. Press the button, type (e.g. "doanh thu", "phan quyen"),
 * move with ↑ / ↓, choose with Enter or a click; Esc or the mask closes.
 * The play test types "nha hang", checks the filter, then picks "Sơ đồ bàn".
 */
export const Interactive: Story = {
  args: { history: HISTORY },
  render: function Render({ history: initialHistory = [], onAction, onOpenChange, onClearHistory, ...args }) {
    const [open, setOpen] = useState(false)
    const [history, setHistory] = useState(initialHistory)
    const [chosen, setChosen] = useState<Key | null>(null)
    return (
      <Flex direction="column" gap="sm" align="start">
        <Button iconStart={<SearchSm />} onPress={() => setOpen(true)}>Tìm tính năng</Button>
        {chosen != null && <Text tone="secondary">Đã chọn: {LABEL_BY_KEY.get(chosen) ?? String(chosen)}</Text>}
        <SearchModal
          {...args}
          isOpen={open}
          onOpenChange={(next) => {
            onOpenChange?.(next)
            setOpen(next)
          }}
          history={history}
          onClearHistory={() => {
            onClearHistory?.()
            setHistory([])
          }}
          onAction={(key) => {
            onAction?.(key)
            setChosen(key)
          }}
        />
      </Flex>
    )
  },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Tìm tính năng' }))
    const body = within(document.body)
    const field = await body.findByRole('searchbox', { name: 'Tìm kiếm tính năng' })
    await waitFor(() => expect(field).toHaveFocus())

    await userEvent.type(field, 'nha hang')
    await expect(body.getByText('Khu vực và bàn')).toBeInTheDocument()
    await expect(body.getByRole('menuitem', { name: 'Sơ đồ bàn' })).toBeInTheDocument()
    await expect(body.queryByRole('menuitem', { name: 'Danh sách món ăn' })).not.toBeInTheDocument()
    // Focus stays in the field while the list is in use.
    await expect(field).toHaveFocus()

    await userEvent.click(body.getByRole('menuitem', { name: 'Sơ đồ bàn' }))
    await expect(args.onAction).toHaveBeenCalledWith('table-map')
    // Choosing closes the modal (asked for here; the dialog itself leaves the
    // DOM once its exit animation ends).
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
    await expect(canvas.getByText('Đã chọn: Sơ đồ bàn')).toBeVisible()
  },
}

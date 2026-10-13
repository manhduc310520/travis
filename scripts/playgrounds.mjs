// "Playground" stories: one per listed component, rendered from args so the Controls panel can
// change it live. argTypes come from the component's API table (first table under "## API"):
//   `a` | `b` literals → select · boolean → switch · number → number · string / ReactNode → text
//   object / array → object · on* functions → action (logged in the Actions panel)
// Descriptions are the English Description cells; the docs page shows the Vietnamese ones in VN
// (.storybook/docsBlocks.tsx LocalizedControls). Used by scripts/convert.mjs.

// component folder → { component: export of '@fabi/ui', args, wrap?: JSX child rendered inside }
export const PLAYGROUNDS = {
  button: { component: 'Button', args: { children: 'Button', type: 'primary' } },
  input: { component: 'Input', args: { placeholder: 'Type here', style: { width: 240 } } },
  'input-number': { component: 'InputNumber', args: { defaultValue: 3, min: 1, max: 10 } },
  switch: { component: 'Switch', args: { defaultChecked: true } },
  checkbox: { component: 'Checkbox', args: { children: 'Checkbox' } },
  radio: { component: 'Radio', args: { children: 'Radio' } },
  rate: { component: 'Rate', args: { defaultValue: 3 } },
  slider: { component: 'Slider', args: { defaultValue: 30, style: { width: 240 } } },
  select: { component: 'Select', args: { placeholder: 'Select a city', style: { width: 200 }, options: [{ value: 'hanoi', label: 'Hanoi' }, { value: 'hcm', label: 'Ho Chi Minh City' }, { value: 'danang', label: 'Da Nang' }] } },
  'auto-complete': { component: 'AutoComplete', args: { placeholder: 'Type a dish', style: { width: 200 }, options: [{ value: 'Pho' }, { value: 'Banh mi' }, { value: 'Bun cha' }] } },
  'date-picker': { component: 'DatePicker', args: {} },
  'time-picker': { component: 'TimePicker', args: {} },
  'color-picker': { component: 'ColorPicker', args: { defaultValue: '#2f54eb' } },
  tag: { component: 'Tag', args: { children: 'Tag', color: 'geekblue' } },
  badge: { component: 'Badge', args: { count: 5 }, wrap: '<Avatar shape="square" size="large" />', extra: ['Avatar'] },
  avatar: { component: 'Avatar', args: { children: 'U', size: 'large' } },
  alert: { component: 'Alert', args: { title: 'Saved successfully', type: 'success', showIcon: true } },
  progress: { component: 'Progress', args: { percent: 60 } },
  spin: { component: 'Spin', args: {} },
  empty: { component: 'Empty', args: {} },
  result: { component: 'Result', args: { status: 'success', title: 'Order placed', subTitle: 'Order number 2017182818828182881' } },
  divider: { component: 'Divider', args: { children: 'Text' } },
  card: { component: 'Card', args: { title: 'Card title', children: 'Card content', style: { width: 300 } } },
  segmented: { component: 'Segmented', args: { options: ['Daily', 'Weekly', 'Monthly'] } },
  steps: { component: 'Steps', args: { current: 1, items: [{ title: 'Finished' }, { title: 'In Progress' }, { title: 'Waiting' }] } },
  pagination: { component: 'Pagination', args: { total: 50 } },
  statistic: { component: 'Statistic', args: { title: 'Active Users', value: 112893 } },
  tooltip: { component: 'Tooltip', args: { title: 'Tooltip text' }, wrap: '<Button>Hover me</Button>', extra: ['Button'] },
  popover: { component: 'Popover', args: { title: 'Title', content: 'Content' }, wrap: '<Button>Hover me</Button>', extra: ['Button'] },
  tabs: { component: 'Tabs', args: { items: [{ key: '1', label: 'Tab 1', children: 'Content of Tab 1' }, { key: '2', label: 'Tab 2', children: 'Content of Tab 2' }] } },
  collapse: { component: 'Collapse', args: { items: [{ key: '1', label: 'Panel header', children: 'Panel content' }] } },
  timeline: { component: 'Timeline', args: { items: [{ children: 'Order received' }, { children: 'Cooking' }, { children: 'Served' }] } },
  breadcrumb: { component: 'Breadcrumb', args: { items: [{ title: 'Home' }, { title: 'Menu' }, { title: 'Dishes' }] } },
  descriptions: { component: 'Descriptions', args: { title: 'Restaurant', items: [{ key: '1', label: 'Name', children: 'FABi Kitchen' }, { key: '2', label: 'Phone', children: '1810000000' }, { key: '3', label: 'Address', children: 'Hanoi, Vietnam' }] } },
  'qr-code': { component: 'QRCode', args: { value: 'https://example.com' } },
  image: { component: 'Image', args: { width: 200, src: '/mock-assets/photo-1.svg' } },
  calendar: { component: 'Calendar', args: { fullscreen: false } },
  table: { component: 'Table', args: { bordered: true, pagination: false, columns: [{ title: 'Dish', dataIndex: 'dish', key: 'dish' }, { title: 'Price', dataIndex: 'price', key: 'price' }], dataSource: [{ key: '1', dish: 'Pho', price: '45.000 ₫' }, { key: '2', dish: 'Banh mi', price: '25.000 ₫' }] } },
}

// Interaction tests (play functions). Key: "<folder>/Playground" or "<folder>/<demo file>".
// `spies` are args replaced by fn() so the test can check they were called.
// Body runs with { args, canvas, userEvent, step } plus expect / within / waitFor / screen.
export const PLAYS = {
  'button/Playground': {
    spies: ['onClick'],
    body: `await step('Clicking the button fires onClick', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Button' }))
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })`,
  },
  'switch/Playground': {
    spies: ['onChange'],
    body: `const sw = canvas.getByRole('switch')
    await expect(sw).toBeChecked()
    await step('Clicking turns it off', async () => {
      await userEvent.click(sw)
      await expect(sw).not.toBeChecked()
      await expect(args.onChange).toHaveBeenCalled()
    })`,
  },
  'select/Playground': {
    spies: ['onChange'],
    body: `await step('Open the list and pick a city', async () => {
      await userEvent.click(canvasElement.querySelector('.fabi-select'))
      const option = await screen.findByText('Hanoi', { selector: '.fabi-select-item-option-content' })
      await userEvent.click(option)
      await waitFor(() => expect(args.onChange).toHaveBeenCalled())
      await expect(canvasElement.querySelector('.fabi-select')).toHaveTextContent('Hanoi')
    })`,
  },
  'tabs/Playground': {
    body: `await step('Switch to the second tab', async () => {
      await userEvent.click(await canvas.findByText('Tab 2'))
      await waitFor(() => expect(canvasElement.querySelector('.fabi-tabs-tab-active')).toHaveTextContent('Tab 2'))
      await waitFor(() => expect(canvas.getByText('Content of Tab 2')).toBeVisible())
    })`,
  },
  'rate/Playground': {
    spies: ['onChange'],
    body: `await step('Pick five stars', async () => {
      const stars = canvas.getAllByRole('radio')
      await userEvent.click(stars[4])
      await expect(args.onChange).toHaveBeenCalledWith(5)
    })`,
  },
  'form/basic.tsx': {
    body: `await step('Submitting empty shows the required errors', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
      await waitFor(() => expect(canvas.getByText('Please input your username!')).toBeVisible())
      await waitFor(() => expect(canvas.getByText('Please input your password!')).toBeVisible())
    })
    await step('Filling the fields clears them', async () => {
      await userEvent.type(canvas.getByLabelText('Username'), 'fabi')
      await userEvent.type(canvas.getByLabelText('Password'), 'secret')
      await waitFor(() => expect(canvas.queryByText('Please input your username!')).toBeNull())
    })`,
  },
  'modal/basic.tsx': {
    body: `await step('Open and close the modal', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Open Modal' }))
      const dialog = await screen.findByRole('dialog')
      await waitFor(() => expect(within(dialog).getByText('Basic Modal')).toBeVisible())
      await userEvent.click(within(dialog).getByRole('button', { name: 'OK' }))
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    })`,
  },
}

export function playCode(key) {
  const p = PLAYS[key]
  if (!p) return { spies: '', play: '' }
  return {
    spies: (p.spies ?? []).map((s) => `${s}: fn()`).join(', '),
    play: `  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    ${p.body}
  },\n`,
  }
}

// plain text of a cell: the Controls table shows type / default as text, so no markdown links, inline code
// marks, escaped pipes, HTML entities (fixMarkdown writes `<` as &lt;) or <br /> / <hr />
const unmark = (s) => s
  .replace(/`/g, '').replace(/\\\|/g, '|')
  .replace(/\[((?:\\.|[^\]\\])*)\]\([^)\s]*\)/g, '$1')
  .replace(/\\([[\]])/g, '$1')
  .replace(/\s*<(?:br|hr)\s*\/?>\s*/g, ' / ')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .trim()

/** argTypes from the first API table of a page's markdown (English or Vietnamese header row). */
export function argTypesFromApi(markdown) {
  const lines = markdown.split('\n')
  let i = lines.findIndex((l) => /^## API\b/.test(l))
  if (i < 0) return {}
  for (; i < lines.length && !(/^\|/.test(lines[i]) && /Property|Thuộc tính/.test(lines[i])); i++);
  const out = {}
  for (i += 2; i < lines.length && /^\|/.test(lines[i]); i++) {
    const cells = lines[i].replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim())
    if (cells.length < 3) continue
    const name = unmark(cells[0]).split(/[\s(]/)[0]
    if (!/^[a-zA-Z][\w]*$/.test(name)) continue
    const type = unmark(cells[2])
    const def = cells[3] ? unmark(cells[3]) : ''
    const at = { description: cells[1].replace(/\\\|/g, '|'), table: { type: { summary: type }, defaultValue: def && def !== '-' ? { summary: def } : undefined } }
    const literals = [...cells[2].matchAll(/`([^`]+)`/g)].map((m) => m[1].replace(/^['"]|['"]$/g, ''))
    const onlyLiterals = cells[2].replace(/`[^`]+`/g, '').replace(/[\\|\s]/g, '') === ''
    // only event handlers become actions; render functions (renderTabBar, optionRender…) must stay
    // unset, or Storybook would pass a logging stub that renders nothing
    if (/^on[A-Z]/.test(name)) at.action = name
    else if (/=>/.test(type) || /Render$|^render/.test(name)) at.control = false
    else if (onlyLiterals && literals.length > 1 && literals.every((l) => /^[\w-]+$/.test(l))) at.control = { type: 'select' }, at.options = literals
    else if (/^boolean$/.test(type)) at.control = { type: 'boolean' }
    else if (/^number$/.test(type)) at.control = { type: 'number' }
    else if (/^(string|ReactNode|string \| ReactNode|ReactNode \| string)$/.test(type)) at.control = { type: 'text' }
    else if (/(\[\]|object|Record<|\{)/.test(type)) at.control = { type: 'object' }
    else at.control = false
    out[name] = at
  }
  return out
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { useMemo, useState, type FC, type SVGProps } from 'react'
import * as ProIcons from '@untitledui-pro/icons/line'
import { SearchField } from '../components/Input/SearchField'
import { Paragraph, Text, Title } from '../components/Typography/Typography'
import styles from './Icons.module.css'

type IconProps = SVGProps<SVGSVGElement> & { size?: number; color?: string }

/**
 * The full purchased catalog — `@untitledui-pro/icons/line` — not just the
 * icons this project imports through `src/icons.tsx`. Sorted once at module
 * scope so search never re-sorts on every keystroke.
 */
const allIcons: [string, FC<IconProps>][] = Object.entries(ProIcons)
  .filter((entry): entry is [string, FC<IconProps>] => typeof entry[1] === 'function')
  .sort(([a], [b]) => a.localeCompare(b))

function IconGallery() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allIcons
    return allIcons.filter(([name]) => name.toLowerCase().includes(q))
  }, [query])

  return (
    <div className={styles.page}>
      <Title level={2}>Icons</Title>
      <Paragraph tone="secondary">
        The full <code>@untitledui-pro/icons/line</code> catalog — {allIcons.length} icons, PascalCase names
        matching the <code>🍑 Icon</code> page in Figma (kebab-case there, e.g. <code>home-03</code> ↔{' '}
        <code>Home03</code> here). Only a subset is wired up in <code>src/icons.tsx</code> for use in components —
        this page is for browsing the full set when adding a new one.
      </Paragraph>

      <div className={styles.search}>
        <SearchField aria-label="Search icons" placeholder="Search icons by name…" value={query} onChange={setQuery} />
      </div>

      <Text tone="secondary" role="status">
        {filtered.length} of {allIcons.length} icons
      </Text>

      <ul className={styles.grid}>
        {filtered.map(([name, Icon]) => (
          <li key={name} className={styles.item}>
            <span className={styles.tile}>
              <Icon size={32} aria-hidden="true" />
            </span>
            <span className={styles.name}>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
// Production minification renames this function, and Storybook's "Show code"
// falls back to `<ComponentFunction.name />`; `displayName` survives it.
IconGallery.displayName = 'IconGallery'

const meta: Meta<typeof IconGallery> = {
  title: 'Design Tokens/Icons',
  component: IconGallery,
}
export default meta
type Story = StoryObj<typeof IconGallery>

export const AllIcons: Story = {
  render: () => <IconGallery />,
  // "Show code" shows how the page is drawn, not the whole story object.
  parameters: { docs: { source: { code: '() => <IconGallery />' } } },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Home01')).toBeVisible()
    const input = canvas.getByPlaceholderText('Search icons by name…')
    await expect(input).toBeVisible()

    // Typing filters the grid down to matching names only.
    await userEvent.type(input, 'clock')
    await expect(canvas.getByText('AlarmClock')).toBeVisible()
    // The grid re-renders ~1,000 icons per keystroke: wait for it rather than
    // assert on the very next tick (flaky when many stories run at once).
    await waitFor(() => expect(canvas.queryByText('Home01')).not.toBeInTheDocument())
  },
}

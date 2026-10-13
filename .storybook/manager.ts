import { addons, type API } from 'storybook/manager-api'
import { create } from 'storybook/theming'
import { DOCS_ENTRY_VI, GROUP_LABELS_VI, PAGE_TITLES_VI } from './labels'

const BRAND_NAME = 'FABi CMS Design System'
// Same default as .storybook/locale.tsx (not imported: that file pulls in React, which the manager must not bundle)
const DEFAULT_LOCALE = 'en'
let titleApi: API | undefined

type SidebarItem = { type: string; name: string; title?: string }

// renderLabel is also called without an api (e.g. outside the sidebar tree): fall back to the shared one.
const localeOf = (api?: Pick<API, 'getGlobals'>) => (api ?? titleApi)?.getGlobals?.()?.locale ?? DEFAULT_LOCALE

/** Vietnamese label of a sidebar group or docs page ('' when it keeps its English name). */
const labelVi = (item: SidebarItem) => {
  if (item.type === 'root' || item.type === 'group') return GROUP_LABELS_VI[item.name] ?? ''
  if (item.type === 'docs') return item.name === 'Docs' ? DOCS_ENTRY_VI : PAGE_TITLES_VI[item.title ?? ''] ?? ''
  return ''
}

// Sidebar labels follow the Language toolbar (globals.locale, default vi): groups and docs pages in
// Vietnamese; component and story names stay English. Plain strings only: returning a React element built
// with this file's own 'react' import broke the manager (no browser tab title any more).
// Always return a label: switching between undefined (Storybook's default) and a string re-renders the tree
// item with a different hook path and React then breaks the manager (no browser tab title).
const sidebarLabel = (item: SidebarItem, api?: API) => (localeOf(api) === 'vi' && labelVi(item)) || item.name

// Sidebar brand: the FABi CMS logo (public/brand/logo.svg, the owner's file, unchanged); its alt
// text is brandTitle. The favicon (public/favicon.png) is linked in manager-head.html.
addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: BRAND_NAME,
    brandImage: './brand/logo.svg',
    brandUrl: './',
    colorPrimary: '#2f54eb',
    colorSecondary: '#2f54eb',
    fontBase: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  }),
  sidebar: { renderLabel: sidebarLabel },
})

// Browser tab title: "<group> / <page> - <entry> ⋅ FABi CMS Design System", with Vietnamese group, page and
// "Docs" names in VN (story and component names stay English). Written here from the current entry: with a
// sidebar renderLabel set, Storybook 10.6 stops writing the title itself.
/** "Components / General / Button - Docs" in Vietnamese: groups, docs page names and "Docs" (not component names). */
const titleVi = (title: string) => {
  const m = title.match(/^(.*?)(?: - (.*))?$/) as RegExpMatchArray
  const parts = m[1].split(' / ')
  const page = PAGE_TITLES_VI[parts.join('/')]
  const path = parts.map((p, i) => (i < parts.length - 1 ? GROUP_LABELS_VI[p] ?? p : page ?? p)).join(' / ')
  return m[2] === undefined ? path : `${path} - ${m[2] === 'Docs' ? DOCS_ENTRY_VI : m[2]}`
}
let titleLocale: unknown
const tabTitle = () => {
  const entry = titleApi?.getCurrentStoryData?.() as { title?: string; name?: string } | undefined
  if (!entry?.title) return
  const base = `${entry.title.split('/').join(' / ')} - ${entry.name}`
  const locale = titleLocale ?? localeOf(titleApi)
  const next = `${locale === 'vi' ? titleVi(base) : base} ⋅ ${BRAND_NAME}`
  if (next !== document.title) document.title = next
}
// Storybook may still write its own "… ⋅ Storybook" title (e.g. without renderLabel): put ours back.
new MutationObserver(() => { if (/Storybook$/.test(document.title)) tabTitle() }).observe(document.head, { childList: true, subtree: true, characterData: true })

// Sidebar items are memoised, so a language change alone does not redraw their labels. Re-applying a
// pass-through filter rebuilds the index: every item becomes a new object and renders its label again.
addons.register('fabi/locale-labels', (api) => {
  titleApi = api
  let shown: unknown = DEFAULT_LOCALE
  const relabel = ({ globals }: { globals?: Record<string, unknown> }) => {
    const locale = globals?.locale ?? DEFAULT_LOCALE
    titleLocale = locale
    tabTitle()
    if (locale === shown) return
    shown = locale
    api.experimental_setFilter('fabi-locale', () => true)
  }
  api.on('setGlobals', relabel)
  api.on('globalsUpdated', relabel)
  // the current entry changes: story / docs selected and rendered
  for (const event of ['storyChanged', 'setCurrentStory', 'storyRendered', 'docsRendered', 'storyPrepared']) api.on(event, () => setTimeout(tabTitle))
  setTimeout(tabTitle)
})

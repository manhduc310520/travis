import { useEffect, useMemo, useState, type ComponentProps } from 'react'
import type { Preview } from '@storybook/react-vite'
import { DocsContainer, DocsContext } from '@storybook/addon-docs/blocks'
import { FabiProvider, theme } from '@fabi/ui'
import type { BrandKey, FabiMode } from '@fabi/ui'
import enUS from '@fabi/ui/locale/en_US'
import { create } from 'storybook/theming'
import { BRANDS, DEFAULT_BRAND, DEFAULT_MODE, FONT_FAMILY, MODES, brandThemeFor } from './brand'
import { DEFAULT_LOCALE, LOCALES, LocaleProvider, isLocale, type DocsLocale } from './locale'
import { FabiDocsRenderer } from './docsRenderer'
import { installMockApi } from './mockApi'
import { VIEWPORTS } from './viewports'
// Accessibility CSS of the package (contrast fixes, .fabi-sr-only); the DOM patches are installed by FabiProvider.
import '@fabi/ui/styles.css'
import './docs.css'

// Demos call /mock-api/… instead of outside servers; answer them locally.
installMockApi()

// Starting brand / mode: VITE_BRAND=<key>, VITE_MODE=light|dark (tests: npm run test:a11y -- <key> <mode>).
const ENV_BRAND = import.meta.env.VITE_BRAND as string | undefined
const INITIAL_BRAND = ENV_BRAND && ENV_BRAND in BRANDS ? ENV_BRAND : DEFAULT_BRAND
const ENV_MODE = import.meta.env.VITE_MODE as string | undefined
const INITIAL_MODE = ENV_MODE && ENV_MODE in MODES ? ENV_MODE : DEFAULT_MODE
// Starting docs language: VITE_LOCALE=vi|en (Language toolbar; default vi).
const ENV_LOCALE = import.meta.env.VITE_LOCALE as string | undefined
const INITIAL_LOCALE = isLocale(ENV_LOCALE) ? ENV_LOCALE : DEFAULT_LOCALE

// Dark mode: the canvas, the docs pages and the example boxes take antd's dark surface and text colours
// (docs.css reads these variables under html[data-fabi-mode=dark], which FabiProvider sets), so demos sit on
// the surface they are designed for and axe measures them there. Brand-independent values.
const DARK = theme.getDesignToken(brandThemeFor(DEFAULT_BRAND, 'dark'))
const darkVars = document.querySelector<HTMLStyleElement>('style[data-fabi-sb="dark-vars"]') ?? document.createElement('style') // reused on hot reload
darkVars.dataset.fabiSb = 'dark-vars'
darkVars.textContent = `:root {
  --fabi-sb-dark-bg: ${DARK.colorBgContainer};
  --fabi-sb-dark-text: ${DARK.colorText};
  --fabi-sb-dark-text-secondary: ${DARK.colorTextSecondary};
  --fabi-sb-dark-border: ${DARK.colorBorderSecondary};
  --fabi-sb-dark-link: ${DARK['geekblue-8']};
  --fabi-sb-dark-link-code: ${DARK['geekblue-9']};
}`
document.head.appendChild(darkVars)
// Storybook's own docs chrome in dark; links in geekblue-8 of antd's dark palette (7.1:1 on the surface).
const DOCS_THEME_DARK = create({
  base: 'dark', fontBase: FONT_FAMILY, colorPrimary: DARK['geekblue-8'], colorSecondary: DARK['geekblue-8'],
  appContentBg: DARK.colorBgContainer, appPreviewBg: DARK.colorBgContainer,
})

type DocsProps = ComponentProps<typeof DocsContainer>
type DocsCtx = { channel?: { on: (e: string, f: (a: { globals: Record<string, string> }) => void) => void; off: (e: string, f: (a: { globals: Record<string, string> }) => void) => void }; store?: { userGlobals?: { globals?: Record<string, string> } } }
type Params = { docs?: { toc?: Record<string, unknown>; [k: string]: unknown }; [k: string]: unknown }
type MetaResolved = { preparedMeta?: { parameters?: Params } }

// Screen-reader heading of the table of contents (Storybook's own is "Table of contents", marked lang="en")
const TOC_TITLE_VI = <h2 className="sb-sr-only">Mục lục</h2>

/**
 * The docs context DocsContainer reads its settings from, in the docs language: `lang` of the page content
 * (Storybook marks it "en" otherwise) and the table of contents, whose screen-reader title is translated and whose
 * options object is new per language, so it collects the headings again after a language change.
 */
function useLocaleDocsContext(context: DocsProps['context'], locale: DocsLocale) {
  return useMemo(() => {
    const docsParams = (p?: Params): Params => ({
      ...p,
      docs: {
        ...p?.docs,
        lang: LOCALES[locale].lang,
        ...(p?.docs?.toc && { toc: { ...p.docs.toc, title: locale === 'vi' ? TOC_TITLE_VI : undefined, unsafeTocbotOptions: { ...(p.docs.toc.unsafeTocbotOptions as object) } } }),
      },
    })
    const resolveOf = (...args: unknown[]) => {
      const resolved = (context.resolveOf as (...a: unknown[]) => MetaResolved)(...args)
      return args[0] === 'meta' && resolved?.preparedMeta
        ? { ...resolved, preparedMeta: { ...resolved.preparedMeta, parameters: docsParams(resolved.preparedMeta.parameters) } }
        : resolved
    }
    const project = context.projectAnnotations as { parameters?: Params }
    return Object.create(context, {
      resolveOf: { value: resolveOf },
      projectAnnotations: { value: { ...project, parameters: docsParams(project?.parameters) } },
    }) as typeof context
  }, [context, locale])
}

/**
 * Docs pages: widgets outside stories (token tables, palettes, examples) follow the Brand and Mode toolbars too,
 * and the page text follows the Language toolbar. Toolbar changes re-render the page in place (FabiDocsRenderer);
 * the blocks inside get the docs context as Storybook made it.
 */
function BrandDocsContainer(props: DocsProps) {
  const ctx = props.context as unknown as DocsCtx
  const [brand, setBrand] = useState(ctx.store?.userGlobals?.globals?.brand ?? INITIAL_BRAND)
  const [mode, setMode] = useState(ctx.store?.userGlobals?.globals?.mode ?? INITIAL_MODE)
  const [locale, setLocale] = useState(ctx.store?.userGlobals?.globals?.locale ?? INITIAL_LOCALE)
  useEffect(() => {
    const onGlobals = ({ globals }: { globals: Record<string, string> }) => {
      if (globals.brand) setBrand(globals.brand)
      if (globals.mode) setMode(globals.mode)
      if (globals.locale) setLocale(globals.locale)
    }
    ctx.channel?.on('globalsUpdated', onGlobals)
    return () => ctx.channel?.off('globalsUpdated', onGlobals)
  }, [ctx])
  const docsLocale = isLocale(locale) ? locale : DEFAULT_LOCALE
  const context = useLocaleDocsContext(props.context, docsLocale)
  return (
    <LocaleProvider locale={docsLocale}>
      <FabiProvider brand={brand as BrandKey} mode={mode as FabiMode}>
        <DocsContainer context={context} theme={mode === 'dark' ? DOCS_THEME_DARK : props.theme}>
          <DocsContext.Provider value={props.context}>{props.children}</DocsContext.Provider>
        </DocsContainer>
      </FabiProvider>
    </LocaleProvider>
  )
}

const preview: Preview = {
  // Brand switcher in the toolbar (brand.ts BRANDS); each item shows its primary colour (its `step`).
  globalTypes: {
    brand: {
      description: 'Brand colour',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: Object.entries(BRANDS).map(([value, b]) => ({ value, title: b.name, right: b.palette[b.step - 1] })),
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Colour mode',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: Object.entries(MODES).map(([value, m]) => ({ value, title: m.name, icon: value === 'dark' ? 'moon' : 'sun' })),
        dynamicTitle: true,
      },
    },
    // Docs language (locale.tsx): titles and descriptions; code, component / story names and the text the
    // components draw themselves stay as they are.
    locale: {
      description: 'Docs language',
      toolbar: {
        title: 'Language',
        icon: 'globe',
        items: Object.entries(LOCALES).map(([value, l]) => ({ value, title: l.title })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { brand: INITIAL_BRAND, mode: INITIAL_MODE, locale: INITIAL_LOCALE },
  // Stories (on their own and inside docs pages) render inside FabiProvider, as an app does: the selected
  // brand theme and mode, fabi- class names, --fabi-* CSS variables and the accessibility patches.
  // LocaleProvider: examples that show site text (Semantic DOM labels) follow the Language toolbar. In EN the
  // components get antd's English locale, so the texts FABi's own components draw ("Quay lại", "Xoá bộ lọc"…)
  // are English too; antd's own texts are English either way (no locale = antd's default).
  decorators: [(Story, ctx) => (
    <LocaleProvider locale={ctx.globals.locale} documentLang={ctx.viewMode !== 'docs'}>
      <FabiProvider brand={ctx.globals.brand} mode={ctx.globals.mode} locale={ctx.globals.locale === 'en' ? enUS : undefined}><Story /></FabiProvider>
    </LocaleProvider>
  )],
  parameters: {
    layout: 'padded',

    docs: {
      // Docs typography in the brand font (Be Vietnam Pro, loaded in preview-head.html).
      theme: create({ base: 'light', fontBase: FONT_FAMILY, colorPrimary: '#2f54eb', colorSecondary: '#2f54eb' }),
      toc: { headingSelector: 'h2, h3' },
      // Docs-page widgets outside stories (token tables, palettes, examples) get it too.
      container: BrandDocsContainer,
      // toolbar changes re-render a docs page in place instead of reloading it (docsRenderer.tsx)
      renderer: async () => new FabiDocsRenderer(),
    },

    options: {
      storySort: {
        order: ['Introduction', 'Getting Started', 'Design Tokens', ['Customize Theme', 'Colors', 'Dark Mode', 'Font', 'Layout', 'Responsive', 'Shadow', 'Motion'], 'Components', ['General', 'Layout', 'Navigation', 'Data Entry', 'Data Display', 'Feedback', 'Other'], 'Template', ['Overview']],
      },
    },

    // Screen sizes for the Viewport toolbar, on antd's breakpoints (viewports.ts; listed on Design Tokens / Responsive).
    viewport: { options: VIEWPORTS },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      // VITE_A11Y_STRICT=1 npx vitest run → violations fail the test, with the axe details printed
      test: import.meta.env.VITE_A11Y_STRICT ? 'error' : 'todo'
    }
  },
}

export default preview

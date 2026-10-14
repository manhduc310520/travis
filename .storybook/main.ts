import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import remarkGfm from 'remark-gfm'
import type { Plugin } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const fabiUi = path.resolve(dirname, '../packages/fabi-ui').replace(/\\/g, '/')

// Everything @fabi/ui re-exports, plus the packages its sources import. One copy each, from the
// Storybook's node_modules (packages/fabi-ui has its own install): two antd or React copies would
// split ConfigProvider context and hooks.
const SINGLE_COPY = [
  'react', 'react-dom', 'antd', '@ant-design/icons', '@ant-design/colors', '@ant-design/cssinjs',
  '@ant-design/happy-work-theme', 'antd-style', 'antd-img-crop', 'dayjs', '@rc-component/util', '@ant-design/plots',
]

type AliasList = { find: string | RegExp; replacement: string }[]
const toAliasList = (alias: unknown): AliasList =>
  Array.isArray(alias) ? alias : Object.entries((alias ?? {}) as Record<string, string>).map(([find, replacement]) => ({ find, replacement }))

// Static build: Storybook builds with Rolldown's strict execution order, where importing one name from a module runs
// (and loads) every module it imports. The entry of '@ant-design/icons' runs code of its own and re-exports its 848
// icons with `export *`, so every page with one antd icon loaded all of them (and the Icon page's IconSearch chunk
// they sat in, about 1 MB). This stand-in has the same exports, each named straight from its own file.
const ANT_ICONS = '\0fabi:ant-design-icons'
const ANT_ICON_PROVIDER = '\0fabi:ant-design-icon-provider'
const antIconsByName: Plugin = {
  name: 'fabi:ant-design-icons-by-name',
  apply: 'build',
  enforce: 'pre',
  resolveId: (source) => (source === '@ant-design/icons' ? ANT_ICONS : source === ANT_ICON_PROVIDER ? source : null),
  load(id) {
    if (id === ANT_ICON_PROVIDER) {
      // the entry's own code, kept apart so the list below stays re-exports only
      return "import IconContext from '@ant-design/icons/es/components/Context'\nexport const IconProvider = IconContext.Provider\n"
    }
    if (id !== ANT_ICONS) return null
    const list = fs.readFileSync(path.resolve(dirname, '../node_modules/@ant-design/icons/es/icons/index.js'), 'utf8')
    return [
      list.replace(/from "\.\/([^"]+)"/g, 'from "@ant-design/icons/es/icons/$1"'),
      "export { getTwoToneColor, setTwoToneColor } from '@ant-design/icons/es/components/twoTonePrimaryColor'",
      "export { default as createFromIconfontCN } from '@ant-design/icons/es/components/IconFont'",
      "export { default } from '@ant-design/icons/es/components/Icon'",
      `export { IconProvider } from '${ANT_ICON_PROVIDER}'`,
    ].join('\n')
  },
}

// `storybook build` (the public static site, and Chromatic's own build) vs `storybook dev` / the Vitest runs
const isStaticBuild = process.argv.includes('build')

const config: StorybookConfig = {
  stories: ['../src/*.mdx', '../src/design-tokens/**/*.mdx', '../src/components/**/*.stories.tsx', '../src/template/**/*.@(mdx|stories.tsx)', '../src/fabi/**/*.stories.tsx'],
  addons: [
    // MDX pages (Getting Started…) use markdown tables: GitHub-flavoured markdown is not in MDX by default
    { name: '@storybook/addon-docs', options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } } },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    // Chromatic's "Visual tests" panel is a developer tool (sign-in, "Uninstall addon"): dev only, not in the
    // public static site. chromatic.config.json stays for `npx chromatic`.
    ...(isStaticBuild ? [] : ['@chromatic-com/storybook']),
  ],
  // Local sample images and data used instead of remote ones (scripts/make-assets.mjs).
  staticDirs: ['../public'],
  framework: '@storybook/react-vite',
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    plugins: [...(viteConfig.plugins ?? []), antIconsByName],
    resolve: {
      ...viteConfig.resolve,
      // The demos and the copied site helpers (src/_dumi) import from 'dumi';
      // only the locale hook is used, so a tiny shim stands in for the real package.
      alias: [
        ...toAliasList(viteConfig.resolve?.alias),
        { find: /^dumi$/, replacement: path.resolve(dirname, '../src/shims/dumi.tsx') },
        { find: /^react-countup$/, replacement: path.resolve(dirname, '../src/shims/react-countup.ts') },
        { find: /^react-fast-marquee$/, replacement: path.resolve(dirname, '../src/shims/react-fast-marquee.ts') },
        // @fabi/ui from the local package: its sources, and the dist/ entry stubs for the subpaths
        // (@fabi/ui/icons, /es/…, /locale/…), so the demos run the same imports an app writes.
        { find: /^@fabi\/ui$/, replacement: `${fabiUi}/src/index.ts` },
        { find: /^@fabi\/ui\/styles\.css$/, replacement: `${fabiUi}/src/styles.css` },
        // the icon set from its source too: StatisticCard (in src) imports it, so one copy loads, not two
        { find: /^@fabi\/ui\/fabi-icons$/, replacement: `${fabiUi}/src/fabi-icons.ts` },
        { find: /^@fabi\/ui\/(.+)$/, replacement: `${fabiUi}/dist/$1` },
      ],
      dedupe: [...(viteConfig.resolve?.dedupe ?? []), ...SINGLE_COPY],
    },
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      // CommonJS-only packages used by demos: pre-bundle them so `import X from` gets the default export.
      include: [
        ...(viteConfig.optimizeDeps?.include ?? []),
        'react-countup/build/index.js', 'react-fast-marquee/dist/index.js', 'react-highlight-words', 'react-infinite-scroll-component',
        'react-sticky-box', 'react-draggable', 'lunar-typescript', 'runes2',
        // @fabi/ui's picker suffix reads Form.Item's context from antd's internals: listed so Vite pre-bundles it at
        // start instead of discovering it during a run and reloading (the tests would restart)
        'antd/es/form/context.js',
      ],
    },
  }),
}

export default config

import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',

  /**
   * The free `@untitledui/icons` this project used to depend on shipped
   * CommonJS-only and called `require('react')`, which let Vite hand it a
   * second copy of React — two copies means two hook dispatchers, and every
   * `useToken()` inside a ConfigProvider threw "Invalid hook call". Now on
   * `@untitledui-pro/icons/line` (the paid PRO package), which ships proper
   * dual ESM/CJS exports, so this may no longer be strictly necessary — but
   * kept as a safety net rather than removed and re-diagnosed later, since it
   * costs nothing and the failure mode is a cryptic runtime crash, not a
   * build error.
   */
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      dedupe: [...(viteConfig.resolve?.dedupe ?? []), 'react', 'react-dom'],
    },
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      include: [...(viteConfig.optimizeDeps?.include ?? []), '@untitledui-pro/icons/line', 'react', 'react-dom'],
    },
  }),
}

export default config

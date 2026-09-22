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
   * `@untitledui/icons` ships CommonJS and calls `require('react')`, which lets
   * Vite hand it a second copy of React. Two copies means two hook dispatchers,
   * and every `useToken()` inside a ConfigProvider throws
   * "Invalid hook call" / "Cannot read properties of null (reading 'useContext')".
   *
   * Deduping pins one React for the whole graph; pre-bundling the icons turns
   * them into ESM so they resolve against that same copy.
   */
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      dedupe: [...(viteConfig.resolve?.dedupe ?? []), 'react', 'react-dom'],
    },
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      include: [...(viteConfig.optimizeDeps?.include ?? []), '@untitledui/icons', 'react', 'react-dom'],
    },
  }),
}

export default config

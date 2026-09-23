import type { Preview } from '@storybook/react-vite'
import { ConfigProvider, App as AntApp, theme as antdTheme } from 'antd'
import {
  buildTheme,
  headerGradientVars,
  dimensionTokens,
  BRANDS,
  MODES,
  DENSITIES,
  type Brand,
  type Mode,
  type Density,
} from '../src/theme'
import { antdIconDefaults } from '../src/theme/antdIcons'
import '../src/index.css'

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

const preview: Preview = {
  // Every story gets an auto-generated Docs page. Since every component here
  // is Ant Design's own, the prop tables and descriptions it extracts come
  // straight from Ant Design's own TypeScript types — nothing hand-written.
  tags: ['autodocs'],

  globalTypes: {
    brand: {
      description: 'Brand theme, from the Figma collection `1. Brand`',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: BRANDS.map((b) => ({ value: b, title: cap(b) })),
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Colour mode, from the Figma collection `2. Colors`',
      toolbar: {
        title: 'Mode',
        icon: 'contrast',
        items: MODES.map((m) => ({ value: m, title: cap(m) })),
        dynamicTitle: true,
      },
    },
    density: {
      description: 'Density, from the Figma collection `3. Dimensions`',
      toolbar: {
        title: 'Density',
        icon: 'component',
        items: DENSITIES.map((d) => ({ value: d, title: cap(d) })),
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: { brand: 'blue', mode: 'light', density: 'default' },

  decorators: [
    (Story, context) => {
      const brand = (context.globals.brand ?? 'blue') as Brand
      const mode = (context.globals.mode ?? 'light') as Mode
      const density = (context.globals.density ?? 'default') as Density
      const theme = buildTheme(brand, mode, density)
      const fullscreen = context.parameters.layout === 'fullscreen'

      return (
        <ConfigProvider theme={theme} {...antdIconDefaults}>
          <AntApp>
            <InnerFrame
              brand={brand}
              mode={mode}
              density={density}
              fullscreen={fullscreen}
              fontFamily={theme.token?.fontFamily as string}
            >
              <Story />
            </InnerFrame>
          </AntApp>
        </ConfigProvider>
      )
    },
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

/**
 * Sits inside ConfigProvider so it can read the resolved background straight
 * from the theme rather than restating a colour the theme already knows.
 * Padding uses the density token, so it moves with the toolbar too.
 */
function InnerFrame({
  brand,
  mode,
  density,
  fullscreen,
  fontFamily,
  children,
}: {
  brand: Brand
  mode: Mode
  density: Density
  fullscreen: boolean
  fontFamily?: string
  children: React.ReactNode
}) {
  const { token } = antdTheme.useToken()
  return (
    <div
      data-brand={brand}
      data-mode={mode}
      data-density={density}
      style={{
        ...headerGradientVars(brand, mode),
        background: fullscreen ? 'transparent' : token.colorBgContainer,
        padding: fullscreen ? 0 : dimensionTokens[density].padding,
        minHeight: '100%',
        fontFamily,
      }}
    >
      {children}
    </div>
  )
}

export default preview

import type { Preview } from '@storybook/react-vite'
import { FC_BRANDS, FC_DENSITIES, FC_MODES, FcTheme, type FcBrand, type FcDensity, type FcMode } from '../src/fc'
import '../src/index.css'

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

// Storybook renders every story inside React's test-only act(). Overlays that
// open on the first render (Modal, Select, Popover stories with defaultOpen)
// update state after that act() has returned, so React logs two warnings meant
// for test suites. The app never runs act(): drop exactly those two messages.
const ACT_NOISE = /not wrapped in act\(|suspended inside an `act` scope/
const logError = console.error.bind(console)
console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && ACT_NOISE.test(args[0])) return
  logError(...args)
}

const preview: Preview = {
  // Every story gets an auto-generated Docs page with a prop table read from
  // the component's own TypeScript types and JSDoc.
  tags: ['autodocs'],

  globalTypes: {
    brand: {
      description: 'Brand theme, from the Figma collection `1. Brand`',
      toolbar: { title: 'Brand', icon: 'paintbrush', items: FC_BRANDS.map((b) => ({ value: b, title: cap(b) })), dynamicTitle: true },
    },
    mode: {
      description: 'Colour mode, from the Figma collection `2. Colors`',
      toolbar: { title: 'Mode', icon: 'contrast', items: FC_MODES.map((m) => ({ value: m, title: cap(m) })), dynamicTitle: true },
    },
    density: {
      description: 'Density, from the Figma collection `3. Dimensions`',
      toolbar: { title: 'Density', icon: 'component', items: FC_DENSITIES.map((d) => ({ value: d, title: cap(d) })), dynamicTitle: true },
    },
  },

  initialGlobals: { brand: 'blue', mode: 'light', density: 'default' },

  decorators: [
    // Every page — Components, Templates, Design Tokens — renders inside
    // FcTheme, driven by the Brand / Mode / Density toolbar.
    (Story, context) => {
      const fullscreen = context.parameters.layout === 'fullscreen'
      return (
        <FcTheme
          brand={(context.globals.brand ?? 'blue') as FcBrand}
          mode={(context.globals.mode ?? 'light') as FcMode}
          density={(context.globals.density ?? 'default') as FcDensity}
          style={{
            background: fullscreen ? 'transparent' : 'var(--fc-color-background-container)',
            padding: fullscreen ? 0 : 'var(--fc-space-padding-base)',
            minHeight: '100%',
          }}
        >
          <Story />
        </FcTheme>
      )
    },
  ],

  parameters: {
    controls: {
      matchers: {
        // Colour picker only for free-colour props (`background`, `bgColor`,
        // `strokeColor`…). A plain `color` prop in fc is a named palette choice
        // (`'blue' | 'danger' | …`), which gets a select, not a picker.
        color: /(^background|Color)$/,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    options: {
      storySort: { order: ['Introduction', 'Design Tokens', 'Components', 'Templates'] },
    },
  },
}

export default preview

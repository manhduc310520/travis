// Same CommonJS default-export problem as react-countup (see react-countup.ts): hand the
// Marquee component back as the default export for antd's Alert "Loop banner" demo.
import * as mod from 'react-fast-marquee/dist/index.js'

const m = mod as unknown as { default?: unknown }
const inner = (m.default ?? m) as { default?: unknown }
export default (inner.default ?? inner) as typeof import('react-fast-marquee').default

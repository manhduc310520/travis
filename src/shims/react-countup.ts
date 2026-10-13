// react-countup ships CommonJS that sets `exports.default` without the ES-module flag, so
// `import CountUp from 'react-countup'` (antd's Statistic demo) would receive the whole
// exports object. This stand-in hands the component back as the default export.
import * as mod from 'react-countup/build/index.js'

const m = mod as unknown as { default?: unknown; useCountUp?: unknown }
const inner = (m.default ?? m) as { default?: unknown; useCountUp?: unknown }
export default (inner.default ?? inner) as typeof import('react-countup').default
export const useCountUp = (m.useCountUp ?? inner.useCountUp) as typeof import('react-countup').useCountUp

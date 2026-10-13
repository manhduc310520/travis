// Strict accessibility run (axe violations fail the test) for one brand or all five, in Light or Dark, in either
// docs language.
//   npm run test:a11y                 → geekblue, light, en
//   npm run test:a11y -- cyan         → one brand
//   npm run test:a11y -- all          → every brand, one after another
//   npm run test:a11y -- cyan dark    → Dark mode (`-- dark` alone = geekblue dark, `-- all dark` = every brand)
//   npm run test:a11y -- vi           → docs language VN (Language toolbar; default en), with any brand / mode
// Extra arguments go to vitest, e.g. `npm run test:a11y -- cyan dark --reporter=json --outputFile=a11y-{brand}-{mode}.json`.
// Sets VITE_A11Y_STRICT=1, VITE_BRAND=<key>, VITE_MODE=<mode> and VITE_LOCALE=<vi|en> (read by .storybook/preview.tsx);
// works in cmd, PowerShell and bash.
import { spawnSync } from 'node:child_process'
import { BRANDS, DEFAULT_BRAND, DEFAULT_MODE, MODES } from '../packages/fabi-ui/src/theme.ts'

const LOCALES = ['en', 'vi'] // first = default (English, like the Language toolbar)
const args = process.argv.slice(2)
let brand = DEFAULT_BRAND
let mode = DEFAULT_MODE
let locale = LOCALES[0]
// leading words (before any --flag) are the brand / `all`, the mode and the language, in any order
while (args[0] && !args[0].startsWith('-')) {
  const word = args.shift()
  if (word in MODES) mode = word
  else if (LOCALES.includes(word)) locale = word
  else if (word === 'all' || word in BRANDS) brand = word
  else {
    console.error(`Unknown brand, mode or language "${word}". Brands: ${Object.keys(BRANDS).join(', ')} or all. Modes: ${Object.keys(MODES).join(', ')}. Languages: ${LOCALES.join(', ')}`)
    process.exit(2)
  }
}
const brands = brand === 'all' ? Object.keys(BRANDS) : [brand]

const results = []
for (const b of brands) {
  console.log(`\n=== strict a11y: ${b} ${mode} ${locale} ===`)
  const extra = args.map((a) => a.replaceAll('{brand}', b).replaceAll('{mode}', mode))
  const r = spawnSync('npx', ['vitest', 'run', '--project', 'storybook', ...extra], {
    stdio: 'inherit', shell: true, env: { ...process.env, VITE_A11Y_STRICT: '1', VITE_BRAND: b, VITE_MODE: mode, VITE_LOCALE: locale },
  })
  results.push([b, r.status])
}
if (results.length > 1) for (const [b, s] of results) console.log(`${s === 0 ? 'pass' : 'FAIL'}  ${b} ${mode} ${locale}`)
process.exit(results.some(([, s]) => s !== 0) ? 1 : 0)

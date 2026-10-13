// Generate the local sample images that replace the remote images of the antd demos
// (Alipay CDN, Unsplash, DiceBear, …). Output: public/mock-assets/*.svg (served at /mock-assets/).
// Usage: node scripts/make-assets.mjs
//   avatar-1 … avatar-12  initials on a coloured circle (people / user avatars)
//   photo-1 … photo-12    abstract landscape "photos" (covers, gallery, carousel, cards)
//   illustration.svg      neutral empty-state style illustration (for remote SVG artwork)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public/mock-assets')
fs.mkdirSync(OUT, { recursive: true })

// Geek Blue brand plus antd palette hues, so the samples sit well next to the components.
const HUES = ['#2f54eb', '#13c2c2', '#52c41a', '#faad14', '#fa541c', '#eb2f96', '#722ed1', '#1677ff', '#a0d911', '#fa8c16', '#f5222d', '#597ef7']
const INITIALS = ['AN', 'BL', 'CH', 'DU', 'GI', 'HA', 'KH', 'LI', 'MI', 'NA', 'PH', 'TU']

for (let i = 0; i < 12; i++) {
  fs.writeFileSync(path.join(OUT, `avatar-${i + 1}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="${HUES[i]}"/>
  <circle cx="64" cy="50" r="22" fill="#fff" fill-opacity="0.9"/>
  <path d="M22 118c4-24 22-36 42-36s38 12 42 36" fill="#fff" fill-opacity="0.9"/>
  <text x="64" y="57" text-anchor="middle" font-family="Be Vietnam Pro, Arial, sans-serif" font-size="18" font-weight="600" fill="${HUES[i]}">${INITIALS[i]}</text>
</svg>
`)
}

for (let i = 0; i < 12; i++) {
  const a = HUES[i]
  const b = HUES[(i + 5) % HUES.length]
  const sun = 120 + ((i * 97) % 560)
  fs.writeFileSync(path.join(OUT, `photo-${i + 1}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <circle cx="${sun}" cy="140" r="60" fill="#fff" fill-opacity="0.35"/>
  <path d="M0 380 L180 250 L330 360 L470 230 L800 420 L800 500 L0 500 Z" fill="#000" fill-opacity="0.18"/>
  <path d="M0 430 L240 330 L420 420 L600 330 L800 450 L800 500 L0 500 Z" fill="#000" fill-opacity="0.22"/>
</svg>
`)
}

fs.writeFileSync(path.join(OUT, 'illustration.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140">
  <ellipse cx="100" cy="122" rx="70" ry="10" fill="#f0f0f0"/>
  <rect x="50" y="30" width="100" height="80" rx="12" fill="#f5f5f5" stroke="#d9d9d9" stroke-width="2"/>
  <rect x="64" y="48" width="72" height="8" rx="4" fill="#d9d9d9"/>
  <rect x="64" y="64" width="52" height="8" rx="4" fill="#e8e8e8"/>
  <circle cx="140" cy="36" r="14" fill="#2f54eb" fill-opacity="0.15" stroke="#2f54eb" stroke-width="2"/>
</svg>
`)

console.log(`wrote ${fs.readdirSync(OUT).length} files to public/mock-assets`)

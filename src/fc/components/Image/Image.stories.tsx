import type { Meta, StoryObj } from '@storybook/react-vite'
import { Image, ImageGroup, type ImageRatio } from './Image'

// Local stand-in photos (SVG), so stories never depend on the network.
const dish = (bg: string, bowl: string, food: string, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${bowl}" stop-opacity=".55"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><ellipse cx="200" cy="190" rx="130" ry="62" fill="${bowl}"/><ellipse cx="200" cy="170" rx="118" ry="44" fill="${food}"/><circle cx="165" cy="160" r="14" fill="#fff" opacity=".7"/><circle cx="232" cy="168" r="10" fill="#fff" opacity=".6"/><text x="20" y="40" font-family="sans-serif" font-size="22" fill="#fff" opacity=".9">${label}</text></svg>`,
  )}`

const PHO = dish('#ffd591', '#8c4a1a', '#f6c46b', 'Phở bò')
const BUN = dish('#ffadd2', '#a8071a', '#ff7a45', 'Bún bò Huế')
const COM = dish('#b7eb8f', '#3f6600', '#fff1b8', 'Cơm tấm')

const meta = {
  title: 'Components/Data Display/Image',
  component: Image,
  args: { src: PHO, alt: 'Phở bò tái chín', width: 200, height: 200 },
  argTypes: {
    ratio: { control: 'select', options: [undefined, '1:1', '5:4', '4:3', '3:2', '16:10', '16:9', '2:1', '21:9', 'golden', 'a4', 'letter'] },
    fit: { control: 'inline-radio', options: ['cover', 'contain'] },
  },
} satisfies Meta<typeof Image>
export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 'var(--fc-space-margin-lg)', flexWrap: 'wrap', alignItems: 'flex-start' } as const

/** Figma Image: Error=False, State=Default — hover or Tab to it for State=Hover ("Xem trước"). */
export const Playground: Story = {}

/** Figma Image: Error × State. The error box shows when the file fails to load. */
export const States: Story = {
  render: (args) => (
    <div style={row}>
      <Image {...args} />
      <Image {...args} src="/khong-ton-tai.jpg" alt="Ảnh món không tải được" />
      <Image {...args} src={undefined} alt="Chưa có ảnh" />
    </div>
  ),
}

/** No preview: a plain picture (the alt text is its name). */
export const WithoutPreview: Story = { args: { preview: false } }

const RATIOS: ImageRatio[] = ['1:1', '5:4', '4:3', '3:2', '16:10', '16:9', '2:1', '21:9', 'golden', 'a4', 'letter']

/** Figma "Image with Fixed Ratio": every ratio, landscape and portrait. */
export const FixedRatio: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--fc-space-margin-base)' }}>
      {RATIOS.flatMap((r) => [false, true].map((portrait) => (
        <figure key={`${r}-${portrait}`} style={{ margin: 0, display: 'grid', gap: 'var(--fc-space-margin-xxs)' }}>
          <Image src={COM} alt={`Cơm tấm, tỷ lệ ${r}${portrait ? ' dọc' : ''}`} ratio={r} portrait={portrait} width="100%" />
          <figcaption style={{ color: 'var(--fc-color-content-description)', fontSize: 'var(--fc-typography-size-sm)' }}>{r}{portrait ? ' · dọc' : ''}</figcaption>
        </figure>
      )))}
    </div>
  ),
}

/** Figma "Image Preview" (Breakpoint=Desktop): open on load — zoom, rotate, flip and download in the toolbar. */
export const PreviewDesktop: Story = {
  args: { defaultPreviewOpen: true, downloadable: true },
  parameters: { docs: { story: { inline: false } } },
}

/** Figma "Image Preview" (Breakpoint=Mobile): the same viewer at phone width. */
export const PreviewMobile: Story = {
  args: { defaultPreviewOpen: true },
  parameters: { viewport: { defaultViewport: 'mobile1' }, docs: { story: { inline: false } } },
}

/** Several images: the preview shows "1 / 3" and steps with the arrows or ← →. */
export const Group: Story = {
  render: () => (
    <ImageGroup downloadable>
      <div style={row}>
        <Image src={PHO} alt="Phở bò tái chín" width={160} ratio="1:1" />
        <Image src={BUN} alt="Bún bò Huế" width={160} ratio="1:1" />
        <Image src={COM} alt="Cơm tấm sườn bì chả" width={160} ratio="1:1" />
      </div>
    </ImageGroup>
  ),
}

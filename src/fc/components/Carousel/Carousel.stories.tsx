import type { Meta, StoryObj } from '@storybook/react-vite'
import { Carousel } from './Carousel'

// Local stand-in banners (inline SVG): demo content, not UI chrome, so no network.
const banner = (bg: string, fg: string, title: string, sub: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 200"><rect width="480" height="200" fill="${bg}"/><circle cx="400" cy="100" r="70" fill="${fg}" opacity=".35"/><text x="32" y="92" font-family="sans-serif" font-size="28" font-weight="600" fill="#fff">${title}</text><text x="32" y="128" font-family="sans-serif" font-size="16" fill="#fff">${sub}</text></svg>`,
  )}`

const SLIDES = [
  { src: banner('#003eb3', '#69b1ff', 'Combo trưa', 'Chỉ 59.000 ₫ đến 30/10/2026'), alt: 'Combo trưa chỉ 59.000 ₫ đến 30/10/2026' },
  { src: banner('#871400', '#ff9c6e', 'Món mới: Bún bò Huế', 'Có tại mọi chi nhánh'), alt: 'Món mới Bún bò Huế có tại mọi chi nhánh' },
  { src: banner('#135200', '#95de64', 'Giảm 10% hóa đơn', 'Thành viên FABi, từ 01/10/2026'), alt: 'Giảm 10% hóa đơn cho thành viên từ 01/10/2026' },
  { src: banner('#391085', '#b37feb', 'Happy hour 15h–17h', 'Mua 1 tặng 1 trà sữa'), alt: 'Happy hour 15h đến 17h mua 1 tặng 1 trà sữa' },
]

const slides = SLIDES.map((s) => (
  <img key={s.alt} src={s.src} alt={s.alt} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
))

const meta = {
  title: 'Components/Data Display/Carousel',
  component: Carousel,
  args: { children: slides, dotPlacement: 'bottom', arrows: true, dots: true, autoplay: false, infinite: true, 'aria-label': 'Khuyến mãi' },
  argTypes: {
    dotPlacement: { control: 'select', options: ['bottom', 'top', 'start', 'end'] },
    arrows: { control: 'boolean' },
    dots: { control: 'boolean' },
    autoplay: { control: 'boolean' },
    infinite: { control: 'boolean' },
    children: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 480, height: 200 }}><Story /></div>],
} satisfies Meta<typeof Carousel>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Figma `Carousel`: Dot Placement=Bottom, Arrows=True (the Figma default). Use the Mode toolbar for
 * the Dark docs block. Arrow keys move between slides while a dot or an arrow has focus.
 */
export const Default: Story = {}

/**
 * Figma `Dot Placement`: Bottom | Top | Start | End, the four docs examples (all with Arrows=True).
 * Start / End slide vertically and use the Top / Bottom arrows (`Carousel / Arrow` Position).
 */
export const DotPlacement: Story = {
  decorators: [],
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--fc-space-margin-lg)', maxWidth: 984 }}>
      {(['bottom', 'top', 'start', 'end'] as const).map((placement) => (
        <div key={placement} style={{ display: 'grid', gap: 'var(--fc-space-margin-xs)' }}>
          <span style={{ color: 'var(--fc-color-content-description)', fontSize: 'var(--fc-typography-size-sm)' }}>Dot Placement: {placement}</span>
          <div style={{ height: 200 }}>
            <Carousel {...args} dotPlacement={placement} aria-label={`Khuyến mãi (${placement})`} />
          </div>
        </div>
      ))}
    </div>
  ),
}

/** Figma `Arrows`=False: dots only. */
export const WithoutArrows: Story = { args: { arrows: false } }

/** Figma `Arrows`=True with `infinite` off: the arrows dim and disable at the first and last slide. Not a Figma variant. */
export const ArrowsNotInfinite: Story = { args: { infinite: false } }

/**
 * No dots and no arrows (Figma `Arrows`=False with the dots hidden). The carousel region itself
 * becomes focusable: Tab to it, then use Left / Right to change slide. Not a Figma variant; covers keyboard access.
 */
export const KeyboardOnly: Story = { args: { arrows: false, dots: false } }

/** Autoplay every 3 s; pauses while hovered or focused (the slide transition respects reduced motion). */
export const Autoplay: Story = { args: { autoplay: true } }

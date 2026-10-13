// FABi Dark mode: the antd site styles the colour pages for a light page only. In Dark, swatch labels
// take black or white, whichever reads better on the swatch; Light keeps the site's colours.
const luminance = (hex: string) => {
  const f = (i: number) => {
    const v = Number.parseInt(hex.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(1) + 0.7152 * f(3) + 0.0722 * f(5)
}
const isHex = (c?: string): c is string => !!c && /^#[0-9a-f]{6}$/i.test(c)

export const isDarkSurface = (bg?: string) => isHex(bg) && luminance(bg) < 0.2

// 0.179: black and white have the same contrast there (4.58:1)
export const textOn = (bg?: string) => (isHex(bg) ? (luminance(bg) > 0.179 ? '#000' : '#fff') : undefined)

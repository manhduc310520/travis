// Screen sizes of the Viewport toolbar (preview.tsx parameters.viewport), on the theme's breakpoints
// (xs below 576, md 768, lg 992, xl 1200, xxl 1600). The Design Tokens / Responsive page lists them from here,
// so the page and the toolbar never differ.

export type ViewportOption = { name: string; styles: { width: string; height: string }; type: 'mobile' | 'tablet' | 'desktop' }

export const VIEWPORTS: Record<string, ViewportOption> = {
  mobile: { name: 'Mobile 375', styles: { width: '375px', height: '812px' }, type: 'mobile' },
  mobileLg: { name: 'Mobile L 480', styles: { width: '480px', height: '900px' }, type: 'mobile' },
  tablet: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
  laptop: { name: 'Laptop 1280', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
  desktop: { name: 'Desktop 1440', styles: { width: '1440px', height: '900px' }, type: 'desktop' },
  wide: { name: 'Wide 1600', styles: { width: '1600px', height: '1000px' }, type: 'desktop' },
}

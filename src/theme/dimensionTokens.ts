/**
 * Every token in the Figma collection `3. Dimensions`, both modes.
 *
 * `Default` and `Compact` are a density axis, independent of brand and of
 * light/dark. Ant Design has no built-in density switch, so this table is what
 * makes one exist: pass the chosen column into `ConfigProvider` and the whole
 * library retunes.
 *
 * Base padding is 16, not Ant Design's own default — the design system moved it
 * down from 24.
 */
export type Density = 'default' | 'compact'

export const DENSITIES: Density[] = ['default', 'compact']

type DimensionSet = Record<string, number>

export const dimensionTokens: Record<Density, DimensionSet> = {
  default: {
    // Border radius
    borderRadius: 6, borderRadiusLG: 8, borderRadiusSM: 4, borderRadiusXS: 2,
    // Base sizes
    sizeStep: 4, sizeUnit: 4, sizePopupArrow: 16, controlInteractiveSize: 16,
    size: 16, sizeXXS: 4, sizeXS: 8, sizeSM: 12, sizeMS: 16, sizeMD: 20, sizeLG: 24, sizeXL: 32, sizeXXL: 48,
    // Control heights
    controlHeight: 32, controlHeightLG: 40, controlHeightSM: 24, controlHeightXS: 16,
    // Line widths
    lineWidth: 1, lineWidthBold: 2, lineWidthFocus: 4, controlOutlineWidth: 2,
    // Margin
    margin: 16, marginXXS: 4, marginXS: 8, marginSM: 12, marginMD: 20, marginLG: 24, marginXL: 32, marginXXL: 48,
    // Padding
    padding: 16, paddingXXS: 4, paddingXS: 8, paddingSM: 12, paddingMD: 20, paddingLG: 24, paddingXL: 32,
    paddingContentHorizontal: 16, paddingContentHorizontalLG: 24, paddingContentHorizontalSM: 16,
    paddingContentVertical: 12, paddingContentVerticalLG: 16, paddingContentVerticalSM: 8,
    controlPaddingHorizontal: 12, controlPaddingHorizontalSM: 8,
  },
  compact: {
    borderRadius: 6, borderRadiusLG: 8, borderRadiusSM: 4, borderRadiusXS: 2,
    sizeStep: 2, sizeUnit: 4, sizePopupArrow: 16, controlInteractiveSize: 14,
    size: 8, sizeXXS: 4, sizeXS: 4, sizeSM: 8, sizeMS: 12, sizeMD: 16, sizeLG: 16, sizeXL: 32, sizeXXL: 48,
    controlHeight: 28, controlHeightLG: 35, controlHeightSM: 21, controlHeightXS: 14,
    lineWidth: 1, lineWidthBold: 2, lineWidthFocus: 4, controlOutlineWidth: 2,
    margin: 8, marginXXS: 4, marginXS: 4, marginSM: 8, marginMD: 16, marginLG: 16, marginXL: 32, marginXXL: 48,
    padding: 8, paddingXXS: 4, paddingXS: 4, paddingSM: 8, paddingMD: 16, paddingLG: 16, paddingXL: 32,
    paddingContentHorizontal: 12, paddingContentHorizontalLG: 16, paddingContentHorizontalSM: 8,
    paddingContentVertical: 8, paddingContentVerticalLG: 12, paddingContentVerticalSM: 4,
    controlPaddingHorizontal: 12, controlPaddingHorizontalSM: 8,
  },
}

/** Breakpoints do not change with density. */
export const screenTokens = {
  screenXS: 480, screenXSMin: 480, screenXSMax: 575,
  screenSM: 576, screenSMMin: 576, screenSMMax: 767,
  screenMD: 768, screenMDMin: 768, screenMDMax: 991,
  screenLG: 992, screenLGMin: 992, screenLGMax: 1199,
  screenXL: 1200, screenXLMin: 1200, screenXLMax: 1599,
  screenXXL: 1600, screenXXLMin: 1600,
} as const

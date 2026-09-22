/**
 * The whole semantic colour layer, exported from Figma.
 *
 * Passing only the seeds and letting Ant Design's algorithm derive the rest
 * does not reproduce the design system: the algorithm generates its ramp from
 * the seed, and FABi's seeds sit at step 8 of the base ramp rather than step 6,
 * so every derived tint came out darker than Figma. Tags were the clearest
 * symptom — `colorSuccessBg` resolved several steps too saturated.
 *
 * So the derived values ship too. `Colors/Brand/*` and `Colors/Neutral/*` in
 * Figma are named exactly like Ant Design's global tokens, which makes the
 * mapping one to one.
 *
 * 28 of the 105 tokens change with the brand; the other 77 do not, so they are
 * stored once per colour mode instead of ten times.
 */
export type Brand = 'blue' | 'green' | 'yellow' | 'magenta' | 'orange'
export type Mode = 'light' | 'dark'

type Tokens = Record<string, string>

/** Neutrals plus success, warning and error — identical in every brand. */
export const semanticFixed: Record<Mode, Tokens> = {
  light: {
    colorText: 'rgba(0,0,0,0.88)', colorTextSecondary: 'rgba(0,0,0,0.65)',
    colorTextTertiary: 'rgba(0,0,0,0.45)', colorTextQuaternary: 'rgba(0,0,0,0.25)',
    colorTextLightSolid: '#FFFFFF', colorTextHeading: 'rgba(0,0,0,0.88)',
    colorTextLabel: 'rgba(0,0,0,0.65)', colorTextDescription: 'rgba(0,0,0,0.45)',
    colorTextDisabled: 'rgba(0,0,0,0.25)', colorTextPlaceholder: 'rgba(0,0,0,0.25)',
    colorIcon: 'rgba(0,0,0,0.45)', colorIconHover: 'rgba(0,0,0,0.88)',
    colorBgContainer: '#FFFFFF', colorBgElevated: '#FFFFFF', colorBgLayout: '#F5F5F5',
    colorBgMask: 'rgba(0,0,0,0.45)', colorBgSpotlight: 'rgba(0,0,0,0.85)',
    colorBorder: '#D9D9D9', colorBorderSecondary: '#F0F0F0',
    colorFill: 'rgba(0,0,0,0.15)', colorFillSecondary: 'rgba(0,0,0,0.06)',
    colorFillTertiary: 'rgba(0,0,0,0.04)', colorFillQuaternary: 'rgba(0,0,0,0.02)',
    colorWhite: '#FFFFFF', colorBgBase: '#FFFFFF', colorTextBase: '#000000',
    colorBgContainerDisabled: 'rgba(0,0,0,0.04)', colorBgTextActive: 'rgba(0,0,0,0.15)',
    colorBgTextHover: 'rgba(0,0,0,0.06)', colorBorderBg: '#FFFFFF',
    colorFillContent: 'rgba(0,0,0,0.06)', colorFillContentHover: 'rgba(0,0,0,0.15)',
    colorFillAlter: 'rgba(0,0,0,0.02)', colorSplit: 'rgba(0,0,0,0.06)',
    colorSuccess: '#237804', colorWarning: '#D48806', colorError: '#CF1322',
    colorErrorBg: '#FFCCC7', colorErrorBgHover: '#FFF1F0', colorErrorBorder: '#FFCCC7',
    colorErrorBorderHover: '#FFA39E', colorErrorHover: '#FF7875', colorErrorActive: '#D9363E',
    colorErrorTextHover: '#FF7875', colorErrorText: '#FF4D4F', colorErrorTextActive: '#D9363E',
    colorSuccessBg: '#D9F7BE', colorSuccessBgHover: '#D9F7BE', colorSuccessBorder: '#B7EB8F',
    colorSuccessBorderHover: '#95DE64', colorSuccessHover: '#95DE64', colorSuccessActive: '#389E0D',
    colorSuccessTextHover: '#73D13D', colorSuccessText: '#52C41A', colorSuccessTextActive: '#389E0D',
    colorWarningBg: '#FFF1B8', colorWarningBgHover: '#FFF1B8', colorWarningBorder: '#FFE58F',
    colorWarningBorderHover: '#FFD666', colorWarningHover: '#FFD666', colorWarningActive: '#D48806',
    colorWarningTextHover: '#FFC53D', colorWarningText: '#FAAD14', colorWarningTextActive: '#D48806',
    colorErrorOutline: 'rgba(255,38,6,0.06)', colorWarningOutline: 'rgba(255,215,5,0.1)',
    controlItemBgActiveDisabled: 'rgba(0,0,0,0.15)', controlItemBgHover: 'rgba(0,0,0,0.04)',
    controlTmpOutline: 'rgba(0,0,0,0.02)', colorFillAlterSolid: '#FAFAFA',
    colorFilledHandleBg: '#F0F0F0', colorBgSolid: '#000000',
    colorBgSolidActive: 'rgba(0,0,0,0.95)', colorBgSolidHover: 'rgba(0,0,0,0.75)',
  },
  dark: {
    colorText: 'rgba(255,255,255,0.85)', colorTextSecondary: 'rgba(255,255,255,0.65)',
    colorTextTertiary: 'rgba(255,255,255,0.45)', colorTextQuaternary: 'rgba(255,255,255,0.25)',
    colorTextLightSolid: '#FFFFFF', colorTextHeading: 'rgba(255,255,255,0.85)',
    colorTextLabel: 'rgba(255,255,255,0.65)', colorTextDescription: 'rgba(255,255,255,0.45)',
    colorTextDisabled: 'rgba(255,255,255,0.25)', colorTextPlaceholder: 'rgba(255,255,255,0.25)',
    colorIcon: 'rgba(255,255,255,0.45)', colorIconHover: 'rgba(255,255,255,0.85)',
    colorBgContainer: '#141414', colorBgElevated: '#1F1F1F', colorBgLayout: '#000000',
    colorBgMask: 'rgba(0,0,0,0.45)', colorBgSpotlight: '#424242',
    colorBorder: '#424242', colorBorderSecondary: '#303030',
    colorFill: 'rgba(255,255,255,0.18)', colorFillSecondary: 'rgba(255,255,255,0.12)',
    colorFillTertiary: 'rgba(255,255,255,0.08)', colorFillQuaternary: 'rgba(255,255,255,0.04)',
    colorWhite: '#FFFFFF', colorBgBase: '#000000', colorTextBase: '#FFFFFF',
    colorBgContainerDisabled: 'rgba(255,255,255,0.08)', colorBgTextActive: 'rgba(255,255,255,0.18)',
    colorBgTextHover: 'rgba(255,255,255,0.12)', colorBorderBg: '#141414',
    colorFillContent: 'rgba(255,255,255,0.12)', colorFillContentHover: 'rgba(255,255,255,0.18)',
    colorFillAlter: 'rgba(255,255,255,0.04)', colorSplit: 'rgba(255,255,255,0.06)',
    colorSuccess: '#6ABE39', colorWarning: '#D89614', colorError: '#DC4446',
    colorErrorBg: '#2C1618', colorErrorBgHover: '#451D1F', colorErrorBorder: '#5B2526',
    colorErrorBorderHover: '#7E2E2F', colorErrorHover: '#E86E6B', colorErrorActive: '#AD393A',
    colorErrorTextHover: '#E86E6B', colorErrorText: '#DC4446', colorErrorTextActive: '#AD393A',
    colorSuccessBg: '#162312', colorSuccessBgHover: '#1D3712', colorSuccessBorder: '#274916',
    colorSuccessBorderHover: '#306317', colorSuccessHover: '#306317', colorSuccessActive: '#3C8618',
    colorSuccessTextHover: '#6ABE39', colorSuccessText: '#49AA19', colorSuccessTextActive: '#3C8618',
    colorWarningBg: '#2B2111', colorWarningBgHover: '#443111', colorWarningBorder: '#594214',
    colorWarningBorderHover: '#7C5914', colorWarningHover: '#7C5914', colorWarningActive: '#AA7714',
    colorWarningTextHover: '#E8B339', colorWarningText: '#D89614', colorWarningTextActive: '#AA7714',
    colorErrorOutline: 'rgba(238,38,56,0.11)', colorWarningOutline: 'rgba(173,107,0,0.15)',
    controlItemBgActiveDisabled: 'rgba(255,255,255,0.18)', controlItemBgHover: 'rgba(255,255,255,0.08)',
    controlTmpOutline: 'rgba(255,255,255,0.04)', colorFillAlterSolid: '#1D1D1D',
    colorFilledHandleBg: '#303030', colorBgSolid: 'rgba(255,255,255,0.95)',
    colorBgSolidActive: 'rgba(255,255,255,0.9)', colorBgSolidHover: '#FFFFFF',
  },
}

const b = (
  colorPrimary: string, bg: string, bgHover: string, border: string, borderHover: string,
  hover: string, active: string, text: string, textHover: string, textActive: string,
  outline: string, headStart: string, headEnd: string,
): Tokens => ({
  colorPrimary, colorInfo: colorPrimary, colorLink: colorPrimary,
  colorPrimaryBg: bg, colorPrimaryBgHover: bgHover,
  colorPrimaryBorder: border, colorPrimaryBorderHover: borderHover,
  colorPrimaryHover: hover, colorPrimaryActive: active,
  colorPrimaryText: text, colorPrimaryTextHover: textHover, colorPrimaryTextActive: textActive,
  colorInfoBg: bg, colorInfoBgHover: bgHover,
  colorInfoBorder: border, colorInfoBorderHover: borderHover,
  colorInfoHover: hover, colorInfoActive: active,
  colorInfoText: text, colorInfoTextHover: textHover, colorInfoTextActive: textActive,
  colorLinkHover: hover, colorLinkActive: active,
  controlItemBgActive: bg, controlItemBgActiveHover: bgHover,
  controlOutline: outline,
  colorHeaderBgStart: headStart, colorHeaderBgEnd: headEnd,
})

/** The 28 tokens that move with the brand. */
export const semanticBrand: Record<`${Brand}.${Mode}`, Tokens> = {
  'blue.light': b('#003EB3', '#E6F4FF', '#BAE0FF', '#91CAFF', '#69B1FF', '#4096FF', '#0958D9', '#1677FF', '#4096FF', '#0958D9', 'rgba(22,119,255,0.1)', '#003EB3', '#0958D9'),
  'blue.dark': b('#1668DC', '#111A2C', '#112545', '#15325B', '#15417E', '#3C89E8', '#1554AD', '#1668DC', '#3C89E8', '#1554AD', 'rgba(21,84,173,0.15)', '#111A2C', '#112545'),
  'green.light': b('#237804', '#F6FFED', '#D9F7BE', '#B7EB8F', '#95DE64', '#73D13D', '#389E0D', '#52C41A', '#73D13D', '#389E0D', 'rgba(82,196,26,0.1)', '#135200', '#237804'),
  'green.dark': b('#3C8618', '#162312', '#1D3712', '#274916', '#306317', '#6ABE39', '#3C8618', '#49AA19', '#6ABE39', '#3C8618', 'rgba(60,134,24,0.15)', '#162312', '#1D3712'),
  'yellow.light': b('#AD8B00', '#FEFFE6', '#FFFFB8', '#FFFB8F', '#FFF566', '#FFEC3D', '#D4B106', '#FADB14', '#FFEC3D', '#D4B106', 'rgba(250,219,20,0.1)', '#614700', '#876800'),
  'yellow.dark': b('#7C6E14', '#2B2611', '#443B11', '#595014', '#7C6E14', '#E8D639', '#AA9514', '#D8BD14', '#E8D639', '#AA9514', 'rgba(170,149,20,0.15)', '#2B2611', '#443B11'),
  'magenta.light': b('#9E1068', '#FFF0F6', '#FFD6E7', '#FFADD2', '#FF85C0', '#F759AB', '#C41D7F', '#EB2F96', '#F759AB', '#C41D7F', 'rgba(235,47,150,0.1)', '#780650', '#C41D7F'),
  'magenta.dark': b('#CB2B83', '#291321', '#40162F', '#551C3B', '#75204F', '#E0529C', '#A02669', '#CB2B83', '#E0529C', '#A02669', 'rgba(160,38,105,0.15)', '#291321', '#40162F'),
  'orange.light': b('#AD4E00', '#FFF7E6', '#FFE7BA', '#FFD591', '#FFC069', '#FFA940', '#D46B08', '#FA8C16', '#FFA940', '#D46B08', 'rgba(250,140,22,0.1)', '#873800', '#AD4E00'),
  'orange.dark': b('#AA6215', '#2B1D11', '#442A11', '#593815', '#7C4A15', '#E89A3C', '#AA6215', '#D87A16', '#E89A3C', '#AA6215', 'rgba(170,98,21,0.15)', '#2B1D11', '#442A11'),
}

/** Not Ant Design tokens — they ship as CSS variables instead. */
export const CUSTOM_KEYS = ['colorHeaderBgStart', 'colorHeaderBgEnd'] as const

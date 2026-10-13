// StatisticCard: one figure of a dashboard, built from Card + Statistic + Tag + Skeleton (user 2026-10-13).
// New because no existing component has the figure, the trend tag, the comparison line and the icon tile
// together. ONE component for every dashboard figure (no near-duplicates, user rule):
//   type="default": white card, icon tile and a soft tint of the category colour at the bottom ("Tổng hoá đơn 60")
//   type="primary": the brand surface for the headline figure ("Doanh thu (Gross)"), like Button type="primary"
// The category colour only tells cards apart (CLAUDE.md: palette colours are for categories).
import { presetDarkPalettes, presetPalettes } from '@ant-design/colors'
import { Button, Card, ConfigProvider, Flex, Skeleton, Statistic, Tag, Typography, theme as antdTheme } from 'antd'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { ArrowDownLine, ArrowUpLine, MinusLine, RefreshCw01Line } from './fabi-icons.js'
import { FONT_WEIGHT_MEDIUM, fabiDarkAlgorithm } from './theme.js'
import { useFabiLang } from './useFabiLang.js'

/** Category colours: antd's preset palettes */
export type StatisticCardColor = 'blue' | 'geekblue' | 'cyan' | 'green' | 'lime' | 'gold' | 'orange' | 'volcano' | 'red' | 'magenta' | 'purple'

export interface StatisticCardProps {
  /** 'default': white card with an icon tile; 'primary': the brand surface for the headline figure */
  type?: 'default' | 'primary'
  /** Label, e.g. "Total invoices" (a ReactNode, so it can be a Dropdown that switches the figure) */
  title: ReactNode
  /** The figure; null / undefined shows the empty state */
  value?: number | null
  /** Unit after the figure, e.g. "₫" (none by default: counts have no unit) */
  suffix?: ReactNode
  /** Decimals (default 0) */
  precision?: number
  /** Change against the comparison period, in percent: > 0 up, < 0 down, 0 unchanged */
  trend?: number
  /** Comparison text after the trend, e.g. "vs. 01/05 – 31/05" */
  comparison?: ReactNode
  /** Secondary line, e.g. "Average 160.266 ₫ per invoice" */
  description?: ReactNode
  /** Content under the figure, e.g. Tags */
  extra?: ReactNode
  /** Icon in the tile (type="default"; decorative): an icon font, or artwork that fills the tile
   *  (absolutely positioned children; the tile is the positioned, clipping box) */
  icon?: ReactNode
  /** Category colour of the tile and the tint (type="default"; default 'blue') */
  color?: StatisticCardColor
  /** Loading state: keeps the card, replaces the figure with a skeleton */
  loading?: boolean
  /** Error state: message shown instead of the figure */
  error?: ReactNode
  /** Retry action in the error state */
  onRetry?: () => void
  /** Text of the empty state (default: "No data yet" in the app language) */
  emptyText?: ReactNode
  /** Makes the whole card a button (e.g. open the detail report): hover and focus states */
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

const TREND = {
  up: { color: 'success', icon: <ArrowUpLine />, label: { vi: 'Tăng', en: 'Up' } },
  down: { color: 'error', icon: <ArrowDownLine />, label: { vi: 'Giảm', en: 'Down' } },
  flat: { color: 'default', icon: <MinusLine />, label: { vi: 'Không đổi', en: 'No change' } },
} as const

/** "8%", "12,5%": vi-VN decimal comma, like the figures */
const percent = (n: number) => `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(Math.abs(n))}%`

/** Dark surfaces: antd's dark container is #141414, light is #ffffff */
function isDark(hex: string) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!m) return false
  const n = parseInt(m[1], 16)
  return 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255) < 128
}

/**
 * The primary surface's dot grid, as designed: a navy layer (26, 26, 46) with white dots at 20% on it,
 * the whole layer at 20% over the brand gradient; dots 4.6px across, every 20px, 10px off the card's
 * centre. Both colours of the layer are flattened here (dot: navy 80% + white 20% = 72, 72, 88), so one
 * 20% image composites to the same pixels. The 0.4px ramp at the dot edge is its anti-aliasing.
 */
const DOT_GRID =
  'radial-gradient(circle, rgba(72, 72, 88, 0.2) 2.1px, rgba(26, 26, 46, 0.2) 2.5px) calc(50% + 10px) calc(50% + 10px) / 20px 20px'

export function StatisticCard({
  type = 'default',
  title,
  value,
  suffix,
  precision = 0,
  trend,
  comparison,
  description,
  extra,
  icon,
  color = 'blue',
  loading = false,
  error,
  onRetry,
  emptyText,
  onClick,
  className,
  style,
}: StatisticCardProps) {
  const { token } = antdTheme.useToken()
  // built-in texts: Vietnamese by default, English with an English antd locale
  const lang = useFabiLang()
  const primary = type === 'primary'
  // primary: white on the brand gradient (two steps below the primary → the primary; light ≥ 4.5:1 on
  // every brand, dark: antd's dark fills ≥ 6.7:1), darkened 20% more by the dot layer.
  // default: the theme's own text colours; title and description in colorTextSecondary, as designed.
  const onSolid = token.colorTextLightSolid
  const textColor = primary ? onSolid : undefined
  const secondary = { style: { color: primary ? onSolid : token.colorTextSecondary } }
  // default: light palette tint step 1, icon step 7; dark palette (antd's, mixed on #141414) tint 2, icon 8
  const dark = isDark(token.colorBgContainer)
  const p = (dark ? presetDarkPalettes : presetPalettes)[color] ?? presetPalettes.blue
  const tint = dark ? p[1] : p[0]
  const empty = !loading && !error && (value === null || value === undefined)
  const dir = trend === undefined ? undefined : trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat'
  // figure: Heading 3 (24 / 32) on the primary surface, Heading 5 (16 / 24) on a default card
  const valueSize = primary ? token.fontSizeHeading3 : token.fontSizeHeading5
  const valueLineHeight = primary ? token.lineHeightHeading3 : token.lineHeightHeading5
  const keyDown = onClick ? (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined

  const skeleton = <Skeleton active title={{ width: '45%' }} paragraph={{ rows: 1, width: '75%' }} />
  const body = loading ? (
    // on the brand surface the skeleton takes the dark theme's light-on-dark shades
    primary ? <ConfigProvider theme={{ algorithm: fabiDarkAlgorithm }}>{skeleton}</ConfigProvider> : skeleton
  ) : error ? (
    <Flex align="center" gap="small" wrap>
      <Typography.Text style={{ color: textColor }}>{error}</Typography.Text>
      {onRetry && (
        <Button size={primary ? 'middle' : 'small'} ghost={primary} icon={<RefreshCw01Line />} onClick={(e) => { e.stopPropagation(); onRetry() }}>
          {lang === 'en' ? 'Retry' : 'Thử lại'}
        </Button>
      )}
    </Flex>
  ) : empty ? (
    <Flex align="baseline" gap="middle" wrap>
      <Typography.Text strong style={{ color: textColor, fontSize: valueSize, lineHeight: valueLineHeight }} aria-hidden>—</Typography.Text>
      <Typography.Text {...secondary}>{emptyText ?? (lang === 'en' ? 'No data yet' : 'Chưa có dữ liệu')}</Typography.Text>
    </Flex>
  ) : (
    <>
      <Flex align="center" gap={token.marginSM} wrap>
        <Statistic
          value={value as number}
          precision={precision}
          groupSeparator="."
          decimalSeparator=","
          suffix={suffix}
          styles={{ content: { color: textColor, fontSize: valueSize, lineHeight: valueLineHeight, fontWeight: token.fontWeightStrong } }}
        />
        {dir && (
          <Tag color={TREND[dir].color} icon={TREND[dir].icon} variant="filled" style={{ marginInlineEnd: 0 }}>
            <span className="fabi-sr-only">{TREND[dir].label[lang]} </span>
            {percent(trend as number)}
          </Tag>
        )}
        {comparison && <Typography.Text {...secondary}>{comparison}</Typography.Text>}
      </Flex>
    </>
  )
  // under the title / figure and the icon tile, across the whole card (the tile only sits beside the figure)
  const details = !loading && !error && (description || extra) ? (
    <>
      {description && <Typography.Text {...secondary}>{description}</Typography.Text>}
      {extra && <div>{extra}</div>}
    </>
  ) : null

  return (
    <Card
      variant={primary ? 'borderless' : undefined}
      hoverable={!!onClick}
      onClick={onClick}
      onKeyDown={keyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : 'group'}
      aria-busy={loading || undefined}
      className={className}
      style={{
        background: primary
          ? `${DOT_GRID}, linear-gradient(180deg, ${token.colorPrimaryActive} 0%, ${token.colorPrimary} 100%)`
          : `linear-gradient(180deg, ${token.colorBgContainer} 45%, ${tint} 100%)`,
        color: textColor,
        cursor: onClick ? 'pointer' : undefined,
        height: '100%',
        ...style,
      }}
    >
      <Flex vertical gap={primary ? token.margin : token.marginXXS}>
      <Flex justify="space-between" align="flex-start" gap={token.marginLG}>
        <Flex vertical gap={primary ? token.margin : token.marginXXS} style={{ minWidth: 0, flex: 1 }}>
          <Typography.Text {...secondary} style={{ ...secondary.style, fontWeight: primary ? undefined : FONT_WEIGHT_MEDIUM }}>
            {title}
          </Typography.Text>
          {body}
        </Flex>
        {icon && !primary && (
          <Flex
            align="center"
            justify="center"
            aria-hidden
            style={{
              position: 'relative',
              overflow: 'hidden',
              width: token.controlHeightLG,
              height: token.controlHeightLG,
              borderRadius: token.borderRadius,
              background: tint,
              color: p[dark ? 7 : 6],
              fontSize: token.fontSizeHeading4,
              flex: 'none',
            }}
          >
            {icon}
          </Flex>
        )}
      </Flex>
      {details}
      </Flex>
    </Card>
  )
}

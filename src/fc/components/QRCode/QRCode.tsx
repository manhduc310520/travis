import { useMemo, type CSSProperties, type ReactNode } from 'react'
import qrcode from 'qrcode-generator'
import { CheckCircle } from '../../../icons'
import { cx } from '../../space'
import { Button } from '../Button/Button'
import { Spin } from '../Spin/Spin'
import styles from './QRCode.module.css'

export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H'
/** Figma `QR Code` → `Type`: Basic = `active`, Loading = `loading`, Expired = `expired`. `scanned` is code-only. */
export type QRCodeStatus = 'active' | 'loading' | 'expired' | 'scanned'

export interface QRCodeProps {
  /** Text or URL encoded into the code (UTF-8, so Vietnamese text is safe). */
  value: string
  /** Outer width and height in px, frame included. Figma: 160. */
  size?: number
  /** Error correction level. Use `H` when an `icon` covers the centre. */
  errorLevel?: QRCodeErrorLevel
  /** Hairline frame (Color/Border/Neutral-Faded) + Space/Padding/SM (Figma `Type=Basic`). Turn off inside a Popover, whose surface already gives the 12px padding (Figma `Type=Popover`); then use `size={136}` so the whole panel stays 160. */
  bordered?: boolean
  /** Figma `Type`: overlay state. `loading` shows the Spin, `expired` a refresh action, `scanned` a done mark. */
  status?: QRCodeStatus
  /** Called by the "Làm mới" (Refresh) action of the `expired` overlay; without it the overlay has no action. */
  onRefresh?: () => void
  /** Centre mark (logo), e.g. an inline SVG. Keep it under ~20% of the size and use `errorLevel="H"`. */
  icon?: ReactNode
  /** Side of the centre mark in px. Default 40. */
  iconSize?: number
  /** Module colour (any CSS colour, prefer a `--fc-*` variable). Default Color/Content/Neutral-Strong (Figma "Vector" fill). */
  color?: string
  /** Background colour. Default Color/Background/Container. Inside a Popover pass `var(--fc-color-background-elevated)` (Figma `Type=Popover` fill). */
  bgColor?: string
  /** Name of the image for assistive tech. Default "Mã QR: {value}". */
  'aria-label'?: string
  /** Expired overlay text. Default "Mã QR đã hết hạn". */
  expiredText?: ReactNode
  /** Refresh action label. Default "Làm mới". */
  refreshText?: ReactNode
  /** Scanned overlay text. Default "Đã quét". */
  scannedText?: ReactNode
  /** Loading status for assistive tech. Default "Đang tạo mã QR…". */
  loadingText?: string
  className?: string
  style?: CSSProperties
}

/** Encodes `value` as UTF-8 bytes (qrcode-generator reads each char code as one byte). */
function toByteString(value: string) {
  const bytes = new TextEncoder().encode(value)
  let out = ''
  for (const b of bytes) out += String.fromCharCode(b)
  return out
}

/** One SVG path for all dark modules, in module units. */
function useQrPath(value: string, errorLevel: QRCodeErrorLevel) {
  return useMemo(() => {
    const qr = qrcode(0, errorLevel)
    qr.addData(toByteString(value), 'Byte')
    qr.make()
    const count = qr.getModuleCount()
    let d = ''
    for (let row = 0; row < count; row += 1) {
      for (let col = 0; col < count; col += 1) {
        if (qr.isDark(row, col)) d += `M${col} ${row}h1v1h-1z`
      }
    }
    return { d, count }
  }, [value, errorLevel])
}

/**
 * Figma "❖ QRCode" (set `QR Code`, property `Type`: Basic / Popover / Loading / Expired).
 * The code is an inline SVG (`role="img"`) drawn in `currentColor`
 * (Color/Content/Neutral-Strong) on Color/Background/Container, inside a hairline
 * frame (Color/Border/Neutral-Faded, Radius/LG, Space/Padding/SM).
 * Non-`active` states cover it with a 96% mask and a status: the fc `Spin`
 * (loading), a text + link Button "Làm mới" at the default size (expired), or a
 * check (scanned, code-only).
 * For `Type=Popover`, put a borderless 136px QRCode on `--fc-color-background-elevated`
 * in the fc `Popover` (padding Component/Popover/Padding = 12, so the panel is 160).
 */
export function QRCode({
  value,
  size = 160,
  errorLevel = 'M',
  bordered = true,
  status = 'active',
  onRefresh,
  icon,
  iconSize = 40,
  color,
  bgColor,
  'aria-label': ariaLabel,
  expiredText = 'Mã QR đã hết hạn',
  refreshText = 'Làm mới',
  scannedText = 'Đã quét',
  loadingText = 'Đang tạo mã QR…',
  className,
  style,
}: QRCodeProps) {
  const { d, count } = useQrPath(value, errorLevel)
  const vars = {
    '--_size': `${size}px`,
    '--_icon-size': `${iconSize}px`,
    ...(color ? { '--_color': color } : null),
    ...(bgColor ? { '--_bg': bgColor } : null),
    ...style,
  } as CSSProperties
  const masked = status !== 'active'

  return (
    <div
      className={cx(styles.qr, bordered && styles.bordered, masked && styles.masked, className)}
      style={vars}
      data-status={status}
    >
      <svg
        className={styles.code}
        viewBox={`0 0 ${count} ${count}`}
        role="img"
        aria-label={ariaLabel ?? `Mã QR: ${value}`}
        aria-hidden={masked || undefined}
        shapeRendering="crispEdges"
      >
        <path d={d} fill="currentColor" />
      </svg>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {masked && (
        <div className={styles.mask}>
          {status === 'loading' && <Spin label={loadingText} />}
          {status === 'expired' && (
            <div className={styles.message} role="status">
              <span className={styles.text}>{expiredText}</span>
              {onRefresh && (
                <Button variant="link" onPress={onRefresh}>
                  {refreshText}
                </Button>
              )}
            </div>
          )}
          {status === 'scanned' && (
            <div className={styles.message} role="status">
              <CheckCircle className={styles.scannedIcon} aria-hidden="true" />
              <span className={styles.text}>{scannedText}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

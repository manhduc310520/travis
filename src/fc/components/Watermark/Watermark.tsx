import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../space'
import styles from './Watermark.module.css'

/**
 * Figma `Watermark` symbol: a 1440 × 900 frame of 4 rows × 4 `Watermark Item`
 * instances, i.e. one mark every 360 × 225. Target pitch, passed to CSS as
 * custom properties (the fc scale has no step this large).
 */
const DEFAULT_TILE: [number, number] = [360, 225]

/** Grid before the first measurement: the Figma 4 × 4. */
const FALLBACK_GRID: [number, number] = [4, 4]

export interface WatermarkProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /**
   * Figma `Watermark / Watermark Item` text ("iPOS.com"). An array draws one
   * line per entry inside each mark. Ignored when `image` is set.
   */
  content?: string | string[]
  /**
   * Replaces the text with a graphic (an inline SVG or icon node, or an image
   * URL). Give it its own low-contrast colour; the layer only sets `currentColor`.
   */
  image?: ReactNode
  /** Rotation of each mark in degrees. Figma rotates the item text 22° counter-clockwise, so the default is -22. */
  rotate?: number
  /**
   * Target distance between mark centres, `[x, y]` in px. Default `[360, 225]`
   * (the Figma column / row pitch). Like the Figma rows and items (Fill), the
   * cells stretch so the marks spread evenly over the whole area: the layer
   * uses the nearest whole number of columns and rows, at least one each.
   */
  tileSize?: [number, number]
  /** The content the watermark sits on. It stays fully interactive: the mark layer ignores the pointer. */
  children?: ReactNode
}

/**
 * Figma "❖ Watermark" — repeats a faint, rotated brand or ownership mark over
 * a block of content (reports, receipts, screenshots of the CMS). The mark is
 * decorative: hidden from assistive tech and transparent to the pointer.
 *
 * Text follows Figma `Text LG/Regular` with fill `Color/Fill/Neutral-Strong`,
 * so it adapts to Light / Dark. Marks sit in the centre of evenly stretched
 * cells, as the Figma items do (Fill rows, centre constraints). Unlike antd it is drawn with DOM + CSS (no
 * canvas) and does not guard against the layer being removed in devtools.
 */
export function Watermark({
  content = 'iPOS.com',
  image,
  rotate = -22,
  tileSize = DEFAULT_TILE,
  className,
  style,
  children,
  ...rest
}: WatermarkProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [[cols, rows], setGrid] = useState<[number, number]>(FALLBACK_GRID)
  const [tileW, tileH] = tileSize

  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const measure = () => {
      const nextCols = Math.max(1, Math.round(el.clientWidth / Math.max(1, tileW)))
      const nextRows = Math.max(1, Math.round(el.clientHeight / Math.max(1, tileH)))
      setGrid((prev) => (prev[0] === nextCols && prev[1] === nextRows ? prev : [nextCols, nextRows]))
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [tileW, tileH])

  const lines = Array.isArray(content) ? content : [content]
  const mark =
    image == null ? (
      <span className={styles.text}>
        {lines.map((line, i) => (
          <span key={i} className={styles.line}>
            {line}
          </span>
        ))}
      </span>
    ) : typeof image === 'string' ? (
      <img className={styles.image} src={image} alt="" draggable={false} />
    ) : (
      image
    )

  const vars = {
    '--_tile-w': `${tileW}px`,
    '--_cols': cols,
    '--_rows': rows,
    '--_rotate': `${rotate}deg`,
  } as CSSProperties

  return (
    <div ref={rootRef} className={cx(styles.root, className)} style={style} {...rest}>
      {children}
      <div className={styles.layer} style={vars} aria-hidden="true" data-fc-watermark="">
        {Array.from({ length: cols * rows }, (_, i) => (
          <span key={i} className={styles.tile}>
            <span className={styles.mark}>{mark}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

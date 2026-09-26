import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { Button as AriaButton, Dialog, Modal as AriaModal, ModalOverlay } from 'react-aria-components'
import {
  ChevronLeft,
  ChevronRight,
  Download01,
  Eye,
  Image01,
  RefreshCcw01,
  RefreshCw01,
  SwitchHorizontal01,
  SwitchVertical01,
  X,
  ZoomIn,
  ZoomOut,
} from '../../../icons'
import { cx } from '../../space'
import { usePortalReady } from '../Modal/useOpenState'
import styles from './Image.module.css'

/** Figma "Image with Fixed Ratio". Landscape by default; `portrait` flips it. */
export type ImageRatio = '1:1' | '5:4' | '4:3' | '3:2' | '16:10' | '16:9' | '2:1' | '21:9' | 'golden' | 'a4' | 'letter'

const RATIO: Record<ImageRatio, [number, number]> = {
  '1:1': [1, 1], '5:4': [5, 4], '4:3': [4, 3], '3:2': [3, 2], '16:10': [16, 10], '16:9': [16, 9],
  '2:1': [2, 1], '21:9': [21, 9], golden: [1.618, 1], a4: [297, 210], letter: [11, 8.5],
}

export interface ImageProps {
  src?: string
  /** Describes the picture; also names the preview button ("Xem trước: …"). */
  alt: string
  width?: number | string
  height?: number | string
  /** Fixed aspect ratio (Figma "Image with Fixed Ratio"); the image fills it. */
  ratio?: ImageRatio
  portrait?: boolean
  /** `cover` crops to fill (default), `contain` shows the whole picture. */
  fit?: 'cover' | 'contain'
  /** Click to open the preview (Figma State=Hover shows "Xem trước"). `{ src }` previews a larger file. */
  preview?: boolean | { src?: string }
  /** Shown when the picture fails to load (Figma Error=True). Defaults to a grey box with an image icon. */
  fallback?: ReactNode
  /** Preview toolbar: show the download button. */
  downloadable?: boolean
  /** Open the preview on first render (for reviewing the Figma "Image Preview"). */
  defaultPreviewOpen?: boolean
  loading?: 'lazy' | 'eager'
  className?: string
  style?: CSSProperties
}

export interface PreviewImage {
  src: string
  alt: string
}

interface GroupApi {
  register: (image: PreviewImage & { id: string }) => () => void
  open: (id: string) => void
}
const GroupContext = createContext<GroupApi | null>(null)

const px = (v: number | string | undefined) => (typeof v === 'number' ? `${v}px` : v)

/**
 * Figma "❖ Image": a picture that opens a full-screen preview (zoom, rotate,
 * flip) on click. Inside `ImageGroup` the preview steps through every image.
 */
export function Image({
  src,
  alt,
  width,
  height,
  ratio,
  portrait = false,
  fit = 'cover',
  preview = true,
  fallback,
  downloadable = false,
  defaultPreviewOpen = false,
  loading = 'lazy',
  className,
  style,
}: ImageProps) {
  // Remember which src failed, so a new src gets a fresh try without an effect.
  const [failedSrc, setFailedSrc] = useState<string>()
  const failed = src != null && failedSrc === src
  const [open, setOpen] = useState(defaultPreviewOpen)
  const group = useContext(GroupContext)
  const id = useId()
  const previewSrc = (typeof preview === 'object' && preview.src) || src
  const canPreview = preview !== false && !failed && previewSrc != null
  useEffect(() => {
    if (!group || !canPreview || !previewSrc) return undefined
    return group.register({ id, src: previewSrc, alt })
  }, [group, canPreview, previewSrc, alt, id])

  const [w, h] = ratio ? RATIO[ratio] : [0, 0]
  const box: CSSProperties = {
    width: px(width),
    height: px(height),
    aspectRatio: ratio ? (portrait ? `${h} / ${w}` : `${w} / ${h}`) : undefined,
    ...style,
  }

  const picture = failed || src == null ? (
    <span className={styles.fallback} role="img" aria-label={alt}>
      {fallback ?? <Image01 />}
    </span>
  ) : (
    <img className={styles.img} style={{ objectFit: fit }} src={src} alt={canPreview ? '' : alt} loading={loading} onError={() => setFailedSrc(src)} />
  )

  return (
    <span className={cx(styles.image, className)} style={box}>
      {canPreview ? (
        <AriaButton className={styles.trigger} aria-label={`Xem trước: ${alt}`} onPress={() => (group ? group.open(id) : setOpen(true))}>
          {picture}
          <span className={styles.mask} aria-hidden="true">
            <Eye />
            <span>Xem trước</span>
          </span>
        </AriaButton>
      ) : (
        picture
      )}
      {!group && canPreview && (
        <ImagePreview images={[{ src: previewSrc!, alt }]} index={0} isOpen={open} onOpenChange={setOpen} downloadable={downloadable} />
      )}
    </span>
  )
}

export interface ImageGroupProps {
  children: ReactNode
  downloadable?: boolean
}

/** Figma "Image Preview" with "1 / 2" and arrows: previews every Image inside, in order. */
export function ImageGroup({ children, downloadable = false }: ImageGroupProps) {
  const [images, setImages] = useState<(PreviewImage & { id: string })[]>([])
  // The open image is kept by id and its index derived here, so the context
  // value never depends on `images`: a changing value would make every Image
  // re-register, change `images` again, and loop forever.
  const [openId, setOpenId] = useState<string | null>(null)
  const register = useCallback((image: PreviewImage & { id: string }) => {
    setImages((all) => [...all.filter((i) => i.id !== image.id), image])
    return () => setImages((all) => all.filter((i) => i.id !== image.id))
  }, [])
  const api = useMemo<GroupApi>(() => ({ register, open: setOpenId }), [register])
  const index = openId == null ? -1 : images.findIndex((i) => i.id === openId)

  return (
    <GroupContext.Provider value={api}>
      {children}
      <ImagePreview
        images={images}
        index={Math.max(0, index)}
        onIndexChange={(i) => setOpenId(images[i]?.id ?? null)}
        isOpen={index >= 0}
        onOpenChange={(o) => { if (!o) setOpenId(null) }}
        downloadable={downloadable}
      />
    </GroupContext.Provider>
  )
}

export interface ImagePreviewProps {
  images: PreviewImage[]
  index: number
  onIndexChange?: (index: number) => void
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  downloadable?: boolean
}

const ZOOM_STEP = 0.5
const ZOOM_MIN = 1
const ZOOM_MAX = 3

/**
 * Full-screen viewer (Figma "Image Preview"): mask, picture, close, prev /
 * next, counter and toolbar. `Image` opens it on click; use it directly to
 * open a preview from code (e.g. Upload's preview action).
 */
export function ImagePreview({ images, index, onIndexChange, isOpen, onOpenChange, downloadable }: ImagePreviewProps) {
  // Zoom / rotate / flip belong to one image in one opening: keyed, so they reset without an effect.
  const viewKey = `${index}:${isOpen}`
  const [view, setView] = useState({ key: viewKey, zoom: 1, rotate: 0, fx: 1, fy: 1 })
  const v = view.key === viewKey ? view : { key: viewKey, zoom: 1, rotate: 0, fx: 1, fy: 1 }
  const update = (patch: Partial<typeof v>) => setView({ ...v, ...patch })
  const portalReady = usePortalReady()
  const image = images[index]
  const many = images.length > 1

  const go = (step: number) => onIndexChange?.((index + step + images.length) % images.length)
  // ← → step through a group. Listened on the document: React Aria focuses the
  // dialog element itself on open, which is outside anything we render inside it.
  useEffect(() => {
    if (!isOpen || !many) return undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  if (!image || !portalReady) return null
  const transform = `scale(${v.zoom * v.fx}, ${v.zoom * v.fy}) rotate(${v.rotate}deg)`

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable className={styles.previewMask}>
      <AriaModal className={styles.previewModal}>
        <Dialog aria-label={`Xem ảnh: ${image.alt}`} className={styles.previewDialog}>
          {/* The viewer is always a dark surface: pin Dark mode so every control token suits it. */}
          <div data-mode="dark" className={styles.previewStage}>
          <img className={styles.previewImg} style={{ transform }} src={image.src} alt={image.alt} />
          <AriaButton slot="close" className={cx(styles.op, styles.close)} aria-label="Đóng xem ảnh"><X /></AriaButton>
          {many && (
            <>
              <AriaButton className={cx(styles.op, styles.prev)} aria-label="Ảnh trước" onPress={() => go(-1)}><ChevronLeft /></AriaButton>
              <AriaButton className={cx(styles.op, styles.next)} aria-label="Ảnh sau" onPress={() => go(1)}><ChevronRight /></AriaButton>
            </>
          )}
          <div className={styles.footer}>
            {many && <span className={styles.counter} aria-live="polite">{index + 1} / {images.length}</span>}
            <div className={styles.toolbar} role="toolbar" aria-label="Công cụ xem ảnh">
              {downloadable && (
                <a className={styles.tool} href={image.src} download aria-label="Tải ảnh về"><Download01 /></a>
              )}
              <AriaButton className={styles.tool} aria-label="Lật dọc" onPress={() => update({ fy: -v.fy })}><SwitchVertical01 /></AriaButton>
              <AriaButton className={styles.tool} aria-label="Lật ngang" onPress={() => update({ fx: -v.fx })}><SwitchHorizontal01 /></AriaButton>
              <AriaButton className={styles.tool} aria-label="Xoay trái" onPress={() => update({ rotate: v.rotate - 90 })}><RefreshCcw01 /></AriaButton>
              <AriaButton className={styles.tool} aria-label="Xoay phải" onPress={() => update({ rotate: v.rotate + 90 })}><RefreshCw01 /></AriaButton>
              <AriaButton className={styles.tool} aria-label="Thu nhỏ" isDisabled={v.zoom <= ZOOM_MIN} onPress={() => update({ zoom: Math.max(ZOOM_MIN, v.zoom - ZOOM_STEP) })}><ZoomOut /></AriaButton>
              <AriaButton className={styles.tool} aria-label="Phóng to" isDisabled={v.zoom >= ZOOM_MAX} onPress={() => update({ zoom: Math.min(ZOOM_MAX, v.zoom + ZOOM_STEP) })}><ZoomIn /></AriaButton>
            </div>
          </div>
          </div>
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  )
}

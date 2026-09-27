import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react'
import { Button as AriaButton, DropZone, FileTrigger, isFileDropItem } from 'react-aria-components'
// Not in src/icons.tsx yet (Figma inbox-01-line, image-plus-line, paperclip-line).
import { Eye, File02, Image01, ImagePlus, Inbox01, Paperclip, RefreshCw01, Trash01, Upload01 } from '../../../icons'
import { cx } from '../../space'
import { Button, type ButtonSize } from '../Button/Button'
import { ImagePreview } from '../Image/Image'
import { Progress } from '../Progress/Progress'
import { Spin } from '../Spin/Spin'
import { Tooltip } from '../Tooltip/Tooltip'
import styles from './Upload.module.css'

/**
 * Figma list item sets: `text` = "Upload List Item / Basic", `picture` =
 * "Upload List Item / Picture card" (rows with a 48px thumbnail),
 * `picture-card` / `picture-circle` = "Upload List Item / Picture" Type=Card / Circle (tiles).
 */
export type UploadListType = 'text' | 'picture' | 'picture-card' | 'picture-circle'
/** Figma Status: Upload / Loading (`uploading`), Uploaded (`done`), Error (`error`). */
export type UploadFileStatus = 'uploading' | 'done' | 'error'
/** What changed in an `onChange` call. */
export type UploadChangeType = 'add' | 'remove' | 'progress' | 'success' | 'error' | 'retry'

export interface UploadFile {
  uid: string
  name: string
  /** Defaults to `done`. */
  status?: UploadFileStatus
  /** 0–100 while uploading. */
  percent?: number
  /** Where the file lives once uploaded (link / preview). */
  url?: string
  /** Thumbnail for picture list types. Files picked here get an object URL, revoked on remove / unmount. */
  thumbUrl?: string
  /** Shown under the name (or on the tile's tooltip) when `status` is `error`. */
  error?: string
  size?: number
  /** MIME type. */
  type?: string
  /** The picked file, kept for retry. */
  originFileObj?: File
}

/** What `customRequest` receives. Call the callbacks as the upload goes; return a function to abort it. */
export interface UploadRequest {
  file: File
  uid: string
  onProgress: (percent: number) => void
  onSuccess: (result?: { url?: string }) => void
  onError: (message?: string) => void
}

/** Every visible or announced string, overridable one by one. */
export interface UploadLabels {
  /** Default trigger button (Figma "Upload / Button"). */
  upload: string
  /** Add tile of `picture-card` / `picture-circle`. */
  addPicture: string
  /** Dragger title (Figma "Click or drag file to this area to upload"). */
  dragTitle: string
  /** Dragger hint line. */
  dragHint: string
  /** Name of the dragger's drop / paste target (keyboard users paste files there). */
  dropZone: string
  /** Name of the file list. */
  fileList: string
  /** Tile text while uploading. */
  uploading: string
  /** Name of a file's progress bar. */
  progress: (name: string) => string
  remove: (name: string) => string
  preview: (name: string) => string
  retry: (name: string) => string
  /** Error shown when `onError` gives no message. */
  uploadFailed: string
  /** Announced politely when a file finishes. */
  done: (name: string) => string
  /** Announced politely when a file fails. */
  failed: (name: string, message: string) => string
  /** Rejected by `acceptedFileTypes`; `accepted` is e.g. "PNG, JPG". */
  invalidType: (name: string, accepted: string) => string
  /** Rejected by `maxSize`; `max` is e.g. "2 MB". */
  tooLarge: (name: string, max: string) => string
  /** More files than `maxCount` allows. */
  tooMany: (max: number) => string
}

const LABELS: UploadLabels = {
  upload: 'Tải lên',
  addPicture: 'Thêm ảnh',
  dragTitle: 'Nhấn hoặc kéo thả tệp vào khu vực này để tải lên',
  dragHint: 'Hỗ trợ tải lên một hoặc nhiều tệp.',
  dropZone: 'Thả hoặc dán tệp vào đây',
  fileList: 'Tệp đã chọn',
  uploading: 'Đang tải lên',
  progress: (name) => `Tiến độ tải lên ${name}`,
  remove: (name) => `Xóa ${name}`,
  preview: (name) => `Xem trước ${name}`,
  retry: (name) => `Thử lại ${name}`,
  uploadFailed: 'Tải lên thất bại.',
  done: (name) => `Đã tải lên ${name}`,
  failed: (name, message) => `Tải lên ${name} thất bại. ${message}`,
  invalidType: (name, accepted) => `Tệp "${name}" không đúng định dạng. Chỉ chấp nhận: ${accepted}.`,
  tooLarge: (name, max) => `Tệp "${name}" vượt quá dung lượng tối đa ${max}.`,
  tooMany: (max) => `Chỉ được tải lên tối đa ${max} tệp.`,
}

export interface UploadProps {
  /** Figma list item set; see `UploadListType`. */
  listType?: UploadListType
  /**
   * `button` = Figma "Upload / Button"; `dragger` = Figma "Upload / Drag and
   * Drop" (click or drop files anywhere on it). Ignored by `picture-card` /
   * `picture-circle`, whose trigger is the add tile.
   */
  variant?: 'button' | 'dragger'
  /** Files (controlled). */
  fileList?: UploadFile[]
  /** Files at first render (uncontrolled). */
  defaultFileList?: UploadFile[]
  onChange?: (fileList: UploadFile[], info: { file: UploadFile; type: UploadChangeType }) => void
  /**
   * Does the upload. Without it, accepted files are
   * added as `done` straight away — nothing is sent anywhere.
   */
  customRequest?: (request: UploadRequest) => void | (() => void)
  /** MIME types or extensions: `['image/*']`, `['.pdf', 'image/png']`. Also checked on dropped files. */
  acceptedFileTypes?: readonly string[]
  /** Pick or drop several files at once. */
  allowsMultiple?: boolean
  /** Most files in the list. `1` replaces the current file; more hide / disable the trigger once full. */
  maxCount?: number
  /** Largest file in bytes. */
  maxSize?: number
  /**
   * Last check before a file is added (after type and size). Return a
   * message to reject it with that message, `false` to skip it silently.
   */
  beforeUpload?: (file: File) => string | boolean | void | Promise<string | boolean | void>
  /** Return `false` to keep the file. */
  onRemove?: (file: UploadFile) => boolean | void | Promise<boolean | void>
  /** Replaces the default preview (fc Image viewer for pictures, a link for other files). */
  onPreview?: (file: UploadFile) => void
  showUploadList?: boolean
  isDisabled?: boolean
  /** Figma "Upload / Button" State=Loading, on the default button. */
  isPending?: boolean
  /** Figma "Upload / Button" Size. */
  size?: ButtonSize
  /** Help under the trigger (accepted types, size limit), linked to it. */
  description?: ReactNode
  /** Custom trigger: a React Aria pressable (fc Button…). Replaces the default button or add tile. */
  children?: ReactElement
  labels?: Partial<UploadLabels>
  className?: string
  style?: CSSProperties
}

let uidSeq = 0
const nextUid = () => `fc-upload-${Date.now().toString(36)}-${(uidSeq += 1)}`

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|bmp)$/i
const isImageFile = (file: UploadFile) =>
  file.type ? file.type.startsWith('image/') : file.thumbUrl != null || IMAGE_EXT.test(file.name)

function matchesAccept(file: File, accept: readonly string[]) {
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return accept.some((raw) => {
    const rule = raw.trim().toLowerCase()
    if (!rule) return false
    if (rule.startsWith('.')) return name.endsWith(rule)
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1))
    return type === rule
  })
}

const GROUP_NAME: Record<string, string> = { image: 'ảnh', video: 'video', audio: 'âm thanh', text: 'văn bản' }
const acceptText = (accept: readonly string[]) =>
  accept
    .map((rule) => {
      const r = rule.trim()
      if (r.startsWith('.')) return r.slice(1).toUpperCase()
      const [group, sub = ''] = r.split('/')
      return sub === '*' ? GROUP_NAME[group] ?? r : sub.replace(/^x-/, '').toUpperCase()
    })
    .join(', ')

const sizeFormat = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })
function formatBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${sizeFormat.format(value)} ${units[unit]}`
}

const clamp = (n: number) => Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0))

/**
 * Figma "❖ Upload": a React Aria `FileTrigger` (button, add tile) or
 * `DropZone` (dragger) plus the file list in four styles. Files are checked
 * for type, size and count (Vietnamese messages, `role="alert"`), then
 * handed to `customRequest`; uploading rows show fc `Progress`, failed rows
 * the message and a retry. Finished / failed uploads are announced politely.
 * Thumbnails of picked images are object URLs, revoked on remove and unmount.
 */
export function Upload({
  listType = 'text',
  variant = 'button',
  fileList,
  defaultFileList = [],
  onChange,
  customRequest,
  acceptedFileTypes,
  allowsMultiple = false,
  maxCount,
  maxSize,
  beforeUpload,
  onRemove,
  onPreview,
  showUploadList = true,
  isDisabled = false,
  isPending = false,
  size = 'md',
  description,
  children,
  labels,
  className,
  style,
}: UploadProps) {
  const t = { ...LABELS, ...labels }
  const [inner, setInner] = useState<UploadFile[]>(defaultFileList)
  const list = fileList ?? inner
  const [problems, setProblems] = useState<{ id: number; messages: string[] }>({ id: 0, messages: [] })
  const [announcement, setAnnouncement] = useState<{ id: number; text: string } | null>(null)
  const [previewing, setPreviewing] = useState<{ file: UploadFile; nonce: number } | null>(null)
  const descriptionId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  // Upload callbacks arrive after later renders: they read the latest list and props from here.
  const listRef = useRef(list)
  const latest = useRef({ controlled: fileList !== undefined, onChange, customRequest, t })
  useLayoutEffect(() => {
    listRef.current = list
    latest.current = { controlled: fileList !== undefined, onChange, customRequest, t }
  })

  const objectUrls = useRef(new Map<string, string>())
  const aborts = useRef(new Map<string, () => void>())
  const pendingFocus = useRef<number | null>(null)

  const discard = (uid: string) => {
    aborts.current.get(uid)?.()
    aborts.current.delete(uid)
    const url = objectUrls.current.get(uid)
    if (url) URL.revokeObjectURL(url)
    objectUrls.current.delete(uid)
  }

  // Files the parent drops from a controlled list: stop their upload, free their URL.
  useEffect(() => {
    const uids = new Set(list.map((f) => f.uid))
    for (const uid of [...objectUrls.current.keys(), ...aborts.current.keys()]) {
      if (!uids.has(uid)) discard(uid)
    }
  }, [list])

  // Unmount: abort uploads and revoke URLs. Deferred one tick so React's
  // development double-mount (StrictMode) doesn't abort live uploads.
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    const urls = objectUrls.current
    const pending = aborts.current
    return () => {
      mounted.current = false
      window.setTimeout(() => {
        if (mounted.current) return
        for (const abort of pending.values()) abort()
        pending.clear()
        for (const url of urls.values()) URL.revokeObjectURL(url)
        urls.clear()
      }, 0)
    }
  }, [])

  // After a removal, focus the next file's first control, else the trigger.
  useLayoutEffect(() => {
    const index = pendingFocus.current
    if (index == null) return
    pendingFocus.current = null
    const root = rootRef.current
    if (!root) return
    const items = root.querySelectorAll<HTMLElement>('[data-upload-item]')
    const item = items[Math.min(index, items.length - 1)]
    const target =
      item?.querySelector<HTMLElement>('a[href], button:not([disabled])') ??
      root.querySelector<HTMLElement>('[data-upload-trigger] button:not([disabled])')
    target?.focus()
  }, [list])

  const announce = (text: string) => setAnnouncement((prev) => ({ id: (prev?.id ?? 0) + 1, text }))

  const commit = (next: UploadFile[], file: UploadFile, type: UploadChangeType) => {
    listRef.current = next
    if (!latest.current.controlled) setInner(next)
    latest.current.onChange?.(next, { file, type })
  }

  const patch = (uid: string, change: Partial<UploadFile>, type: UploadChangeType) => {
    const current = listRef.current
    const index = current.findIndex((f) => f.uid === uid)
    if (index < 0) return undefined // removed meanwhile
    const file = { ...current[index], ...change }
    commit(current.map((f, i) => (i === index ? file : f)), file, type)
    return file
  }

  const start = (file: UploadFile, raw: File) => {
    const request = latest.current.customRequest
    if (!request) return
    const abort = request({
      file: raw,
      uid: file.uid,
      onProgress: (percent) => {
        patch(file.uid, { status: 'uploading', percent: clamp(percent) }, 'progress')
      },
      onSuccess: (result) => {
        aborts.current.delete(file.uid)
        const url = result?.url ?? objectUrls.current.get(file.uid)
        const done = patch(file.uid, { status: 'done', percent: 100, error: undefined, ...(url && { url }) }, 'success')
        if (done) announce(latest.current.t.done(done.name))
      },
      onError: (message) => {
        aborts.current.delete(file.uid)
        const text = message ?? latest.current.t.uploadFailed
        const failed = patch(file.uid, { status: 'error', error: text }, 'error')
        if (failed) announce(latest.current.t.failed(failed.name, text))
      },
    })
    if (typeof abort === 'function') aborts.current.set(file.uid, abort)
  }

  const addFiles = async (files: File[]) => {
    if (isDisabled || files.length === 0) return
    const messages: string[] = []
    let accepted: File[] = []
    for (const file of allowsMultiple ? files : files.slice(0, 1)) {
      if (acceptedFileTypes?.length && !matchesAccept(file, acceptedFileTypes)) {
        messages.push(t.invalidType(file.name, acceptText(acceptedFileTypes)))
        continue
      }
      if (maxSize != null && file.size > maxSize) {
        messages.push(t.tooLarge(file.name, formatBytes(maxSize)))
        continue
      }
      const verdict = await beforeUpload?.(file)
      if (typeof verdict === 'string') {
        messages.push(verdict)
        continue
      }
      if (verdict === false) continue
      accepted.push(file)
    }

    let current = listRef.current
    if (maxCount === 1 && accepted.length > 0) {
      accepted = accepted.slice(-1)
      for (const f of current) discard(f.uid)
      current = []
    } else if (maxCount != null) {
      const room = Math.max(0, maxCount - current.length)
      if (accepted.length > room) {
        messages.push(t.tooMany(maxCount))
        accepted = accepted.slice(0, room)
      }
    }
    setProblems((prev) => ({ id: prev.id + 1, messages }))
    if (accepted.length === 0) return

    const uploads = !!latest.current.customRequest
    const added = accepted.map((raw) => {
      const uid = nextUid()
      const url = URL.createObjectURL(raw)
      objectUrls.current.set(uid, url)
      const file: UploadFile = {
        uid,
        name: raw.name,
        size: raw.size,
        type: raw.type,
        status: uploads ? 'uploading' : 'done',
        percent: uploads ? 0 : 100,
        url: uploads ? undefined : url,
        thumbUrl: raw.type.startsWith('image/') ? url : undefined,
        originFileObj: raw,
      }
      return { raw, file }
    })
    for (const { file } of added) {
      current = [...current, file]
      commit(current, file, 'add')
    }
    for (const { raw, file } of added) start(file, raw)
  }

  const remove = async (file: UploadFile) => {
    if (onRemove && (await onRemove(file)) === false) return
    const current = listRef.current
    const index = current.findIndex((f) => f.uid === file.uid)
    if (index < 0) return
    discard(file.uid)
    pendingFocus.current = index
    commit(current.filter((f) => f.uid !== file.uid), file, 'remove')
  }

  const retry = (file: UploadFile) => {
    const raw = file.originFileObj
    if (!raw || !latest.current.customRequest) return
    // A file from `defaultFileList` gets its local URL (link, thumbnail) on its first retry.
    let local = objectUrls.current.get(file.uid)
    if (!local) {
      local = URL.createObjectURL(raw)
      objectUrls.current.set(file.uid, local)
    }
    const thumbUrl = file.thumbUrl ?? (raw.type.startsWith('image/') ? local : undefined)
    const next = patch(file.uid, { status: 'uploading', percent: 0, error: undefined, thumbUrl }, 'retry')
    if (next) start(next, raw)
  }

  const canPreviewImage = (file: UploadFile) => (file.url ?? file.thumbUrl) != null && isImageFile(file)
  const preview = (file: UploadFile) => {
    if (onPreview) onPreview(file)
    else if (canPreviewImage(file)) setPreviewing((prev) => ({ file, nonce: (prev?.nonce ?? 0) + 1 }))
  }

  const isTiles = listType === 'picture-card' || listType === 'picture-circle'
  const full = maxCount != null && maxCount > 1 && list.length >= maxCount
  const triggerDisabled = isDisabled || full
  const describedBy = description != null ? descriptionId : undefined
  const onSelect = (files: FileList | null) => {
    if (files) void addFiles(Array.from(files))
  }
  const fileTrigger = (child: ReactElement) => (
    <FileTrigger acceptedFileTypes={acceptedFileTypes} allowsMultiple={allowsMultiple} onSelect={onSelect}>
      {child}
    </FileTrigger>
  )

  // ---------- trigger ----------
  let trigger: ReactNode = null
  if (!isTiles && variant === 'dragger') {
    trigger = (
      <div data-upload-trigger className={styles.draggerSlot}>
        <DropZone
          className={styles.dragger}
          isDisabled={triggerDisabled}
          aria-label={t.dropZone}
          getDropOperation={() => (triggerDisabled ? 'cancel' : 'copy')}
          onDrop={async (e) => {
            const files = await Promise.all(e.items.filter(isFileDropItem).map((item) => item.getFile()))
            void addFiles(files)
          }}
        >
          {fileTrigger(
            <AriaButton className={styles.draggerButton} isDisabled={triggerDisabled} aria-describedby={describedBy}>
              <span className={styles.draggerIcon} aria-hidden="true"><Inbox01 /></span>
              <span className={styles.draggerText}>
                <span className={styles.draggerTitle}>{t.dragTitle}</span>
                <span className={styles.draggerHint}>{t.dragHint}</span>
              </span>
            </AriaButton>,
          )}
        </DropZone>
      </div>
    )
  } else if (!isTiles) {
    trigger = (
      <div data-upload-trigger className={styles.buttonSlot}>
        {fileTrigger(
          children ?? (
            <Button size={size} iconStart={<Upload01 />} isPending={isPending} isDisabled={triggerDisabled} aria-describedby={describedBy}>
              {t.upload}
            </Button>
          ),
        )}
      </div>
    )
  }

  // ---------- layout ----------
  const kind: ItemKind = isTiles ? 'tile' : listType === 'picture' ? 'picture' : 'text'
  const items = showUploadList
    ? list.map((file) => (
        <UploadItem
          key={file.uid}
          file={file}
          kind={kind}
          labels={t}
          isDisabled={isDisabled}
          canRetry={file.originFileObj != null && customRequest != null}
          canPreview={onPreview != null || canPreviewImage(file)}
          onRemove={() => void remove(file)}
          onRetry={() => retry(file)}
          onPreview={() => preview(file)}
        />
      ))
    : []

  // Help and rejections sit right under the trigger, before the file list.
  const help = (
    <>
      {description != null && <div id={descriptionId} className={styles.description}>{description}</div>}
      <div role="alert" className={styles.problems}>
        {problems.messages.map((message, i) => (
          <p key={`${problems.id}-${i}`}>{message}</p>
        ))}
      </div>
    </>
  )

  let body: ReactNode
  if (isTiles) {
    body = (
      <>
        <ul className={cx(styles.tiles, listType === 'picture-circle' && styles.circle)} aria-label={t.fileList}>
          {items}
          {!full && (
            <li data-upload-trigger className={styles.tileSlot}>
              {fileTrigger(
                children ?? (
                  <AriaButton className={cx(styles.tile, styles.addTile)} isDisabled={isDisabled} aria-describedby={describedBy}>
                    <ImagePlus className={styles.addIcon} aria-hidden="true" />
                    <span className={styles.tileName}>{t.addPicture}</span>
                  </AriaButton>
                ),
              )}
            </li>
          )}
        </ul>
        {help}
      </>
    )
  } else {
    body = (
      <>
        {trigger}
        {help}
        {items.length > 0 && (
          <ul className={listType === 'picture' ? styles.pictureList : styles.textList} aria-label={t.fileList}>
            {items}
          </ul>
        )}
      </>
    )
  }

  const previewSrc = previewing && (previewing.file.url ?? previewing.file.thumbUrl)

  return (
    <div ref={rootRef} className={cx(styles.upload, variant === 'dragger' && !isTiles && styles.block, className)} style={style}>
      {body}
      <div role="status" className={styles.srOnly}>
        {announcement && <span key={announcement.id}>{announcement.text}</span>}
      </div>
      {previewing && previewSrc && (
        <ImagePreview
          images={[{ src: previewSrc, alt: previewing.file.name }]}
          index={0}
          isOpen
          onOpenChange={(open) => { if (!open) setPreviewing(null) }}
        />
      )}
    </div>
  )
}

type ItemKind = 'text' | 'picture' | 'tile'

interface UploadItemProps {
  file: UploadFile
  kind: ItemKind
  labels: UploadLabels
  isDisabled: boolean
  canRetry: boolean
  /** A finished file opens in a preview (image viewer or `onPreview`). */
  canPreview: boolean
  onRemove: () => void
  onRetry: () => void
  onPreview: () => void
}

/**
 * One file. `text` = Figma "Upload List Item / Basic", `picture` = "Upload
 * List Item / Picture card", `tile` = "Upload List Item / Picture" (card or
 * circle, set by the list).
 */
function UploadItem({ file, kind, labels: t, isDisabled, canRetry, canPreview, onRemove, onRetry, onPreview }: UploadItemProps) {
  const status = file.status ?? 'done'
  const done = status === 'done'
  const thumb = file.thumbUrl ?? (isImageFile(file) ? file.url : undefined)
  const linked = done && (canPreview || file.url != null)
  const itemClass = cx(status === 'error' && styles.isError, status === 'uploading' && styles.isUploading, linked && styles.linked)

  const action = (label: string, icon: ReactNode, onPress: () => void, className: string, disabled = isDisabled) => (
    <AriaButton className={className} aria-label={label} isDisabled={disabled} onPress={onPress}>
      {icon}
    </AriaButton>
  )
  const progress = (
    <Progress percent={file.percent ?? 0} showInfo={false} aria-label={t.progress(file.name)} className={styles.fileProgress} />
  )

  if (kind === 'tile') {
    const retryButton = status === 'error' && canRetry ? action(t.retry(file.name), <RefreshCw01 />, onRetry, styles.overlayAction) : null
    return (
      <li data-upload-item className={cx(styles.tile, itemClass)}>
        {status === 'uploading' ? (
          <>
            <span className={styles.tileName}>{t.uploading}</span>
            {progress}
          </>
        ) : done && thumb ? (
          <img className={styles.tileImage} src={thumb} alt={file.name} />
        ) : (
          <>
            {status === 'error' ? <Image01 className={styles.bigIcon} aria-hidden="true" /> : <File02 className={styles.bigIcon} aria-hidden="true" />}
            <span className={styles.tileName}>{file.name}</span>
          </>
        )}
        {/* Always a dark mask: pin Dark mode so the icons and focus ring suit it. */}
        <span className={styles.overlay} data-mode="dark">
          {done && canPreview && action(t.preview(file.name), <Eye />, onPreview, styles.overlayAction, false)}
          {retryButton && file.error ? <Tooltip content={file.error}>{retryButton}</Tooltip> : retryButton}
          {action(t.remove(file.name), <Trash01 />, onRemove, styles.overlayAction)}
        </span>
      </li>
    )
  }

  let name: ReactNode = <span className={styles.name}>{file.name}</span>
  if (done && canPreview) {
    name = (
      <AriaButton className={cx(styles.name, styles.nameLink)} aria-label={t.preview(file.name)} onPress={onPreview}>
        {file.name}
      </AriaButton>
    )
  } else if (done && file.url) {
    name = (
      <a className={cx(styles.name, styles.nameLink)} href={file.url} target="_blank" rel="noopener noreferrer">
        {file.name}
      </a>
    )
  }

  let icon: ReactNode
  if (kind === 'text') icon = status === 'uploading' ? <Spin size="sm" /> : <Paperclip />
  else if (status === 'uploading') icon = <Spin />
  else if (status === 'error') icon = <Image01 className={styles.bigIcon} />
  else icon = thumb ? <img src={thumb} alt="" /> : <File02 className={styles.bigIcon} />

  return (
    <li data-upload-item className={cx(kind === 'text' ? styles.textItem : styles.pictureItem, itemClass)}>
      <span className={kind === 'text' ? styles.fileIcon : styles.thumb} aria-hidden="true">{icon}</span>
      <span className={styles.info}>
        {name}
        {status === 'uploading' && progress}
        {status === 'error' && file.error && <span className={styles.errorText}>{file.error}</span>}
      </span>
      <span className={styles.actions}>
        {status === 'error' && canRetry && action(t.retry(file.name), <RefreshCw01 />, onRetry, styles.action)}
        {action(t.remove(file.name), <Trash01 />, onRemove, styles.action)}
      </span>
    </li>
  )
}

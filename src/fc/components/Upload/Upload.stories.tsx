import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button/Button'
import { Upload, type UploadFile, type UploadRequest } from './Upload'

/**
 * Photo stand-ins as inline SVG data URIs — stories never touch the network.
 * The fills are picture content (a plate of food), not UI colour.
 */
const photo = (plate: string, food: string, garnish: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="${plate}"/><circle cx="80" cy="80" r="56" fill="#ffffff"/><circle cx="80" cy="80" r="40" fill="${food}"/><circle cx="66" cy="70" r="8" fill="${garnish}"/><circle cx="94" cy="88" r="6" fill="${garnish}"/></svg>`,
  )}`
const PHO = photo('#FFE7BA', '#D46B08', '#389E0D')
/** The same picture as a real SVG file, so a retried tile shows its thumbnail. */
const photoFile = (name: string, uri: string) =>
  new File([decodeURIComponent(uri.slice(uri.indexOf(',') + 1))], name, { type: 'image/svg+xml' })
const COM_TAM = photo('#D6E4FF', '#FAAD14', '#CF1322')
const TRA_DAO = photo('#FFF1F0', '#FA8C16', '#7CB305')

/** A small local file, so retry has something to resend and links open offline. */
const localFile = (name: string, type: string) => new File([`Tệp mẫu FABi CMS: ${name}`], name, { type })
const MENU_PDF = localFile('thuc-don-thang-10.pdf', 'application/pdf')
const MENU_URL = URL.createObjectURL(MENU_PDF)

const textFiles = (): UploadFile[] => [
  { uid: 'menu', name: 'thuc-don-thang-10.pdf', status: 'done', url: MENU_URL, type: 'application/pdf' },
  { uid: 'price', name: 'bang-gia-chi-nhanh.xlsx', status: 'uploading', percent: 60 },
  {
    uid: 'contract',
    name: 'hop-dong-nha-cung-cap.pdf',
    status: 'error',
    error: 'Máy chủ không phản hồi. Vui lòng thử lại.',
    originFileObj: localFile('hop-dong-nha-cung-cap.pdf', 'application/pdf'),
  },
]

const pictureFiles = (): UploadFile[] => [
  { uid: 'pho', name: 'pho-bo-tai.png', status: 'done', url: PHO, thumbUrl: PHO, type: 'image/svg+xml' },
  { uid: 'com-tam', name: 'com-tam-suon.png', status: 'done', url: COM_TAM, thumbUrl: COM_TAM, type: 'image/svg+xml' },
  { uid: 'tra-dao', name: 'tra-dao-cam-sa.png', status: 'uploading', percent: 45, thumbUrl: TRA_DAO },
  {
    uid: 'banner',
    name: 'banner-khai-truong.svg',
    status: 'error',
    error: 'Ảnh bị lỗi khi tải lên.',
    type: 'image/svg+xml',
    originFileObj: photoFile('banner-khai-truong.svg', TRA_DAO),
  },
]

/**
 * Stand-in for a real upload: progress every 250 ms, then success. A file
 * whose name contains "loi" fails on its first try (retry succeeds). The
 * returned function clears the timer on remove / unmount.
 */
const attempts = new Map<string, number>()
function fakeRequest({ file, uid, onProgress, onSuccess, onError }: UploadRequest) {
  const tries = (attempts.get(uid) ?? 0) + 1
  attempts.set(uid, tries)
  let percent = 0
  const timer = window.setInterval(() => {
    percent += 20
    if (percent < 100) {
      onProgress(percent)
      return
    }
    window.clearInterval(timer)
    if (file.name.toLowerCase().includes('loi') && tries === 1) onError('Mất kết nối khi tải lên. Vui lòng thử lại.')
    else onSuccess()
  }, 250)
  return () => window.clearInterval(timer)
}

const meta = {
  title: 'Components/Upload',
  component: Upload,
  args: {
    listType: 'text',
    variant: 'button',
    allowsMultiple: true,
    showUploadList: true,
    isDisabled: false,
    isPending: false,
    size: 'md',
    customRequest: fakeRequest,
  },
  argTypes: {
    listType: { control: 'inline-radio', options: ['text', 'picture', 'picture-card', 'picture-circle'] },
    variant: { control: 'inline-radio', options: ['button', 'dragger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    fileList: { control: false },
    defaultFileList: { control: false },
    customRequest: { control: false },
    beforeUpload: { control: false },
    onRemove: { control: false },
    onPreview: { control: false },
    children: { control: false },
    labels: { control: false },
    description: { control: 'text' },
  },
} satisfies Meta<typeof Upload>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-lg)', justifyItems: 'start' } as const
const row = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--fc-space-margin-base)' } as const
const narrow = { inlineSize: 'min(100%, 420px)' } as const

/** Pick files; each "uploads" with simulated progress (no network). */
export const Playground: Story = {}

/**
 * Figma "Upload / Button": Size Small / Default / Large, State Loading
 * (`isPending`) and Disabled. Hover / focused / pressed come from fc Button.
 */
export const ButtonTrigger: Story = {
  render: (args) => (
    <div style={row}>
      <Upload {...args} size="sm" showUploadList={false} />
      <Upload {...args} size="md" showUploadList={false} />
      <Upload {...args} size="lg" showUploadList={false} />
      <Upload {...args} isPending showUploadList={false} labels={{ upload: 'Đang tải lên' }} />
      <Upload {...args} isDisabled showUploadList={false} />
    </div>
  ),
}

/** Figma "Upload / Drag and Drop": click, drop files, or focus the zone and paste (Ctrl+V). */
export const Dragger: Story = {
  args: { variant: 'dragger', description: 'Thực đơn, bảng giá, hợp đồng · tối đa 10 MB mỗi tệp', maxSize: 10 * 1024 * 1024 },
  render: (args) => (
    <div style={narrow}>
      <Upload {...args} />
    </div>
  ),
}

/**
 * Figma "Upload List Item / Basic": a finished file (opens in a new tab), one
 * uploading and one that failed (message + retry). Hover a row for Figma
 * State=Hover (remove button). The uploading row is a still frame.
 */
export const TextList: Story = {
  render: (args) => (
    <div style={narrow}>
      <Upload {...args} defaultFileList={textFiles()} />
    </div>
  ),
}

/**
 * Figma "Upload List Item / Picture card" (`listType="picture"`): rows with a
 * thumbnail — Type=Upload (finished; the name opens the fc Image viewer),
 * Type=Loading and Type=Error.
 */
export const PictureList: Story = {
  args: { listType: 'picture', acceptedFileTypes: ['image/*'] },
  render: (args) => (
    <div style={narrow}>
      <Upload {...args} defaultFileList={pictureFiles()} />
    </div>
  ),
}

/**
 * Figma "Upload List Item / Picture" Type=Card: the add tile (Status=Upload),
 * finished tiles (hover: preview + remove), uploading and error (hover:
 * retry + remove; the message is on the retry tooltip).
 */
export const PictureCard: Story = {
  args: { listType: 'picture-card', acceptedFileTypes: ['image/*'] },
  render: (args) => <Upload {...args} defaultFileList={pictureFiles()} />,
}

/** Figma "Upload List Item / Picture" Type=Circle: the same statuses as round tiles. */
export const PictureCircle: Story = {
  args: { listType: 'picture-circle', acceptedFileTypes: ['image/*'] },
  render: (args) => <Upload {...args} defaultFileList={pictureFiles()} />,
}

/**
 * Validation, in Vietnamese: only PNG / JPG (`acceptedFileTypes`), at most
 * 2 MB (`maxSize`), at most 3 files (`maxCount`), and a `beforeUpload` rule
 * (no spaces in the file name). Rejections show under the trigger as an
 * alert; accepted files upload.
 */
export const Validation: Story = {
  args: {
    listType: 'picture',
    acceptedFileTypes: ['image/png', 'image/jpeg'],
    maxSize: 2 * 1024 * 1024,
    maxCount: 3,
    description: 'PNG hoặc JPG · tối đa 2 MB · tối đa 3 ảnh',
    beforeUpload: (file) => (/\s/.test(file.name) ? `Tên tệp "${file.name}" không được chứa khoảng trắng.` : undefined),
  },
  render: (args) => (
    <div style={narrow}>
      <Upload {...args} />
    </div>
  ),
}

/**
 * Simulated upload: progress with fc `Progress`, then done (announced
 * "Đã tải lên …" (Uploaded …)). Pick a file whose name contains "loi"
 * (e.g. "anh-loi.png") to see a failure, then retry it.
 */
export const SimulatedUpload: Story = {
  args: { listType: 'picture' },
  render: (args) => (
    <div style={narrow}>
      <Upload {...args} />
    </div>
  ),
}

/** `maxCount={1}` on a round tile: a new picture replaces the current one (store logo). */
export const SingleAvatar: Story = {
  args: { listType: 'picture-circle', maxCount: 1, allowsMultiple: false, acceptedFileTypes: ['image/*'], labels: { addPicture: 'Logo' } },
  render: (args) => <Upload {...args} defaultFileList={[pictureFiles()[0]]} />,
}

/** Disabled: the trigger and the remove / retry actions are inert; previews still open. */
export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => (
    <div style={stack}>
      <div style={narrow}><Upload {...args} defaultFileList={textFiles()} /></div>
      <div style={narrow}><Upload {...args} variant="dragger" /></div>
      <Upload {...args} listType="picture-card" defaultFileList={pictureFiles().slice(0, 2)} />
    </div>
  ),
}

/** A custom trigger (`children`): any React Aria pressable, here a primary fc Button. */
export const CustomTrigger: Story = {
  render: (args) => (
    <Upload {...args}>
      <Button variant="primary">Chọn tệp hóa đơn</Button>
    </Upload>
  ),
}

/** Controlled `fileList` + `onChange`: the parent keeps the files and shows a summary. */
export const Controlled: Story = {
  render: function Render(args) {
    const [files, setFiles] = useState<UploadFile[]>(() => textFiles().slice(0, 1))
    const done = files.filter((f) => (f.status ?? 'done') === 'done').length
    return (
      <div style={{ ...stack, ...narrow }}>
        <Upload {...args} fileList={files} onChange={(next) => setFiles(next)} />
        <span style={{ color: 'var(--fc-color-content-description)' }}>
          {done}/{files.length} tệp đã tải lên xong
        </span>
      </div>
    )
  },
}

import type { Key } from 'react-aria-components'

/** One row of the Figma "Notification" popover ("Hòm thư"). */
export interface InboxMessage {
  key: Key
  sender: string
  text: string
  /** Relative time on the right, e.g. "15p trước" (15 min ago). */
  time: string
  /** Rows are grouped under this date, e.g. "15/07/2026". */
  date: string
}

/** A store / account in the Figma "App Header Items / Avatar" menu. */
export interface AppAccount {
  key: Key
  name: string
}

/** Sample content, matching the Figma frames. */
export const SAMPLE_NOTICES: InboxMessage[] = [
  { key: 'n1', sender: 'Bếp trung tâm', text: 'Đơn nhập hàng #NH-0712 đã được duyệt và sẽ giao trước 10:00.', time: '15p trước', date: '15/07/2026' },
  { key: 'n2', sender: 'Chi nhánh Lê Lợi', text: 'Ca sáng đã chốt doanh thu, chênh lệch tiền mặt 0đ.', time: '42p trước', date: '15/07/2026' },
  { key: 'n3', sender: 'Hệ thống', text: 'Máy in bếp "Bếp nóng 2" mất kết nối, kiểm tra lại mạng nội bộ.', time: '1 giờ trước', date: '15/07/2026' },
  { key: 'n4', sender: 'Hệ thống', text: 'Bản cập nhật POS 4.12 đã sẵn sàng cho các thiết bị.', time: 'Hôm qua', date: '14/07/2026' },
]

export const SAMPLE_ACCOUNTS: AppAccount[] = [
  { key: 'chanh', name: 'Chanh dev' },
  { key: 'ga365', name: 'Gà rán 365' },
  { key: 'ga365-q7', name: 'Gà rán 365 Quận 7' },
  { key: 'banhmi', name: 'Bánh mì kẹp thịt Sài Gòn' },
  { key: 'sushi', name: 'Sushi hải sản tươi' },
]

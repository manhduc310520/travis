// Vietnamese names of the sidebar groups and docs pages, shown when the Language toolbar is VN
// (manager.ts). Component names and story names stay English in both languages. The page titles are
// also the H1 of the generated Design Tokens pages (scripts/convert-pages.mjs) and of the MDX pages.

/** Sidebar roots and groups, by their English name. */
export const GROUP_LABELS_VI: Record<string, string> = {
  'Design Tokens': 'Design Tokens',
  Components: 'Component',
  General: 'Chung',
  Layout: 'Bố cục',
  Navigation: 'Điều hướng',
  'Data Entry': 'Nhập liệu',
  'Data Display': 'Hiển thị dữ liệu',
  Feedback: 'Phản hồi',
  Other: 'Khác',
  Template: 'Mẫu trang',
}

/** Docs pages, by their Storybook title. */
export const PAGE_TITLES_VI: Record<string, string> = {
  Introduction: 'Giới thiệu',
  'Getting Started': 'Bắt đầu',
  'Design Tokens/Customize Theme': 'Tuỳ chỉnh theme',
  'Design Tokens/Colors': 'Màu sắc',
  'Design Tokens/Dark Mode': 'Chế độ tối',
  'Design Tokens/Font': 'Font chữ',
  'Design Tokens/Layout': 'Bố cục',
  'Design Tokens/Responsive': 'Thích ứng màn hình',
  'Design Tokens/Shadow': 'Đổ bóng',
  'Design Tokens/Motion': 'Chuyển động',
  'Design Tokens/Token Naming': 'Đặt tên token',
  'Template/Overview': 'Tổng quan',
}

/** The "Docs" entry of each component. */
export const DOCS_ENTRY_VI = 'Tài liệu'

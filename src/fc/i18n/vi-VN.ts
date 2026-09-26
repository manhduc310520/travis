import * as enUSModule from 'react-aria-components/i18n/en-US'

// The package types its locale bundles as a type-only default export; at
// runtime the default export is the string table.
type PackageStrings = Record<string, Record<string, unknown>>
const enUS = (enUSModule as unknown as { default: PackageStrings }).default

/**
 * Vietnamese strings for React Aria's built-in text (screen-reader
 * announcements, default labels such as "Clear search", date segment names).
 * React Aria ships 34 locales but not vi-VN, so without this every one of them
 * falls back to English.
 *
 * The dictionary is en-US with these overrides on top: a package React Aria
 * adds later still has (English) strings instead of throwing. Vietnamese has
 * no plural forms, so `plural()` only needs `other`.
 */
type Vars = Record<string, string | number | boolean>
interface Formatter {
  plural(count: number | string | boolean, options: Record<string, string | (() => string)>): string
  number(value: number | string | boolean): string
  select(options: Record<string, string | (() => string)>, value: unknown): string
}
type ViString = string | ((e: Vars, t: Formatter) => string)

const items = (e: Vars, t: Formatter, key = 'count') => `${t.number(e[key])} mục`

export const VI_VN: Record<string, Record<string, ViString>> = {
  '@react-aria/tree': { expand: 'Mở rộng', collapse: 'Thu gọn' },
  '@react-aria/toast': { close: 'Đóng', notifications: (e, t) => `${t.number(e.count)} thông báo.` },
  '@react-aria/tag': { removeDescription: 'Nhấn Delete để gỡ thẻ.', removeButtonLabel: 'Gỡ' },
  '@react-aria/table': {
    select: 'Chọn',
    selectAll: 'Chọn tất cả',
    sortable: 'cột có thể sắp xếp',
    ascending: 'tăng dần',
    descending: 'giảm dần',
    ascendingSort: (e) => `sắp xếp theo cột ${e.columnName}, tăng dần`,
    descendingSort: (e) => `sắp xếp theo cột ${e.columnName}, giảm dần`,
    columnSize: (e) => `${e.value} pixel`,
    resizerDescription: 'Nhấn Enter để bắt đầu đổi độ rộng',
    expand: 'Mở rộng',
    collapse: 'Thu gọn',
  },
  '@react-aria/steplist': { steplist: 'Danh sách bước' },
  '@react-aria/spinbutton': { Empty: 'Trống' },
  '@react-aria/searchfield': { 'Clear search': 'Xóa tìm kiếm' },
  '@react-aria/previewtrigger': { longPressMessage: 'Nhấn giữ để xem trước' },
  '@react-aria/overlays': { dismiss: 'Đóng' },
  '@react-aria/numberfield': {
    decrease: (e) => `Giảm ${e.fieldLabel}`,
    increase: (e) => `Tăng ${e.fieldLabel}`,
    numberField: 'Ô nhập số',
  },
  '@react-aria/menu': { longPressMessage: 'Nhấn giữ hoặc nhấn Alt + Mũi tên xuống để mở menu' },
  '@react-aria/gridlist': {
    hasActionAnnouncement: 'dòng có thao tác',
    hasLinkAnnouncement: (e) => `dòng có liên kết: ${e.link}`,
  },
  '@react-aria/grid': {
    deselectedItem: (e) => `Đã bỏ chọn ${e.item}.`,
    select: 'Chọn',
    selectedCount: (e, t) => `${t.plural(e.count, { '=0': 'Chưa chọn mục nào', other: () => `Đã chọn ${items(e, t)}` })}.`,
    selectedAll: 'Đã chọn tất cả.',
    selectedItem: (e) => `Đã chọn ${e.item}.`,
    longPressToSelect: 'Nhấn giữ để vào chế độ chọn.',
  },
  '@react-aria/dnd': {
    dragItem: (e) => `Kéo ${e.itemText}`,
    dragSelectedItems: (e, t) => `Kéo ${items(e, t)} đã chọn`,
    dragDescriptionKeyboard: 'Nhấn Enter để bắt đầu kéo.',
    dragDescriptionKeyboardAlt: 'Nhấn Alt + Enter để bắt đầu kéo.',
    dragDescriptionTouch: 'Chạm hai lần để bắt đầu kéo.',
    dragDescriptionVirtual: 'Bấm để bắt đầu kéo.',
    dragDescriptionLongPress: 'Nhấn giữ để bắt đầu kéo.',
    dragSelectedKeyboard: (e, t) => `Nhấn Enter để kéo ${items(e, t)} đã chọn.`,
    dragSelectedKeyboardAlt: (e, t) => `Nhấn Alt + Enter để kéo ${items(e, t)} đã chọn.`,
    dragSelectedLongPress: (e, t) => `Nhấn giữ để kéo ${items(e, t)} đã chọn.`,
    dragStartedKeyboard: 'Đã bắt đầu kéo. Nhấn Tab để tới chỗ thả, nhấn Enter để thả, hoặc Escape để hủy.',
    dragStartedTouch: 'Đã bắt đầu kéo. Di chuyển tới chỗ thả rồi chạm hai lần để thả.',
    dragStartedVirtual: 'Đã bắt đầu kéo. Di chuyển tới chỗ thả rồi bấm hoặc nhấn Enter để thả.',
    endDragKeyboard: 'Đang kéo. Nhấn Enter để hủy.',
    endDragTouch: 'Đang kéo. Chạm hai lần để hủy.',
    endDragVirtual: 'Đang kéo. Bấm để hủy.',
    dropDescriptionKeyboard: 'Nhấn Enter để thả. Nhấn Escape để hủy.',
    dropDescriptionTouch: 'Chạm hai lần để thả.',
    dropDescriptionVirtual: 'Bấm để thả.',
    dropCanceled: 'Đã hủy thả.',
    dropComplete: 'Đã thả xong.',
    dropIndicator: 'vị trí thả',
    dropOnRoot: 'Thả vào',
    dropOnItem: (e) => `Thả vào ${e.itemText}`,
    insertBefore: (e) => `Chèn trước ${e.itemText}`,
    insertBetween: (e) => `Chèn giữa ${e.beforeItemText} và ${e.afterItemText}`,
    insertAfter: (e) => `Chèn sau ${e.itemText}`,
  },
  '@react-aria/datepicker': {
    era: 'kỷ nguyên',
    year: 'năm',
    month: 'tháng',
    day: 'ngày',
    hour: 'giờ',
    minute: 'phút',
    second: 'giây',
    dayPeriod: 'SA/CH',
    calendar: 'Lịch',
    startDate: 'Ngày bắt đầu',
    endDate: 'Ngày kết thúc',
    weekday: 'thứ',
    timeZoneName: 'múi giờ',
    selectedDateDescription: (e) => `Ngày đã chọn: ${e.date}`,
    selectedRangeDescription: (e) => `Khoảng đã chọn: ${e.startDate} đến ${e.endDate}`,
    selectedTimeDescription: (e) => `Giờ đã chọn: ${e.time}`,
  },
  '@react-aria/combobox': {
    focusAnnouncement: (e, t) =>
      `${t.select({ true: () => `Đã vào nhóm ${e.groupTitle}, có ${t.number(e.groupCount)} lựa chọn. `, other: '' }, e.isGroupChange)}${e.optionText}${t.select({ true: ', đã chọn', other: '' }, e.isSelected)}`,
    countAnnouncement: (e, t) => `Có ${t.number(e.optionCount)} lựa chọn.`,
    selectedAnnouncement: (e) => `${e.optionText}, đã chọn`,
    buttonLabel: 'Hiện gợi ý',
    listboxLabel: 'Gợi ý',
  },
  '@react-aria/color': {
    colorPicker: 'Bảng chọn màu',
    twoDimensionalSlider: 'Thanh trượt hai chiều',
    colorNameAndValue: (e) => `${e.name}: ${e.value}`,
    colorInputLabel: (e) => `${e.label}, ${e.channelLabel}`,
    colorSwatch: 'ô màu',
    transparent: 'trong suốt',
  },
  '@react-aria/calendar': {
    previous: 'Trước',
    next: 'Sau',
    selectedDateDescription: (e) => `Ngày đã chọn: ${e.date}`,
    selectedRangeDescription: (e) => `Khoảng đã chọn: ${e.dateRange}`,
    todayDate: (e) => `Hôm nay, ${e.date}`,
    todayDateSelected: (e) => `Hôm nay, ${e.date}, đã chọn`,
    dateSelected: (e) => `${e.date}, đã chọn`,
    startRangeSelectionPrompt: 'Bấm để bắt đầu chọn khoảng ngày',
    finishRangeSelectionPrompt: 'Bấm để kết thúc chọn khoảng ngày',
    minimumDate: 'Ngày sớm nhất có thể chọn',
    maximumDate: 'Ngày muộn nhất có thể chọn',
    dateRange: (e) => `${e.startDate} đến ${e.endDate}`,
  },
  '@react-aria/breadcrumbs': { breadcrumbs: 'Đường dẫn' },
  '@react-aria/autocomplete': { collectionLabel: 'Gợi ý' },
  '@react-stately/datepicker': {
    rangeUnderflow: (e) => `Giá trị phải từ ${e.minValue} trở đi.`,
    rangeOverflow: (e) => `Giá trị phải trước hoặc bằng ${e.maxValue}.`,
    rangeReversed: 'Ngày bắt đầu phải trước ngày kết thúc.',
    unavailableDate: 'Ngày đã chọn không khả dụng.',
  },
  '@react-stately/color': {
    hue: 'Sắc độ',
    saturation: 'Độ bão hòa',
    lightness: 'Độ sáng',
    brightness: 'Độ chói',
    red: 'Đỏ',
    green: 'Xanh lá',
    blue: 'Xanh dương',
    alpha: 'Độ trong suốt',
    colorName: (e) => `${e.hue} ${e.chroma} ${e.lightness}`,
    transparentColorName: (e) => `${e.hue} ${e.chroma} ${e.lightness}, trong suốt ${e.percentTransparent}`,
    'very dark': 'rất tối',
    dark: 'tối',
    light: 'sáng',
    'very light': 'rất sáng',
    pale: 'nhạt',
    grayish: 'ngả xám',
    vibrant: 'rực',
    black: 'đen',
    white: 'trắng',
    gray: 'xám',
    pink: 'hồng',
    'pink red': 'đỏ hồng',
    'red orange': 'cam đỏ',
    brown: 'nâu',
    orange: 'cam',
    'orange yellow': 'vàng cam',
    'brown yellow': 'vàng nâu',
    yellow: 'vàng',
    'yellow green': 'xanh vàng',
    'green cyan': 'xanh ngọc',
    cyan: 'xanh lơ',
    'cyan blue': 'xanh da trời',
    'blue purple': 'tím xanh',
    purple: 'tím',
    'purple magenta': 'tím hồng',
    magenta: 'đỏ tía',
    'magenta pink': 'hồng tía',
  },
  'react-aria-components': {
    selectPlaceholder: 'Chọn một mục',
    tableResizer: 'Thanh đổi độ rộng',
    dropzoneLabel: 'Vùng thả tệp',
    colorSwatchPicker: 'Bảng ô màu',
  },
}

/** en-US for every package React Aria knows about, Vietnamese wherever we have it. */
export function viVNDictionary(): PackageStrings {
  const out: PackageStrings = {}
  for (const [pkg, strings] of Object.entries(enUS)) out[pkg] = { ...strings, ...VI_VN[pkg] }
  return out
}

const LOCALE = Symbol.for('react-aria.i18n.locale')
const STRINGS = Symbol.for('react-aria.i18n.strings')

/**
 * Hands the Vietnamese dictionary to React Aria through the same global hook
 * its server-side `LocalizedStringProvider` uses. React Aria reads it once, on
 * the first localized string, so this runs when FcTheme is imported — before
 * any fc component renders.
 */
export function installViVN() {
  if (typeof window === 'undefined') return
  const w = window as unknown as Record<symbol, unknown>
  if (w[STRINGS]) return
  w[LOCALE] = 'vi-VN'
  w[STRINGS] = viVNDictionary()
}

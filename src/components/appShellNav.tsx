import type { MenuItemDef } from '../fc'
import {
  Building02,
  CheckCircleBroken,
  File06,
  FileSearch02,
  Grid01,
  Home03,
  LayoutAlt03,
  Mail01,
  Monitor03,
  PieChart04,
  Printer,
  ShoppingCart01,
  Tag03,
  Users01,
} from '../icons'

/**
 * The side navigation, read off Figma "App Shells Items / Menu" (page
 * ❖ App Shells, variant Size=MD): 14 items with the icon bound to each.
 */
export const NAV_ITEMS: MenuItemDef[] = [
  { key: 'home', icon: <Home03 />, label: 'Trang chủ' },
  { key: 'restaurants', icon: <Building02 />, label: 'Nhà hàng' },
  { key: 'menu', icon: <LayoutAlt03 />, label: 'Thực đơn' },
  { key: 'promotions', icon: <Tag03 />, label: 'Chương trình' },
  { key: 'devices', icon: <Printer />, label: 'Thiết bị' },
  { key: 'staff', icon: <Users01 />, label: 'Nhân viên' },
  { key: 'reports', icon: <PieChart04 />, label: 'Báo cáo' },
  { key: 'apps', icon: <Grid01 />, label: 'Ứng dụng' },
  { key: 'marketplace', icon: <ShoppingCart01 />, label: 'Marketplace' },
  { key: 'accounting', icon: <FileSearch02 />, label: 'Kế toán vo' },
  { key: 'timekeeping', icon: <CheckCircleBroken />, label: 'Chấm công, lương' },
  { key: 'multichannel', icon: <Monitor03 />, label: 'Nhận đơn đa kênh' },
  { key: 'support', icon: <Mail01 />, label: 'Góp ý hỗ trợ' },
  { key: 'einvoice', icon: <File06 />, label: 'Hoá đơn điện tử' },
]

/** Figma "App Shells Menu Bottom / Open=Yes": the connected apps behind "Mở rộng" (Extensions). */
export const EXTENSIONS: string[] = [
  'Hoá đơn điện tử Viettel S-Invoice',
  'Heo Vàng',
  'iPOS CRM',
  'VNPAY-QR',
  'MoMo',
  'GrabExpress',
  'Hoá đơn điện tử M-Invoice',
  'Ahamove',
  'iPOS CallCenter',
  'Hoá đơn điện tử Misa Me-Invoice',
]

/** Lower-case, accents stripped: "hoa don" finds "Hoá đơn". */
export const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()

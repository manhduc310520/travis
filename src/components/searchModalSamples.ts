import type { SearchModalGroup, SearchModalItem } from './SearchModal'

/** FABi CMS features, grouped by where they live in the navigation. */
export const FEATURES: SearchModalGroup[] = [
  {
    key: 'restaurant-list',
    path: ['Nhà hàng', 'Danh sách nhà hàng'],
    items: [
      { key: 'restaurant-info', label: 'Thông tin nhà hàng' },
      { key: 'restaurant-account', label: 'Tài khoản và cài đặt' },
      { key: 'restaurant-hours', label: 'Giờ mở cửa' },
    ],
  },
  {
    key: 'restaurant-area',
    path: ['Nhà hàng', 'Khu vực và bàn'],
    items: [
      { key: 'table-map', label: 'Sơ đồ bàn' },
      { key: 'area-list', label: 'Danh sách khu vực' },
    ],
  },
  {
    key: 'menu-dishes',
    path: ['Thực đơn', 'Món ăn'],
    items: [
      { key: 'dish-list', label: 'Danh sách món ăn' },
      { key: 'dish-new', label: 'Thêm món mới' },
      { key: 'dish-groups', label: 'Nhóm món' },
      { key: 'dish-options', label: 'Topping và tuỳ chọn' },
    ],
  },
  {
    key: 'menu-combo',
    path: ['Thực đơn', 'Combo'],
    items: [
      { key: 'combo-list', label: 'Danh sách combo' },
      { key: 'combo-price', label: 'Giá combo theo khung giờ' },
    ],
  },
  {
    key: 'goods-products',
    path: ['Hàng hoá', 'Sản phẩm'],
    items: [
      { key: 'product-list', label: 'Danh sách sản phẩm' },
      { key: 'product-units', label: 'Đơn vị tính' },
    ],
  },
  {
    key: 'report-revenue',
    path: ['Báo cáo', 'Doanh thu'],
    items: [
      { key: 'revenue-day', label: 'Doanh thu theo ngày' },
      { key: 'revenue-dish', label: 'Doanh thu theo món' },
      { key: 'revenue-staff', label: 'Doanh thu theo nhân viên' },
    ],
  },
  {
    key: 'report-stock',
    path: ['Báo cáo', 'Kho'],
    items: [
      { key: 'stock-level', label: 'Tồn kho' },
      { key: 'stock-moves', label: 'Xuất nhập kho' },
    ],
  },
  {
    key: 'staff-roles',
    path: ['Nhân viên', 'Phân quyền'],
    items: [
      { key: 'roles', label: 'Vai trò và quyền' },
      { key: 'staff-accounts', label: 'Tài khoản nhân viên' },
    ],
  },
  {
    key: 'staff-shifts',
    path: ['Nhân viên', 'Ca làm việc'],
    items: [
      { key: 'shift-schedule', label: 'Lịch ca' },
      { key: 'timesheet', label: 'Chấm công' },
    ],
  },
  {
    key: 'settings-payment',
    path: ['Cài đặt', 'Thanh toán'],
    items: [
      { key: 'payment-methods', label: 'Phương thức thanh toán' },
      { key: 'e-invoice', label: 'Hoá đơn điện tử' },
    ],
  },
]

/** Recently opened features, newest first. */
export const HISTORY: SearchModalItem[] = [
  { key: 'restaurant-account', label: 'Tài khoản và cài đặt' },
  { key: 'revenue-day', label: 'Doanh thu theo ngày' },
  { key: 'payment-methods', label: 'Phương thức thanh toán' },
  { key: 'table-map', label: 'Sơ đồ bàn' },
  { key: 'dish-list', label: 'Danh sách món ăn' },
  { key: 'roles', label: 'Vai trò và quyền' },
  { key: 'timesheet', label: 'Chấm công' },
  { key: 'stock-level', label: 'Tồn kho' },
  { key: 'e-invoice', label: 'Hoá đơn điện tử' },
]

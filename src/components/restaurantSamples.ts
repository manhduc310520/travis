export interface RestaurantRow {
  key: string
  index: number
  posId: string
  name: string
  city: string
  address: string
  phone: string
  email: string
  /** Shown as dd/MM/yyyy. */
  licence: string
  /** ISO date, for sorting. */
  licenceIso: string
  status: 'active' | 'paused'
}

const ROWS: Omit<RestaurantRow, 'key' | 'index'>[] = [
  { posId: 'POS-1042', name: 'Gà rán 365 Lê Lợi', city: 'TP. Hồ Chí Minh', address: '12 Lê Lợi, Quận 1', phone: '028 3822 1042', email: 'leloi@garan365.vn', licence: '31/12/2026', licenceIso: '2026-12-31', status: 'active' },
  { posId: 'POS-1043', name: 'Bánh mì kẹp thịt Sài Gòn', city: 'TP. Hồ Chí Minh', address: '88 Nguyễn Trãi, Quận 5', phone: '028 3855 1043', email: 'nguyentrai@banhmisg.vn', licence: '30/06/2026', licenceIso: '2026-06-30', status: 'active' },
  { posId: 'POS-1044', name: 'Sushi hải sản tươi', city: 'Hà Nội', address: '5 Tràng Tiền, Hoàn Kiếm', phone: '024 3936 1044', email: 'trangtien@sushituoi.vn', licence: '15/03/2026', licenceIso: '2026-03-15', status: 'paused' },
  { posId: 'POS-1045', name: 'Phở bò Hàng Trống', city: 'Hà Nội', address: '21 Hàng Trống, Hoàn Kiếm', phone: '024 3828 1045', email: 'hangtrong@phobo.vn', licence: '01/09/2027', licenceIso: '2027-09-01', status: 'active' },
  { posId: 'POS-1046', name: 'Cơm tấm Sông Hàn', city: 'Đà Nẵng', address: '140 Bạch Đằng, Hải Châu', phone: '0236 382 1046', email: 'bachdang@comtam.vn', licence: '20/11/2026', licenceIso: '2026-11-20', status: 'active' },
  { posId: 'POS-1047', name: 'Lẩu nấm Mỹ Khê', city: 'Đà Nẵng', address: '7 Võ Nguyên Giáp, Sơn Trà', phone: '0236 394 1047', email: 'mykhe@launam.vn', licence: '05/02/2026', licenceIso: '2026-02-05', status: 'paused' },
]

export const sampleRows: RestaurantRow[] = ROWS.map((r, i) => ({ ...r, key: r.posId, index: i + 1 }))

/** Enough rows to page (the table shows 10 per page). */
export const manyRows: RestaurantRow[] = Array.from({ length: 24 }, (_, i) => {
  const base = ROWS[i % ROWS.length]
  const n = 1042 + i
  return { ...base, key: `POS-${n}`, posId: `POS-${n}`, index: i + 1, name: i < ROWS.length ? base.name : `${base.name} ${Math.floor(i / ROWS.length) + 1}` }
})

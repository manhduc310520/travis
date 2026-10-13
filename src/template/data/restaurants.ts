// Demo data shared by the restaurant list / form / detail templates (replace with the app's API).

export type LicenseStatus = 'active' | 'processing' | 'expiring' | 'inactive';

export interface Restaurant {
  key: string;
  posId: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  licenseUntil: string;
  status: LicenseStatus;
}

/** License status → DS Tag colour (status presets) and Vietnamese label */
export const LICENSE_STATUS: Record<LicenseStatus, { label: string; color: 'success' | 'processing' | 'warning' | 'default' }> = {
  active: { label: 'Còn hạn', color: 'success' },
  processing: { label: 'Đang xử lý', color: 'processing' },
  expiring: { label: 'Sắp hết hạn', color: 'warning' },
  inactive: { label: 'Chưa kích hoạt', color: 'default' },
};

export const CITIES = [
  { value: 'HCM', label: 'TP. Hồ Chí Minh' },
  { value: 'HN', label: 'Hà Nội' },
  { value: 'DN', label: 'Đà Nẵng' },
  { value: 'CT', label: 'Cần Thơ' },
];

export const BANKS = ['Vietcombank', 'Techcombank', 'BIDV', 'VietinBank', 'MB Bank', 'ACB'].map((b) => ({ value: b, label: b }));

const NAMES = ['Ga ran 365', 'Gà rán 24h', 'Trà sữa Phố', 'Bún chả Hà Nội', 'Cơm tấm Sài Gòn', 'Phở Thìn', 'Lẩu Nấm', 'Bánh mì 37', 'Cafe Sáng', 'Pizza Nhà', 'Sushi Mini', 'Kem Tràng Tiền'];
const STREETS = ['12 Lê Lợi', '45 Nguyễn Huệ', '7 Hai Bà Trưng', '88 Trần Hưng Đạo', '21 Pasteur', '3 Lý Tự Trọng'];
const EMAILS = ['sophia.miller', 'liam.brown', 'isabella.davis', 'noah.thomas', 'mia.clark', 'ethan.johnson', 'ava.wilson', 'olivia.moore'];
const STATUSES: LicenseStatus[] = ['active', 'processing', 'processing', 'expiring', 'processing', 'expiring', 'processing', 'inactive'];

export const RESTAURANTS: Restaurant[] = Array.from({ length: 24 }, (_, i) => ({
  key: String(i + 1),
  posId: `C26M${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(66 + ((i * 7) % 24))}`,
  name: NAMES[i % NAMES.length] + (i >= NAMES.length ? ` ${Math.floor(i / NAMES.length) + 1}` : ''),
  city: CITIES[i % 3 === 2 ? 1 : 0].value,
  address: `${STREETS[i % STREETS.length]}, Quận ${(i % 10) + 1}`,
  phone: `0392${String(580912 + i).padStart(6, '0')}`,
  email: `${EMAILS[i % EMAILS.length]}@gmail.com`,
  licenseUntil: new Date(2026, 2, 14, Math.floor(i / 4), 15 + (i % 4) * 15).toISOString(),
  status: STATUSES[i % STATUSES.length],
}));

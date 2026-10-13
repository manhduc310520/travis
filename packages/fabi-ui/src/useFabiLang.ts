// Language of the texts the FABi components draw themselves ("Quay lại", "Xoá bộ lọc", "Chưa có dữ liệu"…).
// FABi CMS is Vietnamese, so Vietnamese by default; English when the app gives FabiProvider / ConfigProvider an
// English antd locale (the English Storybook docs do).
import { ConfigProvider } from 'antd'
import { useContext } from 'react'

export type FabiLang = 'vi' | 'en'

export function useFabiLang(): FabiLang {
  const { locale } = useContext(ConfigProvider.ConfigContext)
  return locale?.locale?.startsWith('en') ? 'en' : 'vi'
}

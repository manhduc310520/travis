// Page templates built on the AppShell (Dashboard has its own file). Copy the folder of a template into the app.
import type { Meta, StoryObj } from '@storybook/react-vite'
import RestaurantList from './restaurant-list/RestaurantList'
import RestaurantForm from './restaurant-form/RestaurantForm'
import DetailPage from './detail-page/DetailPage'
import Login from './login/Login'
import ErrorPage from './error-page/ErrorPage'

const meta: Meta = {
  title: 'Template/Pages',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

/** Danh sách nhà hàng: bộ lọc, chọn cột, bảng, phân trang; Tiện ích → Đồng bộ màn hình phụ */
export const List: Story = { name: 'Restaurant list', render: () => <RestaurantList /> }
/** Danh sách rỗng: "Chưa có dữ liệu" + Tạo nhà hàng */
export const ListEmpty: Story = { name: 'Restaurant list: empty', render: () => <RestaurantList data={[]} /> }
/** Không có kết quả: "Không tìm thấy dữ liệu" + Xoá tìm kiếm và bộ lọc */
export const ListNoMatch: Story = { name: 'Restaurant list: no match', render: () => <RestaurantList initialQuery="23332d" /> }
/** Tạo nhà hàng: Thông tin chi tiết / Thiết bị / Cấu hình nâng cao; Lưu lại sau khi có thay đổi */
export const Form: Story = { name: 'Create restaurant', render: () => <RestaurantForm /> }
/** Chi tiết nhà hàng: trạng thái, thông tin, lịch sử thay đổi */
export const Detail: Story = { name: 'Restaurant detail', render: () => <DetailPage /> }
/** Đăng nhập */
export const SignIn: Story = { name: 'Login', render: () => <Login /> }
export const NotFound: Story = { name: 'Error 404', render: () => <ErrorPage status="404" /> }
export const Forbidden: Story = { name: 'Error 403', render: () => <ErrorPage status="403" /> }
export const ServerError: Story = { name: 'Error 500', render: () => <ErrorPage status="500" /> }

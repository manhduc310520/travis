// Error pages (403 / 404 / 500) inside the AppShell: antd Result with Vietnamese text and the way out
// (one primary action back to "Trang chủ", a secondary one where it helps).
import React from 'react';
import { Button, Layout, Result, theme } from '@fabi/ui';
import AppShell from '../shell/AppShell';

export type ErrorStatus = '403' | '404' | '500';

const TEXT: Record<ErrorStatus, { title: string; subTitle: string; secondary?: string }> = {
  '403': { title: 'Bạn không có quyền truy cập', subTitle: 'Tài khoản của bạn chưa được cấp quyền xem trang này. Hãy liên hệ quản trị viên của nhà hàng.' },
  '404': { title: 'Không tìm thấy trang', subTitle: 'Trang bạn tìm không tồn tại hoặc đã được chuyển đi.', secondary: 'Tìm tính năng' },
  '500': { title: 'Đã có lỗi xảy ra', subTitle: 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút.', secondary: 'Thử lại' },
};

const ErrorPage: React.FC<{ status?: ErrorStatus }> = ({ status = '404' }) => {
  const { token } = theme.useToken();
  const t = TEXT[status];
  return (
    <AppShell selected="">
      <Layout.Content style={{ padding: token.padding, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Result
          status={status}
          title={t.title}
          subTitle={t.subTitle}
          extra={[
            t.secondary && <Button key="secondary">{t.secondary}</Button>,
            <Button key="home" type="primary">Về trang chủ</Button>,
          ]}
        />
      </Layout.Content>
    </AppShell>
  );
};

export default ErrorPage;

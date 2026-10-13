// Login: outside the AppShell. Brand gradient behind a centred Card (logo, phone / email, password, remember,
// "Quên mật khẩu?", one primary "Đăng nhập"); full width on phones. Vietnamese locale for the field messages.
import React, { useState } from 'react';
import { Button, Card, Checkbox, ConfigProvider, Flex, Form, Input, Typography, theme } from '@fabi/ui';
import { Lock01Line, User01Line } from '@fabi/ui/fabi-icons';
import viVN from '@fabi/ui/locale/vi_VN';
import { LogoWordmark } from '../shell/artwork';

interface LoginForm {
  account: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);
  return (
    <ConfigProvider locale={viVN}>
      <Flex
        align="center"
        justify="center"
        style={{
          minHeight: '100vh',
          padding: token.padding,
          background: `linear-gradient(180deg, ${token.colorPrimaryActive} 0%, ${token.colorPrimary} 100%)`,
        }}
      >
        <Card style={{ width: '100%', maxWidth: 400, boxShadow: token.boxShadow }} styles={{ body: { padding: token.paddingLG } }}>
          <Flex vertical align="center" gap="small" style={{ marginBottom: token.marginLG }}>
            <span style={{ color: token.colorPrimary }}>
              <LogoWordmark />
            </span>
            <Typography.Title level={1} style={{ margin: 0, fontSize: token.fontSizeHeading4, lineHeight: token.lineHeightHeading4 }}>Đăng nhập FABi CMS</Typography.Title>
          </Flex>
          <Form<LoginForm>
            layout="vertical"
            requiredMark={false}
            initialValues={{ remember: true }}
            onFinish={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 800);
            }}
          >
            <Form.Item name="account" label="Số điện thoại hoặc email" rules={[{ required: true }]}>
              <Input size="large" prefix={<User01Line />} autoComplete="username" placeholder="0901 234 567" />
            </Form.Item>
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
              <Input.Password size="large" prefix={<Lock01Line />} autoComplete="current-password" />
            </Form.Item>
            <Flex justify="space-between" align="center" style={{ marginBottom: token.marginLG }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <Typography.Link>Quên mật khẩu?</Typography.Link>
            </Flex>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Đăng nhập
            </Button>
          </Form>
        </Card>
      </Flex>
    </ConfigProvider>
  );
};

export default Login;

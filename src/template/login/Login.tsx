// Login: outside the AppShell, as in the design. A restaurant photo with a brand tint fills the page; a centred
// Card holds the iPOS.vn logo, the "Đăng nhập" title (h1), "Tài khoản" / "Mật khẩu", the two actions ("Đăng
// nhập bằng mã" default, "Đăng nhập" primary), the sign-up line and "Quên mật khẩu". A dark pill at the bottom
// holds "Hướng dẫn", the hotline and the language menu. Phones: the two actions stack (primary first), the
// language button shows the flag only and the pill's gaps close (the text buttons' padding keeps the labels
// apart). Vietnamese locale for the field messages. Assets: ./assets (from the design).
import React, { useState } from 'react';
import { Button, Card, ConfigProvider, Dropdown, Flex, Form, Input, Typography, theme } from '@fabi/ui';
import type { MenuProps } from '@fabi/ui';
import { ChevronDownLine, EyeLine, EyeOffLine } from '@fabi/ui/fabi-icons';
import viVN from '@fabi/ui/locale/vi_VN';
import { FlagVietnam } from '../shell/artwork';
import { useIsPhone } from '../shell/AppShell';
import background from './assets/login-background.jpg';
import logo from './assets/logo-ipos.svg';

interface LoginForm {
  account: string;
  password: string;
}

// Values from the design that have no token: the photo's crop (the image overflows the page by these
// percentages, so it is framed tighter than plain "cover") and the pill behind the bottom actions (black 60%:
// white text stays ≥ 4.5:1 even over the lightest part of the photo).
const PHOTO_INSET = '-13.86% -8.28%';
const PILL_BACKGROUND = 'rgba(0, 0, 0, 0.6)';
const PILL_RADIUS = 9999;
// the design's form column: 370 wide inside the 32px card padding
const FORM_WIDTH = 370;

const LANGUAGES: NonNullable<MenuProps['items']> = [
  { key: 'vi', icon: <FlagVietnam />, label: 'Tiếng Việt' },
  { key: 'en', label: 'English' },
];

const Login: React.FC = () => {
  const { token } = theme.useToken();
  const isPhone = useIsPhone();
  const [loading, setLoading] = useState(false);
  // the bottom pill (48 tall) sits marginXL above the bottom; the card keeps that much room above and below,
  // so it stays centred on the page as in the design and never runs under the pill
  const pillRoom = token.controlHeight + token.paddingXS * 2 + token.marginXL * 2;

  return (
    <ConfigProvider locale={viVN}>
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: token.colorBgLayout }}>
        {/* the photo and its brand tint (decorative) */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: PHOTO_INSET,
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          aria-hidden
          style={{ position: 'absolute', inset: 0, background: `color-mix(in srgb, ${token.colorPrimaryActive} 40%, transparent)` }}
        />

        <Flex
          component="main"
          align="center"
          justify="center"
          style={{ position: 'relative', boxSizing: 'border-box', minHeight: '100vh', padding: `${pillRoom}px ${token.padding}px` }}
        >
          <Card
            variant="borderless"
            style={{ width: '100%', maxWidth: FORM_WIDTH + token.paddingXL * 2, boxShadow: token.boxShadowTertiary }}
            styles={{ body: { padding: isPhone ? token.paddingLG : token.paddingXL } }}
          >
            <Flex vertical gap={token.marginXL}>
              <Flex vertical align="center">
                <img src={logo} alt="iPOS.vn" width={124} height={40} style={{ display: 'block' }} />
                <Typography.Title
                  level={1}
                  style={{
                    margin: 0,
                    padding: `${token.paddingLG}px 0 ${token.paddingXXS}px`,
                    fontSize: token.fontSizeHeading3,
                    lineHeight: token.lineHeightHeading3,
                  }}
                >
                  Đăng nhập
                </Typography.Title>
              </Flex>

              <Form<LoginForm>
                layout="vertical"
                requiredMark={false}
                onFinish={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 800);
                }}
              >
                <Form.Item name="account" label="Tài khoản" rules={[{ required: true }]} style={{ marginBottom: token.marginSM }}>
                  <Input size="large" autoComplete="username" placeholder="Nhập tài khoản" />
                </Form.Item>
                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]} style={{ marginBottom: token.marginLG }}>
                  <Input.Password
                    size="large"
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu"
                    iconRender={(visible) => (visible ? <EyeLine /> : <EyeOffLine />)}
                  />
                </Form.Item>

                <Flex vertical gap={token.margin}>
                  <Flex vertical={isPhone} gap={token.marginSM}>
                    {isPhone ? (
                      <>
                        <Button type="primary" htmlType="submit" size="large" block loading={loading}>Đăng nhập</Button>
                        <Button size="large" block>Đăng nhập bằng mã</Button>
                      </>
                    ) : (
                      <>
                        <Button size="large" style={{ flex: '1 1 0', minWidth: 0 }}>Đăng nhập bằng mã</Button>
                        <Button type="primary" htmlType="submit" size="large" style={{ flex: '1 1 0', minWidth: 0 }} loading={loading}>Đăng nhập</Button>
                      </>
                    )}
                  </Flex>
                  <Flex vertical align="center" gap={token.marginXS}>
                    <Flex wrap align="center" justify="center" gap={token.marginXXS}>
                      <Typography.Text type="secondary">Bạn chưa có tài khoản hệ thống iPOS?</Typography.Text>
                      <Button type="link" size="small" href="https://fabi.ipos.vn/register" target="_blank" rel="noreferrer">
                        Đăng ký
                      </Button>
                    </Flex>
                    <Button type="link" size="small">Quên mật khẩu</Button>
                  </Flex>
                </Flex>
              </Form>
            </Flex>
          </Card>
        </Flex>

        {/* fixed dark area: the dark theme, as in the app header */}
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <Flex
            component="footer"
            align="center"
            gap={isPhone ? 0 : token.marginMD}
            style={{
              position: 'absolute',
              bottom: token.marginXL,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: `${token.paddingXS}px ${isPhone ? token.paddingXS : token.paddingLG}px`,
              borderRadius: PILL_RADIUS,
              background: PILL_BACKGROUND,
              whiteSpace: 'nowrap',
            }}
          >
            <Button type="text">Hướng dẫn</Button>
            <Button type="text" href="tel:19006444">Hỗ trợ 1900 6444</Button>
            <Dropdown menu={{ items: LANGUAGES, selectable: true, defaultSelectedKeys: ['vi'] }} placement="top" trigger={['click']}>
              <Button type="text" aria-label={isPhone ? 'Ngôn ngữ: Tiếng việt' : undefined}>
                <Flex align="center" gap={token.marginXS}>
                  <FlagVietnam />
                  {!isPhone && 'Tiếng việt'}
                  <ChevronDownLine />
                </Flex>
              </Button>
            </Dropdown>
          </Flex>
        </ConfigProvider>
      </div>
    </ConfigProvider>
  );
};

export default Login;

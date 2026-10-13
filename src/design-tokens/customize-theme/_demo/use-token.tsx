import React from 'react';
import { Flex, Typography, theme } from '@fabi/ui';

// sample texts in the docs language (Language toolbar)
const TEXT = {
  vi: {
    title: 'Khuyến mãi tháng 10',
    body: 'Màu nền, viền, chữ và bo góc lấy từ token, nên đổi brand hay Dark mode là khối này đổi theo.',
  },
  en: {
    title: 'October promotion',
    body: 'Background, border, text colour and radius come from tokens, so this block follows the brand and Dark mode.',
  },
};

/** Your own block in theme colours: read the tokens, never paste hex values */
const App: React.FC<{ lang?: keyof typeof TEXT }> = ({ lang = 'vi' }) => {
  const { token } = theme.useToken();
  const t = TEXT[lang];
  return (
    <Flex
      vertical
      gap="small"
      style={{
        padding: token.padding,
        background: token.colorPrimaryBg,
        border: `${token.lineWidth}px solid ${token.colorPrimaryBorder}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Typography.Text strong style={{ color: token.colorPrimaryText }}>{t.title}</Typography.Text>
      <Typography.Text>{t.body}</Typography.Text>
    </Flex>
  );
};

export default App;

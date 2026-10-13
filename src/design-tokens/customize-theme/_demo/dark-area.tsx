import React from 'react';
import { Button, FabiProvider, Flex, Typography, theme } from '@fabi/ui';

// sample texts in the docs language (Language toolbar)
const TEXT = {
  vi: { page: 'Theo trang', area: 'Vùng tối', save: 'Lưu', cancel: 'Huỷ' },
  en: { page: 'Page mode', area: 'Dark area', save: 'Save', cancel: 'Cancel' },
};
type Lang = keyof typeof TEXT;

/** A dark area (e.g. the buttons on the app header): its own tokens come from the nested FabiProvider */
const DarkPanel: React.FC<{ lang: Lang }> = ({ lang }) => {
  const { token } = theme.useToken();
  const t = TEXT[lang];
  return (
    <Flex gap="small" align="center" wrap style={{ padding: token.padding, background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}>
      <Typography.Text>{t.area}</Typography.Text>
      <Button type="primary">{t.save}</Button>
      <Button>{t.cancel}</Button>
    </Flex>
  );
};

const App: React.FC<{ lang?: Lang }> = ({ lang = 'vi' }) => (
  <Flex vertical gap="middle">
    <Flex gap="small" align="center">
      <Typography.Text>{TEXT[lang].page}</Typography.Text>
      <Button type="primary">{TEXT[lang].save}</Button>
    </Flex>
    {/* same brand as the page, Dark mode only inside */}
    <FabiProvider mode="dark">
      <DarkPanel lang={lang} />
    </FabiProvider>
  </Flex>
);

export default App;

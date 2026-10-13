import React, { useState } from 'react';
import { BRANDS, Button, FabiProvider, Flex, Input, Segmented, Select, Switch, Tag, Typography, theme } from '@fabi/ui';
import type { BrandKey, FabiMode } from '@fabi/ui';

// sample texts in the docs language (Language toolbar)
const TEXT = {
  vi: { save: 'Lưu', cancel: 'Huỷ', details: 'Xem chi tiết', dish: 'Tên món', onSale: 'Đang bán' },
  en: { save: 'Save', cancel: 'Cancel', details: 'View details', dish: 'Dish name', onSale: 'On sale' },
};
type Lang = keyof typeof TEXT;

/** What the chosen theme looks like: a few common components on the page surface */
const Preview: React.FC<{ lang: Lang }> = ({ lang }) => {
  const { token } = theme.useToken();
  const t = TEXT[lang];
  return (
    <Flex vertical gap="middle" style={{ padding: token.padding, background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}>
      <Flex gap="small" wrap>
        <Button type="primary">{t.save}</Button>
        <Button>{t.cancel}</Button>
        <Typography.Link>{t.details}</Typography.Link>
      </Flex>
      <Flex gap="small" wrap align="center">
        <Input placeholder={t.dish} aria-label={t.dish} style={{ maxWidth: 240 }} />
        <Switch defaultChecked aria-label={t.onSale} />
        <Tag color="processing">{t.onSale}</Tag>
      </Flex>
    </Flex>
  );
};

const App: React.FC<{ lang?: Lang }> = ({ lang = 'vi' }) => {
  const [brand, setBrand] = useState<BrandKey>('geekblue');
  const [mode, setMode] = useState<FabiMode>('light');
  const [compact, setCompact] = useState(false);
  return (
    <Flex vertical gap="middle">
      <Flex gap="middle" wrap align="center">
        <Select
          aria-label="Brand"
          value={brand}
          onChange={setBrand}
          options={Object.entries(BRANDS).map(([key, b]) => ({ value: key, label: b.name }))}
          style={{ width: 160 }}
        />
        <Segmented<FabiMode>
          options={[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ]}
          value={mode}
          onChange={setMode}
        />
        <Flex gap="small" align="center">
          <Switch checked={compact} onChange={setCompact} aria-label="Compact" />
          <Typography.Text>Compact</Typography.Text>
        </Flex>
      </Flex>
      {/* the whole app: one FabiProvider at the root; changing a prop switches the theme */}
      <FabiProvider brand={brand} mode={mode} theme={compact ? { algorithm: theme.compactAlgorithm } : {}}>
        <Preview lang={lang} />
      </FabiProvider>
    </Flex>
  );
};

export default App;

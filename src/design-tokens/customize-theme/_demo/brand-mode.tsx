import React, { useState } from 'react';
import { BRANDS, Button, FabiProvider, Flex, Input, Segmented, Select, Switch, Tag, Typography, theme } from '@fabi/ui';
import type { BrandKey, FabiMode } from '@fabi/ui';

/** What the chosen theme looks like: a few common components on the page surface */
const Preview: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <Flex vertical gap="middle" style={{ padding: token.padding, background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}>
      <Flex gap="small" wrap>
        <Button type="primary">Lưu</Button>
        <Button>Huỷ</Button>
        <Typography.Link>Xem chi tiết</Typography.Link>
      </Flex>
      <Flex gap="small" wrap align="center">
        <Input placeholder="Tên món" aria-label="Tên món" style={{ maxWidth: 240 }} />
        <Switch defaultChecked aria-label="Đang bán" />
        <Tag color="processing">Đang bán</Tag>
      </Flex>
    </Flex>
  );
};

const App: React.FC = () => {
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
        <Preview />
      </FabiProvider>
    </Flex>
  );
};

export default App;

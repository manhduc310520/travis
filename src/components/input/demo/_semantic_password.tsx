import React from 'react';
import { EditOutlined, UserOutlined } from '@fabi/ui/icons';
import { Input } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'root element',
    input: 'input element',
    prefix: 'prefix element',
    suffix: 'suffix element',
    clear: 'clear button element',
    count: 'count element',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Input.Password"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'prefix', desc: locale.prefix },
        { name: 'input', desc: locale.input },
        { name: 'suffix', desc: locale.suffix },
        { name: 'clear', desc: locale.clear, version: '6.4.0' },
        { name: 'count', desc: locale.count },
      ]}
    >
      <Input.Password aria-label="Password"
        allowClear
        showCount
        prefix={<UserOutlined />}
        suffix={<EditOutlined />}
        defaultValue="Hello, FABi CMS"
      />
    </SemanticPreview>
  );
};

export default App;

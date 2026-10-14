import React from 'react';
import { Layout } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const { Sider } = Layout;

const locales = {
  en: {
    root: 'Root element with Sider layout, theme, width and collapsed state styles',
    body: 'Body element that wraps Sider children layout and display styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Layout.Sider"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'body', desc: locale.body },
      ]}
    >
      <Sider styles={{ body: { minHeight: 96 } }}>Sider</Sider>
    </SemanticPreview>
  );
};

export default App;

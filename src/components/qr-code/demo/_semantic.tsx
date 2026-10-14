import React from 'react';
import { QRCode } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element, set flex layout, padding, background color, border, border radius and relative positioning styles',
    cover:
      'Cover element, set absolute positioning, z-index, background color and loading state overlay styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  const value = 'https://example.com';
  return (
    <SemanticPreview
      componentName="QRCode"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'cover', desc: locale.cover },
      ]}
    >
      <QRCode aria-label="QR code" value={value} status="loading" />
    </SemanticPreview>
  );
};

export default App;

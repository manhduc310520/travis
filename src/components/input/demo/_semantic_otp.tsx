import React from 'react';
import { Input } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element, set inline flex layout, alignment, column gap and wrapper styles',
    input: 'Input element, set text center, padding and number input styles',
    separator: 'Separator element, set separator display styles between OTP input boxes',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Input.OTP"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'input', desc: locale.input },
        { name: 'separator', desc: locale.separator },
      ]}
    >
      <Input.OTP aria-label="One-time code" separator="-" />
    </SemanticPreview>
  );
};

export default App;

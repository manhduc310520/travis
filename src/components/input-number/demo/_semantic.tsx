import React from 'react';
import { InputNumber } from '@fabi/ui';
import type { InputNumberProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element, sets inline-block layout, width, border radius and reset styles',
    input: 'Input element, sets font, line height, text input and interaction styles',
    prefix: 'Prefix wrapper element, sets flex layout, alignment and right margin styles',
    suffix: 'Suffix wrapper element, sets flex layout, margin and transition animation styles',
    action:
      'Single action button element, sets button styling, hover effects and click interactions',
    actions:
      'Actions element, sets absolute positioning, width, flex layout and number adjustment button styles',
  },
};

const Block: React.FC<InputNumberProps> = (props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <InputNumber aria-label="Number"
        prefix="₫"
        suffix="RMB"
        defaultValue={100}
        style={{ width: 200 }}
        styles={{ actions: { opacity: 1, width: 24 }, suffix: { marginInlineEnd: 28 } }}
        {...props}
      />
      <InputNumber aria-label="Number"
        defaultValue={100}
        style={{ width: 200 }}
        styles={{ actions: { opacity: 1, width: 24 }, suffix: { marginInlineEnd: 28 } }}
        mode="spinner"
        {...props}
      />
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="InputNumber"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'prefix', desc: locale.prefix },
        { name: 'input', desc: locale.input },
        { name: 'suffix', desc: locale.suffix },
        { name: 'actions', desc: locale.actions },
        { name: 'action', desc: locale.action },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;

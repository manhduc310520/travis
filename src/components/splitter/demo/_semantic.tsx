import React from 'react';
import { Splitter } from '@fabi/ui';
import type { SplitterProps } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';
import { Desc } from './size';

const locales = {
  en: {
    root: 'Root element with flex layout, width and height, alignment and stretch styles',
    panel: 'Panel element with flex basis, grow ratio and panel container styles',
    dragger:
      'Drag control element with absolute positioning, user selection, z-index, center alignment, background color, hover and active states styles',
  },
};

const Block: React.FC<Readonly<SplitterProps>> = (props) => {
  return (
    <Splitter
      {...props}
      style={{ height: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
      classNames={{ ...props.classNames, dragger: { default: 'semantic-mark-dragger' } }}
    >
      <Splitter.Panel>
        <Desc text="First" />
      </Splitter.Panel>
      <Splitter.Panel>
        <Desc text="Second" />
      </Splitter.Panel>
    </Splitter>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Splitter"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'panel', desc: locale.panel, version: '6.0.0' },
        { name: 'dragger', desc: locale.dragger, version: '6.0.0' },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;

import React from 'react';
import type { CollapseProps } from '@fabi/ui';
import { Collapse } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import { useToken } from '../../theme/internal';

const locales = {
  en: {
    root: 'Root element with border, border-radius, background color and container styles that control the overall layout and appearance of collapse panels',
    header:
      'Header element with flex layout, padding, color, line-height, cursor style, transition animations and other interactive styles for panel headers',
    title:
      'Title element with flex auto layout and margin styles for title text layout and typography',
    body: 'Body element with padding, color, background color and other styles for panel content area display',
    icon: 'Icon element with font size, transition animations, rotation transforms and other styles and animations for expand/collapse arrows',
  },
};

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'This is panel header',
    children: <p>This is panel body</p>,
  },
];

const BlockCollapse: React.FC<CollapseProps> = (props) => {
  const [, token] = useToken();
  return (
    <div style={{ position: 'absolute', inset: 0, margin: token.marginXL }}>
      <Collapse {...props} items={items} defaultActiveKey={['1']} />
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Collapse"
      itemsAPI="items"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'header', desc: locale.header, version: '5.21.0' },
        { name: 'icon', desc: locale.icon, version: '6.0.0' },
        { name: 'title', desc: locale.title, version: '6.0.0' },
        { name: 'body', desc: locale.body, version: '5.21.0' },
      ]}
    >
      <BlockCollapse />
    </SemanticPreview>
  );
};

export default App;

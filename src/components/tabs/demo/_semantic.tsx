import React from 'react';
import { Tabs } from '@fabi/ui';
import type { TabsProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with basic tab container styles, layout and direction control',
    item: 'Item element with relative positioning, padding, colors, text ellipsis, border-radius, transitions and other tab item styles and interactive effects',
    remove:
      'Remove button element with editable tab close button size, color, hover state and other interactive feedback styles',
    header:
      'Header element with tab navigation header layout, background, borders and other styles',
    indicator:
      'Indicator element with indicator bar color, position, dimensions, transitions and other active state indication styles',
    body: 'Body element with tab panel container layout, animation and size control styles',
    content:
      'Content element with single tab panel layout, padding and other content display styles',
    'popup.root':
      'Popup menu element with dropdown absolute positioning, z-index, display control, max-height, scrolling and other styles',
  },
};

const Block: React.FC<Readonly<TabsProps>> = (props) => {
  return (
    <Tabs
      {...props}
      defaultActiveKey="1"
      type="editable-card"
      style={{ height: 220, width: '100%' }}
      styles={{
        popup: {
          root: { background: '#fff' },
        },
        indicator: { visibility: 'visible' },
      }}
      items={Array.from({ length: 30 }, (_, i) => {
        const id = String(i);
        return {
          label: `Tab-${id}`,
          key: id,
          disabled: i === 28,
          children: `Content of tab ${id}`,
        };
      })}
    />
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Tabs"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'header', desc: locale.header },
        { name: 'item', desc: locale.item },
        { name: 'remove', desc: locale.remove, version: '6.4.0' },
        { name: 'indicator', desc: locale.indicator },
        { name: 'body', desc: locale.body },
        { name: 'content', desc: locale.content },
        { name: 'popup.root', desc: locale['popup.root'] },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;

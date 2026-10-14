import React from 'react';
import { Button, Descriptions, Divider, Switch } from '@fabi/ui';
import type { DescriptionsProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    toggleBorder: 'Toggle Border',
    root: 'Root element with basic styles, reset styles, border styles, layout direction and other overall styles for description list container',
    header:
      'Header element with flex layout, alignment, bottom margin and other layout and style controls for header area',
    title:
      'Title element with text ellipsis, flex ratio, color, font weight, font size, line height and other title text styles',
    extra:
      'Extra content element with left margin, color, font size and other styles for additional operation area',
    label:
      'Label element with color, font weight, font size, line height, text align, colon styles and other label text styles',
    content:
      'Content element with table cell layout, color, font size, line height, word break and other content display styles',
  },
};

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Telephone',
    children: '1810000000',
  },
];

const BlockList: React.FC<React.PropsWithChildren<DescriptionsProps>> = (props) => {
  const { children, ...rest } = props;
  const divRef = React.useRef<HTMLDivElement>(null);
  const [bordered, setBordered] = React.useState(false);
  const [locale] = useLocale(locales);
  return (
    <div ref={divRef} style={{ width: '100%', height: '100%' }}>
      <Switch aria-label={locale.toggleBorder} checked={bordered} onChange={setBordered} />
      {locale.toggleBorder}
      <Divider />
      <Descriptions
        title="User Info"
        items={items}
        extra={<Button type="primary">Edit</Button>}
        bordered={bordered}
        {...rest}
      >
        {children}
      </Descriptions>
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Descriptions"
      semantics={[
        { name: 'root', desc: locale.root, version: '5.23.0' },
        { name: 'header', desc: locale.header, version: '5.23.0' },
        { name: 'title', desc: locale.title, version: '5.23.0' },
        { name: 'extra', desc: locale.extra, version: '5.23.0' },
        { name: 'label', desc: locale.label, version: '5.23.0' },
        { name: 'content', desc: locale.content, version: '5.23.0' },
      ]}
    >
      <BlockList />
    </SemanticPreview>
  );
};

export default App;

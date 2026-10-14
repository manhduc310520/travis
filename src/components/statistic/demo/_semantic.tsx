import React from 'react';
import { ArrowUpOutlined } from '@fabi/ui/icons';
import { Statistic } from '@fabi/ui';
import type { StatisticProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with reset styles and overall container styles for statistic component',
    header: 'Header element with bottom padding and title area layout styles',
    title: 'Title element with text color, font size and other title text display styles',
    content:
      'Content element with layout and alignment styles for the prefix, value and suffix area',
    value:
      'Value element with text color, font size, font family and other statistic number display styles',
    prefix:
      'Prefix element with inline-block display, right margin and other prefix content layout styles',
    suffix:
      'Suffix element with inline-block display, left margin and other suffix content layout styles',
  },
};

const BlockList: React.FC<StatisticProps> = (props) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={divRef} style={{ position: 'absolute' }}>
      <Statistic
        title="Active"
        value={11.28}
        precision={2}
        styles={{
          content: {
            color: '#3f8600',
            fontSize: 24,
          },
          value: {
            color: '#e11b1b',
            fontSize: 32,
            paddingInline: 8,
          },
        }}
        prefix={<ArrowUpOutlined />}
        suffix="%"
        {...props}
      />
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Statistic"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'header', desc: locale.header, version: '6.0.0' },
        { name: 'title', desc: locale.title, version: '6.0.0' },
        { name: 'prefix', desc: locale.prefix, version: '6.0.0' },
        { name: 'content', desc: locale.content, version: '6.0.0' },
        { name: 'value', desc: locale.value, version: '6.4.0' },
        { name: 'suffix', desc: locale.suffix, version: '6.0.0' },
      ]}
    >
      <BlockList />
    </SemanticPreview>
  );
};

export default App;

import React from 'react';
import { Transfer } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with flex layout, transfer container base styles and layout control',
    section:
      'Section element with flex layout, width, height, min height, border, border radius and other single-side transfer container styles',
    'source.section':
      'Source section element, only applies to left transfer section container styles',
    'target.section':
      'Target section element, only applies to right transfer section container styles',
    'source.header': 'Source header element, only applies to left header area styles',
    'target.header': 'Target header element, only applies to right header area styles',
    'source.title': 'Source title element, only applies to left title text styles',
    'target.title': 'Target title element, only applies to right title text styles',
    'source.body': 'Source body element, only applies to left list body styles',
    'target.body': 'Target body element, only applies to right list body styles',
    'source.list': 'Source list element, only applies to left list content styles',
    'target.list': 'Target list element, only applies to right list content styles',
    'source.item': 'Source item element, only applies to left list item styles',
    'target.item': 'Target item element, only applies to right list item styles',
    'source.itemIcon': 'Source item icon element, only applies to left icon styles',
    'target.itemIcon': 'Target item icon element, only applies to right icon styles',
    'source.itemContent': 'Source item content element, only applies to left text content styles',
    'target.itemContent': 'Target item content element, only applies to right text content styles',
    'source.footer': 'Source footer element, only applies to left footer area styles',
    'target.footer': 'Target footer element, only applies to right footer area styles',
    header:
      'Header element with flex layout, alignment, height, padding, color, background color, bottom border, border radius and other header area styles',
    title:
      'Title element with text ellipsis, flex ratio, text alignment, auto left margin and other title text layout and styles',
    body: 'Body element with list main area container styles and layout control',
    list: 'List element with list content styles, layout and scroll control',
    item: 'List item element with relative positioning, padding, border, hover state, selected state, disabled state and other list item interaction styles',
    itemIcon: 'List item icon element with checkbox and other icon styles and interaction states',
    itemContent:
      'List item content element with text ellipsis, padding and other list item text content display styles',
    footer: 'Footer element with bottom operation area styles and layout',
    actions: 'Actions element with transfer button group styles, layout and interaction states',
  },
};

const mockData = Array.from({ length: 20 }).map((_, i) => ({
  key: i,
  title: `content ${i + 1}`,
}));

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Transfer"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'section', desc: locale.section },
        { name: 'source.section', desc: locale['source.section'], version: '6.4.0' },
        { name: 'target.section', desc: locale['target.section'], version: '6.4.0' },
        { name: 'source.header', desc: locale['source.header'], version: '6.4.0' },
        { name: 'target.header', desc: locale['target.header'], version: '6.4.0' },
        { name: 'source.title', desc: locale['source.title'], version: '6.4.0' },
        { name: 'target.title', desc: locale['target.title'], version: '6.4.0' },
        { name: 'source.body', desc: locale['source.body'], version: '6.4.0' },
        { name: 'target.body', desc: locale['target.body'], version: '6.4.0' },
        { name: 'source.list', desc: locale['source.list'], version: '6.4.0' },
        { name: 'target.list', desc: locale['target.list'], version: '6.4.0' },
        { name: 'source.item', desc: locale['source.item'], version: '6.4.0' },
        { name: 'target.item', desc: locale['target.item'], version: '6.4.0' },
        { name: 'source.itemIcon', desc: locale['source.itemIcon'], version: '6.4.0' },
        { name: 'target.itemIcon', desc: locale['target.itemIcon'], version: '6.4.0' },
        { name: 'source.itemContent', desc: locale['source.itemContent'], version: '6.4.0' },
        { name: 'target.itemContent', desc: locale['target.itemContent'], version: '6.4.0' },
        { name: 'source.footer', desc: locale['source.footer'], version: '6.4.0' },
        { name: 'target.footer', desc: locale['target.footer'], version: '6.4.0' },
        { name: 'header', desc: locale.header },
        { name: 'title', desc: locale.title },
        { name: 'body', desc: locale.body },
        { name: 'list', desc: locale.list },
        { name: 'item', desc: locale.item },
        { name: 'itemIcon', desc: locale.itemIcon },
        { name: 'itemContent', desc: locale.itemContent },
        { name: 'footer', desc: locale.footer },
        { name: 'actions', desc: locale.actions },
      ]}
    >
      <Transfer
        showSearch
        titles={['Source', 'Target']}
        dataSource={mockData}
        selectedKeys={[]}
        targetKeys={[3, 9]}
        render={(item) => item.title}
        footer={() => <div style={{ padding: 8 }}>Custom Footer</div>}
        styles={{
          section: {
            height: 250,
            width: 200,
          },
          source: {
            section: {
              backgroundColor: '#fff7e6',
            },
          },
          target: {
            section: {
              backgroundColor: '#e6f7ff',
            },
          },
        }}
      />
    </SemanticPreview>
  );
};

export default App;

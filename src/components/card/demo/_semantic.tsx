import React from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@fabi/ui/icons';
import { Avatar, Card } from '@fabi/ui';
import type { CardProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const { Meta } = Card;

const locales = {
  en: {
    root: 'Card root element with positioning, background, border, border-radius, box-shadow, padding and other container styles',
    header:
      'Card header area with flex layout, min-height, padding, text color, font-weight, font-size, background, bottom border and top border-radius',
    body: 'Card content area with padding, font-size and other content display styles',
    extra:
      'Card extra operation area in top-right corner with text color and layout styles for additional content',
    title:
      'Card title with inline-block display, flex-grow, text ellipsis and other title display styles',
    actions:
      'Card bottom action group with flex layout, list-style reset, background, top border and bottom border-radius for action buttons container',
    cover: 'Title cover with styles for cover image display and layout',
  },
};

const BlockCard: React.FC<React.PropsWithChildren<CardProps>> = (props) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={divRef} style={{ position: 'absolute' }}>
      <Card
        {...props}
        title="Card title"
        extra="More"
        style={{ width: 300 }}
        cover={
          <img
            draggable={false}
            alt="example"
            src="/mock-assets/photo-12.svg"
          />
        }
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      />
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Card"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'header', desc: locale.header, version: '5.14.0' },
        { name: 'title', desc: locale.title, version: '5.14.0' },
        { name: 'extra', desc: locale.extra, version: '5.14.0' },
        { name: 'cover', desc: locale.cover, version: '5.14.0' },
        { name: 'body', desc: locale.body, version: '5.14.0' },
        { name: 'actions', desc: locale.actions, version: '5.14.0' },
      ]}
    >
      <BlockCard>
        <Meta
          avatar={<Avatar alt="Avatar" src="/mock-assets/avatar-9.svg" />}
          title="Card Meta title"
          description="This is the description"
        />
      </BlockCard>
    </SemanticPreview>
  );
};

export default App;

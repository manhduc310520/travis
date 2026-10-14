import React from 'react';
import { Button, Empty, Typography } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element, sets text alignment, font and line height styles',
    image: 'Image element, sets height, opacity, margin and image styles',
    description: 'Description element, sets text color styles',
    footer: 'Footer element, sets top margin and action button styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Empty"
      semantics={[
        { name: 'root', desc: locale.root, version: '5.23.0' },
        { name: 'image', desc: locale.image, version: '5.23.0' },
        { name: 'description', desc: locale.description, version: '5.23.0' },
        { name: 'footer', desc: locale.footer, version: '5.23.0' },
      ]}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        styles={{ image: { height: 60 } }}
        description={
          <Typography.Text>
            Customize <a href="#api">Description</a>
          </Typography.Text>
        }
      >
        <Button type="primary">Create Now</Button>
      </Empty>
    </SemanticPreview>
  );
};

export default App;

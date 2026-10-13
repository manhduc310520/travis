import React from 'react';
import { CloseCircleOutlined, DeleteOutlined } from '@fabi/ui/icons';
import { Flex, Tag } from '@fabi/ui';

const preventDefault = (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault();
  console.log('Clicked! But prevent default.');
};

const App: React.FC = () => (
  <Flex gap="small" align="center" wrap>
    <Tag>Tag 1</Tag>
    <Tag>
      <a
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="FABi CMS issue"
      >
        Link
      </a>
    </Tag>
    <Tag closeIcon onClose={preventDefault}>
      Prevent Default
    </Tag>
    <Tag closeIcon={<CloseCircleOutlined />} onClose={console.log}>
      Tag 2
    </Tag>
    <Tag
      closable={{
        closeIcon: <DeleteOutlined />,
        'aria-label': 'Close Button',
      }}
      onClose={console.log}
    >
      Tag 3
    </Tag>
  </Flex>
);

export default App;

import React from 'react';
import { CloseCircleOutlined } from '@fabi/ui/icons';
import { Flex, Tag } from '@fabi/ui';

const App: React.FC = () => (
  <Flex gap="small" align="center" wrap>
    <Tag closable closeIcon="Close">
      Tag1
    </Tag>
    <Tag closable closeIcon={<CloseCircleOutlined />}>
      Tag2
    </Tag>
  </Flex>
);

export default App;

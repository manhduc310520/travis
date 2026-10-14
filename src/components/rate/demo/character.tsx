import React from 'react';
import { HeartOutlined } from '@fabi/ui/icons';
import { Flex, Rate } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Rate character={<HeartOutlined />} allowHalf />
    <Rate character="A" allowHalf style={{ fontSize: 36 }} />
    <Rate character="A" allowHalf />
  </Flex>
);

export default App;

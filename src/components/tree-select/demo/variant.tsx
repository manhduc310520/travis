import React from 'react';
import { Flex, TreeSelect } from '@fabi/ui';

const style: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
};

const App: React.FC = () => {
  return (
    <Flex vertical gap="medium">
      <TreeSelect aria-label="Please select" style={style} placeholder="Please select" variant="borderless" />
      <TreeSelect aria-label="Please select" style={style} placeholder="Please select" variant="filled" />
      <TreeSelect aria-label="Please select" style={style} placeholder="Please select" variant="outlined" />
      <TreeSelect aria-label="Please select" style={style} placeholder="Please select" variant="underlined" />
    </Flex>
  );
};

export default App;

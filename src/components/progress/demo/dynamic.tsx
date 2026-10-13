import React, { useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@fabi/ui/icons';
import { Button, Flex, Progress, Space } from '@fabi/ui';

const App: React.FC = () => {
  const [percent, setPercent] = useState<number>(0);

  const increase = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent + 10;
      if (newPercent > 100) {
        return 100;
      }
      return newPercent;
    });
  };

  const decline = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent - 10;
      if (newPercent < 0) {
        return 0;
      }
      return newPercent;
    });
  };

  return (
    <Flex vertical gap="small">
      <Flex vertical gap="small">
        <Progress aria-label="Progress" percent={percent} type="line" />
        <Progress aria-label="Progress" percent={percent} type="circle" />
      </Flex>
      <Space.Compact>
        <Button onClick={decline} icon={<MinusOutlined />} />
        <Button onClick={increase} icon={<PlusOutlined />} />
      </Space.Compact>
    </Flex>
  );
};

export default App;

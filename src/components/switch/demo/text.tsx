import React from 'react';
import { CheckOutlined, CloseOutlined, FrownOutlined, SmileOutlined } from '@fabi/ui/icons';
import { Flex, Switch } from '@fabi/ui';

const Demo: React.FC = () => (
  <Flex gap="medium" align="flex-start" justify="flex-start" vertical>
    <Switch aria-label="Switch" checkedChildren="On" unCheckedChildren="Off" defaultChecked />
    <Switch aria-label="Switch" checkedChildren={1} unCheckedChildren={0} defaultChecked />
    <Switch aria-label="Switch"
      defaultChecked
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
    />
    <Switch aria-label="Switch"
      defaultChecked
      checkedChildren={
        <Flex gap={4} justify="flex-start" align="center">
          <SmileOutlined />
          Happy
        </Flex>
      }
      unCheckedChildren={
        <Flex gap={4} justify="flex-start" align="center">
          <FrownOutlined />
          Sad
        </Flex>
      }
    />
  </Flex>
);

export default Demo;

import React, { useState } from 'react';
import { MoonOutlined, SunOutlined } from '@fabi/ui/icons';
import { Flex, Segmented } from '@fabi/ui';
import type { SegmentedProps } from '@fabi/ui';

type SizeType = NonNullable<SegmentedProps['size']>;

const Demo: React.FC = () => {
  const [size, setSize] = useState<SizeType>('medium');
  return (
    <Flex gap="small" align="flex-start" vertical>
      <Segmented<SizeType> options={['small', 'medium', 'large']} value={size} onChange={setSize} />
      <Segmented
        size={size}
        shape="round"
        options={[
          { value: 'light', icon: <SunOutlined /> },
          { value: 'dark', icon: <MoonOutlined /> },
        ]}
      />
    </Flex>
  );
};

export default Demo;

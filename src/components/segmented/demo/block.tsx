import React from 'react';
import { Segmented } from '@fabi/ui';

const Demo: React.FC = () => (
  <Segmented<string | number> options={[123, 456, 'longtext-longtext-longtext-longtext']} block />
);

export default Demo;

import React from 'react';
import { Segmented } from '@fabi/ui';

const Demo: React.FC = () => (
  <Segmented<string> options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} name="group" />
);

export default Demo;

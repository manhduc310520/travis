import React from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@fabi/ui/icons';
import { InputNumber } from '@fabi/ui';

const App: React.FC = () => (
  <InputNumber aria-label="Number" controls={{ upIcon: <ArrowUpOutlined />, downIcon: <ArrowDownOutlined /> }} />
);

export default App;

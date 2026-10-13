import React from 'react';
import { Typography } from '@fabi/ui';

const { Title } = Typography;

const App: React.FC = () => (
  <>
    <Title>h1. FABi CMS</Title>
    <Title level={2}>h2. FABi CMS</Title>
    <Title level={3}>h3. FABi CMS</Title>
    <Title level={4}>h4. FABi CMS</Title>
    <Title level={5}>h5. FABi CMS</Title>
  </>
);

export default App;

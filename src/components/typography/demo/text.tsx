import React from 'react';
import { Space, Typography } from '@fabi/ui';

const { Text, Link } = Typography;

const App: React.FC = () => (
  <Space vertical>
    <Text>FABi CMS (default)</Text>
    <Text type="secondary">FABi CMS (secondary)</Text>
    <Text type="success">FABi CMS (success)</Text>
    <Text type="warning">FABi CMS (warning)</Text>
    <Text type="danger">FABi CMS (danger)</Text>
    <Text disabled>FABi CMS (disabled)</Text>
    <Text mark>FABi CMS (mark)</Text>
    <Text code>FABi CMS (code)</Text>
    <Text keyboard>FABi CMS (keyboard)</Text>
    <Text underline>FABi CMS (underline)</Text>
    <Text delete>FABi CMS (delete)</Text>
    <Text strong>FABi CMS (strong)</Text>
    <Text italic>FABi CMS (italic)</Text>
    <Link href="https://example.com" target="_blank">
      FABi CMS (Link)
    </Link>
  </Space>
);

export default App;

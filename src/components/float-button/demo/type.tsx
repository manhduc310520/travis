import React from 'react';
import { QuestionCircleOutlined } from '@fabi/ui/icons';
import { FloatButton } from '@fabi/ui';

const App: React.FC = () => (
  <>
    <FloatButton icon={<QuestionCircleOutlined />} type="primary" style={{ insetInlineEnd: 24 }} />
    <FloatButton icon={<QuestionCircleOutlined />} type="default" style={{ insetInlineEnd: 94 }} />
  </>
);

export default App;

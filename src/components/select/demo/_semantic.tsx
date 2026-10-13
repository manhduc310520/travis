import React from 'react';
import { Select } from '@fabi/ui';

import SelectSemanticTemplate from '../../../_dumi/theme/common/SelectSemanticTemplate';

const App: React.FC = () => {
  return (
    <SelectSemanticTemplate
      component={Select}
      componentName="Select"
      prefix="prefix"
      defaultValue="aojunhao123"
      style={{ width: 300 }}
      multipleProps={{ mode: 'multiple', defaultValue: ['aojunhao123'] }}
      options={[
        { value: 'aojunhao123', label: 'aojunhao123' },
        { value: 'thinkasany', label: 'thinkasany' },
        { value: 'meet-student', label: 'meet-student' },
      ]}
    />
  );
};

export default App;

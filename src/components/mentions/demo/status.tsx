import React from 'react';
import { Mentions, Space } from '@fabi/ui';
import type { GetProp, MentionProps } from '@fabi/ui';

type MentionsOptionProps = GetProp<MentionProps, 'options'>[number];

const onChange = (value: string) => {
  console.log('Change:', value);
};

const onSelect = (option: MentionsOptionProps) => {
  console.log('select', option);
};

const App: React.FC = () => {
  const options = [
    {
      value: 'afc163',
      label: 'afc163',
    },
    {
      value: 'zombieJ',
      label: 'zombieJ',
    },
    {
      value: 'yesmeck',
      label: 'yesmeck',
    },
  ];

  return (
    <Space vertical>
      <Mentions aria-label="Mention"
        onChange={onChange}
        onSelect={onSelect}
        defaultValue="@afc163"
        status="error"
        options={options}
      />
      <Mentions aria-label="Mention"
        onChange={onChange}
        onSelect={onSelect}
        defaultValue="@afc163"
        status="warning"
        options={options}
      />
    </Space>
  );
};

export default App;

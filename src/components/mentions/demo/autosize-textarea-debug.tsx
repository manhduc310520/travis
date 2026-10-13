import React from 'react';
import { Flex, Mentions } from '@fabi/ui';
import type { GetProp, MentionProps } from '@fabi/ui';

type MentionsOptionProps = GetProp<MentionProps, 'options'>[number];

const onChange = (value: string) => {
  console.log('Change:', value);
};

const onSelect = (option: MentionsOptionProps) => {
  console.log('select', option);
};

const App: React.FC = () => (
  <Flex vertical gap={32}>
    <Mentions aria-label="can resize"
      onChange={onChange}
      onSelect={onSelect}
      placeholder="can resize"
      options={[
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
      ]}
    />
    <Mentions aria-label="disable resize"
      onChange={onChange}
      onSelect={onSelect}
      placeholder="disable resize"
      style={{ resize: 'none' }}
      options={[
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
      ]}
    />
  </Flex>
);

export default App;

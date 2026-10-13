import React from 'react';
import { AutoComplete, Flex } from '@fabi/ui';
import type { AutoCompleteProps, GetProp } from '@fabi/ui';
import { createStaticStyles } from '@fabi/ui/style';

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    border-radius: 4px;
  `,
}));

const stylesObject: AutoCompleteProps['styles'] = {
  popup: {
    root: { borderWidth: 1, borderColor: '#0958d9' },
    list: { backgroundColor: 'rgba(240,240,240, 0.85)' },
    listItem: { color: '#272727' },
  },
};

const stylesFn: AutoCompleteProps['styles'] = ({
  props,
}): GetProp<AutoCompleteProps, 'styles', 'Return'> => {
  if (props.variant === 'filled') {
    return {
      popup: {
        root: { borderWidth: 1, borderColor: '#ccc' },
        list: { backgroundColor: 'rgba(240,240,240, 0.85)' },
        listItem: { color: '#272727' },
      },
    };
  }
  return {};
};

const options: AutoCompleteProps['options'] = [
  { value: 'Burnaby' },
  { value: 'Seattle' },
  { value: 'Los Angeles' },
  { value: 'San Francisco' },
  { value: 'Meet student' },
];

const App: React.FC = () => {
  const sharedProps: AutoCompleteProps = {
    options,
    classNames: {
      root: classNames.root,
    },
    style: { width: 200 },
  };

  return (
    <Flex vertical gap="medium">
      <AutoComplete aria-label="object styles" {...sharedProps} placeholder="object styles" styles={stylesObject} />
      <AutoComplete aria-label="function styles"
        {...sharedProps}
        variant="filled"
        placeholder="function styles"
        styles={stylesFn}
      />
    </Flex>
  );
};

export default App;

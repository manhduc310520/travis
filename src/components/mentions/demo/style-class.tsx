import React from 'react';
import { Flex, Mentions } from '@fabi/ui';
import type { GetProp, MentionsProps } from '@fabi/ui';
import { createStyles } from '@fabi/ui/style';

const useStyles = createStyles(({ token }) => ({
  root: {
    border: `${token.lineWidth}px ${token.lineType} ${token.colorPrimary}`,
    borderRadius: token.borderRadiusLG,
    width: 300,
  },
}));

const options: MentionsProps['options'] = [
  { value: 'afc163', label: 'afc163' },
  { value: 'zombieJ', label: 'zombieJ' },
  { value: 'meet-student', label: 'meet-student' },
  { value: 'thinkasany', label: 'thinkasany' },
];

const stylesObject: MentionsProps['styles'] = {
  textarea: {
    fontSize: 14,
    resize: 'vertical',
    fontWeight: 200,
  },
};

const stylesFunction: MentionsProps['styles'] = (
  info,
): GetProp<MentionsProps, 'styles', 'Return'> => {
  if (info.props.variant === 'filled') {
    return {
      root: {
        border: '1px solid #722ed1',
      },
      popup: {
        border: '1px solid #722ed1',
      },
    };
  }
};

const App: React.FC = () => {
  const { styles: classNames } = useStyles();

  const sharedProps: MentionsProps = {
    options,
    classNames,
  };

  return (
    <Flex vertical gap="medium">
      <Mentions aria-label="Object" {...sharedProps} styles={stylesObject} placeholder="Object" rows={2} />
      <Mentions aria-label="Function" {...sharedProps} styles={stylesFunction} variant="filled" placeholder="Function" />
    </Flex>
  );
};

export default App;
